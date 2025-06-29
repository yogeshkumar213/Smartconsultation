import React from "react";
import "./AppointmentList.css";
import Button from "@mui/material/Button";
import { DocNote } from "./DocNote";
import { useState } from "react";
import { PatientVistiH } from "./PatientVistiH";

export default function CurrentPatient() {
  const [notes, setNotes] = useState(false);
  const [patientLastVisit, setPatientLastVisit] = useState(false);

  const noteHandler = (e) => {
    e.preventDefault();
    setNotes(true);
  };
  const handlePatientinfo = () => {
    setPatientLastVisit(true);
  };

  return (
    <div className="patient-Info">
      {patientLastVisit && <PatientVistiH patientLastVisit={patientLastVisit} setPatientLastVisit={setPatientLastVisit}/>}
      {notes && <DocNote notes={notes} setNotes={setNotes} />}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Patient Information</h2>
        <Button
          variant="contained"
          color="success"
          size="medium"
          onClick={noteHandler}
        >
          NOTES
        </Button>
      </div>
      <div className="profileIcon-And-patientInfo">
        <div onClick={handlePatientinfo} style={{ cursor: "pointer" }}>
          <i className="fa-regular fa-user"></i>
        </div>

        <div>
          <h3>Patient Name</h3>
          <div
            style={{ display: "flex", fontSize: "0.8rem" }}
            className="age-gender"
          >
            <p>42 years</p>
            <p>&nbsp;&nbsp;female</p>
          </div>
        </div>
      </div>
      <Button
        variant="contained"
        disableElevation
        fullWidth
        style={{ marginTop: "2rem" }}
      >
        Mark as Consulted
      </Button>
    </div>
  );
}
