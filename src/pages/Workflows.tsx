import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  Alert, IconButton, List, ListItem, ListItemText, Divider,
  FormControl, InputLabel, Select, MenuItem, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import { Add, Delete, DragIndicator, Settings } from '@mui/icons-material';
import { workflowService, organisationService } from '../services/otherServices';
import toast from 'react-hot-toast';

const Workflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [noeuds, setNoeuds] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEtape, setOpenEtape] = useState<number | null>(null);
  const [form, setForm] = useState({ nom: '', description: '', typeCourrier: '', defaut: false });
  const [etapeForm, setEtapeForm] = useState({ nom: '', noeudId: '', roleRequis: '', obligatoire: true });
  const [error, setError] = useState('');

  const fetchData = () => {
    workflowService.getAll().then(r => setWorkflows(r.data));
    organisationService.getAll().then(r => setNoeuds(r.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async () => {
    setError('');
    try {
      await workflowService.create({ ...form, etapes: [] });
      toast.success('Workflow créé');
      setOpenCreate(false);
      setForm({ nom: '', description: '', typeCourrier: '', defaut: false });
      fetchData();
    } catch (err: any) { setError(err.response?.data?.message || 'Erreur'); }
  };

  const handleAddEtape = async (workflowId: number) => {
    try {
      await workflowService.ajouterEtape(workflowId, {
        ...etapeForm,
        noeudId: etapeForm.noeudId ? Number(etapeForm.noeudId) : null
      });
      toast.success('Étape ajoutée');
      setOpenEtape(null);
      setEtapeForm({ nom: '', noeudId: '', roleRequis: '', obligatoire: true });
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const handleDeleteEtape = async (workflowId: number, etapeId: number) => {
    try {
      await workflowService.supprimerEtape(workflowId, etapeId);
      toast.success('Étape supprimée');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1e293b">Workflows</Typography>
          <Typography color="text.secondary" fontSize={13}>Configuration des circuits de traitement</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpenCreate(true)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
          Nouveau workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workflows.map((wf) => (
          <Grid item xs={12} md={6} key={wf.id}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography fontWeight={600}>{wf.nom}</Typography>
                      {wf.defaut && <Chip label="Par défaut" size="small" color="primary" />}
                    </Box>
                    {wf.description && <Typography fontSize={12} color="text.secondary">{wf.description}</Typography>}
                    {wf.typeCourrier && <Chip label={wf.typeCourrier} size="small" variant="outlined" sx={{ mt: 0.5 }} />}
                  </Box>
                  <Tooltip title="Ajouter une étape">
                    <IconButton size="small" onClick={() => setOpenEtape(wf.id)}
                      sx={{ bgcolor: '#F5F3FF', color: '#5B21B6' }}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography fontSize={12} fontWeight={600} color="text.secondary" mb={1}>
                  ÉTAPES ({wf.etapes?.length || 0})
                </Typography>

                {wf.etapes?.length === 0 ? (
                  <Typography fontSize={12} color="text.secondary">Aucune étape configurée</Typography>
                ) : (
                  <List dense disablePadding>
                    {wf.etapes?.map((etape: any, i: number) => (
                      <ListItem key={etape.id} disablePadding
                        sx={{ mb: 0.5, bgcolor: '#F8FAFC', borderRadius: 1, px: 1 }}
                        secondaryAction={
                          <IconButton size="small" onClick={() => handleDeleteEtape(wf.id, etape.id)}>
                            <Delete fontSize="small" color="error" />
                          </IconButton>
                        }>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5, pr: 4 }}>
                          <Box sx={{
                            width: 22, height: 22, borderRadius: '50%', bgcolor: '#5B21B6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0
                          }}>{i + 1}</Box>
                          <Box>
                            <Typography fontSize={13} fontWeight={500}>{etape.nom}</Typography>
                            <Typography fontSize={11} color="text.secondary">
                              {etape.noeudNom || etape.roleRequis || '—'}
                            </Typography>
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog Créer workflow */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>⚙️ Nouveau workflow</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth label="Nom *" value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            <TextField fullWidth multiline rows={2} label="Description"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Type de courrier (optionnel)</InputLabel>
              <Select value={form.typeCourrier} label="Type de courrier (optionnel)"
                onChange={(e) => setForm({ ...form, typeCourrier: e.target.value })}>
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="ENTRANT">Entrant</MenuItem>
                <MenuItem value="SORTANT">Sortant</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel control={
              <Switch checked={form.defaut} onChange={(e) => setForm({ ...form, defaut: e.target.checked })} />
            } label="Workflow par défaut" />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreate(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleCreate}
            sx={{ background: '#5B21B6', textTransform: 'none' }}>Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajouter étape */}
      <Dialog open={openEtape !== null} onClose={() => setOpenEtape(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>➕ Ajouter une étape</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth label="Nom de l'étape *" value={etapeForm.nom}
              onChange={(e) => setEtapeForm({ ...etapeForm, nom: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Service (noeud)</InputLabel>
              <Select value={etapeForm.noeudId} label="Service (noeud)"
                onChange={(e) => setEtapeForm({ ...etapeForm, noeudId: e.target.value as string })}>
                <MenuItem value="">Aucun</MenuItem>
                {noeuds.map(n => <MenuItem key={n.id} value={n.id}>{n.nom}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Rôle requis</InputLabel>
              <Select value={etapeForm.roleRequis} label="Rôle requis"
                onChange={(e) => setEtapeForm({ ...etapeForm, roleRequis: e.target.value as string })}>
                <MenuItem value="">Aucun</MenuItem>
                <MenuItem value="AGENT">Agent</MenuItem>
                <MenuItem value="CHEF_SERVICE">Chef de service</MenuItem>
                <MenuItem value="DIRECTEUR">Directeur</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEtape(null)}>Annuler</Button>
          <Button variant="contained" onClick={() => openEtape && handleAddEtape(openEtape)}
            sx={{ background: '#5B21B6', textTransform: 'none' }}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workflows;
