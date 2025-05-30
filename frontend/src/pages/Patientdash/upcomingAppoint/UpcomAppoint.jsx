import React, { useState } from "react";
import "../Patientdash.css";
export default function UpcomAppoint() {
  const [DrName, setDrName] = useState("Dr.Sarah Smith");
  const [Department, setDepartment] = useState("Cardiology");
  const [AppoinDate, setAppointDate] = useState("Fri, Apr 18, 2025");
  const [Time, setTime] = useState("12 AM");
  const[CurrQueue,setCurrQueue]=useState("6")
  const [QueueNum, setQueueNum] = useState("12");
  return (
    <div className="appointmentContainer">
      <h2>Upcoming Appointments</h2>
      <div className="appointmentSchedule">
        <div style={{display:"flex",justifyContent:"space-between", alignItems:"center",marginBottom:"1rem"}}>
        <h4>{DrName}</h4>
        <p style={{backgroundColor:"rgb(205, 200, 215)", borderRadius:"1rem", padding:"0.1rem 0.4rem", display:"flex",alignContent:"center",justifyContent:"center",color:"blue"}}>CurrQueue <b>:</b> &nbsp;&nbsp;{CurrQueue}</p>
        </div>
      
        <p>{Department}</p>
        <div style={{display :"flex", justifyContent:"space-between " }}>
          <div style={{display:"flex", alignItems:"center"}}>
            <i className="fa-regular fa-calendar"></i>&nbsp;
            {AppoinDate}
          </div>

          <div style={{paddingRight:"8rem"}}>
            <i className="fa-regular fa-clock"></i>&nbsp;
            {Time}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{color:"blue", marginTop:"1rem",padding:"0.2rem 0.5rem",backgroundColor:"rgb(205, 200, 215)", borderRadius:"1rem" }}>Queue Number <b>:</b>&nbsp;&nbsp;{QueueNum}</span>
          <div style={{cursor:"pointer"}}>
          <div> <i className="fa-solid fa-arrow-up-right-from-square" style={{color:"red",fontSize:"0.8rem"}}></i>&nbsp;&nbsp; Details</div>
          </div>
         
         
        </div>
      </div>
    </div>
  );
}
