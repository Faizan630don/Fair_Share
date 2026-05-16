export interface DashboardData {
  totalBalance: number;
  totalOwed: number;
  totalOwing: number;
  groupCount: number;
  recentActivity: Activity[];
}

export interface Activity {
  _id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  payerId: string;
  payeeId: string;
}

export interface GroupMember {
  _id: string;
  name: string;
  email: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: GroupMember[];
  updatedAt: string;
}

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  date: string;
  paidBy: GroupMember;
  createdBy: GroupMember;
  splitType: 'equal' | 'exact' | 'percentage';
  participants: { user: GroupMember; share: number }[];
  notes?: string;
}

export interface Settlement {
  _id: string;
  paidBy: GroupMember;
  paidTo: GroupMember;
  amount: number;
  createdAt: string;
  notes?: string;
}

export interface DebtEntry {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}
