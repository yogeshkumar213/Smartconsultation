import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import { useState } from "react";

export const DocNote = ({ notes, setNotes }) => {
  const [open, setOpen] = React.useState(false);
  const [docMessage, setDocMessage] = useState("allergies");
  const [editopt, setEditopt] = useState(false);
  const [msgStore, setmsgStore] = useState("");

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const handleEdit = (e) => {
    e.preventDefault();
    console.log("button clicked");
    setEditopt(true);
  };
  const handleAddSymtoms = () => {
    console.log(docMessage);
    setDocMessage(docMessage);

    setEditopt(false);
  };
  const handleClose = () => {
    setNotes(false);
  };
  // const handleDocNote = (e) => {
  //   console.log("editbutton clicked");
  //   e.preventDefault();
  // };

  return (
    <React.Fragment>
      <Dialog open={notes} onClose={handleClose}>
        <DialogTitle>Patient Symtoms</DialogTitle>
        <DialogContent>
          <p style={{ color: "#555", fontSize: "14px", margin: "0 0 12px 0" }}>
            Please write the patient's symptoms clearly, including key details
            like duration and severity to support diagnosis.
          </p>

          {editopt ? (
            <div style={{ margin: "1rem" }}>
              <textarea
                // type="text"
                id="symtoms"
                rows={7}
                value={docMessage}
                onChange={(e) => setDocMessage(e.target.value)}
                //   cols={2}
                placeholder="Write your message here..."
                style={{
                  width: "100%",
                  color: "#333",
                  fontSize: "1rem",
                  // textSizeAdjust:"1rem",
                  border: "1px solid #1a73e8",
                  borderRadius: "1rem",
                  marginTop: "1rem",
                  padding: "1rem",
                  backgroundColor: "white",
                }}
                //    className="customPlaceholder"
              ></textarea>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddSymtoms}
              >
                Add Symtoms
              </Button>
            </div>
          ) : (
            <div>
              <textarea
                rows={8}
                disabled
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
              <Button
                onClick={(e) => handleEdit(e)}
                variant="contained"
                size="medium"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EditDocumentIcon />
                &nbsp; EDIT
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
