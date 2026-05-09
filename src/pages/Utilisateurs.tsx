import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Select,
  MenuItem, FormControl, InputLabel, Grid, Alert, Tooltip, Avatar
} from '@mui/material';
import { Add, Edit, Block, CheckCircle } from '@mui/icons-material';
import { userService } from '../services/otherServices';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const Utilisateurs = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', password: '', role: 'AGENT', service: '' });
  const [error, setError] = useState('');

  const fetchUsers = () => userService.getAll().then(r => setUsers(r.data.content || r.data));

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
      user.enabled ? await userService.disable(user.id) : await userService.enable(user.id);
      toast.success(user.enabled ? 'Compte désactivé' : 'Compte activé');
      fetchUsers();
    } catch { toast.error('Erreur'); }
  };

  const roleColors: Record<string, any> = {
    ADMIN: 'error', CHEF_SERVICE: 'warning', DIRECTEUR: 'info', AGENT: 'default'
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1e293b">Utilisateurs</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
          Nouvel utilisateur
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Utilisateur', 'Email', 'Rôle', 'Service', 'Statut', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#5B21B6', fontSize: 13 }}>
                        {u.prenom?.[0]}{u.nom?.[0]}
                      </Avatar>
                      <Typography fontSize={13} fontWeight={500}>{u.prenom} {u.nom}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography fontSize={13}>{u.email}</Typography></TableCell>
                  <TableCell><Chip label={u.role} size="small" color={roleColors[u.role]} /></TableCell>
                  <TableCell><Typography fontSize={13}>{u.service || '—'}</Typography></TableCell>
                  <TableCell>
                    <Chip label={u.enabled ? 'Actif' : 'Inactif'} size="small"
                      color={u.enabled ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={u.enabled ? 'Désactiver' : 'Activer'}>
                      <IconButton size="small" onClick={() => handleToggle(u)}>
                        {u.enabled ? <Block fontSize="small" color="error" /> : <CheckCircle fontSize="small" color="success" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>➕ Nouvel utilisateur</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Nom *" value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Prénom *" value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email *" type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Mot de passe *" type="password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Rôle</InputLabel>
                <Select value={form.role} label="Rôle" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <MenuItem value="AGENT">Agent</MenuItem>
                  <MenuItem value="CHEF_SERVICE">Chef de service</MenuItem>
                  <MenuItem value="DIRECTEUR">Directeur</MenuItem>
                  <MenuItem value="ADMIN">Administrateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Service" value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAdd(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAdd}
            sx={{ background: '#5B21B6', textTransform: 'none' }}>Créer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Utilisateurs;
