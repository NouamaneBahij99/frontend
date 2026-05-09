export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  service?: string;
  noeudId?: number;
  noeudNom?: string;
  enabled: boolean;
  accountNonLocked: boolean;
  lastLogin?: string;
  createdAt: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  CHEF_SERVICE = 'CHEF_SERVICE',
  DIRECTEUR = 'DIRECTEUR'
}

export interface Courrier {
  id: number;
  numero: string;
  objet: string;
  contenu?: string;
  expediteur: string;
  destinataire: string;
  type: TypeCourrier;
  statut: StatutCourrier;
  priorite: Priorite;
  fichierNom?: string;
  fichierPath?: string;
  createurNom?: string;
  assigneANom?: string;
  etapeCouranteNom?: string;
  workflowNom?: string;
  archive: boolean;
  createdAt: string;
  updatedAt: string;
  historiques?: HistoriqueCourrier[];
}

export interface HistoriqueCourrier {
  id: number;
  userNom: string;
  action: string;
  commentaire?: string;
  date: string;
}

export enum TypeCourrier {
  ENTRANT = 'ENTRANT',
  SORTANT = 'SORTANT'
}

export enum StatutCourrier {
  NOUVEAU = 'NOUVEAU',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ARCHIVE = 'ARCHIVE'
}

export enum Priorite {
  BASSE = 'BASSE',
  NORMALE = 'NORMALE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export interface Notification {
  id: number;
  titre: string;
  message: string;
  lien?: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface DashboardStats {
  totalCourriers: number;
  courriersEntrants: number;
  courriersSortants: number;
  courriersEnCours: number;
  courriersValidés: number;
  courriersRejetés: number;
  courriersArchivés: number;
  courriersUrgents: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
  nom: string;
  prenom: string;
  userId: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface NoeudOrganisation {
  id: number;
  nom: string;
  description?: string;
  type: TypeNoeud;
  parentId?: number;
  parentNom?: string;
  ordre: number;
  actif: boolean;
  enfants?: NoeudOrganisation[];
  createdAt: string;
}

export enum TypeNoeud {
  SERVICE = 'SERVICE',
  DIRECTION = 'DIRECTION',
  DEPARTEMENT = 'DEPARTEMENT',
  POSTE = 'POSTE'
}

export interface WorkflowConfig {
  id: number;
  nom: string;
  description?: string;
  typeCourrier?: TypeCourrier;
  actif: boolean;
  defaut: boolean;
  etapes: EtapeWorkflow[];
  createdAt: string;
}

export interface EtapeWorkflow {
  id: number;
  nom: string;
  ordre: number;
  noeudId?: number;
  noeudNom?: string;
  roleRequis?: Role;
  description?: string;
  obligatoire: boolean;
}

export interface CircuitEtape {
  etapeId: number;
  etapeNom: string;
  ordre: number;
  noeudNom?: string;
  statut: StatutEtape;
  responsableNom?: string;
  commentaire?: string;
  dateTraitement?: string;
  courante: boolean;
}

export enum StatutEtape {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  IGNORE = 'IGNORE'
}