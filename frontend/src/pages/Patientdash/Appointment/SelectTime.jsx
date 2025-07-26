import React, { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import "../Patientdash.css";
import { useFormData } from "../../../context/PatientFormContext";
import FormControl from "@mui/material/FormControl";
import { AgeGender } from "./AgeGender";
export default function SelectTime() {
  const [prescheduledtime, setPrescheduledTime] = useState([]);
  const [appointtime, setAppointTime] = useState("");
  const { client } = useAuth();

  const [age, setAge] = React.useState("");
  const [gender,setGender]=useState("");

  const handleGenderChange=()=>{

  }
  const { formData, setFormData } = useFormData();
  useEffect(() => {
    client
      .get("http://localhost:5050/api/v1/getappointtime")
      .then((res) => {
        console.log(res);
        setPrescheduledTime(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };
  const handleTime = (item) => {
    setAppointTime(item);
    setFormData((prev) => {
      return {
        ...prev,
        Time: item,
      };
    });
    console.log(item);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        // height: "1rem",
        borderRadius: "1rem",
        margin: "0.5rem 0",
        flexWrap: "wrap",
        color: "black",
      }}
    >
      {prescheduledtime.map((item) => {
        return (
          // <div>
          <div
            key={item}
            className="item"
            onClick={() => handleTime(item)}
            value={formData.Time}
            style={{
              display: "flex",
              border: "1px solid black",
              padding: "0.2rem 1rem",
              borderRadius: "3rem",
              margin: "0.4rem",
              fontSize: "0.8rem",
              cursor: "pointer",
              ...(appointtime == item ? { backgroundColor: "#1976d2" } : {}),
            }}
          >
            {item}
          </div>

          // </div>
        );
      })}
      {appointtime && (
        <div>
        <AgeGender label="Gender" value={gender} onChange={handleGenderChange} options={[
          {value:"male" ,label:"Male"},{value:"female",label:"Female"},{value:"other",label:"other"}]} age={age} setAge={setAge} gender={gender} setGender={setGender}/>
        </div>
      )}


    </div>
  );
}
