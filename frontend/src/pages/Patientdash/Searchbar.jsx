import { Input, InputBase, styled } from "@mui/material";
import React, { useRef, useState } from "react";
import { Department } from "./Department.jsx";
import { createContext, useContext } from "react";

import "./Patientdash.css";
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  // const buttonRef = useRef();
  const [DocterName, setDocterName] = useState("");

  return (
    <SearchContext.Provider value={{ DocterName, setDocterName }}>
      {children}
    </SearchContext.Provider>
  );
};
export const useSearchContext = () => {
  return useContext(SearchContext);
};
export const SearchBarPatient = () => {
  const [Border, setborder] = useState(false);
  const { DocterName, setDocterName } = useContext(SearchContext);
  const [searchDoc, setsearchDoc] = useState("");

  const handleClick = () => {
    setborder((preValue) => !preValue);
  };
  const handleSearch = (e) => {
    if (!e.target.value) {
      setDocterName(DocterName);
    }
    console.log(e.target.value);
    setsearchDoc(e.target.value);
  };
  const handleSubmit = () => {
    setDocterName(searchDoc.trim());
  };
  const handleKeydown = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="seracbar-department">
      <div
        className="patientsearchBarr"
        onClick={handleClick}
        style={Border ? { border: "1px solid blue" } : {}}
      >
        <label htmlFor="icon">
          <i className="fa-solid fa-magnifying-glass"></i>
        </label>
        &nbsp;
        <Input
          placeholder="Search patient by name or symptoms..."
          value={searchDoc}
          id="icon"
          fullWidth
          disableUnderline
          onChange={handleSearch}
          onKeyDown={handleKeydown}
          inputProps={{
            style: {
              fontSize: "1rem",
              color: "#000", // full black
              opacity: 1,
            },
          }}
        ></Input>
        <button onClick={handleSubmit}>
          <i className="fa-solid fa-arrow-right-long"></i>
        </button>
      </div>
      <Department />
    </div>
  );
};
