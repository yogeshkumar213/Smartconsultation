import React, { useEffect } from "react";
import { DocterHeadder } from "./Headder.jsx";
import CardParent from "./CardParent.jsx";
import SearchBar from "./SearchBar.jsx";
// import { AuthProvider } from "./context/AuthContext.jsx";
import AppointmentList from "./AppointmentList.jsx";
import SmartConsul from "./smartconsultation/SmartConsul.jsx";
import "./AppointmentList.css";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function DocterDash() {
  const navigate = useNavigate();

  //  useEffect(() => {
  //   const doctoken = localStorage.getItem("doctoken");
  //   console.log("Token:", doctoken);

  //   if (!doctoken) {
  //     console.log("doctertoken is not found");
  //     navigate("/auth/signin");
  //   }
  // }, []);

  return (
    <>
      {/* {doctoken && ( */}
      <div className="container " style={{ minHeight: "100vh" }}>
        <DocterHeadder />
        <CardParent />
        <SearchBar />
        <AppointmentList />
        <SmartConsul />
      </div>
      {/* )} */}
    </>
  );
}
