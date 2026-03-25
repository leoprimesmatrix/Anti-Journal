import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { motion } from 'motion/react';
import { THEME_COLORS } from './ReleaseAnimations';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three-stdlib';
import { TextureLoader } from 'three';
import { Trail } from '@react-three/drei';
import * as THREE from 'three';
import * as easingUtils from "easing-utils";

// Helper to get color
const getColor = (theme: string) => THEME_COLORS[theme as keyof typeof THEME_COLORS] || '#ffffff';

// 1. Midnight Rain (Midnight Sanctuary)
export const MidnightRain = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');
  const drops = Array.from({ length: isPreview ? 30 : 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 1.5 + Math.random() * 2,
    size: 2 + Math.random() * 4
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="rain-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.1" numOctaves="2" result="noise">
            <animate attributeName="baseFrequency" values="0.05 0.1; 0.08 0.15; 0.05 0.1" dur="4s" repeatCount="indefinite" />
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="1" result="smoothedNoise" />
          <feDisplacementMap in="SourceGraphic" in2="smoothedNoise" scale="20" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feSpecularLighting in="smoothedNoise" surfaceScale="5" specularConstant="1.5" specularExponent="40" lightingColor="#ffffff" result="specular">
            <fePointLight x="500" y="0" z="200">
              <animate attributeName="y" values="-1000; 2000; -1000" dur="5s" repeatCount="indefinite" />
            </fePointLight>
          </feSpecularLighting>
          <feComposite in="specular" in2="displaced" operator="in" result="specularMasked" />
          <feComposite in="displaced" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </svg>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.8, 0], 
                y: [0, 20, 150], 
                filter: ['blur(0px)', 'url(#rain-glass) blur(2px)', 'url(#rain-glass) blur(10px)'],
                scaleY: [1, 1.2, 2]
              }}
              transition={{ duration: 3, delay: i * 0.1, ease: "easeIn" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide origin-top"
              style={{ color, textShadow: `0 0 10px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {drops.map(drop => (
        <motion.div
          key={drop.id}
          initial={{ opacity: 0, y: '-10vh', scaleY: 1 }}
          animate={{ opacity: [0, 0.8, 0], y: ['-10vh', '110vh'], scaleY: [1, 3, 1] }}
          transition={{ duration: drop.duration, delay: drop.delay, ease: "easeIn", repeat: Infinity }}
          className="absolute rounded-full"
          style={{ 
            backgroundColor: color, 
            left: `${drop.x}%`, 
            width: drop.size, 
            height: drop.size * 2,
            filter: 'url(#rain-glass)',
            boxShadow: `0 0 ${drop.size * 2}px ${color}`
          }}
        />
      ))}
    </div>
  );
};

// 2. Ember Drift (Nocturnal Haven)
export const EmberDrift = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');
  const embers = Array.from({ length: isPreview ? 30 : 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 3,
    size: Math.random() * 4 + 2
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
              animate={{ opacity: 0, y: -50, filter: 'blur(8px)', scale: 1.1 }}
              transition={{ duration: 2.5, delay: i * 0.1, ease: "easeOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color, textShadow: `0 0 10px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {embers.map(ember => (
        <motion.div
          key={ember.id}
          initial={{ opacity: 0, y: '50vh', x: `${ember.x}vw`, scale: 1 }}
          animate={{ opacity: [0, 1, 0], y: '-50vh', x: `${ember.x + (Math.random() * 20 - 10)}vw`, scale: [1, 0.5] }}
          transition={{ duration: ember.duration, delay: ember.delay, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: ember.size, height: ember.size, left: '50%', boxShadow: `0 0 ${ember.size * 2}px ${color}` }}
        />
      ))}
    </div>
  );
};

// 3. City Lights Blur (Urban Solitude)
export const CityLightsBlur = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');
  const lights = Array.from({ length: isPreview ? 15 : 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 1,
    duration: 2 + Math.random() * 2,
    size: Math.random() * 40 + 20
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              animate={{ opacity: 0, filter: 'blur(20px)', scale: 1.5 }}
              transition={{ duration: 3, delay: i * 0.1, ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {lights.map(light => (
        <motion.div
          key={light.id}
          initial={{ opacity: 0, x: `${light.x}vw`, y: `${light.y}vh`, scale: 0.5, filter: 'blur(10px)' }}
          animate={{ opacity: [0, 0.4, 0], scale: 1.5, filter: 'blur(20px)' }}
          transition={{ duration: light.duration, delay: light.delay, ease: "easeInOut" }}
          className="absolute rounded-full"
          style={{ backgroundColor: color, width: light.size, height: light.size, left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
};

// 4. Window Frost (Feline Vigil)
export const WindowFrost = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, filter: 'blur(0px) brightness(1)', scale: 1 }}
              animate={{ opacity: 0, filter: 'blur(5px) brightness(2)', scale: 0.95 }}
              transition={{ duration: 4, delay: i * 0.1, ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="absolute inset-0 z-20"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      />
    </div>
  );
};

// 5. Subway Rush (Transit Echoes)
export const SubwayRush = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');
  const lines = Array.from({ length: isPreview ? 5 : 15 }).map((_, i) => ({
    id: i,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 0.5,
    duration: 0.5 + Math.random() * 1,
    height: Math.random() * 4 + 1
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, skewX: 0 }}
              animate={{ opacity: 0, x: -1000, skewX: -30 }}
              transition={{ duration: 0.8, delay: i * 0.05 + 1, ease: "backIn" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {lines.map(line => (
        <motion.div
          key={line.id}
          initial={{ opacity: 0, x: '50vw', y: `${line.y}vh`, scaleX: 1 }}
          animate={{ opacity: [0, 1, 0], x: '-50vw', scaleX: 20 }}
          transition={{ duration: line.duration, delay: line.delay + 1, ease: "linear" }}
          className="absolute w-10 rounded-full"
          style={{ backgroundColor: color, height: line.height, left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
};

// 6. Lofi Glitch (Twilight Lo-Fi)
export const LofiGlitch = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="glitch-filter">
          <feOffset dx="-3" dy="0" in="SourceGraphic" result="red-shift" />
          <feOffset dx="3" dy="0" in="SourceGraphic" result="blue-shift" />
          <feColorMatrix in="red-shift" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
          <feColorMatrix in="blue-shift" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
          <feBlend mode="screen" in="red" in2="blue" result="aberration" />
          <feBlend mode="screen" in="SourceGraphic" in2="aberration" />
        </filter>
      </svg>
      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-40 opacity-50" />
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30" style={{ filter: 'url(#glitch-filter)' }}>
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, skewX: 0 }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.8, 1, 0.2, 1, 0], 
                x: [0, -5, 5, -10, 10, 0],
                skewX: [0, 10, -10, 20, -20, 0],
                scaleY: [1, 1.1, 0.9, 1.2, 0.8, 1]
              }}
              transition={{ duration: 0.8, delay: i * 0.1, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-mono tracking-tighter uppercase"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0, top: '0%' }}
          animate={{ opacity: [0, 0.5, 0], top: '100%' }}
          transition={{ duration: 2, ease: "linear" }}
          className="absolute left-0 right-0 h-16 bg-white/20 z-20 pointer-events-none blur-sm"
        />
      )}
    </div>
  );
};

// 7. Highway Speed (Sunset Drift)
export const HighwaySpeed = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"} style={{ perspective: '1000px' }}>
      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div key={i}
              className="absolute h-1 bg-white/50 rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: '50%', width: `${Math.random() * 200 + 50}px` }}
              animate={{ z: [0, 1000], opacity: [0, 1, 0] }}
              transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, z: 0, filter: 'blur(0px)', color }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0], 
                z: [0, -2000], 
                filter: ['blur(0px)', 'blur(20px)'],
                color: [color, '#ff4500']
              }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: "easeIn" }}
              className="text-2xl md:text-4xl lg:text-5xl font-sans font-bold italic tracking-widest"
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 8. Forest Mist (Woodland Retreat)
export const ForestMist = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="mist-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {!isPreview && !reduceMotion && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: [0, 0.8, 0], y: -50 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 z-20 bg-gradient-to-t from-white/20 to-transparent blur-3xl"
        />
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0], 
                filter: ['url(#mist-filter) blur(0px)', 'url(#mist-filter) blur(10px)'],
                y: [0, -20]
              }}
              transition={{ duration: 3, delay: i * 0.2, ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-widest"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 9. Tide Wash (Oceanic Horizon)
export const TideWash = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="liquid-glass-tide" x="-20%" y="-20%" width="140%" height="140%">
          {/* Base wave turbulence */}
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" result="noise">
            <animate attributeName="baseFrequency" values="0.015 0.02;0.025 0.04;0.015 0.02" dur="5s" repeatCount="indefinite" />
          </feTurbulence>
          {/* Smooth it out for a liquid feel */}
          <feGaussianBlur in="noise" stdDeviation="3" result="smoothedNoise" />
          {/* High contrast to create distinct "blobs" or wave crests */}
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -10" in="smoothedNoise" result="highContrast" />
          {/* Displace the actual content */}
          <feDisplacementMap in="SourceGraphic" in2="highContrast" scale="60" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          
          {/* Specular lighting for the "glass" reflection */}
          <feSpecularLighting in="highContrast" surfaceScale="5" specularConstant="1.2" specularExponent="30" lightingColor="#ffffff" result="specular">
            <fePointLight x="50%" y="-100" z="300">
               <animate attributeName="y" values="-100; 800; -100" dur="6s" repeatCount="indefinite" />
            </fePointLight>
          </feSpecularLighting>
          
          {/* Combine lighting with the displaced image */}
          <feComposite in="specular" in2="displaced" operator="in" result="specularMasked" />
          <feComposite in="displaced" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </svg>
      
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: [0, 0.8, 0], y: ['100%', '-20%', '100%'] }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[150%] z-40 pointer-events-none"
          style={{ 
            background: `linear-gradient(to top, rgba(0, 100, 255, 0.4) 0%, rgba(0, 180, 255, 0.2) 40%, rgba(255,255,255,0.4) 50%, transparent 100%)`, 
            filter: 'url(#liquid-glass-tide) blur(2px)',
            mixBlendMode: 'overlay'
          }}
        />
      )}
      
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.7, 0], 
                y: [0, -20, -60], 
                filter: ['blur(0px)', 'url(#liquid-glass-tide) blur(4px)', 'url(#liquid-glass-tide) blur(15px)'],
                scale: [1, 1.1, 0.95],
                rotate: [0, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 20]
              }}
              transition={{ duration: 3.5, delay: 1 + i * 0.1, ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide inline-block"
              style={{ color, textShadow: `0 0 15px rgba(255,255,255,0.3)` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 10. Waterfall Crash (Cascading Serenity)
export const WaterfallCrash = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="waterfall-glass" x="-20%" y="-20%" width="140%" height="140%">
          {/* Vertical turbulence for waterfall effect */}
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.1" numOctaves="2" result="noise">
            <animate attributeName="baseFrequency" values="0.01 0.1; 0.02 0.15; 0.01 0.1" dur="2s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -5" in="noise" result="highContrast" />
          
          {/* Animate the displacement to simulate falling water */}
          <feOffset dx="0" dy="0" in="highContrast" result="fallingNoise">
            <animate attributeName="dy" values="0; 200" dur="1s" repeatCount="indefinite" />
          </feOffset>
          
          <feDisplacementMap in="SourceGraphic" in2="fallingNoise" scale="30" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          
          <feSpecularLighting in="fallingNoise" surfaceScale="4" specularConstant="1" specularExponent="20" lightingColor="#ffffff" result="specular">
            <fePointLight x="50%" y="-200" z="200" />
          </feSpecularLighting>
          
          <feComposite in="specular" in2="displaced" operator="in" result="specularMasked" />
          <feComposite in="displaced" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </svg>

      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden" style={{ filter: 'url(#waterfall-glass)' }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div key={i}
              className="absolute bg-white/40 rounded-full blur-[2px]"
              style={{ 
                left: `${Math.random() * 100}%`, 
                top: '-30%', 
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 200 + 100}px` 
              }}
              animate={{ y: ['0vh', '150vh'], opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.4 + Math.random() * 0.4, delay: Math.random() * 1, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </div>
      )}
      
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, scaleY: 1, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.8, 0], 
                y: [0, 100, 1000], 
                scaleY: [1, 2, 5],
                scaleX: [1, 0.8, 0.5],
                filter: ['blur(0px)', 'url(#waterfall-glass) blur(2px)', 'url(#waterfall-glass) blur(10px)']
              }}
              transition={{ duration: 1.5, delay: i * 0.05, ease: "easeIn" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide origin-top inline-block"
              style={{ color, textShadow: `0 0 10px rgba(255,255,255,0.5)` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 11. Blizzard Sweep (Snowbound Silence)
export const BlizzardSweep = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');
  const flakes = Array.from({ length: isPreview ? 30 : 150 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 1.5,
    duration: 0.5 + Math.random() * 1.5,
    size: Math.random() * 6 + 2
  }));

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, filter: 'blur(0px)', rotate: 0 }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.5, 0], 
                x: [0, 100, 500], 
                y: [0, -20, -100],
                filter: ['blur(0px)', 'blur(5px)', 'blur(20px)'],
                rotate: [0, 10, 45],
                scale: [1, 0.8, 0]
              }}
              transition={{ duration: 1.5, delay: i * 0.08, ease: "easeIn" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      {!reduceMotion && flakes.map(flake => (
        <motion.div
          key={flake.id}
          initial={{ opacity: 0, x: `${flake.x}vw`, y: `${flake.y}vh`, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            x: [`${flake.x}vw`, `${flake.x + 80}vw`], 
            y: [`${flake.y}vh`, `${flake.y - 30}vh`],
            scale: [0, 1, 0.5],
            rotate: [0, 360]
          }}
          transition={{ duration: flake.duration, delay: flake.delay, ease: "linear" }}
          className="absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
          style={{ width: flake.size, height: flake.size, left: '50%', top: '50%' }}
        />
      ))}
    </div>
  );
};

// 12. Neon Flicker (Urban Echoes)
export const NeonFlicker = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                x: (Math.random() - 0.5) * 300, 
                y: (Math.random() - 0.5) * 300 + 100,
                scale: [0, 1.5, 0]
              }}
              transition={{ duration: 0.5 + Math.random() * 0.5, delay: 0.5 + Math.random() * 1, ease: "easeOut" }}
              style={{ boxShadow: `0 0 10px ${color}, 0 0 20px ${color}` }}
            />
          ))}
        </div>
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, filter: 'brightness(1)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.2, 1, 0, 0.8, 0, 0.5, 0],
                filter: ['brightness(1)', 'brightness(0.5)', 'brightness(1.5)', 'brightness(0)', 'brightness(1.2)', 'brightness(0)', 'brightness(0.8)', 'brightness(0)']
              }}
              transition={{ duration: 1.5, delay: i * 0.1, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1], ease: "linear" }}
              className="text-2xl md:text-4xl lg:text-5xl font-mono tracking-widest uppercase"
              style={{ color, textShadow: `0 0 5px ${color}, 0 0 15px ${color}, 0 0 30px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 13. Golden Hour Fade (Sunset Vigil)
export const GoldenHourFade = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.5, 0], scale: 1.2 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
        >
          <div className="w-[150%] h-[150%] rounded-full" style={{ background: `radial-gradient(circle, #ffd700 0%, #ff8c00 30%, transparent 70%)`, filter: 'blur(60px)', mixBlendMode: 'screen' }} />
        </motion.div>
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, filter: 'brightness(1) blur(0px)', y: 0 }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 1, 0], 
                filter: ['brightness(1) blur(0px)', 'brightness(2) blur(4px)', 'brightness(0) blur(10px)'],
                y: [0, -10, -20],
                color: [color, '#ffd700', '#ff8c00']
              }}
              transition={{ duration: 3, delay: i * 0.15, times: [0, 0.5, 1], ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 14. Cyberpunk Shatter (Neon Pulse)
export const CyberpunkShatter = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => {
            const shards = word.split('');
            return (
              <span key={i} className="relative inline-flex">
                {shards.map((char, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                    animate={reduceMotion ? { opacity: 0 } : { 
                      opacity: [1, 1, 0], 
                      x: (Math.random() - 0.5) * 200, 
                      y: (Math.random() - 0.5) * 200,
                      rotate: (Math.random() - 0.5) * 180,
                      scale: [1, 1.5, 0],
                      color: [color, '#00ffff', '#ff00ff']
                    }}
                    transition={{ duration: 1.5, delay: i * 0.1 + j * 0.02, ease: "backIn" }}
                    className="text-2xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tighter inline-block"
                    style={{ textShadow: `2px 2px 0px #00ffff, -2px -2px 0px #ff00ff` }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 15. Meteor Shower (Celestial Whispers)
useLoader.preload(OBJLoader, 'https://files.catbox.moe/xd6w1s.obj');
useLoader.preload(TextureLoader, [
  'https://files.catbox.moe/xrcpst.png',
  'https://files.catbox.moe/glnvnk.png',
  'https://files.catbox.moe/0mfks4.png',
  'https://files.catbox.moe/odfv29.png',
  'https://files.catbox.moe/s2d2un.png'
]);

const MeteorInstance = ({ obj, material, initialPosition, rotation, scale, velocity, delay, rockColor, trailColor }: any) => {
  const ref = useRef<THREE.Group>(null);
  const timeRef = useRef(0);
  
  const clonedObj = useMemo(() => {
    const clone = obj.clone();
    clone.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material.clone();
        child.material.color.set(rockColor);
        child.material.emissive.set(trailColor);
        child.material.emissiveIntensity = 1.5 + Math.random() * 2;
      }
    });
    return clone;
  }, [obj, material, rockColor, trailColor]);

  useFrame((state, delta) => {
    // ULTRATHINK FIX: Clamp delta to 32ms. 
    // When the Canvas mounts and Suspense resolves, shader compilation causes a massive lag spike.
    // If we don't clamp delta, the meteor teleports instantly across the screen on frame 1,
    // causing the Trail component to draw a massive, ugly line connecting the start and end points.
    const safeDelta = Math.min(delta, 0.032);
    timeRef.current += safeDelta;
    
    if (ref.current) {
      const activeTime = timeRef.current - delay;
      
      if (activeTime >= 0) {
        // Update position smoothly, immune to lag spikes
        ref.current.position.x = initialPosition[0] + velocity.x * activeTime;
        ref.current.position.y = initialPosition[1] + velocity.y * activeTime;
        ref.current.position.z = initialPosition[2] + velocity.z * activeTime;
        ref.current.rotation.x += velocity.rx * safeDelta;
        ref.current.rotation.y += velocity.ry * safeDelta;
        ref.current.rotation.z += velocity.rz * safeDelta;

        // Smooth fade in/out via scale
        let currentScale = 0;
        if (activeTime < 1.0) {
          // Smoothstep fade in over 1 second
          const t = activeTime;
          currentScale = scale * (t * t * (3 - 2 * t));
        } else if (activeTime > 6) {
          // Fade out over 2 seconds
          const t = Math.max(0, 1 - (activeTime - 6) / 2);
          currentScale = scale * t;
        } else {
          currentScale = scale;
        }
        ref.current.scale.set(currentScale, currentScale, currentScale);
      } else {
        // Lock position and scale while waiting for delay to prevent Trail artifacts
        ref.current.scale.set(0, 0, 0);
        ref.current.position.set(initialPosition[0], initialPosition[1], initialPosition[2]);
      }
    }
  });

  return (
    <Trail
      width={0.6 + scale * 0.4}
      color={trailColor}
      length={30}
      decay={1.2}
      local={false}
      stride={0}
      interval={1}
    >
      <group ref={ref} position={initialPosition} rotation={rotation} scale={0}>
        <primitive object={clonedObj} />
      </group>
    </Trail>
  );
};

const MeteorSwarm = ({ count }: { count: number }) => {
  const obj = useLoader(OBJLoader, 'https://files.catbox.moe/xd6w1s.obj');
  const [baseColor, emissive, ao, normal, roughness] = useLoader(TextureLoader, [
    'https://files.catbox.moe/xrcpst.png',
    'https://files.catbox.moe/glnvnk.png',
    'https://files.catbox.moe/0mfks4.png',
    'https://files.catbox.moe/odfv29.png',
    'https://files.catbox.moe/s2d2un.png'
  ]);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: baseColor,
      emissiveMap: emissive,
      aoMap: ao,
      normalMap: normal,
      roughnessMap: roughness,
      roughness: 0.8,
      metalness: 0.2,
    });
  }, [baseColor, emissive, ao, normal, roughness]);

  const meteors = useMemo(() => {
    const rockColors = ['#8b7355', '#696969', '#808080', '#a0522d', '#5c4033', '#4a4a4a', '#333333', '#2d2d2d'];
    const trailColors = ['#ffaa00', '#ff4500', '#ffd700', '#ff6347', '#ff8c00', '#e65100'];

    return Array.from({ length: count }).map((_, i) => {
      // Spread delays over 3 seconds for a faster, more intense shower
      const delay = Math.random() * 3;
      
      // Push starting coordinates MUCH further out to guarantee they start off-screen
      // Start from the LEFT side now
      const startX = -(Math.random() * 40 + 30); // -30 to -70
      const startY = Math.random() * 30 + 20; // 20 to 50
      const startZ = (Math.random() - 0.5) * 20 - 10;
      
      return {
        initialPosition: [startX, startY, startZ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: Math.random() * 1.2 + 0.2, // 0.2 to 1.4 (Huge variance in size)
        delay: delay,
        rockColor: rockColors[Math.floor(Math.random() * rockColors.length)],
        trailColor: trailColors[Math.floor(Math.random() * trailColors.length)],
        velocity: {
          x: (Math.random() * 20 + 30), // Speed up: 30 to 50
          y: - (Math.random() * 15 + 20), // Speed up: -20 to -35
          z: (Math.random() - 0.5) * 5,
          rx: Math.random() * 1 - 0.5, // Subtle, slow rotation
          ry: Math.random() * 1 - 0.5,
          rz: Math.random() * 1 - 0.5,
        }
      };
    });
  }, [count]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <hemisphereLight color={'#ffffff'} groundColor={'#ff4500'} intensity={0.6} />
      <directionalLight position={[-10, 20, 10]} intensity={3} color={'#ffedd5'} />
      {meteors.map((m, i) => (
        <MeteorInstance key={i} obj={obj} material={material} {...m} />
      ))}
    </>
  );
};

export const MeteorShower = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {/* Background flash/glow for polish */}
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.15, 0.3, 0] }}
          transition={{ duration: 10, times: [0, 0.2, 0.6, 1], ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-transparent z-0"
        />
      )}

      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1, color: '#ffaa00' }} // Instant ignition color
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 1, 0.8, 0], 
                x: [0, 20, 150 + Math.random() * 300], 
                y: [0, -10, 100 + Math.random() * 200], 
                rotateZ: [0, -5, Math.random() * 60 - 30], 
                scale: [1, 1.1, 0.4], 
                filter: ['blur(0px)', 'blur(0px)', 'blur(12px)'],
                color: ['#ffaa00', '#ff4500', '#111111'], 
                textShadow: [`0 0 20px #ffaa00`, `0 0 40px #ff4500`, `0 0 0px transparent`]
              }}
              transition={{ duration: 2.5, delay: i * 0.08, ease: "easeIn" }} // No initial delay, faster stagger
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide inline-block will-change-transform"
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
      
      {!reduceMotion && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <Suspense fallback={null}>
              <MeteorSwarm count={isPreview ? 8 : 60} />
            </Suspense>
          </Canvas>
        </div>
      )}
    </div>
  );
};

// 16. Cosmic Bloom (Galactic Bloom)
export const CosmicBloom = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="gravitational-lens">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15" in="noise" result="highContrast" />
          <feDisplacementMap in="SourceGraphic" in2="highContrast" scale="50" xChannelSelector="R" yChannelSelector="G">
            <animate attributeName="scale" values="0; 100; 200" dur="3s" fill="freeze" />
          </feDisplacementMap>
        </filter>
      </svg>
      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            return (
              <motion.div key={i}
                className="absolute w-1 h-1 rounded-full"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  x: Math.cos(angle) * distance * 5, 
                  y: Math.sin(angle) * distance * 5,
                  scale: [0, Math.random() * 3 + 1, 0]
                }}
                transition={{ duration: 2 + Math.random() * 2, ease: "easeOut" }}
                style={{ 
                  backgroundColor: Math.random() > 0.5 ? color : '#ffffff',
                  boxShadow: `0 0 ${Math.random() * 10 + 5}px ${color}`
                }}
              />
            );
          })}
        </div>
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.8, 0], 
                scale: [1, 1.5, 4], 
                filter: ['blur(0px)', 'url(#gravitational-lens) blur(5px)', 'url(#gravitational-lens) blur(20px)'],
                letterSpacing: ['normal', '0.2em', '0.5em']
              }}
              transition={{ duration: 2.5, delay: i * 0.1, ease: "easeOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide"
              style={{ color, textShadow: `0 0 10px ${color}, 0 0 30px ${color}` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

// 17. Moonlight Ripple (Lunar Tide)
export const MoonlightRipple = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      <svg className="hidden">
        <filter id="moon-ripple-glass" x="-20%" y="-20%" width="140%" height="140%">
          {/* Gentle, slow-moving ripples */}
          <feTurbulence type="fractalNoise" baseFrequency="0.005 0.02" numOctaves="3" result="noise">
            <animate attributeName="baseFrequency" values="0.005 0.02; 0.01 0.03; 0.005 0.02" dur="8s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -2" in="noise" result="highContrast" />
          
          <feDisplacementMap in="SourceGraphic" in2="highContrast" scale="25" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          
          {/* Subtle moonlight reflection */}
          <feSpecularLighting in="highContrast" surfaceScale="3" specularConstant="0.8" specularExponent="40" lightingColor="#e2e8f0" result="specular">
            <fePointLight x="50%" y="50%" z="150">
              <animate attributeName="x" values="30%; 70%; 30%" dur="10s" repeatCount="indefinite" />
            </fePointLight>
          </feSpecularLighting>
          
          <feComposite in="specular" in2="displaced" operator="in" result="specularMasked" />
          <feComposite in="displaced" in2="specularMasked" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </svg>
      
      {!isPreview && !reduceMotion && (
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: [0, 0.6, 0], scaleY: [0, 1, 1.5] }}
          transition={{ duration: 5, ease: "easeInOut" }}
          className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center origin-bottom"
          style={{ 
            background: `linear-gradient(to top, rgba(255, 255, 255, 0.15) 0%, rgba(200, 220, 255, 0.05) 40%, transparent 60%)`,
            filter: 'url(#moon-ripple-glass) blur(4px)',
            mixBlendMode: 'screen'
          }}
        />
      )}
      
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => (
            <motion.span
              key={i}
              initial={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              animate={reduceMotion ? { opacity: 0 } : { 
                opacity: [1, 0.8, 0], 
                y: [0, 10, -20], 
                filter: ['blur(0px)', 'url(#moon-ripple-glass) blur(3px)', 'url(#moon-ripple-glass) blur(12px)'],
                scaleY: [1, 1.15, 0.85],
                scaleX: [1, 1.05, 1.1]
              }}
              transition={{ duration: 4, delay: i * 0.15, ease: "easeInOut" }}
              className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide inline-block"
              style={{ color, textShadow: `0 0 20px ${color}, 0 0 40px rgba(255,255,255,0.4)` }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      )}
    </div>
  );
};

const BlackHole3D = ({ color }: { color: string }) => {
  const diskRef = useRef<THREE.Mesh>(null);
  const baseColor = useMemo(() => new THREE.Color(color), [color]);
  const hotColor = useMemo(() => new THREE.Color('#ffffff'), []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: baseColor },
    uHotColor: { value: hotColor }
  }), [baseColor, hotColor]);

  useFrame((state) => {
    if (diskRef.current) {
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime;
      diskRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group rotation={[Math.PI / 2.5, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={diskRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 6, 128]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            varying float vRadius;
            varying float vAngle;
            void main() {
              vUv = uv;
              vRadius = length(position.xy);
              vAngle = atan(position.y, position.x);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColor;
            uniform vec3 uHotColor;
            varying vec2 vUv;
            varying float vRadius;
            varying float vAngle;

            float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
            float noise (in vec2 st) {
                vec2 i = floor(st); vec2 f = fract(st);
                float a = random(i); float b = random(i + vec2(1.0, 0.0));
                float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
                vec2 u = f*f*(3.0-2.0*f);
                return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }

            void main() {
              float normalizedRadius = smoothstep(1.7, 6.0, vRadius);
              float spiral = vAngle * 4.0 - (1.0 / (normalizedRadius + 0.1)) * 3.0;
              
              vec2 noiseUv = vec2(vRadius * 2.0 - uTime * 0.5, spiral + uTime * 0.5);
              float n = noise(noiseUv * 3.0) * 0.5 + noise(noiseUv * 6.0) * 0.25;
              
              vec3 finalColor = mix(uHotColor, uColor, normalizedRadius + n * 0.5);
              
              float alpha = (1.0 - normalizedRadius) * (0.3 + n * 0.7);
              alpha *= smoothstep(1.7, 2.0, vRadius); 
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
};

// 18. Vortex Consume (Nebula Vortex)
export const VortexConsume = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const color = getColor(theme);
  const words = isPreview ? [] : text.split(' ');

  return (
    <div className={isPreview ? "absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden" : "fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden"}>
      {!isPreview && !reduceMotion && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <BlackHole3D color={color} />
          </Canvas>
        </div>
      )}
      {!isPreview && (
        <div className="w-full max-w-3xl px-6 flex flex-wrap justify-center gap-x-3 gap-y-2 relative z-30">
          {words.map((word: string, i: number) => {
            const angle = (i / words.length) * Math.PI * 2;
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 1, rotate: 0, x: 0, y: 0 }}
                animate={reduceMotion ? { opacity: 0 } : { 
                  opacity: [1, 0.8, 0], 
                  scale: [1, 0.5, 0], 
                  rotate: [0, 180, 720],
                  x: [0, Math.cos(angle) * 100, 0],
                  y: [0, Math.sin(angle) * 100, 0],
                  filter: ['blur(0px)', 'blur(5px)', 'blur(15px)']
                }}
                transition={{ duration: 3, delay: i * 0.05, ease: "anticipate" }}
                className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide inline-block"
                style={{ color, textShadow: `0 0 10px ${color}` }}
              >
                {word}
              </motion.span>
            );
          })}
        </div>
      )}
    </div>
  );
};

// 19. Singularity Collapse (Event Horizon) - High Quality Version
export const SingularityCollapse = ({ text, theme, isPreview = false, reduceMotion = false }: any) => {
  const words = isPreview ? [] : text.split(' ');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isPreview || reduceMotion || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let discs: any[] = [];
    let lines: any[][] = [];
    let particles: any[] = [];
    let clip: any = {};
    let linesCanvas: HTMLCanvasElement | null = null;

    const startDisc = { x: 0, y: 0, w: 0, h: 0 };
    const endDisc = { x: 0, y: 0, w: 0, h: 0 };
    const particleArea = { sw: 0, ew: 0, h: 0, sx: 0, ex: 0 };

    const tweenValue = (start: number, end: number, p: number, ease: string = 'linear') => {
      const delta = end - start;
      const easeKey = ease !== 'linear' ? "ease" + ease.charAt(0).toUpperCase() + ease.slice(1) : "linear";
      const easeFn = (easingUtils && (easingUtils as any)[easeKey]) || ((x: number) => x);
      return start + delta * easeFn(p);
    };

    const tweenDisc = (disc: any) => {
      disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
      disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, "inExpo");
      disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
      disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);
      return disc;
    };

    const initParticle = (start = false) => {
      const sx = particleArea.sx + particleArea.sw * Math.random();
      const ex = particleArea.ex + particleArea.ew * Math.random();
      const dx = ex - sx;
      const y = start ? particleArea.h * Math.random() : particleArea.h;
      const r = 0.5 + Math.random() * 4;
      const vy = 0.5 + Math.random();
      return {
        x: sx, sx, dx, y, vy, p: 0, r,
        c: `rgba(255, 255, 255, ${Math.random()})`
      };
    };

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const dpi = window.devicePixelRatio || 1;

      canvas.width = width * dpi;
      canvas.height = height * dpi;

      startDisc.x = width * 0.5;
      startDisc.y = height * 0.45;
      startDisc.w = width * 0.75;
      startDisc.h = height * 0.7;

      endDisc.x = width * 0.5;
      endDisc.y = height * 0.95;
      endDisc.w = 0;
      endDisc.h = 0;

      discs = [];
      const totalDiscs = 100;
      let prevBottom = height;
      clip = {};

      for (let i = 0; i < totalDiscs; i++) {
        const p = i / totalDiscs;
        const disc = tweenDisc({ p });
        const bottom = disc.y + disc.h;
        if (bottom <= prevBottom) {
          clip = { disc: { ...disc }, i };
        }
        prevBottom = bottom;
        discs.push(disc);
      }

      clip.path = new Path2D();
      clip.path.ellipse(clip.disc.x, clip.disc.y, clip.disc.w, clip.disc.h, 0, 0, Math.PI * 2);
      clip.path.rect(clip.disc.x - clip.disc.w, 0, clip.disc.w * 2, clip.disc.y);

      // Lines
      lines = [];
      const totalLines = 100;
      const linesAngle = (Math.PI * 2) / totalLines;
      for (let i = 0; i < totalLines; i++) lines.push([]);

      discs.forEach((disc) => {
        for (let i = 0; i < totalLines; i++) {
          const angle = i * linesAngle;
          lines[i].push({
            x: disc.x + Math.cos(angle) * disc.w,
            y: disc.y + Math.sin(angle) * disc.h
          });
        }
      });

      linesCanvas = document.createElement('canvas');
      linesCanvas.width = width;
      linesCanvas.height = height;
      const lctx = linesCanvas.getContext('2d');
      if (lctx) {
        lines.forEach((line) => {
          lctx.save();
          let lineIsIn = false;
          line.forEach((p1, j) => {
            if (j === 0) return;
            const p0 = line[j - 1];
            if (!lineIsIn && (lctx.isPointInPath(clip.path, p1.x, p1.y) || lctx.isPointInStroke(clip.path, p1.x, p1.y))) {
              lineIsIn = true;
            } else if (lineIsIn) {
              lctx.clip(clip.path);
            }
            lctx.beginPath();
            lctx.moveTo(p0.x, p0.y);
            lctx.lineTo(p1.x, p1.y);
            lctx.strokeStyle = "#444";
            lctx.lineWidth = 2;
            lctx.stroke();
            lctx.closePath();
          });
          lctx.restore();
        });
      }

      // Particles
      particleArea.sw = clip.disc.w * 0.5;
      particleArea.ew = clip.disc.w * 2;
      particleArea.h = height * 0.85;
      particleArea.sx = (width - particleArea.sw) / 2;
      particleArea.ex = (width - particleArea.ew) / 2;

      particles = [];
      for (let i = 0; i < 100; i++) particles.push(initParticle(true));
    };

    const tick = () => {
      const dpi = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpi, dpi);

      // Move
      discs.forEach((disc) => {
        disc.p = (disc.p + 0.001) % 1;
        tweenDisc(disc);
      });

      particles.forEach((particle) => {
        particle.p = 1 - particle.y / particleArea.h;
        particle.x = particle.sx + particle.dx * particle.p;
        particle.y -= particle.vy;
        if (particle.y < 0) {
          const newP = initParticle();
          Object.assign(particle, newP);
        }
      });

      // Draw
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(startDisc.x, startDisc.y, startDisc.w, startDisc.h, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.closePath();

      discs.forEach((disc, i) => {
        if (i % 5 !== 0) return;
        if (disc.w < clip.disc.w - 5) {
          ctx.save();
          ctx.clip(clip.path);
        }
        ctx.beginPath();
        ctx.ellipse(disc.x, disc.y, disc.w, disc.h, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        if (disc.w < clip.disc.w - 5) ctx.restore();
      });

      if (linesCanvas) ctx.drawImage(linesCanvas, 0, 0);

      ctx.save();
      ctx.clip(clip.path);
      particles.forEach((particle) => {
        ctx.fillStyle = particle.c;
        ctx.beginPath();
        ctx.rect(particle.x, particle.y, particle.r, particle.r);
        ctx.fill();
        ctx.closePath();
      });
      ctx.restore();

      ctx.restore();
      animationFrameId = requestAnimationFrame(tick);
    };

    setup();
    tick();

    const handleResize = () => {
      setup();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPreview, reduceMotion]);

  return (
    <div className={isPreview ? "absolute inset-0 z-0 overflow-hidden" : "fixed inset-0 z-[100] overflow-hidden bg-[#141414] black-hole-container"}>
      {/* Aura and Overlays */}
      <div className="absolute inset-0 pointer-events-none">
         {/* Aura Glow */}
         <div className="black-hole-aura" />
         {/* Scanline Overlay */}
         <div className="black-hole-overlay" />
      </div>

      {!isPreview && !reduceMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[4] w-full h-full"
        />
      )}

      {/* Text Content */}
      {!isPreview && (
        <div className="absolute inset-0 z-[20] flex items-center justify-center pointer-events-none" style={{ perspective: '1200px' }}>
          <motion.div 
            initial={{ opacity: 0, scale: 1.2, z: 100, rotateX: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scaleX: [1.2, 1, 0.1, 0],
              scaleY: [1.2, 1, 0.4, 0],
              y: [0, 0, 150, 500],
              z: [100, 0, -400, -1500],
              rotateX: [0, 0, 25, 75],
              filter: ['blur(0px)', 'blur(0px)', 'blur(2px)', 'blur(15px)']
            }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="w-full max-w-4xl px-6 flex flex-wrap justify-center gap-x-4 gap-y-3"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {words.map((word: string, i: number) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, filter: 'blur(10px)', y: -20 }}
                animate={{ 
                  opacity: 1,
                  filter: 'blur(0px)',
                  y: 0
                }}
                transition={{ duration: 1, delay: i * 0.08 }}
                className="text-2xl md:text-4xl lg:text-5xl font-serif tracking-wide inline-block text-white"
                style={{ 
                  textShadow: `0 0 25px rgba(255,255,255,0.7)`,
                  backfaceVisibility: 'hidden'
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};
