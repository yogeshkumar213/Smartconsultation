import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { docterContext } from "../../context/DocterAuthContext";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const CurrPatientDetails = ({
  patientLastVisit,
  setPatientLastVisit,
  currPatientDocument,
  consultationInputId,
}) => {
  const [open, setOpen] = React.useState(false);

  const [docMessage, setDocMessage] = useState("hello"); // crate context api

  const [activeTab, setActiveTab] = useState("Consultation Input");

  const [selectedimg, setSelectedImg] = useState(null);
  const [pastappointments, setPastAppointments] = useState([]);
  const { docterAPI } = useContext(docterContext);
  const tabs = ["Consultation Input", "Insight", "Report"];
  const [reportData, setReportData] = useState([
    "Diagnosed with asthma in 2015; has experienced intermittent symptoms since then, typically triggered by physical exertion or environmental factors such as dust and cold air. Uses prescribed inhalers as needed.",
    "Suffers from seasonal allergies, primarily during the spring and fall months, often presenting with sneezing, nasal congestion, and itchy eyes; managed with over-the-counter antihistamines.",
  ]);

  const handleTabChange = (key) => {
    console.log(key);
    setActiveTab(key);
  };
  console.log("consultationInputIdc", consultationInputId);
  console.log("currPatientDocument", currPatientDocument);
  //   };
  // console.log("currpatienthistory file and report ", currpatienthistory);

  // console.log("currpatienthistory file", currpatienthistory.PatientFile);

  const handleClose = () => {
    setPatientLastVisit(false);
  };
  useEffect(() => {
    const pastData = async () => {
      const result = await docterAPI.get(
        `/docter-dashboard/appointment/history/${consultationInputId}`
      );
      console.log(result);
      setPastAppointments(result);
    };
    pastData();
  }, [consultationInputId]);

  useEffect(() => {
    // if (pastappointments != []) {
    console.log(pastappointments);
    // }
  }, [pastappointments]);

  console.log("DEBUG: activeTab:", activeTab);
  console.log("DEBUG: patientLastVisit (dialog open):", patientLastVisit);
  console.log("DEBUG: currPatientDocument:", currPatientDocument);
  console.log(
    "DEBUG: PatientFile is array?:",
    Array.isArray(currPatientDocument?.PatientFile)
  );
  console.log(
    "DEBUG: PatientFile length:",
    currPatientDocument?.PatientFile?.length
  );

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
          {activeTab === "Consultation Input" ? (
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
              {pastappointments?.data?.totalpastAppointment.map((el, index) => (
                <div key={index} style={{ marginTop: "2rem", width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      margin: "1rem 1rem 1rem 0",
                      gap: 10,
                      justifyContent: "space-between",
                      backgroundColor: "#f5f5f5",
                      color: "#333",
                    }}
                  >
                    <p>
                      {" "}
                      Consult Slot :
                      {new Date(
                        el.ConsultationNotes.createdAt
                      ).toLocaleString() || "N/A"}
                    </p>
                    <p>
                      Schedule :
                      {new Date(el.createdAt).toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      Symtoms :
                      <b style={{ marginLeft: "1rem" }}>
                        {el.ConsultationNotes?.Symtoms || "N/A"}
                      </b>
                    </p>
                    <p>
                      ProbableCause :
                      <b style={{ marginLeft: "1rem" }}>
                        {el.ConsultationNotes?.ProbableCause || "N/A"}
                      </b>
                    </p>
                    <p>
                      PrescribedMedications :
                      <b style={{ marginLeft: "1rem" }}>
                        {el.ConsultationNotes?.PrescribedMedications || "N/A"}
                      </b>
                    </p>
                    <p>
                      TreatmentAdvice :
                      <b style={{ marginLeft: "1rem" }}>
                        {el.ConsultationNotes?.TreatmentAdvice || "N/A"}
                      </b>
                    </p>
                    <p>
                      FollowUpSuggestions :
                      <b style={{ marginLeft: "1rem" }}>
                        {el.ConsultationNotes?.FollowUpSuggestions || "N/A"}
                      </b>
                    </p>
                  </div>
                  <hr style={{ marginTop: "1rem" }}></hr>
                </div>
              ))}

              {/* <textarea
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
              ></textarea> */}
            </div>
          ) : activeTab === "Insight" ? (
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
                  <p style={{ margin: "0.5rem" }}>Medical Insight</p>
                </span>
                <ul>
                  {reportData.map((e, key) => {
                    return <li key={e}>{e}</li>;
                  })}
                </ul>
              </div>

              <p>Past Visits</p>
            </div>
          ) : activeTab === "Report" && currPatientDocument?.PatientFile ? (
            currPatientDocument.PatientFile.map((fileUrl, index) => {
              const { signedUrl, mimetype } = fileUrl;
              const ispdf = mimetype.endsWith(".pdf");
              const isimg = [".png", ".jpg", ".jpeg"].some(ext => mimetype.endsWith(ext));
              console.log("signed url for imag", signedUrl);

              return (
                
                  <div key={index} style={{ marginBottom: "2px" }}>
                    {ispdf && (
                      <iframe
                        src={signedUrl}
                        width="100%"
                        height="100%"
                        style={{ width: "100%" }}
                      />
                    )}
                    {isimg && (
                      <img
                        src={signedUrl}
                        alt="uploaded file"
                        style={{
                          width: "100%",
                          // maxHeight: "500px",
                          objectFit: "contain",
                          margin: "0 0 2rem 0",
                          borderRadius: "1rem",
                        }}
                        onClick={() => setSelectedImg(signedUrl)}
                      />
                    )}

                    {/* {selectedimg && (
                      <div
                        onClick={() => setSelectedImg(null)}
                        style={{
                          height: "90vh",
                          width: "90vw",
                          position: "fixed",
                          top: 0,
                          left: 0,
                          display: "flex",
                          zIndex: 9999,
                          justifyContent: "center",
                          alignItem: "center",
                          cursor: "zoom-out",
                          margin: "3rem",
                        }}
                      >
                        <img
                          src={selectedimg}
                          alt="Enlarged"
                          style={{
                            borderRadius: "1rem",
                            maxHeight: "90%",
                            maxWidth: "90%",
                          }}
                        ></img>
                      </div>
                    )} */}
                  </div>
              
              );
            })
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
