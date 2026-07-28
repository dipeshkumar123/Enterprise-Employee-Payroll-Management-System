import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { getAuditLogs } from '../../services/adminService';

const AuditLogs = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['admin-audit-logs', page],
    queryFn: () => getAuditLogs({ page }),
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const logs = data?.data || data || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Resource</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No audit logs found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{log.userName || log.userId || '-'}</TableCell>
                  <TableCell>{log.action || '-'}</TableCell>
                  <TableCell>{log.resource || '-'}</TableCell>
                  <TableCell>{log.details || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button variant="outlined" onClick={() => setPage((p) => Math.max(1, p - 1))} sx={{ mr: 1 }}>
          Previous
        </Button>
        <Button variant="outlined" onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default AuditLogs;