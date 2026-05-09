import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Grid, Alert,
  CircularProgress, Chip
} from '@mui/material';
import { ArrowBack, Send, AttachFile } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import toast from 'react-hot-toast';

const NouveauCourrier = () => {
  const [form, setForm] = useState({
    objet: '', contenu: '', expediteur: '', destinataire: '',
    type: 'ENTRANT', priorite: 'NORMALE'
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('courrier', new Blob([JSON.stringify(form)], { type: 'application/json' }));
      if (file) formData.append('file', file);
      const res = await courrierService.create(formData);
      toast.success(`Courrier ${res.data.numero} créé avec succès !`);
      navigate(`/courriers/${res.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/courriers')}
          sx={{ textTransform: 'none', color: '#64748b' }}>
          Retour
        </Button>
        <Typography variant="h5" fontWeight={700} color="#1e293b">Nouveau courrier</Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', maxWidth: 800 }}>
        <CardContent sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select value={form.type} label="Type"
                    onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <MenuItem value="ENTRANT">📥 Entrant</MenuItem>
                    <MenuItem value="SORTANT">📤 Sortant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priorité</InputLabel>
                  <Select value={form.priorite} label="Priorité"
                    onChange={(e) => setForm({ ...form, priorite: e.target.value })}>
                    <MenuItem value="BASSE">🟢 Basse</MenuItem>
                    <MenuItem value="NORMALE">🔵 Normale</MenuItem>
                    <MenuItem value="HAUTE">🟡 Haute</MenuItem>
                    <MenuItem value="URGENTE">🔴 Urgente</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth required label="Objet *" value={form.objet}
                  onChange={(e) => setForm({ ...form, objet: e.target.value })}
                  placeholder="Objet du courrier" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Expéditeur *" value={form.expediteur}
                  onChange={(e) => setForm({ ...form, expediteur: e.target.value })}
                  placeholder="Nom de l'expéditeur" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth required label="Destinataire *" value={form.destinataire}
                  onChange={(e) => setForm({ ...form, destinataire: e.target.value })}
                  placeholder="Nom du destinataire" />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Contenu" value={form.contenu}
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  placeholder="Description ou contenu du courrier..." />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{
                  border: '2px dashed #E2E8F0', borderRadius: 2, p: 3,
                  textAlign: 'center', cursor: 'pointer',
                  '&:hover': { borderColor: '#5B21B6', bgcolor: '#F5F3FF' }
                }}
                  onClick={() => document.getElementById('file-input')?.click()}>
                  <input id="file-input" type="file" hidden
                    onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <AttachFile sx={{ color: '#94a3b8', mb: 1 }} />
                  <Typography color="text.secondary" fontSize={14}>
                    {file ? file.name : 'Cliquez pour joindre un document'}
                  </Typography>
                  {file && (
                    <Chip label={file.name} onDelete={() => setFile(null)} size="small" sx={{ mt: 1 }} />
                  )}
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate('/courriers')}
                sx={{ textTransform: 'none', borderRadius: 2 }}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Send />}
                disabled={loading}
                sx={{
                  textTransform: 'none', borderRadius: 2, fontWeight: 600,
                  background: 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                }}>
                {loading ? 'Envoi...' : 'Créer le courrier'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NouveauCourrier;
