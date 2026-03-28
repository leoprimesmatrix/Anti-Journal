import React from 'react';
import { motion } from 'motion/react';
import { User, LogOut, Palette, Activity, Zap, TrendingUp, Twitter, Github } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlobalPulse } from './ReleaseAnimations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TopBarProps {
  user: any;
  userData: any;
  isZenMode: boolean;
  isDestroyed: boolean;
  onlineUsers: number;
  globalStats: any;
  onOpenTheme: () => void;
  onOpenHistory: () => void;
  onOpenStats: () => void;
  onSignOut: () => void;
  onSignIn: () => void;
  themeAccent: string;
}

export const TopBar = React.memo(({
  user,
  userData,
  isZenMode,
  isDestroyed,
  onlineUsers,
  globalStats,
  onOpenTheme,
  onOpenHistory,
  onOpenStats,
  onSignOut,
  onSignIn,
  themeAccent
}: TopBarProps) => {
  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 transition-all duration-1000",
      isZenMode ? "opacity-0 -translate-y-8 pointer-events-none" : "opacity-100 translate-y-0",
      isDestroyed ? "opacity-0 blur-md" : ""
    )}>
      <div className="flex items-center gap-6">
        <GlobalPulse 
          totalReleases={globalStats?.totalReleases || 0} 
          onlineUsers={onlineUsers}
        />
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button 
              onClick={onOpenStats}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="Stats"
            >
              <TrendingUp className="w-5 h-5" />
            </button>
            <button 
              onClick={onOpenHistory}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="History"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button 
              onClick={onOpenTheme}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="Themes"
            >
              <Palette className="w-5 h-5" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                {/*
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
                  {userData.tier === 'pro' ? 'Pro Member' : 'Free Tier'}
                </p>
                */}
                <p className="text-xs text-white/80 font-light">{user.displayName || 'User'}</p>
              </div>
              <button 
                onClick={onSignOut}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-red-400 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <button 
            onClick={onSignIn}
            className="px-6 py-2 rounded-full bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-white/90 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Sign In
          </button>
        )}
      </div>
    </div>
  );
});

TopBar.displayName = 'TopBar';
