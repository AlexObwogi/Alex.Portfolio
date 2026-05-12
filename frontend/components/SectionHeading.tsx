import { motion } from 'motion/react';

export function SectionHeading({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <div className="mb-20 space-y-4">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <span className="text-[10px] font-mono tracking-[0.5em] text-tiktok-cyan uppercase font-black">
          {subtitle}
        </span>
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-4xl lg:text-7xl font-black text-text-main tracking-tighter uppercase leading-[0.85]"
      >
        {title}
      </motion.h2>
    </div>
  );
}
