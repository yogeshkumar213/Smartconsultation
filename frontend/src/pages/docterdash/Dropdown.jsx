import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Headder.css";
import { Logout } from "../docterdash/DocterProfile/Logout.jsx";

export default function Dropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const optionHandler = (opt) => {
    // console.log(opt);
    if (opt === "Profile") {
      console.log("button clicked");
      navigate("/docter-profile");
    } else if (opt === "Setting") {
      console.log("Setting");
      navigate("/docter-profile-edit");
    } else {
      console.log(opt);
      setOpen(true);
    }
  };
  useEffect(() => {
    if (open) {
      console.log("Logout component mounted");
    }
    // console.log("Logout component mounted");

    return () => {
      console.log("Logout component unmounted");
    };
  }, []);

  const myAccount = () => {
    navigate("/Docter-dashboard");
  };

  return (
    <div>
      {open && <Logout value={true} />}
      <div className="dropdown-menu">
        <div onClick={myAccount} className="dropdown-option">
          <b>My Account</b> <i className="fa-solid fa-user-circle"></i>
        </div>
        <hr style={{ opacity: "0.3" }}></hr>

        <div
          className="dropdown-option"
          onClick={() => optionHandler("Profile")}
        >
          <i
            className="fa-solid fa-user"
            style={{ paddingRight: "1.2rem" }}
          ></i>
          Profile
        </div>

        <div
          className="dropdown-option"
          onClick={() => optionHandler("Setting")}
        >
          <i className="fa-solid fa-gear"></i>Settings
        </div>

        <hr style={{ opacity: "0.3" }}></hr>
        <div
          style={{ color: "red" }}
          className="dropdown-option"
          onClick={(e) => {
            e.stopPropagation();
            optionHandler("Logout");
          }}
        >
          <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
        </div>
      </div>
      {/* )} */}
    </div>
  );
}
