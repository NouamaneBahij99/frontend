import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, Typography, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, IconButton, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination,
  InputAdornment, Tooltip, CircularProgress
} from '@mui/material';
import { Add, Search, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const statutLabels: Record<string, string> = {
  NOUVEAU: 'Brouillon', EN_COURS: 'En cours',
  VALIDE: 'Envoyé', REJETE: 'Annulé', ARCHIVE: 'Archivé'
};
const statutColors: Record<string, any> = {
  NOUVEAU: 'default', EN_COURS: 'warning',
  VALIDE: 'success', REJETE: 'error', ARCHIVE: 'default'
};

const CourrierSortant = () => {
  const [courriers, setCourriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statut, setStatut] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const fetchCourriers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await courrierService.getAll({
        search, type: 'SORTANT', statut, page, size: 10,
        sort: 'createdAt,desc'
      });
      setCourriers(res.data.content || []);
      setTotal(res.data.totalElements || 0);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  }, [search, statut, page]);

  useEffect(() => { fetchCourriers(); }, [fetchCourriers]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
          Courrier sortant
        </Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => navigate('/courriers/sortant/nouveau')}
          sx={{
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
            borderRadius: 2, fontSize: 13
          }}>
          + Créer courrier
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
        <TextField size="small" placeholder="Rechercher..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 16 }} />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'white' } }}
        />
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Statut</InputLabel>
          <Select value={statut} label="Statut"
            onChange={(e) => setStatut(e.target.value)}
            sx={{ borderRadius: 2, bgcolor: 'white' }}>
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="EN_COURS">En cours</MenuItem>
            <MenuItem value="VALIDE">Envoyé</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Service</InputLabel>
          <Select value="" label="Service" onChange={() => {}}
            sx={{ borderRadius: 2, bgcolor: 'white' }}>
            <MenuItem value="">Tous</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Période</InputLabel>
          <Select value="" label="Période" onChange={() => {}}
            sx={{ borderRadius: 2, bgcolor: 'white' }}>
            <MenuItem value="">Toutes</MenuItem>
            <MenuItem value="week">Cette semaine</MenuItem>
            <MenuItem value="month">Ce mois</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['N°', 'Date', 'Destinataire', 'Objet', 'Service', 'Statut', 'Action'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} sx={{ color: '#5B21B6' }} />
                  </TableCell>
                </TableRow>
              ) : courriers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center"
                    sx={{ py: 4, color: '#94a3b8', fontSize: 13 }}>
                    Aucun courrier sortant
                  </TableCell>
                </TableRow>
              ) : courriers.map((c) => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/courriers/' + c.id)}>
                  <TableCell sx={{
                    fontFamily: 'monospace', fontSize: 12,
                    color: '#5B21B6', fontWeight: 600
                  }}>
                    {String(c.id).padStart(5, '0')}
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                    {dayjs(c.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13, fontWeight: 500 }}>
                    {c.destinataire}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Typography noWrap sx={{ fontSize: 13 }}>{c.objet}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12 }}>{c.expediteur || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={statutLabels[c.statut] || c.statut}
                      color={statutColors[c.statut]}
                      size="small"
                      sx={{ fontSize: 11, height: 22 }}
                    />
                  </TableCell>
                  <TableCell onClick={e => e.stopPropagation()}>
                    <IconButton size="small"
                      onClick={() => navigate('/courriers/' + c.id)}>
                      <Visibility sx={{ fontSize: 15, color: '#64748b' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={10}
          onPageChange={(_, p) => setPage(p)} rowsPerPageOptions={[10]}
          labelDisplayedRows={({ from, to, count }) => from + '–' + to + ' sur ' + count}
        />
      </Card>
    </Box>
  );
};

export default CourrierSortant;
