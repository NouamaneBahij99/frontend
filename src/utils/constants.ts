export const API_URL = 'http://localhost:8080/api/v1';

export const ROLES = {
  ADMIN: 'ADMIN',
  AGENT: 'AGENT',
  CHEF_SERVICE: 'CHEF_SERVICE',
  DIRECTEUR: 'DIRECTEUR',
} as const;

export const STATUTS = {
  NOUVEAU: 'NOUVEAU',
  EN_COURS: 'EN_COURS',
  VALIDE: 'VALIDE',
  REJETE: 'REJETE',
  ARCHIVE: 'ARCHIVE',
} as const;

export const TYPES_COURRIER = {
  ENTRANT: 'ENTRANT',
  SORTANT: 'SORTANT',
} as const;

export const PRIORITES = {
  BASSE: 'BASSE',
  NORMALE: 'NORMALE',
  HAUTE: 'HAUTE',
  URGENTE: 'URGENTE',
} as const;

export const STATUS_COLORS: Record<string, string> = {
  NOUVEAU: '#3B82F6',
  EN_COURS: '#F59E0B',
  VALIDE: '#10B981',
  REJETE: '#EF4444',
  ARCHIVE: '#6B7280',
};

export const PRIORITE_COLORS: Record<string, string> = {
  BASSE: '#10B981',
  NORMALE: '#3B82F6',
  HAUTE: '#F59E0B',
  URGENTE: '#EF4444',
};

export default {
  API_URL,
  ROLES,
  STATUTS,
  TYPES_COURRIER,
  PRIORITES,
  STATUS_COLORS,
  PRIORITE_COLORS,
};
