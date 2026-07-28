import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import EmployeeTable from '../employee/EmployeeTable';
import { getDepartmentEmployees } from '../../services/departmentService';

const DepartmentEmployees = () => {
  const { id } = useParams();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['department-employees', id],
    queryFn: () => getDepartmentEmployees(id),
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
      <Typography variant="h4" gutterBottom>Department Employees</Typography>
      <EmployeeTable employees={employees?.data || employees || []} />
    </Box>
  );
};

export default DepartmentEmployees;