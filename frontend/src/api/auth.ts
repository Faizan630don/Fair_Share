import { api } from './axios';

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  signup: async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/signup', { name, email, password });
    return data;
  },
};
