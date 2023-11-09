import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {CircularProgress, Grid, MenuItem, Paper, TextField} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {Category} from "../../models/category";
import ImageUpload from "../../components/dropzone/ImageUpload";
import Divider from "@mui/material/Divider";
import DraftField from "../../components/draft-js/DraftField";
// @ts-ignore
import diacritics from "diacritics";

const CategoryForm = (props: any) => {
    const {id} = useParams();
    const [level, setLevel] = useState(0);
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [order, setOrder] = useState(99);
    const [enable, setEnable] = useState(false);
    const [meta_title, setMetaTitle] = useState('');
    const [meta_description, setMetaDescription] = useState('');
    const [index, setIndex] = useState('none');
    const [redirect, setRedirect] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('categories');

                setCategories(data);
            }
        )();

        if (id) {
            (
                async () => {
                    const {data} = await axios.get(`categories/${id}`);

                    setLevel(data.level);
                    setTitle(data.title);
                    setLink(data.link);
                    setImage(data.image);
                    if (data.description !== null) {
                        setDescription(data.description);
                    }
                    setOrder(data.order);
                    setEnable(data.enable);
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

    const setTitleAndLink = (inputString: string) => {
        setTitle(inputString);
        const stringWithoutDiacritics = diacritics.remove(inputString);

        const sanitizedString = stringWithoutDiacritics
            .replace(/[^\w\s-]/g, '')  // Remove non-alphanumeric characters except spaces and hyphens
            .trim()                 // Trim leading and trailing spaces
            .replace(/\s+/g, '-')    // Replace spaces with hyphens
            .toLowerCase();          // Convert to lowercase

        setLink(sanitizedString);
    }

    const imageField = () => {
        if (image) {
            return (
                <>
                    <img src={'http://localhost:8010/images/' + image} alt={'preview'} loading={'lazy'} height={'200px'}
                         className={'mb-3'}/>
                    <Button type={'button'}
                            color={'error'}
                            variant="contained"
                            onClick={(e) => removeImage(e)}
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

    const removeImage = async (e: SyntheticEvent) => {
        e.preventDefault()

        await axios.post(`file/destroy`, {'filename': image})
            .then(response => {
                setImage('');
            })
            .catch(error => {
                console.error('Error while sending a file remove request:', error);
            });
    }

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault()

        const data = {
            level,
            title,
            link,
            description,
            order,
            image,
            enable,
            meta_title,
            meta_description,
            index
        };

        if (id) {
            await axios.put(`categories/${id}`, data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        } else {
            await axios.post('categories/store', data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        }
    }

    if (redirect) {
        return <Navigate to={'/categories'}/>
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
                                {id ? "Edit category" : "Add new category"}
                            </Typography>

                            <Box component="form" onSubmit={submit} sx={{mt: 1, width: '100%'}}>
                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           value={level.toString()}
                                           label="Select category level"
                                           onChange={e => setLevel(parseInt(e.target.value))}
                                >
                                    <MenuItem value={'0'}>Main</MenuItem>
                                    {categories.map((category) => {
                                        const items = [];
                                        items.push(
                                            <MenuItem key={category.id} value={category.id.toString()}>-
                                                - {category.title}</MenuItem>
                                        );
                                        category.subcategories.forEach((subcategory) => {
                                            items.push(
                                                <MenuItem key={subcategory.id} value={subcategory.id.toString()}>- - -
                                                    - {subcategory.title}</MenuItem>
                                            );
                                        });
                                        return items;
                                    })}
                                </TextField>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField label={'Title'}
                                                   value={title}
                                                   margin="normal"
                                                   required
                                                   fullWidth
                                                   onChange={e => setTitleAndLink(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField label={'Link'}
                                                   value={link}
                                                   margin="normal"
                                                   required
                                                   disabled={true}
                                                   fullWidth
                                        />
                                    </Grid>
                                </Grid>

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
                                           label="Is the category enabled?"
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
