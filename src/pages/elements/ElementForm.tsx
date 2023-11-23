import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import removeImage from "../../components/dropzone/RemoveImage";
import ImageUpload from "../../components/dropzone/ImageUpload";
import Grid from "@mui/material/Grid";
import {CircularProgress, MenuItem, TextField, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DraftField from "../../components/draft-js/DraftField";

const ElementForm = () => {
    const {location, id} = useParams();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [additional_field, setAdditionalField] = useState('');
    const [style, setStyle] = useState('');
    const [image, setImage] = useState('');
    const [link, setLink] = useState('');
    const [order, setOrder] = useState<number>();
    const [enable, setEnable] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const {data} = await axios.get(`element/${id}`);
                    setTitle(data.title);

                    if (data.text !== null) {
                        setText(data.text);
                    }

                    setAdditionalField(data.additional_field);
                    setStyle(data.style);
                    setImage(data.image);
                    setLink(data.link);
                    setOrder(data.order);
                    setEnable(data.enable);
                }

                setLoading(false);
            } catch (error: any) {
                console.error("Error fetching data:", error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const imageField = () => {
        if (image) {
            return (
                <>
                    <img src={'http://localhost:8010/images/' + image}
                         alt={'preview'}
                         loading={'lazy'} height={'auto'}
                         style={{maxWidth: '100%', objectFit: 'contain', maxHeight: '400px'}}
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
            location,
            title,
            text,
            additional_field,
            style,
            image,
            link,
            order,
            enable
        };

        if (id) {
            await axios.put(`element/${id}`, data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        } else {
            await axios.post('element/store', data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        }
    }

    if (redirect) {
        return <Navigate to={`/elements/${location}`}/>
    }

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {loading ? (
                        <CircularProgress color="success"/>
                    ) : (
                        <Paper className={'text-start'}
                               sx={{py: 3, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                            <Typography component="h2" variant="h5">
                                {id ? "Edit category" : "Add new category"}
                            </Typography>

                            <Box component="form" onSubmit={submit} sx={{mt: 1, width: '100%'}}>
                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={style}
                                           label="Style"
                                           onChange={e => setStyle(e.target.value)}
                                >
                                    <MenuItem value={'custom'}>Custom</MenuItem>
                                    <MenuItem value={'text'}>Text</MenuItem>
                                    <MenuItem value={'image'}>Image</MenuItem>
                                    <MenuItem value={'text-image'}>Text - Image</MenuItem>
                                    <MenuItem value={'image-text'}>Image - Text</MenuItem>
                                </TextField>

                                {style === 'text' ? (
                                    <>
                                        <TextField label={'Title'}
                                                   type={'text'}
                                                   value={title}
                                                   margin="normal"
                                                   fullWidth
                                                   onChange={e => setTitle(e.target.value)}
                                        />

                                        <div className={'text-start mt-3'}>Text:</div>
                                        {!loading && <DraftField editorText={text} returnFunction={setText}/>}
                                    </>

                                ) : style === 'image' ? (
                                    <>
                                        <div className={'text-start mt-3'}>Image:</div>
                                        {imageField()}
                                    </>

                                ) : style === 'text-image' ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <TextField label={'Title'}
                                                       type={'text'}
                                                       value={title}
                                                       margin="normal"
                                                       fullWidth
                                                       onChange={e => setTitle(e.target.value)}
                                            />

                                            <div className={'text-start mt-3'}>Text:</div>
                                            {!loading && <DraftField editorText={text} returnFunction={setText}/>}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <div className={'text-start mt-3'}>Image:</div>
                                            {imageField()}
                                        </Grid>
                                    </Grid>

                                ) : style === 'image-text' ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <div className={'text-start mt-3'}>Image:</div>
                                            {imageField()}
                                        </Grid>
                                        <Grid item xs={6} sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center'
                                        }}>
                                            <TextField label={'Title'}
                                                       type={'text'}
                                                       value={title}
                                                       margin="normal"
                                                       fullWidth
                                                       onChange={e => setTitle(e.target.value)}
                                            />

                                            <div className={'text-start mt-3'}>Text:</div>
                                            {!loading && <DraftField editorText={text} returnFunction={setText}/>}
                                        </Grid>
                                    </Grid>
                                ) : style === 'custom' ? (
                                    <>
                                        <TextField label={'Title'}
                                                   type={'text'}
                                                   value={title}
                                                   margin="normal"
                                                   fullWidth
                                                   onChange={e => setTitle(e.target.value)}
                                        />

                                        <div className={'text-start mt-3'}>Text:</div>
                                        {!loading && <DraftField editorText={text} returnFunction={setText}/>}

                                        <div className={'text-start mt-3'}>Image:</div>
                                        {imageField()}

                                        <TextField label={'Additional field'}
                                                   type={'text'}
                                                   value={additional_field}
                                                   margin="normal"
                                                   fullWidth
                                                   onChange={e => setAdditionalField(e.target.value)}
                                        />

                                        <TextField label={'Link'}
                                                   type={'text'}
                                                   value={link}
                                                   margin="normal"
                                                   fullWidth
                                                   onChange={e => setLink(e.target.value)}
                                        />
                                    </>
                                ) : 'Select style'}

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
                                           label="Is the element enabled?"
                                           onChange={e => setEnable(e.target.value === '1')}
                                >
                                    <MenuItem value={'1'}>Enabled</MenuItem>
                                    <MenuItem value={'0'}>Disabled</MenuItem>
                                </TextField>

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

export default ElementForm;
