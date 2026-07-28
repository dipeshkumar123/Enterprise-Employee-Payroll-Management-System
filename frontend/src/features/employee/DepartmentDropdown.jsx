import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

const departments = [
  'Engineering',
  'Human Resources',
  'Sales',
  'Finance',
  'Operations',
  'Marketing',
  'Design',
  'Support',
];

const DepartmentDropdown = ({ value, onChange, error, helperText, ...props }) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <InputLabel>Department</InputLabel>
      <Select
        value={value || ''}
        onChange={onChange}
        label="Department"
        {...props}
      >
        {departments.map((dept) => (
          <MenuItem key={dept} value={dept}>
            {dept}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default DepartmentDropdown;