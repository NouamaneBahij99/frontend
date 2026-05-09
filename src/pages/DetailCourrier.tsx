import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, IconButton,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ArrowBack, Download, CheckCircle, Cancel, SwapHoriz,
  AssignmentInd, PictureAsPdf, RadioButtonUnchecked
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { courrierService } from '../services/courrierService';
import toast from 'react-hot-toast';

const DetailCourrier: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [courrier, setCourrier] = useState<any>(null);
  const [circuit, setCircuit] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');

  useEffect(() => {
    if (id) { loadCourrier(); loadUsers(); }
  }, [id]); // eslint-disable-line

  const loadCourrier = async () => {
    try {
      const [res, circuitRes] = await Promise.all([
        courrierService.getById(Number(id)),
        courrierService.getCircuit(Number(id)).catch(() => ({ data: [] }))
      ]);
      setCourrier(res.data);
      setCircuit(circuitRes.data || []);
    } catch { toast.error('Erreur chargement'); }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get('/users?size=50');
      setUsers(res.data.content || []);
    } catch { console.error('Erreur users'); }
  };

  const handleAction = async (action: string) => {
    try {
      if (action === 'affecter') await courrierService.affecter(Number(id), Number(selectedUserId));
      if (action === 'transferer') await courrierService.transferer(Number(id), Number(selectedUserId), commentaire);
      if (action === 'valider') await courrierService.valider(Number(id), commentaire);
      if (action === 'rejeter') await courrierService.rejeter(Number(id), commentaire);
      toast.success('Action effectuée !');
      setOpenDialog(''); setCommentaire(''); setSelectedUserId('');
      loadCourrier();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await courrierService.getPdf(Number(id));
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `courrier-${id}.pdf`; a.click();
    } catch { toast.error('Erreur PDF'); }
  };

  if (!courrier) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  const getStatusStyle = (s: string) => ({
    NOUVEAU: { bg: '#FEF3C7', color: '#D97706' },
    EN_COURS: { bg: '#DBEAFE', color: '#1D4ED8' },
    VALIDE:   { bg: '#D1FAE5', color: '#059669' },
    REJETE:   { bg: '#FEE2E2', color: '#DC2626' },
    ARCHIVE:  { bg: '#F3F4F6', color: '#6B7280' },
  } as any)[s] || { bg: '#F3F4F6', color: '#6B7280' };

  const style = getStatusStyle(courrier.statut);

  const workflowSteps = circuit.length > 0
    ? circuit.map((e: any, i: number) => ({
        num: i + 1,
        role: e.etapeNom,
        completed: e.statut === 'VALIDE',
        current: e.courante,
        rejected: e.statut === 'REJETE',
        name: e.responsableNom || 'En attente',
        date: e.dateTraitement,
      }))
    : [
        { num: 1, role: 'Secrétaire', completed: true, current: false, rejected: false, name: courrier.createurNom, date: courrier.createdAt },
        { num: 2, role: 'Chef de service', completed: false, current: courrier.statut === 'EN_COURS', rejected: false, name: courrier.assigneANom || 'En attente', date: null },
        { num: 3, role: 'Directeur', completed: courrier.statut === 'VALIDE', current: false, rejected: false, name: 'En attente', date: null },
      ];

  return (
    <Box>
      {/* ===== CARTE 5 : DETAIL ===== */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}
              sx={{ color: '#6B7280', textTransform: 'none', mr: 2 }}>
              Retour
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
              Courrier N°{String(courrier.id).padStart(5, '0')}
            </Typography>
            <Box sx={{
              px: 2, py: 0.5, borderRadius: 5,
              bgcolor: style.bg, color: style.color,
              fontWeight: 600, fontSize: 13
            }}>
              {courrier.statut}
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Infos générales */}
            <Grid item xs={12} md={7}>
              <Box sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Informations générales
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {[
                    ['Expéditeur :', courrier.expediteur],
                    ['Objet :', courrier.objet],
                    ['Date de réception :', new Date(courrier.createdAt).toLocaleString('fr-FR')],
                    ['Service destinataire :', courrier.destinataire],
                    ['Priorité :', courrier.priorite],
                    ['Assigné à :', courrier.assigneANom || '—'],
                    ['Workflow :', courrier.workflowNom || '—'],
                  ].map(([label, value]) => (
                    <Box key={String(label)} sx={{ display: 'flex', gap: 1 }}>
                      <Typography sx={{ minWidth: 180, color: '#6B7280', fontSize: 13 }}>{label}</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
                {courrier.fichierNom && (
                  <Box sx={{ mt: 2, p: 2, border: '1px solid #E5E7EB', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <PictureAsPdf sx={{ color: '#DC2626', fontSize: 32 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{courrier.fichierNom}</Typography>
                    </Box>
                    <IconButton onClick={handleDownloadPdf} size="small">
                      <Download />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Historique */}
            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Historique de traitement
                </Typography>
                {courrier.historiques?.slice(0, 6).map((h: any, i: number) => (
                  <Box key={h.id} sx={{ display: 'flex', mb: 2.5, position: 'relative' }}>
                    <Box sx={{ mr: 2, position: 'relative', flexShrink: 0 }}>
                      {['CREATION','AFFECTATION','VALIDATION'].includes(h.action)
                        ? <CheckCircle sx={{ color: '#10B981', fontSize: 24 }} />
                        : h.action === 'TRANSFERT'
                        ? <CheckCircle sx={{ color: '#3B82F6', fontSize: 24 }} />
                        : h.action === 'REJET'
                        ? <Cancel sx={{ color: '#EF4444', fontSize: 24 }} />
                        : <RadioButtonUnchecked sx={{ color: '#9CA3AF', fontSize: 24 }} />
                      }
                      {i < (courrier.historiques.length - 1) && (
                        <Box sx={{ position: 'absolute', left: 11, top: 24, width: 2, height: 32, bgcolor: '#E5E7EB' }} />
                      )}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                        {new Date(h.date).toLocaleString('fr-FR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </Typography>
                      <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
                        {h.action === 'CREATION' ? 'Reçu par'
                          : h.action === 'TRANSFERT' ? 'Transféré à'
                          : h.action === 'VALIDATION' ? 'Validé par'
                          : h.action === 'REJET' ? 'Rejeté par'
                          : h.action}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{h.userNom}</Typography>
                      {h.commentaire && (
                        <Typography sx={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic' }}>
                          "{h.commentaire}"
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                {(!courrier.historiques || courrier.historiques.length === 0) && (
                  <Box sx={{ display: 'flex' }}>
                    <RadioButtonUnchecked sx={{ color: '#9CA3AF', fontSize: 24, mr: 2 }} />
                    <Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 600 }}>En attente</Typography>
                      <Typography sx={{ fontSize: 12, color: '#6B7280' }}>Directeur Général</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Boutons d'action */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<AssignmentInd />}
              onClick={() => setOpenDialog('affecter')}
              sx={{ bgcolor: '#7C3AED', px: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Affecter
            </Button>
            <Button variant="contained" startIcon={<SwapHoriz />}
              onClick={() => setOpenDialog('transferer')}
              sx={{ bgcolor: '#3B82F6', px: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Transférer
            </Button>
            <Button variant="contained" startIcon={<CheckCircle />}
              onClick={() => setOpenDialog('valider')}
              sx={{ bgcolor: '#10B981', px: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Valider
            </Button>
            <Button variant="contained" startIcon={<Cancel />}
              onClick={() => setOpenDialog('rejeter')}
              sx={{ bgcolor: '#EF4444', px: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Rejeter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ===== CARTE 6 : CIRCUIT DE TRAITEMENT ===== */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center', mb: 4 }}>
            Circuit de traitement
          </Typography>

          {/* Workflow visuel horizontal */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
            {workflowSteps.map((step, i) => (
              <React.Fragment key={i}>
                <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                  <Box sx={{
                    width: 60, height: 60, borderRadius: '50%', mx: 'auto', mb: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 22,
                    bgcolor: step.rejected ? '#EF4444'
                      : step.completed ? '#10B981'
                      : step.current ? '#3B82F6'
                      : '#E5E7EB',
                    color: (step.completed || step.current || step.rejected) ? 'white' : '#9CA3AF',
                    border: step.current ? '3px solid #93C5FD' : '3px solid transparent',
                    boxShadow: step.current ? '0 0 0 4px rgba(59,130,246,0.15)' : 'none',
                  }}>
                    {step.completed ? <CheckCircle sx={{ fontSize: 30 }} /> : step.num}
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>{step.role}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{step.name}</Typography>
                  {step.date && (
                    <Typography sx={{ fontSize: 11, color: '#9CA3AF' }}>
                      {new Date(step.date).toLocaleString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </Typography>
                  )}
                  {step.current && (
                    <Box sx={{ mt: 0.5, px: 1, py: 0.2, bgcolor: '#DBEAFE', color: '#1D4ED8', borderRadius: 2, fontSize: 10, fontWeight: 600, display: 'inline-block' }}>
                      En attente
                    </Box>
                  )}
                </Box>
                {i < workflowSteps.length - 1 && (
                  <Box sx={{
                    flex: 1, height: 3, maxWidth: 120,
                    bgcolor: workflowSteps[i + 1].completed || step.completed ? '#10B981' : '#E5E7EB',
                    borderRadius: 2
                  }} />
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Commentaire */}
          <TextField fullWidth multiline rows={3}
            label="Commentaire (facultatif)"
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder="Ajouter un commentaire..."
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" startIcon={<CheckCircle />}
              onClick={() => setOpenDialog('valider')}
              sx={{ bgcolor: '#10B981', px: 4, py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Valider
            </Button>
            <Button variant="contained" startIcon={<SwapHoriz />}
              onClick={() => setOpenDialog('transferer')}
              sx={{ bgcolor: '#3B82F6', px: 4, py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Transférer
            </Button>
            <Button variant="contained" startIcon={<Cancel />}
              onClick={() => setOpenDialog('rejeter')}
              sx={{ bgcolor: '#EF4444', px: 4, py: 1.3, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
              Rejeter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* ===== DIALOGS ===== */}
      <Dialog open={!!openDialog} onClose={() => setOpenDialog('')} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {openDialog === 'affecter' && '👤 Affecter le courrier'}
          {openDialog === 'transferer' && '🔄 Transférer le courrier'}
          {openDialog === 'valider' && '✅ Valider le courrier'}
          {openDialog === 'rejeter' && '❌ Rejeter le courrier'}
        </DialogTitle>
        <DialogContent>
          {(openDialog === 'affecter' || openDialog === 'transferer') && (
            <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
              <InputLabel>Utilisateur</InputLabel>
              <Select value={selectedUserId} label="Utilisateur"
                onChange={(e) => setSelectedUserId(Number(e.target.value))}>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.prenom} {u.nom} ({u.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <TextField autoFocus fullWidth multiline rows={3}
            label={openDialog === 'rejeter' ? 'Motif (obligatoire)' : 'Commentaire'}
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog('')} sx={{ color: '#6B7280' }}>Annuler</Button>
          <Button variant="contained" onClick={() => handleAction(openDialog)}
            color={openDialog === 'rejeter' ? 'error' : 'primary'}
            sx={{ borderRadius: 2 }}>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DetailCourrier;
