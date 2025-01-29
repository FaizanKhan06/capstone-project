import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import CommunityHeaderComponent from '../CommonComponents/CommunityHeaderComponent';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Grid, Typography } from '@mui/material';
import { retrieveUser } from '../auth';
import CommunityInnerDetailsComponent from '../CommonComponents/CommunityInnerDetailsComponent';
import Loader from '../Loader';
import TransactionComponent from '../CommonComponents/TransactionComponent';
import MoneyRequestsComponents from '../CommonComponents/MoneyRequestsComponents';
import CommunityMembersComponent from '../CommonComponents/CommunityMembersComponent';
import getAllUrls from '../urlData';


function CommunityView({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { communityId } = location.state || {};

    let [communityDetails, setCommunityDetails] = useState(null);
    let [loading, setLoading] = useState(true);
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

    function handleMakeRequest() {
        navigate(getAllUrls(retrieveUser().roleId).makeRequest, { state: { communityId: communityDetails.communityId, email: retrieveUser().email, maxAmount: communityDetails.currentAmount } });
    }
    return (
        <>
            {
                loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '90vh',
                        }}
                    >
                        <Loader></Loader>
                    </Box>
                )
            }
            {
                communityDetails !== null && !loading && (
                    <Box sx={{ paddingX: "10px", paddingY: "20px" }}>
                        <CommunityHeaderComponent communityName={communityDetails.communityName} isPublic={communityDetails.public} />
                        <CommunityInnerDetailsComponent currentAmount={communityDetails.currentAmount} communityStartDate={communityDetails.nextContributionDate} />
                        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TransactionComponent communityId={communityId} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CommunityMembersComponent communityDetails={communityDetails} isCommunityHead={false} />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Card sx={{ backgroundColor: "#ECECEC", height: "300px", padding: 1, overflowY: "scroll" }}>
                                    <Typography
                                        sx={{
                                            fontWeight: 700,
                                            marginBottom: 1,
                                            textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                                        }}
                                        variant="h5"
                                    >Requests</Typography>
                                    {
                                        <MoneyRequestsComponents communityDetails={communityDetails} isCommunityHead={false} />
                                    }
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <Button variant='contained' fullWidth>Make Contribution</Button>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button variant='contained' onClick={handleMakeRequest} color="error" fullWidth>Make Request</Button>
                            </Grid>
                        </Grid>
                    </Box>
                )
            }
        </>
    )
}

export default CommunityView