import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Zap, Target, Heart, X, Check, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useLanguage, Language } from '../contexts/LanguageContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKGROUND_VIDEOS = [
  'https://files.catbox.moe/ckw6ym.mp4', // Midnight Sanctuary
  'https://files.catbox.moe/oj4c2s.mp4', // Nocturnal Haven
  'https://files.catbox.moe/r688ph.mp4', // Urban Solitude
  'https://files.catbox.moe/80u912.mp4', // Feline Vigil
  'https://files.catbox.moe/wba8j2.mp4', // Transit Echoes
  'https://files.catbox.moe/e6p8m1.mp4', // Twilight Lo-Fi
  'https://files.catbox.moe/0ksawe.mp4', // Sunset Drift
  'https://files.catbox.moe/129ue0.mp4', // Woodland Retreat
  'https://files.catbox.moe/ekvzk3.mp4', // Oceanic Horizon
  'https://files.catbox.moe/a1dso1.mp4'  // Nebula Vortex
];

const Hero = () => {
  const { t, language, setLanguage } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [videoSource] = useState(() => BACKGROUND_VIDEOS[Math.floor(Math.random() * BACKGROUND_VIDEOS.length)]);
  
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
      // Only slow down Nebula Vortex (a1dso1.mp4)
      const isNebulaVortex = videoSource === 'https://files.catbox.moe/a1dso1.mp4';
      const speed = isNebulaVortex ? 0.5 : 1.0;
      
      video.playbackRate = speed;
      video.muted = true;
      video.playsInline = true;
      video.defaultPlaybackRate = speed;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (err) {
          console.warn("Video autoplay was prevented.", err);
        }
      };
      
      playVideo();
    }
  }, [videoSource]);

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
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm text-white hover:text-white/80 transition-colors">{t.navHome}</button>
          <button onClick={() => scrollToSection(featuresRef)} className="text-sm text-white/60 hover:text-white transition-colors">{t.navFeatures}</button>
          <button onClick={() => scrollToSection(missionRef)} className="text-sm text-white/60 hover:text-white transition-colors">{t.navMission}</button>
          <button onClick={() => scrollToSection(philosophyRef)} className="text-sm text-white/60 hover:text-white transition-colors">{t.navPhilosophy}</button>
          {/* <button onClick={() => setIsPlansModalOpen(true)} className="text-sm text-white/60 hover:text-white transition-colors">{t.navPlans}</button> */}
          
          {/* Language Switcher */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Globe className="w-3.5 h-3.5 text-white/40" />
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-[11px] text-white/60 outline-none cursor-pointer hover:text-white transition-colors uppercase tracking-widest font-bold"
            >
              <option value="en" className="bg-black">EN</option>
              <option value="es" className="bg-black">ES</option>
              <option value="ko" className="bg-black">KO</option>
              <option value="ja" className="bg-black">JA</option>
              <option value="zh" className="bg-black">ZH</option>
              <option value="fr" className="bg-black">FR</option>
              <option value="de" className="bg-black">DE</option>
            </select>
          </div>
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
          {t.requestAccess}
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
          src={videoSource}
        />
        <div className="absolute inset-0 bg-black/40 z-[1]" /> {/* Slight darkening for text readability */}

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <h1 className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] font-display font-normal text-white">
            {t.heroTitle} <em className="not-italic text-white/60">{t.heroSubtitle}</em>
          </h1>
          
          <p className="animate-fade-rise-delay text-white/60 text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans">
            {t.heroDescription}
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
            {t.heroCTA}
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
                <span>{t.featuresLabel}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                {t.featuresTitle}<br/>
                <span className="text-white/50">{t.featuresSubtitle}</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                {t.featuresDescription}
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  t.feature1,
                  t.feature2,
                  t.feature3
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
                <span>{t.missionLabel}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                {t.missionTitle}<br/>
                <span className="text-white/50">{t.missionSubtitle}</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                {t.missionDescription}
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
                <span>{t.goalLabel}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                {t.goalTitle}<br/>
                <span className="text-white/50">{t.goalSubtitle}</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                {t.goalDescription}
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
                <span>{t.philosophyLabel}</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display leading-tight">
                {t.philosophyTitle}<br/>
                <span className="text-white/50">{t.philosophySubtitle}</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-md">
                {t.philosophyDescription}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Modal */}
      {/*
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
                <h3 className="text-3xl md:text-4xl font-display mb-4">{t.plansTitle}</h3>
                <p className="text-white/60 max-w-xl mx-auto">
                  {t.plansSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 text-left">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col">
                  <div className="mb-8">
                    <h4 className="text-xl font-display mb-2">{t.planFreeName}</h4>
                    <div className="text-3xl font-sans font-light mb-2">{t.planFreePrice}</div>
                    <p className="text-sm text-white/60">{t.planFreeDesc}</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>{t.planFreeFeature1}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>{t.planFreeFeature2}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>{t.planFreeFeature3}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                      <span>{t.planFreeFeature4}</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => { setIsPlansModalOpen(false); handleLogin(); }}
                    className="w-full py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    {t.planFreeCTA}
                  </button>
                </div>

                <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] uppercase tracking-widest py-1 px-3 rounded-bl-lg font-bold">
                    {t.recommended}
                  </div>
                  <div className="mb-8">
                    <h4 className="text-xl font-display mb-2 text-indigo-300">{t.planProName}</h4>
                    <div className="text-3xl font-sans font-light mb-2">{t.planProPrice}</div>
                    <p className="text-sm text-white/60">{t.planProDesc}</p>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{t.planProFeature1}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{t.planProFeature2}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{t.planProFeature3}</span>
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/80">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{t.planProFeature4}</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => { setIsPlansModalOpen(false); handleLogin(); }}
                    className="w-full py-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] cursor-pointer"
                  >
                    {t.planProCTA}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      */}

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-display text-white flex items-center gap-4">
            <span>Anti-Journal<sup className="text-xs">®</sup></span>
            <a href="#tv" className="text-[10px] text-white/10 hover:text-white/40 transition-colors uppercase tracking-widest font-sans">
              [Monitor]
            </a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} {t.footerCopyright}</p>
            <p>{t.footerTagline}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;

