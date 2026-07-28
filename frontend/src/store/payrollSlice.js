import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as payrollApi from '../services/payrollService';

// Async Thunks
export const fetchPayrolls = createAsyncThunk(
  'payroll/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await payrollApi.getPayroll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll records');
    }
  }
);

export const generatePayrollThunk = createAsyncThunk(
  'payroll/generate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await payrollApi.generatePayroll(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate payroll');
    }
  }
);

export const fetchSalaryStructure = createAsyncThunk(
  'payroll/fetchSalaryStructure',
  async (_, { rejectWithValue }) => {
    try {
      const response = await payrollApi.getSalaryStructure();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch salary structure');
    }
  }
);

export const updateSalaryStructureThunk = createAsyncThunk(
  'payroll/updateSalaryStructure',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await payrollApi.updateSalaryStructure(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update salary structure');
    }
  }
);

export const fetchPayslip = createAsyncThunk(
  'payroll/fetchPayslip',
  async (id, { rejectWithValue }) => {
    try {
      const response = await payrollApi.getPayslip(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payslip');
    }
  }
);

export const fetchPayrollHistory = createAsyncThunk(
  'payroll/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await payrollApi.getPayrollHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payroll history');
    }
  }
);

const initialState = {
  payrolls: [],
  payslips: [],
  selectedPayroll: null,
  selectedPayslip: null,
  salaryStructure: null,
  loading: false,
  error: null,
  generateLoading: false,
  generateError: null,
  salaryStructureLoading: false,
  salaryStructureError: null,
  payslipLoading: false,
  payslipError: null,
  historyLoading: false,
  historyError: null,
};

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    clearPayrollError: (state) => {
      state.error = null;
      state.generateError = null;
      state.salaryStructureError = null;
      state.payslipError = null;
      state.historyError = null;
    },
    clearSelectedPayroll: (state) => {
      state.selectedPayroll = null;
    },
    clearSelectedPayslip: (state) => {
      state.selectedPayslip = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payrolls
      .addCase(fetchPayrolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayrolls.fulfilled, (state, action) => {
        state.loading = false;
        state.payrolls = action.payload.content || action.payload;
      })
      .addCase(fetchPayrolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Generate Payroll
      .addCase(generatePayrollThunk.pending, (state) => {
        state.generateLoading = true;
        state.generateError = null;
      })
      .addCase(generatePayrollThunk.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.payrolls.unshift(action.payload);
        state.selectedPayroll = action.payload;
      })
      .addCase(generatePayrollThunk.rejected, (state, action) => {
        state.generateLoading = false;
        state.generateError = action.payload;
      })
      // Fetch Salary Structure
      .addCase(fetchSalaryStructure.pending, (state) => {
        state.salaryStructureLoading = true;
        state.salaryStructureError = null;
      })
      .addCase(fetchSalaryStructure.fulfilled, (state, action) => {
        state.salaryStructureLoading = false;
        state.salaryStructure = action.payload;
      })
      .addCase(fetchSalaryStructure.rejected, (state, action) => {
        state.salaryStructureLoading = false;
        state.salaryStructureError = action.payload;
      })
      // Update Salary Structure
      .addCase(updateSalaryStructureThunk.pending, (state) => {
        state.salaryStructureLoading = true;
        state.salaryStructureError = null;
      })
      .addCase(updateSalaryStructureThunk.fulfilled, (state, action) => {
        state.salaryStructureLoading = false;
        state.salaryStructure = action.payload;
      })
      .addCase(updateSalaryStructureThunk.rejected, (state, action) => {
        state.salaryStructureLoading = false;
        state.salaryStructureError = action.payload;
      })
      // Fetch Payslip
      .addCase(fetchPayslip.pending, (state) => {
        state.payslipLoading = true;
        state.payslipError = null;
      })
      .addCase(fetchPayslip.fulfilled, (state, action) => {
        state.payslipLoading = false;
        state.selectedPayslip = action.payload;
        if (!state.payslips.find((p) => p.id === action.payload.id)) {
          state.payslips.push(action.payload);
        }
      })
      .addCase(fetchPayslip.rejected, (state, action) => {
        state.payslipLoading = false;
        state.payslipError = action.payload;
      })
      // Fetch Payroll History
      .addCase(fetchPayrollHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchPayrollHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.payrolls = action.payload.content || action.payload;
      })
      .addCase(fetchPayrollHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      });
  },
});

// Selectors
export const selectPayrollState = (state) => state.payroll;
export const selectPayrolls = (state) => state.payroll.payrolls;
export const selectPayslips = (state) => state.payroll.payslips;
export const selectSelectedPayroll = (state) => state.payroll.selectedPayroll;
export const selectSelectedPayslip = (state) => state.payroll.selectedPayslip;
export const selectSalaryStructure = (state) => state.payroll.salaryStructure;
export const selectPayrollLoading = (state) => state.payroll.loading;
export const selectPayrollError = (state) => state.payroll.error;
export const selectGeneratePayrollLoading = (state) => state.payroll.generateLoading;
export const selectGeneratePayrollError = (state) => state.payroll.generateError;
export const selectSalaryStructureLoading = (state) => state.payroll.salaryStructureLoading;
export const selectPayslipLoading = (state) => state.payroll.payslipLoading;
export const selectHistoryLoading = (state) => state.payroll.historyLoading;
export const selectPayrollByEmployee = createSelector(
  [selectPayrolls, (_, employeeId) => employeeId],
  (payrolls, employeeId) => payrolls.filter((p) => p.employeeId === employeeId)
);
export const selectPayrollByMonth = createSelector(
  [selectPayrolls, (_, year, month) => ({ year, month })],
  (payrolls, { year, month }) =>
    payrolls.filter((p) => p.year === year && p.month === month)
);
export const selectTotalPayrollAmount = createSelector([selectPayrolls], (payrolls) =>
  payrolls.reduce((sum, p) => sum + (p.netPay || 0), 0)
);

export const {
  clearPayrollError,
  clearSelectedPayroll,
  clearSelectedPayslip,
} = payrollSlice.actions;

export default payrollSlice.reducer;

