import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as employeeApi from '../services/employeeService';

// Async Thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await employeeApi.getEmployees(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employees');
    }
  }
);

export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await employeeApi.getEmployeeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch employee');
    }
  }
);

export const createEmployeeThunk = createAsyncThunk(
  'employees/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await employeeApi.createEmployee(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create employee');
    }
  }
);

export const updateEmployeeThunk = createAsyncThunk(
  'employees/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await employeeApi.updateEmployee(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update employee');
    }
  }
);

export const deleteEmployeeThunk = createAsyncThunk(
  'employees/delete',
  async (id, { rejectWithValue }) => {
    try {
      await employeeApi.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete employee');
    }
  }
);

const initialState = {
  employees: [],
  selectedEmployee: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 1,
  pageSize: 10,
  search: '',
  sortBy: 'id',
  sortOrder: 'asc',
  filters: {},
};

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },
    clearEmployeeError: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload.content || action.payload;
        state.totalPages = action.payload.totalPages || 0;
        state.totalElements = action.payload.totalElements || 0;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchEmployeeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createEmployeeThunk.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createEmployeeThunk.fulfilled, (state, action) => {
        state.createLoading = false;
        state.employees.unshift(action.payload);
      })
      .addCase(createEmployeeThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Update
      .addCase(updateEmployeeThunk.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateEmployeeThunk.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.employees.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) {
          state.employees[idx] = action.payload;
        }
        if (state.selectedEmployee?.id === action.payload.id) {
          state.selectedEmployee = action.payload;
        }
      })
      .addCase(updateEmployeeThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
      })
      // Delete
      .addCase(deleteEmployeeThunk.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteEmployeeThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.employees = state.employees.filter((e) => e.id !== action.payload);
        if (state.selectedEmployee?.id === action.payload) {
          state.selectedEmployee = null;
        }
      })
      .addCase(deleteEmployeeThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      });
  },
});

// Selectors
export const selectEmployeeState = (state) => state.employees;
export const selectEmployees = (state) => state.employees.employees;
export const selectSelectedEmployee = (state) => state.employees.selectedEmployee;
export const selectEmployeesLoading = (state) => state.employees.loading;
export const selectEmployeesError = (state) => state.employees.error;
export const selectEmployeePagination = (state) => ({
  currentPage: state.employees.currentPage,
  pageSize: state.employees.pageSize,
  totalPages: state.employees.totalPages,
  totalElements: state.employees.totalElements,
});
export const selectEmployeeSearch = (state) => state.employees.search;
export const selectEmployeeSort = (state) => ({
  sortBy: state.employees.sortBy,
  sortOrder: state.employees.sortOrder,
});
export const selectEmployeeFilters = (state) => state.employees.filters;
export const selectFilteredEmployees = createSelector(
  [selectEmployees, selectEmployeeSearch],
  (employees, search) => {
    if (!search) return employees;
    const query = search.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(query) ||
        emp.email?.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query) ||
        emp.designation?.toLowerCase().includes(query)
    );
  }
);

export const {
  setSearch,
  setSortBy,
  setSortOrder,
  setCurrentPage,
  setPageSize,
  setFilters,
  clearSelectedEmployee,
  clearEmployeeError,
} = employeeSlice.actions;

export default employeeSlice.reducer;

