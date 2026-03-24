import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, Sparkles, History, Eye } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useLanguage } from '../contexts/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RitualMode = 'heavy' | 'mist' | 'echo' | 'standard' | 'oracle';

export const RITUAL_MODES: Record<RitualMode, { name: string, description: string, icon: React.ReactNode }> = {
  standard: { name: 'Standard', description: 'The classic void experience.', icon: <Zap className="w-4 h-4" /> },
  heavy: { name: 'Heavy Lift', description: 'For deep trauma or intense anger.', icon: <Activity className="w-4 h-4" /> },
  mist: { name: 'Morning Mist', description: 'For light anxieties and brain fog.', icon: <Sparkles className="w-4 h-4" /> },
  echo: { name: 'Midnight Echo', description: 'For secrets and things unsaid.', icon: <History className="w-4 h-4" /> },
  oracle: { name: 'The Oracle', description: 'Seek guidance from the void.', icon: <Eye className="w-4 h-4" /> },
};

interface RitualSelectorProps {
  ritualMode: RitualMode;
  setRitualMode: (mode: RitualMode) => void;
  isZenMode: boolean;
  themeAccent: string;
}

export const RitualSelector = React.memo(({ ritualMode, setRitualMode, isZenMode, themeAccent }: RitualSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className={cn(
      "flex flex-wrap justify-center gap-2 mb-8 transition-all duration-700",
      isZenMode ? "opacity-0 pointer-events-none -translate-y-4" : "opacity-100"
    )}>
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
              "px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 border",
              ritualMode === mode 
                ? `bg-${themeAccent}-500/20 border-${themeAccent}-500/50 text-${themeAccent}-200 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:border-white/20"
            )}
          >
            {RITUAL_MODES[mode].icon}
            {ritualName}
          </button>
        );
      })}
    </div>
  );
});

RitualSelector.displayName = 'RitualSelector';
