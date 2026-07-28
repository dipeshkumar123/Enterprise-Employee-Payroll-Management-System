import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Badge,
} from '@mui/material';
import { Notifications as NotificationsIcon, CheckCircle, Error as ErrorIcon, Info, Warning } from '@mui/icons-material';

const NotificationDropdown = ({ anchorEl, open, onClose, notifications, onMarkAllRead, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle sx={{ color: '#2e7d32' }} />;
      case 'error': return <ErrorIcon sx={{ color: '#d32f2f' }} />;
      case 'warning': return <Warning sx={{ color: '#ed6c02' }} />;
      default: return <Info sx={{ color: '#1976d2' }} />;
    }
  };

  return (
    <Paper
      sx={{
        width: 360,
        maxHeight: 480,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 40,
        zIndex: 1300,
        display: open ? 'block' : 'none',
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <Button size="small" onClick={onMarkAllRead}>Mark all read</Button>
      </Box>
      <Divider />
      <List sx={{ maxHeight: 360, overflow: 'auto', p: 0 }}>
        {notifications.length === 0 ? (
          <ListItem>
            <ListItemText primary="No notifications" />
          </ListItem>
        ) : (
          notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
              secondaryAction={
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => onRemove?.(notification.id)}
                >
                  <NotificationsIcon fontSize="small" />
                </IconButton>
              }
            >
              <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={notification.message}
                slotProps={{ primary: { fontWeight: notification.read ? 'normal' : 'bold' } }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};

export default NotificationDropdown;
