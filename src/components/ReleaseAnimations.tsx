import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const THEME_COLORS = {
  liquidGlass: '#ffffff',
  cinematicNoir: '#d4d4d8',
  auroraGlow: '#34d399',
  minimalLuxury: '#d6d3d1',
  futuristicEditorial: '#fb923c',
  softHolographic: '#e879f9',
  deepSpace: '#818cf8',
  stardust: '#f8fafc',
  retroGrid: '#22c55e',
  auroraBorealis: '#2dd4bf',
  sereneLandscape: '#cbd5e1',
  obsidian: '#525252',
  nebula: '#f472b6',
  void: '#a855f7',
  midnight: '#3b82f6',
  crimson: '#ef4444',
  ethereal: '#94a3b8',
  abyss: '#a1a1aa',
  nebulaVortex: '#818cf8',
  aboveAndBeyond: '#818cf8'
};

export const ANIMATIONS_CONFIG: Record<string, { name: string, duration: number, description: string, isPro?: boolean, isNew?: boolean }> = {
  supernova: { name: 'Supernova', duration: 5000, description: 'A massive explosion of light and particles.', isPro: false },
  incinerate: { name: 'Incinerate', duration: 6000, description: 'Burn your words to ash in a roaring fire.', isPro: false },
  nebula: { name: 'Nebula Dissolve', duration: 6000, description: 'Melt into a massive, colorful cosmic cloud.', isPro: false },
  singularity: { name: 'Singularity', duration: 4500, description: 'Collapse into a dense point of infinite gravity.', isPro: false },
  abyssSink: { name: 'Abyss Sink', duration: 6000, description: 'Sink your thoughts into the dark depths of the ocean.', isPro: false },
  sandstorm: { name: 'Sandstorm', duration: 5000, description: 'Let your words blow away like dust in the wind.', isPro: false },
  voidConsume: { name: 'Void Consume', duration: 6000, description: 'A creeping darkness swallows everything.', isPro: false },
  ascension: { name: 'Ascension', duration: 5500, description: 'Shatter and rise as glowing embers.', isPro: true },
  quantum: { name: 'Quantum Glitch', duration: 4000, description: 'Vibrate across dimensions and snap out of existence.', isPro: true },
  bloodMoon: { name: 'Blood Moon', duration: 6000, description: 'A deep crimson eclipse consumes your words.', isPro: true },
  goldenRain: { name: 'Golden Rain', duration: 5500, description: 'Melt into a shower of golden light.', isPro: true },
  matrix: { name: 'Matrix Decode', duration: 5000, description: 'Dissolve into digital rain.', isPro: true },
  glassShatter: { name: 'Glass Shatter', duration: 4000, description: 'Break your thoughts into sharp, falling fragments.', isPro: true, isNew: true },
  cherryBlossom: { name: 'Cherry Blossom', duration: 6000, description: 'Fade gently into falling petals.', isPro: true, isNew: true },
  glacialFreeze: { name: 'Glacial Freeze', duration: 5000, description: 'Freeze over and crack into ice.', isPro: true, isNew: true },
  prismaticBurst: { name: 'Prismatic Burst', duration: 4000, description: 'Explode into a spectrum of vibrant colors.', isPro: true, isNew: true },
};

const Supernova = ({ text, theme, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const words = text.split(/(\s+)/); // Keep spaces for exact layout
  const particleCount = reduceMotion ? 20 : Math.floor(150 * intensity);
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = (isPreview ? 100 : 200 + Math.random() * 1500) * intensity;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: (Math.random() * 4 + 1) * intensity,
      delay: Math.random() * 0.2
    };
  });

  if (reduceMotion && isPreview) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full opacity-50" style={{ backgroundColor: color }} />
      </div>
    );
  }

  return (
    <motion.div 
      className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none overflow-hidden perspective-1000"}
      animate={!isPreview && !reduceMotion ? {
        x: [0, -10, 10, -5, 5, 0],
        y: [0, 10, -10, 5, -5, 0],
      } : {}}
      transition={{ duration: 0.4, ease: "linear" }}
    >
      {/* Blinding Flash */}
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0, backgroundColor: '#ffffff' }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 2, times: [0, 0.05, 0.1, 1], ease: "circOut" }}
          className="absolute inset-0 z-50"
        />
      )}
      
      {/* Shockwave */}
      <motion.div
        initial={{ scale: 0, opacity: 1, borderWidth: '100px' }}
        animate={reduceMotion ? { scale: 1, opacity: 0.5, borderWidth: '2px' } : { scale: [0, 10], opacity: [1, 0], borderWidth: ['100px', '1px'] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute rounded-full border-white z-10"
        style={{ width: '10vw', height: '10vw', borderColor: color, boxShadow: `0 0 150px ${color}` }}
      />

      {/* Exact Typography Match - Word Shatter */}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-col items-center relative z-30">
          <div className="w-full max-w-2xl p-2 flex flex-col relative">
            <div className="w-full px-6 py-6 text-lg md:text-2xl font-sans font-light leading-relaxed text-white text-left whitespace-pre-wrap">
              {words.map((word, i) => {
                if (!word.trim()) return <span key={i}>{word}</span>; // Render spaces normally
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }}
                    animate={reduceMotion ? { opacity: [1, 0] } : { 
                      opacity: [1, 1, 0],
                      x: [(Math.random() - 0.5) * 1000],
                      y: [(Math.random() - 0.5) * 1000],
                      z: [Math.random() * 500],
                      rotateX: [(Math.random() - 0.5) * 720],
                      rotateY: [(Math.random() - 0.5) * 720],
                      rotateZ: [(Math.random() - 0.5) * 720],
                      scale: [1, 1.5, 0]
                    }}
                    transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
                    className="inline-block origin-center will-change-transform"
                    style={{ textShadow: `0 0 20px ${color}` }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Particles */}
      {!reduceMotion && particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
          animate={{ 
            x: p.x, 
            y: p.y, 
            opacity: [0, 1, 1, 0],
            scale: [0, p.size, p.size, 0]
          }}
          transition={{ duration: 2.5, times: [0, 0.1, 0.5, 1], delay: p.delay, ease: "easeOut" }}
          className="absolute rounded-full bg-white z-20"
          style={{ width: 4, height: 4, boxShadow: `0 0 ${p.size * 5}px ${color}` }}
        />
      ))}
    </motion.div>
  );
};

const Incinerate = ({ text, theme, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  
  if (reduceMotion && isPreview) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full opacity-50" style={{ background: `radial-gradient(circle, #ff4500 0%, transparent 70%)` }} />
      </div>
    );
  }

  return (
    <motion.div 
      className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}
      animate={!isPreview && !reduceMotion ? {
        y: [0, 2, -2, 2, -2, 1, -1, 0],
        x: [0, 1, -1, 1, -1, 0]
      } : {}}
      transition={{ duration: 0.5, repeat: 8, ease: "linear" }}
    >
      {/* Background Fire Glow */}
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.8, 1, 0], scale: [0.8, 1.2, 1.5, 2] }}
          transition={{ duration: 5, times: [0, 0.2, 0.5, 1], ease: "easeIn" }}
          className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(circle at center, #ff4500 0%, #8b0000 40%, transparent 80%)' }}
        />
      )}

      {/* Text Burning */}
      {!isPreview && (
        <motion.div
          initial={{ scale: 1, opacity: 1, y: 0, color: '#ffffff' }}
          animate={reduceMotion ? { opacity: [1, 0] } : { 
            scale: [1, 1.05, 1.1, 0.9], 
            opacity: [1, 1, 0.8, 0],
            y: [0, -10, -50, -100],
            color: ['#ffffff', '#ffeb3b', '#ff4500', '#000000']
          }}
          transition={{ duration: 4.5, times: [0, 0.3, 0.7, 1], ease: "easeIn" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-syne font-bold text-center max-w-5xl px-8"
        >
          {text}
        </motion.div>
      )}

      {/* Embers */}
      {!reduceMotion && Array.from({ length: Math.floor(60 * intensity) }).map((_, i) => {
        const startX = (Math.random() - 0.5) * 600;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: startX, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0.2, 1, 0],
              y: [100, -300 - Math.random() * 400],
              x: [startX, startX + (Math.random() - 0.5) * 200, startX + (Math.random() - 0.5) * 400],
              scale: [0, Math.random() * 1.5 + 0.5, 0]
            }}
            transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 1.5, ease: "easeOut" }}
            className="absolute rounded-full bg-[#ffeb3b] z-30 will-change-transform will-change-opacity"
            style={{ width: 6, height: 6, boxShadow: `0 0 15px #ff4500, 0 0 30px #ff0000` }}
          />
        );
      })}

      {/* Final Ash Flash */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ duration: 5, times: [0, 0.8, 0.85, 1], ease: "easeOut" }}
          className="absolute inset-0 bg-black z-50"
        />
      )}
    </motion.div>
  );
};

const Nebula = ({ text, theme, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const words = isPreview ? [] : text.split(' ');
  
  if (reduceMotion && isPreview) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />
      </div>
    );
  }

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {/* Text Dissolve into Ash */}
      {!isPreview && (
        <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-fraunces italic text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, x: 0, color: '#ffffff', scale: 1 }}
              animate={reduceMotion ? { opacity: [1, 0] } : { 
                opacity: [1, 0.5, 0], 
                y: [0, -50 - Math.random() * 100, -200 - Math.random() * 200],
                x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 150],
                color: ['#ffffff', '#a3a3a3', '#4a4a4a'],
                scale: [1, 1.1, 0.5]
              }}
              transition={{ duration: 4 + Math.random() * 2, delay: Math.random() * 0.5, ease: "easeOut" }}
              className="inline-block will-change-transform will-change-opacity"
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}

      {/* Cosmic Clouds / Smoke */}
      {!reduceMotion && Array.from({ length: Math.floor(4 * intensity) }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.5, 0],
            scale: [0.5, 4, 8],
            rotate: [0, (i % 2 === 0 ? 1 : -1) * 180],
            x: (Math.random() - 0.5) * 800,
            y: (Math.random() - 0.5) * 800
          }}
          transition={{ duration: 7, delay: i * 0.1, ease: "easeOut" }}
          className="absolute w-[40vw] h-[40vw] rounded-full will-change-transform will-change-opacity"
          style={{ 
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`
          }}
        />
      ))}
    </div>
  );
};

const Singularity = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const words = text.split(/(\s+)/); // Keep spaces for exact layout

  return (
    <motion.div 
      className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none overflow-hidden"}
      animate={!isPreview ? {
        x: [0, 0, 0, -30, 30, -20, 20, 0],
        y: [0, 0, 0, 30, -30, 20, -20, 0],
      } : {}}
      transition={{ duration: 4, times: [0, 0.8, 0.85, 0.88, 0.91, 0.94, 0.97, 1], ease: "linear" }}
    >
      {/* Event Horizon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isPreview ? [0, 1, 0] : [0, 2, 0], opacity: [0, 1, 1] }}
        transition={{ duration: 4, times: [0, 0.5, 1], ease: "easeInOut" }}
        className="absolute w-32 h-32 bg-black rounded-full z-10"
        style={{ boxShadow: `0 0 150px 30px ${color}, inset 0 0 40px ${color}` }}
      />

      {/* Exact Typography Match - Word Implosion */}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-col items-center relative z-20">
          <div className="w-full max-w-2xl p-2 flex flex-col relative">
            <div className="w-full px-6 py-6 text-lg md:text-2xl font-sans font-light leading-relaxed text-white text-left whitespace-pre-wrap">
              {words.map((word, i) => {
                if (!word.trim()) return <span key={i}>{word}</span>;
                return (
                  <motion.span
                    key={i}
                    initial={{ scale: 1, opacity: 1, x: 0, y: 0, rotate: 0 }}
                    animate={{ 
                      scale: [1, 0.2, 0], 
                      opacity: [1, 1, 0],
                      rotate: [0, (Math.random() - 0.5) * 720, (Math.random() - 0.5) * 1440],
                      x: [0, (Math.random() - 0.5) * 100, 0], // Pull to center relative to their position
                      y: [0, (Math.random() - 0.5) * 100, 0]
                    }}
                    transition={{ duration: 3.5, ease: "anticipate" }}
                    className="inline-block origin-center will-change-transform"
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Accretion Disk */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotateX: 75, rotateZ: 0 }}
        animate={{ scale: [0, 6, 0], opacity: [0, 1, 0], rotateZ: [0, 720] }}
        transition={{ duration: 4, times: [0, 0.5, 1], ease: "easeInOut" }}
        className="absolute w-[80vw] h-[80vw] rounded-full border-4 border-transparent z-0"
        style={{ borderTopColor: color, borderBottomColor: color }}
      />

      {/* Collapse Flash */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0, 1, 0], scale: [0, 0, 10, 0] }}
          transition={{ duration: 4, times: [0, 0.8, 0.85, 1], ease: "circOut" }}
          className="absolute inset-0 bg-white z-50 rounded-full"
        />
      )}
    </motion.div>
  );
};

const Ascension = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-fraunces italic text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, color: '#ffffff' }}
              animate={{ 
                opacity: [1, 1, 0], 
                y: [0, -50, -1000],
                color: ['#ffffff', color, color],
                scale: [1, 1.2, 0.5]
              }}
              transition={{ duration: 3, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="inline-block"
              style={{ textShadow: `0 0 20px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      
      {/* Light Rays */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 5, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-transparent"
      />
    </div>
  );
};

const QuantumGlitch = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {/* RGB Split Layers */}
      {!isPreview && ['#ff0000', '#00ff00', '#0000ff'].map((c, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scaleX: 1, scaleY: 1 }}
          animate={{ 
            x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100, 0, (i - 1) * 2000],
            y: [0, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 50, 0, 0],
            scaleX: [1, 1.1, 0.9, 1, 50],
            scaleY: [1, 0.9, 1.1, 1, 0],
            opacity: [1, 0.8, 0.9, 1, 0]
          }}
          transition={{ duration: 3.5, times: [0, 0.2, 0.4, 0.6, 1], ease: "anticipate" }}
          className="absolute text-4xl md:text-6xl lg:text-7xl font-syne font-bold text-center max-w-5xl px-8"
          style={{ color: c }}
        >
          {text}
        </motion.div>
      ))}

      {/* Core White Text */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, scaleX: 1, scaleY: 1 }}
          animate={{ 
            scaleX: [1, 1, 1, 50],
            scaleY: [1, 1, 1, 0],
            opacity: [1, 1, 1, 0]
          }}
          transition={{ duration: 3.5, times: [0, 0.2, 0.6, 1], ease: "anticipate" }}
          className="absolute z-20 text-4xl md:text-6xl lg:text-7xl font-syne font-bold text-center max-w-5xl px-8 text-white"
        >
          {text}
        </motion.div>
      )}

      {/* Digital Scanline */}
      <motion.div
        initial={{ opacity: 0, top: '0%' }}
        animate={{ opacity: [0, 0.5, 0], top: ['0%', '100%'] }}
        transition={{ duration: 2, repeat: 1, ease: "linear" }}
        className="absolute left-0 right-0 h-1 bg-white z-30"
        style={{ boxShadow: `0 0 20px ${color}` }}
      />
    </div>
  );
};

const BloodMoon = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = '#991b1b'; // Deep red
  
  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/80"}>
      {/* The Moon */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 200 }}
        animate={{ scale: isPreview ? [0, 1] : [0, 1, 1.5, 5], opacity: isPreview ? [0, 1] : [0, 1, 1, 0], y: isPreview ? [50, 0] : [200, 0, -50, -200] }}
        transition={{ duration: isPreview ? 2 : 6, times: isPreview ? [0, 1] : [0, 0.3, 0.7, 1], ease: "easeInOut" }}
        className="absolute w-[40vw] h-[40vw] rounded-full bg-red-900/40"
        style={{ boxShadow: `0 0 150px ${color}, inset 0 0 100px #000000` }}
      />

      {/* Text Eclipse */}
      {!isPreview && (
        <motion.div
          initial={{ scale: 1, opacity: 1, color: '#ffffff' }}
          animate={{ 
            scale: [1, 0.9, 0.8], 
            opacity: [1, 0.5, 0],
            color: ['#ffffff', color, '#000000']
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-fraunces italic text-center max-w-5xl px-8"
          style={{ textShadow: `0 0 20px ${color}` }}
        >
          {text}
        </motion.div>
      )}
    </div>
  );
};

const GoldenRain = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = '#fbbf24'; // Amber/Gold
  const drops = Array.from({ length: isPreview ? 20 : 60 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100, // percentage
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 2
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {/* Text Melting */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ 
            opacity: [1, 0.8, 0],
            y: [0, 100, 500],
            color: ['#ffffff', color, color]
          }}
          transition={{ duration: 4, ease: "easeIn" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-fraunces italic text-center max-w-5xl px-8"
          style={{ textShadow: `0 0 30px ${color}` }}
        >
          {text}
        </motion.div>
      )}

      {/* Rain Drops */}
      {drops.map(d => (
        <motion.div
          key={d.id}
          initial={{ opacity: 0, top: '-10%', left: `${50 + d.x}%`, scaleY: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            top: ['-10%', '110%'],
            scaleY: [0, 1, 0]
          }}
          transition={{ duration: d.duration, delay: d.delay, ease: "linear" }}
          className="absolute w-[2px] h-32 bg-gradient-to-b from-transparent via-amber-300 to-transparent"
          style={{ boxShadow: `0 0 10px ${color}` }}
        />
      ))}
    </div>
  );
};

const MatrixDecode = ({ text, theme, isPreview = false }: { text: string, theme: string, isPreview?: boolean }) => {
  const color = '#22c55e'; // Green
  const chars = isPreview ? '010101'.split('') : text.split('');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/90"}>
      <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-mono text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-2 gap-y-4">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 1, color: '#ffffff', y: 0 }}
            animate={{ 
              opacity: [1, 1, 0],
              color: ['#ffffff', color, '#000000'],
              y: [0, 0, isPreview ? 50 : 100 + Math.random() * 500]
            }}
            transition={{ duration: 3, delay: Math.random() * 2, ease: "easeIn" }}
            className="inline-block"
            style={{ textShadow: `0 0 10px ${color}` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

const AbyssSink = ({ text, theme, isPreview = false, reduceMotion = false }: { text: string, theme: string, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = '#1e3a8a'; // Deep blue
  const bubbles = Array.from({ length: isPreview ? 10 : 30 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    size: Math.random() * 10 + 5,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/40"}>
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.2, 0.8, 1], ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-blue-950/80"
        />
      )}

      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          animate={reduceMotion ? { opacity: [1, 0] } : { 
            opacity: [1, 0.5, 0],
            y: [0, 100, 300],
            filter: ['blur(0px)', 'blur(4px)', 'blur(10px)'],
            color: ['#ffffff', '#60a5fa', '#1e3a8a']
          }}
          transition={{ duration: 5, ease: "easeIn" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-serif text-center max-w-5xl px-8 will-change-transform will-change-opacity"
        >
          {text}
        </motion.div>
      )}

      {!reduceMotion && bubbles.map(b => (
        <motion.div
          key={b.id}
          initial={{ opacity: 0, bottom: '-10%', left: `${50 + b.x}%`, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0],
            bottom: ['-10%', '110%'],
            scale: [0, 1, 1.5],
            x: [0, Math.sin(b.id) * 50, Math.cos(b.id) * -50]
          }}
          transition={{ duration: b.duration, delay: b.delay, ease: "easeOut" }}
          className="absolute rounded-full border border-blue-200/50 z-30 will-change-transform will-change-opacity"
          style={{ width: b.size, height: b.size, boxShadow: `inset 0 0 5px rgba(255,255,255,0.2)` }}
        />
      ))}
    </div>
  );
};

const GlassShatter = ({ text, theme, isPreview = false, reduceMotion = false }: { text: string, theme: string, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const words = isPreview ? [] : text.split(' ');
  const shards = Array.from({ length: isPreview ? 15 : 40 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 1000,
    y: (Math.random() - 0.5) * 1000,
    rotate: (Math.random() - 0.5) * 720,
    scale: Math.random() * 2 + 0.5,
    delay: Math.random() * 0.1
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, ease: "circOut" }}
          className="absolute inset-0 bg-white z-50"
        />
      )}

      {!isPreview && (
        <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, x: 0, rotate: 0, scale: 1 }}
              animate={reduceMotion ? { opacity: [1, 0] } : { 
                opacity: [1, 1, 0], 
                y: [0, Math.random() * 500 + 200],
                x: [(Math.random() - 0.5) * 400],
                rotate: [(Math.random() - 0.5) * 360],
                scale: [1, 0.8, 0]
              }}
              transition={{ duration: 2.5 + Math.random(), delay: 0.1, ease: "easeIn" }}
              className="inline-block will-change-transform will-change-opacity"
              style={{ textShadow: `0 0 10px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}

      {!reduceMotion && shards.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            x: [0, s.x],
            y: [0, s.y + 400],
            scale: [0, s.scale, s.scale * 0.5],
            rotate: [0, s.rotate + 360]
          }}
          transition={{ duration: 2.5, delay: s.delay, ease: "easeOut" }}
          className="absolute w-0 h-0 z-30 will-change-transform will-change-opacity"
          style={{ 
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: `20px solid ${color}`,
            filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))',
            opacity: 0.6
          }}
        />
      ))}
    </div>
  );
};

const Sandstorm = ({ text, theme, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = '#d4d4d8'; // Sand/Dust color
  const particles = Array.from({ length: isPreview ? 20 : Math.floor(80 * intensity) }).map((_, i) => ({
    id: i,
    y: (Math.random() - 0.5) * 100,
    delay: Math.random() * 1.5,
    duration: 1 + Math.random() * 2
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          animate={reduceMotion ? { opacity: [1, 0] } : { 
            opacity: [1, 0.5, 0],
            x: [0, 300, 800],
            filter: ['blur(0px)', 'blur(8px)', 'blur(20px)'],
            color: ['#ffffff', color, '#000000']
          }}
          transition={{ duration: 4, ease: "easeIn" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-serif italic text-center max-w-5xl px-8 will-change-transform will-change-opacity"
        >
          {text}
        </motion.div>
      )}

      {!reduceMotion && particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, left: '30%', top: `${50 + p.y}%`, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            left: ['30%', '120%'],
            scale: [0, Math.random() * 2 + 1, 0]
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
          className="absolute w-1 h-1 rounded-full bg-zinc-300 z-30 will-change-transform will-change-opacity"
          style={{ boxShadow: `0 0 5px ${color}` }}
        />
      ))}
    </div>
  );
};

const VoidConsume = ({ text, theme, isPreview = false, reduceMotion = false }: { text: string, theme: string, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';
  const particles = Array.from({ length: isPreview ? 20 : 60 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 500;
    return {
      id: i,
      startX: Math.cos(angle) * distance,
      startY: Math.sin(angle) * distance,
      delay: Math.random() * 2,
      duration: 1.5 + Math.random() * 1.5
    };
  });

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/50"}>
      {/* Text being sucked in */}
      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          animate={reduceMotion ? { opacity: [1, 0] } : { 
            opacity: [1, 0.8, 0],
            scale: [1, 0.5, 0],
            filter: ['blur(0px)', 'blur(5px)', 'blur(20px)'],
            rotate: [0, 10, 45]
          }}
          transition={{ duration: 4, ease: "easeIn" }}
          className="relative z-10 text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-center max-w-5xl px-8 will-change-transform will-change-opacity"
          style={{ textShadow: `0 0 15px ${color}` }}
        >
          {text}
        </motion.div>
      )}

      {/* The Void Hole */}
      {!reduceMotion && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1, 1.5, 20], opacity: [0, 1, 1, 1] }}
          transition={{ duration: 5, times: [0, 0.3, 0.8, 1], ease: "easeInOut" }}
          className="absolute w-32 h-32 bg-black rounded-full z-20 will-change-transform"
          style={{ boxShadow: `0 0 60px 20px #000000, inset 0 0 20px ${color}` }}
        />
      )}

      {/* Accretion Disk */}
      {!reduceMotion && (
        <motion.div
          initial={{ scale: 0, opacity: 0, rotateX: 70, rotateZ: 0 }}
          animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0], rotateZ: [0, 360] }}
          transition={{ duration: 5, times: [0, 0.4, 1], ease: "easeInOut" }}
          className="absolute w-[60vw] h-[60vw] rounded-full border-2 border-transparent z-10 will-change-transform"
          style={{ borderTopColor: color, borderBottomColor: color, filter: 'blur(4px)' }}
        />
      )}

      {/* Particles sucked into the void */}
      {!reduceMotion && particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, x: p.startX, y: p.startY, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [p.startX, 0],
            y: [p.startY, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          className="absolute w-2 h-2 rounded-full bg-white z-30 will-change-transform will-change-opacity"
          style={{ boxShadow: `0 0 10px ${color}` }}
        />
      ))}
      
      {/* Final Blackout */}
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 0] }}
          transition={{ duration: 6, times: [0, 0.8, 0.9, 1], ease: "linear" }}
          className="absolute inset-0 bg-black z-50"
        />
      )}
    </div>
  );
};

const CherryBlossom = ({ text, theme, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = '#fbcfe8'; // Pink
  const petals = Array.from({ length: isPreview ? 15 : Math.floor(50 * intensity) }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 100,
    y: (Math.random() - 0.5) * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 3,
    rotate: Math.random() * 360
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <motion.div
          initial={{ opacity: 1, y: 0, color: '#ffffff' }}
          animate={reduceMotion ? { opacity: [1, 0] } : { 
            opacity: [1, 0.6, 0],
            y: [0, -20, -50],
            color: ['#ffffff', color, '#000000']
          }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-serif italic text-center max-w-5xl px-8 will-change-transform will-change-opacity"
          style={{ textShadow: `0 0 20px ${color}` }}
        >
          {text}
        </motion.div>
      )}

      {!reduceMotion && petals.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, left: `${50 + p.x}%`, top: `${50 + p.y}%`, scale: 0, rotate: p.rotate }}
          animate={{ 
            opacity: [0, 0.8, 0],
            left: [`${50 + p.x}%`, `${50 + p.x + (Math.random() * 30 - 15)}%`, `${50 + p.x + 20}%`],
            top: [`${50 + p.y}%`, `${50 + p.y + 40}%`],
            scale: [0, Math.random() * 1.5 + 0.5, 0],
            rotate: [p.rotate, p.rotate + 180, p.rotate + 360]
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeInOut" }}
          className="absolute w-3 h-3 rounded-tl-full rounded-br-full bg-pink-200/80 z-30 will-change-transform will-change-opacity"
          style={{ boxShadow: `0 0 8px ${color}` }}
        />
      ))}
    </div>
  );
};

const GlacialFreeze = ({ text, theme, isPreview = false, reduceMotion = false }: { text: string, theme: string, isPreview?: boolean, reduceMotion?: boolean }) => {
  const color = '#67e8f9'; // Cyan
  const words = isPreview ? [] : text.split(' ');
  const shards = Array.from({ length: isPreview ? 15 : 45 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 300 + Math.random() * 600;
    return {
      id: i,
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity,
      rotate: Math.random() * 360,
      rotateEnd: Math.random() * 720 - 360,
      scale: Math.random() * 1.5 + 0.5,
      delay: 1.5 + Math.random() * 0.5 // Explode after freeze
    };
  });

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/80"}>
      {/* Freezing overlay */}
      {!reduceMotion && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: [0, 0.5, 0], backdropFilter: ['blur(0px)', 'blur(10px)', 'blur(0px)'] }}
          transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
          className="absolute inset-0 bg-cyan-900/20 z-10"
        />
      )}

      {/* Text Freezing and Shattering */}
      {!isPreview && (
        <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-sans font-bold text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, color: '#ffffff', scale: 1, filter: 'brightness(1)' }}
              animate={reduceMotion ? { opacity: [1, 0] } : { 
                opacity: [1, 1, 0], 
                y: [0, 0, 100],
                color: ['#ffffff', color, '#ffffff'],
                scale: [1, 1.05, 0.9],
                filter: ['brightness(1)', 'brightness(2)', 'brightness(0)']
              }}
              transition={{ duration: 3, times: [0, 0.5, 1], delay: Math.random() * 0.2, ease: "easeIn" }}
              className="inline-block will-change-transform will-change-opacity"
              style={{ textShadow: `0 0 15px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}

      {/* Ice Shards */}
      {!reduceMotion && shards.map(s => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: s.rotate }}
          animate={{ 
            opacity: [0, 1, 0],
            x: [0, s.x],
            y: [0, s.y + 200], // Add gravity effect
            scale: [0, s.scale, s.scale * 0.5],
            rotate: [s.rotate, s.rotate + s.rotateEnd]
          }}
          transition={{ duration: 2.5, delay: s.delay, ease: "easeOut" }}
          className="absolute w-4 h-12 bg-gradient-to-b from-white to-cyan-300/50 z-30 will-change-transform will-change-opacity"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 20%, 80% 100%, 20% 100%, 0% 20%)',
            boxShadow: `0 0 15px ${color}` 
          }}
        />
      ))}
    </div>
  );
};

const PrismaticBurst = ({ text, theme, isPreview = false, reduceMotion = false }: { text: string, theme: string, isPreview?: boolean, reduceMotion?: boolean }) => {
  const words = isPreview ? [] : text.split(' ');
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
  const rays = Array.from({ length: isPreview ? 20 : 80 }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 400 + Math.random() * 800;
    return {
      id: i,
      angle: angle * (180 / Math.PI),
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity,
      length: 20 + Math.random() * 80,
      delay: Math.random() * 0.2
    };
  });

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden bg-black/80"}>
      {!isPreview && (
        <div className="relative z-20 text-4xl md:text-6xl lg:text-7xl font-sans font-black text-center max-w-5xl px-8 flex flex-wrap justify-center gap-x-4 gap-y-2">
          {words.map((word, i) => {
            const wordColor = colors[i % colors.length];
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, y: 0, x: 0, scale: 1, color: '#ffffff', filter: 'brightness(1)' }}
                animate={reduceMotion ? { opacity: [1, 0] } : { 
                  opacity: [1, 1, 0], 
                  y: [0, (Math.random() - 0.5) * 200],
                  x: [0, (Math.random() - 0.5) * 200],
                  scale: [1, 1.5, 0],
                  color: ['#ffffff', wordColor, wordColor],
                  filter: ['brightness(1)', 'brightness(2)', 'brightness(0)']
                }}
                transition={{ duration: 2, delay: Math.random() * 0.1, ease: "easeIn" }}
                className="inline-block will-change-transform will-change-opacity"
                style={{ textShadow: `0 0 30px ${wordColor}` }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      )}

      {/* Light Rays / Fireworks */}
      {!reduceMotion && rays.map((r, i) => {
        const pColor = colors[i % colors.length];
        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: 0, y: 0, scaleX: 0, rotate: r.angle }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [0, r.x],
              y: [0, r.y + 200], // Gravity pull
              scaleX: [0, 1, 0.5]
            }}
            transition={{ duration: 2, delay: 0.5 + r.delay, ease: "easeOut" }}
            className="absolute h-1 rounded-full z-30 origin-left will-change-transform will-change-opacity"
            style={{ 
              width: r.length,
              backgroundColor: pColor, 
              boxShadow: `0 0 20px ${pColor}, 0 0 40px ${pColor}` 
            }}
          />
        );
      })}
    </div>
  );
};

export const GlobalPulse = ({ totalReleases, onlineUsers }: { totalReleases: number, onlineUsers: number }) => {
  return (
    <div className="flex items-center gap-2 md:gap-4 z-50 pointer-events-none">
      <div className="relative flex items-center justify-center hidden sm:flex">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-6 h-6 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_70%)]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: Math.max(0.8, 4 - (totalReleases / 5000)),
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-white/30 font-syne">Global Released Thoughts Today</span>
        <div className="flex items-center gap-1 md:gap-2">
          <span className="text-[9px] md:text-[11px] font-mono text-white/50 tracking-tight">{totalReleases.toLocaleString()} <span className="hidden sm:inline">Burdened Thoughts Released</span><span className="sm:hidden">Released</span></span>
        </div>
        {onlineUsers > 1 && (
          <div className="flex items-center gap-1.5 mt-0.5 md:mt-1">
            <div className="w-1 h-1 rounded-full bg-emerald-500/50 animate-pulse" />
            <span className="text-[8px] md:text-[9px] font-mono text-emerald-400/40 tracking-wider uppercase">{onlineUsers} <span className="hidden sm:inline">Souls Online</span><span className="sm:hidden">Online</span></span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ActiveAnimationComponent = ({ text, theme, animKey, intensity = 1, isPreview = false, reduceMotion = false }: { text: string, theme: string, animKey: string, intensity?: number, isPreview?: boolean, reduceMotion?: boolean }) => {
  switch (animKey) {
    case 'supernova': return <Supernova text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'incinerate': return <Incinerate text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'nebula': return <Nebula text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'singularity': return <Singularity text={text} theme={theme} isPreview={isPreview} />;
    case 'abyssSink': return <AbyssSink text={text} theme={theme} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'sandstorm': return <Sandstorm text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'voidConsume': return <VoidConsume text={text} theme={theme} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'ascension': return <Ascension text={text} theme={theme} isPreview={isPreview} />;
    case 'quantum': return <QuantumGlitch text={text} theme={theme} isPreview={isPreview} />;
    case 'bloodMoon': return <BloodMoon text={text} theme={theme} isPreview={isPreview} />;
    case 'goldenRain': return <GoldenRain text={text} theme={theme} isPreview={isPreview} />;
    case 'matrix': return <MatrixDecode text={text} theme={theme} isPreview={isPreview} />;
    case 'glassShatter': return <GlassShatter text={text} theme={theme} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'cherryBlossom': return <CherryBlossom text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'glacialFreeze': return <GlacialFreeze text={text} theme={theme} isPreview={isPreview} reduceMotion={reduceMotion} />;
    case 'prismaticBurst': return <PrismaticBurst text={text} theme={theme} isPreview={isPreview} reduceMotion={reduceMotion} />;
    default: return <Nebula text={text} theme={theme} intensity={intensity} isPreview={isPreview} reduceMotion={reduceMotion} />;
  }
};
