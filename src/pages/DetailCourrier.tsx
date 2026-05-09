import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  CircularProgress, Stepper, Step, StepLabel, StepContent, Alert,
  Divider, List, ListItem, ListItemText, IconButton, Tooltip
} from '@mui/material';
import {
  ArrowBack, CheckCircle, Cancel, Archive, PictureAsPdf,
  History, AccountTree, Edit
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const statutColors: Record<string, any> = {
  NOUVEAU: 'info', EN_COURS: 'warning', VALIDE: 'success', REJETE: 'error', ARCHIVE: 'default'
};

const DetailCourrier = () => {
  const { id } = useParams<{ id: string }>();
  const [courrier, setCourrier] = useState<any>(null);
  const [circuit, setCircuit] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const { isChef } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!id) return;
    try {
      const [courrierRes, circuitRes] = await Promise.all([
        courrierService.getById(Number(id)),
        courrierService.getCircuit(Number(id))
      ]);
      setCourrier(courrierRes.data);
      setCircuit(circuitRes.data);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleValider = async () => {
    setActionLoading(true);
    try {
      await courrierService.valider(Number(id), commentaire);
      toast.success('Courrier validé — étape suivante activée');
      setDialog(null); setCommentaire('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally { setActionLoading(false); }
  };

  const handleRejeter = async () => {
    if (!commentaire) { toast.error('Le motif est requis'); return; }
    setActionLoading(true);
    try {
      await courrierService.rejeter(Number(id), commentaire);
      toast.success('Courrier rejeté');
      setDialog(null); setCommentaire('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally { setActionLoading(false); }
  };

  const handleArchiver = async () => {
    try {
      await courrierService.archiver(Number(id));
      toast.success('Courrier archivé');
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await courrierService.getPdf(Number(id));
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `courrier-${id}.pdf`; a.click();
    } catch { toast.error('Erreur PDF'); }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  if (!courrier) return <Alert severity="error">Courrier introuvable</Alert>;

  const circuitActif = courrier.statut !== 'ARCHIVE' && courrier.statut !== 'VALIDE';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/courriers')}
            sx={{ textTransform: 'none', color: '#64748b' }}>Retour</Button>
          <Box>
            <Typography variant="h5" fontWeight={700} color="#1e293b">{courrier.objet}</Typography>
            <Typography fontSize={12} color="text.secondary" fontFamily="monospace">{courrier.numero}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="PDF"><IconButton onClick={handleDownloadPdf}><PictureAsPdf color="error" /></IconButton></Tooltip>
          {isChef() && circuitActif && (
            <>
              <Button variant="contained" color="success" startIcon={<CheckCircle />}
                onClick={() => setDialog('valider')}
                sx={{ textTransform: 'none', borderRadius: 2 }}>Valider</Button>
              <Button variant="outlined" color="error" startIcon={<Cancel />}
                onClick={() => setDialog('rejeter')}
                sx={{ textTransform: 'none', borderRadius: 2 }}>Rejeter</Button>
            </>
          )}
          {courrier.statut === 'VALIDE' && (
            <Button variant="outlined" startIcon={<Archive />} onClick={handleArchiver}
              sx={{ textTransform: 'none', borderRadius: 2 }}>Archiver</Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Infos */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Informations</Typography>
              <Grid container spacing={2}>
                {[
                  ['Statut', <Chip label={courrier.statut} color={statutColors[courrier.statut]} size="small" />],
                  ['Type', <Chip label={courrier.type} variant="outlined" size="small" />],
                  ['Priorité', courrier.priorite],
                  ['Expéditeur', courrier.expediteur],
                  ['Destinataire', courrier.destinataire],
                  ['Créé par', courrier.createurNom],
                  ['Assigné à', courrier.assigneANom || '—'],
                  ['Workflow', courrier.workflowNom || '—'],
                  ['Étape courante', courrier.etapeCouranteNom || '—'],
                  ['Créé le', dayjs(courrier.createdAt).format('DD/MM/YYYY HH:mm')],
                ].map(([label, value]) => (
                  <Grid item xs={6} key={String(label)}>
                    <Typography fontSize={11} color="text.secondary" mb={0.3}>{label}</Typography>
                    <Typography fontSize={13} fontWeight={500}>{value as any}</Typography>
                  </Grid>
                ))}
              </Grid>
              {courrier.contenu && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography fontWeight={600} mb={1}>Contenu</Typography>
                  <Typography fontSize={13} color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {courrier.contenu}
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Circuit */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AccountTree sx={{ color: '#5B21B6' }} />
                <Typography fontWeight={600}>Circuit du courrier</Typography>
              </Box>
              {circuit.length === 0 ? (
                <Typography color="text.secondary" fontSize={13}>Aucun circuit défini</Typography>
              ) : (
                <Stepper orientation="vertical" nonLinear>
                  {circuit.map((etape, i) => (
                    <Step key={i} active={etape.courante} completed={etape.statut === 'VALIDE'}>
                      <StepLabel
                        StepIconProps={{
                          style: {
                            color: etape.statut === 'VALIDE' ? '#10B981'
                              : etape.courante ? '#5B21B6'
                              : etape.statut === 'REJETE' ? '#EF4444' : '#CBD5E1'
                          }
                        }}
                      >
                        <Box>
                          <Typography fontSize={13} fontWeight={etape.courante ? 600 : 400}>
                            {etape.etapeNom}
                            {etape.courante && <Chip label="En cours" size="small" color="primary" sx={{ ml: 1, height: 18, fontSize: 10 }} />}
                          </Typography>
                          {etape.noeudNom && (
                            <Typography fontSize={11} color="text.secondary">{etape.noeudNom}</Typography>
                          )}
                        </Box>
                      </StepLabel>
                      <StepContent>
                        {etape.responsableNom && (
                          <Typography fontSize={12} color="text.secondary">👤 {etape.responsableNom}</Typography>
                        )}
                        {etape.commentaire && (
                          <Typography fontSize={12} color="text.secondary">💬 {etape.commentaire}</Typography>
                        )}
                        {etape.dateTraitement && (
                          <Typography fontSize={11} color="text.secondary">
                            📅 {dayjs(etape.dateTraitement).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              )}
            </CardContent>
          </Card>

          {/* Historique */}
          {courrier.historiques && courrier.historiques.length > 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', mt: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <History sx={{ color: '#5B21B6' }} />
                  <Typography fontWeight={600}>Historique</Typography>
                </Box>
                <List dense disablePadding>
                  {courrier.historiques.slice(-5).reverse().map((h: any) => (
                    <ListItem key={h.id} disablePadding sx={{ mb: 1 }}>
                      <ListItemText
                        primary={<Typography fontSize={12} fontWeight={500}>{h.action} — {h.userNom}</Typography>}
                        secondary={<>
                          {h.commentaire && <Typography fontSize={11}>{h.commentaire}</Typography>}
                          <Typography fontSize={11} color="text.secondary">
                            {dayjs(h.date).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        </>}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Dialog Valider */}
      <Dialog open={dialog === 'valider'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>✅ Valider le courrier</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" mb={2} fontSize={14}>
            Cette validation fera avancer le courrier à l'étape suivante du workflow.
          </Typography>
          <TextField fullWidth multiline rows={3} label="Commentaire (optionnel)"
            value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(null)}>Annuler</Button>
          <Button variant="contained" color="success" onClick={handleValider} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Confirmer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Rejeter */}
      <Dialog open={dialog === 'rejeter'} onClose={() => setDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={600}>❌ Rejeter le courrier</DialogTitle>
        <DialogContent>
          <TextField fullWidth required multiline rows={3} label="Motif du rejet *"
            value={commentaire} onChange={(e) => setCommentaire(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(null)}>Annuler</Button>
          <Button variant="contained" color="error" onClick={handleRejeter} disabled={actionLoading}>
            {actionLoading ? <CircularProgress size={20} /> : 'Rejeter'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailCourrier;
