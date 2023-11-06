import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import axios from "axios";
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {ButtonGroup, Grid, Paper, Switch, TableContainer, TablePagination, TextField, Tooltip} from "@mui/material";
import Button from '@mui/material/Button';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import {Product} from "../../models/product";

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filteredTable, setFilteredTable] = useState<Product[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('products');

                setProducts(data);
                setFilteredTable(data);
            }
        )()
    }, []);

    const switchProduct = async (e: SyntheticEvent, index: number) => {
        e.preventDefault();

        const enable = !products[index].enable;
        const id = products[index].id;

        await axios.put('products/enable', {
            enable,
            id
        })
            .then(response => {
                products[index].enable = enable;
                filteredTable[index].enable = enable;
            })
            .catch(error => {
                console.error('Error while sending a enable request:', error);
            });
    }

    const del = async (id: number) => {
        if (window.confirm('Are you sure?')) {
            try {
                const result = await axios.delete(`products/${id}`);

                if (result.status === 204) {
                    setProducts(products.filter(product => product.id !== id));
                } else {
                    alert('Product deletion failed.');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('An error occurred while deleting the product.');
            }
        }
    }

    const searchInTable = (searched: string) => {
        let filteredProducts = products.filter(product => product.title.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || product.description.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            // || product.category.title.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || product.link.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || product.id.toString().indexOf(searched.toLowerCase()) >= 0
        );

        setFilteredTable(filteredProducts);
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
                        <Button variant={'contained'} color={'success'} href={'/products/create'}
                                sx={{mb: 3}}
                                style={{maxWidth: '200px'}}
                        >New product</Button>

                        <TextField
                            variant='outlined'
                            label={'search'}
                            placeholder='search...'
                            size={'small'}
                            type='search'
                            onKeyUp={e => searchInTable((e.target as HTMLInputElement).value)}
                        />
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Enabled</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredTable.slice(page * perPage, (page + 1) * perPage).map((product, index) => {
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell>{product.id}</TableCell>
                                                <TableCell>
                                                    <img src={product.image.image} alt={''} loading="lazy"
                                                         height={'40px'} width={'80px'}/>
                                                </TableCell>
                                                <TableCell>{product.title}</TableCell>
                                                <TableCell>
                                                    {product.category ? product.category.title :
                                                        <span style={{color: 'red'}}>undefined category</span>}
                                                </TableCell>
                                                <TableCell>{product.price} PLN</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>
                                                    <Switch defaultChecked={product.enable}
                                                        onChange={(e) => switchProduct(e, index)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <ButtonGroup>
                                                        <Tooltip title={'Edit'}>
                                                            <Button variant="outlined" size={'small'} color={"primary"}
                                                                    href={`/products/${product.id}/edit`}>
                                                                <EditRoundedIcon/>
                                                            </Button>
                                                        </Tooltip>

                                                        <Tooltip title={'Delete'}>
                                                            <Button variant="outlined" size={'small'} color={"error"}
                                                                // onClick={() => handleClickOpenDeleteDialog(product.id)}
                                                            >
                                                                <DeleteRoundedIcon/>
                                                            </Button>
                                                        </Tooltip>
                                                    </ButtonGroup>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            component={'div'}
                            count={filteredTable.length}
                            page={page}
                            onPageChange={(e, newPage) => setPage(newPage)}
                            rowsPerPage={perPage}
                            rowsPerPageOptions={[10, 25, 50]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Grid>
            </Grid>
            {/*<DeleteDialog open={openDeleteDialog} onDelete={deleteUser} setOpen={setOpenDeleteDialog} id={deleteId}/>*/}
        </Layout>
    );
};

export default Products;
