import React from "react";
import CurrPatientInfo from "./CurrPatientInfo";

import "./AppointmentList.css";
import CurrAppointdetails from "./CurrAppointdetails";
export default function () {
  return <div className="Appointment">

   <CurrPatientInfo/>
   <CurrAppointdetails/>

  </div>;
}
