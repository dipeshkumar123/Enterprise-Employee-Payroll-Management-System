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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import UserTable from './UserTable';
import UserForm from './UserForm';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/adminService';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSnackbar({ open: true, message: 'User created successfully', severity: 'success' });
      setOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to create user', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
      setEditingUser(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update user', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
      setDeleteId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
    },
  });

  const handleSubmit = (data) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingUser(null); setOpen(true); }}>
          Add User
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <UserTable users={data?.data || data || []} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingUser(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <UserForm
            initialData={editingUser}
            onSubmit={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setOpen(false); setEditingUser(null); }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
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

export default ManageUsers;
