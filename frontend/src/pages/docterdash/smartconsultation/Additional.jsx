import React from "react";
import "../AppointmentList.css";
import { useState } from "react";
import "../AppointmentList.css";
export default function AdditionalInfo() {
  const [File, setFile] = useState("");
  function handleChange(e) {
    console.log(e);
  }
  function handleupload() {}
  return (
    // <div className="Additional">
    <form action="" onSubmit={handleupload} className="Additional-info">
      <h2>Patient File</h2>
      <b><p>Upload Reports</p></b>
      <div className="drag-drop">
        <i
          className="fa-solid fa-file-arrow-up fa-2x"
          style={{ display: "flex", justifyContent: "center" }}
        ></i>
        <h3 style={{ fontWeight: "2rem", fontSize: "1.1rem", padding: "1rem", display: "flex", justifyContent: "center"  }}>
          <b>Drag and drop file here</b>
        </h3>
        <input
          type="file"
          id="file"
          onChange={handleChange}
          style={{ padding: "1rem", display: "flex", justifyContent: "center" ,alignContent:"center" }}
        ></input>
        {/* <label htmlFor="file"><button>browse files</button></label> */}
        <button type="submit" style={{ fontSize: "1rem" , display: "flex", justifyContent: "center",alignContent:"center" }}>
          upload
        </button>
        <p>Supported formats: PDF, JPG, PNG (Max 10MB)</p>
      </div>
    </form>
    // </div>
  );
}
