import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export const AgeGender = ({
  label,
  value,
  onChange,
  options,
  age,
  setAge,
  gender,
  setGender,
}) => {
  //   const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">{label}</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={value}
        label={label}
        onChange={onChange}
      >
        <MenuItem value="">
          {/* <em>None</em> */}
        </MenuItem>
        {options.map((e) => (
          <MenuItem key={e.value} value={e.value}>
            {e.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
