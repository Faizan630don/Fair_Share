import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Wallet, ArrowRight, Receipt, Users, TrendingUp, Shield, Zap, CheckCircle2, Star
} from 'lucide-react';
import AnimatedBackground from '../components/animations/AnimatedBackground';
import ScrollProgressBar from '../components/animations/ScrollProgressBar';
import { springTransition } from '../animations/variants';

/* ─── Data ────────────────────────────────────────────────── */
const stats = [
  { value: '50K+', label: 'Active users' },
  { value: '₹2Cr+', label: 'Tracked' },
  { value: '10K+', label: 'Groups' },
  { value: '99.9%', label: 'Uptime' },
];

const features = [
  {
    icon: Users,
    title: 'Split with Anyone',
    desc: 'Add friends, roommates or colleagues to any group in seconds. No app download required for them.',
    color: 'from-brand-500 to-emerald-500',
    bg: 'bg-brand-50',
    iconColor: 'text-brand-600',
  },
  {
    icon: Receipt,
    title: 'Track Every Expense',
    desc: 'Equal or custom splits — every rupee is logged and accounted for with full transparency.',
    color: 'from-violet-500 to-brand-500',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Smart Balances',
    desc: 'Our simplified debt algorithm reduces the number of transactions so you settle faster.',
    color: 'from-emerald-500 to-sky-500',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT authentication and encrypted storage keeps your financial data safe at all times.',
    color: 'from-sky-500 to-brand-500',
    bg: 'bg-sky-50',
    iconColor: 'text-sky-600',
  },
  {
    icon: Zap,
    title: 'Instant Settlements',
    desc: 'Record payments and clear debts in one tap. Get notified when someone settles up.',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: Star,
    title: 'Beautiful Dashboard',
    desc: 'A premium, clean interface that makes managing group finances actually enjoyable.',
    color: 'from-rose-500 to-violet-500',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
];

const mockExpenses = [
  { title: 'Hotel — Goa', amount: '₹3,200', paid: 'Faizan', color: 'bg-brand-50 border-brand-100' },
  { title: 'Dinner at Thalassa', amount: '₹850', paid: 'Rahul', color: 'bg-violet-50 border-violet-100' },
  { title: 'Cab to Airport', amount: '₹420', paid: 'You', color: 'bg-sky-50 border-sky-100' },
];

const testimonials = [
  { name: 'Ayesha K.', role: 'College Hostel, Delhi', text: 'We used to fight over money every month. FairShare made it completely transparent and stress-free.', avatar: 'A' },
  { name: 'Rohan M.', role: 'Flatmate, Bangalore', text: 'The best expense splitting app I have used. The design is stunning and it just works.', avatar: 'R' },
  { name: 'Priya S.', role: 'Travel Group, Mumbai', text: 'Tracked our entire Ladakh trip expenses perfectly. Settled everything within minutes of landing.', avatar: 'P' },
];

/* ─── Feature Card ────────────────────────────────────────── */
function FeatureCard({ f, i }: { f: typeof features[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (i % 3) * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transition-shadow cursor-default overflow-hidden"
    >
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br ${f.color} transition-opacity duration-300 rounded-2xl`} />

      <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4`}>
        <f.icon size={20} className={f.iconColor} />
      </div>
      <h3 className="font-bold text-slate-900 text-base mb-2">{f.title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
    </motion.div>
  );
}

/* ─── Testimonial Card ────────────────────────────────────── */
function TestimonialCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: i * 0.12 }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-100 shadow-sm"
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, j) => (
          <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t.name}</p>
          <p className="text-xs text-slate-400">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <ScrollProgressBar />
      <AnimatedBackground />

      {/* ── Nav ─────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springTransition, delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 text-brand-600">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 5, repeat: Infinity }}>
            <Wallet className="w-6 h-6" />
          </motion.div>
          <span className="text-lg font-bold gradient-text">FairShare</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors px-3 py-2 rounded-lg hover:bg-brand-50">
            Sign in
          </Link>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/signup" className="btn-primary text-sm px-5 py-2">
              Get started free
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section ref={heroRef} className="pt-32 pb-16 px-6 text-center relative overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            The smartest way to split bills in India
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 mb-5 leading-[1.1]"
          >
            Fair splits,
            <br />
            <span className="gradient-text">zero drama.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.42 }}
            className="text-lg sm:text-xl text-slate-500 max-w-md mx-auto mb-10 leading-relaxed"
          >
            Track shared expenses, settle debts, and stay friends — all in one premium dashboard.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.54 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-brand-500/25 inline-flex items-center gap-2">
                Start for free <ArrowRight size={16} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5 inline-flex items-center gap-2">
                Sign in
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 mb-14"
          >
            {['No credit card required', 'Free forever', 'Setup in 30 seconds'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-500" /> {t}
              </span>
            ))}
          </motion.div>

          {/* Mock Dashboard Preview */}
          <div className="relative max-w-lg mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ ...springTransition, delay: 0.75 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl p-5 shadow-2xl border border-slate-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Active Group</p>
                  <p className="text-sm font-bold text-slate-800">🏖️ Goa Trip 2025</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-brand-100 text-brand-700 rounded-full font-semibold">3 members</span>
              </div>

              {/* Expense rows */}
              <div className="space-y-2.5 mb-5">
                {mockExpenses.map((e, i) => (
                  <motion.div
                    key={e.title}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springTransition, delay: 1 + i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl border ${e.color}`}
                  >
                    <Receipt size={14} className="text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-700 flex-1">{e.title}</span>
                    <span className="text-xs text-slate-400">{e.paid} paid</span>
                    <span className="text-sm font-bold text-slate-800">{e.amount}</span>
                  </motion.div>
                ))}
              </div>

              {/* Balance row */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Your balance</span>
                <span className="text-base font-bold text-red-500">−₹1,490</span>
              </div>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -top-5 -right-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-2.5"
            >
              <p className="text-xs text-slate-400">You are owed</p>
              <p className="text-base font-bold text-brand-600">+₹3,200</p>
            </motion.div>

            {/* Floating badge — bottom left */}
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg border border-slate-100 px-4 py-2.5"
            >
              <p className="text-xs text-slate-400">All settled!</p>
              <p className="text-lg">🎉</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const isInView = useInView(ref, { once: true, margin: '-40px' });
            return (
              <motion.div
                key={stat.label}
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center bg-white/60 backdrop-blur-sm border border-slate-100 rounded-2xl py-5 px-4"
              >
                <p className="text-2xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Divider ─────────────────────────────────────────── */}
      <div className="relative py-8 flex justify-center">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-slate-200 to-transparent" />
      </div>

      {/* ── Features Grid ───────────────────────────────────── */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
          >
            Why FairShare
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900"
          >
            Everything your group needs,
            <span className="gradient-text"> nothing it doesn't.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => <FeatureCard key={f.title} f={f} i={i} />)}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="py-16 px-6 bg-gradient-to-b from-white to-brand-50/30">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
          >
            How it works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900"
          >
            Up and running in <span className="gradient-text">30 seconds.</span>
          </motion.h2>
        </div>

        <div className="max-w-2xl mx-auto space-y-0">
          {[
            { step: '01', title: 'Create a group', desc: 'Name your group — trip, flat, office — and invite members via link.' },
            { step: '02', title: 'Add expenses', desc: 'Log expenses as they happen. Choose equal, percentage, or custom splits.' },
            { step: '03', title: 'See balances', desc: 'FairShare calculates who owes whom automatically. No maths needed.' },
            { step: '04', title: 'Settle up', desc: 'Record a payment and the balance clears instantly for everyone.' },
          ].map((item, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const isInView = useInView(ref, { once: true, margin: '-60px' });
            return (
              <motion.div
                key={item.step}
                ref={ref}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6 pb-8 relative"
              >
                {/* Vertical line */}
                {i < 3 && (
                  <div className="absolute left-5 top-10 bottom-0 w-px bg-gradient-to-b from-brand-200 to-transparent" />
                )}
                <div className="w-10 h-10 rounded-xl bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 z-10">
                  {item.step}
                </div>
                <div>
                  <p className="font-bold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest text-brand-500 uppercase mb-2"
          >
            Loved by users
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-extrabold text-slate-900"
          >
            Real people. <span className="gradient-text">Real results.</span>
          </motion.h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {testimonials.map((t, i) => <TestimonialCard key={t.name} t={t} i={i} />)}
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={springTransition}
          className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-emerald-500" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative px-8 py-16 text-center text-white">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-100 mb-3">Get started today</p>
            <h2 className="text-4xl font-extrabold mb-3">Ready to split fairly?</h2>
            <p className="text-brand-100 text-base mb-8 max-w-sm mx-auto">
              Join thousands who trust FairShare to keep their friendships and finances healthy.
            </p>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
              >
                Start for free — takes 30s <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="text-center py-8 text-sm text-slate-400 border-t border-slate-100">
        © 2025 FairShare. Built with ❤️ for fair splits across India.
      </footer>
    </div>
  );
}
