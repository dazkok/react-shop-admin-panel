import React, {useEffect, useState} from 'react';
import axios from "axios";
import Layout from "../../components/Layout";
import {useParams} from "react-router-dom";
import {PageElement} from "../../models/element";
import {CircularProgress, Grid, Paper} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useStrictDroppable} from "../../components/droppable/UseStrictDroppable";
import ElementComponent from "../elements/Element";
import Button from "@mui/material/Button";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import InfoDialog from "../../components/dialogs/InfoDialog";

const Elements = () => {
    const {location} = useParams();
    const [elements, setElements] = useState<PageElement[]>([]);
    const [loading, setLoading] = useState(true);
    const [enabled] = useStrictDroppable(loading);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [infoDialog, setInfoDialog] = useState({
        show: false,
        title: '',
        message: ''
    });

    useEffect(() => {
        if (location) {
            (
                async () => {
                    try {
                        const {data} = await axios.get(`elements/${location}`);

                        setElements(data);
                    } catch (error) {
                        console.log(error);
                    }
                    setLoading(false);
                }
            )();
        } else {
            setLoading(false);
        }
    }, []);

    const handleDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const {source, destination} = result;
        if (source.index === destination.index) {
            return;
        }

        const reorderedElements = [...elements];

        const [draggedElement] = reorderedElements.splice(source.index, 1);
        reorderedElements.splice(destination.index, 0, draggedElement);

        reorderedElements.forEach((element, index) => {
            element.order = index;
        });

        setElements(reorderedElements);

        axios.put(`elements/update-orders`, {'elements': elements})
            .catch(error => {
                console.error('Error while sending a request:', error);
            });
    };

    const handleClickOpenDeleteDialog = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const deleteElement = async (id: number) => {
        try {
            setLoading(true);

            const result = await axios.delete(`elements/delete`, {
                data: {
                    id: id
                }
            });

            setElements(elements.filter(element => element.id !== id));
            setLoading(false);

            if (result.status === 204) {
                setInfoDialog({
                    show: true,
                    title: 'Element has been deleted.',
                    message: ''
                });
            } else if (result.status === 200) {
                setInfoDialog({
                    show: true,
                    title: result.data.error,
                    message: result.data.message
                });
            }
        } catch (error: any) {
            setLoading(false);
            if (error.response) {
                const responseData = error.response.data;

                setInfoDialog({
                    show: true,
                    title: responseData.error,
                    message: responseData.message
                });
            } else {
                console.error('Network Error:', error);
                alert('An error occurred while communicating with the server.');
            }
        }
    }

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper className={'text-start'}
                           sx={{py: 3, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <Typography component="h2" variant="h5">
                            Elements
                        </Typography>

                        <Button variant={'contained'} color={'success'} href={`/elements/${location}/create`}
                                sx={{my: 3}}
                                style={{maxWidth: '200px'}}
                        >New element</Button>

                        {loading ? (
                            <CircularProgress color="success"/>
                        ) : (
                            <DragDropContext onDragEnd={handleDragEnd}>
                                {enabled && (
                                    <Droppable droppableId={'elements-list'} direction={"vertical"}>
                                        {(provided) => (
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: '1px solid lightgray',
                                                width: '100%'
                                            }}
                                                 ref={provided.innerRef}
                                                 {...provided.droppableProps}
                                            >
                                                {elements.map((element, index) => (
                                                    <Draggable
                                                        key={element.id}
                                                        draggableId={element.id.toString()}
                                                        index={index}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <ElementComponent element={element} deleteFunction={handleClickOpenDeleteDialog}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </Box>
                                        )}
                                    </Droppable>
                                )}
                            </DragDropContext>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <DeleteDialog open={openDeleteDialog} onDelete={deleteElement} setOpen={setOpenDeleteDialog}
                          id={deleteId}/>
            <InfoDialog dialogData={infoDialog} setInfoDialog={setInfoDialog}/>
        </Layout>
    );
};

export default Elements;
