import React, { createContext, useState,useContext} from "react";


import Snackbar from "@mui/material/Snackbar";
const SnackbarContext = createContext();
export const SnakbarProvider = ({ children }) => {
  const [open, setOpen] = useState("false");
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const showSnakbar = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnakbar }}>
      {children}
      <Snackbar
        open={open && message}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
      />
    </SnackbarContext.Provider>
  );
};
export const useSnackbar = () => useContext(SnackbarContext);
