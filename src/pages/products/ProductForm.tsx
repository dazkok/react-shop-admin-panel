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
import ImageUpload from "../../components/dropzone/ImageUpload";
import {ProductImage} from "../../models/product-image";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import ProductImageField from "./ProductImageField";
import {useStrictDroppable} from "../../components/droppable/UseStrictDroppable";
import TextToLinkField from "../../components/form-components/TextToLinkField";

const ProductForm = React.memo((props: any) => {
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
    const [enabled] = useStrictDroppable(loading);

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

    const setImageAlt = (alt: string, id: number) => {
        const updatedImages = images.map((image) =>
            image.id === id ? {...image, alt: alt} : image
        );

        setImages(updatedImages);
    }

    const removeImage = async (imageName: string, imageId: number, e: SyntheticEvent) => {
        e.preventDefault()

        await axios.post(`file/destroy`, {'filename': imageName})
            .then(response => {
                const updatedImages = images.filter(image => image.image !== imageName);

                if (imageId !== 0) {
                    axios.post(`products/destroy-image`, {'id': imageId})
                        .then(response => {
                            console.log('Image has been removed from database');
                        })
                        .catch(error => {
                            console.error('Error while deleting an image from the database:', error);
                        })
                }

                setImages(updatedImages);
            })
            .catch(error => {
                console.error('Error while sending a file remove request:', error);
            });
    }

    const handleDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const {source, destination} = result;
        if (source.index === destination.index) {
            return;
        }

        const reorderedImages = [...images];

        // Remove the dragged item from its old position
        const [draggedImage] = reorderedImages.splice(source.index, 1);
        // Paste the dragged item to a new position
        reorderedImages.splice(destination.index, 0, draggedImage);

        reorderedImages.forEach((image, index) => {
            image.order = index;
        });

        setImages(reorderedImages);
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault()

        if (category_id === 0) {
            alert('Select category!')
            return;
        }

        const data = {
            title,
            description,
            category_id,
            price,
            promo_price,
            quantity,
            link,
            order,
            enable,
            meta_title,
            meta_description,
            images
        };

        if (id) {
            await axios.put(`products/${id}`, data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        } else {
            await axios.post('products/store', data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        }
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

                                <TextToLinkField
                                    text={title}
                                    setText={setTitle}
                                    textPlaceholder={'Title'}
                                    link={link}
                                    setLink={setLink}
                                />

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
                                    {enabled && <Droppable droppableId="images-dnd" direction={"horizontal"}>
                                        {(provided) => (
                                            <Box sx={{
                                                display: 'flex',
                                                overflow: 'auto',
                                                my: 3,
                                                minHeight: '200px',
                                                border: '1px solid lightgray'
                                            }} ref={provided.innerRef} {...provided.droppableProps}>
                                                {images.map((image, index) => (
                                                    <Draggable key={image.image} draggableId={image.image}
                                                               index={index}>
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <ProductImageField image={image}
                                                                                   removeImage={removeImage}
                                                                                   setImageAlt={setImageAlt}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>}
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
});

export default ProductForm;
