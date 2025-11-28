import React, { useEffect, useState, useContext, createContext } from "react";
import "./Headder.css";
import { io } from "socket.io-client";
import { docterContext } from "../../context/DocterAuthContext";
import { socket } from "./Socket/Socket.js";
import { PatientCollectionContext } from "../../context/DocterAuthContext";
import { Children } from "react";
import { useCallback } from "react";

export const Card = () => {
  const { docterAPI } = useContext(docterContext);
  const [totalpatient, setTotalPatient] = useState(null);
  const {
    // patientCollection,
    // setPatientCollection,
    nextPatientDocument,
    setNextPatientDocument,
    currPatientDocument,
    setCurrPatientDocument,
  } = useContext(PatientCollectionContext);

  const [totalConsultedPatients, setTotalConsultedPatients] = useState(null);
  const [totalWaintingPatients, setTotalWaintingPatients] = useState(null);
  const fetchConsultedPatients = useCallback(async () => {
    try {
      const res = await docterAPI.get("/api/consultedPatients");
      console.log("Consulted Patients:", res.data);
      if (res.status === 200) {
        const consultedPatientsData = res.data.totalConsultedPatients;
        console.log("Today's Consulted Patients Data:", consultedPatientsData);

        setTotalConsultedPatients(consultedPatientsData);
      }
    } catch (err) {
      console.log(err.data.err);
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await docterAPI.get("/api/appointments");
      const currPatientData = res.data.currPatient;

      // setPatientCollection(patientCollectionData);
      setCurrPatientDocument(currPatientData)

      const totalPatientCount = res.data.totalAppointment;

      setTotalPatient(totalPatientCount);

      console.log(res);
    } catch (err) {
      console.log(err.data);
    }
  }, []);

  const fetchTotalWatingPatients = useCallback(async () => {
    if (currPatientDocument) {
      console.log("currentPatientDocument", currPatientDocument);
      try {
        const res = await docterAPI.post(
          "/api/appointments/waiting",
          currPatientDocument
        );
        const waitingPatients = res.data.totalWaitingAppointments; //ye total waiting patient hai
        console.log("Waiting Patients Data:", res.data.waitingAppointments); // and ye data hai total waiting patient kaa
        if (waitingPatients > 0) {
          setTotalWaintingPatients(waitingPatients);
        }
      } catch (err) {
        console.log(err.data.err);
      }
    }
  }, [docterAPI,currPatientDocument]);

  useEffect(() => {
    if (currPatientDocument) {
      fetchTotalWatingPatients();
    }
    const handleWaitingEvent = () => fetchTotalWatingPatients();
    socket.on("totalWaitingPatient", handleWaitingEvent);
    return () => {
      socket.off("totalWaitingPatient", handleWaitingEvent);
    };
  }, [currPatientDocument]);


  useEffect(() => {
    fetchAppointments();
 
    fetchConsultedPatients();

    const handleConsultedEvent = () => fetchConsultedPatients();
    const handleTotalPatientEvent = (totalappointment) =>
      setTotalPatient(totalappointment);

    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    // socket.on("totalConsultedPatients", handleConsultedEvent);

    socket.on("totalPatient", handleTotalPatientEvent);

    // optional: clean up on unmount
    return () => {
      socket.off("totalConsultedPatients", handleConsultedEvent);
      socket.off("totalPatient", handleTotalPatientEvent);
     
    };
  }, [fetchAppointments, fetchConsultedPatients]);

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
          <p>{totalWaintingPatients} patient waiting</p>
        </div>
      </div>
    </div>
  );
};
