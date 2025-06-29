import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import VolumeUpSharpIcon from "@mui/icons-material/VolumeUpSharp";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import "../AppointmentList.css";
export const HistoryReport = ({ open, setOpen }) => {
  const tab = ["Report", "Audio"];
  const [activeTab, setActiveTab] = React.useState("Report");
  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
  };
  const handleTabChange = (b) => {
    setActiveTab(b);
  };

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            display: "flex",
            justifyContent: "space-around",

            alignItems: "center",
          }}
        >
          {tab.map((b, key) => {
            return (
              <Button
                variant="contained"
                key={b}
                startIcon={
                  b === "Report" ? (
                    <MedicalInformationIcon />
                  ) : (
                    <GraphicEqIcon />
                  )
                }
                onClick={() => handleTabChange(b)}
              >
                {b}
              </Button>
            );
          })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ height: "100%", width: "100%" }}
            component="div"
          >
            {activeTab === "Report" ? (
              <div
                style={{
                  border: "1px solid rgb(210, 236, 236)",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                  padding: "1rem",
                  borderRadius:"1rem"
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  {" "}
                  <DescriptionOutlinedIcon /> Medical Reports
                </span>
                <p>Previously uploaded reports and test results</p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    // gap: "0.6rem",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "2rem",
                    padding: "0.2rem 5rem 0.2rem 5rem",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "0.2rem",
                      backgroundColor: "rgb(210, 236, 236)",
                      height: "4rem",
                      width: "4rem",
                      borderRadius: "50%",
                    }}
                  >
                    <DescriptionOutlinedIcon />
                  </span>
                  <p>No reports uploaded yet</p>
                  <p style={{ fontSize: "0.8rem" }}>
                    Reports will appear here when uploaded
                  </p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem", // space between all child elements
                  border: "1px solid rgb(210, 236, 236)",
                  padding: "1rem 5rem 1rem 1rem",
                  borderRadius: "2rem",
                }}
              >
                <h4> Current Symptoms</h4>
                <p>analysis with ai</p>
                <h5>Audio Description</h5>
                <div className="nextAudio">
                  <NotStartedIcon />
                  <Box
                    sx={{
                      width: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Slider
                      defaultValue={50}
                      aria-label="Default"
                      valueLabelDisplay="auto"
                    />
                  </Box>
                  <i className="fa-solid fa-volume-high"></i>
                </div>
              </div>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
