import { Box, Button, Checkbox, Container, Grid, Switch, TextField, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { retrieveUser } from '../auth';
import getAllUrls from '../urlData';

function CreateCommunity({ handleOpenSnackbar }) {
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    let [communityData, setCommunityData] = useState({ communityName: "", communityHead: retrieveUser().email, public: true });
    
    function handleLoginFormSubmit(event) {
        setLoading(true);
        event.preventDefault();
        console.log(communityData);
        fetch("http://localhost:5000/api/communities", {
            method: "POST",
            headers: {
                'Authorization': 'Bearer ' + retrieveUser().jwtToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(communityData),
        })
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 403) {
                        throw new Error("403 Error");
                    }
                    throw new Error("Network response was not ok");
                }
                return response.text().then((text) => (text ? JSON.parse(text) : {}));
            })
            .then((data) => {
                console.log(data);

                if (data.communityId !== undefined) {
                    handleOpenSnackbar("CommunityCreated");
                    navigate(getAllUrls(retrieveUser().roleId).createRules, { state: { communityId: data.communityId } });
                } else {
                    handleOpenSnackbar("You Already have a Community");
                    navigate(getAllUrls(retrieveUser().roleId).dashboard);
                }
                setLoading(false);
            })
            .catch((error) => {
                if (error.message === "403 Error") {
                    handleOpenSnackbar("403 Error");
                } else {
                    console.error("Error during login:", error);
                    handleOpenSnackbar("An error occurred. Please try again.");
                }
                setLoading(false);
            });

    }
    function handleChangeInput(event) {
        setCommunityData({
            ...communityData,
            [event.target.name]: event.target.value,
        });
    }
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh',
            }}
        >
            <Container component="main" maxWidth="xs">
                <Typography variant="h5" align="center" sx={{ paddingY: "10px" }}>
                    Create Your Community
                </Typography>
                <form onSubmit={handleLoginFormSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                type='text'
                                name='communityName'
                                label="Community Name"
                                fullWidth
                                variant="outlined"
                                value={communityData.communityName}
                                onChange={handleChangeInput}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Switch defaultChecked onChange={(event) => setCommunityData({
                                ...communityData,
                                isPublic: event.target.checked,
                            })} />
                            <Typography>Public</Typography>
                            <Tooltip title="Your Community will be visible to everyone if Public">
                                <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>
                                    info
                                </span>
                            </Tooltip>
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
                                type="submit"
                                loading={loading}
                            >
                                Create
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Box>
    )
}

export default CreateCommunity