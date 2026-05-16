import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, springTransition } from '../../animations/variants';

interface Props {
  children: React.ReactNode[];
  className?: string;
  itemClassName?: string;
}

export default function StaggerList({ children, className = '', itemClassName = '' }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children.map((child, i) => (
        <motion.div
          key={i}
          variants={staggerItem}
          transition={springTransition}
          className={itemClassName}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
