import React, { Children } from "react";
import { createContext } from "react";
import axios from "axios";

export const docterContext = createContext();
const token = localStorage.getItem("doctoken");
const docterAPI = axios.create({
  baseURL: "http://localhost:5050/doc/v1",
  headers: { doctoken: token },
});

export const DocterContextProvider = ({ children }) => {
  return (
    <docterContext.Provider value={{docterAPI}}>
      {children}
    </docterContext.Provider>
  );
};
