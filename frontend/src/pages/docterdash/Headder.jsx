import React, { useState } from "react";
// import * as React from 'react';
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Dropdown from "./Dropdown";
import Stack from "@mui/material/Stack";
import { jwtDecode } from "jwt-decode";
import "./Headder.css";
import { useEffect } from "react";

export default function DocterHeadder() {
  const [border, setborder] = useState(false);
  const [docter, setDocter] = useState({});

  useEffect(() => {
    console.log("token is arrived");
    const docToken = localStorage.getItem("doctoken");
    if (docToken) {
      const decode = jwtDecode(docToken);
      setDocter(decode);
      console.log(decode);
    }
  }, []);

  let clickHandler = () => {
    setborder((prevalue) => !prevalue);
  };

  return (
    <>
      <span className="header">
        <div className="hospitalname ">
          <h2>VitalCare Medical Hub</h2>
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
            style={
              border
                ? {
                    border: "3px solid pink",
                    borderRadius: "1rem",
                    padding: "0.2rem",
                    cursor: "pointer",
                  }
                : {}
            }
          >
            <span>
              {" "}
              <Avatar alt="Remy Sharp" src="/docterphoto.jpg" />
            </span>
            &nbsp;
            <div>
              <div>
                <b>{docter.Email}</b>
              </div>
              <div style={{ fontSize: "0.8rem" }}>{docter.Specilization}</div>
            </div>
            &nbsp; &nbsp;
            <i
              className="fa-solid fa-chevron-up"
              style={{ paddingRight: "1rem" }}
            ></i>
            {border && <Dropdown />}
          </div>
        </div>
      </span>
      <hr style={{ margin: "0.5rem", opacity: "0.3" }}></hr>
    </>
  );
}
