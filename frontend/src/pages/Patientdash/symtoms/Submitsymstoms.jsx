import React, { useEffect } from "react";
import { ReactMic } from "react-mic";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../Patientdash.css";
import { useFormData } from "../../../context/PatientFormContext";
import { Button } from "@mui/material";
import axios from "axios";
// import { useRef } from "react";
import { useSnackbar } from "../../../context/Snakbarr";
import { useAuth } from "../../../context/AuthContext";
export const AudioRecorderComponent = () => {
  const [record, setRecord] = useState(false);
  const [check, setCheck] = useState(false);
  const [patientfile, setPatientFile] = useState(null);
  const { formData, setFormData, appointmentController } = useFormData();
  const [patientaudio1, setPatientAudio1] = useState({});
  const [audioUrl, setAudioUrl] = useState(null);
  const microphoneIcon = useRef();
  const fileInput = useRef(null);
  const { showSnakbar } = useSnackbar();
  const { client } = useAuth();
  const navigae = useNavigate();
  const handelfileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPatientFile(file);
      setFormData((prev) => {
        return {
          ...prev,
          SymptomFile: file,
        };
      });
    }
    console.log(file);
  };
  const handleClickBtn = () => {
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
      await client.post("/appointment", formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSnakbar("Appointment submitted successfully");
    } catch (err) {
      if (err.response.data.message == "invalid or expired token") {
        navigate("/signin");
        showSnakbar("invalid or expired token");
      } else {
        console.log(err);
        showSnakbar("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (appointmentController) {
      submitAppointment();
    }
  }, [appointmentController]);

  const onStop = async (recordedBlob) => {
    console.log("Recorded audio:", recordedBlob);

    const audioUrlpatient = URL.createObjectURL(recordedBlob.blob);
    setAudioUrl(audioUrlpatient);
    setCheck(false);
    setRecord(false);
    // setPatientAudio1();
    setFormData((prev) => {
      return {
        ...prev,
        PatientAudio: recordedBlob.blob,
      };
    });
  };
  // const formData1 = new FormData();
  // formData1.append("Patient", formData.Patient);
  // formData1.append("Docter", formData.Docter);
  // formData1.append("Date", formData.Date);
  // formData1.append("Time", formData.Time);

  // formData1.append("SymptomsFile", formData.SymptomFile);

  // formData1.append("PatientAudio", formData.PatientAudio);
  //   {appointmentController}
  //   if (appointmentController == true) {
  //     console.log("true");
  //     try {
  //       const response = await client.post(
  //         "http://localhost:8080/appointment",
  //         formData1,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }
  // };
  const onData = (recordedBlob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };
  const handleClick = () => {
    if (record) {
      setRecord(false);
      setCheck(false);
    } else {
      setRecord(true);
      setCheck(true);
      setAudioUrl(null);
    }

    // setIsRecording(true);
  };
  useEffect(() => {
    if (record) {
      const timer = setTimeout(() => {
        setRecord(false);
        // setIsRecording(false);
        setCheck(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [record]);
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
      >
        <i
          className="fa-solid fa-microphone"
          // record={record}
          ref={microphoneIcon}
          onClick={handleClick}
          style={{
            fontSize: "2rem",
            color: "#4caf50",
            ...(check ? { fontSize: "4rem", color: "red" } : {}),
            // ... (isRecording?{color:"red"}:{})
          }}
        ></i>
      </div>
      {/* {record && ( */}
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop} // Handle stop event
        onData={onData} // Handle real-time data
        strokeColor="#000000"
        backgroundColor="#1976d2"
        // style={{
        //   width: "100%", // Add width
        //   height: "7rem", // Add height
        //   marginTop: "1rem",
        // }}
      />
      {/* ) */}
      {/* } */}
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/webm" />
          Your browser does not support the audio element.
        </audio>
      )}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            onChange={handelfileInput}
            ref={fileInput}
          ></input>
          <Button
            style={{
              boxSizing: "border-box",
              display: "block",

              width: "100%",
              // display: "flex",
              // alignItems: "center",
              // justifyContent: "center",
              marginTop: "1rem",
            }}
            onClick={handleClickBtn}
            variant="contained"
          >
            <i className="fa-solid fa-arrow-up-from-bracket"></i>&nbsp;&nbsp;
            Submit your symtoms
          </Button>
        </div>
      </div>
    </div>
  );
  // };
};
