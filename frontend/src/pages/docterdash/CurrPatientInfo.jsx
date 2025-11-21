import React from "react";
import "./AppointmentList.css";
import Button from "@mui/material/Button";
import { DocNote } from "./DocNote";
import { useState } from "react";
import { CurrPatientDetails } from "./CurrPatientDeltails";
import { PatientCollectionContext } from "../../context/DocterAuthContext";
import { useContext } from "react";
import { useEffect } from "react";
import { docterContext } from "../../context/DocterAuthContext";

export default function CurrentPatient() {
  const [notes, setNotes] = useState(false);
  const [patientLastVisit, setPatientLastVisit] = useState(false);
  // const [currno, setCurrNo] = useState(0);
  const { docterAPI } = useContext(docterContext);
  const [patientcollectioninfo, setPatientCollectionInfo] = useState([]);
  const [singlepatient, setSinglePatient] = useState();
  const [loading, setLoading] = useState(false);

  const {
    patientcollection,
    setPatientCollection,
    currPatientDocument,
    setCurrPatientDocument,
    currno,
    setCurrNo,
  } = useContext(PatientCollectionContext);

  console.log(patientcollection);

  const nextPatient = async () => {
    setLoading(true);
    if (currPatientDocument) {
      console.log("patientClicked");

      setCurrNo((cur) => cur + 1);
      try {
        const markAppointmentComp = await docterAPI.post(
          "/markAppointmentComp",
          { currPatientDocument: currPatientDocument }
        );
        console.log(markAppointmentComp);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    } else {
      console.log("no current patient");
      alert("No current patient to mark as consulted");
      return;
    }
  };
  useEffect(() => {
    // setcurrPatient();
    if (!patientcollection) return;
    const fetchPatientData = async () => {
      // console.log("currPatient", currPat);
      try {
        const res = await docterAPI.post("/getpatientdet", patientcollection);
        console.log(res.data);
        setPatientCollectionInfo(res.data.newArray);
      } catch (err) {
        console.error("Error fetching patient details", err);
      }
    };
    fetchPatientData();
  }, [patientcollection]);

  useEffect(() => {
    if (patientcollectioninfo.length > 0) {
      console.log(patientcollectioninfo.length);
      if (currno < patientcollectioninfo.length) {
        console.log(patientcollection);

        console.log(
          "patientcollectioninfo[currno]",
          patientcollectioninfo[currno]
        );
        setSinglePatient(patientcollectioninfo[currno]); //patientcollectionifo ek detailed array hai ye wo array hai jisme particular doceter k sare patient hai
        const currUser = async () => {
          const fetchedFromAws = await docterAPI.post("/getpatientfile", {
            // note->patientcollection k ander mere wo patient ki list hai jinki field mai jo docter check kar rha hai uski id hai
            // or patientcollection[currno]->maine us patientcollection[currno] mai se ek document utha liya or (patientcollection[currno].patientfile) ->us document mai se maine pateintfile and audio ki id utha li hai
            patientfile: patientcollection[currno].PatientFile,
            patientAudio1: patientcollection[currno].PatientAudio,
          });
          console.log(fetchedFromAws.data);
          setCurrPatientDocument(fetchedFromAws.data); //currpatientDocument mai sirf mera currpatient hai uski purri document hai document mtlb single entity naa ki uski history
        };
        currUser();
      } else {
        setSinglePatient("Today Appointment completed");
        setCurrPatientDocument(null);
      }
    }
  }, [currno, patientcollectioninfo]);
  // , currPatient]

  useEffect(() => {
    console.log("singlepatient", singlepatient);
  }, [singlepatient]);

  const noteHandler = (e) => {
    e.preventDefault();
    setNotes(true);
  };
  const handlePatientinfo = () => {
    console.log("patient info clicked");
    setPatientLastVisit(true);
  };

  // console.log("patientcollection[currno]._id",patientcollection[currno]._id);

  return (
    <div className="patient-Info">
      {typeof singlepatient == "undefined"
        ? "No patients assigned yet"
        : typeof singlepatient}
      {patientLastVisit && ( //currpatienthistory
        <CurrPatientDetails
          patientLastVisit={patientLastVisit}
          setPatientLastVisit={setPatientLastVisit}
          currPatientDocument={currPatientDocument}
          consultationInputId={patientcollection[currno]._id}
        />
      )}
      {notes && (
        <DocNote
          notes={notes}
          setNotes={setNotes}
          consultationInputId={patientcollection[currno]._id}
        />
      )}
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
          Consultation Input
        </Button>
      </div>
      <div className="profileIcon-And-patientInfo">
        <div onClick={handlePatientinfo} style={{ cursor: "pointer" }}>
          <i className="fa-regular fa-user"></i>
        </div>

        <div>
          <h3>
            {typeof singlepatient != "string" && singlepatient?.UserName
              ? singlepatient.UserName
              : "No patients assigned yet"}
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
        disabled={loading}
        onClick={nextPatient}
        style={{ marginTop: "2rem" }}
      >
        Mark as Consulted
      </Button>
    </div>
  );
}
