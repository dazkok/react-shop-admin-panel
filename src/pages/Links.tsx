import React, {useEffect, useState} from 'react';
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import {TableFooter, TablePagination} from "@mui/material";
import Layout from "../components/Layout";
import {Link} from "../models/link";
import axios from "axios";
import { useParams } from "react-router-dom";

const Links = (props: any) => {
    const [links, setLinks] = useState<Link[]>([]);
    const [page, setPage] = useState(0);
    const perPage = 10;
    const { id } = useParams();

    useEffect(() => {
        (
            async () => {
                const {data} = await axios.get(`users/${id}/links`);

                setLinks(data);
            }
        )()
    }, [id]);

    return (
        <Layout>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Count</TableCell>
                        <TableCell>Revenue</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {links.slice(page * perPage, (page + 1) * perPage).map(link => {
                        return (
                            <TableRow key={'link.id'}>
                                <TableCell>{link.id}</TableCell>
                                <TableCell>{link.code}</TableCell>
                                <TableCell>{link.orders.length}</TableCell>
                                <TableCell>
                                    {link.orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                <TableFooter>
                    <TablePagination count={links.length}
                                     page={page}
                                     rowsPerPage={perPage}
                                     rowsPerPageOptions={[]}
                                     onPageChange={(e, newPage) => setPage(newPage)}/>
                </TableFooter>
            </Table>
        </Layout>
    );
};

export default Links;
