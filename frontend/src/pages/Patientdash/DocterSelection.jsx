import React from "react";
import {SearchBarPatient} from "./Searchbar.jsx";
import {Card} from "./Card.jsx";
import Calender from "./Calender.jsx";
import "./Patientdash.css";
export default function () {
  return (
    <div className="docterSel-cale">
      <div style={{ width: "60%" }} className="docterSelection">
        <h3>Select a Docter</h3>
        <SearchBarPatient />
        <Card/>
      </div>
      <div style={{ width: "40%" }}>
        <Calender />
      </div>
    </div>
  );
}
