import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as attendanceApi from '../services/attendanceService';

// Async Thunks
export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendance(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const markAttendanceThunk = createAsyncThunk(
  'attendance/mark',
  async (data, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.markAttendance(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark attendance');
    }
  }
);

export const updateAttendanceThunk = createAsyncThunk(
  'attendance/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.updateAttendance(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance');
    }
  }
);

export const fetchAttendanceReport = createAsyncThunk(
  'attendance/fetchReport',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getAttendanceReport(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance report');
    }
  }
);

export const fetchMonthlySummary = createAsyncThunk(
  'attendance/fetchMonthlySummary',
  async ({ year, month }, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getMonthlySummary(year, month);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly summary');
    }
  }
);

const initialState = {
  records: [],
  report: null,
  summary: null,
  loading: false,
  error: null,
  markLoading: false,
  markError: null,
  reportLoading: false,
  reportError: null,
  summaryLoading: false,
  summaryError: null,
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    clearAttendanceError: (state) => {
      state.error = null;
      state.markError = null;
      state.reportError = null;
      state.summaryError = null;
    },
    clearAttendanceRecords: (state) => {
      state.records = [];
    },
    clearSummary: (state) => {
      state.summary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.content || action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark Attendance
      .addCase(markAttendanceThunk.pending, (state) => {
        state.markLoading = true;
        state.markError = null;
      })
      .addCase(markAttendanceThunk.fulfilled, (state, action) => {
        state.markLoading = false;
        state.records.unshift(action.payload);
      })
      .addCase(markAttendanceThunk.rejected, (state, action) => {
        state.markLoading = false;
        state.markError = action.payload;
      })
      // Update Attendance
      .addCase(updateAttendanceThunk.pending, (state) => {
        state.markLoading = true;
        state.markError = null;
      })
      .addCase(updateAttendanceThunk.fulfilled, (state, action) => {
        state.markLoading = false;
        const idx = state.records.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) {
          state.records[idx] = action.payload;
        }
      })
      .addCase(updateAttendanceThunk.rejected, (state, action) => {
        state.markLoading = false;
        state.markError = action.payload;
      })
      // Fetch Report
      .addCase(fetchAttendanceReport.pending, (state) => {
        state.reportLoading = true;
        state.reportError = null;
      })
      .addCase(fetchAttendanceReport.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.report = action.payload;
      })
      .addCase(fetchAttendanceReport.rejected, (state, action) => {
        state.reportLoading = false;
        state.reportError = action.payload;
      })
      // Monthly Summary
      .addCase(fetchMonthlySummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      });
  },
});

// Selectors
export const selectAttendanceState = (state) => state.attendance;
export const selectAttendanceRecords = (state) => state.attendance.records;
export const selectAttendanceReport = (state) => state.attendance.report;
export const selectMonthlySummary = (state) => state.attendance.summary;
export const selectAttendanceLoading = (state) => state.attendance.loading;
export const selectAttendanceError = (state) => state.attendance.error;
export const selectMarkAttendanceLoading = (state) => state.attendance.markLoading;
export const selectMarkAttendanceError = (state) => state.attendance.markError;
export const selectSummaryLoading = (state) => state.attendance.summaryLoading;
export const selectReportLoading = (state) => state.attendance.reportLoading;
export const selectAttendanceSummaryByEmployee = createSelector(
  [selectAttendanceRecords, (_, employeeId) => employeeId],
  (records, employeeId) => {
    const employeeRecords = records.filter((r) => r.employeeId === employeeId);
    const present = employeeRecords.filter((r) => r.status === 'PRESENT').length;
    const absent = employeeRecords.filter((r) => r.status === 'ABSENT').length;
    const leave = employeeRecords.filter((r) => r.status === 'LEAVE').length;
    const halfDay = employeeRecords.filter((r) => r.status === 'HALF_DAY').length;
    return { total: employeeRecords.length, present, absent, leave, halfDay };
  }
);

export const {
  clearAttendanceError,
  clearAttendanceRecords,
  clearSummary,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;

