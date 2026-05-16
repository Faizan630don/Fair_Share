import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Expense } from '../models/Expense';
import { Settlement } from '../models/Settlement';

export const addExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, amount, splitType, participants, notes } = req.body;
    const expense = new Expense({
      title, amount, splitType, participants, notes,
      group: req.params.id as string,
      paidBy: req.user!.userId,
      createdBy: req.user!.userId
    });
    await expense.save();
    await expense.populate(['paidBy', 'createdBy', 'participants.user']);
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expenses = await Expense.find({ group: req.params.id })
      .populate(['paidBy', 'createdBy', 'participants.user'])
      .sort({ date: -1 });
    res.status(200).json({ expenses });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.expenseId, group: req.params.id, createdBy: req.user!.userId });
    res.status(200).json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const settleUp = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, paidTo } = req.body;
    const settlement = new Settlement({
      group: req.params.id as string,
      paidBy: req.user!.userId,
      paidTo,
      amount
    });
    await settlement.save();
    await settlement.populate(['paidBy', 'paidTo']);
    res.status(201).json(settlement);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getSettlements = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const settlements = await Settlement.find({ group: req.params.id })
      .populate(['paidBy', 'paidTo'])
      .sort({ createdAt: -1 });
    res.status(200).json(settlements);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
