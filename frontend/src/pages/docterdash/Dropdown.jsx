import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Headder.css";
export default function Dropdown() {
  //   const [open, setopen] = useState(false);

  //   const handleClick = () => {
  //     setopen((preValue) => !preValue);
  //   };
  const myAccount = () => {
    <Link to="/docter-account"></Link>;
  };

  return (
    <div>
      {/* <div onClick={handleClick} style={{ cursor: "pointer" }}> */}
      {/* {open == false ? (
          <i className="fa-solid fa-chevron-up"></i>
        ) : (
          <i className="fa-solid fa-chevron-down"></i>
        )} */}
      {/* </div> */}
      {open && (
        <div className="dropdown-menu">
          <div onClick={myAccount} className="dropdown-option">
            <b>My Account</b> <i className="fa-solid fa-user-circle"></i>
          </div>
          <hr style={{ opacity: "0.3" }}></hr>

         
            <div className="dropdown-option">
              <i className="fa-solid fa-user"  style={{paddingRight:"1.2rem"}}></i>Profile
            </div>
         
          <div className="dropdown-option">
            <i className="fa-solid fa-gear"></i>Settings
          </div>
          <hr style={{ opacity: "0.3" }}></hr>
          <div style={{  color: "red" }} className="dropdown-option">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
          </div>
        </div>
      )}
    </div>
  );
}
