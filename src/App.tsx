/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AntiJournal from './components/AntiJournal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-1 h-1 rounded-full bg-white/20 animate-ping" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {user ? <AntiJournal /> : <Hero />}
    </ErrorBoundary>
  );
}
