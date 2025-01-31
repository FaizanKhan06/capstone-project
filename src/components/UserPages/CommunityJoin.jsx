import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';


import { Box, Button, Container, FormHelperText, Grid, TextField, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function CommunityJoin({ handleOpenSnackbar }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const maxLength = 255;
    const { communityDetails } = location.state || {};
    console.log(communityDetails);

    function handleJoin() {
        setLoading(true);
        console.log(communityDetails.communityId, retrieveUser().email);
        fetch("http://localhost:5000/api/CommunityMembership", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                communityId: communityDetails.communityId,
                email: retrieveUser().email
            }),
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
                if (data.communityId === undefined) {
                    handleOpenSnackbar("You have already Requested to Join");
                } else {
                    handleOpenSnackbar("You have Requested to Join");
                }
                navigate(getAllUrls(retrieveUser().roleId).dashboard);
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === "404 Error") {
                    console.log("404 Error");
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
            }}
        >
            <Container component="main" maxWidth="xl">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    {communityDetails.communityName}
                </Typography>
                {/* <form onSubmit={handleLoginFormSubmit}> */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            disabled
                            type='text'
                            label="Terms And Conditions"
                            fullWidth
                            multiline
                            rows={14}
                            variant="outlined"
                            value={communityDetails.rule.termsAndConditions}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <Box
                                    sx={{
                                        gap: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%', // Ensures the Box takes full width
                                    }}
                                >
                                    <DatePicker
                                        disabled
                                        fullWidth
                                        defaultValue={dayjs(communityDetails.rule.communityStartDate.split("T")[0])}
                                        label="Community Start Date *"
                                    />

                                    <DatePicker
                                        disabled
                                        fullWidth
                                        defaultValue={dayjs(communityDetails.rule.contributionDeadline.split("T")[0])}
                                        label="Contribution DeadLine *"
                                    />

                                    <TextField name='termPeriod'
                                        disabled
                                        value={communityDetails.rule.termPeriod}
                                        required fullWidth label="Term Period (Months)" type='number' variant='outlined' />

                                    <TextField name='interestRate'
                                        disabled
                                        value={communityDetails.rule.interestRate}
                                        fullWidth label="Interest Rates (%)" type='number' variant='outlined' />

                                    <TextField name='contributionPerMonth'
                                        disabled
                                        value={communityDetails.rule.contributionPerMonth}
                                        required fullWidth label="Contribution Amount (per month)" type='number' variant='outlined' />
                                </Box>
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid>


                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            loading={loading}
                            onClick={() => handleJoin()}>
                            Join
                        </Button>
                    </Grid>
                </Grid>
                {/* </form> */}
            </Container>
        </Box>
    )
}

export default CommunityJoin