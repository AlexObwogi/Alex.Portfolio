import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects as staticProjects, Project } from '../data/projects';
import { ExternalLink, Github, Cpu, FileText, X, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProjectGrid({ limit }: { limit?: number }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [modalType, setModalType] = useState<'summary' | 'docs' | null>(null);
  const [projects, setProjects] = useState<Project[]>(staticProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const apiProjects = await res.json();
          // Merge static and API projects, prioritizing API ones or just combining
          setProjects([...apiProjects, ...staticProjects.filter(sp => !apiProjects.find((ap: any) => ap.title === sp.title))]);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const pinnedProjects = projects.filter(p => p.isPinned);
  const otherProjects = projects.filter(p => !p.isPinned);
  const sortedProjects = [...pinnedProjects, ...otherProjects];
  const displayProjects = limit ? sortedProjects.slice(0, limit) : sortedProjects;

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#view-')) {
        const projectTitle = decodeURIComponent(hash.replace('#view-', '').replace(/-/g, ' '));
        const project = sortedProjects.find(p => p.title.toLowerCase() === projectTitle.toLowerCase());
        if (project) {
          setActiveProject(project);
          setModalType('summary');
          setTimeout(() => {
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    if (sortedProjects.length > 0) {
      handleHash();
    }
    
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [sortedProjects]);

  const openModal = (project: Project, type: 'summary' | 'docs') => {
    setActiveProject(project);
    setModalType(type);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
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
            onClick={() => openModal(project, 'summary')}
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
                   <h3 className="text-2xl font-black text-text-main tracking-widest uppercase cursor-pointer hover:text-tiktok-cyan transition-colors" onClick={() => openModal(project, 'summary')}>
                     {project.title}
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
                      className="px-6 py-4 bg-tiktok-cyan text-black font-black text-[9px] uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(37,244,238,0.2)]"
                    >
                      Live <ExternalLink className="w-3 h-3" />
                    </a>
                    <a 
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-4 border border-border-main text-text-main font-black text-[9px] uppercase tracking-widest rounded-full flex items-center justify-center gap-2 hover:bg-card-bg transition-all shadow-sm"
                    >
                      Repo <Github className="w-3 h-3" />
                    </a>
                 </div>

                 <div className="pt-6 flex items-center justify-between border-t border-white/5">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(project, 'summary'); }}
                      className="text-[9px] font-mono text-gray-400 hover:text-tiktok-cyan uppercase tracking-[0.2em] font-black transition-colors flex items-center gap-2"
                    >
                       <Terminal className="w-3 h-3" /> Architecture
                    </button>
                    {project.videoUrl && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); openModal(project, 'docs'); }}
                        className="text-[9px] font-mono text-gray-600 hover:text-white uppercase tracking-[0.1em] font-black transition-colors bg-white/5 px-3 py-1 rounded-lg"
                      >
                         VIDEO_RECON
                      </button>
                    )}
                 </div>
              </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeProject && modalType && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-black/90 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] ring-1 ring-white/10 p-1 max-h-[90vh] overflow-y-auto overflow-x-hidden"
            >
               <div className="p-6 lg:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-md z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-mono text-[9px] text-gray-500 uppercase tracking-[0.3em] font-black">
                      {modalType === 'summary' ? 'Technical Architecture' : 'Project Insights'}
                    </span>
                  </div>
                  <button onClick={() => setActiveProject(null)} className="w-10 h-10 rounded-full bg-card-bg border border-border-main flex items-center justify-center text-gray-500 hover:text-tiktok-red hover:bg-tiktok-red/10 transition-all">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <div className="p-6 lg:p-12 space-y-10">
                  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <h3 className="text-4xl lg:text-6xl font-black text-text-main tracking-widest uppercase leading-none">{activeProject.title}</h3>
                    <div className="flex gap-4">
                      <a href={activeProject.liveUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-black bg-tiktok-cyan px-6 py-3 rounded-full hover:scale-105 transition-all font-black uppercase tracking-widest">Live</a>
                      <a href={activeProject.repoUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-text-main border border-border-main px-6 py-3 rounded-full hover:bg-card-bg transition-all font-black uppercase tracking-widest">Repo</a>
                    </div>
                  </div>

                  {modalType === 'docs' && (activeProject.videoUrl || activeProject.tourVideoUrl) && (
                    <div className="aspect-video w-full rounded-[40px] overflow-hidden border border-white/10 bg-black shadow-2xl relative group">
                      <video 
                        src={activeProject.videoUrl || activeProject.tourVideoUrl} 
                        controls 
                        className="w-full h-full object-contain"
                        poster={activeProject.imageUrl || `https://picsum.photos/seed/${activeProject.title}/1280/720`}
                      />
                    </div>
                  )}
                  
                  <div className="bg-card-bg border border-border-main p-8 lg:p-10 rounded-[40px] font-mono text-sm leading-relaxed text-gray-500">
                     <p className="text-text-main mb-8 uppercase tracking-[0.3em] text-[9px] font-black flex items-center gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan animate-pulse" />
                        {modalType === 'summary' ? 'Analysis_Stream :: Active' : 'Documentation_Probe :: Active'}
                     </p>
                     <div className="prose prose-invert max-w-none text-xs lg:text-sm text-gray-400">
                       {modalType === 'summary' ? activeProject.technicalSummary : activeProject.aiDocsAnalysis}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {activeProject.techStack.map(tech => (
                      <div key={tech} className="p-6 bg-card-bg border border-border-main rounded-[32px] flex items-center gap-3">
                         <div className="w-1 h-1 rounded-full bg-tiktok-cyan/50" />
                         <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-widest">{tech}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-6">
                     <button 
                       onClick={() => setActiveProject(null)}
                       className="px-12 py-5 bg-text-main text-bg-main font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-105 active:scale-95 transition-all"
                     >
                        Close_Session
                     </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
