import React, { Children, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DangerZone } from "./Danger";
import "./Patientdash.css";

import { useAuth } from "../../context/AuthContext";
import { useContext, createContext } from "react";
import { UserProfile } from "../../context/DropdownContext";
export const Dropdown = ({ visible }) => {
  const [zoneTriggered, setZoneTriggered] = useState(false);
  const [getuserData, setgetUserData] = useState([]);
  const navigate = useNavigate();

  const { setGetProfile } = UserProfile();

  // const zoneTriggered = useRef(false);

  const { client } = useAuth();

  const handleClickopt = async (opt) => {
    console.log(opt);
    if (opt == "profile") {
      try {
        const userProfile = await client.get("/getuserprofile");
        console.log(userProfile.data.userData);
        // console.log(userProfile.data.userData);

        setGetProfile(userProfile.data.userData[0]);
        navigate("/user-profile");
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log(opt);
      const token = localStorage.removeItem("token");
      navigate("/auth/signin");
    }
    // } else {
    //   console.log("option not matched");
    // }
  };
  const handleZone = (opt) => {
    console.log("option is :", opt);
    setZoneTriggered(true);
    // setZoneTriggered(() => !zoneTriggered)
    console.log("Immediately after setZoneTriggered:", zoneTriggered);
    // return (<DangerZone/>)
    // setZoneTriggered(1);
  };

  useEffect(() => {
    console.log("zoneTriggered changed:", zoneTriggered);
    if (zoneTriggered) {
      console.log("Zone has been triggered");
    }
  }, [zoneTriggered]);

  useEffect(() => {
    if (!visible) {
      // Delay the reset to the next tick, so any immediate reopen won’t be wiped out
      // const timer = setTimeout(() => {
      setZoneTriggered(false);
      //   }, 50);
      //   return () => clearTimeout(timer);
    }
  }, [visible]);

  //  maindoubt--------->
  //  if (!visible) return null;

  const myAccount = () => {
    console.log("account clicked");
    navigate("/User-dashboard");
  };

  return (
    <div style={{ display: visible ? "block" : "none" }}>
      {zoneTriggered && <DangerZone openbox={true} />}
      <div>
        {/* {zoneTriggered && <DangerZone />} */}

        <div className="dropdown-menu">
          <div onClick={myAccount} className="dropdown-option">
            <b>My Account</b> <i className="fa-solid fa-user-circle"></i>
          </div>
          <hr style={{ opacity: "0.3" }}></hr>

          <div
            className="dropdown-option"
            value="profile"
            onClick={() => handleClickopt("profile")}
          >
            <i
              className="fa-solid fa-user"
              style={{ paddingRight: "1.2rem" }}
            ></i>
            Profile
          </div>

          <div
            className="dropdown-option"
            style={{ color: "red" }}
            onClick={(e) => {
              e.stopPropagation();
              handleZone("Danger");
            }}
          >
            <i className="fa-solid fa-biohazard" style={{ color: "red" }}></i>
            Danger
          </div>
          <hr style={{ opacity: "0.3" }}></hr>
          <div
            style={{ color: "red" }}
            className="dropdown-option"
            onClick={() => handleClickopt("Logout")}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
          </div>
        </div>
      </div>
    </div>
  );
};
