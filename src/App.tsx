import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { theme } from './styles/theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CourrierEntrant from './pages/CourrierEntrant';
import CourrierSortant from './pages/CourrierSortant';
import NouveauCourrier from './pages/NouveauCourrier';
import DetailCourrier from './pages/DetailCourrier';
import Archives from './pages/Archives';
import Utilisateurs from './pages/Utilisateurs';
import Organisation from './pages/Organisation';
import Workflows from './pages/Workflows';
import Notifications from './pages/Notifications';

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
      <Route path="courriers/entrant" element={<CourrierEntrant />} />
      <Route path="courriers/entrant/nouveau" element={<NouveauCourrier />} />
      <Route path="courriers/sortant" element={<CourrierSortant />} />
      <Route path="courriers/sortant/nouveau" element={<NouveauCourrier />} />
      <Route path="courriers/:id" element={<DetailCourrier />} />
      <Route path="archives" element={<Archives />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="utilisateurs" element={<AdminRoute><Utilisateurs /></AdminRoute>} />
      <Route path="parametres" element={<AdminRoute><Organisation /></AdminRoute>} />
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
          style: { borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13 }
        }} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
