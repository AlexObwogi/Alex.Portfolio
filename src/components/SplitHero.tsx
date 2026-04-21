import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Zap, Monitor, Code, ShieldCheck, Globe, Database, Terminal, Sparkles } from 'lucide-react';

export default function SplitHero() {
  return (
    <div className="relative w-full min-h-screen bg-bg-main overflow-hidden flex items-center justify-center py-20 px-6">
      {/* Dynamic Background Noise/Gradient */}
      <div className="absolute inset-0 bg-bg-main" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_50%_50%,var(--text-main),transparent)] pointer-events-none" />
      
      {/* Animated Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-tiktok-cyan/[0.15] rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.03, 0.08, 0.03]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-tiktok-red/[0.1] rounded-full blur-[150px] pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3 bg-tiktok-cyan/10 border border-tiktok-cyan/20 w-fit px-5 py-2 rounded-full backdrop-blur-sm"
          >
            <ShieldCheck className="w-4 h-4 text-tiktok-cyan animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-tiktok-cyan font-black">Lead_Security_Engineer :: Open_For_Vetting</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-8xl font-black text-text-main leading-[0.9] tracking-tighter uppercase"
            >
              Secure Build.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tiktok-cyan via-tiktok-cyan/80 to-tiktok-cyan/40">Defend Scale.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-xl font-medium max-w-xl leading-relaxed"
            >
              Architecting <span className="text-text-main">Cloud Security Automation</span> and Fullstack Systems. Targeted at Senior Security Engineering Leadership and Advanced Systems Integration.
              <span className="block mt-4 text-tiktok-cyan text-lg italic border-l-2 border-tiktok-cyan pl-4">Capstone: SmartRent AI Ecosystem Analysis Enabled.</span>
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-tiktok-cyan text-black font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(37,244,238,0.2)]"
            >
              Security Lab <Zap className="w-4 h-4 inline-block ml-2 mb-1" />
            </button>
            <a 
              href="#view-SmartRent-AI"
              className="px-10 py-4 border border-border-main text-text-main font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-black transition-all text-center flex items-center justify-center gap-2 shadow-lg"
            >
              Spotlight: SmartRent <Monitor className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6 relative">
          {[
            { icon: Code, title: 'Fullstack', desc: 'MERN Expert', target: 'SmartRent AI' },
            { icon: ShieldCheck, title: 'Security', desc: 'Cloud Defender', target: 'Sentinel Cloud' },
            { icon: Database, title: 'Architecture', desc: 'Schema Master', target: 'SmartRent AI' },
            { icon: Globe, title: 'Infrastructure', desc: 'AWS & IaC', target: 'Sentinel Cloud' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 * i + 0.5 }}
              onClick={() => {
                const el = document.getElementById('projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="p-8 bg-card-bg border border-border-main rounded-[40px] backdrop-blur-xl group hover:border-tiktok-cyan transition-all cursor-pointer active:scale-95"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-6 h-6 text-tiktok-cyan" />
              </div>
              <h3 className="text-text-main font-bold uppercase tracking-widest text-sm mb-2">{item.title}</h3>
              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{item.desc}</p>
            </motion.div>
          ))}
          
          {/* Central Decoration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[9px] font-mono uppercase tracking-widest text-text-main">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-text-main to-transparent" />
      </motion.div>
    </div>
  );
}
