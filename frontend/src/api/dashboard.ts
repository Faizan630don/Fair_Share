import { api } from './axios';
import type { DashboardData } from '../types';

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const { data } = await api.get('/groups/dashboard');
    return data;
  }
};
