import * as React from "react";
import Button from "@mui/material/Button";
import { Navigate, useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { colors } from "@mui/material";
import { useSnackbar } from "../../../context/Snakbarr.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Logout = (value) => {
  console.log(value);
  const navigate=useNavigate();
  const { showSnakbarr } = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleAgree = () => {
    
    const token = localStorage.getItem("doctoken");
    console.log(token);
    if (token) {
      localStorage.removeItem("doctoken");
      return navigate("/auth/signin");
      showSnakbarr("Successfully logout");
    } else {
      console.log("something is wrong ");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */}
      <Dialog
        open={value}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red" }}>{"Logout"}</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p style={{ color: "#e53935" }}>
              Are you sure you want to logout from the dashboard
            </p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleAgree}>Agree</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
