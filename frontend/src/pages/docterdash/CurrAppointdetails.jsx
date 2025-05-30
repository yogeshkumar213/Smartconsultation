import React from "react";
import "./AppointmentList.css";
export default function CurrAppointdetails() {
  return (
    <div className="currappointmentdetails">
      <div style={{display:"flex"}}>
        <h2>Appointments Details</h2>
        <p>in-progress</p>
      </div>
      <div style={{display:"flex"}}>
        <div style={{ display: "flex",marginRight:"1rem"}}>
          <i className="fa-regular fa-calendar"></i>

          <div>
            <p>Date</p>
            <h4>April 9,2025</h4>
          </div>
        </div>
        <div style={{ display: "flex", marginRight:"1rem"}}>
          <i className="fa-regular fa-clock"></i>

          <div>
            <p>Time</p>
            <h4>10:30</h4>
          </div>
        </div>
        <div style={{ display: "flex" ,marginRight:"1rem"}}>
          <i className="fa-solid fa-user-plus"></i>
          <div>
            <p>Docter</p>
            <h4>Dr.Michael</h4>
          </div>
        </div>
      </div>

      <div style={{ display: "flex",marginRight:"1rem" }}>
        <i className="fa-regular fa-file"></i>
        <div>
          <p>Department</p>
          <h4>Neurology</h4>
        </div>
      </div>

      <div style={{display:"flex",marginRight:"1rem"}}>
        <i className="fa-solid fa-hashtag"></i>
        <div>
        <p>Queue Number</p>
        <h4>#2</h4>
        </div>
        
      </div>
    </div>
  );
}
