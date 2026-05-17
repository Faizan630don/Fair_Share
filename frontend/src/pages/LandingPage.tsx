import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Wallet, ArrowRight, Users, Receipt, TrendingUp, Shield, Zap, Star } from 'lucide-react';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import ScrollProgressBar from '../components/animations/ScrollProgressBar';
import ScrollReveal from '../components/animations/ScrollReveal';
import RevealText from '../components/animations/RevealText';
import ScrollAnimatedCards from '../components/animations/ScrollAnimatedCards';
import StickyFeatureShowcase from '../components/animations/StickyFeatureShowcase';
import { staggerContainer, staggerItem, springTransition, fadeUp } from '../animations/variants';

const features = [
  { icon: Users, title: 'Split with Anyone', desc: 'Add friends, family or roommates to any group instantly.' },
  { icon: Receipt, title: 'Track Every Expense', desc: 'Equal or custom splits — every rupee accounted for.' },
  { icon: TrendingUp, title: 'Smart Balances', desc: 'Simplified debt algorithm minimizes total transactions.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication keeps your data safe at all times.' },
  { icon: Zap, title: 'Instant Settlements', desc: 'Record payments and clear debts in one tap.' },
  { icon: Star, title: 'Beautiful Design', desc: 'A premium experience that feels like a top SaaS product.' },
];

const stats = [
  { value: '50K+', label: 'Active users' },
  { value: '₹2Cr+', label: 'Expenses tracked' },
  { value: '10K+', label: 'Groups created' },
  { value: '99.9%', label: 'Uptime' },
];

// Floating mock expense cards
const mockExpenses = [
  { title: 'Hotel — Goa', amount: '₹3,200', paid: 'Faizan', color: 'bg-brand-50 border-brand-100' },
  { title: 'Dinner', amount: '₹850', paid: 'Rahul', color: 'bg-violet-50 border-violet-100' },
  { title: 'Cab', amount: '₹420', paid: 'You', color: 'bg-sky-50 border-sky-100' },
];

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const { scrollYProgress: featuresScroll } = useScroll({ target: featuresRef, offset: ['start end', 'end start'] });
  const featuresOpacity = useTransform(featuresScroll, [0.7, 0.95], [1, 0]);
  const featuresScale = useTransform(featuresScroll, [0.7, 0.95], [1, 0.9]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ScrollProgressBar />
      <AnimatedBackground />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/60 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 text-brand-600">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            <Wallet className="w-7 h-7" />
          </motion.div>
          <span className="text-xl font-bold gradient-text">FairShare</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors px-3 py-2 rounded-lg hover:bg-brand-50">
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2.5">
              Get started
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section ref={heroRef} className="pt-36 pb-20 px-6 text-center relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          {/* Neon badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="inline-flex items-center gap-2 neon-pill text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
            The smartest way to split bills
          </motion.div>

          {/* Headline */}
          <ScrollReveal delay={0.2}>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Fair splits,{' '}
              <br />
              <span className="gradient-text">zero stress.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <p className="text-xl text-slate-500 max-w-lg mx-auto mb-10">
              Track shared expenses, settle debts, and maintain friendships —
              all in one beautiful dashboard.
            </p>
          </ScrollReveal>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.55 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-brand-500/25">
                Start for free <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating mock cards */}
          <div className="relative max-w-2xl mx-auto mt-20">
            {/* Mock dashboard base */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...springTransition, delay: 0.7 }}
              className="glass-card rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-600">Goa Trip 2025</p>
                <span className="text-xs px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full font-medium">3 members</span>
              </div>
              <div className="space-y-3">
                {mockExpenses.map((e, i) => (
                  <motion.div
                    key={e.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springTransition, delay: 0.9 + i * 0.12 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${e.color}`}
                  >
                    <Receipt size={16} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 flex-1">{e.title}</span>
                    <span className="text-xs text-slate-400">{e.paid} paid</span>
                    <span className="text-sm font-bold text-slate-800">{e.amount}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Your balance</span>
                <span className="text-lg font-bold text-red-500">-₹1,490</span>
              </div>
            </motion.div>

            {/* Floating badge top-right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 glass-card px-4 py-2.5 rounded-xl shadow-lg border-brand-100"
            >
              <p className="text-xs text-slate-500">You are owed</p>
              <p className="text-lg font-bold text-brand-600">+₹3,200</p>
            </motion.div>

            {/* Floating badge bottom-left */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-5 -left-6 glass-card px-4 py-2.5 rounded-xl shadow-lg"
            >
              <p className="text-xs text-slate-500">Settled!</p>
              <p className="text-lg">🎉</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: false, margin: '-80px' }}
        className="py-16 px-6 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={staggerItem}
            transition={springTransition}
            className="glass-card rounded-2xl p-6 text-center"
          >
            <p className="text-3xl font-extrabold gradient-text">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ── Features (Sticky Showcase) ────────────────────────── */}
      <div className="py-20">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3">
            Everything you need to
            <span className="gradient-text"> split fairly</span>
          </h2>
          <p className="text-lg text-slate-500">Scroll down to see the features.</p>
        </div>
        
        <StickyFeatureShowcase 
          features={[
            { 
              title: 'Split with Anyone', 
              description: 'Add friends, family or roommates to any group instantly.',
              image: '👥' // We can use emojis or components
            },
            { 
              title: 'Track Every Expense', 
              description: 'Equal or custom splits — every rupee accounted for.',
              image: '🧾'
            },
            { 
              title: 'Smart Balances', 
              description: 'Simplified debt algorithm minimizes total transactions.',
              image: '📊'
            },
            { 
              title: 'Secure & Private', 
              description: 'JWT authentication keeps your data safe at all times.',
              image: '🔒'
            }
          ]}
        />
      </div>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={springTransition}
        className="mx-4 sm:mx-auto max-w-4xl my-16 rounded-3xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-400" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.12) 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative px-8 py-14 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Ready to split fairly?</h2>
          <p className="text-brand-100 text-lg mb-8">Join thousands who trust FairShare to manage shared expenses.</p>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
            >
              Get started — it's free <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="text-center py-8 text-sm text-slate-400">
        © 2025 FairShare. Built with ❤️ for fair splits.
      </footer>
    </div>
  );
}
