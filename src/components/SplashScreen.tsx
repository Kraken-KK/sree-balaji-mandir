import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2200),
      setTimeout(() => onComplete(), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center gradient-warm-bg overflow-hidden"
        >
          {/* Animated sacred geometry SVG */}
          <svg className="absolute w-[600px] h-[600px] opacity-[0.06]" viewBox="0 0 400 400">
            <motion.circle
              cx="200" cy="200" r="180"
              fill="none"
              stroke="hsl(28, 85%, 55%)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: 360 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
            <motion.circle
              cx="200" cy="200" r="140"
              fill="none"
              stroke="hsl(5, 85%, 52%)"
              strokeWidth="0.5"
              initial={{ pathLength: 0, rotate: 0 }}
              animate={{ pathLength: 1, rotate: -360 }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
            <motion.circle
              cx="200" cy="200" r="100"
              fill="none"
              stroke="hsl(42, 90%, 58%)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            {/* Sacred lotus petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <motion.ellipse
                key={i}
                cx="200" cy="200"
                rx="60" ry="20"
                fill="none"
                stroke="hsl(28, 85%, 55%)"
                strokeWidth="0.3"
                transform={`rotate(${angle} 200 200)`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.5, duration: 0.6 }}
              />
            ))}
          </svg>

          {/* Ambient glow */}
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{ background: 'radial-gradient(circle, hsla(28, 90%, 55%, 0.12) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Om Symbol */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 gradient-devotional rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl"
            >
              <motion.span
                className="text-white font-bold text-3xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ॐ
              </motion.span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={phase >= 1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2"
            >
              Sri Balaji Temple
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              Divine • Sacred • Eternal
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              className="mt-8 w-32 h-0.5 bg-muted/30 rounded-full mx-auto overflow-hidden"
            >
              <motion.div
                className="h-full gradient-devotional rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
