import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowUp } from 'lucide-react';

const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" style={{ transform: 'translateZ(0)' }}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,10,70,0.4)_0%,_rgba(5,0,10,1)_70%)]" />
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full mix-blend-screen opacity-60 will-change-transform"
      style={{ width: '140vw', height: '140vh', background: 'radial-gradient(circle, rgba(29, 78, 216, 0.15) 0%, transparent 60%)', filter: 'blur(80px)', x: '-50%', y: '-50%' }}
      animate={{ x: ['-60%', '-40%', '-50%', '-60%'], y: ['-60%', '-40%', '-70%', '-60%'], scale: [1, 1.1, 0.95, 1] }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 mix-blend-screen opacity-60"><div className="bg-beams" /></div>
    {Array.from({ length: 80 }).map((_, i) => {
      const isBlue = Math.random() > 0.5;
      const size = Math.random() * 3 + 1;
      const glowColor = isBlue ? 'rgba(96, 165, 250, 0.5)' : 'rgba(192, 132, 252, 0.5)';
      return (
        <motion.div
          key={i}
          className={`absolute rounded-full ${isBlue ? 'bg-blue-400/80' : 'bg-purple-400/80'} will-change-transform`}
          style={{ width: size, height: size, left: Math.random() * 100 + '%', top: Math.random() * 100 + '%', boxShadow: `0 0 10px ${glowColor}` }}
          animate={{ y: [0, -Math.random() * 200 - 100], x: [0, (Math.random() - 0.5) * 100], opacity: [0, Math.random() * 0.8 + 0.2, 0], scale: [0.5, 1.5, 0.5] }}
          transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "linear", delay: Math.random() * 15 }}
        />
      );
    })}
  </div>
);

const FullScreenFlash = ({ color = "bg-purple-100" }: { color?: string }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, ease: [0.1, 1, 0.3, 1] }}
    className={`fixed inset-0 ${color} mix-blend-overlay pointer-events-none z-50`} style={{ transform: 'translateZ(0)' }}
  />
);

const Shockwave = ({ delay = 0, duration = 1, color = "border-purple-400" }: { key?: string | number, delay?: number, duration?: number, color?: string }) => (
  <motion.div
    initial={{ width: '100px', height: '100px', opacity: 1, borderWidth: '20px' }}
    animate={{ width: '200vw', height: '200vw', opacity: 0, borderWidth: '1px' }}
    transition={{ duration, ease: "easeOut", delay }}
    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-solid ${color} mix-blend-screen pointer-events-none z-40 will-change-transform`}
    style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}
  />
);

const BlackHoleEffect = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative w-96 h-96 flex items-center justify-center"
    >
      {/* Event Horizon Glow */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-black blur-[60px] opacity-60"
      />
      
      {/* Accretion Disk - 3D feel */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-40%] rounded-full border-[4px] border-double border-purple-400/20 opacity-30"
        style={{ transform: 'rotateX(70deg) rotateY(10deg)' }}
      />
      
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-60%] rounded-full border-[1px] border-dashed border-blue-400/10 opacity-20"
        style={{ transform: 'rotateX(80deg) rotateY(-15deg)' }}
      />

      {/* The Singularity */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-40 h-40 bg-black rounded-full shadow-[0_0_100px_rgba(168,85,247,0.9),inset_0_0_60px_rgba(0,0,0,1)] z-10 relative"
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
      </motion.div>
      
      {/* Gravitational Lensing / Distortion Rings */}
      {[1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [0.8, 2.5], opacity: [0.4, 0], borderWidth: ['2px', '0px'] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-purple-500/30"
        />
      ))}

      {/* Sucking Particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={`sp-${i}`}
          initial={{ x: (Math.random() - 0.5) * 1000, y: (Math.random() - 0.5) * 1000, opacity: 0, scale: 2 }}
          animate={{ x: 0, y: 0, opacity: [0, 1, 0], scale: [2, 0.1] }}
          transition={{ duration: 1.5 + Math.random(), repeat: Infinity, delay: Math.random() * 2, ease: "circIn" }}
          className="absolute w-1 h-1 bg-white rounded-full"
        />
      ))}
    </motion.div>
  </div>
);

const containerVariants: any = {
  idle: { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
  shatter: { x: [0, -15, 15, -20, 20, -10, 10, 0], y: [0, 5, -5, 8, -8, 0], scale: [1, 1.1, 0.8, 1.2, 0], opacity: [1, 1, 0.9, 0], transition: { duration: 0.6, ease: "easeInOut" } },
  implode: { scale: [1, 0.9, 0.7, 0.2, 0], rotate: [0, -5, 10, -25, 90], opacity: [1, 1, 0.8, 0], transition: { duration: 1.0, ease: "anticipate" } },
  ascend: { y: [0, -20, -80, -200], scale: [1, 1.05, 1.1, 1.2], opacity: [1, 0.8, 0.2, 0], transition: { duration: 1.2, ease: "easeOut" } },
  supernova: { scale: [1, 0.95, 1.5, 3], opacity: [1, 1, 1, 0], transition: { duration: 0.8, ease: "easeIn" } },
  pulse: { scale: [1, 0.8, 1.1, 0.9, 1.2, 0], opacity: [1, 1, 1, 0.8, 0], transition: { duration: 0.9, ease: "easeInOut" } },
  dissolve: { scale: [1, 0.95], opacity: [1, 0], filter: ['blur(0px)', 'blur(20px)'], transition: { duration: 1.5 } },
  evaporate: { y: [0, -50], scale: [1, 1.1], opacity: [1, 0], filter: ['blur(0px)', 'blur(15px)'], transition: { duration: 1.2 } },
  fallaway: { y: [0, 20, 300], scale: [1, 1.05, 0.8], opacity: [1, 1, 0], rotate: [0, 5, 15], transition: { duration: 0.8, ease: "easeIn" } },
  breeze: { x: [0, 20, 300], y: [0, -10, -50], opacity: [1, 1, 0], rotate: [0, 5, 20], transition: { duration: 1.2 } },
  burn: { scale: [1, 1.1, 0.9, 0], opacity: [1, 1, 0.8, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(0)'], transition: { duration: 1.0 } },
  fracture: { skewX: [0, -20, 40], scale: [1, 1.1, 0], opacity: [1, 1, 0], transition: { duration: 0.5 } },
  float: { y: [0, -10, -20], x: [0, 10, -10], scale: [1, 0.9], opacity: [1, 0], transition: { duration: 2.0 } },
  echo: { scale: [1, 1.1, 0.9, 1.2, 0.8, 1.3, 0], opacity: [1, 0.8, 0.6, 0.4, 0.2, 0], transition: { duration: 1.5 } },
  cleanse: { y: [0, 50, 100], scale: [1, 0.9, 0.8], opacity: [1, 0.5, 0], filter: ['blur(0px)', 'blur(10px)'], transition: { duration: 1.2 } },
  warp: { scaleX: [1, 1.5, 2, 0], scaleY: [1, 0.5, 0.2, 0], opacity: [1, 1, 0.5, 0], transition: { duration: 0.7 } },
  ripple: { scale: [1, 1.05, 0.95, 1.1, 0], opacity: [1, 0.8, 0.6, 0], transition: { duration: 1.2 } },
  shred: { scaleY: [1, 2, 3, 0], scaleX: [1, 0.5, 0.2, 0], opacity: [1, 1, 0], transition: { duration: 0.6 } },
  burst: { scale: [1, 1.5, 0], opacity: [1, 1, 0], transition: { duration: 0.4 } },
  neonFade: { scale: [1, 1.05, 0.95], opacity: [1, 1, 0], filter: ['drop-shadow(0 0 0px #a855f7)', 'drop-shadow(0 0 50px #a855f7)', 'drop-shadow(0 0 0px #a855f7)'], transition: { duration: 1.5 } },
  glitch: { x: [0, -10, 10, -5, 5, 0], skewX: [0, -20, 20, -10, 10, 0], opacity: [1, 0.8, 1, 0.5, 1, 0], filter: ['hue-rotate(0deg)', 'hue-rotate(90deg)', 'hue-rotate(-90deg)', 'hue-rotate(0deg)'], transition: { duration: 0.5 } },
  blackhole: { 
    rotateX: [0, 20, 45, 90],
    rotateY: [0, -10, -30, -60],
    z: [0, -200, -800, -2000],
    scale: [1, 0.8, 0.4, 0],
    opacity: [1, 1, 0.8, 0],
    transition: { duration: 3, ease: [0.32, 0, 0.67, 0] }
  },
  ascendLight: { y: [0, -50, -150], opacity: [1, 0.8, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(3)'], transition: { duration: 1.5, ease: "easeOut" } },
  shatterGlass: { scale: [1, 1.2, 0], opacity: [1, 1, 0], rotate: [0, 15, -15], transition: { duration: 0.4 } },
  ethereal: { scale: [1, 1.1], opacity: [1, 0], filter: ['blur(0px)', 'blur(20px)'], transition: { duration: 2, ease: "easeOut" } },
  oblivion: { scale: [1, 0.95, 0], opacity: [1, 0.8, 0], transition: { duration: 1.5, ease: "easeIn" } },
  whisper: { x: [0, 10], opacity: [1, 0], transition: { duration: 2.5, ease: "linear" } },
  submerge: { y: [0, 20], opacity: [1, 0], transition: { duration: 1.8, ease: "easeIn" } },
  mist: { opacity: [1, 0], filter: ['blur(0px)', 'blur(40px)'], scale: [1, 1.05], transition: { duration: 2.2 } },
  fadeAway: { opacity: [1, 0], transition: { duration: 3, ease: "easeInOut" } }
};

const textVariants: any = {
  idle: { opacity: 1, letterSpacing: 'normal' },
  shatter: { opacity: [1, 0], transition: { duration: 0.3 } },
  implode: { opacity: [1, 0], scale: [1, 0.5], transition: { duration: 0.6 } },
  ascend: { opacity: [1, 0], letterSpacing: ['normal', '10px', '30px'], transition: { duration: 1.0, ease: "easeOut" } },
  supernova: { opacity: [1, 0], filter: ['brightness(1)', 'brightness(10)'], transition: { duration: 0.4 } },
  pulse: { opacity: [1, 0.5, 1, 0], transition: { duration: 0.7 } },
  dissolve: { opacity: [1, 0], filter: ['blur(0px)', 'blur(10px)'], transition: { duration: 1.0 } },
  evaporate: { opacity: [1, 0], letterSpacing: ['normal', '15px'], transition: { duration: 1.0 } },
  fallaway: { opacity: [1, 0], transition: { duration: 0.5 } },
  breeze: { opacity: [1, 0], x: [0, 50], transition: { duration: 0.8 } },
  burn: { opacity: [1, 0], filter: ['brightness(1)', 'brightness(3)', 'brightness(0)'], transition: { duration: 0.8 } },
  fracture: { opacity: [1, 0], skewX: [0, 30], transition: { duration: 0.4 } },
  float: { opacity: [1, 0], transition: { duration: 1.5 } },
  echo: { opacity: [1, 0], transition: { duration: 1.2 } },
  cleanse: { opacity: [1, 0], y: [0, 20], transition: { duration: 0.8 } },
  warp: { opacity: [1, 0], scaleX: [1, 2], transition: { duration: 0.5 } },
  ripple: { opacity: [1, 0], transition: { duration: 1.0 } },
  shred: { opacity: [1, 0], scaleY: [1, 2], transition: { duration: 0.4 } },
  burst: { opacity: [1, 0], scale: [1, 1.5], transition: { duration: 0.3 } },
  neonFade: { opacity: [1, 0], filter: ['brightness(1)', 'brightness(2)', 'brightness(0)'], transition: { duration: 1.2 } },
  glitch: { opacity: [1, 0], x: [0, 10, -10, 0], transition: { duration: 0.4 } },
  blackhole: { opacity: [1, 0], transition: { duration: 0.5 } },
  ascendLight: { opacity: [1, 0], y: [0, -20], filter: ['brightness(1)', 'brightness(3)'], transition: { duration: 1.0 } },
  shatterGlass: { opacity: [1, 0], scale: [1, 1.5], transition: { duration: 0.3 } },
  ethereal: { opacity: [1, 0], filter: ['blur(0px)', 'blur(10px)'], transition: { duration: 1.5 } },
  oblivion: { opacity: [1, 0], scale: [1, 0.9], transition: { duration: 1.2 } },
  whisper: { opacity: [1, 0], transition: { duration: 2.0 } },
  submerge: { opacity: [1, 0], y: [0, 10], transition: { duration: 1.5 } },
  mist: { opacity: [1, 0], filter: ['blur(0px)', 'blur(20px)'], transition: { duration: 1.8 } },
  fadeAway: { opacity: [1, 0], transition: { duration: 2.5 } }
};

type ShockwaveConfig = { d: number; dur: number; c: string };
type ProfileConfig = { p: () => void; pD: number; rD: number; f?: string; s?: ShockwaveConfig[] };

const C = (opts: any) => confetti({ origin: { y: 0.5 }, zIndex: 1000, ...opts });
const anims: Record<string, ProfileConfig> = {
  shatter: { p: () => { C({ particleCount: 200, spread: 120, colors: ['#fff', '#d8b4fe'], startVelocity: 70, gravity: 1.2 }); C({ particleCount: 50, spread: 180, colors: ['#e4e4e7'], startVelocity: 90, shapes: ['square'] }); }, pD: 200, rD: 1200, f: 'bg-purple-200', s: [{d:0.2, dur:0.8, c:'border-white'}] },
  implode: { p: () => setTimeout(() => C({ particleCount: 300, spread: 360, colors: ['#18181b', '#581c87', '#000'], startVelocity: 50, gravity: 0.1, ticks: 400 }), 500), pD: 0, rD: 1500 },
  ascend: { p: () => { const e = Date.now()+1500; const f = () => { C({ particleCount: 5, angle: 90, spread: 90, origin: {y:0.6}, colors: ['#f3e8ff', '#d8b4fe'], startVelocity: 25, gravity: -0.3 }); if(Date.now()<e) requestAnimationFrame(f); }; f(); }, pD: 100, rD: 1800 },
  supernova: { p: () => C({ particleCount: 400, spread: 360, colors: ['#fff', '#e9d5ff'], startVelocity: 100, gravity: 0.5, scalar: 1.2 }), pD: 400, rD: 1200, f: 'bg-white', s: [{d:0.4, dur:1.2, c:'border-purple-300'}] },
  pulse: { p: () => { C({ particleCount: 150, spread: 360, colors: ['#60a5fa', '#fff'], startVelocity: 60 }); setTimeout(() => C({ particleCount: 150, spread: 360, colors: ['#c084fc'], startVelocity: 80 }), 200); }, pD: 100, rD: 1200, s: [{d:0, dur:1, c:'border-blue-400'}, {d:0.2, dur:1, c:'border-purple-400'}, {d:0.4, dur:1, c:'border-white'}] },
  dissolve: { p: () => C({ particleCount: 200, spread: 360, colors: ['#a1a1aa', '#71717a'], startVelocity: 30, gravity: 0.2, drift: 0.5, ticks: 300 }), pD: 200, rD: 1600 },
  evaporate: { p: () => { const e = Date.now()+1000; const f = () => { C({ particleCount: 8, angle: 90, spread: 45, colors: ['#e0e7ff', '#c7d2fe'], startVelocity: 40, gravity: -0.5 }); if(Date.now()<e) requestAnimationFrame(f); }; f(); }, pD: 100, rD: 1500 },
  fallaway: { p: () => C({ particleCount: 150, angle: 270, spread: 60, colors: ['#3f3f46', '#27272a'], startVelocity: 60, gravity: 1.5 }), pD: 100, rD: 1000 },
  breeze: { p: () => C({ particleCount: 200, angle: 0, spread: 45, colors: ['#f3f4f6', '#d1d5db'], startVelocity: 80, gravity: 0.1, drift: 1, ticks: 300 }), pD: 200, rD: 1400 },
  burn: { p: () => { C({ particleCount: 250, spread: 360, colors: ['#f9a8d4', '#f472b6', '#fb7185'], startVelocity: 50, gravity: -0.1 }); C({ particleCount: 100, spread: 360, colors: ['#18181b'], startVelocity: 30, gravity: 0.5 }); }, pD: 300, rD: 1300, f: 'bg-pink-200', s: [{d:0.3, dur:0.8, c:'border-pink-400'}] },
  fracture: { p: () => C({ particleCount: 150, spread: 180, colors: ['#fff', '#a855f7'], startVelocity: 90, gravity: 1.5, shapes: ['square'], scalar: 0.8 }), pD: 100, rD: 1000, s: [{d:0.1, dur:0.5, c:'border-white'}] },
  float: { p: () => C({ particleCount: 100, spread: 360, colors: ['#ddd6fe', '#c4b5fd'], startVelocity: 20, gravity: 0, drift: 0.2, ticks: 500 }), pD: 200, rD: 2200 },
  echo: { p: () => { [0, 300, 600].forEach(d => setTimeout(() => C({ particleCount: 50, spread: 360, colors: ['#a78bfa'], startVelocity: 40, gravity: 0.2 }), d)); }, pD: 0, rD: 1800, s: [{d:0, dur:1, c:'border-purple-300'}, {d:0.3, dur:1, c:'border-purple-400'}, {d:0.6, dur:1, c:'border-purple-500'}] },
  cleanse: { p: () => { const e = Date.now()+800; const f = () => { C({ particleCount: 15, angle: 270, spread: 90, colors: ['#93c5fd', '#60a5fa', '#3b82f6'], startVelocity: 50, gravity: 1.2 }); if(Date.now()<e) requestAnimationFrame(f); }; f(); }, pD: 100, rD: 1400, f: 'bg-blue-100' },
  warp: { p: () => { C({ particleCount: 100, spread: 20, angle: 0, colors: ['#c084fc'], startVelocity: 120, gravity: 0 }); C({ particleCount: 100, spread: 20, angle: 180, colors: ['#c084fc'], startVelocity: 120, gravity: 0 }); }, pD: 200, rD: 1000, s: [{d:0.2, dur:0.6, c:'border-fuchsia-400'}] },
  ripple: { p: () => C({ particleCount: 100, spread: 360, colors: ['#bfdbfe', '#e0e7ff'], startVelocity: 30, gravity: 0.1, ticks: 300 }), pD: 200, rD: 1500, s: [{d:0.2, dur:1.5, c:'border-blue-200'}] },
  shred: { p: () => C({ particleCount: 150, angle: 270, spread: 20, colors: ['#d4d4d8', '#a1a1aa'], startVelocity: 100, gravity: 2, shapes: ['square'] }), pD: 100, rD: 900 },
  burst: { p: () => C({ particleCount: 300, spread: 360, colors: ['#fff', '#f3e8ff', '#d8b4fe'], startVelocity: 120, gravity: 0.8 }), pD: 0, rD: 1000, f: 'bg-white', s: [{d:0, dur:0.5, c:'border-white'}] },
  neonFade: { p: () => C({ particleCount: 150, spread: 360, colors: ['#a855f7', '#d8b4fe', '#fff'], startVelocity: 40, gravity: 0.1, ticks: 200 }), pD: 100, rD: 1600, f: 'bg-purple-500', s: [{d:0, dur:1.5, c:'border-purple-500'}] },
  glitch: { p: () => { C({ particleCount: 100, spread: 180, colors: ['#ef4444', '#3b82f6', '#22c55e'], startVelocity: 80, gravity: 1, shapes: ['square'] }); setTimeout(() => C({ particleCount: 100, spread: 180, colors: ['#fff'], startVelocity: 100, gravity: 1 }), 100); }, pD: 0, rD: 800 },
  blackhole: { p: () => { 
    const e = Date.now() + 2500;
    const f = () => {
      C({ particleCount: 15, spread: 360, origin: { x: 0.5, y: 0.5 }, colors: ['#000', '#4c1d95', '#1e40af'], startVelocity: -40, gravity: 0, scalar: 0.7 });
      if (Date.now() < e) requestAnimationFrame(f);
    };
    f();
  }, pD: 0, rD: 3500 },
  ascendLight: { p: () => { const e = Date.now()+1200; const f = () => { C({ particleCount: 10, angle: 90, spread: 45, origin: {y: 0.8}, colors: ['#fff', '#fef08a', '#fde047'], startVelocity: 60, gravity: -0.2 }); if(Date.now()<e) requestAnimationFrame(f); }; f(); }, pD: 100, rD: 1600, f: 'bg-yellow-100' },
  shatterGlass: { p: () => { C({ particleCount: 300, spread: 360, colors: ['#e0e7ff', '#c7d2fe', '#fff'], startVelocity: 100, gravity: 1.5, shapes: ['square'] }); }, pD: 0, rD: 1000, s: [{d:0, dur:0.5, c:'border-white'}, {d:0.1, dur:0.6, c:'border-blue-200'}] },
  ethereal: { p: () => {}, pD: 0, rD: 2000 },
  oblivion: { p: () => {}, pD: 0, rD: 1500 },
  whisper: { p: () => {}, pD: 0, rD: 2500 },
  submerge: { p: () => {}, pD: 0, rD: 1800 },
  mist: { p: () => {}, pD: 0, rD: 2200 },
  fadeAway: { p: () => {}, pD: 0, rD: 3000 }
};

// --- Constants & Data ---

interface Stats {
  total: number;
}

type Phase = 'intro' | 'idle' | 'prep' | 'destroying' | 'aftermath';

export default function AntiJournal() {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [activeAnim, setActiveAnim] = useState<string | null>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [aftermathMessage, setAftermathMessage] = useState('');
  
  const [stats, setStats] = useState<Stats>({ total: 0 });
  const [showStats, setShowStats] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastAnimRef = useRef<string | null>(null);

  const PayPalButton = () => {
    useEffect(() => {
      const renderButton = () => {
        const container = document.getElementById('donate-button');
        if (container) container.innerHTML = ''; // Clear container
        // @ts-ignore
        if (window.PayPal) {
          // @ts-ignore
          window.PayPal.Donation.Button({
            env: 'production',
            hosted_button_id: '9YCRLK83LH2SQ',
            image: {
              src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
              alt: 'Donate with PayPal button',
              title: 'PayPal - The safer, easier way to pay online!',
            }
          }).render('#donate-button');
        }
      };

      if (document.querySelector('script[src="https://www.paypalobjects.com/donate/sdk/donate-sdk.js"]')) {
        renderButton();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    }, []);
    return <div id="donate-button-container" className="flex justify-center"><div id="donate-button"></div></div>;
  };

  const typingIntensity = useMemo(() => Math.min(text.length / 100, 1), [text]);

  const aftermathMessages = [
    "Breathe. It's gone.", "Lightness returns.", "The void is quiet.",
    "Letting go is freedom.", "Clearer now.", "Peace found.", "Unburdened."
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 250)}px`;
    }
  }, [text]);

  useEffect(() => {
    const savedStats = localStorage.getItem('journalStats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDestroy();
    }
  };

  const handleDestroy = () => {
    if (!text.trim() || activeAnim) return;

    // Update stats
    const newStats = { ...stats };
    newStats.total += 1;
    setStats(newStats);
    localStorage.setItem('journalStats', JSON.stringify(newStats));

    const profiles = Object.keys(anims);
    let selectedProfile = profiles[Math.floor(Math.random() * profiles.length)];
    
    // Ensure it's different from the last one
    if (profiles.length > 1 && selectedProfile === lastAnimRef.current) {
      const filteredProfiles = profiles.filter(p => p !== lastAnimRef.current);
      selectedProfile = filteredProfiles[Math.floor(Math.random() * filteredProfiles.length)];
    }
    
    lastAnimRef.current = selectedProfile;
    setActiveAnim(selectedProfile);
    
    // Get message
    setAftermathMessage(aftermathMessages[Math.floor(Math.random() * aftermathMessages.length)]);

    const config = anims[selectedProfile];
    setTimeout(config.p, config.pD);

    setTimeout(() => {
      setActiveAnim(null);
      setIsDestroyed(true);
      setText('');
      setTimeout(() => setIsDestroyed(false), 3500);
    }, config.rD);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden selection:bg-purple-500/30 selection:text-white bg-[#05000a]" style={{ perspective: '2000px' }}>
      <AmbientBackground />
      
      <AnimatePresence>
        {activeAnim === 'blackhole' && <BlackHoleEffect />}
        {activeAnim && anims[activeAnim].f && <FullScreenFlash color={anims[activeAnim].f} />}
        {activeAnim && anims[activeAnim].s?.map((sw, i) => (
          <Shockwave key={i} delay={sw.d} duration={sw.dur} color={sw.c} />
        ))}
      </AnimatePresence>

      <div className="w-full max-w-3xl flex flex-col items-center justify-center flex-grow relative z-10">
        <AnimatePresence mode="wait">
          {!isDestroyed ? (
            <motion.div
              key="input-area"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              className="w-full flex flex-col items-center relative"
            >
              <motion.div
                className="absolute inset-0 rounded-[28px] bg-purple-600/30 mix-blend-screen pointer-events-none will-change-transform"
                style={{ filter: 'blur(40px)', transform: 'translateZ(0)' }}
                animate={{ opacity: typingIntensity * 0.8 + 0.1, scale: 1 + typingIntensity * 0.1 }}
                transition={{ duration: 0.2 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: text ? 0 : 1, 
                  y: text ? -20 : 0,
                  scale: text ? 0.95 : 1
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-12 text-center pointer-events-none"
              >
                <h2 className="text-4xl md:text-5xl font-serif italic text-white/90 tracking-tight leading-tight">
                  What's weighing on your mind?
                </h2>
                <p className="mt-4 text-purple-200/40 font-sans text-sm tracking-widest uppercase">
                  The void is listening.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants} initial="idle" animate={activeAnim || "idle"}
                className="liquid-glass rounded-[28px] w-full max-w-2xl p-2 flex flex-col relative z-20 will-change-transform"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.div variants={textVariants} initial="idle" animate={activeAnim || "idle"} className="w-full flex flex-col relative" style={{ transformStyle: 'preserve-3d' }}>
                  {activeAnim === 'blackhole' ? (
                    <div className="w-full px-6 py-6 text-xl md:text-2xl font-sans font-light leading-relaxed min-h-[80px] relative overflow-visible">
                      {text.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 1, x: 0, y: 0, z: 0, rotate: 0 }}
                          animate={{ 
                            x: (Math.random() - 0.5) * 100, 
                            y: (Math.random() - 0.5) * 100, 
                            z: -1000, 
                            rotate: Math.random() * 720,
                            opacity: 0,
                            scale: 0
                          }}
                          transition={{ 
                            duration: 1.5 + Math.random(), 
                            delay: Math.random() * 1.5,
                            ease: "circIn"
                          }}
                          className="inline-block whitespace-pre"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      ref={textareaRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} disabled={!!activeAnim}
                      placeholder="Type to release..."
                      className="w-full bg-transparent text-white placeholder:text-white/30 text-xl md:text-2xl font-sans font-light resize-none focus:outline-none px-6 py-6 leading-relaxed relative z-10"
                      rows={1} spellCheck={false}
                      style={{ textShadow: `0 0 ${typingIntensity * 10}px rgba(216, 180, 254, ${typingIntensity * 0.5})` }}
                    />
                  )}
                  
                  <div className="flex justify-between items-center px-4 pb-3 pt-2">
                    <AnimatePresence>
                      {text.trim() && !activeAnim ? (
                        <motion.span 
                          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                          className="text-purple-200/50 text-[10px] font-sans uppercase tracking-[0.2em] ml-2"
                        >
                          Press Enter to release
                        </motion.span>
                      ) : (
                        <span className="text-transparent text-[10px] font-sans uppercase tracking-[0.2em] ml-2 select-none">Placeholder</span>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {text.trim() && !activeAnim && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.5, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }} whileTap={{ scale: 0.9 }}
                          onClick={handleDestroy}
                          className="liquid-glass-strong rounded-full p-2.5 text-white transition-colors flex items-center justify-center group cursor-pointer relative overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                          <ArrowUp className="w-5 h-5 opacity-90 group-hover:opacity-100 transition-opacity relative z-10" />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="aftermath"
              initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <p className="text-purple-100/80 font-serif italic text-4xl md:text-5xl tracking-wide drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                {aftermathMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 text-purple-200/30 font-sans text-[10px] tracking-[0.3em] uppercase z-10 flex items-center gap-4"
      >
        <span>Thoughts cleared today: <span className="text-purple-300/80 font-medium ml-2">{stats.total}</span></span>
        <button onClick={() => setShowStats(true)} className="hover:text-purple-300 transition-colors">Settings</button>
        <button onClick={() => setShowDonation(true)} className="hover:text-purple-300 transition-colors">Support</button>
      </motion.div>

      <AnimatePresence>
        {showDonation && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setShowDonation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0015] border border-purple-500/20 rounded-3xl p-8 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-serif italic text-white mb-6">Support the Void</h2>
              <PayPalButton />
              <button onClick={() => setShowDonation(false)} className="mt-8 w-full py-2 bg-white/10 rounded-lg text-white text-sm font-sans">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#11051a] border border-purple-900/50 rounded-2xl p-6 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-xl font-sans text-white mb-4">Settings & History</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-sans">Reduce Motion</span>
                  <button 
                    onClick={() => setReduceMotion(!reduceMotion)}
                    className={`w-10 h-5 rounded-full transition-colors ${reduceMotion ? 'bg-purple-600' : 'bg-white/20'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${reduceMotion ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-white text-sm font-sans">Total Releases: {stats.total}</h3>
                </div>
              </div>
              <button onClick={() => setShowStats(false)} className="mt-6 w-full py-2 bg-white/10 rounded-lg text-white text-sm font-sans">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
