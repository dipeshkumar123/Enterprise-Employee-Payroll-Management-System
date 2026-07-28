import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: localStorage.getItem('themeMode') || 'light',
  primaryColor: localStorage.getItem('themePrimaryColor') || '#1976d2',
  secondaryColor: localStorage.getItem('themeSecondaryColor') || '#9c27b0',
  sidebarCollapsed: JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false'),
  fontSize: localStorage.getItem('fontSize') || 'medium',
  borderRadius: parseInt(localStorage.getItem('borderRadius') || '8', 10),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', state.mode);
    },
    setThemeMode: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', state.mode);
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      localStorage.setItem('themePrimaryColor', action.payload);
    },
    setSecondaryColor: (state, action) => {
      state.secondaryColor = action.payload;
      localStorage.setItem('themeSecondaryColor', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(state.sidebarCollapsed));
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      localStorage.setItem('sidebarCollapsed', JSON.stringify(action.payload));
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
    },
    setBorderRadius: (state, action) => {
      state.borderRadius = action.payload;
      localStorage.setItem('borderRadius', action.payload.toString());
    },
    resetTheme: (state) => {
      state.mode = 'light';
      state.primaryColor = '#1976d2';
      state.secondaryColor = '#9c27b0';
      state.sidebarCollapsed = false;
      state.fontSize = 'medium';
      state.borderRadius = 8;
      localStorage.removeItem('themeMode');
      localStorage.removeItem('themePrimaryColor');
      localStorage.removeItem('themeSecondaryColor');
      localStorage.removeItem('sidebarCollapsed');
      localStorage.removeItem('fontSize');
      localStorage.removeItem('borderRadius');
    },
  },
});

// Selectors
export const selectThemeState = (state) => state.theme;
export const selectThemeMode = (state) => state.theme.mode;
export const selectIsDarkMode = (state) => state.theme.mode === 'dark';
export const selectPrimaryColor = (state) => state.theme.primaryColor;
export const selectSecondaryColor = (state) => state.theme.secondaryColor;
export const selectSidebarCollapsed = (state) => state.theme.sidebarCollapsed;
export const selectFontSize = (state) => state.theme.fontSize;
export const selectBorderRadius = (state) => state.theme.borderRadius;

export const {
  toggleTheme,
  setThemeMode,
  setPrimaryColor,
  setSecondaryColor,
  toggleSidebar,
  setSidebarCollapsed,
  setFontSize,
  setBorderRadius,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;

