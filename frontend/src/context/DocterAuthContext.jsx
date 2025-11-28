import React, { Children } from "react";
import { createContext, useState } from "react";
import axios from "axios";

export const PatientCollectionContext = createContext();
export const TotalPatientCollectionProvider = ({ children }) => {
  // const [patientcollection, setPatientCollection] = useState([]);
  const [currno, setCurrNo] = useState(0);
  const [currPatientDocument, setCurrPatientDocument] = useState(null);
  const [consultedInput, setConsultedInput] = useState(null);
  const [nextPatientDocument, setNextPatientDocument] = useState(null);
  const [ currPatientFiles,setCurrPatientFiles]=useState(null);
  const contextValue = React.useMemo(
    () => ({
      // patientcollection,
      currno,
      currPatientDocument,
      currPatientFiles,
      setCurrPatientFiles,
      consultedInput,
      nextPatientDocument,
      setCurrNo,
      setConsultedInput,
      setCurrPatientDocument,
      // setPatientCollection,
      setNextPatientDocument,
    }),
    [
      // patientcollection,
      currno,
      currPatientDocument,
      consultedInput,
      nextPatientDocument,
      currPatientFiles
    ]
  );

  return (
    <PatientCollectionContext.Provider
      value={
        contextValue
        // patientcollection,
        // setPatientCollection,
        // currPatientDocument,
        // setCurrPatientDocument,
        // currno,
        // setCurrNo,
        // consultedInput,
        // nextPatientDocument,
        // setNextPatientDocument,
        // setConsultedInput,
      }
    >
      {children}
    </PatientCollectionContext.Provider>
  );
};
const token = localStorage.getItem("doctoken");
console.log(token);

export const docterContext = createContext();
const docterAPI = axios.create({
  baseURL: "http://localhost:5050/doc/v1",
  headers: { doctoken: token },
});
docterAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("doctoken");
  if (token) {
    config.headers["doctoken"] = token;
  }
  return config;
});

export const DocterContextProvider = ({ children }) => {
  return (
    <docterContext.Provider value={{ docterAPI }}>
      {children}
    </docterContext.Provider>
  );
};
