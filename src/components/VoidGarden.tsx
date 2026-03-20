import React, { useMemo } from 'react';
import { motion } from 'motion/react';

export interface Fragment {
  id: string;
  type: 'seed' | 'crystal' | 'nebula' | 'orb';
  color: string;
  size: number;
  intensity: number;
  timestamp: number;
  ritualMode?: string;
}

interface VoidGardenProps {
  fragments: Fragment[];
  reduceMotion?: boolean;
}

export const VoidGarden: React.FC<VoidGardenProps> = ({ fragments, reduceMotion = false }) => {
  // Sort fragments by timestamp to ensure consistent rendering
  const sortedFragments = useMemo(() => {
    const sorted = [...fragments].sort((a, b) => a.timestamp - b.timestamp);
    // Limit fragments if reduceMotion is on
    return reduceMotion ? sorted.slice(-15) : sorted.slice(-40); // Limit total fragments to avoid clutter
  }, [fragments, reduceMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
      {sortedFragments.map((fragment, index) => {
        // Deterministic position based on ID
        const hash = fragment.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const left = (hash % 100) + '%';
        const top = ((hash * 13) % 100) + '%';
        const rotation = (hash * 7) % 360;
        
        // Smaller, more subtle sizing
        const baseSize = fragment.size * 0.8;

        return (
          <motion.div
            key={fragment.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.4, 
              scale: 1,
              x: reduceMotion ? 0 : [0, (hash % 30) - 15, 0],
              y: reduceMotion ? 0 : [0, ((hash * 3) % 30) - 15, 0],
              rotate: reduceMotion ? rotation : [rotation, rotation + 20, rotation]
            }}
            transition={{ 
              opacity: { duration: 3, delay: index * 0.1 },
              scale: { duration: 3, delay: index * 0.1 },
              x: { duration: 30 + (hash % 20), repeat: Infinity, ease: "linear" },
              y: { duration: 35 + (hash % 15), repeat: Infinity, ease: "linear" },
              rotate: { duration: 40 + (hash % 10), repeat: Infinity, ease: "linear" }
            }}
            className="absolute"
            style={{
              left,
              top,
              width: baseSize,
              height: baseSize,
            }}
          >
            {fragment.type === 'orb' && (
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  background: `radial-gradient(circle, ${fragment.color} 0%, transparent 80%)`,
                  boxShadow: `0 0 20px ${fragment.color}44`
                }}
              />
            )}
            {fragment.type === 'seed' && (
              <div 
                className="w-full h-full rounded-full"
                style={{ 
                  backgroundColor: fragment.color, 
                  opacity: 0.4,
                  boxShadow: `0 0 15px ${fragment.color}66`
                }}
              />
            )}
            {fragment.type === 'crystal' && (
              <div 
                className="w-full h-full"
                style={{ 
                  backgroundColor: fragment.color, 
                  clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  opacity: 0.3,
                  boxShadow: `0 0 20px ${fragment.color}44`
                }}
              />
            )}
            {fragment.type === 'nebula' && (
              <div 
                className="w-full h-full rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${fragment.color} 0%, transparent 90%)` }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
