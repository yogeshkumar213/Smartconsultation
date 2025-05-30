import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { useContext, createContext } from "react";
import Select from "@mui/material/Select";
// import { DocterAuth } from "./Card.jsx";
import { useState } from "react";
import "./Patientdash.css";
import { useAuth } from "../../context/AuthContext.jsx";
const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [Department, setDepartment] = useState("All");

  return (
    <DepartmentContext.Provider value={{ Department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};
export const useDepartment =()=>{
  return useContext(DepartmentContext);
}
export const Department = () => {
  const {Department, setDepartment} = useContext(DepartmentContext);

  const handleChange = (event) => {
    console.log(event.target.value);
    // setDocterList(event.target.value);

    setDepartment(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: "12rem", cursor: "pointer" }}>
        {/* <InputLabel id="demo-simple-select-helper-label">Department</InputLabel> */}
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={Department}
          onChange={handleChange}
          sx={{
            //   '& .MuiOutlinedInput-root': {
            //     // Remove default border from the input
            //     '& fieldset': {
            //       // border: 'none',

            //     }
            // },
            "& .MuiOutlinedInput-input": {
              // border:"1px solid blue",
              padding: "0.7rem",
              // borderRadius:"1rem"
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="General Physician">General Physician</MenuItem>
          <MenuItem value="Cardiologist">Cardiologist</MenuItem>
          <MenuItem value="Neurologist">Neurologist</MenuItem>
          <MenuItem value="Dermatologist">Dermatologist</MenuItem>
          {/* <MenuItem value="Orthopadics">Orthopadics</MenuItem> */}
          <MenuItem value="Pediatrician">Pediatrician</MenuItem>
          <MenuItem value="Ophthalmologist">Ophthalmologist</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};
