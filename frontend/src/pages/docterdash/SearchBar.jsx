import { Input, InputBase, styled } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { PatientHistory } from "./History1.jsx/History.jsx";
import "../docterdash/Headder.css";
import { docterContext } from "../../context/DocterAuthContext.jsx";

export default function SearchBar() {
  const [Border, setborder] = useState(false);
  const [PatientName, setPatientName] = useState("");
  const [historyTrigg, setHistoryTrigg] = useState(false);
  const { docterAPI } = useContext(docterContext);
  const [allAppointment, setAllAppointment] = useState([]);
  const navigate = useNavigate();
  const handleClick = () => {
    setborder((preValue) => !preValue);
  };
  const handleSearch = (e) => {
    setPatientName(e);
  };
  const handleClick1 = async (e) => {
    // e.preventDefault();
    console.log("button clicked");
    try {
      const patient = await docterAPI.post("/patient-srch", {
        patient: PatientName,
      });

      console.log(patient);
      setHistoryTrigg(true);
      setAllAppointment(patient);

      // navigate("/history")
    } catch {
      console.log("request failed");
    }
  };

  return (
    <div
      className="searchBarr"
      onClick={handleClick}
      style={Border ? { border: "1px solid blue" } : {}}
    >
      {historyTrigg ? (
        <PatientHistory
          searchedPatient={allAppointment}
          value={historyTrigg}
          setValue={setHistoryTrigg}
        />
      ) : null}
      <label htmlFor="icon">
        <i className="fa-solid fa-magnifying-glass"></i>
      </label>
      &nbsp;
      <Input
        placeholder="Search patient by name or symptoms..."
        value={PatientName}
        id="icon"
        fullWidth
        disableUnderline
        onChange={(e) => handleSearch(e.target.value)}
        inputProps={{
          style: {
            fontSize: "1rem",
            color: "#000", // full black
            opacity: 1,
          },
        }}
      ></Input>
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={(e) => handleClick1(e)}
      >
        Search
      </Button>
    </div>
  );
}
