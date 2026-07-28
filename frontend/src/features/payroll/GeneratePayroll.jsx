import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import PayrollForm from './PayrollForm';
import { generatePayroll } from '../../services/payrollService';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/notificationSlice';

const GeneratePayroll = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const mutation = useMutation({
    mutationFn: generatePayroll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      setSnackbar({ open: true, message: 'Payroll generated successfully', severity: 'success' });
      setTimeout(() => navigate('/payroll'), 1500);
      dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        title: 'Salary Generated',
        message: 'Salary has been generated for this month.',
        read: false,
      }));
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to generate payroll', severity: 'error' });
    },
  });

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/payroll')} sx={{ mb: 3 }}>
        Back to Payroll
      </Button>
      <PayrollForm onSubmit={mutation.mutate} loading={mutation.isPending} onCancel={() => navigate('/payroll')} />
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default GeneratePayroll;
