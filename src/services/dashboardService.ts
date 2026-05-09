import api from './api';

export interface Statistics {
  totalCourriers: number;
  courriersEntrants: number;
  courriersSortants: number;
  courriersEnCours: number;
  courriersValidés: number;
  courriersRejetés: number;
  courriersArchivés: number;
  courriersUrgents: number;
}

export const dashboardService = {
  async getStatistics(): Promise<Statistics> {
    const response = await api.get('/dashboard/statistics');
    return response.data;
  },
};
