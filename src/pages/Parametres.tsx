import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Divider, Avatar, CircularProgress, Switch,
  FormControlLabel, Select, MenuItem, FormControl,
  InputLabel, Chip
} from '@mui/material';
import {
  Save, Lock, DarkMode, Language, Palette
} from '@mui/icons-material';
import { userService } from '../services/otherServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'wo', label: 'Wolof', flag: '🇸🇳' },
];

const Parametres = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [formProfile, setFormProfile] = useState({
    nom: '', prenom: '', service: ''
  });
  const [formPassword, setFormPassword] = useState({
    ancienMotDePasse: '', nouveauMotDePasse: '', confirmer: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState('');

  // Dark mode
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('darkMode') === 'true'
  );

  // Langue
  const [langue, setLangue] = useState(() =>
    localStorage.getItem('langue') || 'fr'
  );

  // Notifications
  const [notifEmail, setNotifEmail] = useState(() =>
    localStorage.getItem('notifEmail') !== 'false'
  );
  const [notifSon, setNotifSon] = useState(() =>
    localStorage.getItem('notifSon') !== 'false'
  );

  useEffect(() => {
    userService.getMe().then(r => {
      setProfile(r.data);
      setFormProfile({
        nom: r.data.nom || '',
        prenom: r.data.prenom || '',
        service: r.data.service || ''
      });
    });
  }, []);

  // Appliquer dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = '#0F172A';
      document.body.style.filter = 'none';
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.body.style.backgroundColor = '#F1F5F9';
      document.documentElement.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Appliquer langue
  useEffect(() => {
    localStorage.setItem('langue', langue);
    document.documentElement.setAttribute('lang', langue);
    if (langue === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, [langue]);

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
    if (formPassword.nouveauMotDePasse !== formPassword.confirmer) {
      setErrorPassword('Les mots de passe ne correspondent pas');
      return;
    }
    if (formPassword.nouveauMotDePasse.length < 6) {
      setErrorPassword('Minimum 6 caractères');
      return;
    }
    setLoadingPassword(true);
    try {
      await userService.changePassword(user!.userId, {
        ancienMotDePasse: formPassword.ancienMotDePasse,
        nouveauMotDePasse: formPassword.nouveauMotDePasse
      });
      toast.success('Mot de passe modifié !');
      setFormPassword({
        ancienMotDePasse: '', nouveauMotDePasse: '', confirmer: ''
      });
    } catch (err: any) {
      setErrorPassword(err.response?.data?.message || 'Erreur');
    } finally { setLoadingPassword(false); }
  };

  const handleSavePreferences = () => {
    localStorage.setItem('darkMode', String(darkMode));
    localStorage.setItem('langue', langue);
    localStorage.setItem('notifEmail', String(notifEmail));
    localStorage.setItem('notifSon', String(notifSon));
    toast.success('Préférences sauvegardées !');
  };

  if (!profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  const cardBg = darkMode ? '#1E293B' : 'white';
  const textColor = darkMode ? '#F1F5F9' : '#1e293b';
  const subTextColor = darkMode ? '#94a3b8' : '#64748b';
  const pageBg = darkMode ? '#0F172A' : '#F1F5F9';

  return (
    <Box sx={{ bgcolor: pageBg, minHeight: '100vh', p: 0 }}>
      <Typography variant="h5"
        sx={{ fontWeight: 700, color: textColor, mb: 3 }}>
        Paramètres
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>

        {/* ===== PROFIL ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#5B21B6', fontSize: 20 }}>
                {profile.prenom?.[0]}{profile.nom?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 16, color: textColor }}>
                  {profile.prenom} {profile.nom}
                </Typography>
                <Typography sx={{ fontSize: 13, color: subTextColor }}>
                  {profile.email} · {profile.role}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />

            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 14, color: textColor }}>
              Informations personnelles
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Nom"
                  value={formProfile.nom}
                  onChange={(e) => setFormProfile({ ...formProfile, nom: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& .MuiInputLabel-root': { color: subTextColor },
                    '& .MuiOutlinedInput-input': { color: textColor },
                  }}
                />
                <TextField fullWidth size="small" label="Prénom"
                  value={formProfile.prenom}
                  onChange={(e) => setFormProfile({ ...formProfile, prenom: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': { borderRadius: 2 },
                    '& .MuiInputLabel-root': { color: subTextColor },
                    '& .MuiOutlinedInput-input': { color: textColor },
                  }}
                />
              </Box>
              <TextField fullWidth size="small" label="Email"
                value={profile.email} disabled
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField fullWidth size="small" label="Service"
                value={formProfile.service}
                onChange={(e) => setFormProfile({ ...formProfile, service: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { borderRadius: 2 },
                  '& .MuiInputLabel-root': { color: subTextColor },
                  '& .MuiOutlinedInput-input': { color: textColor },
                }}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<Save />}
                onClick={handleSaveProfile} disabled={loadingProfile}
                sx={{ borderRadius: 2, background: '#5B21B6', textTransform: 'none' }}>
                {loadingProfile ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ===== APPARENCE ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Palette sx={{ color: '#5B21B6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: textColor }}>
                Apparence
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />

            {/* Dark Mode */}
            <Box sx={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', mb: 2,
              p: 2, borderRadius: 2,
              bgcolor: darkMode ? '#0F172A' : '#F8FAFC',
              border: '1px solid',
              borderColor: darkMode ? '#334155' : '#E2E8F0'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{
                  width: 36, height: 36, borderRadius: 2,
                  bgcolor: darkMode ? '#1E3A5F' : '#EDE9FE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <DarkMode sx={{
                    fontSize: 18,
                    color: darkMode ? '#60A5FA' : '#5B21B6'
                  }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                    Mode sombre
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: subTextColor }}>
                    {darkMode ? 'Activé' : 'Désactivé'}
                  </Typography>
                </Box>
              </Box>
              <Switch
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#5B21B6' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    bgcolor: '#5B21B6'
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* ===== LANGUE ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Language sx={{ color: '#5B21B6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: textColor }}>
                Langue de l'interface
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {LANGUAGES.map((lang) => (
                <Box key={lang.code}
                  onClick={() => setLangue(lang.code)}
                  sx={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2, borderRadius: 2, cursor: 'pointer',
                    border: '2px solid',
                    borderColor: langue === lang.code ? '#5B21B6' : (darkMode ? '#334155' : '#E2E8F0'),
                    bgcolor: langue === lang.code
                      ? (darkMode ? '#2D1B6B' : '#EDE9FE')
                      : (darkMode ? '#0F172A' : '#F8FAFC'),
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#5B21B6',
                      bgcolor: darkMode ? '#1E293B' : '#F5F3FF'
                    }
                  }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography sx={{ fontSize: 22 }}>{lang.flag}</Typography>
                    <Typography sx={{
                      fontSize: 13, fontWeight: 500,
                      color: langue === lang.code ? '#5B21B6' : textColor
                    }}>
                      {lang.label}
                    </Typography>
                  </Box>
                  {langue === lang.code && (
                    <Chip label="Actif" size="small"
                      sx={{
                        bgcolor: '#5B21B6', color: 'white',
                        fontSize: 10, height: 20
                      }} />
                  )}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* ===== NOTIFICATIONS ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: textColor, mb: 2 }}>
              🔔 Notifications
            </Typography>
            <Divider sx={{ mb: 3, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', p: 2, borderRadius: 2,
                bgcolor: darkMode ? '#0F172A' : '#F8FAFC',
                border: '1px solid', borderColor: darkMode ? '#334155' : '#E2E8F0'
              }}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                    Notifications par email
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: subTextColor }}>
                    Recevoir les alertes par email
                  </Typography>
                </Box>
                <Switch checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#5B21B6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: '#5B21B6'
                    }
                  }}
                />
              </Box>

              <Box sx={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', p: 2, borderRadius: 2,
                bgcolor: darkMode ? '#0F172A' : '#F8FAFC',
                border: '1px solid', borderColor: darkMode ? '#334155' : '#E2E8F0'
              }}>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                    Sons de notification
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: subTextColor }}>
                    Activer les sons d'alerte
                  </Typography>
                </Box>
                <Switch checked={notifSon}
                  onChange={(e) => setNotifSon(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#5B21B6' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      bgcolor: '#5B21B6'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<Save />}
                onClick={handleSavePreferences}
                sx={{
                  borderRadius: 2, background: '#5B21B6',
                  textTransform: 'none'
                }}>
                Sauvegarder les préférences
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ===== MOT DE PASSE ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Lock sx={{ color: '#5B21B6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14, color: textColor }}>
                Changer le mot de passe
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />

            {errorPassword && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorPassword}
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField fullWidth size="small" type="password"
                label="Mot de passe actuel"
                value={formPassword.ancienMotDePasse}
                onChange={(e) => setFormPassword({
                  ...formPassword, ancienMotDePasse: e.target.value
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField fullWidth size="small" type="password"
                label="Nouveau mot de passe"
                value={formPassword.nouveauMotDePasse}
                onChange={(e) => setFormPassword({
                  ...formPassword, nouveauMotDePasse: e.target.value
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField fullWidth size="small" type="password"
                label="Confirmer le nouveau mot de passe"
                value={formPassword.confirmer}
                onChange={(e) => setFormPassword({
                  ...formPassword, confirmer: e.target.value
                })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<Lock />}
                onClick={handleChangePassword} disabled={loadingPassword}
                sx={{
                  borderRadius: 2, background: '#5B21B6',
                  textTransform: 'none'
                }}>
                {loadingPassword ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ===== INFOS SYSTEME ===== */}
        <Card sx={{ borderRadius: 3, bgcolor: cardBg }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 14, color: textColor }}>
              ℹ️ Informations système
            </Typography>
            <Divider sx={{ mb: 2, borderColor: darkMode ? '#334155' : '#E2E8F0' }} />
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {[
                ['Application', 'Sama Courrier by magentatechno'],
                ['Version', 'MVP v1.0'],
                ['Rôle', profile.role],
                ['Membre depuis', new Date(profile.createdAt).toLocaleDateString('fr-FR')],
                ['Dernière connexion', profile.lastLogin
                  ? new Date(profile.lastLogin).toLocaleString('fr-FR')
                  : '—'],
              ].map(([label, value]) => (
                <Box key={label} sx={{ display: 'flex', gap: 2 }}>
                  <Typography sx={{ minWidth: 160, fontSize: 13, color: subTextColor }}>
                    {label} :
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: textColor }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

      </Box>
    </Box>
  );
};

export default Parametres;
