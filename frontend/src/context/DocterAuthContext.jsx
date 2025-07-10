import React, { Children } from "react";
import { createContext, useState } from "react";
import axios from "axios";

export const PatientCollectionContext = createContext();
export const TotalPatientCollectionProvider = ({ children }) => {
  const [patientcollection, setPatientCollection] = useState([]);
  return (
    <PatientCollectionContext.Provider
      value={{ patientcollection, setPatientCollection }}
    >
      {children}
    </PatientCollectionContext.Provider>
  );
};
const token = localStorage.getItem("doctoken");

export const docterContext = createContext();
const docterAPI = axios.create({
  baseURL: "http://localhost:5050/doc/v1",
  headers: { doctoken: token },
});

export const DocterContextProvider = ({ children }) => {
  return (
    <docterContext.Provider value={{ docterAPI }}>
      {children}
    </docterContext.Provider>
  );
};
