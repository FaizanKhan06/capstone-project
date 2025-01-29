import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { storeUser } from './auth.js';
import getAllUrls from './urlData.js';


const LoginPage = ({ handleOpenSnackbar, setLoginToTrue }) => {

    let navigate = useNavigate();
    let [loginData, setLoginData] = useState({ email: "", passwordHash: "" });
    const [loading, setLoading] = useState(false);

    function handleChangeInput(event) {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    }

    function handleLoginFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        console.log(loginData);

        fetch("http://localhost:5000/api/auth/validate/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error("Invalid Credentials");
                    }
                    throw new Error("Network response was not ok");
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .then((data) => {
                console.log(data);
                storeUser(data);
                handleOpenSnackbar("Login success");
                setLoginToTrue();
                navigate(getAllUrls(data.roleId).dashboard);
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === "Invalid Credentials") {
                    handleOpenSnackbar("Invalid Credentials");
                } else {
                    console.error("Error during login:", error);
                    handleOpenSnackbar("An error occurred. Please try again.");
                }
                setLoading(false);
            });
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    Login
                </Typography>
                <form onSubmit={handleLoginFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                name='email'
                                label="Email"
                                fullWidth
                                variant="outlined"
                                value={loginData.email}
                                onChange={handleChangeInput}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='password'
                                name='passwordHash'
                                label="Password"
                                fullWidth
                                variant="outlined"
                                value={loginData.passwordHash}
                                onChange={handleChangeInput}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                type="submit"
                                loading={loading}
                            >
                                Login
                            </Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Button color="primary" onClick={() => navigate("/Signup")}>
                                    Sign Up
                                </Button>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    );
};

export default LoginPage;
