import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import EmployeeForm from './EmployeeForm';
import { getEmployeeById, updateEmployee } from '../../services/employeeService';
import { useState } from 'react';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (data) => updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      setSnackbar({ open: true, message: 'Employee updated successfully', severity: 'success' });
      setTimeout(() => navigate('/employees'), 1500);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update employee', severity: 'error' });
    },
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/employees')} sx={{ mb: 3 }}>
        Back to Employees
      </Button>
      <EmployeeForm
        initialData={employee}
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

export default EditEmployee;
