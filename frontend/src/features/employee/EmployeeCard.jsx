import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const EmployeeCard = ({ employee, onView, onEdit, onDelete }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, mb: 2 }}>
      <Avatar
        sx={{ width: 56, height: 56, mr: 2, bgcolor: '#1976d2', fontSize: 24 }}
      >
        {employee.firstName?.[0]}{employee.lastName?.[0]}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {employee.firstName} {employee.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {employee.designation} - {employee.department}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {employee.email}
        </Typography>
      </Box>
      <Box>
        <Tooltip title="View">
          <IconButton onClick={() => onView(employee.id)}>
            <Visibility />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(employee.id)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton onClick={() => onDelete(employee.id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default EmployeeCard;