import { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsApi } from '../../api/groups';
import type { GroupMember, DebtEntry, Settlement } from '../../types';
import toast from 'react-hot-toast';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: GroupMember[];
  debts: DebtEntry[];
  currentUserId: string;
  onSettled: (settlement: Settlement) => void;
}

export default function SettleUpModal({ isOpen, onClose, groupId, members, debts, currentUserId, onSettled }: SettleUpModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill with suggested debt amount when a member is selected
  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId);
    const debt = debts.find(d => d.to === memberId);
    if (debt) setAmount(debt.amount.toFixed(2));
    else setAmount('');
  };

  // Other members (excluding current user)
  const otherMembers = members.filter(m => m._id !== currentUserId);

  const handleSubmit = async () => {
    if (!amount || !selectedMemberId) {
      toast.error('Please select a member and enter an amount');
      return;
    }
    setLoading(true);
    try {
      const settlement = await groupsApi.settleUp(groupId, {
        amount: parseFloat(amount),
        paidTo: selectedMemberId
      });
      toast.success('Settlement recorded! 🎉');
      onSettled(settlement);
      setAmount('');
      setSelectedMemberId('');
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to record settlement');
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
              <h2 className="text-xl font-bold">Settle Up</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Who are you paying? */}
              <div>
                <label className="label">Pay to</label>
                <select
                  className="input-field"
                  value={selectedMemberId}
                  onChange={(e) => handleMemberChange(e.target.value)}
                >
                  <option value="">Select a member...</option>
                  {otherMembers.map(m => {
                    const debt = debts.find(d => d.to === m._id);
                    return (
                      <option key={m._id} value={m._id}>
                        {m.name}{debt ? ` (you owe ${debt.amount.toFixed(2)})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="label">Amount</label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <button
                className="btn-primary w-full py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={loading || !amount || !selectedMemberId}
              >
                {loading ? 'Recording...' : 'Record Payment'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
