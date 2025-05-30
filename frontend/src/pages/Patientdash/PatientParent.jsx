import React from "react";
import PatientHeadder from "./PatientHeadder.jsx";
import Herosection from "./Herosection.jsx";
import DocterSelection from "./DocterSelection.jsx";
// import SubSymtoms from "./symtoms/Submitsymstoms.jsx";
import {AudioRecorderComponent} from "./symtoms/Submitsymstoms.jsx";
import UpcomAppoint from "./upcomingAppoint/UpcomAppoint.jsx";

export default function Parent() {
  return (
    <div>
      <PatientHeadder />
      <Herosection />
      <DocterSelection />
      
      <div style={{display:"flex", width:"100%"}}>
        <AudioRecorderComponent />
        <UpcomAppoint />
      </div>
    </div>
  );
}
