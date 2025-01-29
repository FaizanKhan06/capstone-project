import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function UserDashboard({ handleOpenSnackbar }) {
    let navigate = useNavigate();
    let [publicCommunityDetails, setPublicCommunityDetails] = useState([]);
    let [userCommunityDetails, setUserCommunityDetails] = useState([]);
    let [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        getAllPublicCommunities();
        getAllJoinedCommunities();
    }, []);

    useEffect(() => {
        setPublicCommunityDetails(publicCommunityDetails.filter(
            publicCommunity =>
                !userCommunityDetails.some(
                    userCommunity => userCommunity.communityId === publicCommunity.communityId
                )
        ));
    }, [userCommunityDetails]);

    function getAllPublicCommunities() {
        fetch("http://localhost:5000/api/communities/notActive", {
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
                setPublicCommunityDetails(data);
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
    }

    function getAllJoinedCommunities() {
        fetch("http://localhost:5000/api/CommunityMembership/user/" + retrieveUser().email, {
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
                let elemArray = [];
                data.forEach(element => {
                    if (element.accepted) {
                        elemArray.push(element.community);
                    }
                });
                setUserCommunityDetails(elemArray);

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
    }

    function goToCommunityDetailsWithJoinOption(data) {
        navigate(getAllUrls(retrieveUser().roleId).communityJoin, { state: { communityDetails: data } })
    }

    function goToCommunityDetails(community) {
        navigate(getAllUrls(retrieveUser().roleId).communityView, { state: { communityId: community.communityId } });
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

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Accordion>
                    <AccordionSummary
                        expandIcon={<span className="material-symbols-outlined">
                            keyboard_arrow_down
                        </span>}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography component="span">Joined Communitites</Typography>
                    </AccordionSummary>
                    <AccordionDetails>

                        {userCommunityDetails.length !== 0 && !loading && (
                            <Box>
                                {
                                    userCommunityDetails.map((userCommunityDetail) => (
                                        <Card key={userCommunityDetail.communityId} sx={{ padding: 1, backgroundColor: "#ECECEC", marginBottom: 1 }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} sm={6}>
                                                    <Button onClick={() => goToCommunityDetails(userCommunityDetail)}
                                                        sx={{
                                                            textAlign: { xs: 'left', sm: 'left' },
                                                            color: 'black',
                                                        }}
                                                    >
                                                        {userCommunityDetail.communityName}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    ))
                                }
                            </Box>
                        )}
                        {
                            userCommunityDetails.length === 0 && !loading && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography>You have not joined any communities</Typography>
                                </Box>
                            )
                        }
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                        expandIcon={<span className="material-symbols-outlined">
                            keyboard_arrow_down
                        </span>}
                        aria-controls="panel2-content"
                        id="panel2-header"
                    >
                        <Typography component="span">Public Communities</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {publicCommunityDetails.length !== 0 && !loading && (
                            <Box>
                                {
                                    publicCommunityDetails.map((publicCommunityDetail) => (
                                        <Card key={publicCommunityDetail.communityId} sx={{ padding: 1, backgroundColor: "#ECECEC", marginBottom: 1 }}>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} sm={6}>
                                                    <Button onClick={() => goToCommunityDetailsWithJoinOption(publicCommunityDetail)}
                                                        sx={{
                                                            textAlign: { xs: 'left', sm: 'left' },
                                                            color: 'black',
                                                        }}
                                                    >
                                                        {publicCommunityDetail.communityName}
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}> {/* Left on mobile, right on larger screens */}
                                                    <Button onClick={() => goToCommunityDetailsWithJoinOption(publicCommunityDetail)} variant='contained'>Join</Button>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    ))
                                }
                            </Box>
                        )}
                        {
                            publicCommunityDetails.length === 0 && !loading && (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Typography>There Are No Communities To Display</Typography>
                                </Box>
                            )
                        }
                    </AccordionDetails>
                </Accordion>

            </Box>
        </>
    )
};

export default UserDashboard;