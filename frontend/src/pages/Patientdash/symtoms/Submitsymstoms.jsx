import React, { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useNavigate } from "react-router-dom";
import "../Patientdash.css";
import { useFormData } from "../../../context/PatientFormContext";
import { Button } from "@mui/material";
import { useSnackbar } from "../../../context/Snakbarr";
import { useAuth } from "../../../context/AuthContext";

export const AudioRecorderComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [check, setCheck] = useState(false);
  const fileInput = useRef(null);

  const {
    formData,
    setFormData,
    appointmentController,
    setAppointmentController,
  } = useFormData();
  const { showSnakbar } = useSnackbar();
  const { client } = useAuth();
  const navigate = useNavigate();

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: (blobUrl, blob) => {
        console.log("Recorded blob: ", blob);
        setFormData((prev) => ({
          ...prev,
          PatientAudio: blob,
        }));
      },
    });

  // handle file input
  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        SymptomFile: file,
      }));
    }
  };

  const handleFileButtonClick = () => {
    fileInput.current.click();
  };

  const submitAppointment = async () => {
    const formData1 = new FormData();
    formData1.append("Patient", formData.Patient);
    formData1.append("Docter", formData.Docter);
    formData1.append("Date", formData.Date);
    formData1.append("Time", formData.Time);
    if (formData.SymptomFile) {
      formData1.append("PatientFile", formData.SymptomFile);
    }
    if (formData.PatientAudio) {
      formData1.append("PatientAudio", formData.PatientAudio);
    }

    try {
      console.log("appointment progress");
      const result = await client.post("/appointment", formData1, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(result);
      showSnakbar("Appointment submitted successfully");
      // console.log("appointment booked");
      setFormData((prev) => ({
        ...prev,
        Docter: "",
        // Patient:"",
        Date: null,
        Time: "",
        PatientAudio: null,
        SymptomFile: null,
      }));
      setAppointmentController(false);
      // console.log("reset");
    } catch (err) {
      if (err.response?.data?.message === "invalid or expired token") {
        navigate("/signin");
        showSnakbar("invalid or expired token");
      } else {
        console.error(err);
        showSnakbar("Something went wrong");
      }
    }
  };

  // auto-submit if controller triggers
  useEffect(() => {
    if (appointmentController) {
      // const handleSubmit = async () => {
      submitAppointment();
      // };
      // handleSubmit();
    }
  }, [appointmentController]);

  useEffect(() => {
    if (isRecording) {
      const timer = setTimeout(() => {
        setIsRecording(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  // recording toggle
  const handleRecordClick = () => {
    if (!isRecording) {
      startRecording();
      setIsRecording(true);
      setCheck(true);
    } else {
      stopRecording();
      setIsRecording(false);
      setCheck(false);
    }
  };

  return (
    <div className="symtomsSub">
      <h2>Submit your Symptoms</h2>
      <p>
        Please record a brief audio describing your symptoms to assist your
        doctor in preparing for your consultation
      </p>

      <div
        className="icon"
        style={{
          marginTop: "1rem",
          height: "8rem",
          width: "8rem",
          border: "1px solid black",
          borderRadius: "50%",
          backgroundColor: "#2c3e50",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleRecordClick}
      >
        <i
          className="fa-solid fa-microphone"
          style={{
            fontSize: check ? "4rem" : "2rem",
            color: check ? "red" : "#4caf50",
          }}
        ></i>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <p>{status}</p>
        {formData.PatientAudio && (
          <audio src={mediaBlobUrl} controls style={{ marginTop: "1rem" }} />
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="file"
          style={{ display: "none" }}
          ref={fileInput}
          onChange={handleFileInput}
        />
        <Button
          onClick={handleFileButtonClick}
          variant="contained"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <i className="fa-solid fa-arrow-up-from-bracket"></i>&nbsp; Submit
          your symptoms
        </Button>
      </div>
    </div>
  );
};
