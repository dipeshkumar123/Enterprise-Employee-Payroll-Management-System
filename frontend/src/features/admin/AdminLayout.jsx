import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  AppBar,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  People,
  Security,
  Lock,
  History,
  Settings,
  Menu as MenuIcon,
  ChevronLeft,
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Manage Users', icon: <People />, path: '/admin/users' },
    { text: 'Manage Roles', icon: <Security />, path: '/admin/roles' },
    { text: 'Permissions', icon: <Lock />, path: '/admin/permissions' },
    { text: 'Audit Logs', icon: <History />, path: '/admin/audit-logs' },
    { text: 'System Settings', icon: <Settings />, path: '/admin/settings' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" noWrap>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              sx={{
                borderRadius: 2,
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                  '&:hover': { backgroundColor: 'primary.dark' },
                },
                '& .MuiListItemIcon-root': { minWidth: 40 },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile header */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderBottom: 1,
            borderColor: 'divider',
          }}
          elevation={0}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              {mobileOpen ? <ChevronLeft /> : <MenuIcon />}
            </IconButton>
            <Typography variant="h6" fontWeight="bold" noWrap>
              Admin Panel
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(isMobile ? {} : { borderRight: '1px solid', borderColor: 'divider' }),
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          ...(isMobile ? { mt: '64px' } : { ml: `${drawerWidth}px` }),
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
