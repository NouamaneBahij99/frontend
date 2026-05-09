import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Chip, Button, IconButton
} from '@mui/material';
import { Inbox, HourglassEmpty, Warning, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/otherServices';
import { courrierService } from '../services/courrierService';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const statutColors: Record<string, any> = {
  NOUVEAU: 'info', EN_COURS: 'warning',
  VALIDE: 'success', REJETE: 'error', ARCHIVE: 'default'
};
const statutLabels: Record<string, string> = {
  NOUVEAU: 'Nouveau', EN_COURS: 'En cours',
  VALIDE: 'Traité', REJETE: 'Rejeté', ARCHIVE: 'Archivé'
};

const StatCard = ({ title, value, icon, color, subtitle }: any) => (
  <Card sx={{ borderRadius: 3, height: '100%' }}>
    <CardContent sx={{ p: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>
            {value ?? 0}
          </Typography>
          <Typography sx={{ fontSize: 12, color: '#64748b', mt: 0.5 }}>{title}</Typography>
          {subtitle && (
            <Typography sx={{ fontSize: 11, color: '#94a3b8' }}>{subtitle}</Typography>
          )}
        </Box>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          bgcolor: color + '15',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [courriers, setCourriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      courrierService.getAll({ size: 6, page: 0 })
    ]).then(([statsRes, courriersRes]) => {
      setStats(statsRes.data);
      setCourriers(courriersRes.data.content || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
            Dashboard
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748b' }}>
            {user?.prenom} {user?.nom} · {user?.role}
          </Typography>
        </Box>
        <Button variant="contained"
          onClick={() => navigate('/courriers/entrant/nouveau')}
          sx={{
            background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
            borderRadius: 2, fontSize: 13
          }}>
          + Nouveau courrier
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 2.5, mb: 3
      }}>
        <StatCard
          title="Courriers reçus"
          subtitle="Total ce mois"
          value={stats?.totalCourriers}
          icon={<Inbox />} color="#5B21B6"
        />
        <StatCard
          title="En cours"
          subtitle="À traiter"
          value={stats?.courriersEnCours}
          icon={<HourglassEmpty />} color="#F59E0B"
        />
        <StatCard
          title="En retard"
          subtitle="À traiter"
          value={stats?.courriersRejetés || 0}
          icon={<Warning />} color="#EF4444"
        />
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <Box sx={{
          px: 3, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
            Derniers courriers
          </Typography>
          <Button size="small"
            onClick={() => navigate('/courriers/entrant')}
            sx={{ fontSize: 12, color: '#5B21B6', textTransform: 'none' }}>
            Voir tous
          </Button>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {['N°', 'Expéditeur', 'Objet', 'Date', 'Statut', 'Action'].map(h => (
                  <TableCell key={h}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {courriers.map((c) => (
                <TableRow key={c.id} hover sx={{ cursor: 'pointer' }}
                  onClick={() => navigate('/courriers/' + c.id)}>
                  <TableCell sx={{
                    fontFamily: 'monospace', fontSize: 12,
                    color: '#5B21B6', fontWeight: 600
                  }}>
                    {String(c.id).padStart(5, '0')}
                  </TableCell>
                  <TableCell sx={{ fontSize: 13 }}>{c.expediteur}</TableCell>
                  <TableCell sx={{ fontSize: 13, maxWidth: 180 }}>
                    <Typography noWrap sx={{ fontSize: 13 }}>{c.objet}</Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12, color: '#64748b' }}>
                    {dayjs(c.createdAt).format('DD/MM/YYYY')}
                  </TableCell>
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
                      <Visibility sx={{ fontSize: 16, color: '#64748b' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default Dashboard;
