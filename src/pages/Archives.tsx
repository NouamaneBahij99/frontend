import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, TextField, InputAdornment,
  List, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, IconButton, Collapse, CircularProgress, Tooltip
} from '@mui/material';
import {
  Search, FolderOpen, Folder, PictureAsPdf,
  Visibility, ExpandLess, ExpandMore
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { courrierService } from '../services/courrierService';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const MONTHS = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

const Archives = () => {
  const [courriers, setCourriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [openYears, setOpenYears] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    courrierService.getAll({ size: 100, page: 0 })
      .then(res => {
        const all = res.data.content || [];
        setCourriers(all.filter((c: any) => c.archive === true));
      })
      .finally(() => setLoading(false));
  }, []);

  const grouped: Record<string, Record<string, any[]>> = {};
  courriers.forEach(c => {
    const d = dayjs(c.createdAt);
    const year = d.format('YYYY');
    const month = MONTHS[d.month()];
    if (!grouped[year]) grouped[year] = {};
    if (!grouped[year][month]) grouped[year][month] = [];
    grouped[year][month].push(c);
  });

  const displayCourriers = selectedMonth && selectedYear
    ? (grouped[selectedYear]?.[selectedMonth] || [])
    : selectedYear
    ? Object.values(grouped[selectedYear] || {}).flat()
    : courriers.filter(c =>
        !search ||
        c.objet?.toLowerCase().includes(search.toLowerCase()) ||
        c.numero?.toLowerCase().includes(search.toLowerCase())
      );

  const handleDownloadPdf = async (id: number) => {
    try {
      await courrierService.downloadPdf(
        id,
        `courrier-${String(id).padStart(5,'0')}.pdf`
      );
      toast.success('PDF téléchargé !');
    } catch (err: any) {
      console.error('PDF error:', err);
      toast.error('Erreur téléchargement PDF');
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Archives
      </Typography>

      <Box sx={{ display: 'flex', gap: 2.5, height: 'calc(100vh - 160px)' }}>

        {/* Arborescence */}
        <Card sx={{ borderRadius: 3, width: 260, flexShrink: 0, overflow: 'auto' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
            <Typography sx={{ fontWeight: 600, fontSize: 13, color: '#374151' }}>
              Arborescence
            </Typography>
          </Box>
          <List dense sx={{ py: 0 }}>
            {Object.keys(grouped).sort().reverse().map(year => (
              <React.Fragment key={year}>
                <ListItemButton
                  onClick={() => {
                    setOpenYears(prev => ({ ...prev, [year]: !prev[year] }));
                    setSelectedYear(year);
                    setSelectedMonth(null);
                  }}
                  selected={selectedYear === year && !selectedMonth}
                  sx={{ px: 2, '&.Mui-selected': { bgcolor: '#EDE9FE', color: '#5B21B6' } }}>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    {openYears[year]
                      ? <FolderOpen sx={{ fontSize: 18, color: '#5B21B6' }} />
                      : <Folder sx={{ fontSize: 18, color: '#64748b' }} />}
                  </ListItemIcon>
                  <ListItemText primary={year}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 600 }} />
                  <Chip
                    label={Object.values(grouped[year]).flat().length}
                    size="small"
                    sx={{ height: 18, fontSize: 10, bgcolor: '#F1F5F9', mr: 0.5 }}
                  />
                  {openYears[year]
                    ? <ExpandLess sx={{ fontSize: 16 }} />
                    : <ExpandMore sx={{ fontSize: 16 }} />}
                </ListItemButton>

                <Collapse in={openYears[year]}>
                  {Object.keys(grouped[year]).map(month => (
                    <ListItemButton key={month}
                      onClick={() => { setSelectedYear(year); setSelectedMonth(month); }}
                      selected={selectedYear === year && selectedMonth === month}
                      sx={{ pl: 4, '&.Mui-selected': { bgcolor: '#EDE9FE', color: '#5B21B6' } }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <Folder sx={{ fontSize: 15, color: '#94a3b8' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{month}</span>
                            <Chip label={grouped[year][month].length} size="small"
                              sx={{ height: 16, fontSize: 10, bgcolor: '#F1F5F9' }} />
                          </Box>
                        }
                        primaryTypographyProps={{ fontSize: 12 }}
                      />
                    </ListItemButton>
                  ))}
                </Collapse>
              </React.Fragment>
            ))}

            {Object.keys(grouped).length === 0 && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 12, color: '#94a3b8' }}>
                  Aucune archive
                </Typography>
              </Box>
            )}
          </List>
        </Card>

        {/* Contenu */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField size="small"
            placeholder="Rechercher dans les archives..."
            value={search} onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 16 }} />
                </InputAdornment>
              )
            }}
            sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <Card sx={{ borderRadius: 3, flex: 1, overflow: 'auto' }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {['Nom du fichier', 'Type', 'Date', 'Taille', 'Actions'].map(h => (
                      <TableCell key={h}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayCourriers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center"
                        sx={{ py: 4, color: '#94a3b8', fontSize: 13 }}>
                        Aucun document archivé
                      </TableCell>
                    </TableRow>
                  ) : displayCourriers.map((c) => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PictureAsPdf sx={{ fontSize: 18, color: '#EF4444' }} />
                          <Box>
                            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                              {c.fichierNom || 'courrier_' + String(c.id).padStart(5,'0') + '.pdf'}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: '#64748b' }}>
                              {c.objet}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={c.type === 'ENTRANT' ? 'Courrier entrant' : 'Courrier sortant'}
                          size="small"
                          sx={{
                            fontSize: 11, height: 20,
                            bgcolor: c.type === 'ENTRANT' ? '#EDE9FE' : '#E0F2FE',
                            color: c.type === 'ENTRANT' ? '#5B21B6' : '#0369A1'
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                        {dayjs(c.updatedAt).format('DD/MM/YYYY')}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: '#64748b' }}>—</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Voir détails">
                            <IconButton size="small"
                              onClick={() => navigate('/courriers/' + c.id)}>
                              <Visibility sx={{ fontSize: 15, color: '#64748b' }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Télécharger PDF">
                            <IconButton size="small"
                              onClick={() => handleDownloadPdf(c.id)}>
                              <PictureAsPdf sx={{ fontSize: 15, color: '#EF4444' }} />
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
        </Box>
      </Box>
    </Box>
  );
};

export default Archives;
