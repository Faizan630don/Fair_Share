import { motion, useScroll, useSpring } from 'framer-motion';
import React from 'react';

interface Props {
  container?: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollProgressBar({ container }: Props) {
  const { scrollYProgress } = useScroll({ container });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="sticky top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 via-emerald-500 to-brand-600 z-50 origin-left"
      style={{ scaleX }}
    />
  );
}
