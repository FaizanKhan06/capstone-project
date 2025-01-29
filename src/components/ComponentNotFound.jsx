import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function ComponentNotFound() {
    let navigate = useNavigate();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h2" align="center">
                404
            </Typography>
            <Typography variant="h6" align="center">
                Page Not Found
            </Typography>
            <Button size="large" onClick={() => navigate('/')}>
                <span className="material-symbols-outlined">
                    arrow_back
                </span>
                Go Back Home
            </Button>
        </Box>

    )
}

export default ComponentNotFound