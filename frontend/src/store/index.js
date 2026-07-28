import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import employeeReducer from './employeeSlice';
import notificationReducer from './notificationSlice';
import themeReducer from './themeSlice';
import attendanceReducer from './attendanceSlice';
import payrollReducer from './payrollSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    notifications: notificationReducer,
    theme: themeReducer,
    attendance: attendanceReducer,
    payroll: payrollReducer,
  },
});
