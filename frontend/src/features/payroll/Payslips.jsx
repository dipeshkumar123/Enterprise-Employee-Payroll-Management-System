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
  Button,
  Paper,
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import PayslipViewer from './PayslipViewer';
import DownloadPDFButton from './DownloadPDFButton';
import { getPayslip, getPayroll } from '../../services/payrollService';

const Payslips = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ['payroll', 'history', year, month],
    queryFn: () => getPayroll({ year, month }),
  });

  const { data: payslip } = useQuery({
    queryKey: ['payslip', selectedId],
    queryFn: () => getPayslip(selectedId),
    enabled: !!selectedId,
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
      <Typography variant="h4" gutterBottom>Payslips</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
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
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {(payrolls?.data || payrolls || []).map((record) => (
              <Paper key={record.id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {record.employeeName || `Employee ${record.employeeId}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {record.month}/{record.year} - ${record.netSalary?.toLocaleString() || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" onClick={() => setSelectedId(record.id)}>View</Button>
                  <DownloadPDFButton id={record.id} label="PDF" />
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
        {selectedId && (
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <PayslipViewer payslip={payslip} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Payslips;