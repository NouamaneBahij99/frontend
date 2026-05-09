import { createTheme } from '@mui/material/styles';

export const getTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: '#5B21B6',
      light: '#7C3AED',
      dark: '#4C1D95',
    },
    secondary: {
      main: '#8B5CF6',
    },
    success: { main: '#10B981' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    background: {
      default: darkMode ? '#0F172A' : '#F9FAFB',
      paper: darkMode ? '#1E293B' : '#FFFFFF',
    },
    text: {
      primary: darkMode ? '#F1F5F9' : '#1F2937',
      secondary: darkMode ? '#94A3B8' : '#6B7280',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: darkMode
            ? '0 1px 3px rgba(0,0,0,0.4)'
            : '0 1px 3px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: darkMode ? '#334155' : '#E5E7EB',
        },
      },
    },
  },
});

// Export aussi le theme par défaut
export const theme = getTheme(false);
