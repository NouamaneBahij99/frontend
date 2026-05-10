import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  langue: string;
  setLangue: (lang: string) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const translations: Record<string, Record<string, string>> = {
  fr: {
    dashboard: 'Tableau de bord', courrier_entrant: 'Courrier entrant',
    courrier_sortant: 'Courrier sortant', archives: 'Archives',
    utilisateurs: 'Utilisateurs', services: 'Services',
    workflows: 'Workflows', parametres: 'Paramètres',
    nouveau_courrier: 'Nouveau courrier', rechercher: 'Rechercher...',
    valider: 'Valider', rejeter: 'Rejeter', transferer: 'Transférer',
    affecter: 'Affecter', annuler: 'Annuler', enregistrer: 'Enregistrer',
    deconnexion: 'Déconnexion', mon_profil: 'Mon profil',
    total_courriers: 'Courriers reçus', en_cours: 'En cours',
    en_retard: 'En retard', derniers_courriers: 'Derniers courriers',
    voir_tous: 'Voir tous', notifications: 'Notifications',
    dark_mode: 'Mode sombre', langue_interface: "Langue de l'interface",
    sauvegarder: 'Sauvegarder', apparence: 'Apparence',
  },
  en: {
    dashboard: 'Dashboard', courrier_entrant: 'Incoming Mail',
    courrier_sortant: 'Outgoing Mail', archives: 'Archives',
    utilisateurs: 'Users', services: 'Services',
    workflows: 'Workflows', parametres: 'Settings',
    nouveau_courrier: 'New Mail', rechercher: 'Search...',
    valider: 'Validate', rejeter: 'Reject', transferer: 'Transfer',
    affecter: 'Assign', annuler: 'Cancel', enregistrer: 'Save',
    deconnexion: 'Logout', mon_profil: 'My Profile',
    total_courriers: 'Total Mail', en_cours: 'In Progress',
    en_retard: 'Overdue', derniers_courriers: 'Recent Mail',
    voir_tous: 'View All', notifications: 'Notifications',
    dark_mode: 'Dark Mode', langue_interface: 'Interface Language',
    sauvegarder: 'Save', apparence: 'Appearance',
  },
  ar: {
    dashboard: 'لوحة التحكم', courrier_entrant: 'البريد الوارد',
    courrier_sortant: 'البريد الصادر', archives: 'الأرشيف',
    utilisateurs: 'المستخدمون', services: 'الخدمات',
    workflows: 'مسارات العمل', parametres: 'الإعدادات',
    nouveau_courrier: 'بريد جديد', rechercher: 'بحث...',
    valider: 'تحقق', rejeter: 'رفض', transferer: 'تحويل',
    affecter: 'تعيين', annuler: 'إلغاء', enregistrer: 'حفظ',
    deconnexion: 'خروج', mon_profil: 'ملفي',
    total_courriers: 'إجمالي البريد', en_cours: 'قيد المعالجة',
    en_retard: 'متأخر', derniers_courriers: 'آخر البريد',
    voir_tous: 'عرض الكل', notifications: 'الإشعارات',
    dark_mode: 'الوضع الداكن', langue_interface: 'لغة الواجهة',
    sauvegarder: 'حفظ', apparence: 'المظهر',
  },
  wo: {
    dashboard: 'Tableau de bord', courrier_entrant: 'Limoore bu ngir',
    courrier_sortant: 'Limoore bu dem', archives: 'Dëkk gi',
    utilisateurs: 'Jëfandikukat yi', services: 'Sëriis yi',
    workflows: 'Workflows', parametres: 'Yëglëm',
    nouveau_courrier: 'Limoore bu bees', rechercher: 'Seet...',
    valider: 'Sëtu', rejeter: 'Bañ', transferer: 'Yóbbeel',
    affecter: 'Samp', annuler: 'Dawal', enregistrer: 'Bind',
    deconnexion: 'Génn', mon_profil: 'Sa profil',
    total_courriers: 'Limoore yépp', en_cours: 'Ci kanam',
    en_retard: 'Jàpp ak yoon', derniers_courriers: 'Limoore yu mujj',
    voir_tous: 'Xool yépp', notifications: 'Xam-xam yi',
    dark_mode: 'Reewum guddi', langue_interface: 'Làkk bi',
    sauvegarder: 'Dox', apparence: 'Njiit',
  },
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5B21B6', light: '#7C3AED', dark: '#4C1D95', contrastText: '#fff' },
    secondary: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    background: { default: '#F1F5F9', paper: '#FFFFFF' },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(91,33,182,0.3)' } },
      },
    },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderRadius: 12 } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 600, fontSize: 12, color: '#64748b', backgroundColor: '#F8FAFC' } } },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7C3AED', light: '#9F67FF', dark: '#5B21B6', contrastText: '#fff' },
    secondary: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    success: { main: '#10B981' },
    background: { default: '#0F172A', paper: '#1E293B' },
    text: { primary: '#F1F5F9', secondary: '#94a3b8' },
    divider: '#334155',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h5: { fontWeight: 700 }, h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(124,58,237,0.4)' } },
      },
    },
    MuiCard: { styleOverrides: { root: { boxShadow: '0 1px 8px rgba(0,0,0,0.3)', borderRadius: 12, backgroundImage: 'none' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 600, fontSize: 12, color: '#94a3b8', backgroundColor: '#0F172A' } } },
    MuiOutlinedInput: { styleOverrides: { notchedOutline: { borderColor: '#334155' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none' } } },
    MuiAppBar: { styleOverrides: { root: { backgroundImage: 'none' } } },
  },
});

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [langue, setLangueState] = useState(() => localStorage.getItem('langue') || 'fr');

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('darkMode', String(next));
  };

  const setLangue = (lang: string) => {
    setLangueState(lang);
    localStorage.setItem('langue', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  };

  const t = (key: string): string =>
    translations[langue]?.[key] || translations['fr']?.[key] || key;

  useEffect(() => {
    document.documentElement.setAttribute('lang', langue);
    document.documentElement.setAttribute('dir', langue === 'ar' ? 'rtl' : 'ltr');
  }, [langue]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, langue, setLangue, t }}>
      <MuiThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within AppThemeProvider');
  return ctx;
};
