import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function DiamondTransition({ isVisible, onComplete }: { isVisible: boolean, onComplete?: () => void }) {
  const shards = Array.from({ length: 12 });

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {shards.map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: 0, 
                y: 0, 
                z: 0,
                rotate: Math.random() * 360,
                scale: 0,
                opacity: 1
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 4000, 
                y: (Math.random() - 0.5) * 4000, 
                rotate: Math.random() * 720,
                scale: [0, 1.5, 0],
                opacity: 0.2
              }}
              exit={{ 
                opacity: 0 
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.05,
                ease: "easeOut"
              }}
              className="absolute w-64 h-64 bg-white/20 backdrop-blur-sm border border-white/30"
              style={{ 
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                boxShadow: '0 0 50px rgba(255,255,255,0.2)'
              }}
            />
          ))}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="relative z-10 text-white font-mono text-xl tracking-[0.5em] uppercase font-black"
          >
             System Initialized
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
