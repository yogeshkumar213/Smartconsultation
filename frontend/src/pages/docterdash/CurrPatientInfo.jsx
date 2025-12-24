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
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/lottie/LoadingCircleAnimation.json";

export default function CurrentPatient() {
  const [notes, setNotes] = useState(false);
  const [patientLastVisit, setPatientLastVisit] = useState(false);
  // const [currno, setCurrNo] = useState(0);
  const { docterAPI } = useContext(docterContext);
  // const [patientcollectioninfo, setPatientCollectionInfo] = useState([]);
  // const [singlepatient, setSinglePatient] = useState();
  const [loading, setLoading] = useState(false);
  const [ispatientcompleted, setIsPatientCompleted] = useState(false);

  const {
    // patientcollection,
    // setPatientCollection,
    currPatientFiles,
    setCurrPatientFiles,
    currPatientDocument,
    setCurrPatientDocument,
    currno,
    setCurrNo,
  } = useContext(PatientCollectionContext);

  // console.log(patientcollection);

  const nextPatient = async () => {
    alert("is patient consulted ");
    setLoading(true);
    // if (currPatientDocument) {
    console.log("patientClicked");

    // setCurrNo((cur) => cur + 1);
    try {
      const markAppointmentComp = await docterAPI.post("/markAppointmentComp", {
        currPatientDocument: currPatientDocument,
      });
      console.log(markAppointmentComp.data);
      setCurrPatientDocument(markAppointmentComp.data.nextPatientAppointment);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    // } else {
    //   console.log("no current patient");
    //   alert("No current patient to mark as consulted");
    //   return;
    // }
  };
  // useEffect(() => {
  //   // setcurrPatient();
  //   if (!patientcollection) return;
  //   const fetchPatientData = async () => {
  //     // console.log("currPatient", currPat);
  //     try {
  //       const res = await docterAPI.post("/getpatientdet", patientcollection);
  //       console.log(res.data);
  //       setPatientCollectionInfo(res.data.newArray);
  //     } catch (err) {
  //       console.error("Error fetching patient details", err);
  //     }
  //   };
  //   fetchPatientData();
  // }, [patientcollection]);

  // useEffect(() => {
  // if (patientcollectioninfo.length > 0) {
  //   console.log(patientcollectioninfo.length);
  // if (currno < patientcollectioninfo.length) {
  //   console.log(patientcollection);

  //   console.log(
  //     "patientcollectioninfo[currno]",
  //     patientcollectioninfo[currno]
  //   );
  // setSinglePatient(patientcollectioninfo[currno]); //patientcollectionifo ek detailed array hai ye wo array hai jisme particular doceter k sare patient hai
  // const currUser = async () => {
  //   const fetchedFromAws = await docterAPI.post("/getpatientfile", {
  //     // note->patientcollection k ander mere wo patient ki list hai jinki field mai jo docter check kar rha hai uski id hai
  //     // or patientcollection[currno]->maine us patientcollection[currno] mai se ek document utha liya or (patientcollection[currno].patientfile) ->us document mai se maine pateintfile and audio ki id utha li hai
  //     patientfile: patientcollection[currno].PatientFile,
  //     patientAudio1: patientcollection[currno].PatientAudio,
  //   });
  //   console.log(fetchedFromAws.data);
  //   setCurrPatientDocument(fetchedFromAws.data); //currpatientDocument mai sirf mera currpatient hai uski purri document hai document mtlb single entity naa ki uski history
  // };
  // currUser();
  // } else {
  //   setSinglePatient("Today Appointment completed");
  //   setCurrPatientDocument(null);
  // }
  // }
  // }, [currPatientDocument]);
  // , currPatient]

  useEffect(() => {
    if (currPatientDocument === undefined) return;
    if (currPatientDocument === null) {
      setIsPatientCompleted(true);
      return;
    }
    setIsPatientCompleted(false);
    console.log("currPatientDocument", currPatientDocument);
    const currUserFiles = async () => {
      const fetchedFromAws = await docterAPI.post("/getpatientfile", {
        patientfile: currPatientDocument.PatientFile,
        patientAudio1: currPatientDocument.PatientAudio,
      });
      console.log(fetchedFromAws.data);
      setCurrPatientFiles(fetchedFromAws.data);
    };
    currUserFiles();
  }, [currPatientDocument]);

  useEffect(() => {
    console.log("currPatientDocument", currPatientDocument);
  }, [currPatientDocument]);

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
      {typeof currPatientDocument == "undefined"
        ? "No patients assigned yet"
        : typeof currPatientDocument}
      {patientLastVisit &&
        currPatientFiles && ( //currpatienthistory
          <CurrPatientDetails
            patientLastVisit={patientLastVisit}
            setPatientLastVisit={setPatientLastVisit}
            currPatientFiles={currPatientFiles}
            consultationInputId={currPatientDocument._id}
          />
        )}
      {notes && (
        <DocNote
          notes={notes}
          setNotes={setNotes}
          consultationInputId={currPatientDocument._id}
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
            {typeof currPatientDocument != "string" &&
            currPatientDocument?.Patient?.UserName
              ? currPatientDocument.Patient.UserName
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
        {loading ? (
          <div className="h-6 w-6">
            <Lottie animationData={loadingAnimation} loop={true} />
          </div>
        ) : ispatientcompleted ? (
          "All appointments completed"
        ) : (
          "Mark as Consulted"
        )}
      </Button>
    </div>
  );
}
