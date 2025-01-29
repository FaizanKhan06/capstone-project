import { Card, Grid, Typography } from '@mui/material';
import React from 'react'

function CommunityInnerDetailsComponent({ currentAmount, communityStartDate }) {
    const formatDate = (dateStr) => {
        const dateObj = new Date(dateStr);
        return dateObj.toLocaleDateString('en-GB'); // DD-MM-YYYY format
    };
    return (
        <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: "#ECECEC" }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            margin: 1,
                            textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                        }}
                        variant="h5"
                    >
                        Next Contribution Date: {formatDate(communityStartDate)}
                    </Typography>
                </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: "#ECECEC" }}>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            margin: 1,
                            textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                        }}
                        variant="h5"
                    >
                        Current Amount In Wallet: ₹{currentAmount}
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    )
}

export default CommunityInnerDetailsComponent