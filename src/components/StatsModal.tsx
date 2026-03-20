import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Activity, User, Diamond } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsModalProps {
  showStats: boolean;
  setShowStats: (show: boolean) => void;
  monthlyCount: number;
  userData: any;
  dailyCount: number;
  setShowProModal: (show: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
}

export const StatsModal: React.FC<StatsModalProps> = React.memo(({
  showStats,
  setShowStats,
  monthlyCount,
  userData,
  dailyCount,
  setShowProModal,
  reduceMotion,
  setReduceMotion
}) => {
  const monthName = useMemo(() => new Date().toLocaleString('default', { month: 'long' }), []);

  return (
    <AnimatePresence>
      {showStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowStats(false)}
            className="absolute inset-0 bg-black/90"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[32px] border border-white/10 bg-[#0A0A0A] shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] animate-pulse" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h2 className="text-4xl font-light tracking-tight text-white serif">
                  Insights <span className="italic opacity-50">&</span> Settings
                </h2>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/40 font-medium">
                  Personal Archive • Configuration
                </p>
              </div>
              <button
                onClick={() => setShowStats(false)}
                className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors group"
              >
                <X className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                <div className="lg:col-span-5 space-y-10">
                  <section>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6 flex items-center gap-2">
                      <Activity className="w-3 h-3" />
                      Monthly Overview
                    </h3>
                    <div className="space-y-4">
                      <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all duration-500">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_70%)] rounded-full group-hover:bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] transition-colors duration-700" />
                        
                        <div className="relative z-10">
                          <div className="flex items-baseline gap-3">
                            <span className="text-6xl font-light tracking-tighter text-white mono">
                              {monthlyCount}
                            </span>
                            <span className="text-sm text-white/40 uppercase tracking-wider font-medium">
                              Fragments
                            </span>
                          </div>
                          <p className="mt-4 text-xs text-white/40 leading-relaxed font-light">
                            Your emotional clearance for <span className="text-white/60 font-medium">{monthName}</span>.
                          </p>
                          <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Consistent Progress</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                          <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Lifetime</span>
                          <span className="text-2xl font-light text-white mono">{userData.totalReleases}</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                          <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 font-bold">Today</span>
                          <span className="text-2xl font-light text-white mono">{dailyCount}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-6 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      Account Status
                    </h3>
                    <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">Current Tier</span>
                            <span className={cn(
                              "text-lg font-bold uppercase tracking-[0.2em]",
                              userData.tier === 'pro' ? "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400" : "text-white/80"
                            )}>
                              {userData.tier}
                            </span>
                          </div>
                          <div className={cn(
                            "p-3 rounded-2xl border",
                            userData.tier === 'pro' ? "bg-indigo-500/10 border-indigo-500/20" : "bg-white/5 border-white/10"
                          )}>
                            {userData.tier === 'pro' ? <Diamond className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-white/40" />}
                          </div>
                        </div>
                        
                        {userData.tier === 'free' ? (
                          <button 
                            onClick={() => { setShowStats(false); setShowProModal(true); }}
                            className="w-full py-4 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                          >
                            Unlock Pro Access
                          </button>
                        ) : (
                          <div className="py-3 px-4 rounded-xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Pro Member</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>

                <div className="lg:col-span-7 space-y-12">
                  <section>
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">
                        Visual Preferences
                      </h3>
                      <div className="flex items-center gap-4 p-1 rounded-full bg-white/5 border border-white/5">
                        <span className="pl-4 text-[10px] uppercase tracking-widest text-white/40 font-bold">Reduce Motion</span>
                        <button
                          onClick={() => setReduceMotion(!reduceMotion)}
                          className={cn(
                            "w-12 h-6 rounded-full transition-colors relative",
                            reduceMotion ? "bg-emerald-500" : "bg-white/10"
                          )}
                        >
                          <motion.div 
                            className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white"
                            animate={{ x: reduceMotion ? 24 : 0 }}
                          />
                        </button>
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
  );
});
