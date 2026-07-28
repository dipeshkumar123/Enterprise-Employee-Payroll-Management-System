import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
} from '@mui/material';
import DepartmentDropdown from './DepartmentDropdown';
import DesignationDropdown from './DesignationDropdown';
import { employeeFormSchema } from '../../utils/validation';

const EmployeeForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(employeeFormSchema),
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      salary: '',
      dateOfJoining: '',
      status: 'Active',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Employee' : 'Add Employee'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="First Name"
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Last Name"
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Phone"
            {...register('phone')}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DepartmentDropdown
            value={watch('department')}
            onChange={(e) => setValue('department', e.target.value)}
            error={errors.department?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <DesignationDropdown
            value={watch('designation')}
            onChange={(e) => setValue('designation', e.target.value)}
            error={errors.designation?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Salary"
            type="number"
            {...register('salary')}
            error={!!errors.salary}
            helperText={errors.salary?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Date of Joining"
            type="date"
            {...register('dateOfJoining')}
            error={!!errors.dateOfJoining}
            helperText={errors.dateOfJoining?.message}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={watch('status') === 'Active'}
                onChange={(e) => setValue('status', e.target.checked ? 'Active' : 'Inactive')}
              />
            }
            label="Active"
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Employee' : 'Add Employee'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EmployeeForm;