import { useState, useCallback } from 'react';
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
  TextField,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import RoleTable from './RoleTable';
import RoleForm from './RoleForm';
import { getRoles, createRole, updateRole, deleteRole } from '../../services/adminService';

const ManageRoles = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-roles'],
    queryFn: getRoles,
  });

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setSnackbar({ open: true, message: 'Role created successfully', severity: 'success' });
      setOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to create role', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setSnackbar({ open: true, message: 'Role updated successfully', severity: 'success' });
      setEditingRole(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update role', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      setSnackbar({ open: true, message: 'Role deleted successfully', severity: 'success' });
      setDeleteId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete role', severity: 'error' });
    },
  });

  const handleSubmit = (data) => {
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingRole(null); setOpen(true); }}>
          Add Role
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RoleTable roles={data?.data || data || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingRole(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRole ? 'Edit Role' : 'Add Role'}</DialogTitle>
        <DialogContent>
          <RoleForm
            initialData={editingRole}
            onSubmit={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setOpen(false); setEditingRole(null); }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this role? This action cannot be undone.
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

export default ManageRoles;
