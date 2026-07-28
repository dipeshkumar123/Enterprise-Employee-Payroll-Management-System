import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';
import { getEmployeeReport, getAttendanceReport, getPayrollReport, getDepartmentReport, downloadReport } from '../../services/reportService';

const reportTypes = [
  { id: 'employee', label: 'Employee Report', fetch: getEmployeeReport },
  { id: 'attendance', label: 'Attendance Report', fetch: getAttendanceReport },
  { id: 'payroll', label: 'Payroll Report', fetch: getPayrollReport },
  { id: 'department', label: 'Department Report', fetch: getDepartmentReport },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const currentReport = reportTypes[activeTab];

  const fetchReport = async () => {
    setLoading(true);
    try {
      const result = await currentReport.fetch();
      setData(result?.data || result || []);
    } catch (error) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setData([]);
  };

  const handleDownload = async (format) => {
    try {
      await downloadReport(currentReport.id, format);
    } catch (error) {
      console.error('Download failed:', error);
    }
    setAnchorEl(null);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Reports</Typography>
        <Tooltip title="Download Report">
          <Button variant="contained" startIcon={<FileDownload />} onClick={(e) => setAnchorEl(e.currentTarget)}>
            Download
          </Button>
        </Tooltip>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => handleDownload('csv')}>CSV</MenuItem>
        <MenuItem onClick={() => handleDownload('excel')}>Excel</MenuItem>
        <MenuItem onClick={() => handleDownload('pdf')}>PDF</MenuItem>
      </Menu>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="report tabs">
          {reportTypes.map((report) => (
            <Tab key={report.id} label={report.label} />
          ))}
        </Tabs>
      </Box>
      {!data.length && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="outlined" onClick={fetchReport}>Load Report</Button>
        </Box>
      )}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && data.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key}>{key.toUpperCase()}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} hover>
                  {Object.values(row).map((val, cellIdx) => (
                    <TableCell key={cellIdx}>{val ?? '-'}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Reports;