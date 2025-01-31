import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function MakeContribution({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const { communityDetails, email } = location.state || {};
    
    let [contributionData, setContributionData] = useState({
        email: email, communityId: communityDetails.communityId, transactionType: "Credit", amount: communityDetails.rule.contributionPerMonth, interestAmount: 0
    });

    useEffect(()=>{
        getCommunityMembership();
    },[]);
    function getCommunityMembership() {
    
            if (communityDetails !== null) {
                fetch("http://localhost:5000/api/CommunityMembership/community/user", {
                    method: "PUT",
                    headers: {
                        'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({communityId: communityDetails.communityId, email: email}),
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
                        let communityMembershipAmount = data[0].amount;
                        if(communityMembershipAmount < 0){
                            communityMembershipAmount *= -1;
                            setContributionData({
                                ...contributionData,
                                interestAmount: Math.round((communityDetails.rule.interestRate * communityMembershipAmount / 100) * 100) / 100,
                              });
                        }
                    })
                    .catch((error) => {
                        if (error.message === "404 Error") {
                            console.log("User Dows Not Have a Community");
                        } else {
                            console.error("Error during login:", error);
                            handleOpenSnackbar("An error occurred. Please try again.");
                        }
                    });
            }
        }

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
                handleOpenSnackbar("Contribution of ₹"+(contributionData.amount + contributionData.interestAmount)+" Recorded");
                navigate(getAllUrls(retrieveUser().roleId).communityView, { state: { communityId: communityDetails.communityId } });
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
                    Your Contribution is Automatically Calculated with Intrest Rates.
                </Typography>
                <form onSubmit={handleRequestFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                label="Contribution Amount"
                                fullWidth
                                value={contributionData.amount}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                label={"Interest Amount ("+communityDetails.rule.interestRate+"%)"}
                                fullWidth
                                value={contributionData.interestAmount}
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type='number'
                                label="Total Amount"
                                fullWidth
                                value={contributionData.amount + contributionData.interestAmount}
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