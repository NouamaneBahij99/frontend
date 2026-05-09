import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await authService.login(form);
      login({ ...res, accessToken: res.accessToken });
      toast.success(`Bienvenue ${res.prenom} !`);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #4F46E5 100%)'
    }}>
      <Card sx={{ width: 420, borderRadius: 3, boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '50%', mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Typography sx={{ fontSize: 28 }}>🦩</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#1e293b">
              Pélican
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Gestion Électronique du Courrier
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="Email" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={{ mb: 2 }} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>
              }}
            />
            <TextField
              fullWidth label="Mot de passe" value={form.password}
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              sx={{ mb: 3 }} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              type="submit" fullWidth variant="contained" size="large"
              disabled={loading}
              sx={{
                py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600,
                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                '&:hover': { background: 'linear-gradient(135deg, #4C1D95, #6D28D9)' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
