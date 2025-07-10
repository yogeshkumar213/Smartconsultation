import React from "react";
import "./AppointmentList.css";
import Button from "@mui/material/Button";
import { DocNote } from "./DocNote";
import { useState } from "react";
import { PatientVistiH } from "./PatientVistiH";
import { PatientCollectionContext } from "../../context/DocterAuthContext";
import { useContext } from "react";
import { useEffect } from "react";
import { docterContext } from "../../context/DocterAuthContext";

export default function CurrentPatient() {
  const [notes, setNotes] = useState(false);
  const [patientLastVisit, setPatientLastVisit] = useState(false);
  const [currno, setCurrNo] = useState(0);
  const { docterAPI } = useContext(docterContext);
  const [currPatient, setcurrPatient] = useState([]);
  const [singlepatient, setSinglePatient] = useState();
  const [currpatienthistory, setCurrPatientHistory] = useState(null);
  const { patientcollection, setPatientCollection } = useContext(
    PatientCollectionContext
  );

  console.log(patientcollection);

  const nextPatient = () => {
    console.log("patientClicked");

    setCurrNo((cur) => cur + 1);
  };
  useEffect(() => {
    // setcurrPatient();
    if (!patientcollection) return;
    const fetchPatientData = async () => {
      // console.log("currPatient", currPat);
      try {
        const res = await docterAPI.post("/getpatientdet", patientcollection);
        console.log(res.data);
        setcurrPatient(res.data.newArray);
      } catch (err) {
        console.error("Error fetching patient details", err);
      }
    };
    fetchPatientData();
  }, [patientcollection]);

  useEffect(() => {
    if (currPatient.length > 0) {
      console.log(currPatient.length);
      if (currno < currPatient.length) {
        setSinglePatient(currPatient[currno]);
        setCurrPatientHistory(patientcollection[currno]);
      } else {
        setSinglePatient("Today Appointment completed");
        setCurrPatientHistory(null);
      }
    }
  }, [currno, currPatient]);

  const noteHandler = (e) => {
    e.preventDefault();
    setNotes(true);
  };
  const handlePatientinfo = () => {
    setPatientLastVisit(true);
  };

  return (
    <div className="patient-Info">
      {typeof currpatienthistory}
      {patientLastVisit && currpatienthistory && (
        <PatientVistiH
          patientLastVisit={patientLastVisit}
          setPatientLastVisit={setPatientLastVisit}
          currpatienthistory={currpatienthistory}
        />
      )}
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
          <h3>
            {typeof singlepatient === "string"
              ? singlepatient
              : singlepatient?.UserName ?? "Loading ..."}
          </h3>
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
        onClick={nextPatient}
        style={{ marginTop: "2rem" }}
      >
        Mark as Consulted
      </Button>
    </div>
  );
}
