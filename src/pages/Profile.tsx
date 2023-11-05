import React, {Dispatch, SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {Alert, Box, Grid, Paper, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import {connect} from "react-redux";
import {User} from "../models/user";
import {setUser} from "../redux/actions/setUserAction";
import Typography from "@mui/material/Typography";

const Profile = (props: any) => {
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [notify, setNotify] = useState({
        show: false,
        error: false,
        message: ''
    });

    useEffect(() => {
        setFirstName(props.user.first_name);
        setLastName(props.user.last_name);
        setEmail(props.user.email);
    }, [props.user]);

    const infoSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            const {data} = await axios.put('users/info', {
                first_name,
                last_name,
                email
            })

            props.setUser(data);

            setNotify({
                show: true,
                error: false,
                message: `User data has been changed.`
            });
        } catch (e) {
            setNotify({
                show: true,
                error: true,
                message: 'Something went wrong while changing user data.'
            });
        } finally {
            setTimeout(() => {
                setNotify({
                    show: false,
                    error: false,
                    message: ''
                })
            }, 3000)
        }
    }

    const passwordSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            await axios.put('users/password', {
                password,
                password_confirm
            });

            setNotify({
                show: true,
                error: false,
                message: `Password has been changed.`
            });
        } catch (e) {
            setNotify({
                show: true,
                error: true,
                message: 'Could not change password. The minimum password length is 8 characters!'
            });
        } finally {
            setTimeout(() => {
                setNotify({
                    show: false,
                    error: false,
                    message: ''
                })
            }, 3000)
        }
    }

    let info;
    if (notify.show) {
        info = (
            <Grid item xs={12}>
                <Alert variant="outlined" severity={notify.error ? "error" : "success"} style={{background: '#fff'}}>
                    {notify.message}
                </Alert>
            </Grid>
        )
    }

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{py: 3, px: 4, display: 'flex', flexDirection: 'column'}}>
                        <Typography component="h2" variant="h5">
                            Account Information
                        </Typography>

                        <Box component="form" onSubmit={infoSubmit} sx={{mt: 1}}>
                            <TextField label={'First Name'}
                                       value={first_name}
                                       margin="normal"
                                       required
                                       fullWidth
                                       onChange={e => setFirstName(e.target.value)}
                            />

                            <TextField label={'Last Name'}
                                       value={last_name}
                                       margin="normal"
                                       required
                                       fullWidth
                                       onChange={e => setLastName(e.target.value)}
                            />

                            <TextField margin="normal"
                                       required
                                       fullWidth
                                       label="Email"
                                       value={email}
                                       disabled={true}
                                       onChange={e => setEmail(e.target.value)}
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
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{py: 3, px: 4, display: 'flex', flexDirection: 'column'}}>
                        <Typography component="h2" variant="h5">
                            Change Password
                        </Typography>

                        <Box component="form" onSubmit={passwordSubmit} noValidate sx={{mt: 1}}>
                            <TextField label={'Password'}
                                       type={'password'}
                                       margin="normal"
                                       required
                                       fullWidth
                                       onChange={e => setPassword(e.target.value)}
                            />

                            <TextField label={'Password Confirm'}
                                       type={'password'}
                                       margin="normal"
                                       required
                                       fullWidth
                                       onChange={e => setPasswordConfirm(e.target.value)}
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
                </Grid>

                {info}
            </Grid>
        </Layout>
    );
};

export default connect(
    (state: { user: User }) => ({
        user: state.user
    }),
    (dispatch: Dispatch<any>) => ({
        setUser: (user: User) => dispatch(setUser(user))
    })
)(Profile);