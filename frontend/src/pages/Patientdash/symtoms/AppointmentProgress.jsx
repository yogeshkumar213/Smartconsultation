import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AppointmentProgress({ open, setOpen }) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      disableEscapeKeyDown
      aria-describedby="appointment-progress-description"
    >
      {/* Dialog Title */}
      <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
        Booking Your Appointment
      </DialogTitle>

      {/* Dialog Content */}
      <DialogContent>
        <DialogContentText
          id="appointment-progress-description"
          sx={{ textAlign: "center", mb: 3 }}
        >
         Processing your appointment.
          <br />
         Uploading medical files securely.
          <br />
          <strong>Please wait.</strong>
        </DialogContentText>

        {/* Loader */}
        <Stack
          sx={{ color: "grey.500" }}
          spacing={2}
          direction="column"
          alignItems="center"
        >
          <CircularProgress color="success" />

          {/* Extra Trust Message */}
          <Typography variant="caption" color="text.secondary">
            Your data is safe and encrypted
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
