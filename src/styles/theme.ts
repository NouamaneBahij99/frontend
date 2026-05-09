import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#5B21B6', light: '#7C3AED', dark: '#4C1D95', contrastText: '#fff' },
    secondary: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderRadius: 12 }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600, fontSize: 12,
          color: '#64748b', backgroundColor: '#F8FAFC'
        }
      },
    },
  },
});
