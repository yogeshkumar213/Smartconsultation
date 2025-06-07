// import * as React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";

import TextField from "@mui/material/TextField";
// import SigninAuth from "./SigninAuth";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// import Link from "@mui/material/Link";
// import Typography from "@mui/material/Typography";
import { useState } from "react";
import * as React from "react";
import { useAuth } from "../../context/AuthContext";
const SnackbarContext = React.createContext();
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { setRef } from "@mui/material";

// const defaultTheme = createTheme();
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../../context/Snakbarr.jsx";
export default function Authentication() {
  const [formState, setFormState] = useState(0);
  // const [userName, setUserName] = useState();
  const [Password, setPassWord] = useState("");
  const [Email, setEmail] = useState("");
  const [Licenseno, setLicenseno] = useState("");
  // const [Message, setMessage] = useState("");
  // const [open, setOpen] = React.useState(false);
  const { userLogin, docterLogin } = useAuth();
  const {  showSnakbar } = useSnackbar();
  const isformvalidate1 = Email && Password;
  const isformvalidate2 = Email && Password && Licenseno;
  // const handleClose = (event, reason) => {
  //   if (reason === "clickaway") {
  //     return;
  //   }

  //   setOpen(false);
  // };
  // const showSnakbar = (msg) => {
  //   setMessage(msg);
  //   setOpen(true);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setOpen(true);
      if (formState == 0) {
        if (!isformvalidate1) {
          alert("Both field are required");
          return;
        }
        const userloginreq = await userLogin(Email, Password);
        console.log(userloginreq);
        showSnakbar(userloginreq);
      } else {
        if (!isformvalidate2) {
          alert("Email,Password,Licenseno are required");
          return;
        }
        console.log("email",Email);
        console.log("password",Password)
        const Authdocterreq = await docterLogin(Email, Password, Licenseno);
      
        console.log(Authdocterreq);

        showSnakbar(Authdocterreq);
      }
    } catch (err) {
     
      showSnakbar(err.response.data.message)
      console.log(err);
    }
  };

  return (
    // <ThemeProvider theme={defaultTheme}>
    <Grid container component="main" sx={{ height: "80vh", width: "60vh" }}>
      <CssBaseline />
      {/* <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        /> */}
      <Grid component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar> */}
          {/* <Typography component="h1" variant="h5" mx={'1rem'}> */}
          <div style={{ display: "flex" }}>
            <Button
              variant={formState == 0 ? "contained" : null}
              onClick={() => setFormState(0)}
            >
              Patient
            </Button>
            <Button
              variant={formState == 1 ? "contained" : null}
              onClick={() => setFormState(1)}
            >
              Docter
            </Button>
          </div>

          {/* </Typography> */}

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Email"
              value={Email}
              label="Email Address"
              name="Email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="Email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="Password"
              value={Password}
              label="Password"
              type="password"
              onChange={(e) => setPassWord(e.target.value)}
              id="password"
              autoComplete="current-password"
            />

            {formState === 1 ? (
              <TextField
                margin="normal"
                required
                fullWidth
                id="Licenseno"
                label="Licenseno"
                name="Licenseno"
                autoComplete="Licenseno"
                onChange={(e) => setLicenseno(e.target.value)}
                autoFocus
              />
            ) : null}

            <Button
              type="submit"
              fullWidth
              onClick={handleSubmit}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>

            <Link to="/auth/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
            {/* <SnackbarContext.Provider value={{ showSnakbar }}>
              {children}
              <Snackbar
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
                message={Message}
                // action={action}
              />
            </SnackbarContext.Provider> */}
          </Box>
        </Box>
      </Grid>
    </Grid>
    // </ThemeProvider>
  );
}
