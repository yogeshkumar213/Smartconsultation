import React, { useState } from "react";
import "./History.css";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { AudioFile } from "./Audiofile";
import { useEffect } from "react";
export const PatientData = ({ searchedPatient, filteredpatient }) => {
  // const [audiodialog, setAudioDialog] = useState(false);
  const [open, setOpen] = useState(false);
  // console.log(searchedPatient)

  const totalAppointments = filteredpatient
    ? filteredpatient
    : searchedPatient.data.allAppointments;
  useEffect(() => {
    console.log(totalAppointments);
  }, []);

  const handleAudio = (e) => {
    e.stopPropagation();
    setOpen(true);
    // setAudioDialog(true);
  };

  return (
    <div className="Patient-history-container">
      {open&& <AudioFile open={open} setOpen={setOpen} />}
      <table>
        <thead>
          <tr>
            <th>Patient Name </th>
            <th>Email</th>
            <th>Phone no</th>
            <th>Date</th>
            <th>Time</th>
            <th>Patient file </th>
            <th>Patient Audio</th>
          
          </tr>
        </thead>

        {/* <br></br> */}

        <tbody>
          {totalAppointments.map((pat, index) => (
            <tr key={index}>
              <td>{pat.Patient.UserName}</td>
              <td>{pat.Patient.Email}</td>
              <td>{pat.Patient.Phoneno}</td>
              <td>{pat.Date}</td>
              <td>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AccessTimeIcon />
                  {pat.Time}
                </span>
              </td>
              <td>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DescriptionRoundedIcon />
                  <a href="PatientFile">view file</a>
                </span>
              </td>

              <td>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AudioFileIcon />
                  <span
                    style={{ cursor: "pointer", color: "blue" }}
                    onClick={(e) => handleAudio(e)}
                  >
                    view audio{" "}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
