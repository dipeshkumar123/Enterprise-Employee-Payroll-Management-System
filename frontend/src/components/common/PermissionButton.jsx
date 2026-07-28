import { Tooltip } from '@mui/material';
import { useRole } from '../../hooks/useRole';

const PermissionButton = ({ children, requiredRole, requiredRoles, tooltipText = 'You do not have permission to perform this action', ...props }) => {
  const { hasRole, hasAnyRole } = useRole();

  const hasPermission = requiredRole
    ? hasRole(requiredRole)
    : requiredRoles
      ? hasAnyRole(requiredRoles)
      : true;

  if (!hasPermission) {
    return (
      <Tooltip title={tooltipText}>
        <span>
          {typeof children === 'function'
            ? children({ disabled: true, ...props })
            : children}
        </span>
      </Tooltip>
    );
  }

  return typeof children === 'function' ? children({ disabled: false, ...props }) : children;
};

export default PermissionButton;

