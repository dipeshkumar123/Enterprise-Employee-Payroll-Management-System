import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import { roleFormSchema } from '../../utils/validation';

const RoleForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(roleFormSchema),
    defaultValues: {
      name: '',
      description: '',
      ...initialData,
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Role' : 'Add Role'}
      </Typography>
      <TextField
        label="Role Name"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        required
        sx={{ mb: 2 }}
      />
      <TextField
        label="Description"
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 3 }}
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Role' : 'Add Role'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default RoleForm;