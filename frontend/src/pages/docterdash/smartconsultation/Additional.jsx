import React, { useContext, useEffect } from "react";
import "../AppointmentList.css";
import { useState } from "react";
import "../AppointmentList.css";
import { UploadFile } from "./UploadFile";
import { docterContext } from "../../../context/DocterAuthContext";
export default function AdditionalInfo() {
  const [File, setFile] = useState("");


  return (
    <div className="Additional-info">
      <h2>Patient File</h2>
      <b>
        <p>Upload Reports</p>
      </b>
      <div className="drag-drop">
        <i
          className="fa-solid fa-file-arrow-up fa-2x"
          style={{ display: "flex", justifyContent: "center" }}
        ></i>
        <h3
          style={{
            fontWeight: "2rem",
            fontSize: "1.1rem",
            padding: "1rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <b>Drag and drop file here</b>
        </h3>

        <h4 style={{ fontSize: "1rem", padding: "0 0 0.3rem 1rem" }}>
          Attach Test Report
        </h4>

        <UploadFile />

        <p>Supported formats: PDF, JPG, PNG (Max 10MB)</p>
      </div>
    </div>
  );
}
