import { Card, Grid, Typography } from '@mui/material'
import React from 'react'

function CommunityHeaderComponent({ communityDetails }) {
    return (
        <Card sx={{ backgroundColor: "#ECECEC", marginBottom: 2 }}>
            <Grid container alignItems="center">
                <Grid item xs={12} sm={6}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            margin: 1,
                            textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                        }}
                        variant="h5"
                    >
                        {communityDetails.communityName} <span style={{color: 'gray'}}>{!communityDetails.active && ("(Not Yet Active)")} {!communityDetails.active && communityDetails.deleted && ("(Not Active!! Ended)")} </span>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}> {/* Left on mobile, right on larger screens */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            margin: 1,
                            color: communityDetails.public ? '#1976d2' : 'red',
                        }}
                    >
                        {communityDetails.public ? "Public" : "Private"}
                    </Typography>
                </Grid>
            </Grid>
        </Card >
    )
}

export default CommunityHeaderComponent