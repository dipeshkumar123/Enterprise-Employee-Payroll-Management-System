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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import DesignationTable from './DesignationTable';
import DesignationForm from './DesignationForm';
import { getDesignations, createDesignation, updateDesignation, deleteDesignation } from '../../services/designationService';

const Designations = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingDes, setEditingDes] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isLoading } = useQuery({
    queryKey: ['designations'],
    queryFn: getDesignations,
  });

  const createMutation = useMutation({
    mutationFn: createDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setSnackbar({ open: true, message: 'Designation created successfully', severity: 'success' });
      setOpen(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to create designation', severity: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDesignation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setSnackbar({ open: true, message: 'Designation updated successfully', severity: 'success' });
      setEditingDes(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update designation', severity: 'error' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDesignation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designations'] });
      setSnackbar({ open: true, message: 'Designation deleted successfully', severity: 'success' });
      setDeleteId(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to delete designation', severity: 'error' });
    },
  });

  const handleSubmit = (data) => {
    if (editingDes) {
      updateMutation.mutate({ id: editingDes.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (des) => {
    setEditingDes(des);
    setOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingDes(null); setOpen(true); }}>
          Add Designation
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DesignationTable
          designations={data?.data || data || []}
          onEdit={handleEdit}
          onDelete={setDeleteId}
        />
      )}
      <Dialog open={open} onClose={() => { setOpen(false); setEditingDes(null); }} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDes ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
        <DialogContent>
          <DesignationForm
            initialData={editingDes}
            onSubmit={handleSubmit}
            loading={createMutation.isPending || updateMutation.isPending}
            onCancel={() => { setOpen(false); setEditingDes(null); }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this designation? This action cannot be undone.
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

export default Designations;
