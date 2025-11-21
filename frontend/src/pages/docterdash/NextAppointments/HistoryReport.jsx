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
import AtomicSpinner from "atomic-spinner";
import "../AppointmentList.css";
import { useContext, useEffect } from "react";
import { docterContext } from "../../../context/DocterAuthContext";
import { width } from "@mui/system";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

export const HistoryReport = ({ open, setOpen, nextPatientDetails }) => {
  const tab = ["Report", "Audio"];
  const [activeTab, setActiveTab] = React.useState("Report");
  const { docterAPI } = useContext(docterContext);
  const [selectedimg, setSelectedImg] = useState(null);
  const [audioData, setAudioData] = useState("");
  const [loading, setLoading] = useState(false);

  const [nextPatientAnalysis, setNextPatientAnalysis] = useState({
    transribedAudio: "",
    analysisReport: "",
  });

  //   const [open, setOpen] = React.useState(false);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  if (nextPatientDetails != null) {
    console.log("nextPatientDetails", nextPatientDetails.audioAndReport);
  }
  const handleClose = () => {
    setOpen(false);
  };
  if (open) {
    console.log("opent value true");
  }
  const handleTabChange = (b) => {
    setActiveTab(b);
  };
  useEffect(() => {
    setLoading(true);
    const getaudioandReportanalysis = async () => {
      try {
        const res = await docterAPI.post("/getaudioandReportanalysis", {
          nextPatientDetails,
        });
        console.log("audioreportandHistory", res.data);
        if (res.status === 200) {
          setNextPatientAnalysis({
            transribedAudio: res.data.TranscriptData,
            analysisReport: res.data.Analysdata,
          });
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getaudioandReportanalysis();
  }, [nextPatientDetails]);

  return (
    <React.Fragment>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
      <Dialog
        open={open}
        PaperProps={{
          sx: { maxWidth: "none", width: "40%" },
        }}
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
                  borderRadius: "1rem",
                }}
              >
                <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-lg font-semibold text-blue-700">
                    <DescriptionOutlinedIcon className="w-5 h-5" />
                    <h5>Medical Reports</h5>
                  </span>

                  <p className="text-sm text-gray-600 ml-7 -mt-1">
                    Reports and Test results
                  </p>
                </div>

                {nextPatientDetails.audioAndReport &&
                nextPatientDetails.audioAndReport.length > 0 ? (
                  <div className="flex flex-row flex-wrap gap-4 w-full">
                    {/* Outer Map: Iterates over the main appointment history (e.g., all past visits) */}
                    {nextPatientDetails.audioAndReport.map((prev, index) => {
                      console.log("prev report data", prev);
                      // Report array nikaalte hain
                      const reportArray = prev.report || [];
                      console.log("reportArray", reportArray);

                      // Agar is visit mein koi reports nahi hain toh kuch render mat karo
                      if (reportArray.length === 0) return null;
                      return reportArray.map((reportData, reportIndex) => {
                        // File properties nikaalte hain
                        console.log(reportData.report.signedUrl);
                        const report = reportData.report.signedUrl;
                        const mimeType = reportData.report.mimetype;
                        if (!report) return null;
                        const isPdf = mimeType?.endsWith(".pdf");
                        const isImg = [".png", ".jpg", ".jpeg", ".webp"].some(
                          (ext) => mimeType?.endsWith(ext)
                        );

                        // ✅ Inner map se har report ka JSX return ho raha hai.
                        return (
                          <div
                            // Har element ke liye unique key zaroori hai
                            key={reportIndex}
                            className="flex"
                          >
                            {isPdf && (
                              <iframe
                                src={report}
                                style={{
                                  width: "200px",
                                  height: "250px",
                                  borderRadius: "1rem",
                                }}
                              />
                            )}

                            {isImg && (
                              <img
                                src={report}
                                onClick={() => setSelectedImg(report)}
                                alt="Patient Report"
                                style={{
                                  width: "200px",
                                  height: "auto",
                                  margin: "1rem",
                                  borderRadius: "1rem",
                                  objectFit: "contain",
                                  cursor: "pointer",
                                }}
                              />
                            )}
                          </div>
                        );
                      });
                      // Outer map yahaan automatically inner map ka result (array of JSX elements) return karta hai.
                    })}
                  </div>
                ) : (
                  /* -------------------------------------------------------- */

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      margin: "2rem",
                      padding: "0.2rem 5rem",
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
                    <p style={{ fontSize: "0.9rem" }}>
                      Reports will appear here when uploaded
                    </p>
                  </div>
                )}

                {/* Enlarged Image View */}
                {selectedimg && (
                  <div
                    onClick={() => setSelectedImg(null)}
                    style={{
                      height: "100vh",
                      width: "100vw",
                      position: "fixed",
                      top: 0,
                      left: 0,
                      display: "flex",
                      zIndex: 9999,
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "zoom-out",
                      background: "rgba(0,0,0,0.6)",
                    }}
                  >
                    <img
                      src={selectedimg}
                      alt="Enlarged"
                      style={{
                        borderRadius: "1rem",
                        height: "80vh",
                        width: "50vw",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : loading ? (
              <div className="flex justify-center items-center ">
                <AtomicSpinner />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                  border: "1px solid rgb(210, 236, 236)",
                  padding: "1rem 5rem 1rem 1rem",
                  borderRadius: "2rem",
                }}
              >
                <h4 className="text-blue-700">
                  <b>currentSymptoms :</b>
                </h4>
                <p className="text-gray-700">
                  In Audio {nextPatientAnalysis.transribedAudio}
                </p>
                <p>ReportData with ai :</p>
                <p className="bg-white">
                  final summary with ai
                  <ReactMarkdown>
                    {nextPatientAnalysis.analysisReport}
                  </ReactMarkdown>
                </p>

                {/* <div className="nextAudio">
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
                </div> */}
                <p>Date: audioData</p>
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
