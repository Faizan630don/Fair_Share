import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  image: string; // or component
}

interface Props {
  features: Feature[];
}

export default function StickyFeatureShowcase({ features }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const part = 1 / features.length;
    const index = Math.min(
      Math.floor(latest / part),
      features.length - 1
    );
    setActiveIndex(index);
  });

  return (
    <div ref={ref} className="relative" style={{ height: `${features.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Content */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                animate={{
                  opacity: activeIndex === index ? 1 : 0.3,
                  x: activeIndex === index ? 0 : -20,
                }}
                transition={{ duration: 0.5 }}
                className={`${activeIndex === index ? 'block' : 'hidden lg:block'}`}
              >
                <h3 className="text-3xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-lg text-slate-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: Visual */}
          <div className="relative h-[400px] lg:h-[500px] bg-slate-100 rounded-2xl overflow-hidden shadow-2xl border border-white/60 glass-card">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: activeIndex === index ? 1 : 0,
                  scale: activeIndex === index ? 1 : 0.8,
                  rotate: activeIndex === index ? 0 : 5
                }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="absolute inset-0 flex items-center justify-center p-8"
                style={{ pointerEvents: activeIndex === index ? 'auto' : 'none' }}
              >
                {/* Placeholder for visual or actual image */}
                <div className="text-6xl">{feature.image}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
