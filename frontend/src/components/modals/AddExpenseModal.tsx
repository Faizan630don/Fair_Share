import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsApi } from '../../api/groups';
import type { GroupMember, Expense } from '../../types';
import toast from 'react-hot-toast';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: GroupMember[];
  onAdded: (expense: Expense) => void;
}

export default function AddExpenseModal({ isOpen, onClose, groupId, members, onAdded }: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !amount) return;
    setLoading(true);
    try {
      const numAmount = parseFloat(amount);
      const splitShare = numAmount / members.length;
      
      const newExpense = await groupsApi.addExpense(groupId, {
        title,
        amount: numAmount,
        splitType: 'equal',
        participants: members.map(m => ({ user: m._id as any, share: splitShare }))
      });
      toast.success('Expense added!');
      onAdded(newExpense);
      setTitle('');
      setAmount('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-display">Add Expense</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Description</label>
                <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className="label">Amount</label>
                <input type="number" className="input-field" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
              <button 
                className="btn-primary w-full py-2.5"
                onClick={handleSubmit}
                disabled={loading || !title || !amount}
              >
                {loading ? 'Saving...' : 'Save Expense'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
