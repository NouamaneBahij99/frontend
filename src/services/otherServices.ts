import api from './api';

export const userService = {
  getAll: (params?: any) => api.get('/users', { params }),
  getMe: () => api.get('/users/me'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  disable: (id: number) => api.post(`/users/${id}/disable`),
  enable: (id: number) => api.post(`/users/${id}/enable`),
  changePassword: (id: number, data: any) => api.post(`/users/${id}/change-password`, data),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard/statistics'),
};

export const notificationService = {
  getAll: (userId: number, params?: any) => api.get('/notifications', { params: { userId, ...params } }),
  getUnread: (userId: number) => api.get('/notifications/unread', { params: { userId } }),
  getUnreadCount: (userId: number) => api.get('/notifications/unread/count', { params: { userId } }),
  markAsRead: (id: number) => api.post(`/notifications/${id}/mark-as-read`),
};

export const organisationService = {
  getAll: () => api.get('/organisation'),
  getRacines: () => api.get('/organisation/racines'),
  getById: (id: number) => api.get(`/organisation/${id}`),
  create: (data: any) => api.post('/organisation', data),
  update: (id: number, data: any) => api.put(`/organisation/${id}`, data),
  delete: (id: number) => api.delete(`/organisation/${id}`),
};

export const workflowService = {
  getAll: () => api.get('/workflows'),
  getById: (id: number) => api.get(`/workflows/${id}`),
  create: (data: any) => api.post('/workflows', data),
  update: (id: number, data: any) => api.put(`/workflows/${id}`, data),
  ajouterEtape: (id: number, data: any) => api.post(`/workflows/${id}/etapes`, data),
  supprimerEtape: (workflowId: number, etapeId: number) =>
    api.delete(`/workflows/${workflowId}/etapes/${etapeId}`),
  reorganiser: (id: number, etapeIds: number[]) =>
    api.put(`/workflows/${id}/etapes/reorganiser`, etapeIds),
};
