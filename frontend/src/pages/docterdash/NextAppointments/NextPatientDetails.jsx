import React, { useContext, useEffect, useState } from "react";

import "../AppointmentList.css";
import { HistoryReport } from "./HistoryReport";
import {
  docterContext,
  PatientCollectionContext,
} from "../../../context/DocterAuthContext";

export default function NextPatientDetails({}) {
  const [open, setOpen] = useState(false);
  const { patientcollection, currno } = useContext(PatientCollectionContext);

  const { docterAPI } = useContext(docterContext);

  const [nextPatientDetails, setNextPatientDetails] = useState({
    audioAndReport: [],
    user: "",
  });
  // console.log("patientcollection",patientcollection,currno);
  useEffect(() => {
    console.log("patientcollection", patientcollection, currno);
    if (patientcollection && currno != undefined) {
      const nextIndx = currno + 1;

      // CHECK: Is the calculated next index within the array's boundaries?
      if (nextIndx < patientcollection.length) {
        const nextPatient = patientcollection[nextIndx];
        console.log("nextPatient", nextPatient);

        const nextPatientFunc = async () => {
          try {
            const res = await docterAPI.post("/getnextpatient", {
              nextPatient,
            });
            console.log(res);
            const result = res?.data;
            setNextPatientDetails({
              audioAndReport: result.prevAndCurrReportAndAudioData,
              user: result.nextUser,
            });
          } catch (err) {
            console.log(err);
          }
        };
        nextPatientFunc();
        // setNextPatient(nextPatient);
      } else {
        //jab last patient ho only
        console.log("This is the last patient in the collection.");
        setNextPatientDetails({
          audioAndReport: [],
          user: null,
        });
      }
    }
  }, [patientcollection, currno]);

  const handleClick = () => {
    setOpen(true);
  };
  return (
    <div className="nextPatientDetails">
      {setOpen && nextPatientDetails && (
      
          <HistoryReport
         
            open={open}
            setOpen={setOpen}
            nextPatientDetails={nextPatientDetails}
          />
      
      )}
      <div style={{ display: "flex" }}>
        <h2>Appointments Details</h2>&nbsp;
        <p>in-progress {nextPatientDetails == null ? "completed" : "Active"}</p>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <div style={{ display: "flex",marginRight:"1rem"}}>
          <i className="fa-regular fa-calendar"></i> */}
        {/* { <div>
            <p>Date</p>
            <h4>April 9,2025</h4>
          </div>
        </div> */}
        <div style={{ display: "flex", marginRight: "1rem" }}>
          <i className="fa-solid fa-user-plus"></i>
          <div>
            <p>Patient</p>
            <h4>{nextPatientDetails?.user?.UserName}</h4>
          </div>
        </div>
        <div style={{ display: "flex", marginRight: "1rem" }}>
          <i className="fa-solid fa-file"></i>

          <div>
            <p>Reports & audio</p>
            <p
              style={{ color: "blue", cursor: "pointer" }}
              onClick={handleClick}
            >
              view
            </p>
          </div>
        </div>
        {/* <div style={{ display: "flex", marginRight:"1rem"}}>
       <i class="fa-solid fa-file-audio"></i>

          <div>
            <p>audio</p>
            <a>view</a>
          </div>
        </div> */}
      </div>

      <div style={{ display: "flex", marginRight: "1rem" }}>
        <i className="fa-regular fa-file"></i>
        <div>
          <p>Department</p>
          <h4>Neurology</h4>
        </div>
      </div>

      <div style={{ display: "flex", marginRight: "1rem" }}>
        <i className="fa-solid fa-hashtag"></i>
        <div>
          <p>Queue Number</p>
          <h4>#2</h4>
        </div>
      </div>
    </div>
  );
}
