import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Avatar, Menu, MenuItem,
  Badge, Divider, Tooltip, useMediaQuery, useTheme
} from '@mui/material';
import {
  Dashboard, Mail, People, AccountTree, Settings,
  Notifications, Menu as MenuIcon, ChevronLeft,
  ExitToApp, Person, Archive
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 260;

const menuItems = [
  { text: 'Tableau de bord', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Courriers', icon: <Mail />, path: '/courriers' },
  { text: 'Utilisateurs', icon: <People />, path: '/utilisateurs', adminOnly: true },
  { text: 'Organigramme', icon: <AccountTree />, path: '/organisation', adminOnly: true },
  { text: 'Workflows', icon: <Settings />, path: '/workflows', adminOnly: true },
];

const Layout = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredMenu = menuItems.filter(item => !item.adminOnly || isAdmin());

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* SIDEBAR */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            background: 'linear-gradient(180deg, #5B21B6 0%, #4C1D95 100%)',
            color: 'white', border: 'none', boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
          }
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
          }}>🦩</Box>
          <Box>
            <Typography fontWeight={700} fontSize={18}>Pélican</Typography>
            <Typography fontSize={11} sx={{ opacity: 0.7 }}>Gestion du Courrier</Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />

        {/* User info */}
        <Box sx={{ px: 2, py: 2 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
            borderRadius: 2, background: 'rgba(255,255,255,0.1)'
          }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
              {user?.prenom?.[0]}{user?.nom?.[0]}
            </Avatar>
            <Box>
              <Typography fontSize={13} fontWeight={600}>{user?.prenom} {user?.nom}</Typography>
              <Typography fontSize={11} sx={{ opacity: 0.7 }}>{user?.role}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Navigation */}
        <List sx={{ px: 1, flex: 1 }}>
          {filteredMenu.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2, mb: 0.5,
                  background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { background: 'rgba(255,255,255,0.15)' },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 400 }} />
              </ListItemButton>
            );
          })}
        </List>

        {/* Logout */}
        <Box sx={{ p: 2 }}>
          <ListItemButton onClick={logout} sx={{ borderRadius: 2, '&:hover': { background: 'rgba(255,255,255,0.15)' } }}>
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}><ExitToApp /></ListItemIcon>
            <ListItemText primary="Déconnexion" primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* MAIN */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* TOPBAR */}
        <AppBar position="sticky" elevation={0} sx={{
          bgcolor: 'white', borderBottom: '1px solid #E2E8F0', color: '#1e293b'
        }}>
          <Toolbar>
            {isMobile && (
              <IconButton onClick={() => setOpen(!open)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography fontWeight={600} sx={{ flex: 1 }}>
              {filteredMenu.find(m => location.pathname.startsWith(m.path))?.text || 'Pélican'}
            </Typography>

            <Tooltip title="Notifications">
              <IconButton onClick={() => navigate('/notifications')}>
                <Badge badgeContent={3} color="error">
                  <Notifications sx={{ color: '#64748b' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: '#5B21B6', fontSize: 13 }}>
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { navigate('/profil'); setAnchorEl(null); }}>
            <Person sx={{ mr: 1 }} fontSize="small" /> Mon profil
          </MenuItem>
          <MenuItem onClick={logout}><ExitToApp sx={{ mr: 1 }} fontSize="small" /> Déconnexion</MenuItem>
        </Menu>

        {/* PAGE CONTENT */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
