import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

const designations = [
  'Software Engineer',
  'Senior Software Engineer',
  'Team Lead',
  'Manager',
  'Senior Manager',
  'Director',
  'VP',
  'CTO',
  'HR Executive',
  'HR Manager',
  'Sales Executive',
  'Sales Manager',
  'Accountant',
  'Finance Manager',
  'Operations Manager',
  'Marketing Executive',
  'Designer',
  'Support Engineer',
];

const DesignationDropdown = ({ value, onChange, error, helperText, ...props }) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel>Designation</InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label="Designation"
        {...props}
      >
        {designations.map((des) => (
          <MenuItem key={des} value={des}>
            {des}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DesignationDropdown;