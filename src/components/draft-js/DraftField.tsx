import React, {useState} from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    ContentState,
    CompositeDecorator,
    convertFromHTML,
    ContentBlock,
    Modifier
} from "draft-js";
import Button from "@mui/material/Button";
import {ButtonGroup} from "@mui/material";
import Box from "@mui/material/Box";
import {stateToHTML} from 'draft-js-export-html';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import AddLinkRoundedIcon from '@mui/icons-material/AddLinkRounded';
import LinkOffRoundedIcon from '@mui/icons-material/LinkOffRounded';

const DraftField = (props: any) => {
    const blocksFromHTML = convertFromHTML(props.editorText);

    const content = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
    );

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(content)
    );

    const handleEditorChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
        setExitHtml(newEditorState);
    };

    const setExitHtml = (newEditorState: EditorState) => {
        const contentState = newEditorState.getCurrentContent();
        const html = stateToHTML(contentState);
        props.returnFunction(html);
    }

    const handleInlineStyle = (style: string) => {
        const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
        handleEditorChange(newEditorState);
    };

    const handleBlockType = (blockType: string) => {
        const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
        handleEditorChange(newEditorState);
    };

    const handleLinkClick = () => {
        const url = window.prompt('Enter a URL:');
        if (!url) {
            return;
        }

        const selection = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const currentContent = contentState.getBlockForKey(selection.getStartKey());
        const selectedText = currentContent.getText().slice(selection.getStartOffset(), selection.getEndOffset());

        generateLink(url, selectedText);
    };

    const linkDecorator = () => {
        const findLinkEntities = (
            contentBlock: ContentBlock,
            callback: (start: number, end: number) => void,
            contentState: ContentState
        ) => {
            contentBlock.findEntityRanges((character) => {
                const entityKey = character.getEntity();
                return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
            }, callback);
        };

        const Link = (props: any) => {
            const {url, linkText} = props.contentState.getEntity(props.entityKey).getData();

            return (
                <a style={{color: '#006cb7', textDecoration: 'underline'}} href={url}>
                    {linkText || props.children}
                </a>
            );
        };

        return new CompositeDecorator([
            {
                strategy: findLinkEntities,
                component: Link,
            },
        ]);
    };

    function generateLink(link: string, linkDisplayText: string) {
        const decorator = linkDecorator();

        const currentContent = editorState.getCurrentContent();

        currentContent.createEntity(
            'LINK',
            'MUTABLE',
            {
                url: link,
                target: '_blank',
            },
        );

        const entityKey = currentContent.getLastCreatedEntityKey();

        const selection = editorState.getSelection();

        const textWithEntity = Modifier.replaceText(
            currentContent,
            selection,
            linkDisplayText,
            editorState.getCurrentInlineStyle(),
            entityKey
        );

        const newState = EditorState.createWithContent(textWithEntity, decorator);

        handleEditorChange(newState);
    }

    function removeLink() {
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(selection.getStartKey());
            const linkKey = blockWithLinkAtBeginning.getEntityAt(selection.getStartOffset());

            if (linkKey) {
                const newContentState = Modifier.applyEntity(
                    contentState,
                    selection,
                    null
                );

                const newEditorState = EditorState.push(editorState, newContentState, 'apply-entity');

                handleEditorChange(newEditorState);
            }
        }
    }

    return (
        <Box sx={{
            border: '1px solid lightgray',
            borderRadius: '5px'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                p: 2,
                pb: 1,
                background: '#f1f1f1',
                borderBottom: '1px solid lightgray'
            }}>
                <ButtonGroup size={'small'} sx={{mb: 1, mr: 1}}>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("header-one")}>
                        H1
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("header-two")}>H2</Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("header-three")}>H3</Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("header-four")}>H4</Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("header-five")}>H5</Button>
                </ButtonGroup>

                <ButtonGroup size={'small'} sx={{mb: 1, mr: 1}}>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("blockquote")}>
                        <FormatQuoteRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("unordered-list-item")}>
                        <FormatListBulletedRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleBlockType("ordered-list-item")}>
                        <FormatListNumberedRoundedIcon/>
                    </Button>
                </ButtonGroup>

                <ButtonGroup size={'small'} sx={{mb: 1, mr: 1}}>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleInlineStyle("BOLD")}>
                        <FormatBoldRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleInlineStyle("ITALIC")}>
                        <FormatItalicRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleInlineStyle("UNDERLINE")}>
                        <FormatUnderlinedRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={() => handleInlineStyle("CODE")}>Monospace</Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={handleLinkClick}>
                        <AddLinkRoundedIcon/>
                    </Button>
                    <Button variant={'contained'} color={'primary'}
                            onClick={removeLink}>
                        <LinkOffRoundedIcon/>
                    </Button>
                </ButtonGroup>
            </Box>
            <Box sx={{
                p: 2,
            }}>
                <Editor
                    editorState={editorState}
                    onChange={handleEditorChange}
                />
            </Box>
        </Box>
    );
};

export default DraftField;
