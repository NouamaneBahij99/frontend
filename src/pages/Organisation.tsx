import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, Alert, IconButton, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, AccountTree } from '@mui/icons-material';
import { organisationService } from '../services/otherServices';
import toast from 'react-hot-toast';

const typeColors: Record<string, any> = {
  SERVICE: 'primary', DIRECTION: 'error', DEPARTEMENT: 'warning', POSTE: 'default'
};

const Organisation = () => {
  const [noeuds, setNoeuds] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ nom: '', description: '', type: 'SERVICE', parentId: '', ordre: 0 });
  const [error, setError] = useState('');

  const fetchNoeuds = () => organisationService.getAll().then(r => setNoeuds(r.data));
  useEffect(() => { fetchNoeuds(); }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await organisationService.create({
        ...form, parentId: form.parentId ? Number(form.parentId) : null
      });
      toast.success('Service créé');
      setOpenAdd(false);
      setForm({ nom: '', description: '', type: 'SERVICE', parentId: '', ordre: 0 });
      fetchNoeuds();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
  };

  const handleEdit = async () => {
    try {
      await organisationService.update(selected.id, form);
      toast.success('Service modifié');
      setOpenEdit(false);
      fetchNoeuds();
    } catch { toast.error('Erreur'); }
  };

  const handleDelete = async () => {
    try {
      await organisationService.delete(selected.id);
      toast.success('Service désactivé');
      setOpenDelete(false);
      fetchNoeuds();
    } catch { toast.error('Erreur'); }
  };

  const openEditDialog = (n: any) => {
    setSelected(n);
    setForm({ nom: n.nom, description: n.description || '', type: n.type, parentId: n.parentId || '', ordre: n.ordre });
    setOpenEdit(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">Organigramme</Typography>
          <Typography color="text.secondary" fontSize={13}>Structure de l'organisation</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAdd(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
          Nouveau noeud
        </Button>
      </Box>

      <Grid container spacing={2}>
        {noeuds.map((n) => (
          <Grid item xs={12} sm={6} md={4} key={n.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
              borderLeft: '4px solid #5B21B6' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountTree sx={{ color: '#5B21B6', fontSize: 20 }} />
                    <Box>
                      <Typography fontWeight={600} fontSize={14}>{n.nom}</Typography>
                      {n.parentNom && (
                        <Typography fontSize={11} color="text.secondary">↳ {n.parentNom}</Typography>
                      )}
                    </Box>
                  </Box>
                  <Chip label={n.type} size="small" color={typeColors[n.type]} />
                </Box>
                {n.description && (
                  <Typography fontSize={12} color="text.secondary" mt={1}>{n.description}</Typography>
                )}
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, justifyContent: 'flex-end' }}>
                  <Tooltip title="Modifier">
                    <IconButton size="small" onClick={() => openEditDialog(n)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Désactiver">
                    <IconButton size="small" onClick={() => { setSelected(n); setOpenDelete(true); }}>
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Ajouter */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>➕ Nouveau noeud</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type"
                onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <MenuItem value="SERVICE">Service</MenuItem>
                <MenuItem value="DIRECTION">Direction</MenuItem>
                <MenuItem value="DEPARTEMENT">Département</MenuItem>
                <MenuItem value="POSTE">Poste</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Nom *" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            <TextField fullWidth multiline rows={2} label="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Noeud parent (optionnel)</InputLabel>
              <Select value={form.parentId} label="Noeud parent (optionnel)"
                onChange={(e) => setForm({ ...form, parentId: e.target.value as string })}>
                <MenuItem value="">Aucun</MenuItem>
                {noeuds.map(n => <MenuItem key={n.id} value={n.id}>{n.nom}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAdd(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleAdd}
            sx={{ background: '#5B21B6', textTransform: 'none' }}>Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modifier */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>✏️ Modifier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth label="Nom" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            <TextField fullWidth multiline rows={2} label="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleEdit}
            sx={{ background: '#5B21B6', textTransform: 'none' }}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Supprimer */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle fontWeight={600}>⚠️ Désactiver</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 1 }}>Cette action désactivera le noeud.</Alert>
          <Typography>Désactiver <strong>{selected?.nom}</strong> ?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Confirmer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Organisation;
