import React from 'react';
import {Page} from "../../models/page";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {ButtonGroup, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import VerticalSplitRoundedIcon from '@mui/icons-material/VerticalSplitRounded';
import BurstModeRoundedIcon from '@mui/icons-material/BurstModeRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';

const PageHeader = (props: { page: Page, deleteFunction: Function }) => {
    const boxStyle = {
        backgroundColor: props.page.enable ? 'white' : 'lightgray'
    }

    return (
        <Box sx={{
            ...boxStyle,
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            px: 2,
            py: 1,
            boxShadow: 1
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center'
            }}>
                <Box sx={{width: '50px'}}>
                    {props.page.order}
                </Box>

                <img src={'http://localhost:8010/images/' + props.page.image} alt={'preview'} width={'80px'}
                     height={'60px'} style={{objectFit: 'cover'}}/>

                <Typography sx={{ml: 3}}>
                    {props.page.level === 0 ? (
                        <b>{props.page.title}</b>
                    ) : (
                        props.page.title
                    )}
                </Typography>
            </Box>
            <ButtonGroup>
                <Tooltip title={'Edit'}>
                    <Button variant="outlined"
                            size={'small'} color={"primary"}
                            href={`/pages/${props.page.id}/edit`}>
                        <EditRoundedIcon/>
                    </Button>
                </Tooltip>

                {props.page.type === 'custom' ? (
                    <Tooltip title={'Page elements'}>
                        <Button variant="outlined"
                                size={'small'} color={"primary"}
                                href={`/elements/page-${props.page.id}`}>
                            <VerticalSplitRoundedIcon/>
                        </Button>
                    </Tooltip>
                ) : props.page.type === 'home' ? (
                    <>
                        <Tooltip title={'Slider elements'}>
                            <Button variant="outlined"
                                    size={'small'} color={"secondary"}
                                    href={`/elements/home-page-slider`}>
                                <BurstModeRoundedIcon/>
                            </Button>
                        </Tooltip>
                        <Tooltip title={'Advantages'}>
                            <Button variant="outlined"
                                    size={'small'} color={"secondary"}
                                    href={`/elements/home-advantages`}>
                                <FactCheckRoundedIcon/>
                            </Button>
                        </Tooltip>
                    </>
                ) : ''}

                <Tooltip title={'Delete'}>
                    <Button variant="outlined"
                            size={'small'} color={"error"}
                            onClick={() => props.deleteFunction(props.page.id)}
                    >
                        <DeleteRoundedIcon/>
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </Box>
    );
};

export default PageHeader;
