import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groupsApi } from '../api/groups';
import type { Group } from '../types';
import { formatDate, categoryEmoji } from '../utils/format';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import Avatar from '../components/ui/Avatar';
import AnimatedEmptyState from '../components/animations/AnimatedEmptyState';
import { SkeletonRow } from '../components/animations/LoadingSkeleton';
import { staggerContainer, staggerItem, springTransition } from '../animations/variants';

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    groupsApi.getAll()
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="flex items-center justify-between"
      >
        <h1 className="text-3xl font-extrabold text-slate-900">Groups</h1>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowCreate(true)}
          className="btn-primary shadow-lg shadow-brand-500/20"
        >
          <Plus size={16} /> New group
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="relative"
      >
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </motion.div>

      {/* List */}
      {loading ? (
        <div className="card divide-y divide-slate-50">
          {[...Array(4)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <AnimatedEmptyState
          icon={<Users size={22} />}
          title={search ? 'No groups found' : 'No groups yet'}
          description={search ? 'Try a different search term.' : 'Create your first group to start splitting expenses.'}
          action={
            !search && (
              <button onClick={() => setShowCreate(true)} className="btn-primary">
                Create a group
              </button>
            )
          }
        />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          <AnimatePresence>
            {filtered.map((group) => (
              <motion.div
                key={group._id}
                variants={staggerItem}
                transition={springTransition}
                layout
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="glow-card"
              >
                <Link
                  to={`/app/groups/${group._id}`}
                  className="card p-5 flex items-center gap-4 group block"
                >
                  {/* Emoji */}
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0"
                  >
                    {categoryEmoji[group.category] ?? '📦'}
                  </motion.div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-slate-400 truncate mt-0.5">{group.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-2">
                          {group.members.slice(0, 4).map((m) => (
                            <Avatar key={m._id} name={m.name} size="xs" className="ring-2 ring-white" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 ml-2">
                          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{formatDate(group.updatedAt)}</span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0"
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <CreateGroupModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={(group) => {
          setGroups((prev) => [group, ...prev]);
          setShowCreate(false);
        }}
      />
    </div>
  );
};

export default Groups;
