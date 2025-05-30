import React, { useEffect, useState } from "react";

import { useAuth } from "../../../context/AuthContext";
import "../Patientdash.css";
import { useFormData } from "../../../context/PatientFormContext";

export default function SelectTime() {
  const [prescheduledtime, setPrescheduledTime] = useState([]);
  const [appointtime, setAppointTime] = useState("");
  const {client} =useAuth();
  const { formData, setFormData } = useFormData();
  useEffect(() => {
    client
      .get("http://localhost:8080/api/v1/getappointDate")
      .then((res) => {
        console.log(res);
        setPrescheduledTime(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
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
          <div
            key={item}
            className="item"
            onClick={() => handleTime(item)}
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
        );
      })}
    </div>
  );
}
