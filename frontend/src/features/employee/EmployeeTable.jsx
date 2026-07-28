import { memo, useCallback } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit, Delete, Visibility, Search } from '@mui/icons-material';
import { useDebouncedCallback } from '../../hooks/useDebounce';

const headCells = [
  { id: 'id', label: 'ID' },
  { id: 'firstName', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'department', label: 'Department' },
  { id: 'designation', label: 'Designation' },
  { id: 'status', label: 'Status' },
  { id: 'actions', label: 'Actions', sortable: false },
];

// Memoized row component to prevent unnecessary re-renders
const EmployeeRow = memo(({ employee, onView, onEdit, onDelete }) => {
  const handleView = useCallback(() => onView(employee.id), [employee.id, onView]);
  const handleEdit = useCallback(() => onEdit(employee.id), [employee.id, onEdit]);
  const handleDelete = useCallback(() => onDelete(employee.id), [employee.id, onDelete]);

  return (
    <TableRow hover>
      <TableCell>{employee.id}</TableCell>
      <TableCell>{`${employee.firstName || ''} ${employee.lastName || ''}`}</TableCell>
      <TableCell>{employee.email}</TableCell>
      <TableCell>{employee.department}</TableCell>
      <TableCell>{employee.designation}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: 'inline-block',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'bold',
            bgcolor: employee.status === 'Active' ? '#e8f5e9' : '#fce4ec',
            color: employee.status === 'Active' ? '#2e7d32' : '#c62828',
          }}
        >
          {employee.status || 'Active'}
        </Box>
      </TableCell>
      <TableCell>
        <Tooltip title="View">
          <IconButton size="small" onClick={handleView}>
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton size="small" onClick={handleEdit}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton size="small" onClick={handleDelete}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
});

EmployeeRow.displayName = 'EmployeeRow';

const EmployeeTable = memo(({
  employees = [],
  totalPages = 0,
  page = 0,
  rowsPerPage = 10,
  search = '',
  sortBy = 'id',
  sortOrder = 'asc',
  onPageChange,
  onRowsPerPageChange,
  onSearchChange,
  onSortChange,
  onView,
  onEdit,
  onDelete,
}) => {
  const handleSort = useCallback((column) => {
    if (column === 'actions') return;
    const isAsc = sortBy === column && sortOrder === 'asc';
    onSortChange(column, isAsc ? 'desc' : 'asc');
  }, [sortBy, sortOrder, onSortChange]);

  // Debounced search handler to avoid excessive re-renders
  const debouncedSearch = useDebouncedCallback((value) => {
    onSearchChange(value);
  }, 300);

  const handleSearchInput = useCallback((e) => {
    debouncedSearch(e.target.value);
  }, [debouncedSearch]);

  return (
    <Paper>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Employees
        </Typography>
        <TextField
          size="small"
          placeholder="Search employees..."
          defaultValue={search}
          onChange={handleSearchInput}
          InputProps={{
            startAdornment: <Search fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id}>
                  {headCell.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === headCell.id}
                      direction={sortBy === headCell.id ? sortOrder : 'asc'}
                      onClick={() => handleSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No employees found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <EmployeeRow
                  key={emp.id}
                  employee={emp}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalPages * rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
});

EmployeeTable.displayName = 'EmployeeTable';

export default EmployeeTable;
