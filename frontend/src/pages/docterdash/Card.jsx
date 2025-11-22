import React, { useEffect, useState, useContext, createContext } from "react";
import "./Headder.css";
import { io } from "socket.io-client";
import { docterContext } from "../../context/DocterAuthContext";
import { socket } from "./Socket/Socket.js";
import { PatientCollectionContext } from "../../context/DocterAuthContext";
import { Children } from "react";

export const Card = () => {
  const { docterAPI } = useContext(docterContext);
  const [totalpatient, setTotalPatient] = useState(null);
  const { patientCollection, setPatientCollection, nextPatientDocument, setNextPatientDocument } = useContext(
    PatientCollectionContext
  );
  const [totalConsultedPatients, setTotalConsultedPatients] = useState(null);
  const fetchConsultedPatients = async () => {
    try {
      const res = await docterAPI.get("/api/consultedPatients");
      console.log("Consulted Patients:", res.data);
      if (res.status === 200) {
        const consultedPatientsData = res.data.todayConsultedAppointments;
        console.log("Today's Consulted Patients Data:", consultedPatientsData);
        setTotalConsultedPatients(consultedPatientsData);
      }
    } catch (err) {
      console.log(err.data.err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await docterAPI.get("/api/appointments");
      const patientCollectionData = res.data.Collection;
      setPatientCollection(patientCollectionData);

      const totalPatientCount = res.data.totalAppointment;
      setTotalPatient(totalPatientCount);
      console.log(res);
    } catch (err) {
      console.log(err.data.err);
    }
  };
  useEffect(() => {
    fetchAppointments();

    fetchConsultedPatients();

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("totalConsultedPatients",()=>{
      fetchConsultedPatients();
    });

    socket.on("totalPatient", (totalappointment) => {
      console.log("got data from backend", totalappointment);
      // setTotalPatient((pre)=>[...pre,appointment]);
      setTotalPatient(totalappointment);
    });

    // optional: clean up on unmount
    return () => {
      socket.off("totalConsultedPatients");
      socket.off("totalPatient");
    };
  }, []);

  return (
    <div>
      <div className="card">
        <div className="all3card">
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <b>Total Patients</b>
            <i className="fa-regular fa-id-card"></i>
          </span>

          <h2>{totalpatient}</h2>
          <p>approximents today</p>
        </div>
        <div className="all3card">
          <span
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            consulted
            <i className="fa-solid fa-check"></i>
          </span>

          <h2>{totalConsultedPatients}</h2>
          <p>{totalConsultedPatients === 0 ? "No patient seen yet" : ""}</p>
        </div>

        <div>
          <span style={{ display: "flex", justifyContent: "space-between" }}>
            {" "}
            Next Appointment <i className="fa-regular fa-clock"></i>
          </span>
          <h2>{nextPatientDocument?.Time ?? "No next Appointment"}</h2>
          <p>7 patient waiting</p>
        </div>
      </div>
    </div>
  );
};
