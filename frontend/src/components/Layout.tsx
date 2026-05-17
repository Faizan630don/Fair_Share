import { useState, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Menu, Wallet, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import AnimatedBackground from './animations/AnimatedBackground';
import ScrollProgressBar from './animations/ScrollProgressBar';
import { fadeUp, springTransition } from '../animations/variants';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/app/dashboard' },
  { icon: Users, label: 'Groups', path: '/app/groups' },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative">
      <AnimatedBackground />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : (window.innerWidth < 1024 ? -256 : 0) }}
        transition={{ type: 'spring', damping: 28, stiffness: 240 }}
        className="fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col
                   bg-white/80 backdrop-blur-xl border-r border-slate-200/60"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
          <motion.div
            className="flex items-center gap-2.5 text-brand-600"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Wallet className="w-8 h-8" />
            </motion.div>
            <span className="text-xl font-bold tracking-tight gradient-text">FairShare</span>
          </motion.div>
          <button className="lg:hidden p-1 text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User pill */}
        {user && (
          <div className="mx-4 mt-4 px-3 py-2.5 rounded-xl bg-brand-50 border border-brand-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user.name[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-brand-50 rounded-xl border border-brand-100"
                    initial={false}
                    transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className={`relative z-10 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}
                >
                  <item.icon size={20} />
                </motion.div>
                <span className={`relative z-10 text-sm ${isActive ? 'text-brand-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-100">
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-slate-500
                       hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <motion.div
              whileHover={{ rotate: -15 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            </motion.div>
            <span className="text-sm">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex-none h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 flex items-center px-4 justify-between z-10">
          <div className="flex items-center gap-2 text-brand-600">
            <Wallet className="w-6 h-6" />
            <span className="font-bold gradient-text">FairShare</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </header>

        {/* Page content with transition */}
        <div 
          ref={scrollContainerRef} 
          className="flex-1 overflow-y-auto overflow-x-hidden relative"
        >
          <ScrollProgressBar container={scrollContainerRef} />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={fadeUp}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ ...springTransition, delay: 0.04 }}
              className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 min-h-full will-change-transform"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
