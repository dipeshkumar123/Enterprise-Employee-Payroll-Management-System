import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Avatar,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { getProfile, updateProfile, uploadProfilePhoto } from '../../services/userService';

const UserProfile = () => {
  const queryClient = useQueryClient();
  const [photoDialog, setPhotoDialog] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const photoMutation = useMutation({
    mutationFn: uploadProfilePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSnackbar({ open: true, message: 'Profile photo updated', severity: 'success' });
      setPhotoDialog(false);
      setSelectedPhoto(null);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to upload photo', severity: 'error' });
    },
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPhoto(file);
    }
  };

  const handlePhotoUpload = () => {
    if (selectedPhoto) {
      const formData = new FormData();
      formData.append('photo', selectedPhoto);
      photoMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar src={profile?.profilePhoto || profile?.photo} sx={{ width: 120, height: 120 }} />
            <Button
              variant="contained"
              size="small"
              startIcon={<PhotoCamera />}
              onClick={() => setPhotoDialog(true)}
              sx={{ position: 'absolute', bottom: 0, right: 0 }}
            >
              Change
            </Button>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {profile?.name || profile?.firstName + ' ' + profile?.lastName || 'User'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.email || profile?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile?.designation || profile?.role || 'Employee'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="outlined">Edit Profile</Button>
            <Button variant="outlined">Change Password</Button>
          </Box>
        </CardContent>
      </Card>
      <Dialog open={photoDialog} onClose={() => setPhotoDialog(false)}>
        <DialogTitle>Update Profile Photo</DialogTitle>
        <DialogContent>
          <Button variant="outlined" component="label" sx={{ mt: 2 }}>
            Select Photo
            <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
          </Button>
          {selectedPhoto && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Selected: {selectedPhoto.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhotoDialog(false)}>Cancel</Button>
          <Button onClick={handlePhotoUpload} variant="contained" disabled={!selectedPhoto || photoMutation.isPending}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default UserProfile;
