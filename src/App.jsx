import './App.css';
import { BrowserRouter } from 'react-router-dom'; // Keep BrowserRouter here
import { useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { deleteUser, retrieveUser } from './components/auth';
import AppRoutes from './AppRoutes';

function App() {
  let [message, setMessage] = useState('');
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
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <BrowserRouter>
      <ResponsiveAppBar
        isLoggedIn={isLoggedIn}
        setLoginToFalse={setLoginToFalse} // Pass this down to handle logout
        email={retrieveUser()?.email || ''}
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
  );
}

export default App;
