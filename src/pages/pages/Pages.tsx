import React, {useEffect, useState} from 'react';
import axios from "axios";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import {
    CircularProgress,
    Grid,
    Paper
} from "@mui/material";
import Box from "@mui/material/Box";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import InfoDialog from "../../components/dialogs/InfoDialog";
import {Page} from "../../models/page";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {useStrictDroppable} from "../../components/droppable/UseStrictDroppable";
import PageHeader from "./PageHeader";
import Typography from "@mui/material/Typography";

const Pages = (props: any) => {
    const [pages, setPages] = useState<Page[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [infoDialog, setInfoDialog] = useState({
        show: false,
        title: '',
        message: ''
    });
    const [loading, setLoading] = useState(true);
    const [enabled] = useStrictDroppable(loading);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('pages');

                setPages(data);
                // setFilteredTable(data);
                setLoading(false);
            }
        )();
    }, [])

    const handleClickOpenDeleteDialog = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const deletePage = async (id: number) => {
        try {
            setLoading(true);

            const result = await axios.delete(`pages/delete`, {
                data: {
                    id: id
                }
            });

            setPages(pages.filter(page => page.id !== id));
            setLoading(false);

            if (result.status === 204) {
                setInfoDialog({
                    show: true,
                    title: 'Page has been deleted.',
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

    const handleDragEnd = async (result: any) => {
        if (!result.destination) {
            return;
        }

        const {source, destination} = result;
        if (source.index === destination.index) {
            return;
        }

        const reorderedPages = [...pages];

        const [draggedImage] = reorderedPages.splice(source.index, 1);
        reorderedPages.splice(destination.index, 0, draggedImage);

        reorderedPages.forEach((page, index) => {
            page.order = index;
        });

        setPages(reorderedPages);

        axios.put(`pages/update-orders`, {'pages': pages})
            .catch(error => {
                console.error('Error while sending a request:', error);
            });
    };

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{py: 3, px: 2, display: 'flex', flexDirection: 'column'}}>
                        <Button variant={'contained'} color={'success'} href={'/pages/create'}
                                sx={{mb: 3}}
                                style={{maxWidth: '200px'}}
                        >Add page</Button>

                        {loading ? (
                            <div className={'text-center mt-3'}>
                                <CircularProgress color="success"/>
                            </div>
                        ) : (
                            <>
                                <Box sx={{
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
                                            #
                                        </Box>
                                        <Box sx={{width: '80px', mr: 3}}>
                                            Image
                                        </Box>
                                        <Typography>
                                            Title
                                        </Typography>
                                    </Box>

                                    <Box sx={{px: 2}}>
                                        Options
                                    </Box>
                                </Box>

                                <DragDropContext onDragEnd={handleDragEnd}>
                                    {enabled && (
                                        <Droppable droppableId={'pages-list'} direction={"vertical"}>
                                            {(provided) => (
                                                <Box sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    border: '1px solid lightgray'
                                                }}
                                                     ref={provided.innerRef}
                                                     {...provided.droppableProps}
                                                >
                                                    {pages.map((page, index) => (
                                                        <Draggable
                                                            key={page.link}
                                                            draggableId={page.link}
                                                            index={index}
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                >
                                                                    <PageHeader page={page} deleteFunction={handleClickOpenDeleteDialog}/>
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
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <DeleteDialog open={openDeleteDialog} onDelete={deletePage} setOpen={setOpenDeleteDialog}
                          id={deleteId}/>
            <InfoDialog dialogData={infoDialog} setInfoDialog={setInfoDialog}/>
        </Layout>
    );
};

export default Pages;
