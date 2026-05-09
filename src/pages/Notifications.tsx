import React, { useEffect, useState } from 'react';
import {
  Box, Card, Typography, List, ListItem, ListItemText,
  ListItemIcon, IconButton, Chip, Divider, Button, CircularProgress
} from '@mui/material';
import { Notifications as NotifIcon, MarkEmailRead, Circle } from '@mui/icons-material';
import { notificationService } from '../services/otherServices';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/fr';

dayjs.extend(relativeTime);
dayjs.locale('fr');

const Notifications = () => {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchNotifs = () => {
    if (!user) return;
    notificationService.getAll(user.userId)
      .then(r => setNotifs(r.data.content || r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { toast.error('Erreur'); }
  };

  const handleMarkAllRead = async () => {
    const unread = notifs.filter(n => !n.read);
    await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Toutes les notifications marquées comme lues');
  };

  const typeColors: Record<string, any> = {
    COURRIER_ASSIGNE: 'primary', COURRIER_VALIDE: 'success',
    COURRIER_REJETE: 'error', COURRIER_TRANSFERE: 'warning'
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h5" fontWeight={700} color="#1e293b">Notifications</Typography>
          {unreadCount > 0 && <Chip label={unreadCount} size="small" color="error" />}
        </Box>
        {unreadCount > 0 && (
          <Button startIcon={<MarkEmailRead />} onClick={handleMarkAllRead}
            sx={{ textTransform: 'none', color: '#5B21B6' }}>
            Tout marquer comme lu
          </Button>
        )}
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
        {notifs.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <NotifIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 1 }} />
            <Typography color="text.secondary">Aucune notification</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifs.map((n, i) => (
              <React.Fragment key={n.id}>
                <ListItem
                  sx={{ px: 3, py: 2, bgcolor: n.read ? 'transparent' : '#F5F3FF',
                    cursor: 'pointer', '&:hover': { bgcolor: '#F8FAFC' } }}
                  onClick={() => { if (n.lien) navigate(n.lien); }}
                  secondaryAction={
                    !n.read && (
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id); }}>
                        <MarkEmailRead fontSize="small" sx={{ color: '#5B21B6' }} />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Circle sx={{ fontSize: 10, color: n.read ? '#CBD5E1' : '#5B21B6' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontSize={14} fontWeight={n.read ? 400 : 600}>{n.titre}</Typography>
                        <Chip label={n.type?.replace('_', ' ')} size="small"
                          color={typeColors[n.type] || 'default'} sx={{ fontSize: 10, height: 18 }} />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography fontSize={12} color="text.secondary">{n.message}</Typography>
                        <Typography fontSize={11} color="text.secondary" mt={0.3}>
                          {dayjs(n.createdAt).fromNow()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {i < notifs.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Card>
    </Box>
  );
};

export default Notifications;
