import * as React from "react";
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SelectTime from "./Appointment/SelectTime";
import { useFormData } from "../../context/PatientFormContext";
import { useSnackbar } from "../../context/Snakbarr";
import dayjs from "dayjs";

export default function BasicDateCalendar() {
  const [appointDate, setAppointDate] = useState("");
  const {
    formData,
    setFormData,
    appointmentController,
    setAppointmentController,
  } = useFormData();
  const { showSnakbar } = useSnackbar();

  const appointmenthandler = () => {
    console.log("formData",formData);
    // try {
    if (
      formData.Patient &&
      formData.Docter &&
      formData.Date &&
      formData.Time &&
      formData.PatientAudio
    ) {
      console.log("all value are set",formData);

      setAppointmentController(true);
      // showSnakbar("Appointment Booked");
    } else {
      console.log("All fields are required");
      showSnakbar("all fields are required");
    }
    // } catch (err) {
    //   console.log("err");
    //   console.log(err);
    //   showSnakbar(err);
    // }
  };
  const handleDateChange = (value) => {
    console.log(value);
    // const date = value.$d;
    // const newDate = date.toDateString();
    const newDate = value.format("YYYY-MM-DD");
    console.log(newDate);
    setAppointDate(newDate);
    setFormData((prev) => {
      return {
        ...prev,
        Date: value,
      };
    });
  };
  // console.log(formData.Date);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="calender">
        <b>
          <h3 style={{ margin: "1rem 0" }}>Book Appointment</h3>
        </b>
        <div style={{ display: "flex", alignItems: "center" }}>
          <i className="fa-regular fa-calendar"></i>&nbsp;&nbsp;
          <h4 style={{ fontWeight: 600 }}>Select Date</h4>
        </div>
        <div
          style={{
            boxSizing: "border-box",
            border: "1px solidrgb(216, 214, 222)",
            borderRadius: "1rem",
            margin: "1rem",
          }}
        >
          <DateCalendar value={formData.Date} onChange={handleDateChange} />
          {formData.Date && <SelectTime />}
          <Button
            variant="contained"
            style={{ width: "100%" }}
            onClick={appointmenthandler}
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </LocalizationProvider>
  );
}
