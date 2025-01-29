import React, { useState } from 'react';
import { TextField, Button, Typography, Grid, Container, Box, Select, MenuItem, InputLabel, FormControl, Checkbox } from '@mui/material';
import { useNavigate } from "react-router-dom";

const SignUpPage = ({ handleOpenSnackbar }) => {
    let navigate = useNavigate();
    let [loginData, setLoginData] = useState({
        email: "", passwordHash: "", firstName: "", lastName: "", phoneNo: "", adhaarNo: "", roleId: 2
    });
    let [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChangeInput(event) {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    }

    function handleLoginFormSubmit(event) {
        event.preventDefault();
        setLoading(true);
        if (loginData.passwordHash !== confirmPassword) {
            setLoading(false);
            handleOpenSnackbar("Passwords do not match");
            return;
        }
        console.log(loginData);

        fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text().then((text) => text ? JSON.parse(text) : {});
            })
            .then((data) => {
                setLoading(false);
                console.log(data);
                if (data.userId === null) {
                    handleOpenSnackbar(data.email);
                }
                else {
                    handleOpenSnackbar("SignUp success! Login");
                    navigate("/Login");
                }
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error during sign-up:", error);
                handleOpenSnackbar("An error occurred. Please try again.");
            });
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    Sign Up
                </Typography>
                <form onSubmit={handleLoginFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type='text'
                                name='firstName'
                                value={loginData.firstName}
                                onChange={handleChangeInput}
                                required
                                label="First Name"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                type='text'
                                name='lastName'
                                value={loginData.lastName}
                                onChange={handleChangeInput}
                                required
                                label="Last Name"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='email'
                                name='email'
                                value={loginData.email}
                                onChange={handleChangeInput}
                                required
                                label="Email"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='password'
                                name='passwordHash'
                                value={loginData.passwordHash}
                                onChange={handleChangeInput}
                                required
                                label="Password"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='password'
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                label="Confirm Password"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='tel'
                                name='phoneNo'
                                value={loginData.phoneNo}
                                onChange={handleChangeInput}
                                required
                                label="Phone No"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='text'
                                name='adhaarNo'
                                value={loginData.adhaarNo}
                                onChange={handleChangeInput}
                                required
                                label="Aadhar No"
                                fullWidth
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Register As *</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    value={loginData.roleId}
                                    label="Register As *"
                                    onChange={(event) => { setLoginData({ ...loginData, roleId: event.target.value, }); console.log(loginData); }
                                    }
                                >
                                    <MenuItem value={2}>User</MenuItem>
                                    <MenuItem value={3}>Community Head</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                            <Checkbox required />
                            <Typography>I accept the <Button style={{ padding: "0", textDecoration: "underline" }}>Terms and Conditions</Button></Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                loading={loading}
                                type="submit"
                            >
                                Sign Up
                            </Button>
                        </Grid>
                        <Grid item xs={12} align="center">
                            <Typography variant="body2">
                                Already have an account?
                                <Button color="primary" onClick={() => navigate("/Login")}>
                                    Login
                                </Button>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    );
};

export default SignUpPage;
