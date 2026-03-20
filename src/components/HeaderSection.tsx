import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const HEADINGS = [
  "What's weighing on your mind?",
  "What are you holding onto?",
  "What needs to be released?",
  "What's the heavy thought today?",
  "Speak your truth to the silence.",
  "What's echoing in your heart?",
  "Let it all out here.",
  "What's the burden you carry?",
];

export const SUBHEADINGS = [
  "The universe is listening.",
  "The silence is your witness.",
  "The stars will hold your secrets.",
  "Release it to the infinite.",
  "Your words belong to the void now.",
  "Let the darkness consume the weight.",
  "Find peace in the release.",
  "The cosmos absorbs your heavy thoughts.",
];

interface HeaderSectionProps {
  heading: string;
  subheading: string;
  isZenMode: boolean;
  isDestroyed: boolean;
  themeAccent: string;
}

export const HeaderSection = React.memo(({ heading, subheading, isZenMode, isDestroyed, themeAccent }: HeaderSectionProps) => {
  return (
    <div className={cn(
      "text-center mb-12 transition-all duration-1000",
      isZenMode ? "opacity-0 scale-95 -translate-y-8 pointer-events-none" : "opacity-100 scale-100",
      isDestroyed ? "opacity-0 scale-110 blur-xl translate-y-[-100px]" : ""
    )}>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn(
          "text-4xl md:text-6xl font-light tracking-tighter mb-4",
          `text-${themeAccent}-100`
        )}
      >
        {heading}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="text-white/40 text-lg md:text-xl font-light tracking-widest uppercase"
      >
        {subheading}
      </motion.p>
    </div>
  );
});

HeaderSection.displayName = 'HeaderSection';
