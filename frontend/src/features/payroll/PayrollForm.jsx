import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Grid,
} from '@mui/material';
import { payrollFormSchema } from '../../utils/validation';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const PayrollForm = ({ initialData, onSubmit, loading = false, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(payrollFormSchema),
    defaultValues: initialData || {
      employeeId: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      basicSalary: '',
      allowances: 0,
      deductions: 0,
      bonus: 0,
    },
  });

  const basicSalary = watch('basicSalary') || 0;
  const allowances = watch('allowances') || 0;
  const deductions = watch('deductions') || 0;
  const bonus = watch('bonus') || 0;
  const netSalary = Number(basicSalary) + Number(allowances) + Number(bonus) - Number(deductions);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" gutterBottom>
        {initialData ? 'Edit Payroll' : 'Generate Payroll'}
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Employee ID"
            type="number"
            {...register('employeeId')}
            error={!!errors.employeeId}
            helperText={errors.employeeId?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required error={!!errors.month}>
            <InputLabel>Month</InputLabel>
            <Select
              value={watch('month')}
              onChange={(e) => setValue('month', Number(e.target.value))}
              label="Month"
            >
              {months.map((m, idx) => (
                <MenuItem key={m} value={idx + 1}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Year"
            type="number"
            {...register('year')}
            error={!!errors.year}
            helperText={errors.year?.message}
            fullWidth
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Basic Salary"
            type="number"
            {...register('basicSalary')}
            error={!!errors.basicSalary}
            helperText={errors.basicSalary?.message}
            fullWidth
            required
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Allowances"
            type="number"
            {...register('allowances')}
            error={!!errors.allowances}
            helperText={errors.allowances?.message}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Deductions"
            type="number"
            {...register('deductions')}
            error={!!errors.deductions}
            helperText={errors.deductions?.message}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Bonus"
            type="number"
            {...register('bonus')}
            error={!!errors.bonus}
            helperText={errors.bonus?.message}
            fullWidth
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper sx={{ p: 2, bgcolor: '#f3f3f3' }}>
            <Typography variant="body2" color="text.secondary">Net Salary</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ${netSalary.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button type="submit" variant="contained" size="large" disabled={loading}>
          {loading ? 'Saving...' : initialData ? 'Update Payroll' : 'Generate Payroll'}
        </Button>
        <Button variant="outlined" size="large" onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
};

export default PayrollForm;