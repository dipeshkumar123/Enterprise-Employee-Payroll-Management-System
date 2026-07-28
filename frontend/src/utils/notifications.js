export const triggerLoginSuccess = () => ({
  id: Date.now(),
  type: 'success',
  title: 'Login Successful',
  message: 'Welcome back!',
  read: false,
});

export const triggerAttendanceUpdated = (data) => ({
  id: Date.now(),
  type: 'info',
  title: 'Attendance Updated',
  message: `Attendance for ${data?.employeeName || 'employee'} has been updated.`,
  read: false,
});

export const triggerSalaryGenerated = (data) => ({
  id: Date.now(),
  type: 'success',
  title: 'Salary Generated',
  message: `Salary has been generated for ${data?.month || 'this month'}.`,
  read: false,
});