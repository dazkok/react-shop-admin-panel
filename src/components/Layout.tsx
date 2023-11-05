import React, {useEffect, useState, Dispatch} from 'react';
import Nav from "./Nav";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {User} from "../models/user";
import {connect} from "react-redux";
import {setUser} from "../redux/actions/setUserAction";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import '../css/layout.css';

const Layout = (props: any) => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        (
            async () => {
                try {
                    const {data} = await axios.get('user');

                    props.setUser(data);
                } catch (e) {
                    setRedirect(true);
                }
            }
        )();
    }, []);

    if (redirect) {
        return <Navigate to={'/login'}/>
    }

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>

            <Nav/>

            <Box component="main"
                 sx={{
                     backgroundColor: (theme) =>
                         theme.palette.mode === 'light'
                             ? theme.palette.grey[100]
                             : theme.palette.grey[900],
                     flexGrow: 1,
                     height: '100vh',
                     overflow: 'auto',
                 }}
            >
                <Toolbar/>

                <Container maxWidth="lg" sx={{mt: 4, mb: 4}}>
                    {props.children}
                </Container>
            </Box>
        </Box>
    );
};

const mapStateToProps = (state: { user: User }) => ({
    user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setUser: (user: User) => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
