import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import axios from "axios";
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {
    ButtonGroup,
    CircularProgress,
    Grid,
    Paper,
    Switch,
    TableContainer,
    TablePagination,
    TextField,
    Tooltip
} from "@mui/material";
import Button from '@mui/material/Button';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeleteDialog from "../../components/dialogs/DeleteDialog";
import {Product} from "../../models/product";
import RttRoundedIcon from '@mui/icons-material/RttRounded';

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filteredTable, setFilteredTable] = useState<Product[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get('products');

                setProducts(data);
                setFilteredTable(data);
                setLoading(false);
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

    const handleClickOpenDeleteDialog = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const deleteProduct = async (id: number) => {
        try {
            setLoading(true);
            const result = await axios.delete(`products/delete`, {
                data: {
                    id: id
                }
            });

            if (result.status === 204) {
                setProducts(products.filter(product => product.id !== id));
                setFilteredTable(filteredTable.filter(product => product.id !== id));
            } else if (result.status === 226) {
                alert('You cannot delete an item because it is in the customer\'s cart. But you can exclude it in the "Enabled" field.');
            } else {
                alert('Product deletion failed.');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
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
                                                let productImage = product.image ? product.image.image : 'placeholder.svg';
                                                let disabledStyle;

                                                if (!product.enable) {
                                                }

                                                return (
                                                    <TableRow key={product.id}
                                                              style={{background: !product.enable ? "lightgray" : "inherit"}}>
                                                        <TableCell>{product.order}</TableCell>
                                                        <TableCell>
                                                            <img
                                                                src={'http://localhost:8010/images/' + productImage}
                                                                alt={''}
                                                                loading="lazy"
                                                                style={{objectFit: 'cover'}}
                                                                height={'60px'}
                                                                width={'60px'}/>
                                                        </TableCell>
                                                        <TableCell>{product.title}</TableCell>
                                                        <TableCell>
                                                            {product.category ? product.category.title :
                                                                <span style={{color: 'red'}}>undefined category</span>}
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                product.promo_price ? (
                                                                    <div style={{whiteSpace: 'nowrap'}}>
                                                                        <del>{product.price}</del>
                                                                        {'\u00A0'}{product.promo_price} PLN
                                                                    </div>
                                                                ) : (
                                                                    <div style={{whiteSpace: 'nowrap'}}>
                                                                        {product.price} PLN
                                                                    </div>
                                                                )}
                                                        </TableCell>
                                                        <TableCell>{product.quantity}</TableCell>
                                                        <TableCell>
                                                            <Switch checked={product.enable ? true : false}
                                                                    onChange={(e) => switchProduct(e, index)}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <ButtonGroup>
                                                                <Tooltip title={'Edit'}>
                                                                    <Button variant="outlined" size={'small'}
                                                                            color={"primary"}
                                                                            href={`/products/${product.id}/edit`}>
                                                                        <EditRoundedIcon/>
                                                                    </Button>
                                                                </Tooltip>

                                                                <Tooltip title={'Edit'}>
                                                                    <Button variant="outlined" size={'small'}
                                                                            color={"primary"}
                                                                            href={`/elements/product-${product.id}`}>
                                                                        <RttRoundedIcon/>
                                                                    </Button>
                                                                </Tooltip>

                                                                <Tooltip title={'Delete'}>
                                                                    <Button variant="outlined" size={'small'}
                                                                            color={"error"}
                                                                            onClick={() => handleClickOpenDeleteDialog(product.id)}
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
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <DeleteDialog open={openDeleteDialog} onDelete={deleteProduct} setOpen={setOpenDeleteDialog} id={deleteId}/>
        </Layout>
    );
};

export default Products;
