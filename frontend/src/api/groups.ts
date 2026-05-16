import { api } from './axios';
import type { Group, Expense, Settlement } from '../types';

export const groupsApi = {
  getAll: async (): Promise<Group[]> => {
    const { data } = await api.get('/groups');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/groups/${id}`);
    return data;
  },
  create: async (group: Partial<Group>): Promise<Group> => {
    const { data } = await api.post('/groups', group);
    return data;
  },
  addMember: async (id: string, email: string): Promise<Group> => {
    const { data } = await api.post(`/groups/${id}/members`, { email });
    return data;
  },
  getExpenses: async (id: string) => {
    const { data } = await api.get(`/groups/${id}/expenses`);
    return data;
  },
  addExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    const { data } = await api.post(`/groups/${id}/expenses`, expense);
    return data;
  },
  deleteExpense: async (groupId: string, expenseId: string) => {
    await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
  },
  getSettlements: async (id: string): Promise<Settlement[]> => {
    const { data } = await api.get(`/groups/${id}/settlements`);
    return data;
  },
  settleUp: async (id: string, settlement: { amount: number, paidTo: string }): Promise<Settlement> => {
    const { data } = await api.post(`/groups/${id}/settlements`, settlement);
    return data;
  }
};
