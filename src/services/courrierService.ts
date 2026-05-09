import api from './api';

export const courrierService = {
  getAll: (params?: any) => api.get('/courriers', { params }),
  getById: (id: number) => api.get(`/courriers/${id}`),
  create: (formData: FormData) => api.post('/courriers', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, data: any) => api.put(`/courriers/${id}`, data),
  affecter: (id: number, userId: number) => api.put(`/courriers/${id}/affecter/${userId}`),
  transferer: (id: number, userId: number, commentaire?: string) =>
    api.put(`/courriers/${id}/transferer/${userId}`, null, { params: { commentaire } }),
  valider: (id: number, commentaire?: string) =>
    api.put(`/courriers/${id}/valider`, null, { params: { commentaire } }),
  rejeter: (id: number, motif: string) =>
    api.put(`/courriers/${id}/rejeter`, null, { params: { motif } }),
  archiver: (id: number) => api.put(`/courriers/${id}/archiver`),
  getCircuit: (id: number) => api.get(`/courriers/${id}/circuit`),
  getHistorique: (id: number) => api.get(`/courriers/${id}/historique`),
  getPdf: (id: number) => api.get(`/courriers/${id}/pdf`, { responseType: 'blob' }),
};
