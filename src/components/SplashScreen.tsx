import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 600),    // logo settles
      setTimeout(() => setPhase(2), 1600),   // title appears
      setTimeout(() => setPhase(3), 2600),   // tagline appears
      setTimeout(() => setPhase(4), 4200),   // mantra appears
      setTimeout(() => setPhase(5), 5800),   // begin exit
      setTimeout(() => onComplete(), 6400),  // fully gone
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase < 5 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(38, 60%, 96%) 0%, hsl(32, 55%, 92%) 45%, hsl(28, 50%, 86%) 100%)',
          }}
        >
          {/* Animated gradient mesh */}
          <motion.div
            className="absolute inset-0 opacity-60"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, hsla(28, 90%, 60%, 0.25), transparent 50%), radial-gradient(circle at 80% 70%, hsla(5, 85%, 55%, 0.20), transparent 50%), radial-gradient(circle at 50% 50%, hsla(42, 95%, 60%, 0.18), transparent 60%)',
                'radial-gradient(circle at 70% 20%, hsla(28, 90%, 60%, 0.30), transparent 50%), radial-gradient(circle at 30% 80%, hsla(5, 85%, 55%, 0.25), transparent 50%), radial-gradient(circle at 60% 40%, hsla(42, 95%, 60%, 0.22), transparent 60%)',
                'radial-gradient(circle at 20% 30%, hsla(28, 90%, 60%, 0.25), transparent 50%), radial-gradient(circle at 80% 70%, hsla(5, 85%, 55%, 0.20), transparent 50%), radial-gradient(circle at 50% 50%, hsla(42, 95%, 60%, 0.18), transparent 60%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? 'hsl(42, 95%, 60%)' : 'hsl(28, 90%, 55%)',
                left: `${(i * 8.33) % 100}%`,
                top: `${((i * 17) % 80) + 10}%`,
                boxShadow: '0 0 8px currentColor',
              }}
              animate={{
                y: [-20, -100],
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Sacred geometry — yantra-inspired */}
          <svg
            className="absolute w-[700px] h-[700px] opacity-[0.10]"
            viewBox="0 0 400 400"
          >
            {/* Outer rotating ring */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '200px 200px' }}
            >
              <motion.circle
                cx="200" cy="200" r="190"
                fill="none"
                stroke="hsl(28, 85%, 45%)"
                strokeWidth="0.6"
                strokeDasharray="2 6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
              />
            </motion.g>

            {/* Counter-rotating */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '200px 200px' }}
            >
              <motion.circle
                cx="200" cy="200" r="160"
                fill="none"
                stroke="hsl(5, 85%, 50%)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
              <motion.circle
                cx="200" cy="200" r="130"
                fill="none"
                stroke="hsl(42, 90%, 55%)"
                strokeWidth="0.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
              />
            </motion.g>

            {/* Inner triangles (yantra) */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '200px 200px' }}
            >
              <motion.polygon
                points="200,90 295,255 105,255"
                fill="none"
                stroke="hsl(28, 85%, 50%)"
                strokeWidth="0.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.polygon
                points="200,310 105,145 295,145"
                fill="none"
                stroke="hsl(5, 85%, 50%)"
                strokeWidth="0.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.7 }}
                transition={{ duration: 2, delay: 0.8 }}
              />
            </motion.g>

            {/* Lotus petals */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <motion.ellipse
                key={i}
                cx="200" cy="200"
                rx="70" ry="22"
                fill="none"
                stroke="hsl(28, 85%, 55%)"
                strokeWidth="0.4"
                transform={`rotate(${angle} 200 200)`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.5, scale: 1 }}
                transition={{ delay: 0.05 * i + 0.6, duration: 0.7 }}
              />
            ))}
          </svg>

          {/* Ambient breathing glow */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, hsla(28, 95%, 55%, 0.18) 0%, hsla(42, 90%, 60%, 0.08) 40%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-6">
            {/* Om Symbol with halo */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto mb-8 w-28 h-28"
            >
              {/* Halo rings */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'conic-gradient(from 0deg, hsl(28, 90%, 55%), hsl(5, 85%, 55%), hsl(42, 95%, 60%), hsl(28, 90%, 55%))',
                  filter: 'blur(14px)',
                  opacity: 0.6,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-2 rounded-full"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(28, 90%, 55%), hsl(5, 85%, 52%), hsl(42, 95%, 60%))',
                  boxShadow:
                    '0 20px 60px -10px hsla(28, 90%, 55%, 0.6), inset 0 2px 20px hsla(0, 0%, 100%, 0.3)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-white font-bold text-5xl drop-shadow-lg"
                  style={{ textShadow: '0 2px 12px hsla(0,0%,0%,0.3)' }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  ॐ
                </motion.span>
              </div>
            </motion.div>

            {/* Title — letter reveal */}
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 60, opacity: 0 }}
                animate={phase >= 1 ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-5xl font-display font-bold mb-2 tracking-tight"
                style={{
                  background:
                    'linear-gradient(135deg, hsl(28, 90%, 40%) 0%, hsl(5, 85%, 45%) 50%, hsl(42, 90%, 45%) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Sree Balaji Mandir
              </motion.h1>
            </div>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={phase >= 2 ? { scaleX: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mx-auto my-4 h-px w-32"
              style={{
                background:
                  'linear-gradient(90deg, transparent, hsl(28, 85%, 55%), hsl(5, 85%, 55%), hsl(28, 85%, 55%), transparent)',
              }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-sm md:text-base text-foreground/70 tracking-[0.3em] uppercase font-medium"
            >
              Divine · Sacred · Eternal
            </motion.p>

            {/* Mantra */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={phase >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 1.2 }}
              className="mt-8 text-xs md:text-sm font-display italic text-foreground/60"
            >
              "ॐ नमो भगवते वासुदेवाय"
            </motion.p>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={phase >= 1 ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
              className="mt-10 w-48 h-1 mx-auto rounded-full overflow-hidden"
              style={{ background: 'hsla(28, 30%, 70%, 0.25)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, hsl(28, 90%, 55%), hsl(5, 85%, 52%), hsl(42, 95%, 60%))',
                  boxShadow: '0 0 12px hsla(28, 90%, 55%, 0.6)',
                }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5.5, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
