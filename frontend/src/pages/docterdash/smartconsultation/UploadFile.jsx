import * as React from "react";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PatientCollectionContext } from "../../../context/DocterAuthContext";
import { docterContext } from "../../../context/DocterAuthContext";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const UploadFile = () => {
  const { currPatientDocument } = useContext(PatientCollectionContext);
  const { docterAPI } = useContext(docterContext);
  const [file, setFile] = React.useState(null);
  console.log("currPatientDocument in AdditionalInfo:", currPatientDocument);

  const handleUploadFile = (event) => {
    const selectedFiles = event.target.files;
    console.log(selectedFiles);
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "application/pdf",
      "image/jpeg",
    ];
    if (!allowedTypes.includes(selectedFiles[0].type)) {
      alert("File type not supported. Please upload PDF, JPG, or PNG files.");
      return;
    }

    setFile(selectedFiles);
    console.log("Selected files:", selectedFiles);
    // You can implement the file upload logic here
    if (!currPatientDocument) {
      console.log("No current patient document available for file upload.");
      alert("No current patient document available for file upload.");
      return;
    }

    console.log("Uploading files for Appointment ID:", _id);
    // Implement the file upload API call here using docterAPI
    try {
      const uploadReport = async () => {
        const res = await docterAPI.post("/uploadReport", {
          appointmentData: currPatientDocument.appointmentData,
          files: file,
        });
        console.log("Upload Report Response:", res);
        setFile("");
      };
      uploadReport();
    } catch (err) {
      setFile("");
      console.log(err);
    }
  };

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => {
          handleUploadFile(event);
        }}
        multiple
      />
    </Button>
  );
};
