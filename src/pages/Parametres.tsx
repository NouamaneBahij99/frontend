import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Divider, Avatar, CircularProgress, Switch, Chip,
  List, ListItemButton, ListItemIcon, ListItemText, Badge
} from '@mui/material';
import {
  Person, Lock, Palette, Language, Notifications,
  Info, CheckCircle, DarkMode, LightMode,
  ChevronRight, Save, Visibility, VisibilityOff
} from '@mui/icons-material';
import { userService } from '../services/otherServices';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷', native: 'Français' },
  { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
  { code: 'ar', label: 'Arabe', flag: '🇸🇦', native: 'العربية' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳', native: 'Wolof' },
];

const SECTION_KEYS = [
  { id: 'profil',        key: 'mon_profil',    icon: 'Person',        color: '#5B21B6' },
  { id: 'apparence',     key: 'apparence',     icon: 'Palette',       color: '#7C3AED' },
  { id: 'langue',        key: 'langue',        icon: 'Language',      color: '#3B82F6' },
  { id: 'notifications', key: 'notifications', icon: 'Notifications', color: '#F59E0B' },
  { id: 'securite',      key: 'securite',      icon: 'Lock',          color: '#EF4444' },
  { id: 'systeme',       key: 'a_propos',      icon: 'Info',          color: '#10B981' },
];

const Parametres = () => {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode, langue, setLangue, t } = useAppTheme();
  const [activeSection, setActiveSection] = useState('profil');
  const [profile, setProfile] = useState<any>(null);
  const [formProfile, setFormProfile] = useState({ nom: '', prenom: '', service: '' });
  const [formPassword, setFormPassword] = useState({
    ancienMotDePasse: '', nouveauMotDePasse: '', confirmer: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    ancien: false, nouveau: false, confirmer: false
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem('notifEmail') !== 'false');
  const [notifSon, setNotifSon] = useState(() => localStorage.getItem('notifSon') !== 'false');
  const [notifPush, setNotifPush] = useState(() => localStorage.getItem('notifPush') !== 'false');

  useEffect(() => {
    userService.getMe().then(r => {
      setProfile(r.data);
      setFormProfile({ nom: r.data.nom || '', prenom: r.data.prenom || '', service: r.data.service || '' });
    });
  }, []);

  const handleSaveProfile = async () => {
    setLoadingProfile(true);
    try {
      await userService.update(user!.userId, formProfile);
      toast.success('Profil mis à jour !');
    } catch { toast.error('Erreur'); }
    finally { setLoadingProfile(false); }
  };

  const handleChangePassword = async () => {
    setErrorPassword('');
    if (!formPassword.ancienMotDePasse) { setErrorPassword('Mot de passe actuel requis'); return; }
    if (formPassword.nouveauMotDePasse.length < 6) { setErrorPassword('Minimum 6 caractères'); return; }
    if (formPassword.nouveauMotDePasse !== formPassword.confirmer) { setErrorPassword('Les mots de passe ne correspondent pas'); return; }
    setLoadingPassword(true);
    try {
      await userService.changePassword(user!.userId, {
        ancienMotDePasse: formPassword.ancienMotDePasse,
        nouveauMotDePasse: formPassword.nouveauMotDePasse
      });
      toast.success('Mot de passe modifié !');
      setFormPassword({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmer: '' });
    } catch (err: any) {
      setErrorPassword(err.response?.data?.message || 'Mot de passe actuel incorrect');
    } finally { setLoadingPassword(false); }
  };

  const handleSaveNotifs = () => {
    localStorage.setItem('notifEmail', String(notifEmail));
    localStorage.setItem('notifSon', String(notifSon));
    localStorage.setItem('notifPush', String(notifPush));
    toast.success('Notifications sauvegardées !');
  };

  if (!profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress color="primary" />
    </Box>
  );

  const renderSection = () => {
    switch (activeSection) {

      // ===== PROFIL =====
      case 'profil': return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Avatar */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{
                    width: 72, height: 72, fontSize: 26, fontWeight: 700,
                    background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                    boxShadow: '0 6px 16px rgba(91,33,182,0.35)'
                  }}>
                    {profile.prenom?.[0]}{profile.nom?.[0]}
                  </Avatar>
                  <Box sx={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: 20, height: 20, borderRadius: '50%',
                    bgcolor: '#10B981', border: '2px solid white'
                  }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                    {profile.prenom} {profile.nom}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                    {profile.email}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={profile.role} size="small" color="primary"
                      sx={{ height: 22, fontSize: 11 }} />
                    {profile.service && (
                      <Chip label={profile.service} size="small" variant="outlined"
                        sx={{ height: 22, fontSize: 11 }} />
                    )}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Formulaire */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2.5, color: 'text.secondary' }}>
                INFORMATIONS PERSONNELLES
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField fullWidth size="small" label="Nom *"
                    value={formProfile.nom}
                    onChange={(e) => setFormProfile({ ...formProfile, nom: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <TextField fullWidth size="small" label="Prénom *"
                    value={formProfile.prenom}
                    onChange={(e) => setFormProfile({ ...formProfile, prenom: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
                <TextField fullWidth size="small" label="Email"
                  value={profile.email} disabled
                  helperText="L'email ne peut pas être modifié"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField fullWidth size="small" label="Service / Département"
                  value={formProfile.service}
                  onChange={(e) => setFormProfile({ ...formProfile, service: e.target.value })}
                  placeholder="Ex: Direction Générale"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained"
                  startIcon={loadingProfile ? <CircularProgress size={14} color="inherit" /> : <Save />}
                  onClick={handleSaveProfile} disabled={loadingProfile}
                  sx={{ borderRadius: 2, px: 4, background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
                  {loadingProfile ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );

      // ===== APPARENCE =====
      case 'apparence': return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2.5, color: 'text.secondary' }}>
                THÈME DE L'APPLICATION
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Mode clair */}
                <Box onClick={() => darkMode && toggleDarkMode()}
                  sx={{
                    p: 2.5, borderRadius: 3, cursor: 'pointer', border: '2px solid',
                    borderColor: !darkMode ? 'primary.main' : 'divider',
                    bgcolor: !darkMode ? 'rgba(91,33,182,0.06)' : 'background.default',
                    transition: 'all 0.25s ease',
                    '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(91,33,182,0.15)' }
                  }}>
                  <Box sx={{
                    height: 80, borderRadius: 2, mb: 2,
                    background: 'linear-gradient(135deg, #F1F5F9, #E8EAF6)',
                    border: '1px solid #E2E8F0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <LightMode sx={{ fontSize: 32, color: '#F59E0B' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>Mode clair</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 11 }}>Interface lumineuse</Typography>
                    </Box>
                    {!darkMode && <CheckCircle color="primary" sx={{ fontSize: 20 }} />}
                  </Box>
                </Box>

                {/* Mode sombre */}
                <Box onClick={() => !darkMode && toggleDarkMode()}
                  sx={{
                    p: 2.5, borderRadius: 3, cursor: 'pointer', border: '2px solid',
                    borderColor: darkMode ? 'primary.main' : 'divider',
                    bgcolor: darkMode ? 'rgba(124,58,237,0.1)' : 'background.default',
                    transition: 'all 0.25s ease',
                    '&:hover': { borderColor: 'primary.main', transform: 'translateY(-2px)', boxShadow: '0 6px 16px rgba(91,33,182,0.15)' }
                  }}>
                  <Box sx={{
                    height: 80, borderRadius: 2, mb: 2,
                    background: 'linear-gradient(135deg, #0F172A, #1E293B)',
                    border: '1px solid #334155',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <DarkMode sx={{ fontSize: 32, color: '#7C3AED' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 13 }}>Mode sombre</Typography>
                      <Typography color="text.secondary" sx={{ fontSize: 11 }}>Interface sombre</Typography>
                    </Box>
                    {darkMode && <CheckCircle color="primary" sx={{ fontSize: 20 }} />}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: 13 }}>
                    {darkMode ? '🌙 Mode sombre activé' : '☀️ Mode clair activé'}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 11 }}>
                    Basculer rapidement entre les thèmes
                  </Typography>
                </Box>
                <Switch checked={darkMode} onChange={toggleDarkMode} color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Box>
      );

      // ===== LANGUE =====
      case 'langue': return (
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5, color: 'text.secondary' }}>
              LANGUE DE L'INTERFACE
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, mb: 3 }}>
              Choisissez la langue d'affichage de l'application
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {LANGUAGES.map((lang) => {
                const isActive = langue === lang.code;
                return (
                  <Box key={lang.code} onClick={() => { setLangue(lang.code); toast.success('Langue changée : ' + lang.native); }}
                    sx={{
                      p: 2.5, borderRadius: 3, cursor: 'pointer', border: '2px solid',
                      borderColor: isActive ? 'primary.main' : 'divider',
                      bgcolor: isActive ? 'rgba(91,33,182,0.07)' : 'background.default',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'rgba(91,33,182,0.04)',
                        transform: 'translateX(4px)',
                      }
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: 28 }}>{lang.flag}</Typography>
                      <Box>
                        <Typography sx={{
                          fontWeight: 600, fontSize: 14,
                          color: isActive ? 'primary.main' : 'text.primary'
                        }}>
                          {lang.native}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 12 }}>
                          {lang.label}
                          {lang.code === 'ar' && ' · RTL'}
                          {lang.code === 'wo' && ' · Sénégal'}
                        </Typography>
                      </Box>
                    </Box>
                    {isActive ? (
                      <Chip label="Actif" size="small" color="primary"
                        sx={{ height: 24, fontSize: 11, fontWeight: 700 }} />
                    ) : (
                      <ChevronRight sx={{ color: 'text.secondary', fontSize: 20 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      );

      // ===== NOTIFICATIONS =====
      case 'notifications': return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2.5, color: 'text.secondary' }}>
                PRÉFÉRENCES DE NOTIFICATIONS
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { key: 'email', label: 'Notifications par email', desc: 'Recevoir les alertes dans votre boîte mail', value: notifEmail, onChange: setNotifEmail, icon: '📧' },
                  { key: 'push', label: 'Notifications push', desc: 'Alertes en temps réel dans le navigateur', value: notifPush, onChange: setNotifPush, icon: '🔔' },
                  { key: 'son', label: 'Sons de notification', desc: 'Jouer un son lors des nouvelles alertes', value: notifSon, onChange: setNotifSon, icon: '🔊' },
                ].map((item) => (
                  <Box key={item.key} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.default', transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.light', bgcolor: 'rgba(91,33,182,0.03)' }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontSize: 22 }}>{item.icon}</Typography>
                      <Box>
                        <Typography sx={{ fontWeight: 600, fontSize: 13 }}>{item.label}</Typography>
                        <Typography color="text.secondary" sx={{ fontSize: 11 }}>{item.desc}</Typography>
                      </Box>
                    </Box>
                    <Switch checked={item.value}
                      onChange={(e) => item.onChange(e.target.checked)}
                      color="primary" />
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" startIcon={<Save />}
                  onClick={handleSaveNotifs}
                  sx={{ borderRadius: 2, px: 4, background: 'linear-gradient(135deg, #5B21B6, #7C3AED)' }}>
                  Sauvegarder
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );

      // ===== SECURITE =====
      case 'securite': return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 0.5, color: 'text.secondary' }}>
                CHANGER LE MOT DE PASSE
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 12, mb: 3 }}>
                Utilisez un mot de passe fort d'au moins 8 caractères
              </Typography>

              {errorPassword && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{errorPassword}</Alert>
              )}

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { label: 'Mot de passe actuel', key: 'ancienMotDePasse', showKey: 'ancien' },
                  { label: 'Nouveau mot de passe', key: 'nouveauMotDePasse', showKey: 'nouveau' },
                  { label: 'Confirmer le nouveau mot de passe', key: 'confirmer', showKey: 'confirmer' },
                ].map((field) => (
                  <TextField key={field.key} fullWidth size="small"
                    label={field.label}
                    type={(showPasswords as any)[field.showKey] ? 'text' : 'password'}
                    value={(formPassword as any)[field.key]}
                    onChange={(e) => setFormPassword({ ...formPassword, [field.key]: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ cursor: 'pointer', display: 'flex', color: 'text.secondary' }}
                          onClick={() => setShowPasswords(prev => ({
                            ...prev, [field.showKey]: !(prev as any)[field.showKey]
                          }))}>
                          {(showPasswords as any)[field.showKey]
                            ? <VisibilityOff sx={{ fontSize: 18 }} />
                            : <Visibility sx={{ fontSize: 18 }} />}
                        </Box>
                      )
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                ))}
              </Box>

              {/* Indicateur force mot de passe */}
              {formPassword.nouveauMotDePasse && (
                <Box sx={{ mt: 2 }}>
                  <Typography sx={{ fontSize: 12, mb: 1, color: 'text.secondary' }}>Force du mot de passe</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[1, 2, 3, 4].map((level) => {
                      const strength = Math.min(4, Math.floor(formPassword.nouveauMotDePasse.length / 2));
                      return (
                        <Box key={level} sx={{
                          flex: 1, height: 4, borderRadius: 2,
                          bgcolor: level <= strength
                            ? level <= 1 ? '#EF4444' : level <= 2 ? '#F59E0B' : level <= 3 ? '#3B82F6' : '#10B981'
                            : 'divider',
                          transition: 'all 0.3s'
                        }} />
                      );
                    })}
                  </Box>
                  <Typography sx={{ fontSize: 11, mt: 0.5, color: 'text.secondary' }}>
                    {formPassword.nouveauMotDePasse.length < 4 ? 'Trop court' :
                     formPassword.nouveauMotDePasse.length < 6 ? 'Faible' :
                     formPassword.nouveauMotDePasse.length < 8 ? 'Moyen' : 'Fort ✓'}
                  </Typography>
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained"
                  startIcon={loadingPassword ? <CircularProgress size={14} color="inherit" /> : <Lock />}
                  onClick={handleChangePassword} disabled={loadingPassword}
                  sx={{ borderRadius: 2, px: 4, bgcolor: '#EF4444', '&:hover': { bgcolor: '#DC2626' } }}>
                  {loadingPassword ? 'Modification...' : 'Changer le mot de passe'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      );

      // ===== SYSTEME =====
      case 'systeme': return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{
                  width: 64, height: 64, borderRadius: 3, mx: 'auto', mb: 2,
                  background: 'linear-gradient(135deg, #5B21B6, #7C3AED)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30
                }}>✉️</Box>
                <Typography sx={{ fontWeight: 800, fontSize: 20 }}>Sama Courrier</Typography>
                <Typography color="text.secondary" sx={{ fontSize: 13 }}>by magentatechno</Typography>
                <Chip label="Version MVP v1.0" size="small" color="primary"
                  sx={{ mt: 1, height: 22, fontSize: 11 }} />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography sx={{ fontWeight: 600, fontSize: 14, mb: 2, color: 'text.secondary' }}>
                INFORMATIONS DU COMPTE
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  ['👤 Utilisateur', `${profile.prenom} ${profile.nom}`],
                  ['📧 Email', profile.email],
                  ['🎭 Rôle', profile.role],
                  ['🏢 Service', profile.service || '—'],
                  ['📅 Membre depuis', new Date(profile.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['🕐 Dernière connexion', profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('fr-FR') : '—'],
                ].map(([label, value]) => (
                  <Box key={label} sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    p: 2, borderRadius: 2, bgcolor: 'background.default',
                    border: '1px solid', borderColor: 'divider'
                  }}>
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>{label}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      );

      default: return null;
    }
  };

  const activeInfo = SECTION_KEYS.find(s => s.id === activeSection);

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Paramètres
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>

        {/* Sidebar navigation */}
        <Card sx={{ width: 240, flexShrink: 0, position: 'sticky', top: 80 }}>
          <CardContent sx={{ p: 1.5 }}>
            <List disablePadding>
              {SECTION_KEYS.map((section, i) => {
                const isActive = activeSection === section.id;
                return (
                  <React.Fragment key={section.id}>
                    {i === 4 && <Divider sx={{ my: 1 }} />}
                    <ListItemButton
                      onClick={() => setActiveSection(section.id)}
                      sx={{
                        borderRadius: 2, mb: 0.3, py: 1.2,
                        bgcolor: isActive ? 'rgba(91,33,182,0.1)' : 'transparent',
                        '&:hover': { bgcolor: 'rgba(91,33,182,0.06)' },
                      }}>
                      <ListItemIcon sx={{
                        minWidth: 36,
                        '& svg': {
                          fontSize: 18,
                          color: isActive ? section.color : 'text.secondary'
                        }
                      }}>
                        {section.icon === 'Person' ? <Person /> :
                     section.icon === 'Palette' ? <Palette /> :
                     section.icon === 'Language' ? <Language /> :
                     section.icon === 'Notifications' ? <Notifications /> :
                     section.icon === 'Lock' ? <Lock /> :
                     <Info />}
                      </ListItemIcon>
                      <ListItemText
                        primary={t(section.key)}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: isActive ? 700 : 400,
                          color: isActive ? section.color : 'text.primary'
                        }}
                      />
                      {isActive && (
                        <Box sx={{
                          width: 4, height: 20, borderRadius: 2,
                          bgcolor: section.color
                        }} />
                      )}
                    </ListItemButton>
                  </React.Fragment>
                );
              })}
            </List>
          </CardContent>
        </Card>

        {/* Contenu de la section */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {t(activeInfo?.key || '')}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {activeSection === 'profil' && 'Gérez vos informations personnelles'}
              {activeSection === 'apparence' && 'Personnalisez l\'interface'}
              {activeSection === 'langue' && 'Choisissez votre langue préférée'}
              {activeSection === 'notifications' && 'Configurez vos alertes'}
              {activeSection === 'securite' && 'Sécurisez votre compte'}
              {activeSection === 'systeme' && 'Informations sur l\'application'}
            </Typography>
          </Box>
          {renderSection()}
        </Box>

      </Box>
    </Box>
  );
};

export default Parametres;
