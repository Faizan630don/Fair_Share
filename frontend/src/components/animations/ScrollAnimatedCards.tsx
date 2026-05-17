import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, springTransition } from '../../animations/variants';

interface Props {
  children: React.ReactNode[];
  className?: string;
}

export default function ScrollAnimatedCards({ children, className = '' }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={staggerItem}
          transition={{ ...springTransition, delay: i * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
