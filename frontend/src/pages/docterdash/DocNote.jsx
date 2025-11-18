import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
// import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import { useState } from "react";
import { useEffect } from "react";
import { PatientCollectionContext } from "../../context/DocterAuthContext";
import { docterContext } from "../../context/DocterAuthContext.jsx";
import { useContext } from "react";
import { useSnackbar } from "../../context/Snakbarr.jsx";

export const DocNote = ({ notes, setNotes, consultationInputId }) => {
  const [open, setOpen] = React.useState(false);
  const [docMessage, setDocMessage] = useState("allergies");
  const [editopt, setEditopt] = useState(false);
  const [msgStore, setmsgStore] = useState("");
  // const [showdetails,setshowdetails]=useState(false);
  const { docterAPI } = useContext(docterContext);
  const { consultedInput, setConsultedInput } = useContext(
    PatientCollectionContext
  );
  const { showSnakbar } = useSnackbar();
  const consultationinfo = [
    "Symtoms",
    "Probable Cause",
    "Prescribed Medications",
    "Treatment Advice",
    "FollowUp Suggestions",
  ];
  const [formData, setFormData] = useState({
    _id: "",
    Symtoms: "",
    ProbableCause: "",
    PrescribedMedications: "",
    TreatmentAdvice: "",
    FollowUpSuggestions: "",
  });

  const allValueReq =
    formData._id &&
    formData.Symtoms &&
    formData.ProbableCause &&
    formData.PrescribedMedications &&
    formData.TreatmentAdvice &&
    formData.FollowUpSuggestions;
  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const handleEdit = (e) => {
    e.preventDefault();
    console.log("button clicked");
    setEditopt(true);
  };

  useEffect(() => {
    setFormData((prev) => {
      return {
        ...prev,
        _id: consultationInputId,
      };
    });
  }, [consultationInputId]);

  const handleAddSymtoms = async () => {
    // console.log(docMessage);
    if (allValueReq) {
      console.log(formData);
      console.log("symtoms successfully added");
      try {
        const submitSymtoms = await docterAPI.post(
          "/docter-dashboard/savesymtoms",
          formData
        );
        console.log(submitSymtoms);

        // setFormData((prev) => {
        //   const cleared = {};
        //   for (let key in prev) {
        //     cleared[key] = "";
        //   }
        //   return cleared;
        // });
        showSnakbar(submitSymtoms.data.message);
        setConsultedInput(submitSymtoms.data.saveToDB);
        setEditopt(false);
        // setshowdetails(true);
      } catch (err) {
        console.log(err);
        showSnakbar(err);
      }
    } else {
      console.log(formData);
      showSnakbar("all fields are required ");
    }

    // setDocMessage(docMessage);
  };
  const handleClose = () => {
    setNotes(false);
  };
  const handleconsultaion = (symtom, e) => {
    // console.log(symtom, `${e.target.value}`);

    const fieldName = symtom.replace(/\s+/g, "");
    setFormData((prev) => {
      return {
        ...prev,
        [fieldName]: e.target.value,
      };
    });
  };
  useEffect(() => {
    if (!consultationInputId) return;
    try {
      const getconsultedInput = async () => {
        console.log(consultationInputId);
        const result = await docterAPI.get(
          `./docter-dashboard/getconsultedInput/${consultationInputId}`
        );
        console.log("API result", result);
        setConsultedInput(result.data.ConsultedInput);
        return result;
      };
      getconsultedInput();
    } catch (err) {
      console.log(err);
    }
  }, [consultationInputId]);

  useEffect(() => {
    if (consultedInput)
      setFormData((prev) => {
        return {
          ...prev,
          ...consultedInput,
        };
      });
  }, [consultedInput]);

  // const matchkey1 = Object.keys(consultedInput);
  // const matchkey = consultationinfo.find((el) => el == matchkey1);
  // const haconsndleDocNote = (e) => {
  //   console.log("editbutton clicked");
  //   e.preventDefault();
  // };

  return (
    <React.Fragment>
      <Dialog open={notes} onClose={handleClose}>
        <DialogTitle>Patient Symtoms</DialogTitle>
        <DialogContent>
          <p style={{ color: "#555", fontSize: "14px", margin: "0 0 12px 0" }}>
            Please write the patient's symptoms clearly, including key details
            like duration and severity to support diagnosis.
          </p>

          {editopt ? (
            <div style={{ margin: "1rem" }}>
              <div>
                {consultationinfo.map((symtom, index) => {
                  let placeholdertext = "";
                  if (symtom == "Symtoms") {
                    placeholdertext = "e.g., headache, nausea, dizziness...";
                  } else if (symtom == "Probable Cause") {
                    placeholdertext =
                      "e.g., suspected viral infection, stress-induced...";
                  } else if (symtom == "Treatment Advice") {
                    placeholdertext =
                      "e.g., Rest for 3 days, hydrate well, re-evaluate if symptoms persist...";
                  } else if (symtom == "FollowUp Suggestions") {
                    placeholdertext =
                      "e.g., Revisit in 7 days or if fever persists...";
                  } else if (symtom == "Prescribed Medications") {
                    placeholdertext =
                      "e.g., Paracetamol 500mg twice daily, Amoxicillin 250mg for 5 days";
                  }
                  const cleanedKey = symtom.replace(/\s+/g, "");
                  return (
                    <div key={symtom}>
                      <p>
                        <b>{symtom}</b>
                      </p>
                      <textarea
                        placeholder={placeholdertext}
                        rows={3}
                        onChange={(e) => handleconsultaion(symtom, e)}
                        value={formData[cleanedKey] || ""}
                        style={{
                          width: "100%",
                          backgroundColor: "white",
                          borderRadius: "1rem",
                          color: "black",
                          padding: "0.3rem",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddSymtoms}
              >
                Add Symtoms
              </Button>
            </div>
          ) : (
            <div>
              {consultationinfo.map((el) => {
                const fieldwithoutSpaces = el.replace(/\s+/g, "");

                // console.log("el:", el, "→", formData[fieldwithoutSpaces]);
                return (
                  <div key={fieldwithoutSpaces}>
                    <p>
                      {el}:&nbsp;&nbsp;
                      <b>
                        {formData?.[fieldwithoutSpaces] !== ""
                          ? formData[fieldwithoutSpaces]
                          : consultedInput?.[fieldwithoutSpaces] || ""}
                      </b>
                    </p>
                    <br></br>
                  </div>
                );
              })}

              <Button
                onClick={(e) => handleEdit(e)}
                variant="contained"
                size="medium"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <EditDocumentIcon />
                &nbsp; EDIT
              </Button>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
