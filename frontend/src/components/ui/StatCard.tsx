import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  numValue?: number;
  subtext: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
  delay?: number;
}

export default function StatCard({ label, value, numValue, subtext, icon, iconBg, valueColor = 'text-slate-900', delay = 0 }: StatCardProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(latest)
  );

  useEffect(() => {
    if (numValue !== undefined) {
      const controls = animate(count, numValue, { duration: 1.5, delay, ease: "easeOut" });
      return controls.stop;
    }
  }, [numValue, delay]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', damping: 20 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card p-5 group"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-500 font-medium text-sm transition-colors group-hover:text-slate-700">{label}</p>
        <div className={`p-2 rounded-lg ${iconBg} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
      <h3 className={`text-2xl font-bold font-display ${valueColor}`}>
        {numValue !== undefined ? <motion.span>{rounded}</motion.span> : value}
      </h3>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </motion.div>
  );
}
