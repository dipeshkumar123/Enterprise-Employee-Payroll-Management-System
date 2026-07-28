import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, CircularProgress, Paper, Typography, Grid } from '@mui/material';
import { ArrowBack, People, LocationOn, Person } from '@mui/icons-material';
import DepartmentCard from './DepartmentCard';
import { getDepartmentById } from '../../services/departmentService';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: department, isLoading } = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/departments')} sx={{ mb: 3 }}>
        Back to Departments
      </Button>
      <DepartmentCard department={department} />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">Department Information</Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Manager</Typography>
                <Typography variant="body1">{department?.manager || '-'}</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOn color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">Location</Typography>
                <Typography variant="body1">{department?.location || '-'}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="caption" color="text.secondary">Description</Typography>
          <Typography variant="body1" sx={{ mt: 0.5 }}>{department?.description || 'No description provided.'}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default DepartmentDetails;