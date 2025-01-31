import { Card, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

function CommunityInnerDetailsComponent({ communityDetails}) {
    const [newDate, setNewDate] = useState("");
    useEffect(()=>{
        if(communityDetails!==null && communityDetails.rule !== undefined){
                    const firstDateObj = new Date(communityDetails.rule.communityStartDate);
                    const secondDateObj = new Date(communityDetails.rule.contributionDeadline);
                    const newDateObj = new Date(communityDetails.nextContributionDate);
        
                    // Calculate the difference in milliseconds
                    const diffInTime = secondDateObj.getTime() - firstDateObj.getTime();
        
                    // Convert the difference to days (1 day = 24 * 60 * 60 * 1000 ms)
                    const diffInDays = diffInTime / (1000 * 60 * 60 * 24);
        
                    // Add the difference (in days) to the new date
                    newDateObj.setDate(newDateObj.getDate() + diffInDays);
        
                    // Store the new date in the state
                    setNewDate(newDateObj.toISOString());
                }
    },[]);
    
    const formatDate = (dateStr) => {
        const dateObj = new Date(dateStr);
        
        const day = String(dateObj.getDate()).padStart(2, '0'); // Get day and pad with leading zero if necessary
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
        const year = dateObj.getFullYear(); // Get the full year
        
        return `${day}/${month}/${year}`; // Return in DD/MM/YYYY format
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
                        variant="h6"
                    >
                        Next Contribution Period: {formatDate(communityDetails.nextContributionDate)} - {formatDate(newDate)}
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
                        Current Amount In Wallet: ₹{communityDetails.currentAmount}
                    </Typography>
                </Card>
            </Grid>
        </Grid>
    )
}

export default CommunityInnerDetailsComponent