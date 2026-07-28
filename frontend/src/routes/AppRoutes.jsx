import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute, { AdminRoute } from '../components/common/ProtectedRoute';
import { ROLES } from '../hooks/useRole';

// Lazy load layouts
const AuthLayout = lazy(() => import('../components/layouts/AuthLayout'));
const MainLayout = lazy(() => import('../components/layouts/MainLayout'));
const AdminLayout = lazy(() => import('../features/admin/AdminLayout'));

// Lazy load public pages
const Login = lazy(() => import('../features/auth/Login'));
const Register = lazy(() => import('../features/auth/Register'));
const ForgotPassword = lazy(() => import('../features/auth/ForgotPassword'));

// Lazy load protected pages
const Dashboard = lazy(() => import('../features/dashboard/Dashboard'));
const ChangePassword = lazy(() => import('../features/auth/ChangePassword'));

// Lazy load employee pages (specific paths BEFORE :id param routes)
const AddEmployee = lazy(() => import('../features/employee/AddEmployee'));
const EditEmployee = lazy(() => import('../features/employee/EditEmployee'));
const EmployeeList = lazy(() => import('../features/employee/EmployeeList'));
const EmployeeDetails = lazy(() => import('../features/employee/EmployeeDetails'));

// Lazy load attendance pages
const AttendanceDashboard = lazy(() => import('../features/attendance/AttendanceDashboard'));
const DailyAttendance = lazy(() => import('../features/attendance/DailyAttendance'));
const MonthlyAttendance = lazy(() => import('../features/attendance/MonthlyAttendance'));
const AttendanceReport = lazy(() => import('../features/attendance/AttendanceReport'));

// Lazy load payroll pages (specific paths BEFORE parameterized routes)
const GeneratePayroll = lazy(() => import('../features/payroll/GeneratePayroll'));
const SalaryStructure = lazy(() => import('../features/payroll/SalaryStructure'));
const PayrollHistory = lazy(() => import('../features/payroll/PayrollHistory'));
const Payslips = lazy(() => import('../features/payroll/Payslips'));
const PayrollDashboard = lazy(() => import('../features/payroll/PayrollDashboard'));

// Lazy load department/designation pages
const Departments = lazy(() => import('../features/department/Departments'));
const DepartmentDetails = lazy(() => import('../features/department/DepartmentDetails'));
const DepartmentEmployees = lazy(() => import('../features/department/DepartmentEmployees'));
const Designations = lazy(() => import('../features/designation/Designations'));

// Lazy load other pages
const Reports = lazy(() => import('../features/report/Reports'));
const UserProfilePage = lazy(() => import('../features/user/index'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('../features/admin/AdminDashboard'));
const ManageUsers = lazy(() => import('../features/admin/ManageUsers'));
const ManageRoles = lazy(() => import('../features/admin/ManageRoles'));
const Permissions = lazy(() => import('../features/admin/Permissions'));
const AuditLogs = lazy(() => import('../features/admin/AuditLogs'));
const SystemSettings = lazy(() => import('../features/admin/SystemSettings'));

// Lazy load error pages
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFound'));

const SENSITIVE_ROLES = [ROLES.ADMIN, ROLES.HR, ROLES.MANAGER];

// Loading fallback for lazy-loaded routes
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  const { token } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Routes - Auth Layout */}
        <Route path="/" element={<AuthLayout />}>
          <Route index element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Admin Routes - Admin Layout (Admin only) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="roles" element={<ManageRoles />} />
          <Route path="permissions" element={<Permissions />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>

        {/* Protected Routes - Main Layout (outer auth check only) */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          {/* Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* Profile */}
          <Route path="profile" element={<UserProfilePage />} />
          <Route path="change-password" element={<ChangePassword />} />

          {/* Employee Management - SPECIFIC paths BEFORE :id */}
          <Route path="employees/add" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><AddEmployee /></ProtectedRoute>} />
          <Route path="employees/edit/:id" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><EditEmployee /></ProtectedRoute>} />
          <Route path="employees/:id" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><EmployeeDetails /></ProtectedRoute>} />
          <Route path="employees" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><EmployeeList /></ProtectedRoute>} />

          {/* Attendance */}
          <Route path="attendance" element={<AttendanceDashboard />} />
          <Route path="attendance/daily" element={<DailyAttendance />} />
          <Route path="attendance/monthly" element={<MonthlyAttendance />} />
          <Route path="attendance/report" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><AttendanceReport /></ProtectedRoute>} />

          {/* Payroll */}
          <Route path="payroll" element={<PayrollDashboard />} />
          <Route path="payroll/generate" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><GeneratePayroll /></ProtectedRoute>} />
          <Route path="payroll/salary-structure" element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HR]}><SalaryStructure /></ProtectedRoute>} />
          <Route path="payroll/payslips" element={<Payslips />} />
          <Route path="payroll/history" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><PayrollHistory /></ProtectedRoute>} />

          {/* Departments & Designations - SPECIFIC paths BEFORE :id */}
          <Route path="departments/:id/employees" element={<DepartmentEmployees />} />
          <Route path="departments/:id" element={<DepartmentDetails />} />
          <Route path="departments" element={<Departments />} />
          <Route path="designations" element={<Designations />} />

          {/* Reports */}
          <Route path="reports" element={<ProtectedRoute allowedRoles={SENSITIVE_ROLES}><Reports /></ProtectedRoute>} />
        </Route>

        {/* Error Pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
