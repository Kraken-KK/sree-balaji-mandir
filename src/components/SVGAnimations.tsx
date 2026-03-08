import React from 'react';
import { motion } from 'framer-motion';

export const SacredGeometry: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`pointer-events-none ${className}`} viewBox="0 0 200 200" fill="none">
    <motion.circle
      cx="100" cy="100" r="90"
      stroke="currentColor" strokeWidth="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.circle
      cx="100" cy="100" r="70"
      stroke="currentColor" strokeWidth="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3, delay: 0.5, repeat: Infinity, repeatType: "reverse" }}
    />
    <motion.circle
      cx="100" cy="100" r="50"
      stroke="currentColor" strokeWidth="0.3"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
    />
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <motion.line
        key={i}
        x1="100" y1="100"
        x2={100 + 90 * Math.cos((angle * Math.PI) / 180)}
        y2={100 + 90 * Math.sin((angle * Math.PI) / 180)}
        stroke="currentColor" strokeWidth="0.2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.5 }}
        transition={{ delay: i * 0.2 + 1, duration: 1 }}
      />
    ))}
  </svg>
);

export const FloatingOrb: React.FC<{
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}> = ({ className = '', color = 'primary', size = 300, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, hsl(var(--${color}) / 0.08) 0%, transparent 70%)`,
    }}
    animate={{
      scale: [1, 1.2, 1],
      x: [0, 30, -20, 0],
      y: [0, -20, 15, 0],
    }}
    transition={{
      duration: 8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export const LotusPattern: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={`pointer-events-none ${className}`} viewBox="0 0 100 100" fill="none">
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
      <motion.ellipse
        key={i}
        cx="50" cy="50" rx="30" ry="10"
        stroke="currentColor" strokeWidth="0.3"
        fill="currentColor" fillOpacity={0.02}
        transform={`rotate(${angle} 50 50)`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ delay: i * 0.08, duration: 0.8, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
      />
    ))}
    <motion.circle
      cx="50" cy="50" r="5"
      fill="currentColor" fillOpacity={0.1}
      animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </svg>
);
