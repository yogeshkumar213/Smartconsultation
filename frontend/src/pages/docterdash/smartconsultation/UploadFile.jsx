import * as React from "react";
import { styled } from "@mui/material/styles";
import { useContext } from "react";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { PatientCollectionContext } from "../../../context/DocterAuthContext";
import { docterContext } from "../../../context/DocterAuthContext";
import { useSnackbar } from "../../../context/Snakbarr";

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

  const [file, setFile] = React.useState([]);
  const { showSnakbar } = useSnackbar();
  console.log("currPatientDocument in AdditionalInfo:", currPatientDocument);

  const handleUploadFile = (event) => {
    console.log("handleUploadFile called");
    const formData = new FormData();

    const selectedFiles = event.target.files;
    console.log(selectedFiles);
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "application/pdf",
      "image/jpeg",
    ];
    if (
      selectedFiles.length > 0 &&
      !allowedTypes.includes(selectedFiles[0].type)
    ) {
      alert("File type not supported. Please upload PDF, JPG, or PNG files.");
      return;
    }

    console.log("Selected files:", selectedFiles);
    // You can implement the file upload logic here
    if (!currPatientDocument) {
      console.log("No current patient document available for file upload.");
      event.target.value = null; // Reset the input
      alert("No current patient document available for file upload.");
      return;
    }
    const appointmentId = currPatientDocument?._id;
    formData.append(
      "currPatientDocument",
      JSON.stringify(currPatientDocument?._id)
    );

    console.log("Uploading files for Appointment ID:", appointmentId);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("docterAttachedFile", selectedFiles[i]);
    }
    console.log("formData file", formData.getAll("docterAttachedFile"));
    console.log(
      "formData currPatientDocument",
      formData.get("currPatientDocument")
    );
    // Implement the file upload API call here using docterAPI

    const uploadReport = async () => {
      try {
        const res = await docterAPI.post("/uploadReport", formData);
        console.log("Upload Report Response:", res);
        if (res.status === 200) {
          showSnakbar(res.data.message || "File uploaded successfully");
        }
      } catch (err) {
        console.log(err);
      }
    };
    uploadReport();
    // finally {
    //   formData.delete("docterAttachedFile");
    //   event.target.value = null; // Reset the input
    // }
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
        onChange={(event) => handleUploadFile(event)}
        multiple
      />
    </Button>
  );
};
