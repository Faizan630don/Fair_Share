import { motion } from 'framer-motion';

export default function AnimatedSectionDivider() {
  return (
    <div className="relative py-16 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200/60"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-slate-200/60 shadow-soft flex items-center gap-2"
      >
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-slate-500">End of section</span>
        <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
      </motion.div>
      
      {/* Soft glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/5 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
}
