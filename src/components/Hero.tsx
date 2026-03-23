import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Target, Heart, X, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth, googleProvider, signInWithPopup } from '../firebase';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  
  // Nav scroll behavior
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  // Sections refs for scrolling
  const featuresRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const philosophyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5;
      video.muted = true;
      video.playsInline = true;
      video.defaultPlaybackRate = 0.5; // Ensure it stays at 0.5x even if reloaded
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.warn("Video autoplay was prevented.", err);
        }
      };
      
      playVideo();
    }
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/20 no-scrollbar">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: isNavVisible ? 0 : -100, opacity: isNavVisible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto"
      >
        <div className="text-3xl tracking-tight font-display text-white cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Anti-Journal<sup className="text-xs">®</sup>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white hover:text-white/80 transition-colors">Home</button>
          <button onClick={() => scrollToSection(featuresRef)} className="text-sm text-white/60 hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollToSection(missionRef)} className="text-sm text-white/60 hover:text-white transition-colors">Mission</button>
          <button onClick={() => scrollToSection(philosophyRef)} className="text-sm text-white/60 hover:text-white transition-colors">Philosophy</button>
          <button onClick={() => setIsPlansModalOpen(true)} className="text-sm text-white/60 hover:text-white transition-colors">Plans</button>
        </div>
        <button 
          onClick={handleLogin}
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white hover:scale-[1.03] transition-transform flex items-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Request Access
        </button>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 overflow-hidden">
        {/* Video Background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop"
          onLoadedData={() => setIsVideoLoaded(true)}
          className={cn(
            "absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000",
            isVideoLoaded ? "opacity-60" : "opacity-30"
          )}
          src="https://files.catbox.moe/a1dso1.mp4"
        />
        <div className="absolute inset-0 bg-black/40 z-[1]" /> {/* Slight darkening for text readability */}

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-display font-normal text-white">
            Where thoughts rise <em className="not-italic text-white/60">through the silence.</em>
          </h1>
          
          <p className="animate-fade-rise-delay text-white/60 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans">
            An anti-journal for the thoughts you don't want to keep. Speak your truth, watch it dissolve, and find peace in the silence. We build digital spaces for sharp focus and inspired release.
          </p>
          
          <button
            onClick={handleLogin}
            className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base text-white mt-12 hover:scale-[1.03] transition-transform cursor-pointer flex items-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Request Early Access
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-32 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-xs uppercase tracking-widest text-white/80">
                <Shield className="w-4 h-4" />
                <span>Features</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                Total Privacy.<br/>
                <span className="text-white/50">Absolute Freedom.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                Your words are never stored. They exist only long enough to be released. Experience unique 3D visual destructions of your heavy thoughts in a completely secure environment.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Zero-knowledge architecture",
                  "Instant cryptographic shredding",
                  "No tracking, no history"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2400&auto=format&fit=crop" 
                alt="Abstract privacy concept"
                className="w-full h-full object-cover rounded-2xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section (What Anti-Journal Is) */}
      <section ref={missionRef} className="py-32 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1 relative h-[600px] rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2400&auto=format&fit=crop" 
                alt="Abstract release concept"
                className="w-full h-full object-cover rounded-2xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-xs uppercase tracking-widest text-white/80">
                <Zap className="w-4 h-4" />
                <span>What it is</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                The Anti-Journal.<br/>
                <span className="text-white/50">A Digital Void.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                Unlike traditional journals designed to preserve memories, Anti-Journal is built to destroy them. It is a sanctuary for the thoughts that weigh you down, offering a cathartic release through beautiful, ephemeral interactions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="py-32 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-xs uppercase tracking-widest text-white/80">
                <Target className="w-4 h-4" />
                <span>Our Goal</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                Instant Catharsis.<br/>
                <span className="text-white/50">Mental Clarity.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                Our goal is to provide a safe, untraceable outlet for frustration, anxiety, and overwhelming thoughts. By visualizing the destruction of these thoughts, we help you achieve mental clarity and emotional reset.
              </p>
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2400&auto=format&fit=crop" 
                alt="Abstract clarity concept"
                className="w-full h-full object-cover rounded-2xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section (Why we care) */}
      <section ref={philosophyRef} className="py-32 px-6 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="order-2 lg:order-1 relative h-[600px] rounded-3xl overflow-hidden liquid-glass p-2">
              <div className="absolute inset-0 bg-black/50 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2400&auto=format&fit=crop" 
                alt="Abstract philosophy concept"
                className="w-full h-full object-cover rounded-2xl opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full liquid-glass text-xs uppercase tracking-widest text-white/80">
                <Heart className="w-4 h-4" />
                <span>Why We Care</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                Atmospheric.<br/>
                <span className="text-white/50">Empathetic Design.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                We believe that not everything needs to be saved. In a world obsessed with data retention, we champion the right to forget. We care about your mental space, designing cosmic themes to match your emotional state and facilitate letting go.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Modal */}
      <AnimatePresence>
        {isPlansModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPlansModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl liquid-glass p-8 rounded-3xl border border-white/10 overflow-hidden"
            >
              <button 
                onClick={() => setIsPlansModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-12 relative z-10">
                <h3 className="text-3xl md:text-4xl font-display mb-4">Choose Your Protocol</h3>
                <p className="text-white/60 max-w-xl mx-auto">
                  Begin your journey into the void. Upgrade to Pro for the ultimate release experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-left">
                {/* Free Plan */}
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
                  <div className="mb-8">
                    <h4 className="text-xl font-display mb-2">Initiate</h4>
                    <div className="text-3xl font-sans font-light mb-2">$0<span className="text-lg text-white/40">/forever</span></div>
                    <p className="text-sm text-white/60">The core anti-journaling experience.</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>Core release mechanics & hold-to-release</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>5 Base Themes (Stardust, Obsidian, Void, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>Standard destruction animations</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>End-to-end ephemeral architecture</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => { setIsPlansModalOpen(false); handleLogin(); }}
                    className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    Start Free
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase tracking-widest py-1 px-3 rounded-bl-lg font-bold">
                    Recommended
                  </div>
                  <div className="mb-8">
                    <h4 className="text-xl font-display mb-2 text-indigo-300">Pro Protocol</h4>
                    <div className="text-3xl font-sans font-light mb-2">$4.99<span className="text-lg text-white/40">/month</span></div>
                    <p className="text-sm text-white/60">Unlock the full cosmic void.</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Everything in Initiate</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>13+ Premium Themes (Liquid Glass, Nebula, Aurora, etc.)</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Advanced physics & destruction animations</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Exclusive ambient backgrounds & soundscapes</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => { setIsPlansModalOpen(false); handleLogin(); }}
                    className="w-full py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer"
                  >
                    Upgrade in App
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-display text-white">
            Anti-Journal<sup className="text-xs">®</sup>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} PrimeDev Studios. All rights reserved.</p>
            <p>A product of PrimeDev Studios &bull; Anti-Journaling Protocol</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;

