import React, {
  Children,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import "../AppointmentList.css";
import { HistoryReport } from "./HistoryReport";
import Lottie from "lottie-react";
import {
  docterContext,
  PatientCollectionContext,
} from "../../../context/DocterAuthContext";

import { margin, minWidth, width } from "@mui/system";
import patientCompleted from "../../../../src/assets/patientcompleted.json";
import DotLoader from "../../../../src/assets/Dotrecordinglightred.json";
export const nextPatientContext = createContext();
export const NextPatientContextProvider = ({ children }) => {
  const [nextPatientDetails, setNextPatientDetails] = useState({
    audioAndReport: [],
    user: "",
    otherDetails: "",
  });
  const contextValue = useMemo(() => {
    return {
      nextPatientDetails,
      setNextPatientDetails,
    };
  }, [nextPatientDetails]);
  return (
    <nextPatientContext.Provider value={contextValue}>
      {children}
    </nextPatientContext.Provider>
  );
};

export const NextPatientDetails = () => {
  const { nextPatientDetails, setNextPatientDetails } =
    useContext(nextPatientContext);
  const [open, setOpen] = useState(false);
  const {
    // patientcollection,
    currno,
    currPatientFiles,
    setCurrPatientFiles,
    nextPatientDocument,
    setNextPatientDocument,
  } = useContext(PatientCollectionContext);

  const { docterAPI } = useContext(docterContext);

  // console.log("patientcollection",patientcollection,currno);
  useEffect(() => {
    // console.log("patientcollection", patientcollection, currno);
    // if (patientcollection && currno != undefined) {
    // const nextIndx = currno + 1;

    // CHECK: Is the calculated next index within the array's boundaries?
    // if (nextIndx < patientcollection.length) {
    //   const nextPatient = patientcollection[nextIndx];
    //   console.log("nextPatient", nextPatient);
    //   setNextPatientDocument(nextPatient);

    const nextPatientFunc = async () => {
      try {
        const res = await docterAPI.get("/getnextpatient", {
          // nextPatient,
        });
        console.log(res);
        const result = res?.data;
        setNextPatientDetails({
          audioAndReport: [{ audio: result.audio, report: result.report }],
          user: result.nextUser,
          otherDetails: result?.extraDetails,
        });
      } catch (err) {
        console.log(err);
      }
    };
    nextPatientFunc();
    // setNextPatient(nextPatient);
    // } else {
    //   //jab last patient ho only
    //   console.log("This is the last patient in the collection.");
    //   setNextPatientDetails({
    //     audioAndReport: [],
    //     user: null,
    //   });
    // }
    // }
  }, [currPatientFiles]);

  const handleClick = () => {
    setOpen(true);
  };
  const lottieStyle = {
    height: 40,
    width: 100,
    marginLeft: 2,
  };
  return (
    <div className="nextPatientDetails">
      {open && nextPatientDetails?.user && (
        <HistoryReport
          open={open}
          setOpen={setOpen}
          nextPatientDetails={nextPatientDetails}
        />
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h2
          style={{
            display: "flex",
            alignItems: "center",
            margin: 0,
          }}
        >
          Appointments Details
        </h2>
        &nbsp;
        <span
          style={{
            display: "flex",
            alignItems: "center",
            margin: 0,
          }}
        >
          in-progress{" "}
          {nextPatientDetails?.user ? (
            <Lottie
              animationData={DotLoader}
              loop
              autoplay
              style={lottieStyle}
            />
          ) : (
            <Lottie
              animationData={patientCompleted}
              loop
              autoplay
              style={lottieStyle}
            />
          )}
        </span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <div style={{ display: "flex",marginRight:"1rem"}}>
          <i className="fa-regular fa-calendar"></i> */}
        {/* { <div>
            <p>Date</p>
            <h4>April 9,2025</h4>
          </div>
        </div> */}
        <div style={{ display: "flex", marginRight: "1rem" }}>
          <i className="fa-solid fa-user-plus"></i>
          <div>
            <p>Patient</p>
            <h4>{nextPatientDetails?.user?.UserName}</h4>
          </div>
        </div>
        <div style={{ display: "flex", marginRight: "1rem" }}>
          <i className="fa-solid fa-file"></i>

          <div>
            <p>Reports & audio</p>
            <p
              style={{ color: "blue", cursor: "pointer" }}
              onClick={handleClick}
            >
              view
            </p>
          </div>
        </div>
        {/* <div style={{ display: "flex", marginRight:"1rem"}}>
       <i class="fa-solid fa-file-audio"></i>

          <div>
            <p>audio</p>
            <a>view</a>
          </div>
        </div> */}
      </div>

      <div style={{ display: "flex", marginRight: "1rem" }}>
        <i className="fa-regular fa-file"></i>
        <div>
          <p>Department</p>
          <h4>{nextPatientDetails?.otherDetails?.Docter?.Specilization}</h4>
        </div>
      </div>

      <div style={{ display: "flex", marginRight: "1rem" }}>
        <i className="fa-solid fa-hashtag"></i>
        <div>
          <p>Queue Number</p>
          <h4>{nextPatientDetails?.otherDetails?.QueueNum}</h4>
        </div>
      </div>
    </div>
  );
};
