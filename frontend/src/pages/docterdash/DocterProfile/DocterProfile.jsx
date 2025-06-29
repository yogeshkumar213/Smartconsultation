import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { DocterHeadder } from "../Headder.jsx";
import Button from "@mui/material/Button";
import "../../Patientdash/Patientdash.css";
export const DocterProfile = () => {
  const [docter, setDocter] = useState({});
  useEffect(() => {
    const docter = () => {
      const token = localStorage.getItem("doctoken");
      if (!token) {
        return null;
      }
      const docter = jwtDecode(token);
      console.log(docter);
      console.log(docter.DocterName)
      setDocter(docter);
    };
    docter();
  }, []);

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
                name="email"
                value={docter.Email}
                //   onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="Licenseno">
                <h4>Phone no</h4>
              </label>
              <input
                id="Licenseno"
                name="Licenseno"
                value={docter.Licenseno}
                //   onChange={handleChange}
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
            {/* <Button variant="contained" type="submit" onClick={handleSubmit}>
            Save Changes
          </Button> */}
          </div>
        </form>
      </div>
    </div>
  );
};
