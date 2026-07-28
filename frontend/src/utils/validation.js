import * as Yup from 'yup';

// ==================== Shared Validators ====================

export const emailSchema = Yup.string()
  .email('Please enter a valid email address (e.g., user@example.com)')
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    {
      message: 'Email must be in a valid format',
      excludeEmptyString: true,
    }
  )
  .required('Email is required')
  .trim()
  .lowercase();

export const passwordSchema = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must not exceed 128 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    'Password must contain at least one special character'
  )
  .required('Password is required');

export const phoneSchema = Yup.string()
  .matches(
    /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
    'Please enter a valid phone number (e.g., +1 (555) 123-4567)'
  )
  .min(10, 'Phone number must be at least 10 digits')
  .max(15, 'Phone number must not exceed 15 digits')
  .required('Phone number is required');

export const salarySchema = Yup.number()
  .typeError('Salary must be a valid number')
  .positive('Salary must be a positive amount')
  .min(1000, 'Minimum salary is $1,000')
  .max(999999999, 'Salary amount is too large')
  .required('Salary is required');

export const employeeIdSchema = Yup.number()
  .typeError('Employee ID must be a valid number')
  .integer('Employee ID must be a whole number')
  .positive('Employee ID must be a positive number')
  .required('Employee ID is required');

export const dateSchema = Yup.string()
  .required('Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .test('is-valid-date', 'Please enter a valid date', (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  });

export const joiningDateSchema = Yup.string()
  .required('Date of joining is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .test('is-valid-date', 'Please enter a valid date', (value) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  })
  .test(
    'not-future',
    'Date of joining cannot be in the future',
    (value) => {
      if (!value) return false;
      const date = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return date <= today;
    }
  );

export const nameSchema = Yup.string()
  .required('Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must not exceed 100 characters')
  .matches(
    /^[a-zA-Z\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  )
  .trim();

export const departmentNameSchema = Yup.string()
  .required('Department name is required')
  .min(2, 'Department name must be at least 2 characters')
  .max(100, 'Department name must not exceed 100 characters')
  .trim();

export const designationTitleSchema = Yup.string()
  .required('Designation title is required')
  .min(2, 'Designation title must be at least 2 characters')
  .max(100, 'Designation title must not exceed 100 characters')
  .trim();

export const roleNameSchema = Yup.string()
  .required('Role name is required')
  .min(2, 'Role name must be at least 2 characters')
  .max(50, 'Role name must not exceed 50 characters')
  .matches(
    /^[a-zA-Z_\s]+$/,
    'Role name can only contain letters, underscores, and spaces'
  )
  .trim();

export const positiveNumberSchema = Yup.number()
  .typeError('Must be a valid number')
  .min(0, 'Value must be zero or positive')
  .required('This field is required');

export const yearSchema = Yup.number()
  .typeError('Year must be a valid number')
  .integer('Year must be a whole number')
  .min(2000, 'Year must be 2000 or later')
  .max(2100, 'Year must be 2100 or earlier')
  .required('Year is required');

export const monthSchema = Yup.number()
  .typeError('Month must be a valid number')
  .integer('Month must be a whole number')
  .min(1, 'Month must be between 1 and 12')
  .max(12, 'Month must be between 1 and 12')
  .required('Month is required');

export const urlSchema = Yup.string()
  .url('Please enter a valid URL')
  .nullable()
  .transform((value) => (value === '' ? null : value));

export const percentageSchema = Yup.number()
  .typeError('Percentage must be a valid number')
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must not exceed 100')
  .required('Percentage is required');

export const addressSchema = Yup.string()
  .max(500, 'Address must not exceed 500 characters')
  .nullable()
  .transform((value) => (value === '' ? null : value));

export const descriptionSchema = Yup.string()
  .max(1000, 'Description must not exceed 1000 characters')
  .nullable()
  .transform((value) => (value === '' ? null : value));

// ==================== Composed Schemas for Forms ====================

export const loginSchema = Yup.object().shape({
  email: emailSchema,
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: emailSchema,
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .matches(/^[a-zA-Z0-9._-]+$/, 'Username may use letters, numbers, dots, hyphens, and underscores'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

export const employeeFormSchema = Yup.object().shape({
  firstName: nameSchema.label('First name'),
  lastName: nameSchema.label('Last name'),
  email: emailSchema,
  phone: phoneSchema,
  department: Yup.string().required('Department is required'),
  designation: Yup.string().required('Designation is required'),
  salary: salarySchema,
  dateOfJoining: joiningDateSchema,
  status: Yup.string().oneOf(['Active', 'Inactive'], 'Status must be Active or Inactive'),
  address: addressSchema,
  emergencyContact: Yup.string()
    .matches(
      /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
      'Please enter a valid emergency contact number'
    )
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

export const attendanceSchema = Yup.object().shape({
  employeeId: employeeIdSchema,
  date: dateSchema,
  status: Yup.string()
    .oneOf(
      ['PRESENT', 'ABSENT', 'LEAVE', 'HALF_DAY'],
      'Status must be PRESENT, ABSENT, LEAVE, or HALF_DAY'
    )
    .required('Status is required'),
  checkInTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Check-in time must be in HH:MM format (24h)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  checkOutTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Check-out time must be in HH:MM format (24h)')
    .nullable()
    .transform((value) => (value === '' ? null : value)),
});

export const payrollFormSchema = Yup.object().shape({
  employeeId: employeeIdSchema,
  month: monthSchema,
  year: yearSchema,
  basicSalary: salarySchema.label('Basic salary'),
  allowances: positiveNumberSchema.label('Allowances'),
  deductions: positiveNumberSchema.label('Deductions'),
  bonus: positiveNumberSchema.label('Bonus'),
});

export const departmentFormSchema = Yup.object().shape({
  name: departmentNameSchema,
  manager: nameSchema.label('Manager'),
  location: Yup.string()
    .required('Location is required')
    .min(2, 'Location must be at least 2 characters')
    .max(200, 'Location must not exceed 200 characters')
    .trim(),
  description: descriptionSchema,
});

export const designationFormSchema = Yup.object().shape({
  title: designationTitleSchema,
  level: Yup.string()
    .required('Level is required')
    .oneOf(
      ['Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Executive'],
      'Please select a valid level'
    ),
  description: descriptionSchema,
});

export const userFormSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  role: Yup.string()
    .required('Role is required')
    .oneOf(['Admin', 'Manager', 'Employee', 'HR'], 'Please select a valid role'),
  phone: phoneSchema.notRequired().nullable().transform((value) => (value === '' ? null : value)),
});

export const roleFormSchema = Yup.object().shape({
  name: roleNameSchema,
  description: descriptionSchema,
});

export const profileUpdateSchema = Yup.object().shape({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.notRequired().nullable().transform((value) => (value === '' ? null : value)),
  address: addressSchema,
});

export const salaryStructureFormSchema = Yup.object().shape({
  basicSalary: salarySchema.label('Basic salary'),
  hra: positiveNumberSchema.label('HRA'),
  conveyance: positiveNumberSchema.label('Conveyance'),
  medical: positiveNumberSchema.label('Medical'),
  special: positiveNumberSchema.label('Special allowance'),
  pfDeduction: positiveNumberSchema.label('PF deduction'),
  taxDeduction: positiveNumberSchema.label('Tax deduction'),
});

// ==================== Error Message Formatter ====================

export const formatValidationErrors = (errors) => {
  if (!errors || Object.keys(errors).length === 0) return null;
  return Object.entries(errors).reduce((acc, [field, error]) => {
    acc[field] = error.message || 'This field is invalid';
    return acc;
  }, {});
};

