import * as React from "react";
import { styled } from "@mui/material/styles";
import { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import { PatientCollectionContext } from "../../../context/DocterAuthContext";

const Input = styled(MuiInput)`
  width: 42px;
`;

export default function InputSlider() {
  const [value, setValue] = React.useState(30);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isprogress, setIsProgress] = React.useState(null);
  const { currPatientFiles, setCurrPatientFiles } = useContext(
    PatientCollectionContext
  );

  const audiRef = React.useRef(null);
  const intervalRef = React.useRef(null);

  const handleSliderChange = (event, newValue) => {
    if (audiRef.current) {
      const jump = (newValue * audiRef.current.duration) / 100;
      audiRef.current.currentTime = jump;
      if (isPlaying) audiRef.current.play();
    }
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };
  const handlePlaybtn = () => {
    setIsPlaying((prev) => !isPlaying);
  };

  useEffect(() => {
    if (!audiRef.current) return;
    if (isPlaying) {
      audiRef.current.play();
  
      intervalRef.current = setInterval(() => {
        const curTime = audiRef.current.currentTime;// ye audio ka current time nikalta hai ki audio kitne time tak challa hai second mai 
        const duration = audiRef.current.duration;//ye audio ki total length nikalta hai 
        const percentage = (curTime / duration) * 100;//Ye calculate karta hai audio kitna percent play ho chuka hai.
        setValue(percentage);
      }, 500);

      
    } else {
      audiRef.current.pause();
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    console.log( currPatientFiles);
    if (currPatientFiles?.audioFile) {
      audiRef.current = new Audio( currPatientFiles.audioFile.signedUrl);
      console.log(audiRef.current);
      audiRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  }, [ currPatientFiles]);

  return (
    <Box className="playbutton-and-volume">
      <div className="playbutton" onClick={handlePlaybtn}>
        {isPlaying === true ? (
          <i className="fa-solid fa-pause"></i>
        ) : (
          <i className="fa-solid fa-play"></i>
        )}
      </div>

      <div style={{ paddingLeft: "1rem" }}>
        <div id="input-slider">Volume</div>

        <Grid
          container
          spacing={2}
          sx={{
            alignItems: "center",
            width: "40vw",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid onClick={handlePlaybtn}>
            {isPlaying ? <VolumeUp /> : <VolumeOffIcon />}
          </Grid>
          <Grid size="grow">
            <Slider
              value={typeof value === "number" ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid>
            {/* <Input
              value={value}
              size="small"
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: 10,
                min: 0,
                max: 100,
                type: "number",
                "aria-labelledby": "input-slider",
              }} 
             /> */}
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}
