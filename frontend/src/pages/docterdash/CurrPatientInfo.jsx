import React from "react";
import "./AppointmentList.css";
export default function CurrentPatient() {
  return (
    <div className="patient-Info">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Patient Information</h2>
        <div>ID:2024988</div>
      </div>
      <div className="profileIcon-And-patientInfo">
        <div>
          <i className="fa-regular fa-user"></i>
        </div>

        <div>
          <h3>Patient Name</h3>
          <div
            style={{ display: "flex", fontSize: "0.8rem", }}
            className="age-gender"
          >
            <p>42 years</p>
            <p>&nbsp;&nbsp;female</p>
          </div>
          <div className="contact-info">
            <div>
              <i className="fa-solid fa-phone"></i>&nbsp;(555) 123-4567
            </div>
            <div>
              <i className="fa-solid fa-envelope"></i>&nbsp;sarah.j@example.com
            </div>
          </div>
          <i className="fa-solid fa-location-dot"></i>&nbsp;123 Main St, Apt 4B,
          Medical City, MC 12345
        </div>
      </div>
    </div>
  );
}
