import React, { Children, useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Patientdash.css";
import Button from "@mui/material/Button";
import axios from "axios";
import { useContext } from "react";
import { useSnackbar } from "../../context/Snakbarr.jsx";
import { useDepartment } from "./Department";
import { useSearchContext } from "./Searchbar.jsx";
import Checkbox from "@mui/material/Checkbox";
import { useFormData } from "../../context/PatientFormContext.jsx";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export const Card = () => {
  const navigate = useNavigate();
  const { Department } = useDepartment();
  const [docterList, setDocterList] = useState([]);
  const { DocterName, setDocterName } = useSearchContext();
  const [allDoctors, setAllDoctors] = useState([]);
  const [docterId, setDocterId] = useState("");
  const [docterSelectIcon, setDocterSelectIcon] = useState("");
  const tickIcon = useRef(null);
  const { formData, setFormData } = useFormData();
  const { showSnakbar } = useSnackbar();

  const client = axios.create({
    baseURL: "http://localhost:5050/api/v1",
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  useEffect(() => {
    client
      .get("/hospital/getDocterlist")
      .then((res) => {
        console.log(res.data.docterList);
        setDocterList(res.data.docterList);
        setAllDoctors(res.data.docterList);
      })
      .catch((err) => {
        if (
          err.response.data.message == "Access token is not found" ||
         err.response.data.message === "invalid or expired token"
        ) {
          navigate("/auth/signin");
          showSnakbar(err.response.data.message);
          console.log(err.response.data);
        }
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   if (!DocterName.trim()) {
  //     return setDocterList(allDoctors);
  //   };
  //   axios
  //     .post("http://localhost:8080/api/v1/hospital/docterName", { DocterName })
  //     .then((res) => {
  //       console.log(res.data.docterListByName);

  //       setDocterList(res.data.docterListByName);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [DocterName,allDoctors]);
  useEffect(() => {
    if (!DocterName.trim()) {
      setDocterList(allDoctors);
    } else {
      const filtered = allDoctors.filter((doc) =>
        doc.DocterName.toLowerCase().includes(DocterName.toLowerCase())
      );
      setDocterList(filtered);
    }
  }, [DocterName, allDoctors]);

  useEffect(() => {
    if (Department === "All") {
      return setDocterList(allDoctors); // Reset back to all doctors
    } else {
      const filtered = allDoctors.filter(
        (item) => item.Specilization === Department
      );

      setDocterList(filtered);
    }
  }, [Department, allDoctors]);
  
  const docterSelection = (id) => {
    setDocterId(id);
    setDocterSelectIcon(id);
    console.log(id);
    setFormData((prev) => {
      return {
        ...prev,
        Docter: id,
      };
    });
  };
  const handlecheckBox = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div className="all-doctors-container">
        {docterList.map((item) => (
          <div key={item._id} className="docIcon-details">
            <h2
              style={{
                height: "1rem",
                width: "1rem",
                padding: "2rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "1rem",
                borderRadius: "4rem",
                backgroundColor: "rgb(174, 168, 188)",
              }}
            >
              D
            </h2>

            <div className="docter-details">
              <h4>{item.DocterName}</h4>
              <p style={{ fontSize: "0.9rem" }}>{item.Specilization}</p>
              <div className="rating-Expe">
                <b className="department">{item.Department}</b>
                <p className="rating">{item.Rating}</p>
                <p className="experience">{item.Experience}</p>
              </div>
              <div className="available-selectbtn">
                <p style={{ fontSize: "0.8rem" }}>{item.Availablity}</p>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => docterSelection(item._id)}
                  ref={tickIcon}
                  style={{ backgroundColor: "black" }}
                >
                  {formData.Docter== item._id ? (
                    <Checkbox
                    value={formData.Docter}
                      onClick={handlecheckBox}
                      // {...label}
                      defaultChecked
                      sx={{ "&.MuiButtonBase-root": { padding: 0 } }}
                    />
                  ) : (
                    "SELECT"
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
