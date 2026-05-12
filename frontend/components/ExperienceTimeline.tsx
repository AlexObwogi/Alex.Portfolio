import { motion, useScroll, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useRef, useState } from 'react';
import { experiences, Experience } from '../data/experience';
import { Briefcase, X, ChevronRight, ArrowLeft, Target, Cpu, Terminal } from 'lucide-react';

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-20 px-6 min-h-[500px]">
      <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-[1px] bg-border-main -translate-x-1/2 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-0 w-full bg-tiktok-cyan opacity-50 origin-top"
          style={{ height: useTransform(pathLength, [0, 1], ["0%", "100%"]) }}
        />
      </div>

      <div className="space-y-32">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex items-center w-full ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
          >
            <div className="hidden lg:block w-1/2" />
            
            <div className="absolute left-[20px] lg:left-1/2 -translate-x-1/2 z-10">
               <motion.div 
                 className="w-3 h-3 rounded-full bg-tiktok-cyan transition-shadow"
                 style={{ 
                   boxShadow: useTransform(pathLength, [0, index / experiences.length, index / experiences.length + 0.1], ["0 0 0px #25F4EE", "0 0 20px #25F4EE", "0 0 20px #25F4EE"])
                 }}
               />
            </div>

            <div className="w-full lg:w-1/2 pl-16 lg:pl-0 lg:px-20">
               <motion.div 
                 onClick={() => setSelectedExp(exp)}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="bg-card-bg border border-border-main p-8 rounded-[40px] hover:border-tiktok-cyan cursor-pointer transition-all group relative overflow-hidden"
               >
                  <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-5 h-5 text-tiktok-cyan" />
                  </div>

                  <div className="flex items-center space-x-3 text-text-main/40 mb-4">
                    <Briefcase className="w-4 h-4 text-tiktok-cyan" />
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black">{exp.period}</span>
                  </div>
                  <h3 className="text-2xl font-black text-text-main group-hover:text-tiktok-cyan transition-colors uppercase tracking-widest mb-1">{exp.company}</h3>
                  <p className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-widest">{exp.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium opacity-80 line-clamp-3">{exp.description}</p>
                  
                  <div className="mt-8 pt-6 border-t border-border-main/50 flex items-center text-tiktok-cyan gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest">Detail Brief</span>
                    <div className="h-[1px] flex-1 bg-tiktok-cyan/20" />
                  </div>
               </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedExp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedExp(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            <motion.div 
              layoutId={`card-${selectedExp.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card-bg border border-border-main rounded-[40px] overflow-hidden shadow-2xl z-10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-tiktok-cyan via-tiktok-red to-tiktok-cyan animate-shimmer" />
              
              <div className="p-8 md:p-12 space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-tiktok-cyan/10 rounded-2xl">
                        <Briefcase className="w-6 h-6 text-tiktok-cyan" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.4em] text-tiktok-cyan uppercase font-black">{selectedExp.period}</span>
                        <h2 className="text-3xl md:text-4xl font-black text-text-main uppercase tracking-tighter leading-none">{selectedExp.company}</h2>
                      </div>
                    </div>
                    <p className="text-sm font-black text-tiktok-cyan uppercase tracking-[0.3em] pl-1">{selectedExp.role}</p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedExp(null)}
                    className="p-3 hover:bg-white/5 rounded-2xl transition-all group"
                  >
                    <X className="w-6 h-6 text-gray-500 group-hover:text-white" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-y border-border-main/50">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-tiktok-cyan">
                      <Target className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Specialization</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Core specialization in high-performance delivery and architectural resilience within {selectedExp.company}'s ecosystem.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-tiktok-red">
                      <Cpu className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium leading-relaxed">
                      Deployed successfully with 100% operational integrity during the {selectedExp.period} cycle.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-tiktok-cyan" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Full Description</span>
                  </div>
                  <p className="text-lg text-gray-300 font-medium leading-relaxed">
                    {selectedExp.description}
                  </p>
                </div>

                <div className="pt-8 flex justify-end">
                   <button 
                     onClick={() => setSelectedExp(null)}
                     className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-border-main rounded-2xl transition-all group"
                   >
                     <ArrowLeft className="w-4 h-4 text-tiktok-cyan group-hover:-translate-x-1 transition-transform" />
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">Back to Timeline</span>
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
