import React, {SyntheticEvent, useState} from 'react';
import axios from "axios";
import {Navigate} from "react-router-dom";
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import {Alert, Box, Container, CssBaseline, TextField} from "@mui/material";
import Button from "@mui/material/Button";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [error, setError] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.post('login', {
                email,
                password
            });

            setRedirect(true);
        } catch (e) {
            setError(true);
        } finally {
            setTimeout(() => {
                setError(false);
            }, 3000)
        }
    }

    let errorMessage;
    if (error) {
        errorMessage = <Alert severity="error">Wrong email or password!</Alert>;
    }

    if (redirect) {
        return <Navigate to={'/'}/>
    }

    function Copyright(props: any) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://pavlovovk.com/">
                    pavlovovk.pl
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <Box
                sx={{
                    // marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={submit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={e => setPassword(e.target.value)}
                    />
                    {errorMessage}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                    >
                        Sign In
                    </Button>
                </Box>
                <Copyright sx={{mt: 4, mb: 4}}/>
            </Box>
        </Container>
    );
}

export default Login;