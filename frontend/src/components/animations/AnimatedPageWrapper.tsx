import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, springTransition } from '../../animations/variants';
import { useLocation } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

export default function AnimatedPageWrapper({ children }: Props) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={fadeUp}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...springTransition, delay: 0.04 }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
