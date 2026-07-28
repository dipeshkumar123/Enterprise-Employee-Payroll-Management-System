import { TextField as MuiTextField } from '@mui/material';

const TextField = ({ label, type = 'text', error, helperText, required, fullWidth, margin, ...props }) => {
  return (
    <MuiTextField
      label={label}
      type={type}
      error={!!error}
      helperText={helperText}
      required={required}
      fullWidth={fullWidth}
      margin={margin}
      {...props}
    />
  );
};

export default TextField;
