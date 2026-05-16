import { Router } from 'express';
import { createGroup, getGroups, getGroupById, addMember, getDashboardData } from '../controllers/groupController';
import { addExpense, getExpenses, deleteExpense, settleUp, getSettlements } from '../controllers/expenseController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);

router.get('/dashboard', getDashboardData);

router.post('/', createGroup);
router.get('/', getGroups);
router.get('/:id', getGroupById);
router.post('/:id/members', addMember);

router.post('/:id/expenses', addExpense);
router.get('/:id/expenses', getExpenses);
router.delete('/:id/expenses/:expenseId', deleteExpense);

router.post('/:id/settlements', settleUp);
router.get('/:id/settlements', getSettlements);

export default router;
