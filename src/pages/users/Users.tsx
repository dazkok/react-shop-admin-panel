import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import axios from "axios";
import {User} from "../../models/user";
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

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [filteredTable, setFilteredTable] = useState<User[]>([]);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (
            async () => {
                try {
                    const {data} = await axios.get('users');

                    setUsers(data);
                    setFilteredTable(data);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                }
            }
        )()
    }, []);

    const handleClickOpenDeleteDialog = (id: number) => {
        setDeleteId(id);
        setOpenDeleteDialog(true);
    };

    const deleteUser = async (id: number) => {
        try {
            setLoading(true);

            const result = await axios.delete(`users/delete`, {
                data: {
                    id: id
                }
            });

            if (result.status === 204) {
                setUsers(users.filter(user => user.id !== id));
                setFilteredTable(filteredTable.filter(user => user.id !== id));
            } else {
                alert('User deletion failed.');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    }

    const switchUser = async (e: SyntheticEvent, index: number) => {
        e.preventDefault();

        const enable = !users[index].enable;
        const id = users[index].id;

        await axios.put('users/enable', {
            enable,
            id
        })
            .then(response => {
                users[index].enable = enable;
                filteredTable[index].enable = enable;
            })
            .catch(error => {
                console.error('Error while sending a enable request:', error);
            });
    }

    const searchInTable = (searched: string) => {
        let filteredUsers = users.filter(user => user.first_name.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || user.last_name.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || user.phone.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || user.email.toLowerCase().indexOf(searched.toLowerCase()) >= 0
            || user.id.toString().indexOf(searched.toLowerCase()) >= 0
        );

        setFilteredTable(filteredUsers);
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
                        <Button variant={'contained'} color={'success'} href={'/users/create'}
                                sx={{mb: 3}}
                                style={{maxWidth: '200px'}}
                        >Add customer</Button>

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
                                                <TableCell>Name</TableCell>
                                                <TableCell>Email</TableCell>
                                                <TableCell>Phone</TableCell>
                                                <TableCell>Enabled</TableCell>
                                                <TableCell>Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredTable.slice(page * perPage, (page + 1) * perPage).map((user, index) => {
                                                return (
                                                    <TableRow key={user.id}>
                                                        <TableCell>{user.id}</TableCell>
                                                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.phone}</TableCell>
                                                        <TableCell>
                                                            <Switch defaultChecked={user.enable}
                                                                    onChange={(e) => switchUser(e, index)}/>
                                                        </TableCell>
                                                        <TableCell>
                                                            <ButtonGroup>
                                                                <Tooltip title={'Edit'}>
                                                                    <Button variant="outlined" size={'small'}
                                                                            color={"primary"}
                                                                            href={`/users/${user.id}/edit`}>
                                                                        <EditRoundedIcon/>
                                                                    </Button>
                                                                </Tooltip>

                                                                <Tooltip title={'Delete'}>
                                                                    <Button variant="outlined" size={'small'}
                                                                            color={"error"}
                                                                            onClick={() => handleClickOpenDeleteDialog(user.id)}>
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
            <DeleteDialog open={openDeleteDialog} onDelete={deleteUser} setOpen={setOpenDeleteDialog} id={deleteId}/>
        </Layout>
    );
};

export default Users;
