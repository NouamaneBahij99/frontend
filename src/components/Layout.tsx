import React, { useState } from 'react';
import {
  Box, Drawer, AppBar, Toolbar, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, IconButton, Avatar, Badge,
  Divider, Tooltip, useMediaQuery, useTheme, InputBase, Menu, MenuItem
} from '@mui/material';
import {
  Dashboard, Inbox, Send, Archive, People, Settings, Business,
  Notifications, Search, Menu as MenuIcon, ExitToApp, Person
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 220;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Courrier entrant', icon: <Inbox />, path: '/courriers/entrant' },
  { text: 'Courrier sortant', icon: <Send />, path: '/courriers/sortant' },
  { text: 'Archives', icon: <Archive />, path: '/archives' },
  { text: 'Utilisateurs', icon: <People />, path: '/utilisateurs', adminOnly: true },
  { text: 'Services', icon: <Business />, path: '/services', adminOnly: true },
  { text: 'Services', icon: <Business />, path: '/services', adminOnly: true },
  { text: 'Paramètres', icon: <Settings />, path: '/parametres', adminOnly: true },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredMenu = menuItems.filter(item => !item.adminOnly || isAdmin());

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#2D1B6B' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18
        }}>✉️</Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: 'white', lineHeight: 1.2 }}>
            Sama Courrier
          </Typography>
          <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>
            by magentatechno
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 1.5 }} />

      <List sx={{ px: 1, py: 1.5, flex: 1 }}>
        {filteredMenu.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <ListItemButton key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              sx={{
                borderRadius: 2, mb: 0.3, py: 1,
                bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              }}>
              <ListItemIcon sx={{ color: active ? 'white' : 'rgba(255,255,255,0.6)', minWidth: 36, '& svg': { fontSize: 18 } }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text}
                primaryTypographyProps={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'white' : 'rgba(255,255,255,0.7)' }} />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#7C3AED', fontSize: 11 }}>
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.prenom} {user?.nom}
            </Typography>
            <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{user?.role}</Typography>
          </Box>
          <Tooltip title="Déconnexion">
            <IconButton size="small" onClick={logout} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: 'white' } }}>
              <ExitToApp sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F1F5F9' }}>
      {!isMobile && (
        <Drawer variant="permanent"
          sx={{ width: DRAWER_WIDTH, flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none', boxShadow: '2px 0 8px rgba(0,0,0,0.1)' } }}>
          {sidebarContent}
        </Drawer>
      )}
      {isMobile && (
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' } }}>
          {sidebarContent}
        </Drawer>
      )}

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AppBar position="sticky" elevation={0}
          sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', color: '#1e293b' }}>
          <Toolbar sx={{ gap: 2, minHeight: '56px !important' }}>
            {isMobile && (
              <IconButton size="small" onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              bgcolor: '#F8FAFC', borderRadius: 2, px: 1.5, py: 0.5,
              flex: 1, maxWidth: 320, border: '1px solid #E2E8F0'
            }}>
              <Search sx={{ fontSize: 16, color: '#94a3b8' }} />
              <InputBase placeholder="Rechercher..." sx={{ fontSize: 13, flex: 1 }} />
            </Box>
            <Box sx={{ flex: 1 }} />
            <Tooltip title="Notifications">
              <IconButton size="small" onClick={() => navigate('/notifications')}
                sx={{ bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 2 }}>
                <Badge badgeContent={3} color="error">
                  <Notifications sx={{ fontSize: 18, color: '#64748b' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#5B21B6', fontSize: 12 }}>
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#1e293b' }}>
                  {user?.prenom} {user?.nom}
                </Typography>
                <Typography sx={{ fontSize: 11, color: '#64748b' }}>{user?.role}</Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => { navigate('/profil'); setAnchorEl(null); }}>
            <Person sx={{ mr: 1, fontSize: 16 }} /> Mon profil
          </MenuItem>
          <MenuItem onClick={logout}>
            <ExitToApp sx={{ mr: 1, fontSize: 16 }} /> Déconnexion
          </MenuItem>
        </Menu>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
