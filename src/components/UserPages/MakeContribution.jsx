import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function MakeContribution({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { communityId, email, maxAmount } = location.state || {};
    const [amountDetails, setAmountDetails] = useState({ amount: 100.00, interest: 15.00, total: 115.00 })
    let [contributionData, setContributionData] = useState({
        email: email, communityId: communityId, transactionType: "Credit", amount: amountDetails.amount, interestAmount: amountDetails.interest
    });

    function handleRequestFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        fetch("http://localhost:5000/api/transactions", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contributionData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .then((data) => {
                console.log(data);
                handleOpenSnackbar("Contribution Recorded");
                navigate(getAllUrls(retrieveUser().roleId).communityView, { state: { communityId: communityId } });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error during login:", error);
                handleOpenSnackbar("An error occurred. Please try again.");
                setLoading(false);
            });

        console.log(contributionData);
        setLoading(false);
    }

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    Make Contribution
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
                                type='number'
                                label="Contribution Amount"
                                fullWidth
                                value={amountDetails.amount}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                label="Interest Amount"
                                fullWidth
                                value={amountDetails.interest}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                label="Total Amount"
                                fullWidth
                                value={amountDetails.total}
                                variant="outlined"
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
                                Make Contribution
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    )
}

export default MakeContribution