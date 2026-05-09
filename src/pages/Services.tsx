import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, Tooltip
} from '@mui/material';
import { Add, Edit, Delete, Business } from '@mui/icons-material';
import { organisationService } from '../services/otherServices';
import toast from 'react-hot-toast';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState({ nom: '', description: '', type: 'SERVICE' });
  const [error, setError] = useState('');

  const fetchServices = () =>
    organisationService.getAll().then(r => setServices(r.data));

  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async () => {
    setError('');
    try {
      await organisationService.create(form);
      toast.success('Service créé');
      setOpenAdd(false);
      setForm({ nom: '', description: '', type: 'SERVICE' });
      fetchServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
  };

  const handleEdit = async () => {
    try {
      await organisationService.update(selected.id, form);
      toast.success('Service modifié');
      setOpenEdit(false);
      fetchServices();
    } catch { toast.error('Erreur'); }
  };

  const handleDelete = async () => {
    try {
      await organisationService.delete(selected.id);
      toast.success('Service supprimé');
      setOpenDelete(false);
      fetchServices();
    } catch { toast.error('Erreur'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Services
        </Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => setOpenAdd(true)}
          sx={{
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
            borderRadius: 2, fontSize: 13
          }}>
          + Ajouter service
        </Button>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['Service', 'Description', 'Type', 'Parent', 'Actions'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center"
                    sx={{ py: 4, color: '#94a3b8', fontSize: 13 }}>
                    Aucun service configuré
                  </TableCell>
                </TableRow>
              ) : services.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{
                        width: 32, height: 32, borderRadius: 2,
                        bgcolor: '#EDE9FE', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                      }}>
                        <Business sx={{ fontSize: 16, color: '#5B21B6' }} />
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                        {s.nom}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                    {s.description || '—'}
                  </TableCell>
                  <TableCell>
                    <Chip label={s.type} size="small"
                      sx={{
                        fontSize: 11, height: 20,
                        bgcolor: '#EDE9FE', color: '#5B21B6'
                      }} />
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                    {s.parentNom || '—'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Modifier">
                        <IconButton size="small" onClick={() => {
                          setSelected(s);
                          setForm({ nom: s.nom, description: s.description || '', type: s.type });
                          setOpenEdit(true);
                        }}>
                          <Edit sx={{ fontSize: 15, color: '#64748b' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton size="small" onClick={() => {
                          setSelected(s);
                          setOpenDelete(true);
                        }}>
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
          ➕ Nouveau service
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth size="small" label="Nom du service *"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Ex: Direction Générale"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField fullWidth multiline rows={2} size="small" label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Description du service..."
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAdd(false)} sx={{ color: '#64748b' }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleAdd}
            sx={{ borderRadius: 2, background: '#5B21B6' }}>
            Créer le service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modifier */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 15 }}>
          ✏️ Modifier le service
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth size="small" label="Nom du service"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField fullWidth multiline rows={2} size="small" label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: '#64748b' }}>
            Annuler
          </Button>
          <Button variant="contained" onClick={handleEdit}
            sx={{ borderRadius: 2, background: '#5B21B6' }}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Supprimer */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 15 }}>
          ⚠️ Supprimer le service
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Cette action est irréversible.
          </Alert>
          <Typography>
            Supprimer <strong>{selected?.nom}</strong> ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)} sx={{ color: '#64748b' }}>
            Annuler
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}
            sx={{ borderRadius: 2 }}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
