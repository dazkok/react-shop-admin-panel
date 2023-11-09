import React, {useEffect, useState} from 'react';
import {Category} from "../../models/category";
import CategoryHeader from "./CategoryHeader";
import axios from "axios";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import {
    Accordion, AccordionDetails,
    AccordionSummary, CircularProgress,
    Grid,
    Paper,
    TablePagination,
    TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from "@mui/material/Box";
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import InfoDialog from "../../components/dialogs/InfoDialog";

const Categories = (props: any) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filteredTable, setFilteredTable] = useState<Category[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [infoDialog, setInfoDialog] = useState({
        show: false,
        title: '',
        message: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('categories');

                setCategories(data);
                setFilteredTable(data);
                setLoading(false);
            }
        )();
    }, [])

    const handleClickOpenDeleteDialog = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const deleteCategory = async (id: number) => {
        try {
            setLoading(true);

            const result = await axios.delete(`categories/delete`, {
                data: {
                    id: id
                }
            });

            setCategories(filterDeletedCategory(categories, id));
            setFilteredTable(filterDeletedCategory(filteredTable, id));

            setLoading(false);

            if (result.status === 204) {
                setInfoDialog({
                    show: true,
                    title: 'Category has been deleted.',
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

    const filterDeletedCategory = (categories: Category[], id: number) => {
        return categories.filter(category => {
            category.subcategories = filterDeletedCategory(category.subcategories, id);

            return category.id !== id;
        });
    }

    const searchInTable = (searched: string) => {
        let filteredCategories = categories.filter(category => category.title.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || category.description.toLowerCase().indexOf(searched.toLowerCase()) >= 0
        );

        setFilteredTable(filteredCategories);
    }

    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPerPage(+e.target.value);
        setPage(0);
    };

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{py: 3, px: 2, display: 'flex', flexDirection: 'column'}}>
                        <Button variant={'contained'} color={'success'} href={'/categories/create'}
                                sx={{mb: 3}}
                                style={{maxWidth: '200px'}}
                        >Add category</Button>

                        {loading ? (
                            <div className={'text-center mt-3'}>
                                <CircularProgress color="success"/>
                            </div>
                        ) : (
                            <>
                                <TextField
                                    variant='outlined'
                                    label={'search'}
                                    placeholder='search...'
                                    size={'small'}
                                    type='search'
                                    onKeyUp={e => searchInTable((e.target as HTMLInputElement).value)}
                                    sx={{mb: 3}}
                                />

                                {filteredTable.slice(page * perPage, (page + 1) * perPage).map((category, index) => {
                                    return (
                                        <Accordion key={category.id}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon/>}
                                                id={`category-${category.id}`}
                                            >
                                                <CategoryHeader id={category.id}
                                                                title={category.title}
                                                                image={'http://localhost:8010/images/' + category.image}
                                                                deleteFunction={handleClickOpenDeleteDialog}
                                                />
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {category.subcategories.map((subcategory, index2) => {
                                                    return (
                                                        <Accordion key={index2}>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon/>}
                                                                id={`category-${subcategory.id}`}
                                                            >
                                                                <CategoryHeader id={subcategory.id}
                                                                                title={subcategory.title}
                                                                                image={'http://localhost:8010/images/' + subcategory.image}
                                                                                deleteFunction={handleClickOpenDeleteDialog}
                                                                />
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Box></Box>
                                                                {subcategory.subcategories.map((subcategory3, index3) => {
                                                                    return (
                                                                        <Box key={index3} sx={{p: 2, boxShadow: 1}}>
                                                                            <CategoryHeader id={subcategory3.id}
                                                                                            title={subcategory3.title}
                                                                                            image={'http://localhost:8010/images/' + subcategory3.image}
                                                                                            deleteFunction={handleClickOpenDeleteDialog}
                                                                            />
                                                                        </Box>
                                                                    )
                                                                })}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    )
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                })}
                                <TablePagination
                                    component={'div'}
                                    count={filteredTable.length}
                                    page={page}
                                    onPageChange={(e, newPage) => setPage(newPage)}
                                    rowsPerPage={perPage}
                                    rowsPerPageOptions={[5, 10, 20, 50]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                    sx={{mt: 3}}
                                />
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
            <DeleteDialog open={openDeleteDialog} onDelete={deleteCategory} setOpen={setOpenDeleteDialog}
                          id={deleteId}/>
            <InfoDialog dialogData={infoDialog} setInfoDialog={setInfoDialog}/>
        </Layout>
    );
};

export default Categories;
