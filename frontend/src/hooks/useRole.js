import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  HR: 'HR',
  EMPLOYEE: 'EMPLOYEE',
};

export const useRole = () => {
  const user = useSelector((state) => state.auth.user);

  const normalizeRole = (value) => String(value || '').replace(/^ROLE_/i, '').toUpperCase();
  const role = useMemo(() => normalizeRole(user?.role || user?.roles?.[0]), [user]);
  const roles = useMemo(() => {
    if (user?.roles) return user.roles.map(normalizeRole);
    if (user?.role) return [normalizeRole(user.role)];
    return [];
  }, [user]);

  const hasRole = (requiredRole) => roles.includes(requiredRole);
  const hasAnyRole = (requiredRoles) => requiredRoles.some((r) => roles.includes(r));
  const hasAllRoles = (requiredRoles) => requiredRoles.every((r) => roles.includes(r));

  const isAdmin = hasRole(ROLES.ADMIN);
  const isManager = hasRole(ROLES.MANAGER);
  const isHR = hasRole(ROLES.HR);
  const isEmployee = hasRole(ROLES.EMPLOYEE);

  const canManageUsers = isAdmin;
  const canManageRoles = isAdmin;
  const canViewPayroll = isAdmin || isHR || isManager;
  const canGeneratePayroll = isAdmin || isHR;
  const canManageEmployees = isAdmin || isHR || isManager;
  const canViewAttendance = true;
  const canMarkAttendance = isAdmin || isHR || isManager;
  const canViewReports = isAdmin || isHR || isManager;
  const canAccessAdminPanel = isAdmin;

  return {
    role,
    roles,
    user,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isManager,
    isHR,
    isEmployee,
    canManageUsers,
    canManageRoles,
    canViewPayroll,
    canGeneratePayroll,
    canManageEmployees,
    canViewAttendance,
    canMarkAttendance,
    canViewReports,
    canAccessAdminPanel,
  };
};

export const PermissionGate = ({ children, requiredRole, requiredRoles, fallback = null }) => {
  const { hasRole, hasAnyRole } = useRole();

  if (requiredRole && hasRole(requiredRole)) {
    return children;
  }

  if (requiredRoles && hasAnyRole(requiredRoles)) {
    return children;
  }

  return fallback;
};

export default useRole;

