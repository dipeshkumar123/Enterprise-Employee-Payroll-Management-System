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
import { Edit } from '@mui/icons-material';

const statusColors = {
  Present: '#e8f5e9',
  Absent: '#fce4ec',
  Leave: '#fff3e0',
  HalfDay: '#e3f2fd',
};

const statusTextColors = {
  Present: '#2e7d32',
  Absent: '#c62828',
  Leave: '#e65100',
  HalfDay: '#1565c0',
};

// Mobile card view for attendance records
const AttendanceMobileCard = memo(({ record, onEdit }) => (
  <Card sx={{ mb: 1.5 }}>
    <CardContent sx={{ pb: 1 }}>
      <Grid container spacing={1}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {record.employeeName || `${record.firstName || ''} ${record.lastName || ''}`}
          </Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Date</Typography>
          <Typography variant="body2">{record.date}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Status</Typography>
          <Box>
            <Chip
              label={record.status}
              size="small"
              sx={{
                bgcolor: statusColors[record.status] || '#f5f5f5',
                color: statusTextColors[record.status] || '#333',
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Check In</Typography>
          <Typography variant="body2">{record.checkIn || '-'}</Typography>
        </Grid>
        <Grid size={{ xs: 6 }}>
          <Typography variant="caption" color="text.secondary">Check Out</Typography>
          <Typography variant="body2">{record.checkOut || '-'}</Typography>
        </Grid>
      </Grid>
    </CardContent>
    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
      <Button size="small" startIcon={<Edit fontSize="small" />} onClick={() => onEdit(record.id)}>
        Edit
      </Button>
    </CardActions>
  </Card>
));

AttendanceMobileCard.displayName = 'AttendanceMobileCard';

const AttendanceTable = ({ records = [], onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box>
        {records.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No attendance records found</Typography>
          </Paper>
        ) : (
          records.map((record) => (
            <AttendanceMobileCard key={record.id} record={record} onEdit={onEdit} />
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
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Check In</TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Check Out</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No attendance records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    {record.employeeName || `${record.firstName || ''} ${record.lastName || ''}`}
                  </TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      size="small"
                      sx={{
                        bgcolor: statusColors[record.status] || '#f5f5f5',
                        color: statusTextColors[record.status] || '#333',
                        fontWeight: 'bold',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {record.checkIn || '-'}
                  </TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    {record.checkOut || '-'}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit(record.id)}>
                        <Edit fontSize="small" />
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

export default AttendanceTable;
