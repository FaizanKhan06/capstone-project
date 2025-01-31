import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import getAllUrls from '../urlData';
import { retrieveUser } from '../auth';

import { Box, Button, Container, FormHelperText, Grid, TextField, Typography } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

function CreateRules({ handleOpenSnackbar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const maxLength = 255;
  const { communityId } = location.state || {};
  const [loading, setLoading] = useState(false);
  let [rulesData, setRulesData] = useState({ termsAndConditions: "", contributionPerMonth: "", termPeriod: "", interestRate: "", contributionDeadline: "", communityStartDate: "", communityId: communityId });

  if (!communityId) {
    navigate(getAllUrls(retrieveUser().roleId).dashboard);
    handleOpenSnackbar("Invalid Request");
  }

  function validateDates() {
    const communityStartDate = dayjs(rulesData.communityStartDate);
    const contributionDeadline = dayjs(rulesData.contributionDeadline);

    if (!rulesData.communityStartDate) {
      handleOpenSnackbar("Community Start Date cannot be empty");
      return false;
    }

    if (communityStartDate.date() < 1 || communityStartDate.date() > 10) {
      handleOpenSnackbar("Community Start Date must be between the 1st and 10th of the month");
      return false;
    }

    if (!rulesData.contributionDeadline) {
      handleOpenSnackbar("Contribution Deadline cannot be empty");
      return false;
    }

    if (contributionDeadline.month() !== communityStartDate.month() || contributionDeadline.year() !== communityStartDate.year()) {
      handleOpenSnackbar("Contribution Date must be in the same month and year as the Community Start Date");
      return false;
    }

    const daysDifference = contributionDeadline.diff(communityStartDate, 'day');
    if (daysDifference < 2 || daysDifference > 10) {
      handleOpenSnackbar("Contribution Date must be between 2 and 10 days after the Community Start Date");
      return false;
    }

    return true;
  }

  function handleLoginFormSubmit(event) {
    setLoading(true);
    event.preventDefault();
    if (!validateDates()) {
      setLoading(false);
      return;
    }
    console.log(rulesData);
    fetch("http://localhost:5000/api/rules", {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + retrieveUser().jwtToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rulesData),
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

        handleOpenSnackbar("Rules Are Set.");
        navigate(getAllUrls(retrieveUser().roleId).dashboard);
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
    setRulesData({
      ...rulesData,
      [event.target.name]: event.target.value,
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
          Set Community Rules
        </Typography>
        <form onSubmit={handleLoginFormSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                type='text'
                label="Terms And Conditions"
                fullWidth
                multiline
                rows={14}
                variant="outlined"
                name='termsAndConditions'
                value={rulesData.termsAndConditions}
                onChange={handleChangeInput}
                required
                InputProps={{
                  endAdornment: (
                    <Box sx={{ position: 'absolute', bottom: 8, right: 8 }}>
                      <FormHelperText sx={{ color: rulesData.termsAndConditions.length > maxLength ? "red" : "black" }}>{`${rulesData.termsAndConditions.length} / ${maxLength}`}</FormHelperText>
                    </Box>
                  ),
                }}
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
                      fullWidth
                      label="Community Start Date *"
                      onChange={(e) => {
                        const formattedDate = `${e.$y}-${(e.$M + 1).toString().padStart(2, '0')}-${e.$D.toString().padStart(2, '0')}T00:00:00`;
                        setRulesData({
                          ...rulesData,
                          communityStartDate: formattedDate,
                        });
                      }}
                    />

                    <DatePicker
                      fullWidth
                      label="Contribution Deadline *"
                      onChange={(e) => {
                        const formattedDate = `${e.$y}-${(e.$M + 1).toString().padStart(2, '0')}-${e.$D.toString().padStart(2, '0')}T00:00:00`;
                        setRulesData({
                          ...rulesData,
                          contributionDeadline: formattedDate,
                        });
                      }}
                    />

                    <TextField name='termPeriod'
                      value={rulesData.termPeriod}
                      onChange={handleChangeInput} required fullWidth label="Term Period (Months)" type='number' variant='outlined' />

                    <TextField name='interestRate'
                      value={rulesData.interestRate}
                      onChange={handleChangeInput} required fullWidth label="Interest Rates (%)" type='number' variant='outlined' />


                    <TextField name='contributionPerMonth'
                      value={rulesData.contributionPerMonth}
                      onChange={handleChangeInput} required fullWidth label="Contribution Amount (per month)" type='number' variant='outlined' />
                  </Box>
                </DemoContainer>
              </LocalizationProvider>
            </Grid>


            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                loading={loading}
              >
                Set Rules
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Box>
  )
}

export default CreateRules