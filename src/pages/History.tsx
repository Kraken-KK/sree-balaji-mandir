import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, Crown, Heart, Users, Award, Star, MapPin, Sparkles, Flame, Mountain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform, useInView, useSpring, MotionValue } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  Animated gradient backdrop — global motion graphic                 */
/* ------------------------------------------------------------------ */
const GradientCanvas = ({ progress }: { progress: MotionValue<number> }) => {
  const hue = useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [25, 15, 340, 280, 30]);
  const blob1X = useTransform(progress, [0, 1], ['-10%', '60%']);
  const blob2X = useTransform(progress, [0, 1], ['80%', '-20%']);
  const blob1Y = useTransform(progress, [0, 1], ['10%', '70%']);
  const blob2Y = useTransform(progress, [0, 1], ['60%', '15%']);

  return (
    <motion.div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ filter: 'blur(80px)' }}>
      <motion.div
        className="absolute w-[55vw] h-[55vw] rounded-full opacity-50"
        style={{
          left: blob1X,
          top: blob1Y,
          background: useTransform(hue, (h) => `radial-gradient(circle, hsl(${h} 90% 60%) 0%, transparent 70%)`),
        }}
      />
      <motion.div
        className="absolute w-[50vw] h-[50vw] rounded-full opacity-40"
        style={{
          left: blob2X,
          top: blob2Y,
          background: useTransform(hue, (h) => `radial-gradient(circle, hsl(${(h + 60) % 360} 85% 55%) 0%, transparent 70%)`),
        }}
      />
      <motion.div
        className="absolute w-[40vw] h-[40vw] rounded-full opacity-30"
        style={{
          right: '5%',
          bottom: '20%',
          background: useTransform(hue, (h) => `radial-gradient(circle, hsl(${(h + 200) % 360} 80% 65%) 0%, transparent 70%)`),
        }}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Scroll-driven Hero with parallax & animated typography             */
/* ------------------------------------------------------------------ */
const CinematicHero = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Layered scenic backdrop */}
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-100/40 via-orange-200/30 to-rose-200/40 dark:from-amber-900/30 dark:via-orange-950/40 dark:to-rose-950/30" />
        {/* Mountain silhouettes */}
        <svg viewBox="0 0 1440 400" preserveAspectRatio="none" className="absolute bottom-0 w-full h-1/2">
          <defs>
            <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(25 80% 55% / 0.4)" />
              <stop offset="100%" stopColor="hsl(15 70% 35% / 0.7)" />
            </linearGradient>
            <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(340 70% 50% / 0.3)" />
              <stop offset="100%" stopColor="hsl(280 60% 30% / 0.6)" />
            </linearGradient>
          </defs>
          <path d="M0,400 L0,250 L200,120 L400,200 L600,80 L800,180 L1000,100 L1200,220 L1440,140 L1440,400 Z" fill="url(#mtn2)" />
          <path d="M0,400 L0,300 L150,200 L350,260 L550,180 L750,240 L950,170 L1150,250 L1440,200 L1440,400 Z" fill="url(#mtn1)" />
        </svg>
        {/* Sun / divine orb */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] left-1/2 -translate-x-1/2 w-40 h-40 rounded-full"
          style={{ background: 'radial-gradient(circle, hsl(45 100% 70%) 0%, hsl(25 90% 55% / 0.4) 50%, transparent 80%)', filter: 'blur(8px)' }}
        />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity, y: useTransform(scrollYProgress, [0, 1], [0, -100]) }} className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/40"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium tracking-widest uppercase text-amber-900 dark:text-amber-200">A Sacred Story</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-display font-bold leading-[0.9] mb-6"
          style={{ background: 'linear-gradient(135deg, hsl(15 80% 45%), hsl(340 70% 50%), hsl(45 90% 55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
        >
          150 Years
          <br />
          <span className="text-4xl md:text-6xl lg:text-7xl font-light italic opacity-90">of Divinity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed"
        >
          From a single blessed stone in 1875 — to a million hearts beating as one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-[-10vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-foreground/60">Scroll to begin</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-foreground/40 flex items-start justify-center pt-2"
          >
            <div className="w-1 h-2 rounded-full bg-foreground/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Big Chapter Intro — full-screen cinematic title card               */
/* ------------------------------------------------------------------ */
const ChapterIntro = ({ chapter, year, title, subtitle, gradient, icon: Icon }: { chapter: string; year: string; title: string; subtitle: string; gradient: string; icon: any }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      <motion.div style={{ y, scale, opacity }} className="text-center px-6 max-w-5xl relative z-10">
        <div
          className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 shadow-2xl"
          style={{ background: gradient }}
        >
          <Icon className="w-12 h-12 text-white" />
        </div>
        <p className="text-sm uppercase tracking-[0.3em] text-foreground/60 mb-3">{chapter}</p>
        <p className="text-7xl md:text-9xl font-display font-bold mb-4" style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          {year}
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-5 text-foreground">{title}</h2>
        <p className="text-lg md:text-2xl text-foreground/70 max-w-3xl mx-auto leading-relaxed font-light italic">{subtitle}</p>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Storyline scene — split layout with imagery + narrative            */
/* ------------------------------------------------------------------ */
const StorylineScene = ({ year, title, body, sceneType, reverse }: { year: string; title: string; body: string; sceneType: 'temple' | 'people' | 'festival' | 'modern'; reverse?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const imgY2 = useSpring(imgY, { stiffness: 100, damping: 30 });

  return (
    <section ref={ref} className="py-24 md:py-32 px-6">
      <div className={`max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
        {/* Scene visual */}
        <motion.div style={{ y: imgY2 }} className="relative aspect-[4/5] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
          <SceneArt type={sceneType} />
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="absolute bottom-6 left-6 text-white"
          >
            <p className="text-6xl md:text-7xl font-display font-bold leading-none">{year}</p>
          </motion.div>
        </motion.div>

        {/* Narrative */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: reverse ? -40 : 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-px w-16 bg-primary mb-6" />
            <h3 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight text-foreground">{title}</h3>
            <p className="text-lg md:text-xl text-foreground/75 leading-relaxed font-light">{body}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  SVG scene art — different styles per type                          */
/* ------------------------------------------------------------------ */
const SceneArt = ({ type }: { type: 'temple' | 'people' | 'festival' | 'modern' }) => {
  if (type === 'temple') {
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky-t" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#sky-t)" />
        <circle cx="200" cy="120" r="50" fill="#fef3c7" opacity="0.9" />
        {/* Temple gopuram */}
        <g fill="hsl(15 60% 25%)">
          <rect x="120" y="280" width="160" height="180" />
          <polygon points="100,280 200,180 300,280" />
          <polygon points="130,260 200,200 270,260" fill="hsl(25 70% 35%)" />
          <rect x="180" y="380" width="40" height="80" fill="hsl(45 90% 55%)" />
          <circle cx="200" cy="220" r="8" fill="hsl(45 100% 60%)" />
          <rect x="150" y="320" width="20" height="30" fill="hsl(45 80% 50%)" />
          <rect x="230" y="320" width="20" height="30" fill="hsl(45 80% 50%)" />
        </g>
        {/* Steps */}
        <rect x="100" y="460" width="200" height="10" fill="hsl(15 50% 20%)" />
        <rect x="80" y="470" width="240" height="30" fill="hsl(15 40% 15%)" />
      </svg>
    );
  }
  if (type === 'people') {
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky-p" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#sky-p)" />
        {/* Devotees silhouettes */}
        <g fill="hsl(280 50% 20%)" opacity="0.85">
          <circle cx="100" cy="280" r="25" />
          <path d="M75,310 Q100,300 125,310 L130,460 L70,460 Z" />
          <circle cx="170" cy="260" r="28" />
          <path d="M142,295 Q170,283 198,295 L205,460 L135,460 Z" />
          <circle cx="240" cy="270" r="26" />
          <path d="M214,302 Q240,290 266,302 L272,460 L208,460 Z" />
          <circle cx="310" cy="285" r="24" />
          <path d="M286,313 Q310,303 334,313 L340,460 L280,460 Z" />
        </g>
        {/* Diyas */}
        <g>
          <ellipse cx="80" cy="430" rx="12" ry="4" fill="hsl(15 80% 30%)" />
          <circle cx="80" cy="425" r="6" fill="hsl(45 100% 60%)" opacity="0.9" />
          <ellipse cx="200" cy="440" rx="12" ry="4" fill="hsl(15 80% 30%)" />
          <circle cx="200" cy="435" r="6" fill="hsl(45 100% 60%)" opacity="0.9" />
          <ellipse cx="320" cy="430" rx="12" ry="4" fill="hsl(15 80% 30%)" />
          <circle cx="320" cy="425" r="6" fill="hsl(45 100% 60%)" opacity="0.9" />
        </g>
      </svg>
    );
  }
  if (type === 'festival') {
    return (
      <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sky-f" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7c2d12" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#sky-f)" />
        {/* Fireworks bursts */}
        {[
          { cx: 100, cy: 100, color: '#fbbf24' },
          { cx: 300, cy: 130, color: '#ec4899' },
          { cx: 200, cy: 80, color: '#a78bfa' },
          { cx: 80, cy: 200, color: '#34d399' },
          { cx: 320, cy: 220, color: '#fb923c' },
        ].map((b, i) => (
          <g key={i}>
            {Array.from({ length: 12 }).map((_, j) => {
              const angle = (j / 12) * Math.PI * 2;
              return (
                <line key={j} x1={b.cx} y1={b.cy} x2={b.cx + Math.cos(angle) * 30} y2={b.cy + Math.sin(angle) * 30} stroke={b.color} strokeWidth="2" opacity="0.9" />
              );
            })}
            <circle cx={b.cx} cy={b.cy} r="4" fill={b.color} />
          </g>
        ))}
        {/* Crowd at bottom */}
        <g fill="hsl(15 60% 15%)" opacity="0.9">
          {[40, 90, 140, 190, 240, 290, 340, 380].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy={380 + (i % 2) * 10} r="14" />
              <path d={`M${x - 14},${395 + (i % 2) * 10} Q${x},${390 + (i % 2) * 10} ${x + 14},${395 + (i % 2) * 10} L${x + 18},500 L${x - 18},500 Z`} />
            </g>
          ))}
        </g>
      </svg>
    );
  }
  // modern
  return (
    <svg viewBox="0 0 400 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-m" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="url(#sky-m)" />
      {/* Modern temple silhouette */}
      <g>
        <rect x="50" y="300" width="300" height="160" fill="hsl(220 30% 15%)" />
        <polygon points="50,300 200,200 350,300" fill="hsl(25 80% 50%)" />
        <polygon points="80,290 200,210 320,290" fill="hsl(45 90% 60%)" opacity="0.7" />
        <rect x="180" y="360" width="40" height="100" fill="hsl(45 100% 65%)" />
        <circle cx="200" cy="240" r="6" fill="white" />
        {/* Glowing windows */}
        {[80, 130, 270, 320].map((x, i) => (
          <rect key={i} x={x} y="340" width="20" height="30" fill="hsl(45 100% 70%)" opacity="0.8" />
        ))}
      </g>
      {/* Stars */}
      {[
        [60, 50], [120, 80], [200, 40], [280, 90], [340, 60], [90, 130], [310, 150],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.5" fill="white" opacity="0.9" />
      ))}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/*  Achievements with animated counters                                */
/* ------------------------------------------------------------------ */
const AchievementsBlock = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const stats = [
    { icon: Users, value: '1.2M+', label: 'Devotees', sub: 'Souls touched' },
    { icon: Calendar, value: '350+', label: 'Festivals', sub: 'Sacred celebrations' },
    { icon: Heart, value: '₹5Cr+', label: 'Seva Donations', sub: 'Hearts gave generously' },
    { icon: Award, value: '25+', label: 'Recognitions', sub: 'For seva to society' },
  ];

  return (
    <section ref={ref} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-primary mb-4">By the Numbers</p>
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6" style={{ background: 'linear-gradient(135deg, hsl(15 80% 45%), hsl(340 70% 55%))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            A Living Legacy
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative backdrop-blur-xl bg-white/40 dark:bg-black/30 border border-white/40 dark:border-white/10 rounded-3xl p-8 text-center">
                <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-5xl md:text-6xl font-display font-bold mb-2 text-foreground">{s.value}</p>
                <p className="text-base font-semibold text-foreground/90 mb-1">{s.label}</p>
                <p className="text-xs text-foreground/60 italic">{s.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Final CTA — cinematic close                                        */
/* ------------------------------------------------------------------ */
const FinaleSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section ref={ref} className="py-32 px-6">
      <motion.div style={{ scale, opacity }} className="max-w-5xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-20 text-center">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, hsl(15 80% 45%), hsl(340 70% 50%), hsl(45 90% 55%))' }} />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-1/2 opacity-20"
            style={{ background: 'conic-gradient(from 0deg, transparent, white, transparent)' }}
          />
          <div className="relative z-10 text-white">
            <Flame className="w-12 h-12 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight">
              The next chapter
              <br />
              <em className="font-light">begins with you.</em>
            </h2>
            <p className="text-lg md:text-xl mb-10 text-white/85 max-w-2xl mx-auto font-light">
              Every devotee adds a verse to our story. Will you write yours?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-7 text-base font-semibold shadow-2xl">
                  Join Our Community
                </Button>
              </Link>
              <Link to="/donations">
                <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 bg-transparent rounded-full px-10 py-7 text-base">
                  <Heart className="w-4 h-4 mr-2" /> Offer Seva
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
const History = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <GradientCanvas progress={scrollYProgress} />

      <CinematicHero />

      <ChapterIntro
        chapter="Chapter One"
        year="1875"
        title="The Sacred Foundation"
        subtitle="When the first stone touched blessed earth, a divine vision took root."
        gradient="linear-gradient(135deg, hsl(25 80% 50%), hsl(15 70% 40%))"
        icon={MapPin}
      />
      <StorylineScene
        year="1875"
        title="A Vision Becomes Stone"
        body="Under the guidance of Sri Venkateshwara Swami, devotees gathered on a quiet hillside at dawn. With chants of the Vedas rising into the morning mist, the sacred ground was consecrated. The first stone — hand-carried from the river — was laid to mark a beginning none could fully imagine."
        sceneType="temple"
      />

      <ChapterIntro
        chapter="Chapter Two"
        year="1890"
        title="The Divine Awakens"
        subtitle="Thousands gathered as the deity opened His eyes upon the world."
        gradient="linear-gradient(135deg, hsl(340 70% 50%), hsl(15 80% 45%))"
        icon={Crown}
      />
      <StorylineScene
        year="1890"
        title="The First Consecration"
        body="On an auspicious dawn, after twelve days of homam and abhishekam, the main deity was installed. Drums echoed across the valley. Conch shells called the heavens. Ten thousand devotees received the first prasadam — a community born in that single moment of divine arrival."
        sceneType="people"
        reverse
      />

      <ChapterIntro
        chapter="Chapter Three"
        year="1925"
        title="The Walls Expand"
        subtitle="As devotion grew, so did the sanctuary that held it."
        gradient="linear-gradient(135deg, hsl(280 60% 50%), hsl(340 70% 50%))"
        icon={Mountain}
      />
      <StorylineScene
        year="1925"
        title="A Sanctuary for All"
        body="Halls rose. Kitchens were built to feed thousands during festivals. Pilgrims from distant villages found shelter. The temple was no longer just a place of worship — it became home, hospital, school, refuge. A living organism of seva."
        sceneType="temple"
      />

      <ChapterIntro
        chapter="Chapter Four"
        year="1975"
        title="One Hundred Years"
        subtitle="A century of unbroken devotion, celebrated by a generation that never knew a world without these gates."
        gradient="linear-gradient(135deg, hsl(45 90% 55%), hsl(15 80% 45%))"
        icon={Award}
      />
      <StorylineScene
        year="1975"
        title="The Centenary Festival"
        body="For seven days, the temple did not sleep. Classical concerts under banyan trees. Fireworks painting the night in saffron and gold. Elders who had been children at the first puja now blessed grandchildren in the same sanctum. A century — distilled into one unforgettable celebration."
        sceneType="festival"
        reverse
      />

      <ChapterIntro
        chapter="Chapter Five"
        year="2000"
        title="A Renaissance"
        subtitle="Old stones met new light. Tradition embraced tomorrow."
        gradient="linear-gradient(135deg, hsl(195 80% 50%), hsl(280 60% 55%))"
        icon={Star}
      />
      <StorylineScene
        year="2000"
        title="Restored, Reimagined"
        body="Master sculptors restored every carved deity. Modern lighting revealed details hidden for decades. Solar panels appeared on the rooftops; livestreams carried aarti to devotees across continents. The temple stepped boldly into a new millennium — without losing a single thread of its soul."
        sceneType="modern"
      />

      <AchievementsBlock />
      <FinaleSection />
    </div>
  );
};

export default History;
