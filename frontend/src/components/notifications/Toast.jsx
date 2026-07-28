import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { markAsRead } from '../../store/notificationSlice';

const Toast = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    if (notifications.length > 0 && notifications[0] && !notifications[0].read) {
      setCurrentToast(notifications[0]);
      dispatch(markAsRead(notifications[0].id));
    }
  }, [notifications, dispatch]);

  const handleCloseToast = () => {
    setCurrentToast(null);
  };

  return (
    <Box>
      <Snackbar
        open={Boolean(currentToast)}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert severity={currentToast?.type || 'info'} onClose={handleCloseToast} sx={{ minWidth: 300 }}>
          <Typography variant="subtitle2" fontWeight="bold">{currentToast?.title}</Typography>
          <Typography variant="body2">{currentToast?.message}</Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Toast;