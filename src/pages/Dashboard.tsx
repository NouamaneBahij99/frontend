import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, CircularProgress, Chip
} from '@mui/material';
import {
  Mail, CheckCircle, Cancel, Pending, Archive, TrendingUp
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { dashboardService } from '../services/otherServices';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#5B21B6', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];

const StatCard = ({ title, value, icon, color }: any) => (
  <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', height: '100%' }}>
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3 }}>
      <Box sx={{
        width: 56, height: 56, borderRadius: 2,
        background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700} color="#1e293b">{value ?? '—'}</Typography>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dashboardService.getStats()
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  const pieData = [
    { name: 'Entrants', value: stats?.courriersEntrants || 0 },
    { name: 'Sortants', value: stats?.courriersSortants || 0 },
  ];

  const barData = [
    { name: 'Nouveau', value: stats?.totalCourriers - (stats?.courriersEnCours + stats?.courriersValidés + stats?.courriersArchivés) || 0 },
    { name: 'En cours', value: stats?.courriersEnCours || 0 },
    { name: 'Validés', value: stats?.courriersValidés || 0 },
    { name: 'Rejetés', value: stats?.courriersRejetés || 0 },
    { name: 'Archivés', value: stats?.courriersArchivés || 0 },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="#1e293b">
          Bonjour, {user?.prenom} 👋
        </Typography>
        <Typography color="text.secondary">Voici l'état de votre courrier aujourd'hui</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total courriers" value={stats?.totalCourriers} icon={<Mail />} color="#5B21B6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="En cours" value={stats?.courriersEnCours} icon={<Pending />} color="#F59E0B" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Validés" value={stats?.courriersValidés} icon={<CheckCircle />} color="#10B981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Archivés" value={stats?.courriersArchivés} icon={<Archive />} color="#64748B" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Répartition par statut</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#5B21B6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} mb={2}>Entrants / Sortants</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                    paddingAngle={5} dataKey="value">
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
