import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function MakeRequest({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    let [communityDetails, setCommunityDetails] = useState(null);
    const { communityId, email, maxAmount } = location.state || {};
    let [requestData, setRequestData] = useState({
        email: email, communityId: communityId, requestReason: "", amount: 0
    });
    useEffect(() => {
        getCommunityDetails();
    }, [])
    function getCommunityDetails() {
        fetch("http://localhost:5000/api/communities/" + communityId, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("404 Error");
                    } else {
                        throw new Error("Network response was not ok");
                    }
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .then((data) => {
                console.log(data);
                setCommunityDetails(data);
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === "404 Error") {
                    console.log("User Dows Not Have a Community");
                } else {
                    console.error("Error during login:", error);
                    handleOpenSnackbar("An error occurred. Please try again.");
                }
                setLoading(false);
            });
    };
    function handleChangeInput(event) {
        setRequestData({
            ...requestData,
            [event.target.name]: event.target.value,
        });

    }

    function handleRequestFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        if (requestData.amount > 0 && requestData.amount <= communityDetails.currentAmount) {
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
                    if(data.requestId !== undefined){
                        handleOpenSnackbar("Request Sent");
                    }else{
                        handleOpenSnackbar("You have already requested!");
                    }
                    navigate(getAllUrls(retrieveUser().roleId).communityView, { state: { communityId: communityId } });
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

        communityDetails !== null && (

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
                        You can only make one request.
                    </Typography>
                    <Typography align="center">
                        The amount can only be equal to or lesser than ₹{communityDetails.currentAmount}.
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

    )
}

export default MakeRequest