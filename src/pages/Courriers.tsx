import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Tooltip, CircularProgress
} from '@mui/material';
import {
  Add, Search, Visibility, CheckCircle, Cancel,
  Archive, PictureAsPdf, FilterList
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import toast from 'react-hot-toast';

const statutColors: Record<string, any> = {
  NOUVEAU: 'info', EN_COURS: 'warning', VALIDE: 'success',
  REJETE: 'error', ARCHIVE: 'default'
};

const prioriteColors: Record<string, string> = {
  BASSE: '#64748b', NORMALE: '#3b82f6', HAUTE: '#f59e0b', URGENTE: '#ef4444'
};

const Courriers = () => {
  const [courriers, setCourriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCourriers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courrierService.getAll({ search, type, statut, page, size: 10 });
      setCourriers(res.data.content);
      setTotal(res.data.totalElements);
    } catch {
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [search, type, statut, page]);

  useEffect(() => { fetchCourriers(); }, [fetchCourriers]);

  const handleDownloadPdf = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await courrierService.getPdf(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url;
      a.download = `courrier-${id}.pdf`; a.click();
    } catch { toast.error('Erreur PDF'); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1e293b">Courriers</Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => navigate('/courriers/nouveau')}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600,
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
          Nouveau courrier
        </Button>
      </Box>

      {/* Filtres */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField size="small" placeholder="Rechercher..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Type</InputLabel>
            <Select value={type} label="Type" onChange={(e) => setType(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="ENTRANT">Entrant</MenuItem>
              <MenuItem value="SORTANT">Sortant</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={statut} label="Statut" onChange={(e) => setStatut(e.target.value)}>
              <MenuItem value="">Tous</MenuItem>
              <MenuItem value="NOUVEAU">Nouveau</MenuItem>
              <MenuItem value="EN_COURS">En cours</MenuItem>
              <MenuItem value="VALIDE">Validé</MenuItem>
              <MenuItem value="REJETE">Rejeté</MenuItem>
              <MenuItem value="ARCHIVE">Archivé</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" size="small" startIcon={<FilterList />}
            onClick={() => { setSearch(''); setType(''); setStatut(''); }}
            sx={{ textTransform: 'none', borderRadius: 2 }}>
            Réinitialiser
          </Button>
        </Box>
      </Card>

      {/* Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                {['Numéro', 'Objet', 'Type', 'Statut', 'Priorité', 'Étape courante', 'Assigné à', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: '#64748b', fontSize: 12 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <CircularProgress size={32} sx={{ color: '#5B21B6' }} />
                </TableCell></TableRow>
              ) : courriers.length === 0 ? (
                <TableRow><TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                  Aucun courrier trouvé
                </TableCell></TableRow>
              ) : courriers.map((c) => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/courriers/${c.id}`)}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 12, color: '#5B21B6' }}>{c.numero}</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
                    <Typography noWrap fontSize={13} fontWeight={500}>{c.objet}</Typography>
                    <Typography noWrap fontSize={11} color="text.secondary">{c.expediteur}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={c.type} size="small" variant="outlined"
                      color={c.type === 'ENTRANT' ? 'primary' : 'secondary'} />
                  </TableCell>
                  <TableCell>
                    <Chip label={c.statut} size="small" color={statutColors[c.statut]} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: prioriteColors[c.priorite] }} />
                      <Typography fontSize={12}>{c.priorite}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={12} color={c.etapeCouranteNom ? '#5B21B6' : '#94a3b8'}>
                      {c.etapeCouranteNom || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={12}>{c.assigneANom || '—'}</Typography>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="Voir détails">
                        <IconButton size="small" onClick={() => navigate(`/courriers/${c.id}`)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Télécharger PDF">
                        <IconButton size="small" onClick={(e) => handleDownloadPdf(c.id, e)}>
                          <PictureAsPdf fontSize="small" color="error" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={10}
          onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[10]}
        />
      </Card>
    </Box>
  );
};

export default Courriers;
