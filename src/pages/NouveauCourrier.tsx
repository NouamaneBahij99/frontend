import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert,
  CircularProgress, Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { ArrowBack, AttachFile, Send } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import { organisationService } from '../services/otherServices';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const NouveauCourrier = () => {
  const location = useLocation();
  const isSortant = location.pathname.includes('sortant');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    objet: '', contenu: '', expediteur: '', destinataire: '',
    type: isSortant ? 'SORTANT' : 'ENTRANT', priorite: 'NORMALE'
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    organisationService.getAll().then(r => setServices(r.data || [])).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('courrier', new Blob(
        [JSON.stringify(form)], { type: 'application/json' }
      ));
      if (file) formData.append('file', file);
      const res = await courrierService.create(formData);
      toast.success('Courrier ' + res.data.numero + ' créé avec succès !');
      const target = isSortant ? '/courriers/sortant' : '/courriers/entrant';
      setTimeout(() => navigate(target), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button startIcon={<ArrowBack />}
          onClick={() => navigate(isSortant ? '/courriers/sortant' : '/courriers/entrant')}
          sx={{ color: '#64748b', textTransform: 'none', fontSize: 13 }}>
          Retour
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {isSortant ? 'Nouveau courrier sortant' : 'Nouveau courrier entrant'}
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, maxWidth: 700 }}>
        <CardContent sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Date de réception *
                </Typography>
                <TextField fullWidth size="small" type="date"
                  defaultValue={dayjs().format('YYYY-MM-DD')}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Expéditeur *
                </Typography>
                <TextField fullWidth size="small"
                  value={form.expediteur}
                  onChange={(e) => setForm({ ...form, expediteur: e.target.value })}
                  placeholder="Nom ou structure de l'expéditeur" required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={8}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Objet *
                </Typography>
                <TextField fullWidth size="small"
                  value={form.objet}
                  onChange={(e) => setForm({ ...form, objet: e.target.value })}
                  placeholder="Objet du courrier" required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Type / Priorité
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={form.priorite}
                    onChange={(e) => setForm({ ...form, priorite: e.target.value })}
                    sx={{ borderRadius: 2 }}>
                    <MenuItem value="BASSE">Basse</MenuItem>
                    <MenuItem value="NORMALE">Normal</MenuItem>
                    <MenuItem value="HAUTE">Haute</MenuItem>
                    <MenuItem value="URGENTE">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Service destinataire *
                </Typography>
                <FormControl fullWidth size="small" required>
                  <Select
                    value={form.destinataire}
                    onChange={(e) => setForm({ ...form, destinataire: e.target.value })}
                    displayEmpty
                    sx={{ borderRadius: 2 }}>
                    <MenuItem value="" disabled>Sélectionner un service</MenuItem>
                    {services.map((s: any) => (
                      <MenuItem key={s.id} value={s.nom}>{s.nom}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Contenu / Résumé
                </Typography>
                <TextField fullWidth multiline rows={3} size="small"
                  value={form.contenu}
                  onChange={(e) => setForm({ ...form, contenu: e.target.value })}
                  placeholder="Description ou résumé du courrier..."
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5, color: '#374151' }}>
                  Document
                </Typography>
                <Box
                  onClick={() => document.getElementById('file-upload')?.click()}
                  sx={{
                    border: '2px dashed #E2E8F0', borderRadius: 2,
                    p: 3, textAlign: 'center', cursor: 'pointer',
                    bgcolor: '#FAFAFA',
                    '&:hover': { borderColor: '#5B21B6', bgcolor: '#F5F3FF' }
                  }}>
                  <input id="file-upload" type="file" hidden
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <AttachFile sx={{ color: '#94a3b8', mb: 0.5 }} />
                  <Typography sx={{ fontSize: 13, color: '#94a3b8' }}>
                    {file ? file.name : 'Cliquez pour ajouter ou glissez un fichier ici'}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: '#cbd5e1', mt: 0.3 }}>
                    PDF, JPG, PNG (Max. 10 Mo)
                  </Typography>
                  {file && (
                    <Chip label={file.name} onDelete={() => setFile(null)}
                      size="small" sx={{ mt: 1 }} />
                  )}
                </Box>
              </Grid>

            </Grid>

            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => navigate(-1)}
                sx={{ borderRadius: 2, color: '#64748b', borderColor: '#E2E8F0' }}>
                Annuler
              </Button>
              <Button type="submit" variant="contained"
                startIcon={loading
                  ? <CircularProgress size={14} color="inherit" />
                  : <Send />}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #5B21B6, #7C3AED)'
                }}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NouveauCourrier;
