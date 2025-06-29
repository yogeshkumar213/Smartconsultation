import React from "react";
import {DocterHeadder} from "./Headder.jsx";
import CardParent from "./CardParent.jsx";
import SearchBar from "./SearchBar.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";
import AppointmentList from "./AppointmentList.jsx";
import SmartConsul from "./smartconsultation/SmartConsul.jsx";
import "./AppointmentList.css";

export default function DocterDash() {
  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <DocterHeadder />
      <h2>Todays Appointments</h2>
      <CardParent />
      <SearchBar />

      <AppointmentList />
      <SmartConsul />
    </div>
  );
}
