import { lazy, Suspense, useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material';
import { store } from './store';

const AppRoutes = lazy(() => import('./routes/AppRoutes'));

// Optimized QueryClient with sensible caching defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,        // 5 minutes before data considered stale
      cacheTime: 30 * 60 * 1000,       // 30 minutes cache retention
      retry: 2,                         // Retry failed requests twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,      // Disable refetch on window focus
      refetchOnReconnect: true,         // Refetch on reconnection
      keepPreviousData: true,           // Keep previous data while fetching new page
      refetchInterval: false,           // No auto-refetching
    },
    mutations: {
      retry: 1,
    },
  },
});

function MainApp() {
  const mode = useSelector((state) => state.theme.mode);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#0a2540',
        light: '#1e3d59',
        dark: '#05162b',
      },
      secondary: {
        main: '#00d4b2',
      },
      background: {
        default: mode === 'light' ? '#f8f9fa' : '#0e1e38',
        paper: mode === 'light' ? '#ffffff' : '#15294a',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h6: { fontWeight: 600, letterSpacing: '-0.01em' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress size={60} />
        </Box>
      }>
        <AppRoutes />
      </Suspense>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
