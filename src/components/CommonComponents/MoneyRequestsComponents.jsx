import React, { useEffect, useState } from "react";
import { retrieveUser } from "../auth";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from "@mui/material";

function MoneyRequestsComponents({
  handleOpenSnackbar,
  communityDetails,
  isCommunityHead,
  changeAmount,
}) {
  let [moneyRequests, setMoneyRequests] = useState([]);
  useEffect(() => {
    getCommunityMoneyRequests();
  }, []);
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
  function getCommunityMoneyRequests() {
    if (communityDetails !== null) {
      fetch(
        "http://localhost:5000/api/requests/communities/" +
          communityDetails.communityId,
        {
          method: "GET",
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
          setMoneyRequests(data);
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
  }

  function handleApproveRequest(requestId) {
    fetch("http://localhost:5000/api/requests/status/approved/" + requestId, {
      method: "PUT",
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
        if (data.requestId === undefined) {
          handleOpenSnackbar(
            "There's not enough money to process the approve request"
          );
        } else {
          handleOpenSnackbar("Request Approved");
          changeAmount(true);
          setMoneyRequests(
            moneyRequests.filter(
              (eachMoneyRequest) => eachMoneyRequest.requestId !== requestId
            )
          );
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

  function handleRejectRequest(requestId) {
    fetch("http://localhost:5000/api/requests/status/rejected/" + requestId, {
      method: "PUT",
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
        if (data.requestId === undefined) {
          handleOpenSnackbar(
            "There's not enough money to process the approve request"
          );
        } else {
          handleOpenSnackbar("Request Rejected");
          changeAmount(true);
          setMoneyRequests(
            moneyRequests.filter(
              (eachMoneyRequest) => eachMoneyRequest.requestId !== requestId
            )
          );
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

  function handleCreatePoll() {
    fetch(
      "http://localhost:5000/api/polls?communityId=" +
        communityDetails.communityId,
      {
        method: "POST",
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
  return (
    <>
      {moneyRequests.map((requests) => (
        <Accordion key={requests.requestId}>
          <AccordionSummary
            expandIcon={
              <span className="material-symbols-outlined">
                keyboard_arrow_down
              </span>
            }
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography component="span">
              {requests.user.firstName + " " + requests.user.lastName}
              <Typography sx={{ fontSize: "12px", color: "gray" }}>
                has requested for funds
              </Typography>{" "}
              <span style={{ fontSize: "12px", color: "gray" }}>
                {formatDate(requests.requestDateTime)}
              </span>
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Email: {requests.user.email}</Typography>
            <Typography>PhoneNo: {requests.user.phoneNo}</Typography>
            <Typography>Amount: ₹{requests.amount}</Typography>
            <Typography>Reason: {requests.requestReason}</Typography>
          </AccordionDetails>
          {isCommunityHead && requests.status === "pending" && (
            <AccordionActions>
              <Button
                onClick={() => handleRejectRequest(requests.requestId)}
                sx={{ color: "red" }}
              >
                Reject
              </Button>
              <Button onClick={() => handleApproveRequest(requests.requestId)}>
                Approve
              </Button>
            </AccordionActions>
          )}
        </Accordion>
      ))}
      {isCommunityHead && moneyRequests.length > 1 && (
        <Button
          sx={{ marginY: 1 }}
          variant="contained"
          fullWidth
          onClick={() => handleCreatePoll()}
        >
          {" "}
          Create Poll{" "}
        </Button>
      )}
    </>
  );
}

export default MoneyRequestsComponents;
