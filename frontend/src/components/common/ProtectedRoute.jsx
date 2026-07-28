import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import { isTokenExpired, getUserFromToken } from '../../utils/jwt';
import { setCredentials, clearCredentials } from '../../store/authSlice';
import { ROLES } from '../../hooks/useRole';

const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login', fallback }) => {
  const { token, user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Check authentication
  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check JWT token expiry
  if (isTokenExpired(token)) {
    dispatch(clearCredentials());
    return <Navigate to={redirectTo} state={{ from: location, expired: true }} replace />;
  }

  // Ensure user state is populated from token if missing
  if (!user && token) {
    const tokenUser = getUserFromToken(token);
    if (tokenUser) {
      dispatch(setCredentials({
        user: tokenUser,
        token,
        refreshToken: localStorage.getItem('refreshToken'),
      }));
    } else {
      dispatch(clearCredentials());
      return <Navigate to={redirectTo} replace />;
    }
  }

  // Role-based access control
  if (allowedRoles && allowedRoles.length > 0) {
    // Support both string role and roles array from auth
    const userRoles = user?.roles || (user?.role ? [user.role] : []);

    // Normalize roles for comparison
    const normalizedUserRoles = userRoles.map(r => r.toUpperCase());
    const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

    const hasPermission = normalizedUserRoles.some(role =>
      normalizedAllowedRoles.includes(role)
    );

    if (!hasPermission) {
      if (fallback) return fallback;
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return children;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = (props) => (
  <ProtectedRoute allowedRoles={[ROLES.ADMIN]} {...props} />
);

/**
 * ManagerRoute - Shorthand for manager+ routes
 */
export const ManagerRoute = (props) => (
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.HR]} {...props} />
);

/**
 * HRRoute - HR-only routes
 */
export const HRRoute = (props) => (
  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]} {...props} />
);

export default ProtectedRoute;

