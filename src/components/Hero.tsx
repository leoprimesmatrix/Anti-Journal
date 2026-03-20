import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Shield, Zap, Moon } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../firebase';

const Hero = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      <main className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] text-purple-300/80 mb-4">
            <Sparkles className="w-3 h-3" />
            <span>The Infinite Awaits</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tight leading-tight">
            Release to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">Void.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 font-light max-w-2xl mx-auto leading-relaxed">
            An anti-journal for the thoughts you don't want to keep. 
            Speak your truth, watch it dissolve, and find peace in the silence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={handleLogin}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-blue-200 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
              Begin the Ritual
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          
          <p className="text-[10px] uppercase tracking-widest text-white/20">
            Secure Google Authentication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5"
        >
          <div className="space-y-2">
            <div className="flex justify-center mb-3">
              <Shield className="w-5 h-5 text-purple-400/60" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Total Privacy</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">Your words are never stored. They exist only long enough to be released.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-3">
              <Zap className="w-5 h-5 text-blue-400/60" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Instant Catharsis</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">Experience unique 3D visual destructions of your heavy thoughts.</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-3">
              <Moon className="w-5 h-5 text-slate-400/60" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Atmospheric</h3>
            <p className="text-[11px] text-white/40 leading-relaxed">Multiple cosmic themes designed to match your emotional state.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-[10px] text-white/10 uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Void Garden &bull; Anti-Journaling Protocol
        </p>
      </footer>
    </div>
  );
};

export default Hero;
