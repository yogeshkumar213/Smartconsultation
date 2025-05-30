import React, { useState } from "react";
// import * as React from 'react';
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Dropdown from "./Dropdown";
import Stack from "@mui/material/Stack";

import "./Headder.css";

export default function DocterHeadder() {
  const [border, setborder] = useState(false);

  let clickHandler = () => {
    setborder((prevalue) => !prevalue);
  };

  return (
    <>
      <span className="header">
        <div className="hospitalname ">
          <h2>hospital name</h2>
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
                <b>Dr sarah johnshan</b>
              </div>
              <div style={{ fontSize: "0.8rem" }}>General medicine</div>
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
