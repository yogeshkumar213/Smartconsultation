import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { SearchHistory } from "./Search.jsx";
// import { PatientData } from "./PatientData.jsx";
import "./History.css";

export const PatientHistory = ({ value, setValue, searchedPatient }) => {
  // console.log(searchedPatient)
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  //   const handleClickOpen = (scrollType) => () => {
  //     setOpen(true);
  //     setScroll(scrollType);
  //   };

  const handleClose = () => {
    setValue(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      {/* <Button onClick={handleClickOpen('paper')}>scroll=paper</Button> */}
      {/* //   <Button onClick={handleClickOpen('body')}>scroll=body</Button> */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={value}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Patient History</DialogTitle>
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            component="div"
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div style={{ margin: "0 0 1rem 0" }}>
              {" "}
              <SearchHistory searchedPatient={searchedPatient} />
            </div>
            {/* < SearchHistory  /> */}

            {/* {[...new Array(50)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
              )
              .join("\n")} */}
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
    </React.Fragment>
  );
};
