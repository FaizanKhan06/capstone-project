import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function MakeRequest({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { communityId, email, maxAmount } = location.state || {};
    let [requestData, setRequestData] = useState({
        email: email, communityId: communityId, requestReason: "", amount: 0
    });
    function handleChangeInput(event) {
        setRequestData({
            ...requestData,
            [event.target.name]: event.target.value,
        });

    }

    function handleRequestFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        if (requestData.amount > 0 && requestData.amount <= maxAmount) {
            fetch("http://localhost:5000/api/requests", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.text().then((text) => (text ? JSON.parse(text) : {}));
                })
                .then((data) => {
                    console.log(data);
                    handleOpenSnackbar("Request Sent");
                    navigate(getAllUrls(retrieveUser().roleId).dashboard);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error during login:", error);
                    handleOpenSnackbar("An error occurred. Please try again.");
                    setLoading(false);
                });
        } else {
            handleOpenSnackbar("Amount Invalid");
        }
        console.log(requestData);
        setLoading(false);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container component="main" maxWidth="lg">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    Make Request
                </Typography>
                <Typography align="center">
                    You can only make one request | The amount can only be equal to or lesser than ₹{maxAmount}.
                </Typography>
                <Typography align="center">
                    The amount can only be equal to or lesser than ₹{maxAmount}.
                </Typography>
                <form onSubmit={handleRequestFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type='text'
                                name='requestReason'
                                label="Request Reason"
                                fullWidth
                                multiline
                                rows={9}
                                variant="outlined"
                                value={requestData.requestReason}
                                onChange={handleChangeInput}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                name='amount'
                                label="Amount"
                                fullWidth
                                variant="outlined"
                                value={requestData.amount}
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
                                Make Request
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    )
}

export default MakeRequest