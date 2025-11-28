import React, { Children, useState } from "react";
import { useContext, createContext } from "react";

const PatientFormContext = createContext();
export const UpComingAppointmentContext = createContext();
export const UpComingAppointmentProvider = ({ children }) => {
  const [appointmentFormData, setAppointmentFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    appointmentqueueNum: "",
    appointDocter: "",
    appointDocterSpecilization: "",
  });
  return (
    <UpComingAppointmentContext.Provider
      value={{ appointmentFormData, setAppointmentFormData }}
    >
      {children}
    </UpComingAppointmentContext.Provider>
  );
};

export const PatientFormProvider = ({ children }) => {
  const [appointmentController, setAppointmentController] = useState(false);
  const [formData, setFormData] = useState({
    Patient: "",
    Docter: "",
    // kyunki DateCalendar ye expect karta hai ki value me ya to null ho ya dayjs object ho.
    Date: null,
    Time: "",
    PatientFile: [],
    PatientAudio: "",
  });

  return (
    <div>
      <PatientFormContext.Provider
        value={{
          formData,
          setFormData,
          appointmentController,
          setAppointmentController,
        }}
      >
        {children}
      </PatientFormContext.Provider>
    </div>
  );
};
export const useFormData = () => {
  return useContext(PatientFormContext);
};
