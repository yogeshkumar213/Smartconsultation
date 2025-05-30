import React from "react";
import "./Headder.css";

export default function Card() {
  return (
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

        <h2>7</h2>
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
      
        <h2>0</h2>
        <p>No patient seen yet</p>
      </div>

      <div>
     <span style={{display:"flex",justifyContent:"space-between"}}>  Next Appointment <i className="fa-regular fa-clock"></i></span>
        <h2>09:00 Am</h2>
        <p>7 patient waiting</p>
      </div>
    </div>
  );
}
