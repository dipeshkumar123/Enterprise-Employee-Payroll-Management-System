import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as authApi from '../services/authService';

// Async Thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
    } catch (error) {
      // Clear local storage even if API call fails
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refreshToken } = getState().auth;
      if (!refreshToken) throw new Error('No refresh token available');
      const response = await authApi.refreshToken();
      localStorage.setItem('token', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue('Session expired. Please login again.');
    }
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.changePassword(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  loading: false,
  error: null,
  forgotPasswordLoading: false,
  forgotPasswordSuccess: false,
  changePasswordLoading: false,
  changePasswordSuccess: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      else localStorage.removeItem('refreshToken');
      if (user) localStorage.setItem('user', JSON.stringify(user));
      else localStorage.removeItem('user');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
    resetForgotPasswordState: (state) => {
      state.forgotPasswordLoading = false;
      state.forgotPasswordSuccess = false;
      state.error = null;
    },
    resetChangePasswordState: (state) => {
      state.changePasswordLoading = false;
      state.changePasswordSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      // Refresh Token
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.forgotPasswordLoading = true;
        state.forgotPasswordSuccess = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.forgotPasswordLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.forgotPasswordLoading = false;
        state.error = action.payload;
      })
      // Change Password
      .addCase(changePasswordThunk.pending, (state) => {
        state.changePasswordLoading = true;
        state.changePasswordSuccess = false;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.changePasswordLoading = false;
        state.changePasswordSuccess = true;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.changePasswordLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => !!state.auth.token && !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRoles = createSelector([selectUser], (user) => user?.roles || []);
export const selectHasRole = (role) =>
  createSelector([selectUserRoles], (roles) => roles.includes(role));
export const selectIsAdmin = createSelector([selectUserRoles], (roles) =>
  roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')
);

export const {
  setCredentials,
  logout,
  clearError,
  setUser,
  clearCredentials,
  resetForgotPasswordState,
  resetChangePasswordState,
} = authSlice.actions;

export default authSlice.reducer;

