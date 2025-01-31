import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import { useNavigate } from 'react-router-dom';
import getAllUrls from '../urlData';
import { retrieveUser } from '../auth';
import CommunityHeaderComponent from '../CommonComponents/CommunityHeaderComponent';
import CommunityInnerDetailsComponent from '../CommonComponents/CommunityInnerDetailsComponent';
import TransactionComponent from '../CommonComponents/TransactionComponent';
import MoneyRequestsComponents from '../CommonComponents/MoneyRequestsComponents';
import CommunityMembersComponent from '../CommonComponents/CommunityMembersComponent';

function CommunityHeadDashboard({ handleOpenSnackbar }) {
    let navigate = useNavigate();
    let [communityDetails, setCommunityDetails] = useState(null);
    let [communityMemberships, setCommunityMemberships] = useState([]);
    let [loading, setLoading] = useState(false);
    let [transactionKey, setTransactionKey] = useState(0); // Key to trigger re-render
    useEffect(() => {
        setLoading(true);
        getCommunityDetails();

    }, []);
    useEffect(() => {
        getCommunityJoinRequests();

    }, [communityDetails])
    function getCommunityDetails() {
        fetch("http://localhost:5000/api/communities/communityHead/" + retrieveUser().email, {
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
    function getCommunityJoinRequests() {
        if (communityDetails !== null) {
            fetch("http://localhost:5000/api/CommunityMembership/community/" + communityDetails.communityId, {
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
                    setCommunityMemberships(data);
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

    };
    function rejectUserMembership(membership) {
        console.log("delete Membership");
        fetch("http://localhost:5000/api/CommunityMembership/" + membership.communityMembershipId, {
            method: "DELETE",
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
                setCommunityMemberships(communityMemberships.filter((eachmembership) => eachmembership.communityMembershipId !== membership.communityMembershipId));
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
    function acceptUserMembership(membership) {
        console.log("Accept User");
        fetch("http://localhost:5000/api/CommunityMembership/accepted", {
            method: "PUT",
            headers: {
                'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ communityId: membership.community.communityId, email: membership.user.email }),
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
                setCommunityMemberships(communityMemberships.filter((eachmembership) => eachmembership.communityMembershipId !== membership.communityMembershipId));
                getCommunityDetails();
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
    function setChangeAmount() {
        getCommunityDetails();
        setTransactionKey(prevKey => prevKey + 1);
        //Rerender TransactionComponent
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

                        <CommunityHeaderComponent communityDetails={communityDetails} />

                        {
                            communityDetails.rule === null ?
                                <>
                                    <Typography>You Have Created A Community but not set the rules</Typography>
                                    <Button variant='contained' onClick={() => { navigate(getAllUrls(retrieveUser().roleId).createRules, { state: { communityId: communityDetails.communityId } }); }}>SET RULE</Button>
                                </>
                                :
                                <>
                                    <CommunityInnerDetailsComponent communityDetails={communityDetails} />
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
                                                    communityMemberships.map((member) => (
                                                        <Accordion key={member.communityMembershipId}>
                                                            <AccordionSummary
                                                                expandIcon={<span className="material-symbols-outlined">
                                                                    keyboard_arrow_down
                                                                </span>}
                                                                aria-controls="panel2-content"
                                                                id="panel2-header"
                                                            >
                                                                <Typography component="span">{member.user.firstName + " " + member.user.lastName}<Typography sx={{ fontSize: "12px", color: "gray" }}>has requested to join</Typography></Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                <Typography>Email: {member.user.email}</Typography>
                                                                <Typography>PhoneNo: {member.user.phoneNo}</Typography>
                                                            </AccordionDetails>
                                                            <AccordionActions>
                                                                <Button onClick={() => { acceptUserMembership(member) }}>Accept</Button>
                                                                <Button onClick={() => { rejectUserMembership(member) }} sx={{ color: 'red' }}>Reject</Button>
                                                            </AccordionActions>
                                                        </Accordion>
                                                    ))
                                                }
                                                {
                                                    <MoneyRequestsComponents handleOpenSnackbar={handleOpenSnackbar} communityDetails={communityDetails} isCommunityHead={true} changeAmount={setChangeAmount} />
                                                }
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <CommunityMembersComponent communityDetails={communityDetails} isCommunityHead={true} />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <TransactionComponent communityId={communityDetails.communityId} key={transactionKey} />
                                        </Grid>
                                    </Grid>

                                </>
                        }
                    </ Box >
                )
            }
            {
                communityDetails === null && !loading && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '90vh',
                        }}
                    >
                        <Typography variant='h4'>You have not yet created a Community</Typography>
                        <Typography>You can Create one by clicking on the button below</Typography>
                        <Button variant='contained' sx={{ marginY: '10px' }} onClick={() => navigate(getAllUrls(retrieveUser().roleId).createCommunity)}>Create a Community</Button>
                    </Box>
                )
            }
        </>
    )
};

export default CommunityHeadDashboard;