import React, { useEffect, useState } from "react";
import "./Patientdash.css";
import Badge from "@mui/material/Badge";
// import Stack from '@mui/material/Stack';
import MailIcon from "@mui/icons-material/Mail";
import { jwtDecode } from "jwt-decode";

export default function Herosection() {
 
  const [Email,setEmail]=useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
      const decode = jwtDecode(token);
      console.log(decode.Email);
      const properEmail=decode.Email.split('@')[0];
      setEmail(properEmail);
    }
  
  }, []);

  const currendate = new Date();
  return (
    <div className="patient-dashboard">
      <div>
        <h2 style={{ padding: "0rem", margin: "0rem" }}>{Email}</h2>
        <div>
          <p>{currendate.toString()}</p>
        </div>
      </div>
      <div>
        {/* <Badge badgeContent={4} color="success">
        <MailIcon color="action" />
      </Badge> */}
      </div>
    </div>
  );
}
