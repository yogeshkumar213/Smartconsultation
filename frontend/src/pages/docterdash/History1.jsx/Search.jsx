import { Input, InputBase, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import { PatientData } from "./PatientData.jsx";
import "./History.css";

// import { docterContext } from "../../context/DocterAuthContext.jsx";

export const SearchHistory = ({ searchedPatient }) => {
  const [Border, setborder] = useState(false);
  const [filteredpatient, setFilteredPatient] = useState("");
  const [query, setQuery] = useState("");
  //   const [historyTrigg, setHistoryTrigg] = useState(false);
  //   const { docterAPI } = useContext(docterContext);
  //   const navigate = useNavigate();
  const handleClick = () => {
    setborder((preValue) => !preValue);
  };
  const handleSearch = (e) => {
    setQuery(e);
  };
  const handleClick1 = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("button clicked");
    // try {
    //   const patient = await docterAPI.post("/patient-srch", {
    //     patient: PatientName,
    //   });

    //   console.log(patient);
    //   setHistoryTrigg(true);
    //   // navigate("/history")
    // } catch {
    //   console.log("request failed");
    // }
  };
  console.log(searchedPatient);
  useEffect(() => {
    const result = searchedPatient.data.allAppointments.filter((pat) => {
      const name = pat?.Patient?.userName || "";
      const email = pat?.Patient?.Email || "";
      return name.includes(query) || email.includes(query);
    });
    setFilteredPatient(result);
  }, [query, searchedPatient]);

  return (
    <div>
      <div
        className="searchBarr"
        onClick={handleClick}
        style={Border ? { border: "1px solid blue" } : {}}
      >
        {/* {historyTrigg ? <History value={historyTrigg} setValue={setHistoryTrigg}/> :null} */}
        <label htmlFor="icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </label>
        &nbsp;
        <Input
          placeholder="Search patient by name or symptoms..."
          value={query}
          id="icon"
          fullWidth
          disableUnderline
          onChange={(e) => handleSearch(e.target.value)}
          inputProps={{
            style: {
              fontSize: "1rem",

              color: "#000",
              backgroundColor: "transparent",
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
      <div style={{margin:"1rem"}}>
        <PatientData searchedPatient={searchedPatient} filteredpatient={filteredpatient}/>
      </div>
    </div>
  );
};
