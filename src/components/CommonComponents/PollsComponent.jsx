import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PollModule from "./PollModule";
import { retrieveUser } from "../auth";

function PollsComponent({ handleOpenSnackbar, communityId, isCommunityHead }) {
  const [selectedValue, setSelectedValue] = useState(""); // State to store the selected value

  const [pollVoteEntities, setPollVoteEntities] = useState([]);

  const [pollId, setPollId] = useState(null);
  const [pollDate, setPollDate] = useState(null);

  useEffect(() => {
    getActivePoll();
  }, []);

  function getActivePoll() {
    fetch("http://localhost:5000/api/polls/active/" + communityId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + retrieveUser().jwtToken,
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
        setPollId(data.pollId);
        setPollDate(data.pollStartDate);
        if (data.allPollVotes !== undefined) {
          data.allPollVotes.forEach((pollVote) => {
            if (pollVote.email === retrieveUser().email) {
              setSelectedValue(pollVote.votedEmail);
            }
          });
          if (data.pollId !== undefined) {
            // Create a new array to hold the updated poll vote entities
            let updatedPollVoteEntities = [...pollVoteEntities];

            // First loop to add new users if necessary
            data.allRequests.forEach((request) => {
              // Check if the email already exists in the array
              const emailExists = updatedPollVoteEntities.some(
                (item) => item.email === request.user.email
              );

              // If the email doesn't exist, add the new user
              if (!emailExists) {
                updatedPollVoteEntities.push({
                  name: request.user.firstName + " " + request.user.lastName,
                  currentVotes: 0,
                  email: request.user.email,
                });
              }
            });

            // Second loop to increment currentVotes for users who voted
            data.allPollVotes.forEach((pollVote) => {
              updatedPollVoteEntities = updatedPollVoteEntities.map((item) => {
                // If votedEmail matches the item email, increment currentVotes
                if (item.email === pollVote.votedEmail) {
                  return {
                    ...item,
                    currentVotes: item.currentVotes + 1,
                  };
                }
                return item;
              });
            });

            // Finally, update the state with the new list of poll vote entities
            setPollVoteEntities(updatedPollVoteEntities);
          }
        }
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

  const [maxVotes, setMaxVotes] = useState(0); // State variable for max votes

  useEffect(() => {
    // Get the max value of currentVotes from pollVoteEntities
    const max = Math.max(
      ...pollVoteEntities.map((entity) => entity.currentVotes)
    );
    setMaxVotes(max); // Save the max value in the state variable
  }, [pollVoteEntities]); // Re-run when pollVoteEntities changes

  const handleChange = (event) => {
    const selectedEmail = event.target.value; // Get the email of the selected entity
    const previousEmail = selectedValue; // Store the previous selected value

    if (selectedEmail !== previousEmail) {
      // Update the votes for the previously selected entity (decrement the vote)
      setPollVoteEntities((prevEntities) =>
        prevEntities.map((entity) =>
          entity.email === previousEmail
            ? { ...entity, currentVotes: entity.currentVotes - 1 }
            : entity
        )
      );

      // Update the votes for the newly selected entity (increment the vote)
      setPollVoteEntities((prevEntities) =>
        prevEntities.map((entity) =>
          entity.email === selectedEmail
            ? { ...entity, currentVotes: entity.currentVotes + 1 }
            : entity
        )
      );
    }

    setSelectedValue(selectedEmail); // Update selected value state
    console.log("Selected Value: ", selectedEmail); // Log the selected value
    addOrUpdateVote(selectedEmail);
  };

  function addOrUpdateVote(votedEmail) {
    fetch("http://localhost:5000/api/poll-vote", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + retrieveUser().jwtToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pollId: pollId,
        email: retrieveUser().email,
        votedEmail: votedEmail,
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

  function formatDate(dateStr) {
    // Create a Date object from the input string
    const date = new Date(dateStr);

    // Format the date to match the desired output
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()} on ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    return formattedDate;
  }

  function deleteVote(votedEmail) {
    fetch(
      "http://localhost:5000/api/polls/" +
        pollId +
        "?pollResult=" +
        pollResult.email,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + retrieveUser().jwtToken,
          "Content-Type": "application/json",
        },
      }
    )
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

  const [open, setOpen] = useState(false);
  const [pollResult, setPollResult] = useState(null);
  const handleOpenDialog = () => {
    let pollRes = pollVoteEntities.reduce((max, pollVote) => {
      return pollVote.currentVotes > max.currentVotes ? pollVote : max;
    });
    setPollResult(pollRes);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  return (
    <>
      {pollId !== null && pollId !== undefined && (
        <Card sx={{ padding: 2 }}>
          <Typography sx={{ marginBottom: 2 }}>
            Who should get the money?
          </Typography>
          <FormControl fullWidth>
            <RadioGroup value={selectedValue} onChange={handleChange}>
              {pollVoteEntities.map((entity) => (
                <PollModule
                  key={entity.email}
                  email={entity.email}
                  name={entity.name}
                  totalVotes={maxVotes}
                  numberOfVotes={entity.currentVotes}
                />
              ))}
            </RadioGroup>
            {isCommunityHead && (
              <Button
                variant="contained"
                color="error"
                sx={{ marginY: 2 }}
                onClick={handleOpenDialog}
              >
                End Poll
              </Button>
            )}
          </FormControl>
          <Typography
            sx={{ textAlign: "right", color: "gray", fontSize: "14px" }}
          >
            {formatDate(pollDate)}
          </Typography>
        </Card>
      )}

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Poll Result:</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pollResult !== null && (
              <span style={{ fontWeight: 900 }}>
                {pollResult.name + " (" + pollResult.email + ")"}
              </span>
            )}{" "}
            has been selected by the members.
          </DialogContentText>
          <DialogContentText>
            By Clicking on Ok the poll will end
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleCloseDialog();
              console.log(pollId, pollResult.email);
              deleteVote();
            }}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default PollsComponent;
