import React from 'react';
import { motion } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
}

interface TypingParticlesProps {
  particles: Particle[];
}

export const TypingParticles = React.memo(({ particles }: TypingParticlesProps) => {
  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 0, x: p.x, y: p.y }}
          animate={{ opacity: 0, scale: 2, y: p.y - 50 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="fixed w-1 h-1 rounded-full bg-white/50 pointer-events-none z-50 blur-[1px]"
        />
      ))}
    </>
  );
});

TypingParticles.displayName = 'TypingParticles';
