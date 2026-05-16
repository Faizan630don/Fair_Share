import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, UserPlus, CreditCard, Receipt,
  Trash2, ArrowRight,
} from 'lucide-react';
import { groupsApi } from '../api/groups';
import type { Group, Expense, Settlement, DebtEntry } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate, formatRelative, categoryEmoji } from '../utils/format';
import { PageLoader } from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import AddExpenseModal from '../components/modals/AddExpenseModal';
import SettleUpModal from '../components/modals/SettleUpModal';
import AddMemberModal from '../components/modals/AddMemberModal';
import toast from 'react-hot-toast';

type Tab = 'expenses' | 'balances' | 'settlements';

const GroupDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [simplifiedDebts, setSimplifiedDebts] = useState<DebtEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showSettleUp, setShowSettleUp] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const loadGroup = useCallback(async () => {
    if (!id) return;
    try {
      const [groupData, expenseData, settlementData] = await Promise.all([
        groupsApi.getById(id),
        groupsApi.getExpenses(id),
        groupsApi.getSettlements(id),
      ]);
      setGroup(groupData.group);
      setBalances(groupData.balances);
      setSimplifiedDebts(groupData.simplifiedDebts);
      setExpenses(expenseData.expenses);
      setSettlements(settlementData);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to load group');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadGroup(); }, [loadGroup]);

  const handleDeleteExpense = async (expenseId: string) => {
    if (!window.confirm('Delete this expense? This cannot be undone.')) return;
    try {
      await groupsApi.deleteExpense(id!, expenseId);
      setExpenses((prev) => prev.filter((e) => e._id !== expenseId));
      toast.success('Expense deleted');
      // Refresh balances
      const updated = await groupsApi.getById(id!);
      setBalances(updated.balances);
      setSimplifiedDebts(updated.simplifiedDebts);
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to delete expense');
    }
  };

  if (loading) return <PageLoader />;
  if (!group) return (
    <div className="p-8 text-center">
      <p className="text-surface-500">Group not found.</p>
      <Link to="/app/groups" className="btn-primary mt-4 inline-flex">Back to groups</Link>
    </div>
  );

  const myBalance = balances[user!._id] ?? 0;
  const myDebts = simplifiedDebts.filter((d) => d.from === user!._id);

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'expenses', label: 'Expenses', count: expenses.length },
    { key: 'balances', label: 'Balances' },
    { key: 'settlements', label: 'Settlements', count: settlements.length },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      {/* Back nav */}
      <Link to="/app/groups" className="flex items-center gap-1.5 text-sm text-surface-400 hover:text-surface-700 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to groups
      </Link>

      {/* Group header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl flex-shrink-0">
            {categoryEmoji[group.category] ?? '📦'}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-900 font-display">{group.name}</h1>
            {group.description && <p className="text-surface-400 text-sm mt-0.5">{group.description}</p>}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {group.members.map((m) => (
                <div key={m._id} className="flex items-center gap-1.5 bg-surface-50 border border-surface-100 rounded-full px-2.5 py-1">
                  <Avatar name={m.name} size="xs" />
                  <span className="text-xs font-medium text-surface-700">
                    {m._id === user!._id ? 'You' : m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* My balance summary */}
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-surface-400 mb-1">Your balance</p>
            <p className={`text-2xl font-bold font-display ${myBalance > 0 ? 'text-brand-600' : myBalance < 0 ? 'text-red-500' : 'text-surface-500'}`}>
              {myBalance === 0 ? 'Settled' : formatCurrency(Math.abs(myBalance))}
            </p>
            {myBalance !== 0 && (
              <p className="text-xs text-surface-400 mt-0.5">
                {myBalance > 0 ? 'you are owed' : 'you owe'}
              </p>
            )}
          </div>
        </div>

        {/* Action bar */}
        <div className="flex gap-2 mt-5 pt-5 border-t border-surface-100">
          <button onClick={() => setShowAddExpense(true)} className="btn-primary flex items-center gap-2">
            <Plus size={15} /> Add expense
          </button>
          <button onClick={() => setShowSettleUp(true)} className="btn-secondary flex items-center gap-2">
            <CreditCard size={15} /> Settle up
          </button>
          <button onClick={() => setShowAddMember(true)} className="btn-ghost flex items-center gap-2 ml-auto">
            <UserPlus size={15} /> Add member
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-surface-100 p-1 rounded-xl w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-white text-surface-900 shadow-card'
                : 'text-surface-500 hover:text-surface-700'
            }`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-brand-100 text-brand-700' : 'bg-surface-200 text-surface-500'}`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Expenses tab ───────────────────────────────────── */}
      {activeTab === 'expenses' && (
        <div className="card divide-y divide-surface-50">
          {expenses.length === 0 ? (
            <EmptyState
              icon={<Receipt size={22} />}
              title="No expenses yet"
              description="Add your first expense to start tracking."
              action={<button onClick={() => setShowAddExpense(true)} className="btn-primary">Add expense</button>}
            />
          ) : (
            expenses.map((expense) => {
              const myShare = expense.participants.find((p) => p.user._id === user!._id)?.share ?? 0;
              const iPaid = expense.paidBy._id === user!._id;

              return (
                <div key={expense._id} className="flex items-center gap-4 p-5 group hover:bg-surface-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Receipt size={18} className="text-blue-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-surface-900">{expense.title}</p>
                      <span className="text-xs text-surface-400 capitalize">{expense.splitType} split</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-surface-400">
                        {iPaid ? 'You paid' : `${expense.paidBy.name} paid`} {formatCurrency(expense.amount)}
                      </span>
                      <span className="text-surface-300 text-xs">·</span>
                      <span className="text-xs text-surface-400">{formatDate(expense.date)}</span>
                    </div>
                    {expense.notes && (
                      <p className="text-xs text-surface-400 italic mt-0.5">"{expense.notes}"</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    {iPaid ? (
                      <>
                        <p className="amount-positive text-sm">{formatCurrency(expense.amount - myShare)}</p>
                        <p className="text-xs text-surface-400">you lent</p>
                      </>
                    ) : myShare > 0 ? (
                      <>
                        <p className="amount-negative text-sm">{formatCurrency(myShare)}</p>
                        <p className="text-xs text-surface-400">your share</p>
                      </>
                    ) : (
                      <p className="text-xs text-surface-300">not involved</p>
                    )}
                  </div>

                  {/* Delete — only for the creator */}
                  {expense.createdBy._id === user!._id && (
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-surface-300 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Delete expense"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Balances tab ───────────────────────────────────── */}
      {activeTab === 'balances' && (
        <div className="space-y-4">
          {/* Simplified debts */}
          <div className="card">
            <div className="p-5 border-b border-surface-100">
              <h3 className="font-semibold text-surface-900">Simplified debts</h3>
              <p className="text-xs text-surface-400 mt-0.5">Minimum transactions to settle everything</p>
            </div>
            <div className="divide-y divide-surface-50">
              {simplifiedDebts.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="font-semibold text-surface-800">All settled up!</p>
                  <p className="text-sm text-surface-400 mt-1">No outstanding balances in this group.</p>
                </div>
              ) : (
                simplifiedDebts.map((debt, idx) => (
                  <div key={idx} className={`flex items-center gap-4 p-4 ${debt.from === user!._id ? 'bg-red-50/50' : debt.to === user!._id ? 'bg-brand-50/50' : ''}`}>
                    <Avatar name={debt.fromName} size="sm" />
                    <div className="flex-1 flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold ${debt.from === user!._id ? 'text-red-600' : 'text-surface-800'}`}>
                        {debt.from === user!._id ? 'You' : debt.fromName}
                      </span>
                      <ArrowRight size={14} className="text-surface-300" />
                      <span className={`text-sm font-semibold ${debt.to === user!._id ? 'text-brand-600' : 'text-surface-800'}`}>
                        {debt.to === user!._id ? 'You' : debt.toName}
                      </span>
                    </div>
                    <Avatar name={debt.toName} size="sm" />
                    <span className={`font-bold text-sm ${debt.from === user!._id ? 'amount-negative' : 'amount-positive'}`}>
                      {formatCurrency(debt.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Per-member raw balances */}
          <div className="card">
            <div className="p-5 border-b border-surface-100">
              <h3 className="font-semibold text-surface-900">Member balances</h3>
            </div>
            <div className="divide-y divide-surface-50">
              {group.members.map((member) => {
                const bal = balances[member._id] ?? 0;
                return (
                  <div key={member._id} className="flex items-center gap-3 p-4">
                    <Avatar name={member.name} size="sm" />
                    <span className="flex-1 text-sm font-medium text-surface-800">
                      {member._id === user!._id ? 'You' : member.name}
                    </span>
                    <span className={`text-sm font-semibold ${bal > 0 ? 'amount-positive' : bal < 0 ? 'amount-negative' : 'text-surface-400'}`}>
                      {bal === 0 ? 'Settled' : `${bal > 0 ? '+' : ''}${formatCurrency(bal)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Settlements tab ─────────────────────────────────── */}
      {activeTab === 'settlements' && (
        <div className="card divide-y divide-surface-50">
          {settlements.length === 0 ? (
            <EmptyState
              icon={<CreditCard size={22} />}
              title="No settlements yet"
              description="Record a payment to settle debts in this group."
              action={<button onClick={() => setShowSettleUp(true)} className="btn-primary">Settle up</button>}
            />
          ) : (
            settlements.map((s) => (
              <div key={s._id} className="flex items-center gap-4 p-5">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard size={18} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800">
                    <span className={s.paidBy._id === user!._id ? 'text-red-600' : 'text-surface-800'}>
                      {s.paidBy._id === user!._id ? 'You' : s.paidBy.name}
                    </span>
                    {' paid '}
                    <span className={s.paidTo._id === user!._id ? 'text-brand-600' : 'text-surface-800'}>
                      {s.paidTo._id === user!._id ? 'you' : s.paidTo.name}
                    </span>
                  </p>
                  {s.notes && <p className="text-xs text-surface-400 italic mt-0.5">"{s.notes}"</p>}
                  <p className="text-xs text-surface-400 mt-0.5">{formatRelative(s.createdAt)}</p>
                </div>
                <span className="amount-positive font-semibold text-sm">{formatCurrency(s.amount)}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <AddExpenseModal
        isOpen={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        groupId={id!}
        members={group.members}
        onAdded={(expense) => {
          setExpenses((prev) => [expense, ...prev]);
          groupsApi.getById(id!).then((d) => { setBalances(d.balances); setSimplifiedDebts(d.simplifiedDebts); });
        }}
      />
      <SettleUpModal
        isOpen={showSettleUp}
        onClose={() => setShowSettleUp(false)}
        groupId={id!}
        members={group.members}
        debts={myDebts}
        currentUserId={user!._id}
        onSettled={(settlement) => {
          setSettlements((prev) => [settlement, ...prev]);
          groupsApi.getById(id!).then((d) => { setBalances(d.balances); setSimplifiedDebts(d.simplifiedDebts); });
        }}
      />
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        groupId={id!}
        onAdded={setGroup}
      />
    </div>
  );
};

export default GroupDetail;
