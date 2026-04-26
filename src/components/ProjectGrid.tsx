import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects as staticProjects, Project } from '../data/projects';
import { ExternalLink, Github, Terminal } from 'lucide-react';

export default function ProjectGrid({ limit }: { limit?: number }) {
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const apiProjects = await res.json();
          setProjects([...apiProjects, ...staticProjects.filter(sp => !apiProjects.find((ap: any) => ap.title === sp.title))]);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const pinnedProjects = projects.filter(p => p.isPinned)
    .sort((a, b) => a.title === 'SmartRent AI' ? -1 : b.title === 'SmartRent AI' ? 1 : 0)
    .slice(0, 5);
  
  const otherProjects = projects.filter(p => !pinnedProjects.find(pp => pp.id === p.id));
  const sortedProjects = [...pinnedProjects, ...otherProjects];
  const displayProjects = limit ? sortedProjects.slice(0, limit) : sortedProjects;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 space-y-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono tracking-[0.5em] text-gray-500 uppercase mb-4"
          >
            Portfolio :: Repository
          </motion.h2>
          <h3 className="text-5xl lg:text-8xl font-black text-text-main tracking-widest uppercase leading-none">
            The<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-text-main to-gray-500">Showcase.</span>
          </h3>
        </div>
        <div className="text-gray-500 font-mono text-[10px] max-w-xs uppercase leading-relaxed tracking-widest bg-card-bg p-6 rounded-[32px] border border-border-main">
           Theoretical foundation. Practical engineering. Computer Science Graduate Portfolio.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => window.location.hash = `#view-${project.title.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-card-bg border border-border-main rounded-[40px] group flex flex-col h-full hover:border-tiktok-cyan transition-all p-2 cursor-pointer relative overflow-hidden"
          >
             <div className="aspect-[16/10] w-full bg-black rounded-[32px] relative overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
                <img 
                  src={project.imageUrl || `https://picsum.photos/seed/${project.title}/800/500`} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                />
                 <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2">
                   {project.languages.map(lang => (
                     <span key={lang} className="bg-tiktok-cyan/10 backdrop-blur-md px-3 py-1 rounded-full text-[8px] text-tiktok-cyan uppercase tracking-widest font-black border border-tiktok-cyan/20">
                       {lang}
                     </span>
                   ))}
                 </div>
              </div>

              <div className="flex-1 flex flex-col px-6 pb-6">
                 <div className="mb-4">
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase font-black">PKT_ID::{project.id.padStart(2, '0')}</h4>
                     <div className="w-1.5 h-1.5 rounded-full bg-white opacity-20" />
                   </div>
                   <h3 className="text-2xl font-black text-text-main tracking-widest uppercase transition-colors">
                     {project.title}
                     {project.title === 'SmartRent AI' && (
                       <span className="block text-[8px] font-mono text-tiktok-cyan tracking-[0.4em] mt-2 animate-pulse">
                         [ CAPSTONE_CASE_STUDY ]
                       </span>
                     )}
                   </h3>
                 </div>
                 
                 <p className="text-[13px] text-gray-500 font-medium leading-relaxed mb-10 flex-1">
                   {project.description}
                 </p>

                 <div className="grid grid-cols-2 gap-3 mb-8">
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 bg-tiktok-cyan text-black font-black text-[9px] uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,244,238,0.2)]"
                    >
                      Live <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-4 border border-border-main text-text-main font-black text-[9px] uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:bg-card-bg transition-all shadow-sm"
                    >
                      Repo <Github className="w-3 h-3" />
                    </a>
                 </div>

                 <div className="pt-6 flex items-center justify-between border-t border-white/5">
                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-[0.2em] font-black flex items-center gap-2">
                       <Terminal className="w-3 h-3" /> Technical_Brief
                    </span>
                 </div>
              </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
