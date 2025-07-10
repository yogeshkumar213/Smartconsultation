import * as React from "react";
import Button from "@mui/material/Button";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const PatientVistiH = ({
  patientLastVisit,
  setPatientLastVisit,
  currpatienthistory,
}) => {
  const [open, setOpen] = React.useState(false);

  const [docMessage, setDocMessage] = useState("hello"); // crate context api

  const [activeTab, setActiveTab] = useState("Note");
  const [report, setReport] = useState(null);
  const tabs = ["Note", "History", "Report"];
  const [reportData, setReportData] = useState([
    "Diagnosed with asthma in 2015; has experienced intermittent symptoms since then, typically triggered by physical exertion or environmental factors such as dust and cold air. Uses prescribed inhalers as needed.",
    "Suffers from seasonal allergies, primarily during the spring and fall months, often presenting with sneezing, nasal congestion, and itchy eyes; managed with over-the-counter antihistamines.",
  ]);

  const handleTabChange = (key) => {
    console.log(key);
    setActiveTab(key);
    if (key === "Report") {
      const bufferData = currpatienthistory?.PatientFile?.data;
      console.log(bufferData)

      if (bufferData) {
        const stringData = new TextDecoder("utf-8").decode(
          new Uint8Array(bufferData)
        );
        console.log(stringData);
        setReport(stringData);
      }
    }
  };


  //   };
  console.log(currpatienthistory);
  const handleClose = () => {
    setPatientLastVisit(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={patientLastVisit}
      >
        <DialogTitle
          sx={{ m: 0, p: 2, display: "flex", justifyContent: "center" }}
          id="customized-dialog-title"
        >
          {tabs.map((b, key) => {
            return (
              <Button
                key={b}
                size="medium"
                style={{
                  backgroundColor: activeTab === b ? "#1a73e8" : "white",

                  color: activeTab === b ? "white" : "#1a73e8",
                  marginRight: "1rem",
                  border: "none",
                }}
                onClick={() => handleTabChange(b)}
              >
                {b}
              </Button>
            );
          })}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          {activeTab === "Note" ? (
            <div>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0 0 0.5rem 1rem",
                }}
              >
                <i
                  className="fa-regular fa-pen-to-square"
                  style={{ color: "	#0288d1" }}
                ></i>
                <p>Docter Notes</p>
              </span>

              <textarea
                rows={8}
                cols={199}
                disabled
                // fullwidth
                value={docMessage}
                style={{
                  backgroundColor: "white",
                  width: "100%",
                  borderRadius: "1rem",
                  padding: "1rem",
                  cursor: "default",
                  color: "black",
                }}
              ></textarea>
            </div>
          ) : activeTab === "History" ? (
            <div>
              <div
                style={{
                  height: "100%",
                  border: "1px solid black",
                  //   width: "35rem",
                  padding: "0.5rem 0 0 2rem",
                  boxSizing: "border-box",
                  width: "100%",
                  overflowY: "auto",
                }}
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <i
                    className="fa-regular fa-calendar-days"
                    style={{ color: "	#0288d1" }}
                  ></i>
                  &nbsp;
                  <p style={{ margin: "0.5rem" }}>Medical History</p>
                </span>
                <ul>
                  {reportData.map((e, key) => {
                    return <li key={key}>{e}</li>;
                  })}
                </ul>
              </div>

              <p>Past Visits</p>
            </div>
          ) : activeTab === "Report" && report != null ? (
            // <div>report</div>
            <textarea
              rows={8}
              cols={15}
              style={{ backgroundColor: "white" }}
              value={report}
              readOnly
            >
              {}
            </textarea>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};
