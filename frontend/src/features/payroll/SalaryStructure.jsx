import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Box, Button, CircularProgress, Paper, Snackbar, Alert, Typography, Grid, TextField } from '@mui/material';
import { Edit } from '@mui/icons-material';
import SalaryCalculator from './SalaryCalculator';
import { getSalaryStructure, updateSalaryStructure } from '../../services/payrollService';

const SalaryStructure = () => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ basicSalary: '', allowances: '', deductions: '', bonus: '' });

  const { data: structures, isLoading } = useQuery({
    queryKey: ['salary-structure'],
    queryFn: getSalaryStructure,
  });

  const mutation = useMutation({
    mutationFn: ({ id, data }) => updateSalaryStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salary-structure'] });
      setSnackbar({ open: true, message: 'Salary structure updated', severity: 'success' });
      setEditingId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update', severity: 'error' });
    },
  });

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      basicSalary: item.basicSalary || '',
      allowances: item.allowances || '',
      deductions: item.deductions || '',
      bonus: item.bonus || '',
    });
  };

  const handleSave = () => {
    mutation.mutate({
      id: editingId,
      data: {
        basicSalary: Number(form.basicSalary),
        allowances: Number(form.allowances),
        deductions: Number(form.deductions),
        bonus: Number(form.bonus),
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Salary Structure</Typography>
      <Grid container spacing={3}>
        {structures?.map((item) => (
          <Grid size={{ xs: 12, md: 6 }} key={item.id}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{item.designation || item.department}</Typography>
                {editingId !== item.id && (
                  <Button size="small" startIcon={<Edit />} onClick={() => handleEdit(item)}>Edit</Button>
                )}
              </Box>
              {editingId === item.id ? (
                <Box>
                  <SalaryCalculator
                    basicSalary={form.basicSalary}
                    allowances={form.allowances}
                    deductions={form.deductions}
                    bonus={form.bonus}
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <TextField label="Basic Salary" type="number" value={form.basicSalary} onChange={(e) => setForm({ ...form, basicSalary: e.target.value })} fullWidth />
                    <TextField label="Allowances" type="number" value={form.allowances} onChange={(e) => setForm({ ...form, allowances: e.target.value })} fullWidth />
                    <TextField label="Deductions" type="number" value={form.deductions} onChange={(e) => setForm({ ...form, deductions: e.target.value })} fullWidth />
                    <TextField label="Bonus" type="number" value={form.bonus} onChange={(e) => setForm({ ...form, bonus: e.target.value })} fullWidth />
                    <Button variant="contained" onClick={handleSave} disabled={mutation.isPending}>Save</Button>
                    <Button onClick={() => setEditingId(null)}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <SalaryCalculator
                  basicSalary={item.basicSalary}
                  allowances={item.allowances}
                  deductions={item.deductions}
                  bonus={item.bonus}
                />
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SalaryStructure;
