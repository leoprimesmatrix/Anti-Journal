import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';

interface HoldOverlayProps {
  holdProgress: MotionValue<number>;
  themeColor: string;
}

export const HoldOverlay = React.memo(({ holdProgress, themeColor }: HoldOverlayProps) => {
  const opacity = useTransform(holdProgress, [0, 100], [0, 0.6]);
  
  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-40 mix-blend-color-dodge will-change-transform"
      style={{ 
        backgroundColor: themeColor,
        opacity
      }}
    />
  );
});

HoldOverlay.displayName = 'HoldOverlay';
