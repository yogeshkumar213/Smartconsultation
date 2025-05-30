import { Input, InputBase, styled } from "@mui/material";
import React, { useState } from "react";

export default function SearchBar () {
  const [Border, setborder] = useState(false);
  const [PatientName, setPatientName] = useState("");
  const handleClick = () => {
    setborder((preValue) => !preValue);
  };
  const handleSearch = (e) => {
   setPatientName(e);
  };
  
  return (
    <div
      className="searchBarr"
      onClick={handleClick}
      style={Border ? { border: "1px solid blue" } : {}}
    >
       <label htmlFor="icon"><i className="fa-solid fa-magnifying-glass"></i></label>&nbsp;
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
                color: "#000",        // full black
                opacity: 1,
            },
          }}
      ></Input>
    </div>
  );
}
