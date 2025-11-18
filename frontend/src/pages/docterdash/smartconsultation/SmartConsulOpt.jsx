import React, { useContext } from "react";
import "../AppointmentList.css";
import axios from "axios";
import Markdown from "react-markdown";

export default function SmartConsulFunc({ selectedOpt, data }) {
  return (
    <>
      {selectedOpt === "Voice-Transcript" ? (
        <span className="content">
          {data ||
            "voiceTransript Lorem ipsum dolor sit, amet consectetur adipisicing elit..."}
        </span>
      ) : selectedOpt === "Alternate-Script" ? (
        <span className="content">
          {<Markdown>{data}</Markdown> ||
            " AlternScript Lorem ipsum dolor sit, amet consectetur adipisicing elit.Iusto perferendis minima porro dolorum minus aperiam facilis corporis deleniti sit aut corrupti sapiente laboriosam tempore eveniet"}
        </span>
      ) : selectedOpt === "AI-Summary" ? (
        <span className="content">
          {<Markdown>{data}</Markdown> ||
            "Ai-Summary Lorem ipsum dolor sit, amet consectetur adipisicing elit.Lorem Lorem Ai-Summary Lorem ipsum dolor sit, amet consect"}
        </span>
      ) : null}
    </>
  );
}
