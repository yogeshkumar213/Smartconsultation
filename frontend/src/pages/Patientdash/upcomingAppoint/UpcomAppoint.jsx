import React, { useCallback, useState } from "react";
import "../Patientdash.css";
import { UpComingAppointmentContext } from "../../../context/PatientFormContext";
import { useContext } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

export default function UpcomAppoint() {
  const { client } = useAuth();
  const { appointmentFormData,setAppointmentFormData } = useContext(UpComingAppointmentContext);

  const fetchUpcomingAppointment = useCallback(async () => {
    try {
      const res = await client.get("/getAllUpcomingAppointment");
      console.log("UpcomingAppointment",res);
      setAppointmentFormData(res.data.appointment);
      

    } catch (err) {
      console.log(err);
    }
  },[]);
  useEffect(() => {
    fetchUpcomingAppointment();
  }, [fetchUpcomingAppointment]);

  useEffect(() => {
    if (appointmentFormData.length > 0) {
      console.log("appointmentformData", appointmentFormData);
    }
  }, [appointmentFormData]); //kisi ek field ko check kar lenge ki data aaya hai ya nhi ager aisa nhi karte too empty object bhi true hoota hai js mai
  return (
    <>
      <div className="appointmentContainer">
        <h2>Upcoming Appointments</h2>

        {appointmentFormData.length > 0 &&
          appointmentFormData.map((app, index) => (
            <div className="appointmentSchedule" key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <h4>{app.Docter}</h4>

                <p
                  style={{
                    backgroundColor: "rgb(205, 200, 215)",
                    borderRadius: "1rem",
                    padding: "0.1rem 0.4rem",
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "center",
                    color: "blue",
                  }}
                >
                  CurrQueue <b>:</b> &nbsp;&nbsp;8
                </p>
              </div>

              <p>{app.specilization}</p>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <i className="fa-regular fa-calendar"></i>&nbsp;
                  {app.Date?.split("T")[0]}
                </div>

                <div style={{ paddingRight: "8rem" }}>
                  <i className="fa-regular fa-clock"></i>&nbsp;
                  {app.Time}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    color: "blue",
                    marginTop: "1rem",
                    padding: "0.2rem 0.5rem",
                    backgroundColor: "rgb(205, 200, 215)",
                    borderRadius: "1rem",
                  }}
                >
                  <b>
                    Queue no &nbsp;&nbsp;
                    {app.queueNum}
                  </b>
                </span>

                <div style={{ cursor: "pointer" }}>
                  <div>
                    <i
                      className="fa-solid fa-arrow-up-right-from-square"
                      style={{ color: "red", fontSize: "0.8rem" }}
                    ></i>
                    &nbsp;&nbsp; Details
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
