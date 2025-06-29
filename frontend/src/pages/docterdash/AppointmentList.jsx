import React from "react";
import CurrPatientInfo from "./CurrPatientInfo";

import "../../../../frontend/src/pages/docterdash/AppointmentList.css";
import CurrAppointdetails from "./NextAppointments/CurrAppointdetails.jsx";
export default function () {
  return <div className="Appointment">

   <CurrPatientInfo/>
   <CurrAppointdetails/>

  </div>;
}
