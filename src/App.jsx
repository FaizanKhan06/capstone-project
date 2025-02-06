import "./App.css";
import { BrowserRouter } from "react-router-dom"; // Keep BrowserRouter here
import { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import { deleteUser, retrieveUser } from "./components/auth";
import AppRoutes from "./AppRoutes";

import { createTheme, ThemeProvider } from "@mui/material";

function App() {
  let [message, setMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  let [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (retrieveUser() !== null) {
      setLoginToTrue();
    }
  }, []);

  const setLoginToTrue = () => {
    setIsLoggedIn(true);
  };

  const setLoginToFalse = () => {
    setIsLoggedIn(false);
    deleteUser();
  };

  const handleOpenSnackbar = (message) => {
    setOpenSnackBar(true);
    setMessage(message);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  const theme = createTheme({
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            fontFamily: `"Fira Code", serif`,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            // Custom styles for the switch component
          },
          switchBase: {
            color: "#059669", // Default color for the switch thumb (unchecked state)
            "&:hover": {
              backgroundColor: "rgba(5, 150, 105, 0.08)", // Hover state background
            },
            "&.Mui-checked": {
              color: "#09c58b", // Color when the switch is checked
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#059669", // Background color for the track when the switch is checked
            },
          },
          thumb: {
            color: "#059669", // Color of the thumb (unchecked state)
          },
          track: {
            backgroundColor: "gray", // Background color of the track (unchecked state)
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none", // Remove capitalization for all button variants
            boxShadow: "none",
            fontFamily: `"Fira Code", serif`,

            // Contained variant styles
            "&.MuiButton-contained": {
              backgroundColor: "#e6f4ef", // Contained variant default color
              color: "#059669",
              "&:hover": {
                backgroundColor: "#059669", // Contained variant default color
                color: "#e6f4ef", // Contained variant hover color
              },
              "&:active": {
                backgroundColor: "#059669", // Contained variant default color
                color: "#e6f4ef", // Contained variant hover color
              },
            },

            // Outlined variant styles
            "&.MuiButton-outlined": {
              borderColor: "#059669", // Outlined variant default border color
              color: "#059669", // Outlined variant default text color
              "&:hover": {
                borderColor: "#e6f4ef", // Outlined variant hover border color
                color: "#059669", // Outlined variant hover text color
              },
              "&:active": {
                borderColor: "#e6f4ef", // Outlined variant hover border color
                color: "#059669", // Outlined variant hover text color
              },
            },

            // Text variant styles
            "&.MuiButton-text": {
              color: "#059669",
              "&:hover": {
                color: "#09c58b",
              },
              "&:active": {
                color: "#09c58b",
              },
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            // Remove box shadow from text fields
            boxShadow: "none",
            background: "white",

            // Outlined variant styles for TextField
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#059669", // Outlined variant border color
              },
              "&:hover fieldset": {
                borderColor: "#09c58b", // Outlined variant hover border color
              },
              "&.Mui-focused fieldset": {
                borderColor: "#059669", // Outlined variant focused border color
              },
            },

            // Filled variant styles for TextField
            "& .MuiFilledInput-root": {
              backgroundColor: "#e6f4ef", // Filled variant background color
              "&:hover": {
                backgroundColor: "#b9e0cd", // Filled variant hover background color
              },
              "&.Mui-focused": {
                backgroundColor: "#e6f4ef", // Filled variant focused background color
              },
            },

            // Standard variant styles for TextField
            "& .MuiInput-root": {
              "&:before": {
                borderBottom: "1px solid #059669", // Standard variant default bottom border color
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "1px solid #09c58b", // Standard variant hover bottom border color
              },
              "&.Mui-focused:before": {
                borderBottom: "1px solid #059669", // Standard variant focused bottom border color
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "#059669", // Default label color
            fontFamily: `"Fira Code", serif`,
            "&.Mui-focused": {
              color: "#059669",
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            fontFamily: `"Fira Code", serif`,
            fontSize: "16px", // Adjust the font size if needed
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "#059669", // Default color for checkbox (unchecked state)
            "&.Mui-checked": {
              color: "#059669", // Color when checkbox is checked
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            color: "#059669", // Default text color for Select input
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#059669", // Default border color for Select
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#09c58b", // Hover state border color for Select
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#059669", // Focused state border color for Select
            },
          },
          icon: {
            color: "#059669", // Default color for the dropdown icon
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: "#059669", // Default text color for MenuItems
            "&:hover": {
              backgroundColor: "#b9e0cd", // MenuItem hover background color
              color: "#059669", // MenuItem hover text color
            },
            "&.Mui-selected": {
              backgroundColor: "#e6f4ef", // Selected MenuItem background color
              color: "#059669", // Selected MenuItem text color
            },
            "&.Mui-selected:hover": {
              backgroundColor: "#09c58b", // Selected and hovered MenuItem background color
              color: "#ffffff", // Selected and hovered MenuItem text color
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ResponsiveAppBar
          isLoggedIn={isLoggedIn}
          setLoginToFalse={setLoginToFalse} // Pass this down to handle logout
          email={retrieveUser()?.email || ""}
        />
        <AppRoutes
          setLoginToTrue={setLoginToTrue}
          handleOpenSnackbar={handleOpenSnackbar}
        />
        <Snackbar
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={handleCloseSnackbar}
          message={message}
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
