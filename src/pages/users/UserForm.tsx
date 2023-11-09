import React, {SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import {CircularProgress, Grid, MenuItem, Paper, TextField} from "@mui/material";
import {Navigate, useParams} from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const UserForm = () => {
    const {id} = useParams();
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [email_verified, setEmailVerified] = useState(false);
    const [enable, setEnable] = useState(true);
    const [is_admin, setIsAdmin] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            (
                async () => {
                    const {data} = await axios.get(`users/${id}`);

                    setFirstName(data.first_name);
                    setLastName(data.last_name);
                    setEmail(data.email);
                    setPhone(data.phone);
                    setEmailVerified(data.email_verified);
                    setEnable(data.enable);
                    setIsAdmin(data.is_admin);
                    setLoading(false);
                }
            )()
        } else {
            setLoading(false);
        }
    }, []);

    const generateRandomPassword = (e: SyntheticEvent, length: number = 12) => {
        const characters =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        const password = [];
        for (let i = 0; i < length; i++) {
            password.push(characters[Math.floor(Math.random() * characters.length)]);
        }

        setPassword(password.join(""));
    }

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault()

        const data = {
            first_name,
            last_name,
            email,
            phone,
            password,
            email_verified,
            enable,
            is_admin
        };

        if (id) {
            await axios.put(`users/${id}`, data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        } else {
            await axios.post('users', data)
                .then(response => {
                    setRedirect(true);
                })
                .catch(error => {
                    console.error('Error while sending a request:', error);
                });
        }
    }

    if (redirect) {
        return <Navigate to={'/users'}/>
    }

    return (
        <Layout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{py: 3, px: 3, display: 'flex', flexDirection: 'column', alignItems: 'start'}}>
                        <Typography component="h2" variant="h5">
                            {id ? "Edit user" : "Create user"}
                        </Typography>

                        {loading ? (
                            <CircularProgress color="success" sx={{mt: 3}}/>
                        ) : (
                            <>
                                <Box component="form" onSubmit={submit} sx={{mt: 1}}>
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
                                               type={'email'}
                                               label="Email"
                                               value={email}
                                               onChange={e => setEmail(e.target.value)}
                                    />
                                    <TextField margin="normal"
                                               required
                                               fullWidth
                                               label="Phone"
                                               value={phone}
                                               onChange={e => setPhone(e.target.value)}
                                               inputProps={{maxLength: 15}}
                                    />

                                    <TextField margin="normal"
                                               fullWidth
                                               id={'password'}
                                               label="Password"
                                               type={'password'}
                                               value={password}
                                               onChange={e => setPassword(e.target.value)}
                                               helperText={id ? "Enter a new password if necessary." : "The password must consist of at least 8 characters."}
                                               required={!id}
                                               inputProps={{minLength: 8}}
                                               InputProps={{
                                                   endAdornment: <Button color="success"
                                                                         variant={'contained'}
                                                                         onClick={generateRandomPassword}>
                                                       generate
                                                   </Button>
                                               }}
                                    />

                                    <TextField fullWidth
                                               margin="normal"
                                               select
                                               value={email_verified ? '1' : '0'}
                                               label="Is Email verified?"
                                               onChange={e => setEmailVerified(e.target.value === '1')}
                                    >
                                        <MenuItem value={'1'}>Verified</MenuItem>
                                        <MenuItem value={'0'}>Not Verified</MenuItem>
                                    </TextField>

                                    <TextField fullWidth
                                               margin="normal"
                                               select
                                               value={enable ? '1' : '0'}
                                               label="Is the user enabled?"
                                               onChange={e => setEnable(e.target.value === '1')}
                                    >
                                        <MenuItem value={'1'}>Enabled</MenuItem>
                                        <MenuItem value={'0'}>Disabled</MenuItem>
                                    </TextField>

                                    <TextField fullWidth
                                               margin="normal"
                                               select
                                               value={is_admin ? '1' : '0'}
                                               label="Does the user have administrator rights?"
                                               onChange={e => setIsAdmin(e.target.value === '1')}
                                    >
                                        <MenuItem value={'1'}>Yes</MenuItem>
                                        <MenuItem value={'0'}>No</MenuItem>
                                    </TextField>

                                    <Button type="submit"
                                            fullWidth
                                            color={'primary'}
                                            variant="contained"
                                            sx={{mt: 3, mb: 2}}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default UserForm;
