import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Card, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { retrieveUser } from '../auth';

function CommunityMembersComponent({ communityDetails, isCommunityHead }) {
    let [membersList, setMembersList] = useState([]);
    useEffect(() => {
        getCommunityMembers();
    }, [communityDetails])
    function getCommunityMembers() {

        if (communityDetails !== null) {
            fetch("http://localhost:5000/api/CommunityMembership/community/accepted/" + communityDetails.communityId, {
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
                    setMembersList(data);
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
                setMembersList(membersList.filter((eachmembership) => eachmembership.communityMembershipId !== membership.communityMembershipId))
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
    return (
        <Card sx={{ backgroundColor: "#ECECEC", height: "300px", padding: 1, overflowY: "scroll" }}>
            <Typography
                sx={{
                    fontWeight: 700,
                    marginBottom: 1,
                    textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                }}
                variant="h5"
            >Community Members</Typography>
            {
                membersList.map((member) => (
                    <Accordion key={member.communityMembershipId}>
                        <AccordionSummary
                            expandIcon={<span className="material-symbols-outlined">
                                keyboard_arrow_down
                            </span>}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography component="span">{member.user.firstName + " " + member.user.lastName}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>Email: {member.user.email}</Typography>
                            <Typography>PhoneNo: {member.user.phoneNo}</Typography>
                        </AccordionDetails>
                        {
                            isCommunityHead && (

                                <AccordionActions>
                                    <Button onClick={() => { rejectUserMembership(member) }} sx={{ color: 'red' }}>Remove</Button>
                                </AccordionActions>
                            )
                        }
                    </Accordion>
                ))
            }
        </Card>
    )
}

export default CommunityMembersComponent