import { useState } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Divider,
  Avatar,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Brightness4,
  Brightness7,
  Dashboard,
  People,
  CalendarMonth,
  AttachMoney,
  Business,
  Work,
  Assessment,
  AdminPanelSettings,
  Menu as MenuIcon,
  ChevronLeft,
  Lock,
} from '@mui/icons-material';
import { logout } from '../../store/authSlice';
import { toggleTheme } from '../../store/themeSlice';
import { useRole } from '../../hooks/useRole';
import Toast from '../notifications/Toast';

const drawerWidth = 260;

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const mode = useSelector((state) => state.theme.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin, canManageEmployees, canViewPayroll, canViewAttendance, canViewReports, canAccessAdminPanel } = useRole();

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', show: true },
    { text: 'Employees', icon: <People />, path: '/employees', show: canManageEmployees },
    { text: 'Attendance', icon: <CalendarMonth />, path: '/attendance', show: canViewAttendance },
    { text: 'Payroll', icon: <AttachMoney />, path: '/payroll', show: canViewPayroll },
    { text: 'Departments', icon: <Business />, path: '/departments', show: true },
    { text: 'Designations', icon: <Work />, path: '/designations', show: true },
    { text: 'Reports', icon: <Assessment />, path: '/reports', show: canViewReports },
    { text: 'Admin', icon: <AdminPanelSettings />, path: '/admin', show: canAccessAdminPanel },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6" fontWeight="bold" noWrap>
          Payroll Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1 }}>
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={location.pathname.startsWith(item.path)}
                end={item.path === '/dashboard'}
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
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <Divider />
      <List sx={{ px: 1, mt: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            component={NavLink}
            to="/change-password"
            selected={location.pathname === '/change-password'}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Change Password" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            {menuItems.find((item) => location.pathname.startsWith(item.path))?.text || 'Dashboard'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
              <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
                {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>
            <Typography variant="body2" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
              {user?.username || user?.email || user?.name || 'User'}
            </Typography>
            <Tooltip title="Account">
              <IconButton onClick={handleMenu} size="small">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
                  {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => navigate('/profile')}>
              <AccountCircle fontSize="small" sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/change-password')}>
              <Lock fontSize="small" sx={{ mr: 1 }} />
              Change Password
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Sidebar - Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
      <Toast />
    </Box>
  );
};

export default MainLayout;
