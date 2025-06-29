import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { jwtDecode } from "jwt-decode";

import axios from "axios";
import { DocterHeadder } from "../Headder";
import { docterContext } from "../../../context/DocterAuthContext.jsx";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// import { useSnackbar } from "../../../context/Snakbarr.jsx"
import {useSnackbar } from "../../../context/Snakbarr.jsx";
export const DocterProfileEdit = () => {
  const [docter, setDocter] = useState({});
  const { docterAPI } = useContext(docterContext)
  const [newvalue, setNewValue] = useState({});
  const {showSnakbar}=useSnackbar();
  const navigate=useNavigate();

  useEffect(() => {
    const docter = () => {
      const token = localStorage.getItem("doctoken");
      if (!token) {
        return null;
      }
      const docter = jwtDecode(token);
      console.log(docter);
      console.log(docter.DocterName);
      setDocter(docter);
      setNewValue({
        Email: docter.Email,
        password: "",
      });
    };
    docter();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("button clicked");
    // console.log(localStorage.getItem("doctoken"))
    try {
      const res = await docterAPI.put("/doc-det-edit", {
        newvalue,
      });
      console.log(res);
      if (res.data.message === "docter profile updated successfully") {
        const token = localStorage.removeItem("doctoken");
        
        navigate("/auth/signin")
        showSnakbar(res.data.message);
      }
      else{
        console.log(res.data.message);
        showSnakbar(res.data.message);

      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    const item = e.target.name;
    const newvalue = e.target.value;
    console.log(item);
    console.log(newvalue);
    setNewValue((oldValue) => {
      return {
        ...oldValue,
        [item]: newvalue,
      };
    });
  };
  return (
    <div>
      <DocterHeadder />
      <div className="profiledetls">
        <h2>My Profile</h2>
        <p>Manage your account details and preferences</p>
        <div
          style={{
            border: "1px solid rgb(216,214,222)",
            padding: "1rem",
            borderRadius: "1rem",
            marginTop: "1rem",
          }}
        >
          <h2>Personal Information</h2>
          <br></br>
          <div style={{ display: "flex" }}>
            <div
              className="UserIcon"
              style={{
                fontSize: "1.2rem",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "1rem",
              }}
            >
              <i
                className="fa-regular fa-user"
                style={{
                  padding: "2rem",
                  backgroundColor: "rgb(149, 149, 157)",
                }}
              ></i>
            </div>
            <div>
              <h2>{docter.DocterName}</h2>
              <p>
                <b>Token id:&nbsp;</b>
                {docter.DocterId}
              </p>
            </div>
          </div>
        </div>
        <form>
          <div className="row">
            <div className="field">
              <label htmlFor="name">
                <h4>Full Name</h4>
              </label>
              <input
                id="name"
                name="name"
                value={docter.DocterName}
                //   onChange={()=>handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">
                <h4>Email</h4>
              </label>
              <input
                id="email"
                autoComplete="email"
                name="Email"
                value={newvalue.Email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="Licenseno">
                <h4>License No</h4>
              </label>
              <input
                id="Licenseno"
                name="Licenseno"
                value={docter.Licenseno}
                //   onChange={handleChange}
              />
            </div>
            <div className="field">
              <label htmlFor="password">
                <h4>Change Password</h4>
              </label>
              <input
                id="password"
                name="password"
                value={newvalue.password}
                autoComplete="new-password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "2rem",
            }}
          >
            <Button variant="contained" type="submit" onClick={handleSubmit}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
