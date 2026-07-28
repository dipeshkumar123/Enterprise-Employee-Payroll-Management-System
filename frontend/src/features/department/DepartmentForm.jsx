import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { departmentFormSchema } from '../../utils/validation';

const DepartmentForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(departmentFormSchema),
    defaultValues: initialData || {
      name: '',
      manager: '',
      location: '',
      description: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Department' : 'Add Department'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Department Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Manager"
            {...register('manager')}
            error={!!errors.manager}
            helperText={errors.manager?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Location"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Description"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Department' : 'Add Department'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default DepartmentForm;