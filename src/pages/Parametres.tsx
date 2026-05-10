import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  Alert, Divider, Avatar, CircularProgress
} from '@mui/material';
import { Save, Lock } from '@mui/icons-material';
import { userService } from '../services/otherServices';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
      setFormPassword({ ancienMotDePasse: '', nouveauMotDePasse: '', confirmer: '' });
    } catch (err: any) {
      setErrorPassword(err.response?.data?.message || 'Erreur');
    } finally { setLoadingPassword(false); }
  };

  if (!profile) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#5B21B6' }} />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
        Paramètres
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 600 }}>

        {/* Profil */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 56, height: 56, bgcolor: '#5B21B6', fontSize: 20 }}>
                {profile.prenom?.[0]}{profile.nom?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                  {profile.prenom} {profile.nom}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                  {profile.email} · {profile.role}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}>
              Informations personnelles
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField fullWidth size="small" label="Nom"
                  value={formProfile.nom}
                  onChange={(e) => setFormProfile({ ...formProfile, nom: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField fullWidth size="small" label="Prénom"
                  value={formProfile.prenom}
                  onChange={(e) => setFormProfile({ ...formProfile, prenom: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Box>
              <TextField fullWidth size="small" label="Email" value={profile.email}
                disabled
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField fullWidth size="small" label="Service"
                value={formProfile.service}
                onChange={(e) => setFormProfile({ ...formProfile, service: e.target.value })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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

        {/* Mot de passe */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Lock sx={{ color: '#5B21B6', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
                Changer le mot de passe
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

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
                sx={{ borderRadius: 2, background: '#5B21B6', textTransform: 'none' }}>
                {loadingPassword ? 'Modification...' : 'Modifier le mot de passe'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Infos système */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontWeight: 600, mb: 2, fontSize: 14 }}>
              Informations système
            </Typography>
            <Divider sx={{ mb: 2 }} />
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
                  <Typography sx={{ minWidth: 160, fontSize: 13, color: '#64748b' }}>
                    {label} :
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{value}</Typography>
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
