import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { ArrowUp, Lock, Sparkles, History, Palette, Activity, X, CheckCircle2, Zap, LogOut, TrendingUp, Twitter, Github, Mountain, Diamond, Orbit, Grid3X3, Waves, Layers, User, Eye, Shield, Volume2, VolumeX } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, subDays, isSameMonth, isSameDay } from 'date-fns';
import { auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, FirebaseUser, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, where, increment } from 'firebase/firestore';
import { LiquidMetalShader } from './LiquidMetalShader';
import { ANIMATIONS_CONFIG, ActiveAnimationComponent, THEME_COLORS, GlobalPulse } from './ReleaseAnimations';
import { VoidGarden, Fragment } from './VoidGarden';
import { RITUAL_MODES } from './RitualSelector';
import { useLanguage, Language } from '../contexts/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type RitualMode = 'heavy' | 'mist' | 'echo' | 'standard' | 'oracle';

type Theme = 'liquidGlass' | 'cinematicNoir' | 'auroraGlow' | 'minimalLuxury' | 'futuristicEditorial' | 'softHolographic' | 'deepSpace' | 'stardust' | 'retroGrid' | 'auroraBorealis' | 'sereneLandscape' | 'obsidian' | 'nebula' | 'void' | 'midnight' | 'crimson' | 'ethereal' | 'abyss' | 'nebulaVortex' | 'midnightSanctuary' | 'nocturnalHaven' | 'urbanSolitude' | 'felineVigil' | 'transitEchoes' | 'twilightLofi' | 'sunsetDrift' | 'woodlandRetreat' | 'oceanicHorizon' | 'cascadingSerenity' | 'snowboundSilence' | 'urbanEchoes' | 'sunsetVigil' | 'neonPulse' | 'celestialWhispers' | 'galacticBloom' | 'lunarTide';

const THEMES: Record<Theme, { bg: string, accent: string, text: string, name: string, isPro: boolean, isOld?: boolean, isLive?: boolean, videoUrl?: string, audioUrl?: string, volume?: number, filter?: string, zoom?: boolean, playbackRate?: number, isGif?: boolean, noOverlay?: boolean, icon: React.ReactNode }> = {
  // Live Atmospheres (Video Themes)
  midnightSanctuary: { bg: 'bg-black', accent: 'indigo', text: 'text-indigo-100', name: 'Midnight Sanctuary', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/ckw6ym.mp4', audioUrl: 'https://files.catbox.moe/rzwh3d.mp3', volume: 0.2, filter: 'brightness(0.6) contrast(1.1)', icon: <Waves className="w-5 h-5" /> },
  nocturnalHaven: { bg: 'bg-black', accent: 'orange', text: 'text-orange-100', name: 'Nocturnal Haven', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/oj4c2s.mp4', audioUrl: 'https://files.catbox.moe/2qxivc.mp3', filter: 'brightness(0.7) contrast(1.05)', icon: <Waves className="w-5 h-5" /> },
  urbanSolitude: { bg: 'bg-black', accent: 'blue', text: 'text-blue-100', name: 'Urban Solitude', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/r688ph.mp4', filter: 'brightness(0.6)', zoom: true, icon: <Waves className="w-5 h-5" /> },
  felineVigil: { bg: 'bg-black', accent: 'slate', text: 'text-slate-100', name: 'Feline Vigil', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/80u912.mp4', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.6)', icon: <Waves className="w-5 h-5" /> },
  transitEchoes: { bg: 'bg-black', accent: 'zinc', text: 'text-zinc-100', name: 'Transit Echoes', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/wba8j2.mp4', audioUrl: 'https://files.catbox.moe/zu8uiw.mp3', filter: 'brightness(0.5)', icon: <Waves className="w-5 h-5" /> },
  twilightLofi: { bg: 'bg-black', accent: 'purple', text: 'text-purple-100', name: 'Twilight Lo-Fi', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/e6p8m1.mp4', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.8)', icon: <Waves className="w-5 h-5" /> },
  sunsetDrift: { bg: 'bg-black', accent: 'orange', text: 'text-orange-100', name: 'Sunset Drift', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/0ksawe.mp4', filter: 'brightness(0.8)', icon: <Waves className="w-5 h-5" /> },
  woodlandRetreat: { bg: 'bg-black', accent: 'emerald', text: 'text-emerald-100', name: 'Woodland Retreat', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/129ue0.mp4', filter: 'brightness(0.7)', icon: <Mountain className="w-5 h-5" /> },
  oceanicHorizon: { bg: 'bg-black', accent: 'blue', text: 'text-blue-100', name: 'Oceanic Horizon', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/ekvzk3.mp4', filter: 'brightness(0.7)', icon: <Waves className="w-5 h-5" /> },
  cascadingSerenity: { bg: 'bg-black', accent: 'teal', text: 'text-teal-100', name: 'Cascading Serenity', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/gzjamw.gif', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.7)', zoom: true, isGif: true, icon: <Waves className="w-5 h-5" /> },
  snowboundSilence: { bg: 'bg-black', accent: 'slate', text: 'text-slate-100', name: 'Snowbound Silence', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/u4ujnb.gif', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.7)', isGif: true, icon: <Waves className="w-5 h-5" /> },
  urbanEchoes: { bg: 'bg-black', accent: 'zinc', text: 'text-zinc-100', name: 'Urban Echoes', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/ipn54d.gif', isGif: true, icon: <Waves className="w-5 h-5" /> },
  sunsetVigil: { bg: 'bg-black', accent: 'orange', text: 'text-orange-100', name: 'Sunset Vigil', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/fglfav.gif', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.7)', isGif: true, icon: <Waves className="w-5 h-5" /> },
  neonPulse: { bg: 'bg-black', accent: 'purple', text: 'text-purple-100', name: 'Neon Pulse', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/vfys71.gif', audioUrl: 'https://files.catbox.moe/bk9aev.mp3', filter: 'brightness(0.6)', isGif: true, icon: <Waves className="w-5 h-5" /> },
  celestialWhispers: { bg: 'bg-black', accent: 'indigo', text: 'text-indigo-100', name: 'Celestial Whispers', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/amr3r5.gif', audioUrl: 'https://files.catbox.moe/zu8uiw.mp3', isGif: true, noOverlay: true, icon: <Sparkles className="w-5 h-5" /> },
  galacticBloom: { bg: 'bg-black', accent: 'fuchsia', text: 'text-fuchsia-100', name: 'Galactic Bloom', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/l14uyj.gif', audioUrl: 'https://files.catbox.moe/zu8uiw.mp3', filter: 'brightness(0.85)', isGif: true, icon: <Orbit className="w-5 h-5" /> },
  lunarTide: { bg: 'bg-black', accent: 'blue', text: 'text-blue-100', name: 'Lunar Tide', isPro: false, isLive: true, videoUrl: 'https://files.catbox.moe/klkmjo.gif', zoom: true, isGif: true, noOverlay: true, icon: <Waves className="w-5 h-5" /> },
  nebulaVortex: { bg: 'bg-[#000000]', accent: 'indigo', text: 'text-indigo-100', name: 'Nebula Vortex', isPro: true, isLive: true, videoUrl: 'https://files.catbox.moe/a1dso1.mp4', playbackRate: 0.5, icon: <Orbit className="w-5 h-5" /> },

  // New Premium Themes
  stardust: { bg: 'bg-[#020205]', accent: 'slate', text: 'text-slate-100', name: 'Stardust', isPro: false, icon: <Sparkles className="w-5 h-5" /> },
  retroGrid: { bg: 'bg-[#050505]', accent: 'emerald', text: 'text-emerald-400', name: 'Retro Grid', isPro: true, icon: <Grid3X3 className="w-5 h-5" /> },
  auroraBorealis: { bg: 'bg-[#010409]', accent: 'teal', text: 'text-teal-100', name: 'Aurora Borealis', isPro: true, icon: <Waves className="w-5 h-5" /> },
  sereneLandscape: { bg: 'bg-[#0a0a0a]', accent: 'stone', text: 'text-stone-100', name: 'Serene Landscape', isPro: true, icon: <Mountain className="w-5 h-5" /> },
  obsidian: { bg: 'bg-[#000000]', accent: 'zinc', text: 'text-zinc-400', name: 'Obsidian', isPro: false, icon: <Diamond className="w-5 h-5" /> },
  nebula: { bg: 'bg-[#05000a]', accent: 'pink', text: 'text-pink-100', name: 'Nebula', isPro: true, icon: <Orbit className="w-5 h-5" /> },
  
  // Refined Original Themes (Darker)
  liquidGlass: { bg: 'bg-[#000000]', accent: 'white', text: 'text-white', name: 'Liquid Glass', isPro: true, icon: <Layers className="w-5 h-5" /> },
  cinematicNoir: { bg: 'bg-[#030303]', accent: 'zinc', text: 'text-zinc-400', name: 'Cinematic Noir', isPro: false, icon: <Sparkles className="w-5 h-5" /> },
  auroraGlow: { bg: 'bg-[#010208]', accent: 'emerald', text: 'text-emerald-200', name: 'Aurora Glow', isPro: true, icon: <Sparkles className="w-5 h-5" /> },
  minimalLuxury: { bg: 'bg-[#050505]', accent: 'stone', text: 'text-stone-300', name: 'Minimal Luxury', isPro: true, icon: <Sparkles className="w-5 h-5" /> },
  futuristicEditorial: { bg: 'bg-[#000000]', accent: 'orange', text: 'text-orange-200', name: 'Futuristic Editorial', isPro: true, icon: <Sparkles className="w-5 h-5" /> },
  softHolographic: { bg: 'bg-[#050414]', accent: 'fuchsia', text: 'text-fuchsia-200', name: 'Soft Holographic', isPro: true, icon: <Sparkles className="w-5 h-5" /> },
  deepSpace: { bg: 'bg-[#000000]', accent: 'indigo', text: 'text-indigo-300', name: 'Deep Space', isPro: true, icon: <Sparkles className="w-5 h-5" /> },
  
  // Legacy Themes
  void: { bg: 'bg-[#030008]', accent: 'purple', text: 'text-purple-300', name: 'The Void', isPro: false, isOld: true, icon: <Sparkles className="w-5 h-5" /> },
  midnight: { bg: 'bg-[#00040a]', accent: 'blue', text: 'text-blue-300', name: 'Midnight', isPro: false, isOld: true, icon: <Sparkles className="w-5 h-5" /> },
  crimson: { bg: 'bg-[#0a0202]', accent: 'red', text: 'text-red-300', name: 'Crimson', isPro: true, isOld: true, icon: <Sparkles className="w-5 h-5" /> },
  ethereal: { bg: 'bg-[#010208]', accent: 'slate', text: 'text-slate-300', name: 'Ethereal', isPro: true, isOld: true, icon: <Sparkles className="w-5 h-5" /> },
  abyss: { bg: 'bg-[#020202]', accent: 'zinc', text: 'text-zinc-500', name: 'Abyss', isPro: true, isOld: true, icon: <Sparkles className="w-5 h-5" /> },
};

interface ReleaseEntry {
  id: string;
  timestamp: number;
  snippet: string; // A blurred or short version of what they released
  animation: string;
}

interface UserData {
  tier: 'free' | 'pro';
  totalReleases: number;
  dailyReleases: number;
  lastDailyUpdate: number;
  monthlyReleases: number;
  lastMonthlyUpdate: number;
  history: ReleaseEntry[];
  theme: Theme;
  selectedAnimation?: string;
  isEcoMode?: boolean;
  disableBreathing?: boolean;
  paypalSubscriptionId?: string;
  totalElapsedTime?: number;
  lastSeen?: number;
}

const defaultUserData: UserData = {
  tier: 'free',
  totalReleases: 0,
  dailyReleases: 0,
  lastDailyUpdate: Date.now(),
  monthlyReleases: 0,
  lastMonthlyUpdate: Date.now(),
  history: [],
  theme: 'stardust',
  selectedAnimation: 'random',
  isEcoMode: false,
  disableBreathing: false,
  totalElapsedTime: 0,
  lastSeen: Date.now()
};

const CosmicCanvas = ({ theme, reduceMotion = false }: { theme: Theme, reduceMotion?: boolean }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 50,
        y: (e.clientY / window.innerHeight - 0.5) * 50
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    
    // Configuration based on theme
    const isNebula = theme === 'nebula' || theme === 'softHolographic';
    const isDeepSpace = theme === 'deepSpace' || theme === 'void';
    
    // Nebula blobs
    const nebulaColors = isNebula 
      ? ['rgba(112, 26, 117, 0.15)', 'rgba(76, 5, 25, 0.15)', 'rgba(5, 0, 10, 0.2)']
      : ['rgba(30, 27, 75, 0.1)', 'rgba(15, 23, 42, 0.1)', 'rgba(0, 0, 0, 0.2)'];
      
    const blobs = Array.from({ length: 6 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 40, // 40% to 80% of screen
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      color: nebulaColors[i % nebulaColors.length],
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.001 + 0.0005
    }));

    // Galaxy parameters
    const galaxies = isDeepSpace ? [
      { x: 80, y: 20, size: 45, color: '#818cf8', rotation: 0, rotSpeed: 0.0008, arms: 3, opacity: 0.6 },
      { x: 20, y: 70, size: 30, color: '#4338ca', rotation: Math.PI, rotSpeed: -0.0006, arms: 2, opacity: 0.4 }
    ] : isNebula ? [
      { x: 70, y: 30, size: 40, color: '#ec4899', rotation: 0, rotSpeed: 0.001, arms: 4, opacity: 0.5 }
    ] : [];

    // Gravitational lensing particles for Deep Space
    const lensingParticles = isDeepSpace ? Array.from({ length: 20 }).map(() => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 100 + 200,
      speed: Math.random() * 0.002 + 0.001,
      size: Math.random() * 2 + 1
    })) : [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawGalaxy = (g: any, time: number) => {
      const centerX = (g.x / 100) * canvas.width + mousePos.current.x * 0.5;
      const centerY = (g.y / 100) * canvas.height + mousePos.current.y * 0.5;
      const radius = (g.size / 100) * Math.max(canvas.width, canvas.height);
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(g.rotation + time * g.rotSpeed);
      
      // Core
      const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 0.25);
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coreGradient.addColorStop(0.4, g.color + '99');
      coreGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Arms
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < g.arms; i++) {
        const armAngle = (i / g.arms) * Math.PI * 2;
        for (let j = 0; j < 150; j++) {
          const t = j / 150;
          const r = t * radius;
          const angle = armAngle + t * Math.PI * 3;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          
          const size = (1 - t) * 20 + 1;
          const opacity = (1 - t) * g.opacity;
          
          // Add some noise to arm particles
          const nx = x + (Math.random() - 0.5) * 10;
          const ny = y + (Math.random() - 0.5) * 10;
          
          ctx.fillStyle = g.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
          ctx.beginPath();
          ctx.arc(nx, ny, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawLensing = (time: number) => {
      const centerX = canvas.width / 2 + mousePos.current.x;
      const centerY = canvas.height / 2 + mousePos.current.y;
      
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.globalCompositeOperation = 'screen';
      
      lensingParticles.forEach(p => {
        p.angle += p.speed;
        const x = Math.cos(p.angle) * p.radius;
        const y = Math.sin(p.angle) * p.radius;
        
        // Stretch particle towards center to simulate lensing
        const stretch = 1.5;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y, p.size * stretch, p.size, p.angle, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    };

    const render = (time: number) => {
      timeRef.current = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Nebula Blobs
      ctx.globalCompositeOperation = 'screen';
      blobs.forEach(blob => {
        if (!reduceMotion) {
          blob.x += blob.vx;
          blob.y += blob.vy;
          if (blob.x < -20) blob.x = 120;
          if (blob.x > 120) blob.x = -20;
          if (blob.y < -20) blob.y = 120;
          if (blob.y > 120) blob.y = -20;
        }

        const x = (blob.x / 100) * canvas.width + mousePos.current.x * 0.2;
        const y = (blob.y / 100) * canvas.height + mousePos.current.y * 0.2;
        const size = (blob.size / 100) * Math.max(canvas.width, canvas.height) * (1 + Math.sin(time * blob.pulseSpeed + blob.phase) * 0.15);
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(0.5, blob.color.replace('0.15', '0.05').replace('0.1', '0.02'));
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Galaxies
      galaxies.forEach(g => drawGalaxy(g, time));
      
      // Draw Lensing if Deep Space
      if (isDeepSpace) drawLensing(time);

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (!reduceMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [theme, reduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

const BlackHole = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none z-0 mix-blend-screen">
      {/* Accretion Disk */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full blur-xl opacity-80"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(139, 92, 246, 0.6), transparent, rgba(236, 72, 153, 0.6), transparent)',
          transform: 'scale(1.8) rotateX(75deg)'
        }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-10 rounded-full blur-md opacity-60 mix-blend-overlay"
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.8), transparent, rgba(139, 92, 246, 0.8), transparent)',
          transform: 'scale(1.5) rotateX(70deg)'
        }}
      />
      {/* Event Horizon */}
      <div className="absolute inset-32 bg-black rounded-full shadow-[0_0_150px_rgba(139,92,246,0.8),inset_0_0_50px_rgba(0,0,0,1)] z-10" />
      {/* Distortion Ring */}
      <div className="absolute inset-[100px] rounded-full border-[2px] border-white/20 blur-[2px] z-20" />
      <div className="absolute inset-[110px] rounded-full border-[1px] border-purple-500/30 blur-[1px] z-20" />
    </div>
  );
};

const CosmicRays = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
      {[1, 2, 3, 4, 5].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: '-100%', y: `${i * 20}%`, rotate: -45, opacity: 0 }}
          animate={{ 
            x: '200%', 
            y: `${i * 20 + 30}%`,
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 10 + i * 3, 
            repeat: Infinity, 
            ease: "linear",
            delay: i * 2
          }}
          className="absolute w-[200%] h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-[2px]"
        />
      ))}
    </div>
  );
};

const Planet = ({ color = '#1e293b', size = '200px', position = { top: '20%', left: '10%' } as React.CSSProperties }) => {
  return (
    <motion.div
      initial={{ ...position, opacity: 0 } as any}
      animate={{ 
        opacity: 0.6,
        x: [0, 15, 0],
        y: [0, -15, 0],
        rotate: [0, 5, 0]
      }}
      transition={{ duration: 60, repeat: Infinity, ease: "easeInOut" }}
      className="absolute rounded-full z-0 pointer-events-none mix-blend-screen"
      style={{ 
        width: size, 
        height: size,
        ...position,
        background: `radial-gradient(circle at 30% 30%, ${color} 0%, #000 80%)`,
        boxShadow: `inset -30px -30px 60px rgba(0,0,0,0.9), 0 0 80px ${color}40, inset 10px 10px 30px rgba(255,255,255,0.1)`
      }}
    >
      {/* Atmosphere Glow */}
      <div className="absolute inset-[-10px] rounded-full border border-white/10 blur-[4px]" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay" />
    </motion.div>
  );
};

const Galaxy = ({ color = '#818cf8', size = '80vw', position = { top: '-10%', right: '-10%' } as React.CSSProperties }) => {
  return (
    <div 
      className="absolute pointer-events-none z-0"
      style={{ 
        width: size, 
        height: size, 
        ...position,
        perspective: '1000px'
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 400, repeat: Infinity, ease: "linear" }}
        className="relative w-full h-full flex items-center justify-center"
        style={{
          maskImage: 'radial-gradient(circle, black 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 70%)'
        }}
      >
        {/* Core Glow */}
        <div 
          className="absolute w-1/3 h-1/3 rounded-full opacity-80 blur-2xl"
          style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
        />
        <div 
          className="absolute w-1/6 h-1/6 rounded-full bg-white opacity-90 blur-xl"
        />

        {/* Spiral Arms - Layer 1 */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 600, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-50 rounded-full blur-3xl"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${color} 45deg, transparent 90deg, ${color} 180deg, transparent 225deg, ${color} 270deg, transparent 360deg)`,
            transform: 'scale(1.2) rotateX(60deg)'
          }}
        />

        {/* Spiral Arms - Layer 2 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 800, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30 rounded-full blur-2xl"
          style={{
            background: `conic-gradient(from 45deg at 50% 50%, transparent 0deg, ${color} 90deg, transparent 180deg, ${color} 270deg, transparent 360deg)`,
            transform: 'scale(1.5) rotateX(-45deg)'
          }}
        />
      </motion.div>
    </div>
  );
};

const CosmicDust = ({ count = 100, speed = 1, reduceMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    
    // Initialize particles
    const particles = Array.from({ length: reduceMotion ? Math.floor(count / 3) : count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.05 * speed,
      vy: (Math.random() - 0.5) * 0.05 * speed,
      opacity: Math.random() * 0.5 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      pulsePhase: Math.random() * Math.PI * 2
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (reduceMotion) render(0);
    };
    window.addEventListener('resize', resize);
    resize();

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Update position
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          
          // Wrap around screen
          if (p.x < 0) p.x = 100;
          if (p.x > 100) p.x = 0;
          if (p.y < 0) p.y = 100;
          if (p.y > 100) p.y = 0;
        }

        const x = (p.x / 100) * canvas.width;
        const y = (p.y / 100) * canvas.height;
        
        // Pulsing opacity
        const currentOpacity = reduceMotion ? p.opacity : p.opacity + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.2;
        const finalOpacity = Math.max(0.05, Math.min(0.8, currentOpacity));

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.fill();
        
        // Subtle glow
        if (p.size > 1.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(255, 255, 255, ${finalOpacity * 0.5})`;
        } else {
          ctx.shadowBlur = 0;
        }
      });

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (!reduceMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [count, speed, reduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-screen" />;
};

const StarField = ({ count = 100, color = '#ffffff', speed = 1, reduceMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reduceMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    // Add color variation to stars
    const starColors = [color, '#93c5fd', '#fbcfe8', '#fde047'];
    
    const stars = Array.from({ length: reduceMotion ? Math.floor(count / 2) : count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.2,
      baseOpacity: Math.random() * 0.6 + 0.1,
      parallax: Math.random() * 0.8 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinklePhase: Math.random() * Math.PI * 2,
      color: starColors[Math.floor(Math.random() * starColors.length)]
    }));

    // Shooting stars
    const shootingStars = Array.from({ length: 2 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      active: false,
      speed: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI / 4 + Math.PI / 4,
      length: Math.random() * 100 + 50,
      timer: Math.random() * 500
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (reduceMotion) render(0);
    };
    window.addEventListener('resize', resize);
    resize();

    function render(time: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        const x = ((star.x + mousePos.current.x * star.parallax + 100) % 100) * canvas.width / 100;
        const y = ((star.y + mousePos.current.y * star.parallax + 100) % 100) * canvas.height / 100;
        
        // Twinkle effect
        const currentOpacity = reduceMotion ? star.baseOpacity : 
          star.baseOpacity + Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3;
        
        const clampedOpacity = Math.max(0, Math.min(1, currentOpacity));
        
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        
        // Use the star's specific color
        const isHex = star.color.startsWith('#');
        if (isHex && star.color.length === 7) {
            ctx.fillStyle = `${star.color}${Math.floor(clampedOpacity * 255).toString(16).padStart(2, '0')}`;
        } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${clampedOpacity})`;
        }
        
        ctx.fill();
        
        // Add subtle glow to larger stars
        if (star.size > 1.2) {
          ctx.beginPath();
          ctx.arc(x, y, star.size * 2.5, 0, Math.PI * 2);
          if (isHex && star.color.length === 7) {
             ctx.fillStyle = `${star.color}${Math.floor(clampedOpacity * 50).toString(16).padStart(2, '0')}`;
          } else {
             ctx.fillStyle = `rgba(255, 255, 255, ${clampedOpacity * 0.2})`;
          }
          ctx.fill();
        }
      });

      // Draw shooting stars
      if (!reduceMotion) {
        shootingStars.forEach(s => {
          if (!s.active) {
            s.timer--;
            if (s.timer <= 0) {
              s.active = true;
              s.x = Math.random() * 100;
              s.y = Math.random() * 50;
              s.timer = Math.random() * 1000 + 500;
            }
          } else {
            const startX = (s.x / 100) * canvas.width;
            const startY = (s.y / 100) * canvas.height;
            
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            
            const endX = (s.x / 100) * canvas.width;
            const endY = (s.y / 100) * canvas.height;
            
            const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.8)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            if (s.x > 110 || s.y > 110) {
              s.active = false;
            }
          }
        });
      }

      if (!reduceMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    if (!reduceMotion) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      render(0); // Single frame for reduced motion
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [count, color, speed, reduceMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

const NebulaField = ({ colors = ['#4c0519', '#2d0630', '#050414'] }) => {
  // Create multiple overlapping, slow-moving blobs for a volumetric gas effect
  const blobs = useMemo(() => Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    color: colors[i % colors.length],
    size: Math.random() * 40 + 60, // 60vw to 100vw
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 30 + 40,
    delay: Math.random() * -40
  })), [colors]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {blobs.map(blob => (
        <motion.div
          key={blob.id}
          animate={{ 
            x: [`${blob.x - 10}vw`, `${blob.x + 10}vw`, `${blob.x - 10}vw`],
            y: [`${blob.y - 10}vh`, `${blob.y + 10}vh`, `${blob.y - 10}vh`],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: blob.duration, delay: blob.delay, repeat: Infinity, ease: "easeInOut" }}
          className="absolute rounded-full blur-[100px] mix-blend-screen"
          style={{
            width: `${blob.size}vw`,
            height: `${blob.size}vw`,
            left: '-20vw', // Offset to allow moving off-screen
            top: '-20vh',
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`
          }}
        />
      ))}
    </div>
  );
};

const GridField = ({ color = '#22c55e' }) => {
  return (
    <div className="absolute inset-0 z-0 opacity-20 overflow-hidden" style={{ perspective: '1000px' }}>
      <div 
        className="absolute inset-[-100%] w-[300%] h-[300%]" 
        style={{ 
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center',
          transform: 'rotateX(60deg)',
          transformOrigin: 'center center',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }} 
      />
    </div>
  );
};

const AuroraField = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-30">
      <motion.div
        animate={{ 
          x: ['-20%', '20%', '-20%'],
          rotate: [0, 5, 0],
          scaleY: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-20%] w-[140%] h-[100%] bg-gradient-to-b from-teal-500/40 via-emerald-500/20 to-transparent"
        style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
      />
      <motion.div
        animate={{ 
          x: ['20%', '-20%', '20%'],
          rotate: [0, -5, 0],
          scaleY: [1.1, 0.9, 1.1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[120%] h-[80%] bg-gradient-to-b from-blue-500/30 via-purple-500/10 to-transparent"
        style={{ borderRadius: '60% 40% 30% 70% / 50% 60% 40% 50%' }}
      />
    </div>
  );
};

const ThemePreview = ({ theme }: { theme: Theme }) => {
  const t = THEMES[theme];
  
  if (t?.isLive && t?.videoUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {t.isGif ? (
          <img
            src={t.videoUrl}
            alt={t.name}
            className={cn(
              "absolute min-w-full min-h-full object-cover opacity-60",
              t.zoom && "scale-110"
            )}
            style={{ filter: t.filter }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <video
            autoPlay
            loop
            muted
            playsInline
            className={cn(
              "absolute min-w-full min-h-full object-cover opacity-60",
              t.zoom && "scale-110"
            )}
            style={{ filter: t.filter }}
          >
            <source src={t.videoUrl} type="video/mp4" />
          </video>
        )}
      </div>
    );
  }

  const colors = ({
    stardust: ['#0f172a', '#1e293b', '#000000', '#334155'],
    retroGrid: ['#064e3b', '#065f46', '#000000', '#047857'],
    auroraBorealis: ['#134e4a', '#0f766e', '#010409', '#115e59'],
    sereneLandscape: ['#1c1917', '#292524', '#0a0a0a', '#44403c'],
    obsidian: ['#171717', '#262626', '#000000', '#404040'],
    nebula: ['#4c0519', '#831843', '#05000a', '#9d174d'],
    liquidGlass: ['#1e293b', '#0f172a', '#000000', '#334155'],
    cinematicNoir: ['#18181b', '#09090b', '#000000', '#27272a'],
    auroraGlow: ['#064e3b', '#065f46', '#010208', '#047857'],
    minimalLuxury: ['#1c1917', '#0c0a09', '#050505', '#292524'],
    futuristicEditorial: ['#7c2d12', '#431407', '#000000', '#9a3412'],
    softHolographic: ['#4c0519', '#2d0630', '#050414', '#701a75'],
    deepSpace: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
    void: ['#2e1065', '#1e1b4b', '#030008', '#4c1d95'],
    midnight: ['#172554', '#1e3a8a', '#00040a', '#1e40af'],
    crimson: ['#450a0a', '#7f1d1d', '#0a0202', '#991b1b'],
    ethereal: ['#0f172a', '#1e293b', '#010208', '#334155'],
    abyss: ['#09090b', '#18181b', '#020202', '#27272a'],
    nebulaVortex: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
    midnightSanctuary: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
    nocturnalHaven: ['#431407', '#7c2d12', '#000000', '#9a3412'],
    urbanSolitude: ['#1e3a8a', '#172554', '#000000', '#1e40af'],
    felineVigil: ['#18181b', '#27272a', '#000000', '#09090b'],
    transitEchoes: ['#27272a', '#18181b', '#000000', '#09090b'],
    twilightLofi: ['#2e1065', '#4c1d95', '#000000', '#1e1b4b'],
    sunsetDrift: ['#7c2d12', '#431407', '#000000', '#9a3412'],
    woodlandRetreat: ['#064e3b', '#065f46', '#000000', '#047857'],
    oceanicHorizon: ['#172554', '#1e3a8a', '#000000', '#1e40af'],
    cascadingSerenity: ['#134e4a', '#0f766e', '#000000', '#115e59'],
    snowboundSilence: ['#1e293b', '#0f172a', '#000000', '#334155'],
    urbanEchoes: ['#18181b', '#09090b', '#000000', '#27272a'],
    sunsetVigil: ['#7c2d12', '#431407', '#000000', '#9a3412'],
    neonPulse: ['#2e1065', '#4c1d95', '#000000', '#1e1b4b'],
    celestialWhispers: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
    galacticBloom: ['#4c0519', '#2d0630', '#000000', '#701a75'],
    lunarTide: ['#172554', '#1e3a8a', '#000000', '#1e40af'],
  } as Record<string, string[]>)[theme] || ['#0f172a', '#1e293b', '#000000', '#334155'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div 
        className="absolute inset-0 opacity-60"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${colors[0]} 0%, transparent 70%),
                       radial-gradient(circle at 70% 70%, ${colors[1]} 0%, transparent 70%),
                       ${colors[2]}`
        }}
      />
    </div>
  );
};

const ThemePreviewCard = ({ theme, reduceMotion = false }: { theme: Theme, reduceMotion?: boolean }) => {
  const config = THEMES[theme] || THEMES.stardust;
  return (
    <div className="relative w-full h-40 rounded-[32px] overflow-hidden border border-white/10 group shadow-2xl bg-black">
      <ThemePreview theme={theme} />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-2xl font-light tracking-tight text-white serif">
                {config.name}
              </h4>
              {config.isPro && (
                <div className="px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                </div>
              )}
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
              Atmosphere Preview
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 transition-transform duration-500 group-hover:scale-110",
              config.text
            )}>
              {config.icon}
            </div>
            
            {/* Swatch */}
            <div className="flex gap-1.5 p-1.5 rounded-full bg-black/60 border border-white/5">
              {['bg-white', 'bg-indigo-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500', 'bg-purple-500'].map((c, i) => {
                const colorName = c.replace('bg-', '').split('-')[0];
                // Map some similar colors
                const isMatch = config.accent === colorName || 
                               (config.accent === 'slate' && colorName === 'white') ||
                               (config.accent === 'zinc' && colorName === 'white') ||
                               (config.accent === 'stone' && colorName === 'white') ||
                               (config.accent === 'teal' && colorName === 'emerald') ||
                               (config.accent === 'fuchsia' && colorName === 'purple') ||
                               (config.accent === 'pink' && colorName === 'rose') ||
                               (config.accent === 'red' && colorName === 'rose');
                
                return (
                  <div 
                    key={i} 
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-500",
                      c,
                      isMatch ? "scale-125 ring-2 ring-white/40 opacity-100" : "opacity-20 scale-75"
                    )} 
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Scanline */}
      {!reduceMotion && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10%] w-full top-[-10%] animate-scanline pointer-events-none" />
      )}
    </div>
  );
};

const AmbientBackground = ({ theme, reduceMotion = false, isEcoMode = false, isMuted = false }: { theme: Theme, reduceMotion?: boolean, isEcoMode?: boolean, isMuted?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : (THEMES[theme].volume ?? 1);
    }
  }, [isMuted, theme]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !THEMES[theme].audioUrl) return;

    audio.volume = isMuted ? 0 : (THEMES[theme].volume ?? 1);

    const handleInteraction = async () => {
      try {
        await audio.play();
        removeListeners();
      } catch (e) {
        // Still blocked or other error
      }
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    const playAudio = async () => {
      try {
        await audio.play();
      } catch (err) {
        // Autoplay blocked - wait for first interaction
        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
      }
    };

    playAudio();

    return () => {
      removeListeners();
      audio.pause();
    };
  }, [theme, THEMES[theme].audioUrl]);

  const colors = ({
    stardust: ['#0f172a', '#1e293b', '#000000', '#334155'],
    retroGrid: ['#064e3b', '#065f46', '#000000', '#047857'],
    auroraBorealis: ['#134e4a', '#0f766e', '#010409', '#115e59'],
    sereneLandscape: ['#1c1917', '#292524', '#0a0a0a', '#44403c'],
    obsidian: ['#171717', '#262626', '#000000', '#404040'],
    nebula: ['#4c0519', '#831843', '#05000a', '#9d174d'],
    liquidGlass: ['#1e293b', '#0f172a', '#000000', '#334155'],
    cinematicNoir: ['#18181b', '#09090b', '#000000', '#27272a'],
    auroraGlow: ['#064e3b', '#065f46', '#010208', '#047857'],
    minimalLuxury: ['#1c1917', '#0c0a09', '#050505', '#292524'],
    futuristicEditorial: ['#7c2d12', '#431407', '#000000', '#9a3412'],
    softHolographic: ['#4c0519', '#2d0630', '#050414', '#701a75'],
    deepSpace: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
    void: ['#2e1065', '#1e1b4b', '#030008', '#4c1d95'],
    midnight: ['#172554', '#1e3a8a', '#00040a', '#1e40af'],
    crimson: ['#450a0a', '#7f1d1d', '#0a0202', '#991b1b'],
    ethereal: ['#0f172a', '#1e293b', '#010208', '#334155'],
    abyss: ['#09090b', '#18181b', '#020202', '#27272a'],
    nebulaVortex: ['#1e1b4b', '#0f172a', '#000000', '#312e81'],
  } as Record<string, string[]>)[theme] || ['#0f172a', '#1e293b', '#000000', '#334155'];

  const blendMode = '';

  if (isEcoMode) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-1000" style={{ transform: 'translateZ(0)' }}>
        <div 
          className="absolute inset-0"
          style={{ 
            background: `radial-gradient(circle at 30% 30%, ${colors[0]} 0%, transparent 70%),
                         radial-gradient(circle at 70% 70%, ${colors[1]} 0%, transparent 70%),
                         ${colors[2]}`
          }}
        />
        {/* High contrast noise overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transition-colors duration-1000" style={{ transform: 'translateZ(0)' }}>
      {/* Background Image for Serene Landscape */}
      {theme === 'sereneLandscape' && (
        <div className="absolute inset-0 z-0 bg-stone-950">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="Landscape" 
            loading="eager"
            className="w-full h-full object-cover opacity-20 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </div>
      )}

      {/* Live Video Backgrounds */}
      {THEMES[theme].isLive && THEMES[theme].videoUrl && (
        <div className="absolute inset-0 z-0 bg-black overflow-hidden">
          {THEMES[theme].isGif ? (
            <img
              src={THEMES[theme].videoUrl}
              alt={THEMES[theme].name}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-1000",
                THEMES[theme].zoom ? "scale-110" : "scale-100",
                "opacity-60"
              )}
              style={{ filter: THEMES[theme].filter }}
              referrerPolicy="no-referrer"
            />
          ) : (
            <video
              key={THEMES[theme].videoUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className={cn(
                "w-full h-full object-cover transition-opacity duration-1000",
                THEMES[theme].zoom ? "scale-110" : "scale-100",
                theme === 'nebulaVortex' ? "opacity-40" : "opacity-60"
              )}
              onLoadedMetadata={(e) => {
                if (THEMES[theme].playbackRate) {
                  e.currentTarget.playbackRate = THEMES[theme].playbackRate;
                }
              }}
              style={{ filter: THEMES[theme].filter }}
            >
              <source src={THEMES[theme].videoUrl} type="video/mp4" />
            </video>
          )}
          {!THEMES[theme].noOverlay && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          )}
        </div>
      )}

      {/* Ambient Audio */}
      {THEMES[theme].audioUrl && (
        <audio
          key={THEMES[theme].audioUrl}
          src={THEMES[theme].audioUrl}
          autoPlay
          loop
          className="hidden"
          ref={audioRef}
        />
      )}

      {/* Specialized Fields */}
      {(theme === 'stardust' || theme === 'deepSpace' || theme === 'nebula' || theme === 'void' || theme === 'midnight' || theme === 'ethereal') && (
        <StarField 
          count={theme === 'stardust' ? 400 : 200} 
          color={
            theme === 'stardust' ? '#ffffff' : 
            theme === 'deepSpace' ? '#a5b4fc' : 
            theme === 'nebula' ? '#fbcfe8' :
            theme === 'midnight' ? '#93c5fd' :
            '#ffffff'
          } 
          speed={theme === 'stardust' ? 1.5 : 1}
          reduceMotion={reduceMotion}
        />
      )}
      
      {(theme === 'deepSpace' || theme === 'nebula' || theme === 'void' || theme === 'softHolographic') && (
        <CosmicCanvas theme={theme} reduceMotion={reduceMotion} />
      )}
      
      {(theme === 'deepSpace' || theme === 'nebula' || theme === 'void') && !reduceMotion && <CosmicDust />}
      {(theme === 'deepSpace' || theme === 'stardust') && !reduceMotion && <CosmicRays />}
      {theme === 'void' && <BlackHole />}
      
      {theme === 'deepSpace' && (
        <>
          <Planet color="#312e81" size="300px" position={{ top: '15%', left: '5%' }} />
        </>
      )}
      
      {theme === 'nebula' && (
        <>
          <Planet color="#4c0519" size="250px" position={{ bottom: '20%', right: '10%' }} />
        </>
      )}
      
      {theme === 'retroGrid' && <GridField color="#10b981" />}
      {(theme === 'auroraBorealis' || theme === 'auroraGlow') && <AuroraField />}

      {/* Dynamic Mesh Gradient Orbs */}
      <motion.div
        className={cn("absolute top-0 left-0 w-[120vw] h-[120vh] rounded-full opacity-40 will-change-transform", blendMode)}
        style={{ background: `radial-gradient(circle, ${colors[0]} 0%, transparent 60%)`, x: '-10%', y: '-10%' }}
        animate={reduceMotion ? {} : { x: ['-10%', '10%', '-20%', '-10%'], y: ['-10%', '20%', '0%', '-10%'], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn("absolute bottom-0 right-0 w-[100vw] h-[100vh] rounded-full opacity-40 will-change-transform", blendMode)}
        style={{ background: `radial-gradient(circle, ${colors[1]} 0%, transparent 60%)`, x: '10%', y: '10%' }}
        animate={reduceMotion ? {} : { x: ['10%', '-10%', '20%', '10%'], y: ['10%', '-20%', '10%', '10%'], scale: [0.9, 1.3, 1, 0.9] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={cn("absolute top-1/2 left-1/2 w-[140vw] h-[140vh] rounded-full opacity-30 will-change-transform", blendMode)}
        style={{ background: `radial-gradient(circle, ${colors[3]} 0%, transparent 50%)`, x: '-50%', y: '-50%' }}
        animate={reduceMotion ? {} : { x: ['-50%', '-30%', '-70%', '-50%'], y: ['-50%', '-70%', '-30%', '-50%'], scale: [1, 0.8, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* High contrast noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
    </div>
  );
};

const PayPalSubscriptionButton = ({ onApprove }: { onApprove: (subscriptionID: string) => void }) => {
  const containerId = "paypal-button-container-P-6PH880156W850713XNG3VZCQ";
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // @ts-ignore
    if (window.paypal) {
      setSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AS_rR6gcZNzw2Hz3-0-mes4v32ijNjUEdGP9SrD5Od3uSzY-6iXYD0Mk-XByrIBByt8SJucKo0Bu-XRz&vault=true&intent=subscription";
    script.async = true;
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => setLoadError(true);
    document.head.appendChild(script);

    return () => {
      // We don't necessarily want to remove the script on unmount as it might be needed again
      // but we could if we wanted to be strict.
    };
  }, []);

  useEffect(() => {
    if (!sdkLoaded) return;

    const container = document.getElementById(containerId);
    if (container) container.innerHTML = "";

    // @ts-ignore
    if (window.paypal) {
      try {
        // @ts-ignore
        window.paypal.Buttons({
          style: {
            shape: 'pill',
            color: 'black',
            layout: 'vertical',
            label: 'subscribe'
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: 'P-6PH880156W850713XNG3VZCQ'
            });
          },
          onApprove: function(data: any, actions: any) {
            onApprove(data.subscriptionID);
          },
          onError: function(err: any) {
            console.error("PayPal Error:", err);
          }
        }).render(`#${containerId}`).catch((err: any) => {
          console.error("PayPal Render Error:", err);
        });
      } catch (err) {
        console.error("PayPal Initialization Error:", err);
      }
    }

    return () => {
      if (container) container.innerHTML = "";
    };
  }, [sdkLoaded, onApprove]);

  if (loadError) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-xs text-red-400">Failed to load payment system. Please check your connection or disable ad-blockers.</p>
      </div>
    );
  }

  if (!sdkLoaded) {
    return (
      <div className="h-12 w-full bg-white/5 animate-pulse rounded-full flex items-center justify-center">
        <span className="text-[10px] text-white/20 uppercase tracking-widest">Loading Payments...</span>
      </div>
    );
  }

  return <div id={containerId} className="w-full" />;
};

const containerVariants: any = {
  idle: { y: [0, -8, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
};

// --- Constants & Data ---

interface Stats {
  total: number;
}

type Phase = 'intro' | 'idle' | 'prep' | 'destroying' | 'aftermath';

const playTensionSound = (isMuted: boolean) => {
  if (isMuted) return null;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return null;
    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 1.2); // Rises over the hold duration
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    
    return {
      stop: () => {
        try {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
      }
    };
  } catch (e) {
    return null;
  }
};

const playBreathingSound = (isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Noise generator for breath
    const bufferSize = ctx.sampleRate * 6; // 6 seconds
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter to make it sound like breath (pink/brown noise)
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(800, ctx.currentTime + 3); // Inhale opens filter
    filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 6); // Exhale closes filter
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3); // Inhale gets louder
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 6); // Exhale gets quieter
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
  } catch (e) {}
};

const playCosmicHum = (isMuted: boolean) => {
  if (isMuted) return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Bass drop oscillator
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(150, ctx.currentTime);
    bassOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.5);
    bassGain.gain.setValueAtTime(0.8, ctx.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
    bassOsc.connect(bassGain);
    bassGain.connect(ctx.destination);
    bassOsc.start();
    bassOsc.stop(ctx.currentTime + 2);

    // Base oscillator
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    
    // Binaural oscillator (slightly detuned for theta wave ~6Hz difference)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    
    // Master gain for overall fade
    const masterGain = ctx.createGain();
    
    // Panners to separate the frequencies
    const panner1 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const panner2 = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // Start at 60Hz, drop to 40Hz
    osc1.frequency.setValueAtTime(60, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 4);
    
    // Start at 66Hz, drop to 44Hz (maintaining a 4-6Hz difference for Theta/Delta waves)
    osc2.frequency.setValueAtTime(66, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(44, ctx.currentTime + 4);
    
    // Individual gains (mix them)
    gain1.gain.value = 0.5;
    gain2.gain.value = 0.5;
    
    // Master envelope
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1); // Fade in
    masterGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 6); // Fade out
    
    // Routing
    osc1.connect(gain1);
    osc2.connect(gain2);
    
    if (panner1 && panner2) {
      panner1.pan.value = -1; // Left ear
      panner2.pan.value = 1;  // Right ear
      gain1.connect(panner1);
      gain2.connect(panner2);
      panner1.connect(masterGain);
      panner2.connect(masterGain);
    } else {
      gain1.connect(masterGain);
      gain2.connect(masterGain);
    }
    
    masterGain.connect(ctx.destination);
    
    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 6);
    osc2.stop(ctx.currentTime + 6);
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};

const THEME_ANIMATION_MAP: Record<string, string> = {
  midnightSanctuary: 'midnightRain',
  nocturnalHaven: 'emberDrift',
  urbanSolitude: 'cityLightsBlur',
  felineVigil: 'windowFrost',
  transitEchoes: 'subwayRush',
  twilightLofi: 'lofiGlitch',
  sunsetDrift: 'highwaySpeed',
  woodlandRetreat: 'forestMist',
  oceanicHorizon: 'tideWash',
  cascadingSerenity: 'waterfallCrash',
  snowboundSilence: 'blizzardSweep',
  urbanEchoes: 'neonFlicker',
  sunsetVigil: 'goldenHourFade',
  neonPulse: 'cyberpunkShatter',
  celestialWhispers: 'meteorShower',
  galacticBloom: 'cosmicBloom',
  lunarTide: 'moonlightRipple',
  nebulaVortex: 'vortexConsume',
};

export default function AntiJournal({ isAdmin, onShowAdmin }: { isAdmin?: boolean, onShowAdmin?: () => void }) {
  const [isMuted, setIsMuted] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const [text, setText] = useState('');
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimerRef = useRef<number | null>(null);
  const holdStartTimeRef = useRef<number>(0);
  const tensionSoundRef = useRef<{ stop: () => void } | null>(null);
  const HOLD_DURATION = 1200;
  const [phase, setPhase] = useState<Phase>('idle');
  type ActiveAnim = { id: string, key: string, text: string };
  const [activeAnims, setActiveAnims] = useState<ActiveAnim[]>([]);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [aftermathMessage, setAftermathMessage] = useState('');
  const [isZenMode, setIsZenMode] = useState(false);
  
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [globalStats, setGlobalStats] = useState({ totalReleases: 0, lastReleaseAt: 0, lastResetAt: 0 });
  const [ritualMode, setRitualMode] = useState<RitualMode>('standard');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStats, setShowStats] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [hoveredAnim, setHoveredAnim] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Presence tracking
  useEffect(() => {
    if (!user) return;
    
    const presenceRef = doc(db, 'presence', user.uid);
    const updatePresence = async () => {
      try {
        await setDoc(presenceRef, {
          lastSeen: serverTimestamp(),
          uid: user.uid
        }, { merge: true });
      } catch (e) {
        console.error("Presence update failed", e);
      }
    };
    
    updatePresence();
    const interval = setInterval(updatePresence, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    // Only subscribe if authenticated, as per firestore.rules
    if (!user) {
      setOnlineUsers(0);
      return;
    }
    
    const presenceCollection = collection(db, 'presence');
    // Query for users active in the last 2 minutes
    const q = query(presenceCollection, where('lastSeen', '>', new Date(Date.now() - 120000)));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOnlineUsers(snapshot.size);
    }, (error) => {
      // Gracefully handle permission errors
      if (error.code === 'permission-denied') {
        console.warn("Presence snapshot permission denied. This is expected if not fully authenticated.");
      } else {
        handleFirestoreError(error, OperationType.GET, 'presence');
      }
    });
    
    return () => unsubscribe();
  }, [user]);
  const ritualModes = useMemo(() => ({
    standard: { name: t.ritualStandard, description: t.ritualStandardDesc, icon: <Zap className="w-4 h-4" /> },
    heavy: { name: t.ritualHeavy, description: t.ritualHeavyDesc, icon: <Activity className="w-4 h-4" /> },
    mist: { name: t.ritualMist, description: t.ritualMistDesc, icon: <Sparkles className="w-4 h-4" /> },
    echo: { name: t.ritualEcho, description: t.ritualEchoDesc, icon: <History className="w-4 h-4" /> },
    oracle: { name: t.ritualOracle, description: t.ritualOracleDesc, icon: <Eye className="w-4 h-4" /> },
  }), [t]);

  const [currentHeading, setCurrentHeading] = useState(t.headings[0]);
  const [currentSubheading, setCurrentSubheading] = useState(t.subheadings[0]);

  useEffect(() => {
    setCurrentHeading(t.headings[Math.floor(Math.random() * t.headings.length)]);
    setCurrentSubheading(t.subheadings[Math.floor(Math.random() * t.subheadings.length)]);
  }, [t.headings, t.subheadings]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number}[]>([]);
  
  const [themeTab, setThemeTab] = useState<'atmospheres' | 'live' | 'legacy'>('atmospheres');
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recentAnimsRef = useRef<string[]>([]);

  // Auth Listener
  useEffect(() => {
    // Auto-detect mobile for Eco Mode
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
      setIsEcoMode(true);
      setReduceMotion(true);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setLoading(false);
        setUserData(defaultUserData);
      }
    });
    return () => unsubscribe();
  }, []);

  // Particle cleanup
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  const triggerHaptic = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (activeAnims.length > 0) return;
    setText(e.target.value);
    triggerHaptic(5); // Light tap
    
    // Spawn a particle
    const rect = textareaRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + Math.random() * rect.width;
      const y = rect.top + Math.random() * rect.height;
      setParticles(prev => [...prev, { id: Date.now() + Math.random(), x, y }]);
    }
  };

  // Firestore Data Listener
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    // Listen to main profile
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setUserData(prev => ({
          ...prev,
          tier: data.tier || 'free',
          totalReleases: data.totalReleases || 0,
          dailyReleases: data.dailyReleases || 0,
          lastDailyUpdate: data.lastDailyUpdate || Date.now(),
          monthlyReleases: data.monthlyReleases || 0,
          lastMonthlyUpdate: data.lastMonthlyUpdate || Date.now(),
          theme: data.theme || 'void',
          selectedAnimation: data.selectedAnimation || 'random',
          isEcoMode: data.isEcoMode ?? prev.isEcoMode,
          disableBreathing: data.disableBreathing ?? prev.disableBreathing,
          totalElapsedTime: data.totalElapsedTime || 0,
          lastSeen: data.lastSeen || Date.now(),
        }));
        if (data.isEcoMode !== undefined) setIsEcoMode(data.isEcoMode);
      } else {
        // Initialize user in Firestore if they don't exist
        const initialData = {
          tier: 'free',
          totalReleases: 0,
          dailyReleases: 0,
          lastDailyUpdate: Date.now(),
          monthlyReleases: 0,
          lastMonthlyUpdate: Date.now(),
          theme: 'void',
          isEcoMode: isEcoMode, // Use the auto-detected value
          disableBreathing: false,
          totalElapsedTime: 0,
          lastSeen: Date.now(),
          email: user.email,
          updatedAt: serverTimestamp()
        };
        setDoc(userDocRef, initialData).catch(e => handleFirestoreError(e, OperationType.CREATE, `users/${user.uid}`));
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    // Listen to history subcollection
    const historyQuery = query(collection(db, 'users', user.uid, 'history'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribeHistory = onSnapshot(historyQuery, (querySnap) => {
      const history = querySnap.docs.map(doc => doc.data() as ReleaseEntry);
      setUserData(prev => ({ ...prev, history }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/history`);
    });

    // Listen to fragments
    const fragmentsQuery = query(collection(db, 'users', user.uid, 'fragments'), orderBy('timestamp', 'desc'), limit(100));
    const unsubscribeFragments = onSnapshot(fragmentsQuery, (querySnap) => {
      const frags = querySnap.docs.map(doc => doc.data() as Fragment);
      setFragments(frags);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}/fragments`);
    });

    return () => {
      unsubscribeProfile();
      unsubscribeHistory();
      unsubscribeFragments();
    };
  }, [user]);

  useEffect(() => {
    const unsubscribeGlobal = onSnapshot(doc(db, 'global', 'stats'), (docSnap) => {
      if (docSnap.exists()) {
        setGlobalStats(docSnap.data() as any);
      }
    }, (error) => {
      // Handle error gracefully
      console.warn("Global stats snapshot failed", error);
    });
    return () => unsubscribeGlobal();
  }, []);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error("Login failed", error);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const performLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutConfirm(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const saveUserData = async (newData: Partial<UserData>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        ...newData,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleProApproval = useCallback(async (subId: string) => {
    if (!user) return;
    console.log("Subscription approved:", subId);
    try {
      await saveUserData({ tier: 'pro', paypalSubscriptionId: subId });
      setShowProModal(false);
      setAftermathMessage("Welcome to Pro. The void expands.");
      setActiveAnims(prev => [...prev, { id: 'pro-anim', key: 'supernovaPro', text: 'Welcome to Pro. The void expands.' }]);
      setTimeout(() => { setActiveAnims(prev => prev.filter(a => a.id !== 'pro-anim')); }, 2000);
    } catch (e) {
      console.error("Failed to upgrade tier", e);
    }
  }, [user]);

  const getLocalResetPoint = useCallback(() => {
    const now = new Date();
    const reset = new Date(now);
    reset.setHours(7, 0, 0, 0);
    if (now < reset) {
      reset.setDate(reset.getDate() - 1);
    }
    return reset.getTime();
  }, []);

  const getGlobalResetPoint = useCallback(() => {
    const now = new Date();
    const reset = new Date(now);
    reset.setUTCHours(7, 0, 0, 0);
    if (now < reset) {
      reset.setUTCDate(reset.getUTCDate() - 1);
    }
    return reset.getTime();
  }, []);

  const getAppDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const reset = new Date(date);
    reset.setHours(7, 0, 0, 0);
    if (date < reset) {
      date.setDate(date.getDate() - 1);
    }
    return format(date, 'yyyy-MM-dd');
  }, []);

  // Track elapsed time and presence
  useEffect(() => {
    if (!user) return;

    let lastUpdate = Date.now();

    const updateStats = async () => {
      const now = Date.now();
      const elapsedSinceLast = Math.floor((now - lastUpdate) / 1000);
      if (elapsedSinceLast < 1) return;

      lastUpdate = now;
      const appDate = getAppDate(now);

      try {
        const userRef = doc(db, 'users', user.uid);
        const dailyStatRef = doc(db, 'users', user.uid, 'dailyStats', appDate);

        // Update user profile
        await updateDoc(userRef, {
          totalElapsedTime: increment(elapsedSinceLast),
          lastSeen: now
        });

        // Update daily stats
        const dailySnap = await getDoc(dailyStatRef);
        if (dailySnap.exists()) {
          await updateDoc(dailyStatRef, {
            elapsedTime: increment(elapsedSinceLast)
          });
        } else {
          await setDoc(dailyStatRef, {
            date: appDate,
            elapsedTime: elapsedSinceLast
          });
        }

        // Update presence collection for admin panel
        await setDoc(doc(db, 'presence', user.uid), {
          uid: user.uid,
          lastSeen: new Date(now).toISOString()
        });

      } catch (error) {
        console.error("Error updating elapsed time:", error);
      }
    };

    // Update every minute
    const interval = setInterval(updateStats, 60000);

    // Also update on unmount
    return () => {
      clearInterval(interval);
      updateStats();
    };
  }, [user, getAppDate]);

  const currentGlobalReleases = useMemo(() => {
    const resetPointTime = getGlobalResetPoint();
    if ((globalStats.lastResetAt || 0) < resetPointTime) {
      return 0;
    }
    return globalStats.totalReleases || 0;
  }, [globalStats.totalReleases, globalStats.lastResetAt, getGlobalResetPoint]);

  const currentTheme = THEMES[userData.theme] || THEMES.void;

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

  const handleDestroy = async () => {
    if (!text.trim() || !user) return;
    
    // Sentiment/Intensity detection
    const intensity = Math.min(1.5, 0.5 + (text.length / 500));
    const angryWords = ['hate', 'angry', 'rage', 'kill', 'die', 'furious', 'mad', 'scream'];
    const sadWords = ['sad', 'lonely', 'cry', 'pain', 'hurt', 'lost', 'empty', 'alone'];
    const isAngry = angryWords.some(w => text.toLowerCase().includes(w));
    const isSad = sadWords.some(w => text.toLowerCase().includes(w));
    
    let tone: 'angry' | 'sad' | 'neutral' = 'neutral';
    if (isAngry) tone = 'angry';
    else if (isSad) tone = 'sad';

    triggerHaptic(ritualMode === 'heavy' ? [100, 200, 300, 400] : [50, 100, 150, 200, 300]);
    playCosmicHum(isMuted);

    const proProfiles = Object.keys(ANIMATIONS_CONFIG).filter(key => ANIMATIONS_CONFIG[key].isPro);
    const freeProfiles = Object.keys(ANIMATIONS_CONFIG).filter(key => !ANIMATIONS_CONFIG[key].isPro);

    let selectedProfile: string;
    
    if (userData.selectedAnimation && userData.selectedAnimation !== 'random') {
      const isProAnim = ANIMATIONS_CONFIG[userData.selectedAnimation]?.isPro;
      if (isProAnim && userData.tier !== 'pro') {
        const available = freeProfiles;
        selectedProfile = available[Math.floor(Math.random() * available.length)];
      } else {
        selectedProfile = userData.selectedAnimation;
      }
    } else {
      // Logic for picking animation based on tone
      if (ritualMode === 'oracle') selectedProfile = 'singularity';
      else if (tone === 'angry') selectedProfile = 'incinerate';
      else if (tone === 'sad') selectedProfile = 'nebula';
      else if (THEMES[userData.theme]?.isLive && THEME_ANIMATION_MAP[userData.theme]) {
        selectedProfile = THEME_ANIMATION_MAP[userData.theme];
      } else {
        const available = userData.tier === 'pro' ? [...proProfiles, ...freeProfiles] : freeProfiles;
        selectedProfile = available[Math.floor(Math.random() * available.length)];
      }
    }
    
    recentAnimsRef.current.push(selectedProfile);
    if (recentAnimsRef.current.length > 3) {
      recentAnimsRef.current.shift();
    }
    const animId = Math.random().toString(36).substring(2, 9);
    const currentText = text;
    
    setActiveAnims(prev => [...prev, { id: animId, key: selectedProfile, text: currentText }]);
    setText('');

    // Randomize next heading/subheading
    setCurrentHeading(t.headings[Math.floor(Math.random() * t.headings.length)]);
    setCurrentSubheading(t.subheadings[Math.floor(Math.random() * t.subheadings.length)]);
    
    // Create Fragment
    const fragmentType: Fragment['type'][] = ['seed', 'crystal', 'nebula', 'orb'];
    const newFragment: Fragment = {
      id: Math.random().toString(36).substring(2, 9),
      type: ritualMode === 'heavy' ? 'crystal' : ritualMode === 'mist' ? 'nebula' : fragmentType[Math.floor(Math.random() * fragmentType.length)],
      color: tone === 'angry' ? '#ef4444' : tone === 'sad' ? '#3b82f6' : THEME_COLORS[userData.theme as keyof typeof THEME_COLORS] || '#ffffff',
      size: 10 + (intensity * 20),
      intensity,
      timestamp: Date.now(),
      ritualMode
    };

    const localResetPoint = getLocalResetPoint();
    const globalResetPoint = getGlobalResetPoint();

    try {
      // Add to history
      await addDoc(collection(db, 'users', user.uid, 'history'), {
        id: newFragment.id,
        timestamp: newFragment.timestamp,
        snippet: currentText.length > 15 ? currentText.substring(0, 15) + '...' : currentText,
        thought: currentText,
        animation: selectedProfile
      });
      
      // Add fragment
      await addDoc(collection(db, 'users', user.uid, 'fragments'), newFragment);

      // Update total count
      const isNewDay = userData.lastDailyUpdate < localResetPoint;
      const isNewMonth = !isSameMonth(new Date(userData.lastMonthlyUpdate), new Date());
      
      await updateDoc(doc(db, 'users', user.uid), {
        totalReleases: userData.totalReleases + 1,
        dailyReleases: isNewDay ? 1 : userData.dailyReleases + 1,
        lastDailyUpdate: Date.now(),
        monthlyReleases: isNewMonth ? 1 : userData.monthlyReleases + 1,
        lastMonthlyUpdate: Date.now(),
        lastSeen: Date.now(),
        updatedAt: serverTimestamp()
      });

      // Update global stats
      const globalRef = doc(db, 'global', 'stats');
      const globalSnap = await getDoc(globalRef);
      const now = Date.now();
      
      if (globalSnap.exists()) {
        const data = globalSnap.data();
        const lastResetAt = data.lastResetAt || 0;
        
        if (lastResetAt < globalResetPoint) {
          // Reset the global counter (Daily Global Releases)
          await updateDoc(globalRef, {
            totalReleases: 1,
            lastReleaseAt: now,
            lastResetAt: now
          });
        } else {
          await updateDoc(globalRef, {
            totalReleases: (data.totalReleases || 0) + 1,
            lastReleaseAt: now
          });
        }
      } else {
        await setDoc(globalRef, { 
          totalReleases: 1, 
          lastReleaseAt: now,
          lastResetAt: now 
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `users/${user.uid}/history`);
    }

    // Get message based on tone
    const angryMessages = [
      "The fire consumes it.", "Let the ash scatter.", "Your rage is absorbed.", "The heat dissipates.", "Breathe out the fire.",
      "Release the tension.", "Feel the weight lift.", "Let the anger fade.", "You are in control.", "Breathe in... and out..."
    ];
    const sadMessages = [
      "Tears lost in the void.", "The ache softens.", "You are held by the silence.", "Let the sorrow drift.", "It is okay to let go.",
      "Be kind to yourself.", "This too shall pass.", "You are not alone.", "Breathe in... and out...", "Write down your thoughts..."
    ];
    const neutralMessages = [
      "Breathe. It's gone.", "Lightness returns.", "The void is quiet.",
      "Letting go is freedom.", "Clearer now.", "Peace found.", "Unburdened.",
      "Breathe in... and out...", "Write down your thoughts...", "Focus on your breath.", "You are here. You are safe."
    ];
    const oracleMessages = [
      "The stars align in your favor.", "A new path reveals itself.", "The void answers with silence.", "Your question is the answer.", "Look within for the truth.", "The cosmos is indifferent.", "A shift in perspective is needed.", "Patience is your ally.", "The answer is obscured by clouds.", "Trust the journey."
    ];

    let selectedMessages = neutralMessages;
    if (ritualMode === 'oracle') {
      selectedMessages = oracleMessages;
    } else {
      if (tone === 'angry') selectedMessages = angryMessages;
      else if (tone === 'sad') selectedMessages = sadMessages;
    }

    setAftermathMessage(selectedMessages[Math.floor(Math.random() * selectedMessages.length)]);

    const duration = ANIMATIONS_CONFIG[selectedProfile]?.duration || 3000;

    setTimeout(() => {
      setActiveAnims(prev => prev.filter(a => a.id !== animId));
      
      if (userData.disableBreathing) {
        setIsDestroyed(false);
        return;
      }

      setIsDestroyed(true);
      playBreathingSound(isMuted);
      
      // Subtle heartbeat haptics during breathing
      const breathInterval = setInterval(() => {
        triggerHaptic(5);
      }, 1000);
      
      setTimeout(() => {
        clearInterval(breathInterval);
        setIsDestroyed(false);
      }, 21000); // 21 seconds (6s countdown + 15s breathing)
    }, Math.max(500, duration - 1500));
  };

  const startHold = () => {
    if (!text.trim() || activeAnims.length > 0 || holdTimerRef.current) return;
    setIsHolding(true);
    holdStartTimeRef.current = Date.now();
    triggerHaptic(10);
    
    if (!tensionSoundRef.current) {
      tensionSoundRef.current = playTensionSound(isMuted);
    }
    
    let lastHapticProgress = 0;

    const updateHold = () => {
      const elapsed = Date.now() - holdStartTimeRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(progress);
      
      // Escalating haptics as you hold
      if (progress - lastHapticProgress > 15) {
        triggerHaptic(10 + progress / 2);
        lastHapticProgress = progress;
      }
      
      if (progress >= 100) {
        if (tensionSoundRef.current) {
          tensionSoundRef.current.stop();
          tensionSoundRef.current = null;
        }
        setIsHolding(false);
        setHoldProgress(0);
        handleDestroy();
      } else {
        holdTimerRef.current = requestAnimationFrame(updateHold);
      }
    };
    
    holdTimerRef.current = requestAnimationFrame(updateHold);
  };

  const stopHold = () => {
    if (holdTimerRef.current) {
      cancelAnimationFrame(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (tensionSoundRef.current) {
      tensionSoundRef.current.stop();
      tensionSoundRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (activeAnims.length > 0) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      startHold();
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      stopHold();
    }
  };

  const getMonthlyStats = () => {
    const now = new Date();
    const lastMonth = subDays(now, 30);
    
    const thisMonthCount = userData.history.filter(h => isSameMonth(new Date(h.timestamp), now)).length;
    const lastMonthCount = userData.history.filter(h => isSameMonth(new Date(h.timestamp), lastMonth)).length;

    if (lastMonthCount === 0) return { percent: 100, count: thisMonthCount };
    
    const diff = thisMonthCount - lastMonthCount;
    const percent = Math.round((diff / lastMonthCount) * 100);
    return { percent, count: thisMonthCount };
  };

  const monthlyStats = getMonthlyStats();
  const dailyCount = useMemo(() => {
    const resetPointTime = getLocalResetPoint();
    if (userData.lastDailyUpdate < resetPointTime) {
      return 0;
    }
    return userData.dailyReleases;
  }, [userData.dailyReleases, userData.lastDailyUpdate, getLocalResetPoint]);

  const monthlyCount = useMemo(() => {
    const now = new Date();
    const resetPoint = new Date(now.getFullYear(), now.getMonth(), 1, 7, 0, 0, 0);
    // If we are before the 1st of the month at 7 AM UTC, the reset point is the 1st of the previous month
    const resetPointTime = resetPoint.getTime();
    if (Date.now() < resetPointTime) {
      // This is a bit complex for monthly, but let's stick to the simple version for now
      // or just use isSameMonth if that's what handleDestroy does.
    }
    
    if (!isSameMonth(new Date(userData.lastMonthlyUpdate), new Date())) {
      return 0;
    }
    return userData.monthlyReleases;
  }, [userData.monthlyReleases, userData.lastMonthlyUpdate]);

  if (loading) {
    return (
      <div className={cn("min-h-screen w-full flex items-center justify-center", THEMES.void.bg)}>
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-purple-300 font-serif italic text-2xl"
        >
          Entering the void...
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-black text-white font-sans">
        {/* Background Glows */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #9333ea 0%, transparent 70%)' }} />
          {/* Subtle Grid */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPHBhdGggZD0iTTAgMGg0MHYxSDB6TTAgMHY0MGgxVjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+Cjwvc3ZnPg==')] opacity-50" />
        </div>

        {/* Navigation */}
        <nav className="w-full px-8 py-6 flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xl rounded-sm">
              <ArrowUp className="w-5 h-5 rotate-45" />
            </div>
            <span className="font-bold tracking-tight text-lg">ANTI-JOURNAL</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 ml-2 border border-white/10 px-2 py-0.5 rounded-full">BETA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-grow flex flex-col items-center justify-center z-10 text-center px-6 relative">
          
          {/* Floating 3D Elements (Simulated with CSS) */}
          <motion.div 
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-16 h-16 rounded-xl liquid-glass rotate-12 hidden md:block"
          />
          <motion.div 
            animate={{ y: [10, -10, 10], rotate: [0, -10, 0] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full liquid-glass -rotate-12 hidden md:block"
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans font-semibold tracking-tight text-white mb-6 leading-[1.1]">
              Release your heaviest <br className="hidden md:block" /> thoughts into the void
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-white/60 leading-relaxed max-w-2xl mx-auto mb-12">
              AntiJournal is a private space to let go of what weighs you down. No tracking, no judgment, just release.
            </p>
            
            {/* Glowing Search Bar / Login Button */}
            <div className="relative max-w-2xl mx-auto w-full group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-[radial-gradient(circle,rgba(147,51,234,0.5)_0%,transparent_70%)] rounded-full opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse" />
              
              {/* Inner Search Bar */}
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="relative w-full h-16 md:h-20 liquid-glass rounded-full flex items-center justify-between px-6 md:px-8 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4 text-white/50 group-hover:text-white/80 transition-colors">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <span className="text-lg md:text-xl font-light">
                    {isLoggingIn ? 'Connecting to the void...' : 'Enter the void...'}
                  </span>
                </div>
                
                {/* Filter Icon / Action Button */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/80 group-hover:bg-white/10 transition-colors">
                  {isLoggingIn ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="w-5 h-5" />
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="w-full p-8 flex flex-col md:flex-row items-center justify-between z-10 gap-4 relative">
          <div className="text-[10px] text-white/20 uppercase tracking-widest">
            © 2026 Anti-Journal. All rights released.
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={cn(
      "h-screen w-full flex items-center justify-center relative overflow-hidden transition-colors duration-1000 no-scrollbar",
      currentTheme.bg,
      isEcoMode && "eco-mode"
    )} style={{ perspective: '2000px' }}>
      <AmbientBackground theme={userData.theme} reduceMotion={reduceMotion} isEcoMode={isEcoMode} isMuted={isMuted} />
      <VoidGarden fragments={fragments} reduceMotion={reduceMotion} />
      
      {/* Hold Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-75"
        style={{ 
          backgroundColor: THEME_COLORS[userData.theme],
          opacity: isHolding ? (holdProgress / 100) * 0.3 : 0 
        }}
      />
      
      {/* Top Bar: Global Pulse & Controls */}
      <AnimatePresence>
        {!isZenMode && !isDestroyed && activeAnims.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 p-4 md:p-8 flex flex-row justify-between items-start z-50 pointer-events-none"
          >
            <div className="pointer-events-auto shrink-0">
              <GlobalPulse totalReleases={currentGlobalReleases} onlineUsers={onlineUsers} />
            </div>
            
            {user && (
              <div className="flex flex-wrap items-center justify-end gap-2 md:gap-3 pointer-events-auto shrink-0">
                <button 
                  onClick={() => setShowStats(true)} 
                  className="liquid-glass p-2 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 md:gap-2"
                >
                  <Activity className="w-4 h-4 md:w-3 md:h-3"/> <span className="hidden md:inline">Insights</span>
                </button>
                <button 
                  onClick={() => setIsZenMode(true)}
                  className="liquid-glass p-2 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 md:gap-2"
                >
                  <Eye className="w-4 h-4 md:w-3 md:h-3"/> <span className="hidden md:inline">Zen</span>
                </button>
                {isAdmin && onShowAdmin && (
                  <button 
                    onClick={onShowAdmin}
                    className="liquid-glass p-2 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-amber-400/60 hover:text-amber-400 transition-colors flex items-center gap-1.5 md:gap-2"
                    title="Admin Protocol"
                  >
                    <Shield className="w-4 h-4 md:w-3 md:h-3"/> <span className="hidden md:inline">Admin</span>
                  </button>
                )}
                <button 
                  onClick={handleLogout} 
                  className="liquid-glass p-2 md:px-4 md:py-2 rounded-full text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 md:gap-2"
                >
                  <LogOut className="w-4 h-4 md:w-3 md:h-3"/> <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isZenMode && !isDestroyed && activeAnims.length === 0 && user && (
        <button 
          onClick={() => setIsZenMode(false)}
          className="absolute top-8 right-8 z-50 text-white/10 hover:text-white/40 transition-colors opacity-0 hover:opacity-100"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {activeAnims.map(anim => (
          <ActiveAnimationComponent key={anim.id} text={anim.text} theme={userData.theme} animKey={anim.key} />
        ))}
      </AnimatePresence>

      <div className="w-full max-w-3xl px-6 flex flex-col items-center justify-center flex-grow relative z-10">
        {/* Typing Particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
            animate={{ opacity: 0, scale: 2, y: p.y - 50 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="fixed w-1 h-1 rounded-full bg-white/50 pointer-events-none z-50"
          />
        ))}

        <AnimatePresence mode="wait">
          {!isDestroyed ? (
            <motion.div
              key="input-area"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
              className="w-full flex flex-col items-center relative"
            >
              <motion.div
                className="absolute inset-0 rounded-[28px] pointer-events-none will-change-transform opacity-30"
                style={{ transform: 'translateZ(0)', background: `radial-gradient(circle, ${THEME_COLORS[userData.theme]}4D 0%, transparent 70%)` }}
                animate={{ opacity: typingIntensity * 0.8 + 0.1, scale: 1 + typingIntensity * 0.1 }}
                transition={{ duration: 0.2 }}
              />

              {!isZenMode && (                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: text || activeAnims.length > 0 ? 0 : 1, 
                    y: text || activeAnims.length > 0 ? -20 : 0,
                    scale: text || activeAnims.length > 0 ? 0.95 : 1
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mb-6 md:mb-12 text-center pointer-events-none px-4 md:px-0"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-serif italic text-white/90 tracking-tight leading-tight">
                    {currentHeading}
                  </h2>
                  <p className={cn("mt-2 md:mt-4 font-sans text-[10px] md:text-sm tracking-widest uppercase", currentTheme.text, "opacity-40")}>
                    {currentSubheading}
                  </p>
                </motion.div>
              )}

              {/* Ritual Selector */}
              {!isZenMode && !text && activeAnims.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-row overflow-x-auto md:overflow-x-hidden w-full md:w-auto md:flex-wrap justify-start md:justify-center gap-2 mb-6 md:mb-8 z-30 no-scrollbar"
                >
                    {(Object.keys(RITUAL_MODES) as RitualMode[]).map(mode => {
                      const ritualName = mode === 'standard' ? t.ritualStandard :
                                       mode === 'heavy' ? t.ritualHeavy :
                                       mode === 'mist' ? t.ritualMist :
                                       mode === 'echo' ? t.ritualEcho :
                                       t.ritualOracle;
                      return (
                        <button
                          key={mode}
                          onClick={() => setRitualMode(mode)}
                          className={cn(
                            "shrink-0 px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 md:gap-2",
                            ritualMode === mode 
                              ? "bg-white text-black border-white" 
                              : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
                          )}
                        >
                          {RITUAL_MODES[mode].icon}
                          {ritualName}
                        </button>
                      );
                    })}
                </motion.div>
              )}

              <motion.div
                variants={containerVariants} initial="idle" 
                animate={activeAnims.length > 0 ? "idle" : {
                  boxShadow: isHolding ? `0 0 ${holdProgress * 3}px rgba(255, 50, 50, ${holdProgress / 100}), inset 0 0 ${holdProgress * 2}px rgba(255, 0, 0, ${holdProgress / 200})` : text ? `0 0 ${20 + typingIntensity * 40}px ${THEME_COLORS[userData.theme]}33` : '0 0 0px transparent',
                  scale: isHolding ? 1 - holdProgress / 500 : text ? [1, 1.005 + typingIntensity * 0.01, 1] : 1,
                  borderColor: isHolding ? `rgba(255, 50, 50, ${holdProgress / 100})` : undefined
                }}
                className={cn("liquid-glass rounded-[28px] w-full max-w-2xl p-2 flex flex-col relative z-20 will-change-transform transition-opacity duration-500", activeAnims.length > 0 && "opacity-0 pointer-events-none")}
                style={{ transformStyle: 'preserve-3d' }}
                transition={{ duration: isHolding ? 0.1 : Math.max(0.5, 2 - typingIntensity), repeat: text && activeAnims.length === 0 && !isHolding ? Infinity : 0, ease: "easeInOut" }}
              >
                <div 
                  className="w-full flex flex-col relative transition-all duration-75" 
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isHolding ? `translate(${(Math.random() - 0.5) * (holdProgress/2)}px, ${(Math.random() - 0.5) * (holdProgress/2)}px)` : 'none',
                  }}
                >
                  <textarea
                    ref={textareaRef} value={text} onChange={handleTextChange} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}
                    disabled={activeAnims.length > 0}
                    placeholder={ritualMode === 'oracle' ? "Ask the void..." : ritualMode === 'echo' ? "Whisper to the void..." : "Type your thoughts..."}
                    className={cn(
                      "w-full bg-transparent placeholder:text-white/30 text-lg md:text-2xl font-sans font-light resize-none focus:outline-none px-4 py-4 md:px-6 md:py-6 leading-relaxed relative z-10 transition-all duration-500 text-white",
                      ritualMode === 'heavy' && "font-syne font-bold tracking-tight",
                      ritualMode === 'mist' && "font-fraunces italic opacity-60",
                      ritualMode === 'echo' && "hover:opacity-100 focus:opacity-100 opacity-50",
                      ritualMode === 'oracle' && "font-serif text-center"
                    )}
                    rows={1} spellCheck={false}
                    style={{ 
                      textShadow: `0 0 ${typingIntensity * 15}px rgba(255, 255, 255, ${typingIntensity * 0.4})`,
                      transform: ritualMode === 'heavy' ? `scale(${1 + typingIntensity * 0.05})` : 'none'
                    }}
                  />
                  
                  {!isZenMode && (
                    <div className="flex justify-between items-center px-3 md:px-4 pb-2 md:pb-3 pt-1 md:pt-2">
                      <AnimatePresence>
                        {text.trim() ? (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                            className={cn("text-[8px] md:text-[10px] font-sans uppercase tracking-[0.2em] ml-1 md:ml-2 opacity-50 transition-colors", isHolding ? "text-red-400" : currentTheme.text)}
                          >
                            {isHolding ? "Releasing..." : "Hold Enter or button"}
                          </motion.span>
                        ) : (
                          <span className="text-transparent text-[10px] font-sans uppercase tracking-[0.2em] ml-2 select-none">Placeholder</span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {text.trim() && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.5, rotate: -45 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }} 
                            whileTap={{ scale: 0.95 }}
                            onPointerDown={startHold}
                            onPointerUp={stopHold}
                            onPointerLeave={stopHold}
                            className={cn(
                              "liquid-glass-strong rounded-full p-2.5 text-white transition-colors flex items-center justify-center group cursor-pointer relative overflow-hidden touch-none select-none",
                              isHolding && "ring-2 ring-white/50"
                            )}
                          >
                            {/* Liquid Metal Shader Border */}
                            <div 
                              className="absolute inset-0 z-25 pointer-events-none rounded-full overflow-hidden"
                              style={{
                                padding: '2px',
                                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                WebkitMaskComposite: 'xor',
                                maskComposite: 'exclude',
                              }}
                            >
                              <LiquidMetalShader 
                                className="absolute inset-[-2px]" 
                                opacity={isHolding ? 1.0 : 0.8}
                                distortion={isHolding ? 0.6 : 0.2}
                                repetition={isHolding ? 4 : 2.5}
                                scale={isHolding ? 3 : 2}
                              />
                            </div>
                            
                            <div 
                              className="absolute inset-0 bg-white/40 origin-bottom z-10"
                              style={{ transform: `scaleY(${holdProgress / 100})`, transition: isHolding ? 'none' : 'transform 0.3s ease-out' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-20" />
                            <ArrowUp className={cn("w-5 h-5 opacity-90 transition-opacity relative z-30", isHolding ? "opacity-100 animate-pulse" : "group-hover:opacity-100")} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="aftermath"
              initial={{ opacity: 0, scale: 0.9, y: 10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50 bg-black/40"
            >
              <div className="relative flex items-center justify-center mb-16">
                {/* Countdown */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, delay: 0 }}
                  className="absolute flex flex-col items-center"
                >
                  <span className="text-white/60 font-mono text-sm tracking-[0.3em] uppercase">INHALE IN...</span>
                  <span className="text-white/80 font-mono text-6xl tracking-tighter">3</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, delay: 2 }}
                  className="absolute flex flex-col items-center"
                >
                  <span className="text-white/60 font-mono text-sm tracking-[0.3em] uppercase">INHALE IN...</span>
                  <span className="text-white/80 font-mono text-6xl tracking-tighter">2</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, delay: 4 }}
                  className="absolute flex flex-col items-center"
                >
                  <span className="text-white/60 font-mono text-sm tracking-[0.3em] uppercase">INHALE IN...</span>
                  <span className="text-white/80 font-mono text-6xl tracking-tighter">1</span>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 0.5, 2, 2, 0.5], 
                    opacity: [0, 0.4, 0.6, 0.6, 0] 
                  }}
                  transition={{ 
                    duration: 21, 
                    times: [0, 0.28, 0.52, 0.76, 1], 
                    ease: "easeInOut" 
                  }}
                  className="absolute w-48 h-48 rounded-full border border-white/30"
                />
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ 
                    scale: [0.5, 0.5, 1.5, 1.5, 0.5], 
                    opacity: [0, 0.6, 0.8, 0.8, 0] 
                  }}
                  transition={{ 
                    duration: 21, 
                    times: [0, 0.28, 0.52, 0.76, 1], 
                    ease: "easeInOut" 
                  }}
                  className="absolute w-32 h-32 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]"
                />
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5, delay: 6, times: [0, 0.1, 0.9, 1] }}
                  className="text-white/60 font-mono text-3xl tracking-[0.3em] uppercase absolute"
                >
                  Inhale
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5, delay: 11, times: [0, 0.1, 0.9, 1] }}
                  className="text-white/60 font-mono text-3xl tracking-[0.3em] uppercase absolute"
                >
                  Hold
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5, delay: 16, times: [0, 0.1, 0.9, 1] }}
                  className="text-white/60 font-mono text-3xl tracking-[0.3em] uppercase absolute"
                >
                  Exhale
                </motion.p>
              </div>

              <motion.p 
                key={aftermathMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
                transition={{ duration: 6, ease: "easeInOut", times: [0, 0.2, 0.8, 1] }}
                className={cn("font-fraunces italic text-3xl md:text-5xl tracking-wide drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] text-center max-w-2xl px-8", currentTheme.text)}
              >
                {aftermathMessage}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!isZenMode && !isDestroyed && activeAnims.length === 0 && (
          <motion.footer 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ delay: 1, duration: 1 }}
            className={cn("absolute bottom-4 md:bottom-8 left-0 right-0 px-4 md:px-8 z-10 flex flex-row items-center justify-between gap-2 md:gap-0", currentTheme.text, "opacity-80")}
          >
            {/* Left: Progress */}
            <div className="flex items-center gap-2 md:gap-4 font-sans text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase overflow-x-auto md:overflow-x-hidden md:flex-wrap no-scrollbar justify-start shrink-0">
              <div className="liquid-glass px-2 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shrink-0">
                <span className="whitespace-nowrap">
                  <span className="hidden md:inline">Thoughts cleared today:</span>
                  <span className="md:hidden">Cleared:</span>
                  <span className="font-medium ml-1 md:ml-2 text-white">{dailyCount}</span>
                </span>
              </div>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="liquid-glass px-2 py-1.5 md:px-4 md:py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all shrink-0"
                title={isMuted ? "Unmute Music" : "Mute Music"}
              >
                {isMuted ? <VolumeX className="w-3 h-3 md:w-4 md:h-4" /> : <Volume2 className="w-3 h-3 md:w-4 md:h-4" />}
                <span className="hidden sm:inline">{isMuted ? "Unmute" : "Mute"}</span>
              </button>
              {userData.tier === 'free' && (
                <button onClick={() => setShowProModal(true)} className="liquid-glass-strong px-2 py-1.5 md:px-4 md:py-2 rounded-full hover:scale-105 transition-transform flex items-center gap-1.5 text-amber-300 shrink-0">
                  <Sparkles className="w-3 h-3" /> <span className="hidden sm:inline">Upgrade</span>
                </button>
              )}
            </div>

            {/* Right: Socials */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <a href="https://x.com/@PrimeDevv" target="_blank" rel="noopener noreferrer" className="liquid-glass w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.936H5.059z"></path></svg>
                  </a>
                  <a href="https://www.instagram.com/officialprimedev/" target="_blank" rel="noopener noreferrer" className="liquid-glass w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
                  </a>
                  <a href="https://discord.gg/bcXduuG3Da" target="_blank" rel="noopener noreferrer" className="liquid-glass w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path></svg>
                  </a>
                </div>
              </motion.footer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStats(false)}
              className={cn(
                "absolute inset-0 bg-black/80",
              )}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl md:rounded-[32px] border border-white/10 bg-[#0A0A0A] shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              {/* Liquid Glass Background Effect */}
              {!reduceMotion && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-30 animate-pulse" style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />
                  <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s', background: 'radial-gradient(circle, #10b981 0%, transparent 70%)' }} />
                </div>
              )}

              {/* Header */}
              <div className={cn(
                "relative z-10 flex items-center justify-between p-5 md:p-8 border-b border-white/5 bg-white/[0.02]",
              )}>
                <div>
                  <h2 className="text-2xl md:text-4xl font-light tracking-tight text-white serif">
                    Insights <span className="italic opacity-50">&</span> Settings
                  </h2>
                  <p className="mt-1 text-[9px] md:text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
                    Personal Archive • Configuration
                  </p>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-2 md:p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors group"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5 text-white/50 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  
                  {/* Left Column: Stats */}
                  <div className="lg:col-span-5 space-y-10">
                    <section>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6 flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        Monthly Overview
                      </h3>
                      <div className="space-y-4">
                        <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
                          {/* Subtle Glow */}
                          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
                          
                          <div className="relative z-10">
                            <div className="flex items-baseline gap-2 md:gap-3">
                              <span className="text-4xl md:text-6xl font-light tracking-tighter text-white mono">
                                {monthlyCount}
                              </span>
                              <span className="text-xs md:text-sm text-white/40 uppercase tracking-wider font-medium">
                                Fragments
                              </span>
                            </div>
                            <p className="mt-3 md:mt-4 text-[10px] md:text-xs text-white/40 leading-relaxed font-light">
                              Your emotional clearance for <span className="text-white/60 font-medium">{new Date().toLocaleString('default', { month: 'long' })}</span>.
                            </p>
                            <div className="mt-4 md:mt-6 flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full bg-emerald-400",
                                !reduceMotion && "animate-pulse"
                              )} />
                              <span>Consistent Progress</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <span className="block text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-1 md:mb-2 font-bold">Lifetime</span>
                            <span className="text-xl md:text-2xl font-light text-white mono">{userData.totalReleases}</span>
                          </div>
                          <div className="p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <span className="block text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 mb-1 md:mb-2 font-bold">Today</span>
                            <span className="text-xl md:text-2xl font-light text-white mono">{dailyCount}</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Account Status
                      </h3>
                      <div className="relative p-5 md:p-8 rounded-2xl md:rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-5 md:mb-6">
                            <div className="flex flex-col">
                              <span className="text-[10px] md:text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Current Tier</span>
                              <span className={cn(
                                "text-base md:text-lg font-bold uppercase tracking-[0.2em]",
                                userData.tier === 'pro' ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400" : "text-white/80"
                              )}>
                                {userData.tier}
                              </span>
                            </div>
                            <div className={cn(
                              "p-2.5 md:p-3 rounded-xl md:rounded-2xl border",
                              userData.tier === 'pro' ? "bg-indigo-500/10 border-indigo-500/20" : "bg-white/5 border-white/10"
                            )}>
                              {userData.tier === 'pro' ? <Diamond className="w-4 h-4 md:w-5 md:h-5 text-indigo-400" /> : <User className="w-4 h-4 md:w-5 md:h-5 text-white/40" />}
                            </div>
                          </div>
                          
                          {userData.tier === 'free' ? (
                            <button 
                              onClick={() => { setShowStats(false); setShowProModal(true); }}
                              className="w-full py-3 md:py-4 rounded-xl bg-white text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                            >
                              Unlock Pro Access
                            </button>
                          ) : (
                            <div className="py-2.5 md:py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-center">
                              <span className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 font-bold">Pro Member</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Right Column: Settings */}
                  <div className="lg:col-span-7 space-y-12">
                    <section>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
                          Visual Preferences
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="flex items-center gap-4 p-1 rounded-full bg-white/5 border border-white/5">
                            <span className="pl-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Reduce Motion</span>
                            <button
                              onClick={() => setReduceMotion(!reduceMotion)}
                              className={cn(
                                "relative w-12 h-6 rounded-full transition-colors duration-300",
                                reduceMotion ? "bg-emerald-500" : "bg-white/10"
                              )}
                            >
                              <motion.div
                                animate={{ x: reduceMotion ? 26 : 2 }}
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>
                          <div className="flex items-center gap-4 p-1 rounded-full bg-white/5 border border-white/5">
                            <div className="flex flex-col pl-4">
                              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Eco Mode</span>
                              <span className="text-[8px] text-white/20 uppercase tracking-tighter">Max Performance</span>
                            </div>
                            <button
                              onClick={() => {
                                const newVal = !isEcoMode;
                                setIsEcoMode(newVal);
                                setReduceMotion(newVal);
                                saveUserData({ isEcoMode: newVal });
                              }}
                              className={cn(
                                "relative w-12 h-6 rounded-full transition-colors duration-300",
                                isEcoMode ? "bg-indigo-500" : "bg-white/10"
                              )}
                            >
                              <motion.div
                                animate={{ x: isEcoMode ? 26 : 2 }}
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>

                          <div className="flex items-center gap-4 p-1 rounded-full bg-white/5 border border-white/5">
                            <div className="flex flex-col pl-4">
                              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Skip Breathing</span>
                              <span className="text-[8px] text-white/20 uppercase tracking-tighter">Fast Release</span>
                            </div>
                            <button
                              onClick={() => {
                                const newVal = !userData.disableBreathing;
                                saveUserData({ disableBreathing: newVal });
                              }}
                              className={cn(
                                "relative w-12 h-6 rounded-full transition-colors duration-300",
                                userData.disableBreathing ? "bg-rose-500" : "bg-white/10"
                              )}
                            >
                              <motion.div
                                animate={{ x: userData.disableBreathing ? 26 : 2 }}
                                className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Real-time Theme Preview Card */}
                        <div className="space-y-3">
                          <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold ml-1">
                            Live Preview
                          </span>
                          <ThemePreviewCard 
                            theme={hoveredTheme || userData.theme} 
                            reduceMotion={reduceMotion} 
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-6 mb-6 border-b border-white/5 pb-3 overflow-x-auto scrollbar-hide">
                            <button 
                              onClick={() => setThemeTab('atmospheres')} 
                              className={cn(
                                "text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap",
                                themeTab === 'atmospheres' ? "text-white font-bold" : "text-white/30 hover:text-white/60"
                              )}
                            >
                              Atmospheres
                              {themeTab === 'atmospheres' && (
                                <motion.div layoutId="activeTab" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-white/40" />
                              )}
                            </button>
                            <button 
                              onClick={() => setThemeTab('live')} 
                              className={cn(
                                "text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap",
                                themeTab === 'live' ? "text-white font-bold" : "text-white/30 hover:text-white/60"
                              )}
                            >
                              Live Atmospheres
                              {themeTab === 'live' && (
                                <motion.div layoutId="activeTab" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-white/40" />
                              )}
                            </button>
                            <button 
                              onClick={() => setThemeTab('legacy')} 
                              className={cn(
                                "text-[10px] uppercase tracking-widest transition-all relative whitespace-nowrap",
                                themeTab === 'legacy' ? "text-white font-bold" : "text-white/30 hover:text-white/60"
                              )}
                            >
                              Legacy
                              {themeTab === 'legacy' && (
                                <motion.div layoutId="activeTab" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-white/40" />
                              )}
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                            {(Object.keys(THEMES) as Theme[]).filter(t => {
                              const theme = THEMES[t];
                              if (themeTab === 'live') return theme.isLive;
                              if (themeTab === 'legacy') return theme.isOld;
                              return !theme.isLive && !theme.isOld;
                            }).map((t) => {
                              const theme = THEMES[t];
                              const isLocked = theme.isPro && userData.tier === 'free';
                              return (
                                <button
                                  key={t}
                                  onMouseEnter={() => setHoveredTheme(t as Theme)}
                                  onMouseLeave={() => setHoveredTheme(null)}
                                  onClick={() => {
                                    if (isLocked) {
                                      setShowStats(false);
                                      setShowProModal(true);
                                    } else {
                                      saveUserData({ theme: t });
                                    }
                                  }}
                                  className={cn(
                                    "group relative p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-2 md:gap-3",
                                    userData.theme === t 
                                      ? "border-white/40 ring-1 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                                      : "border-white/5 hover:border-white/20",
                                    isLocked && "opacity-50"
                                  )}
                                >
                                  {/* Real Background Preview - Optimized for list */}
                                  <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity">
                                    <ThemePreview theme={t as Theme} />
                                  </div>

                                  <div className="relative z-10 flex flex-col items-center gap-1.5 md:gap-2">
                                    <div className={cn(
                                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                      userData.theme === t ? "bg-white/20 scale-110" : "bg-white/5 group-hover:bg-white/10"
                                    )}>
                                      {theme.icon}
                                    </div>
                                    <span className={cn(
                                      "text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors text-center",
                                      userData.theme === t ? "text-white" : "text-white/40 group-hover:text-white/60"
                                    )}>
                                      {theme.name}
                                    </span>
                                    {isLocked && <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-white/30" />}
                                  </div>
                                  
                                  {userData.theme === t && (
                                    <motion.div 
                                      layoutId="theme-active"
                                      className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-[1]"
                                    />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <span className="block text-[10px] md:text-xs font-medium text-white/60 mb-3 md:mb-4">Release Animation</span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
                            {Object.keys(ANIMATIONS_CONFIG).map((animId) => {
                              const anim = ANIMATIONS_CONFIG[animId];
                              const isLocked = anim.isPro && userData.tier === 'free' && !isAdmin;
                              return (
                                <button
                                  key={animId}
                                  onMouseEnter={() => setHoveredAnim(animId)}
                                  onMouseLeave={() => setHoveredAnim(null)}
                                  onClick={() => {
                                    if (isLocked) {
                                      setShowStats(false);
                                      setShowProModal(true);
                                    } else {
                                      saveUserData({ selectedAnimation: userData.selectedAnimation === animId ? 'random' : animId });
                                    }
                                  }}
                                  className={cn(
                                    "relative h-20 md:h-24 rounded-xl border text-[8px] md:text-[9px] uppercase tracking-widest font-bold transition-all overflow-hidden group",
                                    userData.selectedAnimation === animId
                                      ? "border-white/40 ring-1 ring-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                      : "bg-white/[0.02] border-white/5 hover:border-white/20",
                                    isLocked && "opacity-50"
                                  )}
                                >
                                  {/* Live Preview Background */}
                                  <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                    {hoveredAnim === animId && (
                                      <div className="scale-75 origin-center w-[133%] h-[133%] -translate-x-[12.5%] -translate-y-[12.5%]">
                                        <ActiveAnimationComponent 
                                          text="" 
                                          theme={userData.theme} 
                                          animKey={animId} 
                                          isPreview={true}
                                          reduceMotion={reduceMotion}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Label Overlay */}
                                  <div className={cn(
                                    "relative z-10 flex items-center justify-center h-full transition-all duration-500 px-2 text-center",
                                    hoveredAnim === animId ? "bg-black/60" : "bg-black/20"
                                  )}>
                                    <div className="flex flex-col items-center gap-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                          "transition-colors",
                                          userData.selectedAnimation === animId ? "text-white" : "text-white/60 group-hover:text-white"
                                        )}>
                                          {anim.name}
                                        </span>
                                        {anim.isNew && (
                                          <span className="px-1 py-0.5 rounded-[2px] bg-emerald-500/20 text-emerald-400 text-[7px] font-bold tracking-wider leading-none">
                                            NEW
                                          </span>
                                        )}
                                      </div>
                                      {isLocked && <Lock className="w-2.5 h-2.5 text-white/30" />}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="pt-12 border-t border-white/5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-8">
                          <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-2 text-red-400/40 hover:text-red-400 text-[10px] uppercase tracking-[0.2em] font-black transition-all hover:translate-x-1"
                          >
                            <LogOut className="w-3 h-3" />
                            Sign Out
                          </button>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-1">
                          <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
                            Anti-Journal v2.5.0
                          </p>
                          <p className="text-[9px] text-white/10 uppercase tracking-widest">
                            Secure End-to-End Encryption Active
                          </p>
                        </div>
                      </div>
                    </section>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-[#1a1025] to-[#0a0510] border border-red-500/30 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-red-700" />
              
              <h2 className="text-xl font-sans font-medium text-white mb-4">Are you sure you want to log out?</h2>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={performLogout}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium transition-colors"
                >
                  Log Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setShowProModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gradient-to-b from-[#1a1025] to-[#0a0510] border border-purple-500/30 rounded-2xl md:rounded-3xl p-6 md:p-8 w-full max-w-md shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 via-purple-400 to-blue-400" />
              
              <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
              
              <div className="flex items-center gap-2 mb-1 md:mb-2">
                <div className="relative flex items-center justify-center">
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-amber-300 relative z-10" />
                  <div className="absolute inset-0 rounded-full animate-pulse opacity-40" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />
                </div>
                <h2 className="text-lg md:text-xl font-sans font-medium text-white">Anti-Journal Pro</h2>
              </div>
              <p className="text-xs md:text-sm text-purple-200/60 mb-6 md:mb-8">Deepen your release. Understand your mind.</p>

              <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                <div className="flex items-start gap-2.5 md:gap-3">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-white">The Void Log</h4>
                    <p className="text-[10px] md:text-xs text-white/50 mt-0.5">Look back at your release history and metadata.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 md:gap-3 group">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-1.5 md:gap-2">
                      10+ Premium Animations
                      <div className="relative flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-300 relative z-10 animate-pulse" />
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-40" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />
                      </div>
                    </h4>
                    <p className="text-[10px] md:text-xs text-white/50 mt-0.5">Unlock Blood Moon, Golden Rain, Matrix, and more.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 md:gap-3 group">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-1.5 md:gap-2">
                      Trend Analysis
                      <div className="relative flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-300 relative z-10 animate-pulse" />
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-40" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />
                      </div>
                    </h4>
                    <p className="text-[10px] md:text-xs text-white/50 mt-0.5">Monthly insights on your emotional release patterns.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 md:gap-3 group">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-purple-400 shrink-0" />
                  <div>
                    <h4 className="text-xs md:text-sm font-medium text-white flex items-center gap-1.5 md:gap-2">
                      Custom Themes
                      <div className="relative flex items-center justify-center">
                        <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-300 relative z-10 animate-pulse" />
                        <div className="absolute inset-0 rounded-full animate-pulse opacity-40" style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 70%)' }} />
                      </div>
                    </h4>
                    <p className="text-[10px] md:text-xs text-white/50 mt-0.5">Personalize your void with Aurora Glow, Deep Space, and more.</p>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 mb-4 md:mb-6 flex flex-col gap-3 md:gap-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-base md:text-lg font-medium text-white">$4.99<span className="text-[10px] md:text-xs text-white/40 font-normal"> / month</span></div>
                    <div className="text-[10px] md:text-xs text-emerald-400">Cancel anytime</div>
                  </div>
                </div>
                
                <PayPalSubscriptionButton 
                  onApprove={handleProApproval}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-2 left-0 right-0 flex justify-center pointer-events-none z-[60]">
        <span className="text-[8px] md:text-[10px] font-mono text-white/20 tracking-[0.2em] uppercase">
          BETA • BUGS MAY OCCUR.
        </span>
      </div>
    </div>
  );
}
