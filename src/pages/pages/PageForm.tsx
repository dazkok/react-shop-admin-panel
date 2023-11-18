import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {CircularProgress, Grid, MenuItem, Paper, TextField} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ImageUpload from "../../components/dropzone/ImageUpload";
import removeImage from "../../components/dropzone/RemoveImage";
import Divider from "@mui/material/Divider";
import DraftField from "../../components/draft-js/DraftField";
import {Page} from "../../models/page";
import TextToLinkField from "../../components/form-components/TextToLinkField";

const CategoryForm = (props: any) => {
    const {id} = useParams();
    const [level, setLevel] = useState(0);
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [position, setPosition] = useState('');
    const [type, setType] = useState('');
    const [enable, setEnable] = useState(false);
    const [order, setOrder] = useState(99);
    const [meta_title, setMetaTitle] = useState('');
    const [meta_description, setMetaDescription] = useState('');
    const [index, setIndex] = useState('none');
    const [redirect, setRedirect] = useState(false);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('pages/leveled');

                setPages(data);
            }
        )();

        if (id) {
            (
                async () => {
                    const {data} = await axios.get(`pages/${id}`);

                    setLevel(data.level);
                    setTitle(data.title);
                    setImage(data.image);
                    if (data.description !== null) {
                        setDescription(data.description);
                    }
                    setPosition(data.position);
                    setType(data.type);
                    setLink(data.link);
                    setEnable(data.enable);
                    setOrder(data.order);
                    setMetaTitle(data.meta_title);
                    setMetaDescription(data.meta_description);
                    setIndex(data.index);

                    setLoading(false);
                }
            )()
        } else {
            setLoading(false);
        }
    }, []);

    const imageField = () => {
        if (image) {
            return (
                <>
                    <img src={'http://localhost:8010/images/' + image} alt={'preview'} loading={'lazy'} height={'200px'}
                         className={'mb-3'}/>
                    <Button type={'button'}
                            color={'error'}
                            variant="contained"
                            onClick={(e) => removeImage(e, image, setImage)}
                            sx={{ml: 3}}
                    >Remove</Button>
                </>
            )
        } else {
            return <ImageUpload maxFiles={1} handleImageUpload={handleImageUpload}/>;
        }
    }
    const handleImageUpload = (uploadedFilesNames: string[]) => {
        setImage(uploadedFilesNames[0]);
    }

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault()

        const data = {
            level,
            title,
            link,
            position,
            type,
            description,
            order,
            image,
            enable,
            meta_title,
            meta_description,
            index
        };

        if (id) {
            await axios.put(`pages/${id}`, data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        } else {
            await axios.post('pages/store', data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        }
    }

    if (redirect) {
        return <Navigate to={'/pages'}/>
    }

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {loading ? (
                        <CircularProgress color="success" />
                    ) : (
                        <Paper className={'text-start'}
                               sx={{py: 3, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                            <Typography component="h2" variant="h5">
                                {id ? "Edit page" : "Add new page"}
                            </Typography>

                            <Box component="form" onSubmit={submit} sx={{mt: 1, width: '100%'}}>
                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={level.toString()}
                                           label="Select page level"
                                           onChange={e => setLevel(parseInt(e.target.value))}
                                >
                                    <MenuItem value={'0'}>Main</MenuItem>
                                    {pages.map((page) => {
                                        const items = [];
                                        items.push(
                                            <MenuItem key={page.id} value={page.id.toString()}>-
                                                - {page.title}</MenuItem>
                                        );
                                        page.subpages.forEach((subpage) => {
                                            items.push(
                                                <MenuItem key={subpage.id} value={subpage.id.toString()}>- - -
                                                    - {subpage.title}</MenuItem>
                                            );
                                        });
                                        return items;
                                    })}
                                </TextField>

                                <TextToLinkField
                                    text={title}
                                    setText={setTitle}
                                    textPlaceholder={'Title'}
                                    link={link}
                                    setLink={setLink}
                                />

                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={position}
                                           label="Page visible in"
                                           onChange={e => setPosition(e.target.value)}
                                >
                                    <MenuItem value={'header'}>Header</MenuItem>
                                    <MenuItem value={'footer'}>Footer</MenuItem>
                                    <MenuItem value={'header_footer'}>Header | Footer</MenuItem>
                                </TextField>

                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={type}
                                           label="Page type"
                                           onChange={e => setType(e.target.value)}
                                >
                                    <MenuItem value={'custom'}>Custom</MenuItem>
                                    <MenuItem value={'home'}>Home</MenuItem>
                                    <MenuItem value={'contact'}>Contact</MenuItem>
                                    <MenuItem value={'login'}>Login</MenuItem>
                                    <MenuItem value={'register'}>Register</MenuItem>
                                </TextField>

                                <div className={'text-start mt-3'}>Image:</div>
                                {imageField()}

                                <div className={'text-start mt-3'}>Description:</div>
                                {!loading && <DraftField editorText={description} returnFunction={setDescription}/>}

                                <TextField label={'Order'}
                                           type={'number'}
                                           value={order}
                                           margin="normal"
                                           required
                                           fullWidth
                                           onChange={e => setOrder(parseInt(e.target.value))}
                                />

                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={enable ? '1' : '0'}
                                           label="Is the page enabled?"
                                           onChange={e => setEnable(e.target.value === '1')}
                                >
                                    <MenuItem value={'1'}>Enabled</MenuItem>
                                    <MenuItem value={'0'}>Disabled</MenuItem>
                                </TextField>

                                <Divider sx={{my: 3}}/>

                                <TextField label={'Meta title'}
                                           value={meta_title}
                                           margin="normal"
                                           fullWidth
                                           inputProps={{
                                               maxLength: 70,
                                           }}
                                           onChange={e => setMetaTitle(e.target.value)}
                                />

                                <TextField margin="normal"
                                           fullWidth
                                           multiline
                                           label="Meta description"
                                           value={meta_description}
                                           inputProps={{
                                               maxLength: 160,
                                           }}
                                           onChange={e => setMetaDescription(e.target.value)}
                                />

                                <TextField label={'Page robots tag'}
                                           value={index}
                                           placeholder={'all | none | follow/nofollow | index/noindex | noarchive'}
                                           margin="normal"
                                           required
                                           fullWidth
                                           onChange={e => setIndex(e.target.value)}
                                />

                                <Button type="submit"
                                        fullWidth
                                        color={'primary'}
                                        variant="contained"
                                        sx={{mt: 3, mb: 2}}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Layout>
    );
};

export default CategoryForm;
