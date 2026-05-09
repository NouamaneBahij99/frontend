import api from './api';

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

export const notificationService = {
  async getAll(params?: any) {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  async getUnread(params?: any) {
    const response = await api.get('/notifications/unread', { params });
    return response.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread/count');
    return response.data;
  },

  async markAsRead(id: number): Promise<void> {
    await api.post(`/notifications/${id}/mark-as-read`);
  },

  async markAllAsRead(notifications: Notification[]): Promise<void> {
    for (const n of notifications.filter(n => !n.isRead)) {
      await api.post(`/notifications/${n.id}/mark-as-read`);
    }
  },
};
