import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
} from '@mui/material';
import { getPermissions } from '../../services/adminService';

const permissions = [
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_roles', label: 'Manage Roles' },
  { id: 'manage_departments', label: 'Manage Departments' },
  { id: 'manage_designations', label: 'Manage Designations' },
  { id: 'view_reports', label: 'View Reports' },
  { id: 'export_data', label: 'Export Data' },
];

const Permissions = () => {
  const [selected, setSelected] = useState({});
  const { data, isLoading } = useQuery({
    queryKey: ['admin-permissions'],
    queryFn: getPermissions,
  });

  const handleToggle = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>Permissions</Typography>
        <Button variant="contained">Save Permissions</Button>
      </Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Available Permissions</Typography>
        <FormGroup>
          {permissions.map((perm) => (
            <ListItem key={perm.id} sx={{ pl: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selected[perm.id] || !!data?.[perm.id]}
                    onChange={() => handleToggle(perm.id)}
                  />
                }
                label={perm.label}
              />
            </ListItem>
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
};

export default Permissions;