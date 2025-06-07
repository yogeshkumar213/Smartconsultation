import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/Snakbarr.jsx";

export const DangerZone = ({ openbox }) => {
  const { client } = useAuth();
  const { showSnakbarr } = useSnackbar();
  const navigate = useNavigate();
  // console.log("zone clicked");
  const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  React.useEffect(() => {
    setOpen(openbox);
  }, [openbox]);

  // };

  const handleClose = async (opt) => {
    if (opt === "Agree") {
      try {
        const deletedUser = await client.delete("/pat/permdel");
        console.log(deletedUser);
        if (deletedUser.data.message == "user successfully deleted") {
          const localToken = localStorage.removeItem("token");
          console.log(localToken);
          navigate("/auth/signup");
          showSnakbarr("user successfully deleted");
        } else {
          showSnakbarr(deletedUser.data.message);
        }
      } catch (err) {
        // showSnakbarr(err.)
        console.log(err);
      }

      console.log("user deleted");
      setOpen(false);
    }
    setOpen(false);
  };

  return (
    <div>
      {/* <Button variant="outlined" onClick={(e)=>{

        //learn  why use e.stopPropoagation in that place--->
        e.stopPropagation();
        handleClickOpen();
      }} 
        style={{ background: "#eee", padding: "20px" }}>
        Open alert dialog
      </Button> */}
      <Dialog
        PaperProps={{
          
          style: { boxShadow: "3px 3px 30px rgba(0, 0, 0, 0.4)","borderRadius":"1rem" },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "red" }}>
          <i className="fa-solid fa-skull-crossbones"></i> &nbsp;
          {"Delete Account permanently"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black" }}
          >
            Are you sure you want to permanently delete your account from the
            hospital database? This action cannot be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose("Disagree")}>Disagree</Button>
          <Button onClick={() => handleClose("Agree")} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
