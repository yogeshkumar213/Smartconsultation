import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// import DocterDash from "../pages/docterdash/DocterParent.jsx";
import { Link } from "react-router-dom";
import { useFormData } from "../context/PatientFormContext.jsx";

const AuthContext = createContext();

import axios from "axios";
// import DocterDash from "../pages/DocterDash";

const client = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});
const decodeJWT = jwtDecode;

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [User, setUser] = useState(" ");
  const navigate = useNavigate();
  const { formData, setFormData } = useFormData();
  // const [patientid, setPatientId] = useState("");
  // const patient = formData.Patient;
  useEffect(() => {
    const patid = localStorage.getItem("patientid");
    if (patid) {
      // setPatientId(patid);
      setFormData((prev) => {
        return { ...prev, Patient: patid };
      });
    }
  }, []);

  const usersignup = async (UserName, Password, Phoneno, Email) => {
    // console.log(usersignup);
    try {
      console.log("function called");
      let request = await client.post("/usersignup", {
        UserName,
        Password,
        Phoneno,
        Email,
      });
      if (request.status == 201) {
        console.log("user registered successfully");
        console.log(request.data.token);

        localStorage.setItem("token", request.data.token);
        setUser(decodeJWT(request.data.token));
        navigate("/User-dashboard");
        return request.data.message;
      }
    } catch (err) {
      if (err.response && err.response.status == 499) {
        console.log(err);
        return "user already exist";
      } else {
        // return "some other issue", err;
        return { error: true, message: "Some other issue", details: err };
      }
    }
  };
  const userLogin = async (Email, Password) => {
    console.log("request go");
    console.log(Email);
    console.log(Password);
    try {
      // console.log("userLogin fuction called in frontend");
      let request = await client.post("/userlogin", {
        Password,
        Email,
      })
      console.log(request)

      if (request.status == 200) {
        console.log("user found");
        console.log(request.data.token);
        localStorage.setItem("patientid", request.data.existUser._id);

        console.log(request);
        localStorage.setItem("token", request.data.token);
        setUser(decodeJWT(request.data.token));
        navigate("/User-dashboard");
        return request.data.message;
      } 
    } catch (err) {
      return err.response.data.message;
      // if (err.response && err.response.status == 401) {
      //   console.log(err);
      //   return request.data.message;
      // } else {
      //   return "some other issue", err;
      // }
    }
  };

  const doctersignup = async (
    DocterName,
    Password,
    Email,
    Specilization,
    Licenseno
  ) => {
    try {
      let docterreq = await client.post("/doctersignup", {
        DocterName,
        Password,
        Email,
        Specilization,
        Licenseno,
      });

      if (docterreq.status == 201) {
        console.log("docter registered successfully");
        // console.log(docterreq);
        console.log(docterreq.data);
        setUser(decodeJWT(docterreq.data.token));
        localStorage.setItem("doctoken", docterreq.data.token);
        navigate("/docter-dashboard");
        return docterreq.data.message;
      }
    } catch (err) {
      if (err.response && err.response.status == 499) {
        // console.log("docter registered")
        return "Docter already register";
      } else {
        return "some other issue", err;
      }
    }
  };

  const docterLogin = async (Email, Password, Licenseno) => {
    console.log("request go");
   
    console.log(Password);
     console.log(Email);
    try {
      let request = await client.post("/docterlogin", {
        Email,
        Password,

        Licenseno,
      });
      console.log(request);

      if (request.status == 200) {
        localStorage.setItem("doctoken", request.data.doctoken);
        setUser(decodeJWT(request.data.doctoken));
        navigate("/docter-dashboard");
        return request.data.message;
      } else if (request.status == 404) {
        console.log(request.data.message);
        return request.data.message;
      }
    } catch (err) {
      // debugger;
      console.log(err.message);
      return err.message;
    }
  };

  return (
    <div>
      <AuthContext.Provider
        value={{
          usersignup,
          doctersignup,
          docterLogin,
          userLogin,
          User,
          client,
        }}
      >
        {children}
      </AuthContext.Provider>
    </div>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
