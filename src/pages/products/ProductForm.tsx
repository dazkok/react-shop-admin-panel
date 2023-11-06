import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {CircularProgress, Grid, MenuItem, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {Navigate, useParams} from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DraftField from "../../components/draft-js/DraftField";
import Divider from "@mui/material/Divider";
import {Category} from "../../models/category";
import diacritics from "diacritics";
import ImageUpload from "../../components/dropzone/ImageUpload";
import {ProductImage} from "../../models/product-image";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import ProductImageFied from "./ProductImageField";

const ProductForm = (props: any) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category_id, setCategoryId] = useState(0);
    const [price, setPrice] = useState<number>();
    const [promo_price, setPromoPrice] = useState<number>();
    const [quantity, setQuantity] = useState(0);
    const [link, setLink] = useState('');
    const [order, setOrder] = useState(99);
    const [enable, setEnable] = useState(false);
    const [meta_title, setMetaTitle] = useState('');
    const [meta_description, setMetaDescription] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const [redirect, setRedirect] = useState(false);

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
                    const {data} = await axios.get(`products/${id}`);

                    setTitle(data.title);
                    setDescription(data.description);
                    if (data.category_id !== null) {
                        setCategoryId(data.category_id);
                    } else {
                        setCategoryId(0)
                    }
                    setPrice(data.price);
                    if (data.promo_price !== null) {
                        setPromoPrice(data.promo_price);
                    } else {
                        setPromoPrice(0)
                    }
                    setQuantity(data.quantity);
                    setLink(data.link);
                    setOrder(data.order);
                    setEnable(data.enable);
                    setMetaTitle(data.meta_title);
                    setMetaDescription(data.meta_description);
                    setImages(data.images);
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

    // const imageField = () => {
    //     if (image) {
    //         return (
    //
    //         )
    //     } else {
    //         return ;
    //     }
    // }
    const handleImageUpload = (uploadedFilesNames: string[]) => {
        setImages(prevImages => {
            const newImages = uploadedFilesNames.map(imageName => ({
                id: 0,
                image: imageName,
                alt: '',
                product_id: 0,
                order: 99,
                enable: true,
            }));

            return [...prevImages, ...newImages];
        });
    }

    const removeImage = async (e: SyntheticEvent) => {
        e.preventDefault()

        // await axios.post(`file/destroy`, {'filename': image})
        //     .then(response => {
        //         setImage('');
        //     })
        //     .catch(error => {
        //         console.error('Error while sending a file remove request:', error);
        //     });
    }

    const handleDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }

        const reorderedImages = Array.from(images);
        const [reorderedImage] = reorderedImages.splice(result.source.index, 1);
        reorderedImages.splice(result.destination.index, 0, reorderedImage);

        setImages(reorderedImages);
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault()

    }

    if (redirect) {
        return <Navigate to={'/products'}/>
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
                                {id ? "Edit product" : "Add new product"}
                            </Typography>

                            <Box component="form" onSubmit={submit} sx={{mt: 1, width: '100%'}}>
                                <TextField fullWidth
                                           margin="normal"
                                           select
                                           required
                                           value={category_id.toString()}
                                           label="Select product category"
                                           onChange={e => setCategoryId(parseInt(e.target.value))}
                                >
                                    <MenuItem value={'0'}>Select category</MenuItem>
                                    {categories.map((category) => {
                                        const items = [];
                                        items.push(
                                            <MenuItem key={category.id} value={category.id.toString()}>
                                                - {category.title}</MenuItem>
                                        );
                                        category.subcategories.forEach((subcategory) => {
                                            items.push(
                                                <MenuItem key={subcategory.id} value={subcategory.id.toString()}>- -
                                                    - {subcategory.title}</MenuItem>
                                            );
                                            subcategory.subcategories.forEach((subcategory2) => {
                                                items.push(
                                                    <MenuItem key={subcategory2.id} value={subcategory2.id.toString()}>-
                                                        - - -
                                                        - {subcategory2.title}</MenuItem>
                                                );
                                            })
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

                                <div className={'text-start mt-3'}>Description:</div>
                                {!loading && <DraftField editorText={description} returnFunction={setDescription}/>}

                                <TextField label={'Price'}
                                           type={'number'}
                                           value={price}
                                           inputProps={{min: 0, step: '0.01'}}
                                           margin="normal"
                                           required
                                           fullWidth
                                           onChange={e => setPrice(parseFloat(e.target.value))}
                                />

                                <TextField label={'Promotional price'}
                                           type={'number'}
                                           inputProps={{min: 0, step: '0.01'}}
                                           value={promo_price}
                                           margin="normal"
                                           fullWidth
                                           onChange={e => setPromoPrice(parseFloat(e.target.value))}
                                />

                                <TextField label={'Quantity'}
                                           type={'number'}
                                           value={quantity}
                                           margin="normal"
                                           required
                                           inputProps={{min: 0}}
                                           fullWidth
                                           onChange={e => setQuantity(parseInt(e.target.value))}
                                />

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
                                           label="Is the product enabled?"
                                           onChange={e => setEnable(e.target.value === '1')}
                                >
                                    <MenuItem value={'1'}>Enabled</MenuItem>
                                    <MenuItem value={'0'}>Disabled</MenuItem>
                                </TextField>

                                <Divider sx={{my: 3}}/>

                                <div className={'text-start mt-3'}>Product images:</div>
                                <ImageUpload maxFiles={10} handleImageUpload={handleImageUpload}/>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="images-dnd">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                                {images.map((image, index) => (
                                                    <Draggable key={image.image} draggableId={image.image} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <ProductImageFied image={image}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>

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

export default ProductForm;
