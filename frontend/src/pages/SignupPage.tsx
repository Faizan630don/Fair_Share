import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wallet, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import { springTransition, staggerContainer, staggerItem } from '../animations/variants';

const perks = [
  'Split expenses equally or custom',
  'Track balances in real time',
  'Settle debts with one tap',
  'Works for trips, roommates, and more',
];

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const { token, user } = await authApi.signup(name, email, password);
      login(token, user);
      toast.success(`Welcome, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/app/dashboard');
    } catch (err: any) {
      toast.error(err.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      <AnimatedBackground />

      {/* Left form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springTransition, delay: 0.15 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 text-brand-600 mb-8">
            <Wallet className="w-7 h-7" />
            <span className="text-xl font-bold gradient-text">FairShare</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create account</h1>
            <p className="text-slate-500">Get started — it's completely free.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full name', type: 'text', value: name, set: setName, placeholder: 'Faizan Khan', delay: 0.25 },
              { label: 'Email address', type: 'email', value: email, set: setEmail, placeholder: 'you@example.com', delay: 0.32 },
            ].map(({ label, type, value, set, placeholder, delay }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ ...springTransition, delay }}
              >
                <label className="label">{label}</label>
                <input
                  type={type}
                  className="input-field"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => set(e.target.value)}
                />
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springTransition, delay: 0.39 }}
            >
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springTransition, delay: 0.47 }}
            >
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="btn-primary w-full py-3 text-base shadow-lg shadow-brand-500/25 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating account…
                  </span>
                ) : (
                  <>Create account <ArrowRight size={18} /></>
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-center mt-6 text-sm text-slate-500"
          >
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>

      {/* Right branding panel */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900/90 backdrop-blur-xl p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.1) 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 flex items-center gap-3">
          <Wallet className="w-9 h-9 text-brand-400" />
          <span className="text-2xl font-bold text-white">FairShare</span>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="relative z-10 space-y-8"
        >
          <motion.h2 variants={staggerItem} transition={springTransition}
            className="text-5xl font-extrabold text-white leading-tight"
          >
            Everything included,<br />
            <span className="gradient-text">always free.</span>
          </motion.h2>

          <motion.ul variants={staggerContainer} className="space-y-4">
            {perks.map((perk, i) => (
              <motion.li
                key={perk}
                variants={staggerItem}
                transition={{ ...springTransition, delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springTransition, delay: 0.5 + i * 0.1 }}
                  className="w-6 h-6 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center flex-shrink-0"
                >
                  <Check size={13} className="text-brand-400" />
                </motion.div>
                <span className="text-slate-300 text-sm">{perk}</span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        <p className="relative z-10 text-slate-600 text-sm">© 2025 FairShare</p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
