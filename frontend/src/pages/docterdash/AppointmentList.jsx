import React from "react";
import CurrPatientInfo from "./CurrPatientInfo";

import "../../../../frontend/src/pages/docterdash/AppointmentList.css";
import NextPatientDetails from "./NextAppointments/NextPatientDetails.jsx";
export default function () {
  return <div className="Appointment">

   <CurrPatientInfo/>
   <NextPatientDetails/>

  </div>;
}
