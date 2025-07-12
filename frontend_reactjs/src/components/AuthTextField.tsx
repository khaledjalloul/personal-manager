import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";

export const AuthTextField = ({
  required,
  label,
  name,
  error,
  helperText,
  onChange,
}: {
  required: boolean;
  label: string;
  name: string;
  error?: boolean;
  helperText?: string;
  onChange?: () => void;
}) => {
  const [passwordHidden, setPasswordHidden] = useState(true);

  return (
    <TextField
      required={required}
      label={label}
      name={name}
      error={error}
      helperText={helperText}
      onChange={onChange}
      type={name === "password" && passwordHidden ? "password" : "text"}
      sx={{
        borderColor: "#fff",
        outlineColor: "#fff",
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff !important",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#aaa",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#00c0ff !important",
          },
      }}
      fullWidth={true}
      autoComplete="off"
      style={{ maxWidth: "100%" }}
      inputProps={{
        autoCapitalize: "none",
      }}
      InputProps={{
        sx: {
          color: "background.default",
        },
        endAdornment: name === "password" && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setPasswordHidden(!passwordHidden)}
              sx={{ color: "background.default" }}
            >
              {passwordHidden ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        style: {
          color: "#fff",
        },
        required: false,
      }}
    />
  );
};
