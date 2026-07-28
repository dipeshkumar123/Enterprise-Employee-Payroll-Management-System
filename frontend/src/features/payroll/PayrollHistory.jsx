import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import PayrollTable from './PayrollTable';
import { getPayrollHistory } from '../../services/payrollService';

const PayrollHistory = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { data, isLoading } = useQuery({
    queryKey: ['payroll-history', year, month],
    queryFn: () => getPayrollHistory({ year, month }),
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
      <Typography variant="h4" gutterBottom>Payroll History</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select value={year} onChange={(e) => setYear(Number(e.target.value))} label="Year">
            {[year - 1, year, year + 1].map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Month</InputLabel>
          <Select value={month} onChange={(e) => setMonth(Number(e.target.value))} label="Month">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <PayrollTable records={data?.data || data || []} />
    </Box>
  );
};

export default PayrollHistory;