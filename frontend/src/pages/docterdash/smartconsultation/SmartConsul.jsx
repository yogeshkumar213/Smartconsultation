import SmartPreConsultation from "./SmartPreConsul";
import React from "react";
import Additional from "./Additional.jsx";
import "../AppointmentList.css";
import VoiceTranscript from "./VoiceTranscript.jsx";
import AItranscript from "./AItranscript.jsx";
export default function SmartConsul() {
  return (
    <div className="smartContainer" >
      <div className="smartPreConsultation">
        <SmartPreConsultation/>
        <VoiceTranscript />
        <AItranscript />
      </div>
      <div className="Additional">
        <Additional />
      </div>
    </div>
  );
}
