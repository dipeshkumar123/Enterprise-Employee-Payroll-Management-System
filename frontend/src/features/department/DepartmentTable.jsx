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
} from '@mui/material';
import { Edit, Delete, Visibility, People } from '@mui/icons-material';

const DepartmentTable = ({ departments = [], onView, onEdit, onDelete }) => {
  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Department Name</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Employees</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No departments found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.name}</TableCell>
                  <TableCell>{dept.manager || '-'}</TableCell>
                  <TableCell>{dept.location || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <People fontSize="small" color="action" />
                      {dept.employeeCount || 0}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View">
                      <IconButton size="small" onClick={() => onView?.(dept.id)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => onEdit?.(dept)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => onDelete?.(dept.id)}>
                        <Delete fontSize="small" />
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

export default DepartmentTable;
