import React, { useState } from "react";


import "../AppointmentList.css";
import { HistoryReport } from "./HistoryReport";
export default function CurrAppointdetails() {
  const [open,setOpen]=useState(false);
  const handleClick=()=>{
    setOpen(true);
  }
  return (

    <div className="currappointmentdetails">
      {setOpen && <HistoryReport open={open} setOpen={setOpen}/>}
      <div style={{ display: "flex" }}>
        <h2>Appointments Details</h2>
        <p>in-progress</p>
      </div>
      <div style={{ display: "flex", justifyContent:"space-between" }}>
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
            <p>Patient </p>
            <h4>Dr.Michael</h4>
          </div>
        </div>
        <div style={{ display: "flex", marginRight: "1rem" }}>
          <i className="fa-solid fa-file"></i>

          <div>
            <p>Reports & audio</p>
            <p style={{color:"blue", cursor:"pointer"}} onClick={handleClick}>view</p>
          
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
