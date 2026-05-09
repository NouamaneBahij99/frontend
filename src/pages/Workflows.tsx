import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem, Alert, IconButton,
  List, ListItem, Divider, Tooltip, Switch, FormControlLabel
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { workflowService, organisationService } from '../services/otherServices';
import toast from 'react-hot-toast';

const Workflows = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [noeuds, setNoeuds] = useState<any[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEtape, setOpenEtape] = useState<number | null>(null);
  const [form, setForm] = useState({
    nom: '', description: '', typeCourrier: '', defaut: false
  });
  const [etapeForm, setEtapeForm] = useState({
    nom: '', noeudId: '', roleRequis: '', obligatoire: true
  });
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur');
    }
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Workflows
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748b' }}>
            Configuration des circuits de traitement
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => setOpenCreate(true)}
          sx={{
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
            borderRadius: 2, fontSize: 13
          }}>
          Nouveau workflow
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {workflows.map((wf) => (
          <Card key={wf.id} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{wf.nom}</Typography>
                    {wf.defaut && (
                      <Chip label="Par défaut" size="small" color="primary" />
                    )}
                    {wf.typeCourrier && (
                      <Chip label={wf.typeCourrier} size="small" variant="outlined" />
                    )}
                  </Box>
                  {wf.description && (
                    <Typography sx={{ fontSize: 12, color: '#64748b', mt: 0.3 }}>
                      {wf.description}
                    </Typography>
                  )}
                </Box>
                <Tooltip title="Ajouter une étape">
                  <IconButton size="small"
                    onClick={() => setOpenEtape(wf.id)}
                    sx={{ bgcolor: '#F5F3FF', color: '#5B21B6' }}>
                    <Add fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#64748b', mb: 1 }}>
                ÉTAPES ({wf.etapes?.length || 0})
              </Typography>

              {wf.etapes?.length === 0 ? (
                <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
                  Aucune étape configurée
                </Typography>
              ) : (
                <List dense disablePadding>
                  {wf.etapes?.map((etape: any, i: number) => (
                    <ListItem key={etape.id} disablePadding
                      sx={{ mb: 0.5, bgcolor: '#F8FAFC', borderRadius: 1, px: 1 }}
                      secondaryAction={
                        <IconButton size="small"
                          onClick={() => handleDeleteEtape(wf.id, etape.id)}>
                          <Delete fontSize="small" color="error" />
                        </IconButton>
                      }>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.8, pr: 4 }}>
                        <Box sx={{
                          width: 24, height: 24, borderRadius: '50%',
                          bgcolor: '#5B21B6', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: 'white',
                          fontSize: 11, fontWeight: 700, flexShrink: 0
                        }}>
                          {i + 1}
                        </Box>
                        <Box>
                          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                            {etape.nom}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: '#64748b' }}>
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
        ))}
      </Box>

      {/* Dialog Créer workflow */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 15 }}>⚙️ Nouveau workflow</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth size="small" label="Nom *"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <TextField fullWidth multiline rows={2} size="small" label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Type de courrier (optionnel)</InputLabel>
              <Select value={form.typeCourrier}
                label="Type de courrier (optionnel)"
                onChange={(e) => setForm({ ...form, typeCourrier: e.target.value })}
                sx={{ borderRadius: 2 }}>
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="ENTRANT">Entrant</MenuItem>
                <MenuItem value="SORTANT">Sortant</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch checked={form.defaut}
                  onChange={(e) => setForm({ ...form, defaut: e.target.checked })} />
              }
              label="Workflow par défaut"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreate(false)} sx={{ color: '#64748b' }}>Annuler</Button>
          <Button variant="contained" onClick={handleCreate}
            sx={{ borderRadius: 2, background: '#5B21B6' }}>Créer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajouter étape */}
      <Dialog open={openEtape !== null} onClose={() => setOpenEtape(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontSize: 15 }}>➕ Ajouter une étape</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField fullWidth size="small" label="Nom de l'étape *"
              value={etapeForm.nom}
              onChange={(e) => setEtapeForm({ ...etapeForm, nom: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Service (noeud)</InputLabel>
              <Select value={etapeForm.noeudId}
                label="Service (noeud)"
                onChange={(e) => setEtapeForm({ ...etapeForm, noeudId: e.target.value as string })}
                sx={{ borderRadius: 2 }}>
                <MenuItem value="">Aucun</MenuItem>
                {noeuds.map(n => (
                  <MenuItem key={n.id} value={n.id}>{n.nom}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Rôle requis</InputLabel>
              <Select value={etapeForm.roleRequis}
                label="Rôle requis"
                onChange={(e) => setEtapeForm({ ...etapeForm, roleRequis: e.target.value as string })}
                sx={{ borderRadius: 2 }}>
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
          <Button onClick={() => setOpenEtape(null)} sx={{ color: '#64748b' }}>Annuler</Button>
          <Button variant="contained"
            onClick={() => openEtape && handleAddEtape(openEtape)}
            sx={{ borderRadius: 2, background: '#5B21B6' }}>Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workflows;
