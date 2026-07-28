import { memo } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
} from '@mui/material';
import { Visibility, Download } from '@mui/icons-material';

const statusColors = {
  Paid: '#e8f5e9',
  Pending: '#fff3e0',
  Processing: '#e3f2fd',
  Failed: '#fce4ec',
};

const textColors = {
  Paid: '#2e7d32',
  Pending: '#e65100',
  Processing: '#1565c0',
  Failed: '#c62828',
};

// Mobile card view for payroll records
const PayrollMobileCard = memo(({ record, onView, onDownload }) => (
  <Card sx={{ mb: 1.5 }}>
    <CardContent sx={{ pb: 1 }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {record.employeeName || `${record.firstName || ''} ${record.lastName || ''}`}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Period</Typography>
          <Typography variant="body2">{record.month}/{record.year}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Status</Typography>
          <Box>
            <Chip
              label={record.status || 'Pending'}
              size="small"
              sx={{
                bgcolor: statusColors[record.status] || '#f5f5f5',
                color: textColors[record.status] || '#333',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Basic</Typography>
          <Typography variant="body2">${record.basicSalary?.toLocaleString() || 0}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Net Salary</Typography>
          <Typography variant="body2" fontWeight="bold" color="primary.main">
            ${record.netSalary?.toLocaleString() || 0}
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
      <Button size="small" startIcon={<Visibility fontSize="small" />} onClick={() => onView?.(record.id)}>
        View
      </Button>
      <Button size="small" startIcon={<Download fontSize="small" />} onClick={() => onDownload?.(record.id)}>
        PDF
      </Button>
    </CardActions>
  </Card>
));

PayrollMobileCard.displayName = 'PayrollMobileCard';

const PayrollTable = ({ records = [], onView, onDownload }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box>
        {records.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No payroll records found</Typography>
          </Paper>
        ) : (
          records.map((record) => (
            <PayrollMobileCard key={record.id} record={record} onView={onView} onDownload={onDownload} />
          ))
        )}
      </Box>
    );
  }

  return (
    <Paper>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Month</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Year</TableCell>
              <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Basic Salary</TableCell>
              <TableCell>Net Salary</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No payroll records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    {record.employeeName || `${record.firstName || ''} ${record.lastName || ''}`}
                  </TableCell>
                  <TableCell>{record.month}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{record.year}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    ${record.basicSalary?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>${record.netSalary?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status || 'Pending'}
                      size="small"
                      sx={{
                        bgcolor: statusColors[record.status] || '#f5f5f5',
                        color: textColors[record.status] || '#333',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Payslip">
                      <IconButton size="small" onClick={() => onView?.(record.id)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download PDF">
                      <IconButton size="small" onClick={() => onDownload?.(record.id)}>
                        <Download fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PayrollTable;
