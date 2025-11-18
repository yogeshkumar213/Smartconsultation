import SmartPreConsultation from "./SmartPreConsul";
import { useContext } from "react";
import React, { useState } from "react";
import Additional from "./Additional.jsx";
import "../AppointmentList.css";
import SmartConsulFunc from "./SmartConsulOpt.jsx";
import AItranscript from "./AItranscript.jsx";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { docterContext } from "../../../context/DocterAuthContext";
import { PatientCollectionContext } from "../../../context/DocterAuthContext";
import AtomicSpinner from "atomic-spinner";

export default function SmartConsul() {
  const smartConsultopt = [
    "Voice-Transcript",
    "Alternate-Script",
    "AI-Summary",
  ];

  const {
    currPatientDocument,
    setCurrPatientDocument,
    patientcollection,
    setPatientCollection,
    currno,setCurrno
  } = useContext(PatientCollectionContext);

  const [loading, setLoading] = useState(false);
  const { docterAPI } = useContext(docterContext);
  const [option, setOption] = useState("");
  const [data, setData] = useState("");
  const [smartConsultationCache, setSmartConsultationCache] = useState({});

  const handleSmartConsultationopt = async (e) => {
    console.log(e);
    setOption(e);
    let currPatient = currPatientDocument.appointmentData._id;

    if (
      smartConsultationCache[currPatient] &&
      smartConsultationCache[currPatient][e]
    ) {
      console.log(`Cache Hit: Serving ${e} for patient ${currPatient}`);
      setData(smartConsultationCache[currPatient][e]);
      return;
    }

    try {
      setLoading(true);
      if (!currPatientDocument?.audioFile?.signedUrl) {
        throw new Error("Audio file not found for current patient.");
      }
      const res = await docterAPI.post("/smart", {
        audioSignedUrl: currPatientDocument.audioFile.signedUrl,
        selectedOpt: e,
      });
      console.log(res);
      // setData(res.data);
      setSmartConsultationCache((prevCache) => ({
        ...prevCache,
        [currPatient]: {
          ...prevCache[currPatient], //Isi patient ke puraane options (jaise 'AI-Summary') ko copy karo
          [e]: res.data,
        }, //Aur phir, naye option ('e') ke liye naya result daal do
      }));
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="smartContainer">
      <div className="smartPreConsultation">
        <SmartPreConsultation />
        <div className="flex flex-wrap gap-3 justify-center my-10">
          {smartConsultopt.map((e) => {
            return (
              <Button
                key={e}
                disabled={loading}
                variant={option == e ? "contained" : null}
                onClick={() => handleSmartConsultationopt(e)}
                sx={{
                  border: "1px solid black",
                  height: "0",
                  padding: "1rem",
                  marginTop: "1rem",
                }}
              >
                {e}
              </Button>
            );
          })}
        </div>
        <div className="dynamic-content-container">
          {loading ? (
            <div className="flex justify-center items-center ">
              <AtomicSpinner />
            </div>
          ) : (
            <SmartConsulFunc selectedOpt={data.option} data={data.data} />
          )}
        </div>

        {/* <AItranscript /> */}
      </div>
      <div className="Additional">
        <Additional />
      </div>
    </div>
  );
}
