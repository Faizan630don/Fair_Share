import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Wallet, Users, ChevronRight, Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { dashboardApi } from '../api/dashboard';
import type { DashboardData } from '../types';
import { useAuth } from '../context/AuthContext';
import ActivityItem from '../components/ui/ActivityItem';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import CountUpNumber from '../components/animations/CountUpNumber';
import { staggerContainer, staggerItem, springTransition } from '../animations/variants';
import AnimatedEmptyState from '../components/animations/AnimatedEmptyState';
import { SkeletonCard } from '../components/animations/LoadingSkeleton';

interface StatCardProps {
  label: string;
  value: number;
  subtext: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  delay: number;
  prefix?: string;
}

function StatCard({ label, value, subtext, icon, iconBg, valueColor, delay, prefix = '₹' }: StatCardProps) {
  return (
    <motion.div
      variants={staggerItem}
      transition={{ ...springTransition, delay }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.2 } }}
      className="glow-card bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100/80 p-5 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <motion.div
          whileHover={{ scale: 1.2, rotate: 10 }}
          className={`p-2 rounded-xl ${iconBg} transition-transform`}
        >
          {icon}
        </motion.div>
      </div>
      <h3 className={`text-2xl font-extrabold font-display ${valueColor}`}>
        <CountUpNumber
          value={value}
          formatter={(n) => `${prefix}${Math.round(n).toLocaleString('en-IN')}`}
          duration={1.4}
        />
      </h3>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </motion.div>
  );
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    dashboardApi.get()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <SkeletonCard className="h-64" />
    </div>
  );

  const netBalance = data?.totalBalance ?? 0;

  const stats: StatCardProps[] = [
    {
      label: 'Net balance',
      value: Math.abs(netBalance),
      subtext: netBalance >= 0 ? 'You are owed overall' : 'You owe overall',
      icon: <Wallet size={20} className={netBalance >= 0 ? 'text-brand-600' : 'text-red-500'} />,
      iconBg: netBalance >= 0 ? 'bg-brand-100' : 'bg-red-100',
      valueColor: netBalance >= 0 ? 'text-brand-600' : 'text-red-500',
      delay: 0.1,
    },
    {
      label: 'You are owed',
      value: data?.totalOwed ?? 0,
      subtext: 'Across all groups',
      icon: <TrendingUp size={20} className="text-brand-600" />,
      iconBg: 'bg-brand-100',
      valueColor: 'text-brand-600',
      delay: 0.18,
    },
    {
      label: 'You owe',
      value: data?.totalOwing ?? 0,
      subtext: 'Across all groups',
      icon: <TrendingDown size={20} className="text-red-500" />,
      iconBg: 'bg-red-100',
      valueColor: 'text-red-500',
      delay: 0.26,
    },
    {
      label: 'Groups',
      value: data?.groupCount ?? 0,
      subtext: 'Active groups',
      icon: <Users size={20} className="text-violet-600" />,
      iconBg: 'bg-violet-100',
      valueColor: 'text-violet-600',
      prefix: '',
      delay: 0.34,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="flex items-center justify-between"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...springTransition, delay: 0.05 }}
            className="flex items-center gap-2 mb-1"
          >
            <Sparkles size={16} className="text-brand-500" />
            <p className="text-sm text-slate-400 font-medium">Good day,</p>
          </motion.div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            {user?.name?.split(' ')[0]} 👋
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreateGroup(true)}
          className="btn-primary shadow-lg shadow-brand-500/20"
        >
          <Plus size={16} /> New group
        </motion.button>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </motion.div>

      {/* Activity feed */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ ...springTransition, delay: 0.45 }}
        className="card"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          <Link to="/app/groups" className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
            View groups <ChevronRight size={14} />
          </Link>
        </div>

        <div className="divide-y divide-slate-50">
          {!data?.recentActivity?.length ? (
            <AnimatedEmptyState
              icon={<TrendingUp size={22} />}
              title="No activity yet"
              description="Create a group and add your first expense."
              action={
                <button onClick={() => setShowCreateGroup(true)} className="btn-primary">
                  Create a group
                </button>
              }
            />
          ) : (
            data.recentActivity.map((activity, i) => (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay: 0.5 + i * 0.06 }}
                whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)', x: 2, transition: { duration: 0.15 } }}
                className="px-6"
              >
                <ActivityItem
                  activity={activity}
                  currentUserId={user?._id ?? ''}
                />
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreated={(group) => {
          setShowCreateGroup(false);
          navigate(`/app/groups/${group._id}`);
        }}
      />
    </div>
  );
};

export default Dashboard;
