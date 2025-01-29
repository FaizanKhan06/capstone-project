import { Card, Grid, Typography } from '@mui/material'
import React from 'react'

function CommunityHeaderComponent({ communityName, isPublic }) {
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
                        {communityName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: { xs: 'left', sm: 'right' } }}> {/* Left on mobile, right on larger screens */}
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            margin: 1,
                            color: isPublic ? '#1976d2' : 'red',
                        }}
                    >
                        {isPublic ? "Public" : "Private"}
                    </Typography>
                </Grid>
            </Grid>
        </Card >
    )
}

export default CommunityHeaderComponent