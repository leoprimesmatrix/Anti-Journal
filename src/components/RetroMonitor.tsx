import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Power, Radio } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CHANNELS = [
  { id: 0, name: 'STATIC' },
  { id: 1, name: 'GEOMETRY' },
  { id: 2, name: 'OSCILLOSCOPE' },
  { id: 3, name: 'THE VOID' },
];

export default function RetroMonitor() {
  const [isOn, setIsOn] = useState(false);
  const [channel, setChannel] = useState(1);
  const [isSwitching, setIsSwitching] = useState(false);
  const [powerPhase, setPowerPhase] = useState<'off' | 'starting' | 'on' | 'stopping'>('off');

  // Handle Power Toggle
  const togglePower = () => {
    if (powerPhase === 'off') {
      setPowerPhase('starting');
      setTimeout(() => {
        setPowerPhase('on');
        setIsOn(true);
      }, 400);
    } else if (powerPhase === 'on') {
      setPowerPhase('stopping');
      setIsOn(false);
      setTimeout(() => {
        setPowerPhase('off');
      }, 400);
    }
  };

  // Handle Channel Switch
  const changeChannel = () => {
    if (!isOn || powerPhase !== 'on') return;
    setIsSwitching(true);
    setTimeout(() => {
      setChannel((prev) => (prev + 1) % CHANNELS.length);
      setIsSwitching(false);
    }, 300); // Glitch duration
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-8 font-mono selection:bg-white/20">
      {/* Background Ambient Glow */}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
          isOn ? "opacity-30" : "opacity-0"
        )}
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(100, 200, 255, 0.1) 0%, transparent 60%)'
        }}
      />

      {/* Physical TV Casing */}
      <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-[16/10] bg-[#1a1a1a] rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_1px_rgba(255,255,255,0.1),inset_0_-4px_10px_rgba(0,0,0,0.5)] border border-[#2a2a2a] flex flex-col md:flex-row gap-6 md:gap-8 z-10">
        
        {/* Screen Bezel */}
        <div className="flex-1 relative bg-[#050505] rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-4 shadow-[inset_0_0_20px_rgba(0,0,0,1),0_2px_4px_rgba(255,255,255,0.05)] border border-[#111]">
          
          {/* The CRT Glass Surface */}
          <div className="relative w-full h-full bg-[#080808] rounded-[1rem] md:rounded-[1.5rem] overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]">
            
            {/* Screen Content Wrapper (Handles Power Animation) */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black origin-center"
              initial={{ scaleY: 0.005, scaleX: 0, opacity: 0 }}
              animate={
                powerPhase === 'off' ? { scaleY: 0.005, scaleX: 0, opacity: 0 } :
                powerPhase === 'starting' ? { scaleY: 0.005, scaleX: 1, opacity: 1 } :
                powerPhase === 'on' ? { scaleY: 1, scaleX: 1, opacity: 1 } :
                { scaleY: 0.005, scaleX: 1, opacity: 1 } // stopping
              }
              transition={{ 
                duration: powerPhase === 'starting' || powerPhase === 'stopping' ? 0.2 : 0.3,
                ease: "easeInOut"
              }}
            >
              {/* Actual Content */}
              {isOn && (
                <div className={cn(
                  "w-full h-full relative",
                  isSwitching ? "animate-[rgb-split_0.3s_ease-in-out]" : ""
                )}>
                  
                  {/* Channel Content */}
                  <ChannelDisplay channel={channel} isSwitching={isSwitching} />

                  {/* OSD (On Screen Display) */}
                  <div className="absolute top-6 right-8 text-[#0f0] text-2xl md:text-4xl font-bold opacity-80 mix-blend-screen drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">
                    CH {channel.toString().padStart(2, '0')}
                  </div>
                  <div className="absolute top-6 left-8 text-[#0f0] text-xl md:text-2xl font-bold opacity-80 mix-blend-screen drop-shadow-[0_0_8px_rgba(0,255,0,0.8)] uppercase tracking-widest">
                    {isSwitching ? 'TUNE...' : 'PLAY'}
                  </div>

                </div>
              )}
            </motion.div>

            {/* CRT Overlays (Always visible, even when off, but subtle) */}
            
            {/* 1. Scanlines */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay"
                 style={{
                   background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                   backgroundSize: '100% 4px, 6px 100%'
                 }}
            />
            
            {/* 2. Vignette */}
            <div className="absolute inset-0 pointer-events-none z-30"
                 style={{
                   background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.6) 100%)'
                 }}
            />

            {/* 3. Glass Reflection */}
            <div className="absolute inset-0 pointer-events-none z-40 rounded-[1rem] md:rounded-[1.5rem]"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 100%)'
                 }}
            />

            {/* 4. Scrolling Scanline */}
            {isOn && (
              <motion.div 
                className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none z-20"
                animate={{ y: ['-100%', '2000%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-full md:w-48 bg-[#222] rounded-2xl p-6 flex flex-row md:flex-col items-center justify-between md:justify-start gap-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] border border-[#333]">
          
          {/* Speaker Grill */}
          <div className="hidden md:flex flex-col gap-2 w-full mb-8 opacity-50">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-1.5 w-full bg-[#111] rounded-full shadow-[inset_0_1px_2px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.1)]" />
            ))}
          </div>

          {/* Power Button */}
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={togglePower}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_0_rgba(255,255,255,0.2)] border-2",
                isOn 
                  ? "bg-[#2a2a2a] border-[#444] shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] translate-y-1" 
                  : "bg-[#333] border-[#555] hover:bg-[#3a3a3a]"
              )}
            >
              <Power className={cn("w-6 h-6 transition-colors duration-300", isOn ? "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "text-[#888]")} />
            </button>
            <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold">Power</span>
          </div>

          {/* Channel Dial */}
          <div className="flex flex-col items-center gap-3">
            <button 
              onClick={changeChannel}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-[#444] to-[#222] flex items-center justify-center shadow-[0_8px_15px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)] border border-[#111] active:scale-95 transition-transform group"
            >
              <div className="w-14 h-14 rounded-full bg-[#1a1a1a] shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)] flex items-center justify-center relative">
                {/* Dial Indicator */}
                <motion.div 
                  className="absolute w-2 h-2 bg-white/50 rounded-full top-2"
                  animate={{ rotate: channel * 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ originY: '24px' }} // Center of the 14x14 (56px) circle
                />
                <Radio className="w-5 h-5 text-[#555] group-hover:text-[#888] transition-colors" />
              </div>
            </button>
            <span className="text-[10px] text-[#666] uppercase tracking-widest font-bold">Tune</span>
          </div>

        </div>
      </div>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes rgb-split {
          0% { text-shadow: -4px 0 red, 4px 0 blue; transform: scale(1.02) translateY(2%); filter: contrast(200%) brightness(150%); }
          50% { text-shadow: 4px 0 red, -4px 0 blue; transform: scale(0.98) translateY(-2%); filter: contrast(50%) brightness(50%); }
          100% { text-shadow: 0 0 red, 0 0 blue; transform: scale(1) translateY(0); filter: contrast(100%) brightness(100%); }
        }
        @keyframes static-noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
      `}} />
    </div>
  );
}

// --- Channel Content Components ---

function ChannelDisplay({ channel, isSwitching }: { channel: number, isSwitching: boolean }) {
  if (isSwitching) {
    return <StaticNoise />;
  }

  switch (channel) {
    case 0:
      return <StaticNoise />;
    case 1:
      return <GeometryChannel />;
    case 2:
      return <OscilloscopeChannel />;
    case 3:
      return <VoidChannel />;
    default:
      return <StaticNoise />;
  }
}

function StaticNoise() {
  return (
    <div className="w-full h-full overflow-hidden relative bg-[#111]">
      <div 
        className="absolute inset-[-50%] opacity-40 mix-blend-screen animate-[static-noise_0.2s_infinite_steps(2)]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/50 text-2xl tracking-[1em] font-bold mix-blend-overlay">NO SIGNAL</span>
      </div>
    </div>
  );
}

function GeometryChannel() {
  return (
    <div className="w-full h-full bg-[#050510] flex items-center justify-center relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20"
           style={{
             backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
             backgroundSize: '40px 40px',
             transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
             transformOrigin: 'top center'
           }}
      />
      
      {/* 3D Wireframe Cube */}
      <motion.div 
        className="relative w-48 h-48"
        animate={{ rotateX: 360, rotateY: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {[
          { rotateY: 0, translateZ: 96 },
          { rotateY: 90, translateZ: 96 },
          { rotateY: 180, translateZ: 96 },
          { rotateY: -90, translateZ: 96 },
          { rotateX: 90, translateZ: 96 },
          { rotateX: -90, translateZ: 96 },
        ].map((transform, i) => (
          <div 
            key={i}
            className="absolute inset-0 border-2 border-[#0ff] bg-[#0ff]/5 shadow-[0_0_15px_#0ff,inset_0_0_15px_#0ff]"
            style={{ 
              transform: `${transform.rotateY ? `rotateY(${transform.rotateY}deg)` : ''} ${transform.rotateX ? `rotateX(${transform.rotateX}deg)` : ''} translateZ(${transform.translateZ}px)`,
              backfaceVisibility: 'visible'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function OscilloscopeChannel() {
  return (
    <div className="w-full h-full bg-[#001100] flex items-center justify-center relative">
      {/* Grid */}
      <div className="absolute inset-0 opacity-30"
           style={{
             backgroundImage: 'linear-gradient(#0f0 1px, transparent 1px), linear-gradient(90deg, #0f0 1px, transparent 1px)',
             backgroundSize: '20px 20px',
             backgroundPosition: 'center center'
           }}
      />
      
      {/* Sine Wave */}
      <svg className="w-full h-full absolute inset-0" preserveAspectRatio="none" viewBox="0 0 1000 200">
        <motion.path
          d="M 0 100 Q 125 0, 250 100 T 500 100 T 750 100 T 1000 100"
          fill="transparent"
          stroke="#0f0"
          strokeWidth="4"
          className="drop-shadow-[0_0_8px_#0f0]"
          animate={{
            d: [
              "M 0 100 Q 125 0, 250 100 T 500 100 T 750 100 T 1000 100",
              "M 0 100 Q 125 200, 250 100 T 500 100 T 750 100 T 1000 100",
              "M 0 100 Q 125 0, 250 100 T 500 100 T 750 100 T 1000 100"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 0 100 Q 125 200, 250 100 T 500 100 T 750 100 T 1000 100"
          fill="transparent"
          stroke="#0f0"
          strokeWidth="2"
          opacity="0.5"
          className="drop-shadow-[0_0_4px_#0f0]"
          animate={{
            d: [
              "M 0 100 Q 125 200, 250 100 T 500 100 T 750 100 T 1000 100",
              "M 0 100 Q 125 0, 250 100 T 500 100 T 750 100 T 1000 100",
              "M 0 100 Q 125 200, 250 100 T 500 100 T 750 100 T 1000 100"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

function VoidChannel() {
  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.2)_0%,transparent_50%)]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.h1 
        className="text-4xl md:text-6xl text-red-600 font-bold tracking-[0.5em] text-center mix-blend-screen drop-shadow-[0_0_15px_red]"
        animate={{ filter: ['blur(2px)', 'blur(0px)', 'blur(2px)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        THE VOID
      </motion.h1>
      <motion.p
        className="mt-4 text-red-500/50 tracking-[1em] text-sm"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        IS LISTENING
      </motion.p>
    </div>
  );
}
