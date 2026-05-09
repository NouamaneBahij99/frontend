import api from './api';

export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  service?: string;
  enabled: boolean;
  accountNonLocked: boolean;
  lastLogin?: string;
  createdAt?: string;
}

export const userService = {
  async getAll(params?: any) {
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/users/me');
    return response.data;
  },

  async getById(id: number): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async update(id: number, data: any): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async changePassword(id: number, data: any): Promise<void> {
    await api.post(`/users/${id}/change-password`, data);
  },

  async enable(id: number): Promise<void> {
    await api.post(`/users/${id}/enable`);
  },

  async disable(id: number): Promise<void> {
    await api.post(`/users/${id}/disable`);
  },

  async register(data: any): Promise<any> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};
