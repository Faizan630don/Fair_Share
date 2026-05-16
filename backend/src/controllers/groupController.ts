import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Group } from '../models/Group';
import { Expense } from '../models/Expense';
import { Settlement } from '../models/Settlement';
import { User } from '../models/User';

// Helper to calculate balances and simplify debts
const calculateGroupFinancials = async (groupId: string) => {
  const expenses = await Expense.find({ group: groupId }).populate('paidBy').populate('participants.user');
  const settlements = await Settlement.find({ group: groupId }).populate('paidBy').populate('paidTo');
  
  const balances: Record<string, number> = {};
  
  expenses.forEach(exp => {
    const paidById = (exp.paidBy as any)._id.toString();
    balances[paidById] = (balances[paidById] || 0) + exp.amount;
    exp.participants.forEach(p => {
      const pId = (p.user as any)._id.toString();
      balances[pId] = (balances[pId] || 0) - p.share;
    });
  });

  settlements.forEach(settle => {
    const fromId = (settle.paidBy as any)._id.toString();
    const toId = (settle.paidTo as any)._id.toString();
    balances[fromId] = (balances[fromId] || 0) + settle.amount;
    balances[toId] = (balances[toId] || 0) - settle.amount;
  });

  // Simplify debts
  const debtors: { id: string, amount: number }[] = [];
  const creditors: { id: string, amount: number }[] = [];
  
  for (const [id, bal] of Object.entries(balances)) {
    if (bal < -0.01) debtors.push({ id, amount: Math.abs(bal) });
    else if (bal > 0.01) creditors.push({ id, amount: bal });
  }
  
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);
  
  const simplifiedDebts = [];
  let d = 0, c = 0;
  while (d < debtors.length && c < creditors.length) {
    const amount = Math.min(debtors[d].amount, creditors[c].amount);
    simplifiedDebts.push({
      from: debtors[d].id,
      to: creditors[c].id,
      amount
    });
    debtors[d].amount -= amount;
    creditors[c].amount -= amount;
    if (debtors[d].amount < 0.01) d++;
    if (creditors[c].amount < 0.01) c++;
  }

  // Add names to simplified debts
  const populatedDebts = await Promise.all(simplifiedDebts.map(async d => {
    const fromUser = await User.findById(d.from);
    const toUser = await User.findById(d.to);
    return {
      ...d,
      fromName: fromUser?.name || 'Unknown',
      toName: toUser?.name || 'Unknown'
    };
  }));

  return { balances, simplifiedDebts: populatedDebts };
};

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, category } = req.body;
    const group = await Group.create({
      name, description, category,
      members: [req.user!.userId],
      createdBy: req.user!.userId
    });
    await group.populate('members', 'name email');
    res.status(201).json(group);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groups = await Group.find({ members: req.user!.userId })
      .populate('members', 'name email')
      .sort({ updatedAt: -1 });
    res.status(200).json(groups);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'name email');
    if (!group) { res.status(404).json({ message: 'Group not found' }); return; }
    const financials = await calculateGroupFinancials(req.params.id as string);
    res.status(200).json({ group, balances: financials.balances, simplifiedDebts: financials.simplifiedDebts });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    
    const group = await Group.findById(req.params.id);
    if (!group) { res.status(404).json({ message: 'Group not found' }); return; }
    
    if (!group.members.includes(user._id as any)) {
      group.members.push(user._id as any);
      await group.save();
    }
    await group.populate('members', 'name email');
    res.status(200).json(group);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardData = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const groups = await Group.find({ members: userId });
    let totalOwed = 0;
    let totalOwing = 0;
    
    for (const group of groups) {
      const { balances } = await calculateGroupFinancials(group._id.toString());
      const myBal = balances[userId] || 0;
      if (myBal > 0) totalOwed += myBal;
      else if (myBal < 0) totalOwing += Math.abs(myBal);
    }

    const expenses = await Expense.find({ 'participants.user': userId })
      .populate('paidBy', 'name email')
      .populate('group', 'name')
      .sort({ date: -1 }).limit(5);

    const recentActivity = expenses.map(e => {
      const myShare = e.participants.find(p => p.user?.toString() === userId)?.share || 0;
      const iPaid = e.paidBy._id.toString() === userId;
      return {
        _id: e._id,
        type: 'expense',
        description: e.title,
        amount: iPaid ? (e.amount - myShare) : myShare,
        date: e.date,
        payerId: e.paidBy._id,
        payeeId: 'group'
      };
    });

    res.status(200).json({
      totalBalance: totalOwed - totalOwing,
      totalOwed,
      totalOwing,
      groupCount: groups.length,
      recentActivity
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
