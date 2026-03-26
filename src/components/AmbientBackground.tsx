import React, { useRef, useEffect } from 'react';
import { Waves, Mountain, Sparkles, Orbit, Grid3X3, Diamond, Layers } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Theme = 'liquidGlass' | 'cinematicNoir' | 'auroraGlow' | 'minimalLuxury' | 'futuristicEditorial' | 'softHolographic' | 'deepSpace' | 'stardust' | 'retroGrid' | 'auroraBorealis' | 'sereneLandscape' | 'obsidian' | 'nebula' | 'void' | 'midnight' | 'crimson' | 'ethereal' | 'abyss' | 'nebulaVortex' | 'midnightSanctuary' | 'nocturnalHaven' | 'urbanSolitude' | 'felineVigil' | 'transitEchoes' | 'twilightLofi' | 'sunsetDrift' | 'woodlandRetreat' | 'oceanicHorizon' | 'cascadingSerenity' | 'snowboundSilence' | 'urbanEchoes' | 'sunsetVigil' | 'neonPulse' | 'celestialWhispers' | 'galacticBloom' | 'lunarTide';

export const THEMES: Record<Theme, { bg: string, accent: string, text: string, name: string, isPro: boolean, isOld?: boolean, isLive?: boolean, videoUrl?: string, audioUrl?: string, volume?: number, filter?: string, zoom?: boolean, playbackRate?: number, isGif?: boolean, noOverlay?: boolean, icon: React.ReactNode }> = {
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

export const AmbientBackground = ({ theme, reduceMotion = false, isEcoMode = false }: { theme: Theme, reduceMotion?: boolean, isEcoMode?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !THEMES[theme].audioUrl) return;

    audio.volume = THEMES[theme].volume ?? 1;

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
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        {THEMES[theme].audioUrl && (
          <audio ref={audioRef} src={THEMES[theme].audioUrl} loop />
        )}
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

      {/* Dynamic Gradients for Non-Live Themes */}
      {!THEMES[theme].isLive && (
        <div 
          className="absolute inset-0 transition-colors duration-1000"
          style={{ 
            background: `radial-gradient(circle at 30% 30%, ${colors[0]} 0%, transparent 70%),
                         radial-gradient(circle at 70% 70%, ${colors[1]} 0%, transparent 70%),
                         radial-gradient(circle at 50% 50%, ${colors[2]} 0%, transparent 100%),
                         ${colors[3]}`
          }}
        />
      )}

      {/* High contrast noise overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      
      {THEMES[theme].audioUrl && (
        <audio ref={audioRef} src={THEMES[theme].audioUrl} loop />
      )}
    </div>
  );
};
