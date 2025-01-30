import { Box, Card, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { retrieveUser } from '../auth';

function TransactionComponent({ communityId }) {
    let [transactions, setTransactions] = useState(null);
    useEffect(() => {
        getCommunityTransactions();
    }, [])
    function getCommunityTransactions() {
        fetch("http://localhost:5000/api/transactions/communities/" + communityId, {
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
                setTransactions(data);
            })
            .catch((error) => {
                if (error.message === "404 Error") {
                    console.log("User Dows Not Have a Community");
                } else {
                    console.error("Error during login:", error);
                }
            });
    }
    return (

        <Card sx={{ backgroundColor: "#ECECEC", height: "300px", padding: 1, overflowY: "scroll" }}>
            <Typography
                sx={{
                    fontWeight: 700,
                    marginBottom: 1,
                    textAlign: { xs: 'left', sm: 'left' }, // Align to the left on all screen sizes
                }}
                variant="h5"
            >Transactions</Typography>
            {
                transactions !== null && (transactions.map((transaction) => (
                    <Box key={transaction.transactionId}>
                        <Typography>{transaction.user.firstName} has {transaction.transactionType === "Credit" && ("made a")} {transaction.transactionType === "Credit" ? <span style={{ color: "green" }}>contribution</span> : <span style={{ color: "red" }}>borrowed</span>} {transaction.transactionType === "Debit" && ("a sum")} of ₹{transaction.amount + transaction.interestAmount}</Typography>
                    </Box>
                )))
            }
        </Card>
    )
}

export default TransactionComponent