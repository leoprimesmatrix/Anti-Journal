import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

type ParticleConfig = {
  count: number;
  colors: string[];
  sizeRange: [number, number];
  blurRange: [number, number];
  durationRange: [number, number];
  opacityRange: [number, number];
  movement: 'rise' | 'drift' | 'firefly' | 'streak' | 'fall';
  wobble: number;
};

const THEME_PARTICLES: Record<string, ParticleConfig> = {
  midnightSanctuary: {
    count: 25,
    colors: ['#4f46e5', '#818cf8', '#c7d2fe'],
    sizeRange: [4, 24],
    blurRange: [2, 8],
    durationRange: [15, 30],
    opacityRange: [0.1, 0.4],
    movement: 'rise',
    wobble: 10,
  },
  nocturnalHaven: {
    count: 40,
    colors: ['#f97316', '#fb923c', '#fdba74', '#ef4444'],
    sizeRange: [2, 8],
    blurRange: [0, 2],
    durationRange: [5, 12],
    opacityRange: [0.4, 0.8],
    movement: 'rise',
    wobble: 15,
  },
  urbanSolitude: {
    count: 30,
    colors: ['#38bdf8', '#7dd3fc', '#bae6fd', '#e0f2fe'],
    sizeRange: [6, 32],
    blurRange: [4, 12],
    durationRange: [20, 40],
    opacityRange: [0.05, 0.3],
    movement: 'rise',
    wobble: 5,
  },
  felineVigil: {
    count: 35,
    colors: ['#e2e8f0', '#cbd5e1', '#f8fafc'],
    sizeRange: [1, 4],
    blurRange: [0, 1],
    durationRange: [25, 50],
    opacityRange: [0.1, 0.5],
    movement: 'drift',
    wobble: 20,
  },
  transitEchoes: {
    count: 20,
    colors: ['#fcd34d', '#fde68a', '#fef3c7', '#fbbf24'],
    sizeRange: [8, 40],
    blurRange: [8, 20],
    durationRange: [10, 25],
    opacityRange: [0.1, 0.3],
    movement: 'streak',
    wobble: 30,
  },
  twilightLofi: {
    count: 25,
    colors: ['#c084fc', '#e879f9', '#f472b6', '#fbcfe8'],
    sizeRange: [3, 12],
    blurRange: [1, 4],
    durationRange: [15, 35],
    opacityRange: [0.2, 0.6],
    movement: 'drift',
    wobble: 15,
  },
  sunsetDrift: {
    count: 20,
    colors: ['#fb923c', '#fcd34d', '#fca5a5', '#fed7aa'],
    sizeRange: [10, 50],
    blurRange: [10, 25],
    durationRange: [20, 45],
    opacityRange: [0.1, 0.4],
    movement: 'rise',
    wobble: 10,
  },
  woodlandRetreat: {
    count: 45,
    colors: ['#a3e635', '#bef264', '#d9f99d'],
    sizeRange: [2, 6],
    blurRange: [1, 3],
    durationRange: [8, 20],
    opacityRange: [0.4, 0.9],
    movement: 'firefly',
    wobble: 25,
  },
  oceanicHorizon: {
    count: 35,
    colors: ['#2dd4bf', '#5eead4', '#99f6e4', '#ccfbf1'],
    sizeRange: [3, 15],
    blurRange: [1, 5],
    durationRange: [12, 28],
    opacityRange: [0.2, 0.6],
    movement: 'rise',
    wobble: 15,
  },
  cascadingSerenity: {
    count: 30,
    colors: ['#5eead4', '#99f6e4', '#ccfbf1'],
    sizeRange: [2, 10],
    blurRange: [1, 3],
    durationRange: [15, 30],
    opacityRange: [0.1, 0.5],
    movement: 'rise',
    wobble: 20,
  },
  snowboundSilence: {
    count: 50,
    colors: ['#f8fafc', '#f1f5f9', '#e2e8f0'],
    sizeRange: [2, 6],
    blurRange: [0, 2],
    durationRange: [10, 25],
    opacityRange: [0.3, 0.8],
    movement: 'fall',
    wobble: 30,
  },
  urbanEchoes: {
    count: 25,
    colors: ['#94a3b8', '#cbd5e1', '#e2e8f0'],
    sizeRange: [1, 5],
    blurRange: [0, 2],
    durationRange: [15, 35],
    opacityRange: [0.1, 0.4],
    movement: 'drift',
    wobble: 40,
  },
  sunsetVigil: {
    count: 35,
    colors: ['#fb923c', '#f87171', '#fca5a5'],
    sizeRange: [3, 12],
    blurRange: [1, 4],
    durationRange: [10, 20],
    opacityRange: [0.2, 0.6],
    movement: 'rise',
    wobble: 25,
  },
  neonPulse: {
    count: 20,
    colors: ['#c084fc', '#e879f9', '#f472b6'],
    sizeRange: [2, 8],
    blurRange: [2, 6],
    durationRange: [5, 15],
    opacityRange: [0.3, 0.7],
    movement: 'streak',
    wobble: 10,
  },
  celestialWhispers: {
    count: 40,
    colors: ['#818cf8', '#c7d2fe', '#e0e7ff'],
    sizeRange: [1, 4],
    blurRange: [0, 2],
    durationRange: [30, 60],
    opacityRange: [0.1, 0.5],
    movement: 'drift',
    wobble: 50,
  },
  galacticBloom: {
    count: 35,
    colors: ['#d946ef', '#e879f9', '#fdf4ff'],
    sizeRange: [3, 8],
    blurRange: [1, 4],
    durationRange: [10, 25],
    opacityRange: [0.2, 0.8],
    movement: 'firefly',
    wobble: 30,
  },
  lunarTide: {
    count: 30,
    colors: ['#60a5fa', '#93c5fd', '#bfdbfe'],
    sizeRange: [5, 20],
    blurRange: [3, 8],
    durationRange: [15, 35],
    opacityRange: [0.1, 0.4],
    movement: 'rise',
    wobble: 20,
  },
  nebulaVortex: {
    count: 45,
    colors: ['#818cf8', '#c084fc', '#e879f9'],
    sizeRange: [2, 12],
    blurRange: [2, 6],
    durationRange: [20, 40],
    opacityRange: [0.1, 0.5],
    movement: 'drift',
    wobble: 80,
  },
};

export function AtmosphereParticles({ theme }: { theme: string }) {
  const config = THEME_PARTICLES[theme];
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (!config) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: config.count }).map((_, i) => {
      const size = Math.random() * (config.sizeRange[1] - config.sizeRange[0]) + config.sizeRange[0];
      const blur = Math.random() * (config.blurRange[1] - config.blurRange[0]) + config.blurRange[0];
      const duration = Math.random() * (config.durationRange[1] - config.durationRange[0]) + config.durationRange[0];
      const opacity = Math.random() * (config.opacityRange[1] - config.opacityRange[0]) + config.opacityRange[0];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const delay = Math.random() * -duration; // Start at random points in the animation
      const startX = Math.random() * 100; // vw
      
      return { id: i, size, blur, duration, opacity, color, delay, startX };
    });

    setParticles(newParticles);
  }, [theme, config]);

  if (!config || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden mix-blend-screen">
      {particles.map((p) => {
        let animate: any = {};
        
        if (config.movement === 'rise') {
          const endX = p.startX + (Math.random() * config.wobble - config.wobble/2);
          animate = {
            y: ['110vh', '50vh', '-10vh'],
            x: [`${p.startX}vw`, `${(p.startX + endX)/2}vw`, `${endX}vw`],
            opacity: [0, p.opacity, 0],
          };
        } else if (config.movement === 'drift') {
          animate = {
            y: ['110vh', '70vh', '30vh', '-10vh'],
            x: [
              `${p.startX}vw`, 
              `${p.startX + config.wobble}vw`, 
              `${p.startX - config.wobble}vw`, 
              `${p.startX}vw`
            ],
            opacity: [0, p.opacity, p.opacity, 0],
          };
        } else if (config.movement === 'firefly') {
          animate = {
            y: ['110vh', '80vh', '50vh', '20vh', '-10vh'],
            x: [
              `${p.startX}vw`, 
              `${p.startX + config.wobble}vw`, 
              `${p.startX - config.wobble/2}vw`, 
              `${p.startX + config.wobble/2}vw`,
              `${p.startX}vw`
            ],
            opacity: [0, p.opacity, 0, p.opacity, 0],
            scale: [1, 1.5, 1, 1.5, 1],
          };
        } else if (config.movement === 'fall') {
          const endX = p.startX + (Math.random() * config.wobble - config.wobble/2);
          animate = {
            y: ['-10vh', '50vh', '110vh'],
            x: [`${p.startX}vw`, `${(p.startX + endX)/2}vw`, `${endX}vw`],
            opacity: [0, p.opacity, 0],
          };
        } else if (config.movement === 'streak') {
          animate = {
            y: ['110vh', '50vh', '-10vh'],
            x: [`${p.startX}vw`, `${p.startX + config.wobble}vw`, `${p.startX + config.wobble * 2}vw`],
            opacity: [0, p.opacity, 0],
            scaleY: [1, 2, 1],
          };
        }

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              filter: `blur(${p.blur}px)`,
              left: 0,
              top: 0,
              willChange: 'transform, opacity',
            }}
            initial={{ y: config.movement === 'fall' ? '-10vh' : '110vh', x: `${p.startX}vw`, opacity: 0 }}
            animate={animate}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        );
      })}
    </div>
  );
}
