import React, { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  Alert, Checkbox, FormControlLabel, InputAdornment,
  IconButton, CircularProgress, Link
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
      toast.success('Bienvenue ' + res.prenom + ' !');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #F1F5F9 0%, #E8EAF6 100%)'
    }}>
      <Card sx={{ width: 400, borderRadius: 3, boxShadow: '0 8px 32px rgba(91,33,182,0.12)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 1.5, mb: 1
            }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Typography sx={{ fontSize: 22 }}>✉️</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 20, color: '#1e293b', lineHeight: 1.1 }}>
                  Sama Courrier
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#5B21B6', fontWeight: 500 }}>
                  by magentatechno
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: 13, color: '#64748b', mt: 1 }}>
              Connectez-vous à votre compte
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                Email
              </Typography>
              <TextField fullWidth size="small" type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email" required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: 16 }}>📧</Typography>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                Mot de passe
              </Typography>
              <TextField fullWidth size="small"
                value={form.password}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Mot de passe" required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ fontSize: 16 }}>🔒</Typography>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword
                          ? <VisibilityOff fontSize="small" />
                          : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', mb: 3
            }}>
              <FormControlLabel
                control={
                  <Checkbox size="small" checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    sx={{ color: '#5B21B6', '&.Mui-checked': { color: '#5B21B6' } }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: 12, color: '#64748b' }}>
                    Se souvenir de moi
                  </Typography>
                }
              />
              <Link href="#" sx={{
                fontSize: 12, color: '#5B21B6',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}>
                <span
                  onClick={() => alert('Pour réinitialiser votre mot de passe, contactez votre administrateur : admin@pelican.sn')}
                  style={{ cursor: 'pointer', color: '#5B21B6', fontSize: 13 }}>
                  Mot de passe oublié ?
                </span>
              </Link>
            </Box>

            <Button type="submit" fullWidth variant="contained"
              size="large" disabled={loading}
              sx={{
                py: 1.3, borderRadius: 2, fontWeight: 600,
                background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                '&:hover': { background: 'linear-gradient(135deg, #4C1D95, #6D28D9)' }
              }}>
              {loading
                ? <CircularProgress size={20} color="inherit" />
                : 'Se connecter'}
            </Button>
          </form>

          <Typography sx={{ textAlign: 'center', mt: 3, fontSize: 11, color: '#94a3b8' }}>
            © 2026 Sama Courrier · Tous droits réservés
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
