import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courriers from './pages/Courriers';
import NouveauCourrier from './pages/NouveauCourrier';
import DetailCourrier from './pages/DetailCourrier';
import Utilisateurs from './pages/Utilisateurs';
import Organisation from './pages/Organisation';
import Workflows from './pages/Workflows';
import Notifications from './pages/Notifications';

const theme = createTheme({
  palette: {
    primary: { main: '#5B21B6' },
    secondary: { main: '#7C3AED' },
    background: { default: '#F8FAFC' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }
      }
    }
  }
});

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  return isAdmin() ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="courriers" element={<Courriers />} />
      <Route path="courriers/nouveau" element={<NouveauCourrier />} />
      <Route path="courriers/:id" element={<DetailCourrier />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="utilisateurs" element={<AdminRoute><Utilisateurs /></AdminRoute>} />
      <Route path="organisation" element={<AdminRoute><Organisation /></AdminRoute>} />
      <Route path="workflows" element={<AdminRoute><Workflows /></AdminRoute>} />
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: 8, fontFamily: 'Inter, sans-serif' }
        }} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
