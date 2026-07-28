import { useState, useCallback } from 'react';
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
  CircularProgress,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DepartmentTable from './DepartmentTable';
import DepartmentForm from './DepartmentForm';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../services/departmentService';

const Departments = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingDept, setEditingDept] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setSnackbar({ open: true, message: 'Department created successfully', severity: 'success' });
      setOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to create department', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setSnackbar({ open: true, message: 'Department updated successfully', severity: 'success' });
      setEditingDept(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update department', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      setSnackbar({ open: true, message: 'Department deleted successfully', severity: 'success' });
      setDeleteId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete department', severity: 'error' });
    },
  });

  const handleSubmit = (data) => {
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingDept(null); setOpen(true); }}>
          Add Department
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DepartmentTable
          departments={data?.data || data || []}
          onView={(id) => navigate(`/departments/${id}`)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingDept(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent>
          <DepartmentForm
            initialData={editingDept}
            onSubmit={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setOpen(false); setEditingDept(null); }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this department? This action cannot be undone.
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

export default Departments;
