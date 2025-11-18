import React from "react";
import PatientHeadder from "./PatientHeadder.jsx";
import Herosection from "./Herosection.jsx";
import DocterSelection from "./DocterSelection.jsx";
import { useNavigate } from "react-router-dom";
// import SubSymtoms from "./symtoms/Submitsymstoms.jsx";
import { AudioRecorderComponent } from "./symtoms/Submitsymstoms.jsx";
import UpcomAppoint from "./upcomingAppoint/UpcomAppoint.jsx";
import AuthParent from "../Authentication/AuthParent.jsx";
import { useSnackbar } from "../../context/Snakbarr.jsx";
import { useContext } from "react";

export default function Parent() {
  const navigate = useNavigate();
 
  // localStorage.getItem("doctoken");


  return (
    <>
     
        <div>
          <PatientHeadder />
          <Herosection />
          <DocterSelection />

          <div style={{ display: "flex", width: "100%" }}>
            <AudioRecorderComponent />
            <UpcomAppoint />
          </div>
        </div>
      
    </>
  );
}
