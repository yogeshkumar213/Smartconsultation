import React, { Children, useState } from "react";
import { useContext, createContext } from "react";

const PatientFormContext = createContext();

export const PatientFormProvider = ({ children }) => {
  const [appointmentController,setAppointmentController]=useState(false);
  const [formData, setFormData] = useState({
    Patient: "",
    Docter: "",
    Date: "",
    Time: "",
    SymptomFile: "",
    PatientAudio: "",
  });
  
  return (
    <div>
      <PatientFormContext.Provider value={{ formData, setFormData,appointmentController,setAppointmentController }}>
        {children}
      </PatientFormContext.Provider>
    </div>
  );
};
export const useFormData = () => {
  return useContext(PatientFormContext);
};
