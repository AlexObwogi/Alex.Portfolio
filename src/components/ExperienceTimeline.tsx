import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useRef } from 'react';
import { experiences } from '../data/experience';
import { Briefcase } from 'lucide-react';

export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
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
    <div ref={containerRef} className="relative max-w-4xl mx-auto py-20 px-6">
      <div className="absolute left-[20px] lg:left-1/2 top-0 bottom-0 w-[1px] bg-border-main -translate-x-1/2 overflow-hidden">
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
               <div className="bg-card-bg border border-border-main p-8 rounded-[40px] hover:border-tiktok-cyan transition-all group">
                  <div className="flex items-center space-x-3 text-text-main/40 mb-4">
                    <Briefcase className="w-4 h-4 text-tiktok-cyan" />
                    <span className="text-[10px] font-mono tracking-[0.4em] uppercase font-black">{exp.period}</span>
                  </div>
                  <h3 className="text-2xl font-black text-text-main group-hover:text-tiktok-cyan transition-colors uppercase tracking-widest mb-1">{exp.company}</h3>
                  <p className="text-[10px] font-black text-gray-500 mb-6 uppercase tracking-widest">{exp.role}</p>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium opacity-80 border-l border-border-main pl-6">{exp.description}</p>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
