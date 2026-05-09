import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Alert, Tooltip, Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Add, Edit, Delete, CheckCircle, Block } from '@mui/icons-material';
import { userService } from '../services/otherServices';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrateur', CHEF_SERVICE: 'Chef de service',
  DIRECTEUR: 'Directeur', AGENT: 'Agent'
};
const roleColors: Record<string, any> = {
  ADMIN: 'error', CHEF_SERVICE: 'warning',
  DIRECTEUR: 'info', AGENT: 'default'
};

const Utilisateurs = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '',
    password: '', role: 'AGENT', service: ''
  });
  const [error, setError] = useState('');

  const fetchUsers = () =>
    userService.getAll().then(r => setUsers(r.data.content || r.data));

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await authService.register(form);
      toast.success('Utilisateur créé');
      setOpenAdd(false);
      setForm({ nom: '', prenom: '', email: '', password: '', role: 'AGENT', service: '' });
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleToggle = async (user: any) => {
    try {
      user.enabled
        ? await userService.disable(user.id)
        : await userService.enable(user.id);
      toast.success(user.enabled ? 'Compte désactivé' : 'Compte activé');
      fetchUsers();
    } catch { toast.error('Erreur'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Utilisateurs
        </Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => setOpenAdd(true)}
          sx={{
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
            borderRadius: 2, fontSize: 13
          }}>
          + Ajouter utilisateur
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Nom', 'Email', 'Rôle', 'Statut', 'Action'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 30, height: 30, bgcolor: '#5B21B6', fontSize: 11 }}>
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                          {u.prenom} {u.nom}
                        </Typography>
                        {u.service && (
                          <Typography sx={{ fontSize: 11, color: '#64748b' }}>
                            {u.service}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: '#64748b' }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={roleLabels[u.role] || u.role}
                      color={roleColors[u.role]}
                      size="small"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={u.enabled ? 'Actif' : 'Inactif'}
                      size="small"
                      sx={{
                        fontSize: 11, height: 22,
                        bgcolor: u.enabled ? '#D1FAE5' : '#F1F5F9',
                        color: u.enabled ? '#065F46' : '#64748b'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title={u.enabled ? 'Désactiver' : 'Activer'}>
                        <IconButton size="small" onClick={() => handleToggle(u)}>
                          {u.enabled
                            ? <Block sx={{ fontSize: 15, color: '#EF4444' }} />
                            : <CheckCircle sx={{ fontSize: 15, color: '#10B981' }} />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton size="small">
                          <Edit sx={{ fontSize: 15, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small">
                          <Delete sx={{ fontSize: 15, color: '#EF4444' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog Ajouter */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 15 }}>
          Ajouter un utilisateur
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Nom *"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Prénom *"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Email *" type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Mot de passe *" type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Rôle</InputLabel>
                <Select value={form.role} label="Rôle"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  sx={{ borderRadius: 2 }}>
                  <MenuItem value="AGENT">Agent</MenuItem>
                  <MenuItem value="CHEF_SERVICE">Chef de service</MenuItem>
                  <MenuItem value="DIRECTEUR">Directeur</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth size="small" label="Service"
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: '#64748b' }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleAdd}
            sx={{ borderRadius: 2, background: '#5B21B6' }}>
            Créer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Utilisateurs;
