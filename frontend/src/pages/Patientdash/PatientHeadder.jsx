import React, { useEffect, useState, useNavigate } from "react";

import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import { Dropdown } from "./Dropdown";
import Stack from "@mui/material/Stack";
import { jwtDecode } from "jwt-decode";
import "./Patientdash.css";

export default function PatientHeader() {
  const [zoneTriggered, setZoneTriggered] = useState(false);
  const navigate = useNavigate;
  const [togle, setTogle] = useState(false);
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      console.log(decode);
      setEmail(decode.Email);
      const userName = decode.UserName;
      const userNamecapital = userName[0].toUpperCase() + userName.slice(1);
      setUserName(userNamecapital);
    } else
      (err) => {
        console.log(err);
      };
  }, []);

  let clickHandler = () => {
    setTogle((prevalue) => !prevalue);
  };

  return (
    <>
      <span className="header">
        <div className="hospitalname ">
          <h2 style={{ color: "royalBlue" }}>VitalCare Medical Hub</h2>
        </div>

        <div className="notification-and-picture">
          <Badge
            badgeContent={4}
            color="primary"
            style={{ marginTop: "1rem", marginRight: "1rem" }}
          >
            <MailIcon color="action" />
          </Badge>

          <div
            className="picture-with-name"
            onClick={clickHandler}
            
          >
            <span>
              {" "}
              <Avatar alt="Remy Sharp" src="/docterphoto.jpg" />
            </span>
            &nbsp;
            <div>
              <div>
                <b>Hello, &nbsp;{username}</b>
              </div>
              <div style={{ fontSize: "0.8rem" }}>{email}</div>
            </div>
            &nbsp; &nbsp;
            {togle ? (
              <i
                className="fa-solid fa-chevron-up"
                style={{ paddingRight: "1rem" }}
              ></i>
            ) : (
              <i
                className="fa-solid fa-chevron-down"
                style={{ paddingRight: "1rem" }}
              ></i>
            )}
            <Dropdown
              visible={togle}
              style={{ height: "30rem", width: "25rem" }}
            />
          </div>
        </div>
      </span>
      {/* <hr style={{ margin: "0.5rem", opacity: "0.3" }}></hr> */}
    </>
  );
}
