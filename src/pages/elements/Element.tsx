import React from 'react';
import {PageElement} from "../../models/element";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from '@mui/material/Grid';
import {ButtonGroup, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const ElementComponent = (props: { element: PageElement, deleteFunction: Function }) => {
    const boxStyle = {
        backgroundColor: props.element.enable ? 'white' : 'lightgray'
    }

    return (
        <Box sx={{...boxStyle, boxShadow: 3, py: 3, px: 2}}>
            <Box sx={{display: 'flex', justifyContent: 'end', mb: 2}}>
                <ButtonGroup>
                    <Tooltip title={'Edit'}>
                        <Button variant="outlined"
                                size={'small'} color={"primary"}
                                href={`/elements/${props.element.location}/${props.element.id}/edit`}>
                            <EditRoundedIcon/>
                        </Button>
                    </Tooltip>

                    <Tooltip title={'Delete'}>
                        <Button variant="outlined"
                                size={'small'} color={"error"}
                                onClick={() => props.deleteFunction(props.element.id)}
                        >
                            <DeleteRoundedIcon/>
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>

            {props.element.style === 'text' ? (
                <>
                    <Typography variant={'h4'} sx={{mb: 3}}>
                        {props.element.title}
                    </Typography>
                    <div dangerouslySetInnerHTML={{__html: props.element.text}}/>
                </>

            ) : props.element.style === 'image' ? (
                <img src={'http://localhost:8010/images/' + props.element.image} alt={'preview'} width={'100%'}
                     height={'auto'} style={{objectFit: 'contain'}}/>

            ) : props.element.style === 'text-image' ? (
                <Grid container spacing={3}>
                    <Grid item xs={6} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Typography variant={'h4'} sx={{mb: 3}}>
                            {props.element.title}
                        </Typography>
                        <div dangerouslySetInnerHTML={{__html: props.element.text}}/>
                    </Grid>
                    <Grid item xs={6}>
                        <img src={'http://localhost:8010/images/' + props.element.image} alt={'preview'} width={'100%'}
                             height={'auto'} style={{objectFit: 'contain'}}/>
                    </Grid>
                </Grid>

            ) : props.element.style === 'image-text' ? (
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <img src={'http://localhost:8010/images/' + props.element.image} alt={'preview'} width={'100%'}
                             height={'auto'} style={{objectFit: 'contain'}}/>
                    </Grid>
                    <Grid item xs={6} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <Typography variant={'h4'} sx={{mb: 3}}>
                            {props.element.title}
                        </Typography>
                        <div dangerouslySetInnerHTML={{__html: props.element.text}}/>
                    </Grid>
                </Grid>
            ) : props.element.style === 'custom' ? (
                <>
                    <Typography variant={'h4'} sx={{mb: 3}}>
                        {props.element.title}
                    </Typography>

                    <div dangerouslySetInnerHTML={{__html: props.element.text}}/>

                    <Button type={'button'} variant={'contained'} sx={{my: 3}}>{props.element.additional_field}</Button>
                    &nbsp; Link: {props.element.link}
                    <br/>
                    <img src={'http://localhost:8010/images/' + props.element.image} alt={'preview'} width={'auto'}
                         height={'auto'} style={{objectFit: 'contain', maxHeight: '400px', maxWidth: '100%'}}/>
                </>
            ) : props.element.style.startsWith('product-detail') ? (
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={5}>
                            <Box sx={{p: 1, backgroundColor: "#ececec", textAlign: "center"}}>
                                <b>{props.element.title}</b>
                            </Box>
                        </Grid>
                        <Grid item xs={5}>
                            <Box sx={{p: 1, backgroundColor: "#ececec", textAlign: "center"}}>
                                {props.element.additional_field}
                            </Box>
                        </Grid>
                    </Grid>
                </>
            ) : 'Style not found'}
        </Box>
    );
};

export default ElementComponent;
