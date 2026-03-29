/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AntiJournal, { Theme } from './components/AntiJournal';
import AdminPanel from './components/AdminPanel';
import RetroMonitor from './components/RetroMonitor';
import { ErrorBoundary } from './components/ErrorBoundary';
import { auth, db } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, ShieldOff, LogOut, Shield } from 'lucide-react';
import { signOut } from 'firebase/auth';

interface UserProfile {
  approved: boolean;
  isBanned: boolean;
  email: string;
  tier: string;
  role?: string;
  theme?: Theme;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [hashRoute, setHashRoute] = useState(window.location.hash);
  const [isEcoMode, setIsEcoMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const isAdmin = user && adminEmail && user.email === adminEmail;

  useEffect(() => {
    // Auto-detect mobile for Eco Mode
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
      setIsEcoMode(true);
      setReduceMotion(true);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => setHashRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isAdmin && profile && profile.role !== 'admin' && user) {
      const userRef = doc(db, 'users', user.uid);
      updateDoc(userRef, { role: 'admin' }).catch(err => console.error('Failed to update admin role:', err));
    }
  }, [isAdmin, profile, user]);

  useEffect(() => {
    // Fetch admin email from server config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.contactEmail) {
          setAdminEmail(data.contactEmail);
        }
      })
      .catch(err => console.error('Failed to fetch config:', err));

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Check if profile exists, if not create it
        const userRef = doc(db, 'users', currentUser.uid);
        
        // Use onSnapshot to listen for approval/ban changes in real-time
        const unsubProfile = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            // Create initial profile
            const newProfile: UserProfile = {
              email: currentUser.email || '',
              tier: 'free',
              approved: true, // Auto-approve for public launch
              isBanned: false,
            };
            
            try {
              await setDoc(userRef, {
                ...newProfile,
                totalReleases: 0,
                dailyReleases: 0,
                lastDailyUpdate: Date.now(),
                monthlyReleases: 0,
                lastMonthlyUpdate: Date.now(),
                theme: 'void',
                updatedAt: serverTimestamp(),
              });
              setProfile(newProfile);
            } catch (error) {
              console.error("Error creating profile:", error);
            }
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to profile:", error);
          setLoading(false);
        });

        return () => unsubProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowAdmin(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-white/20 animate-ping" />
      </div>
    );
  }

  if (hashRoute === '#tv') {
    return <RetroMonitor />;
  }

  // Admin View
  if (isAdmin && showAdmin) {
    return (
      <ErrorBoundary>
        <AdminPanel onBack={() => setShowAdmin(false)} />
      </ErrorBoundary>
    );
  }

  // Banned View
  if (user && profile?.isBanned) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-md w-full liquid-glass p-12 rounded-[40px] border border-red-500/20 text-center space-y-8">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
            <ShieldOff className="w-10 h-10 text-red-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-display tracking-tight">Access Revoked</h1>
            <p className="text-white/40 leading-relaxed">
              Your access to the Anti-Journal protocol has been suspended due to violations of the void's silence.
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {user ? (
        <AntiJournal isAdmin={isAdmin} onShowAdmin={() => setShowAdmin(true)} />
      ) : (
        <Hero />
      )}
    </ErrorBoundary>
  );
}
