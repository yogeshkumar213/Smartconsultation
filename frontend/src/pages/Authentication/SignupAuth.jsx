import * as React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
// import DocterDash from "./DocterDash";
import MenuItem from "@mui/material/MenuItem";
// import { SelectChangeEvent } from "@mui/material"; // ✅ Correct
import Select from "@mui/material/Select";
import SelectChangeEvent from "@mui/material/Select";

// import SigninAuth from "./SigninAuth";
import Paper from "@mui/material/Paper";
import { useSnackbar } from "../../context/Snakbarr.jsx";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useAuth } from "../../context/AuthContext.jsx";

import { useState } from "react";
import { useContext } from "react";



export default function Authentication() {
  const [FormState, setFormState] = useState(0);
  const [UserName, setUserName] = useState("");
  const [Password, setPassWord] = useState("");
  const [Phoneno, setPhoneno] = useState("");
  const [Licenseno, setLicenseno] = useState("");
  const [Email, setEmail] = useState("");
  const [Specilization, setSpecilization] = useState("");
  const [Message, setMessage] = useState("");
  const [DocterName, setDocterName] = useState("");
  const { usersignup, doctersignup } = useAuth();
  const [open, setOpen] = React.useState(false);
  const { showSnakbar } = useSnackbar();
  const [gender, setGender] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return; // Prevent closing on clickaway
    setOpen(false);
  };

  const isformvaliduser = UserName && Password && Phoneno && Email;
  const isformvaliddocter =
    DocterName && Password && Specilization && Licenseno && Email;
  const authReq = async (e) => {
    e.preventDefault();

    if (FormState == 0) {
      if (!isformvaliduser) {
        alert("all field is required");
        return;
      }
      console.log("request");

      let requestRes = await usersignup(UserName, Password, Phoneno, Email);
      if (requestRes) {
        showSnakbar(requestRes);
      } else {
        showSnakbar("something is wrong ");
      }

      // console.log(requestRes);

      // setMessage(requestRes);
    } else {
      if (!isformvaliddocter) {
        alert("all docter field is required");
        return;
      }
      console.log("docter side");
      let requestRes = await doctersignup(
        DocterName,
        Password,
        Email,
        Specilization,
        Licenseno
      );
      showSnakbar(requestRes);

      console.log(requestRes);
    }
  };

  return (
    <>
      {/* // <ThemeProvider theme={defaultTheme}> */}

      <Grid container component="main" sx={{ height: "80vh", width: "60vh" }}>
        <CssBaseline />

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
                variant={FormState == 0 ? "contained" : null}
                onClick={() => setFormState(0)}
              >
                Patient
              </Button>
              <Button
                variant={FormState == 1 ? "contained" : null}
                onClick={() => setFormState(1)}
              >
                Docter
              </Button>
            </div>

            {/* </Typography> */}

            <Box component="form" noValidate sx={{ mt: 1 }}>
              {FormState == 0 ? (
                <TextField
                  margin="username"
                  required
                  fullWidth
                  id="username"
                  value={UserName}
                  label="username"
                  name="username"
                  autoComplete="username"
                  onChange={(e) => setUserName(e.target.value)}
                  autoFocus
                />
              ) : (
                <></>
              )}

              {FormState == 1 ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="doctername"
                  value={DocterName}
                  label="DocterName"
                  name="DocterName"
                  autoComplete="DocterName"
                  onChange={(e) => setDocterName(e.target.value)}
                  autoFocus
                />
              ) : (
                <></>
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={Password}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassWord(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                value={Email}
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              {FormState === 0 ? (
                // <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="number"
                  value={Phoneno}
                  id="phoneno"
                  label="phone no"
                  name="phone no"
                  autoComplete="phone no"
                  onChange={(e) => setPhoneno(e.target.value)}
                  autoFocus
                />
              ) : (
                <></>
              )}

              {FormState === 1 ? (
                <>
                  {/* <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="specilization"
                  label="specilization"
                  name="specilization"
                  autoComplete="specilization"
                  onChange={()=>handleSpeilization}
                  autoFocus
                /> */}

                  <FormControl
                    sx={{ m: 1, minWidth: "60%", justifyContent: "center" }}
                  >
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Specilization
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={Specilization}
                      onChange={(e) => setSpecilization(e.target.value)}
                      autoWidth
                      label="Specilization"
                      sx={{
                        "& .MuiOutlinedInput-input": {
                          // border:"1px solid blue",
                          padding: "1rem",
                          // borderRadius:"1rem"
                        },
                        // adds space between text and dropdown icon
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="General Physician">
                        General Physician
                      </MenuItem>
                      <MenuItem value="Cardiologist">Cardiologist</MenuItem>
                      <MenuItem value="Dermatologist">Dermatologist</MenuItem>
                      <MenuItem value="Neurologist">Neurologist</MenuItem>
                      <MenuItem value="Pediatrician">Pediatrician</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="Licenseno"
                    label="Licenseno"
                    name="Licenseno"
                    value={Licenseno}
                    autoComplete="Licenseno"
                    // error={!Licenseno}  // Highlights the field if empty
                    // helperText={!Licenseno ? "License number is required" : ""}
                    onChange={(e) => setLicenseno(e.target.value)}
                    autoFocus
                  />
                </>
              ) : (
                <></>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={authReq}
              >
                Sign Up
              </Button>

              {Message}
              <Link to="/auth/signin" variant="body2">
                {"Already have an account? Sign In"}
              </Link>

              {/* <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={Message}
                // action={action}
              /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* // </ThemeProvider> */}
    </>
  );
}
