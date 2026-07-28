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
import { designationFormSchema } from '../../utils/validation';

const levels = ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Executive'];

const DesignationForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(designationFormSchema),
    defaultValues: initialData || {
      title: '',
      level: 'Junior',
      description: '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Designation' : 'Add Designation'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Title"
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required error={!!errors.level}>
            <InputLabel>Level</InputLabel>
            <Select
              value={watch('level')}
              onChange={(e) => setValue('level', e.target.value)}
              label="Level"
            >
              {levels.map((l) => (
                <MenuItem key={l} value={l}>{l}</MenuItem>
              ))}
            </Select>
          </FormControl>
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
          {loading ? 'Saving...' : initialData ? 'Update Designation' : 'Add Designation'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default DesignationForm;