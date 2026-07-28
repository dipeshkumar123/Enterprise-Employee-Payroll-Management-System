import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  TextField,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { getSystemSettings, updateSystemSettings } from '../../services/adminService';

const SystemSettings = () => {
  const queryClient = useQueryClient();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getSystemSettings,
  });

  const mutation = useMutation({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      setSnackbar({ open: true, message: 'Settings updated successfully', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to update settings', severity: 'error' });
    },
  });

  const [form, setForm] = useState({
    appName: '',
    supportEmail: '',
    maxLeaveDays: '',
    enableNotifications: true,
    maintenanceMode: false,
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>System Settings</Typography>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Application Name"
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Support Email"
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Maximum Leave Days"
                type="number"
                value={form.maxLeaveDays}
                onChange={(e) => setForm({ ...form, maxLeaveDays: e.target.value })}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.enableNotifications}
                    onChange={(e) => setForm({ ...form, enableNotifications: e.target.checked })}
                  />
                }
                label="Enable Notifications"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.maintenanceMode}
                    onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })}
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => mutation.mutate(form)}
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default SystemSettings;
