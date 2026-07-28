import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import EmployeeForm from './EmployeeForm';
import { createEmployee } from '../../services/employeeService';
import { useState } from 'react';

const AddEmployee = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const mutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSnackbar({ open: true, message: 'Employee added successfully', severity: 'success' });
      setTimeout(() => navigate('/employees'), 1500);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to add employee', severity: 'error' });
    },
  });

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/employees')} sx={{ mb: 3 }}>
        Back to Employees
      </Button>
      <EmployeeForm
        onSubmit={mutation.mutate}
        loading={mutation.isPending}
        onCancel={() => navigate('/employees')}
      />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddEmployee;
