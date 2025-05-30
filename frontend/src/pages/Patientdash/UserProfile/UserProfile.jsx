import React, { useState } from "react";
import { UserProfile } from "../../../context/DropdownContext";
import { useAuth } from "../../../context/AuthContext";
import { useSnackbar } from "../../../context/Snakbarr";
import {  useNavigate } from "react-router-dom";
import PatientHeader from "../PatientHeadder";
import "../Patientdash.css";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
export const ProfileDetails = () => {
  const navigate = useNavigate();
  const { getProfile } = UserProfile();
  const { client } = useAuth();
  const { showSnakbar } = useSnackbar();
  const [formdata, setFormData] = useState({
    name: getProfile.UserName,
    email: getProfile.Email,
    phone: getProfile.Phoneno,
    address: "",
  });

  const updateData = async () => {
    const response = await client.patch("/updatedata", formdata, {
      headers: {
        patientId: getProfile._id,
      },
    });
    return response;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue=value.trim();
    console.log(name + newValue);

    setFormData((prev) => {
      return {
        ...prev,
        [name]: newValue, //for dynamically change
      };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = await updateData();
      const resData = updatedData.data.user.Email;
      console.log(resData);
      console.log(getProfile.Email);

      if (resData != getProfile.Email) {
        let tokenRemove = localStorage.removeItem("token");
        navigate("/auth/signin");
        showSnakbar(updatedData.data.message);
      }

      showSnakbar(updatedData.data.message);
    } catch (err) {
      console.log(err);
      showSnakbar(updatedData.data.message);
    }
  };

  return (
    <div>
    <PatientHeader/>
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
              style={{ padding: "2rem", backgroundColor: "rgb(149, 149, 157)" }}
            ></i>
          </div>
          <div>
            <h2>{getProfile.UserName}</h2>
            <p><b>Token id:&nbsp;</b>{getProfile._id}</p>
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
              value={formdata.name}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="email">
              <h4>Email</h4>
            </label>
            <input
              id="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="number">
              <h4>Phone no</h4>
            </label>
            <input
              id="number"
              name="phone"
              value={formdata.phone}
              onChange={handleChange}
            />
          </div>
          <div className="field">
            <label htmlFor="address">
              <h4>Address</h4>
            </label>
            <input id="address" name="address" placeholder="Address" />
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
