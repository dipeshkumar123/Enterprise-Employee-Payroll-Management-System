import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { userFormSchema } from '../../utils/validation';

const UserForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Employee',
      ...initialData,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit User' : 'Add User'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
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
          <FormControl fullWidth required error={!!errors.role}>
            <InputLabel>Role</InputLabel>
            <Select
              value={watch('role')}
              onChange={(e) => setValue('role', e.target.value)}
              label="Role"
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update User' : 'Add User'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default UserForm;