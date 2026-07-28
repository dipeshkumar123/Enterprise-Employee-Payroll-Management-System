import { useState, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add, Download } from '@mui/icons-material';
import EmployeeTable from './EmployeeTable';
import { getEmployees, deleteEmployee, exportEmployeesCSV } from '../../services/employeeService';
import { useDebounce } from '../../hooks/useDebounce';

const EmployeeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['employees', page, rowsPerPage, debouncedSearch, sortBy, sortOrder],
    queryFn: () => getEmployees({
      page: page + 1,
      limit: rowsPerPage,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes before re-fetch
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setSnackbar({ open: true, message: 'Employee deleted successfully', severity: 'success' });
      setDeleteId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete employee', severity: 'error' });
    },
  });

  const handleExportCSV = useCallback(async () => {
    try {
      const blob = await exportEmployeesCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setSnackbar({ open: true, message: 'Failed to export CSV', severity: 'error' });
    }
  }, []);

  const handleSort = useCallback((column, order) => {
    setSortBy(column);
    setSortOrder(order);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/employees/add')}>
          Add Employee
        </Button>
        <Button variant="outlined" startIcon={<Download />} onClick={handleExportCSV}>
          Export CSV
        </Button>
      </Box>
      <EmployeeTable
        employees={data?.data || data?.employees || []}
        totalPages={data?.totalPages || 0}
        page={page}
        rowsPerPage={rowsPerPage}
        search={search}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSort}
        onView={(id) => navigate(`/employees/${id}`)}
        onEdit={(id) => navigate(`/employees/edit/${id}`)}
        onDelete={(id) => setDeleteId(id)}
      />
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button onClick={() => deleteMutation.mutate(deleteId)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default EmployeeList;
