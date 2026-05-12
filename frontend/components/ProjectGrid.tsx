import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { projects as staticProjects, Project } from '../data/projects';
import { ExternalLink, Github, Terminal, X, Cpu, Layers, Globe, Video, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ProjectGrid({ limit }: { limit?: number }) {
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  useEffect(() => {
    setIsPlayingVideo(false);
  }, [selectedProject]);

  const lastFetchRef = useRef<number>(0);

  useEffect(() => {
    const fetchProjects = async () => {
      const now = Date.now();
      if (now - lastFetchRef.current < 2000) return;
      lastFetchRef.current = now;

      try {
        const res = await fetch(`/api/projects?t=${now}`, {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const apiProjects = await res.json();
          const normalizedApiProjects = apiProjects.map((p: any) => ({
            ...p,
            id: p.id || p._id?.toString() || Math.random().toString(36).substr(2, 9)
          }));
          setProjects([...normalizedApiProjects, ...staticProjects.filter(sp => !normalizedApiProjects.find((ap: any) => ap.title === sp.title))]);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };
    
    fetchProjects();

    const handleSync = (e: any) => {
      if (e.detail?.type?.startsWith('PROJECT_')) {
        console.log('[PROJECT_GRID] Sync triggered by SSE');
        fetchProjects();
      }
    };

    window.addEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
    return () => window.removeEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
  }, []);

  const allTags = Array.from(new Set([
    'All',
    ...projects.flatMap(p => [...(p.languages || []), ...(p.techStack || [])].map(t => t.trim()))
  ])).sort((a, b) => a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b));

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => (p.languages || []).includes(activeFilter) || (p.techStack || []).includes(activeFilter));

  // Sorting Priority:
  // 1. API Projects (Newest additions)
  // 2. Pinned Static Projects
  // 3. Rest
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aIsApi = (a as any)._id || a.id.length > 5;
    const bIsApi = (b as any)._id || b.id.length > 5;

    if (aIsApi && !bIsApi) return -1;
    if (!aIsApi && bIsApi) return 1;

    // Both are same type, check pinning
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    return 0;
  });

  const [localLimit, setLocalLimit] = useState(limit);
  const displayProjects = localLimit ? sortedProjects.slice(0, localLimit) : sortedProjects;
  const hasMore = localLimit ? sortedProjects.length > localLimit : false;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-[10px] font-mono tracking-[0.5em] text-gray-500 uppercase mb-4"
          >
            PROJECT REPOSITORY
          </motion.h2>
          <h3 className="text-5xl lg:text-8xl font-black text-text-main tracking-widest uppercase leading-none">
            Strategic<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-text-main to-gray-500">Repository.</span>
          </h3>
        </div>
        <div className="text-gray-500 font-mono text-[10px] max-w-xs uppercase leading-relaxed tracking-widest bg-card-bg p-6 rounded-[32px] border border-border-main">
           Systemic logic. Market-scale engineering. Bridging the gap between high-performance computing and financial modeling.
        </div>
      </div>

      {!limit && (
        <div className="flex flex-wrap gap-4 mb-16">
          {allTags.map((tag, i) => (
            <button
              key={`${tag}-${i}`}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border transition-all",
                activeFilter === tag 
                  ? "bg-tiktok-cyan text-black border-tiktok-cyan shadow-[0_0_20px_rgba(37,244,238,0.3)] scale-105" 
                  : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30 hover:text-white"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {displayProjects.map((project, index) => (
            <motion.div
              layout
              key={project.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -12, scale: 1.03 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setSelectedProject(project)}
              className="bg-card-bg border border-border-main rounded-[40px] group flex flex-col h-full hover:border-tiktok-cyan hover:shadow-[0_0_80px_-20px_rgba(37,244,238,0.25)] transition-all p-2 cursor-pointer relative overflow-hidden"
            >
             <div className="aspect-[16/10] w-full bg-black rounded-[32px] relative overflow-hidden mb-6 transition-all duration-700 group-hover:shadow-[0_0_50px_-5px_rgba(37,244,238,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-80" />
                <img 
                   src={project.imageUrl || `https://picsum.photos/seed/${project.title}/800/500`} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 group-hover:brightness-125"
                />
                 <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-2">
                    {Array.from(new Set([...(project.languages || []), ...(project.techStack || []).slice(0, 2)].map(t => t.trim()))).map((tag, i) => (
                      <button 
                        key={`${tag}-${i}`} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFilter(tag);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-tiktok-cyan/10 backdrop-blur-md px-3 py-1 rounded-full text-[8px] text-tiktok-cyan uppercase tracking-widest font-black border border-tiktok-cyan/20 hover:bg-tiktok-cyan hover:text-black transition-all cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex-1 flex flex-col px-6 pb-6">
                 <div className="mb-4">
                   <div className="flex items-center justify-between mb-2">
                     <h4 className="text-[9px] font-mono text-gray-500 tracking-[0.3em] uppercase font-black">
                       PROJ-{String(project.id || index).padStart(2, '0')}
                     </h4>
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
                       <Terminal className="w-3 h-3" /> Technical Brief
                    </span>
                 </div>
              </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>
      
      {hasMore && (
        <div className="mt-20 flex justify-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            onClick={() => setLocalLimit(undefined)}
            className="group relative px-12 py-5 bg-card-bg border border-border-main rounded-full overflow-hidden transition-all hover:border-tiktok-cyan"
          >
            <div className="absolute inset-0 bg-tiktok-cyan/0 group-hover:bg-tiktok-cyan/5 transition-colors" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-tiktok-cyan transition-colors flex items-center gap-4">
              Explore Full Repository
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-6 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            
            <motion.div 
              layoutId={`project-${selectedProject.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-6xl bg-card-bg border border-border-main rounded-[48px] overflow-hidden relative z-10 shadow-3xl max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col lg:flex-row h-full overflow-y-auto custom-scrollbar">
                {/* Left: Media & Basic Info */}
                <div className="lg:w-2/5 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                   <div className="aspect-[16/10] bg-black rounded-[40px] overflow-hidden mb-12 shadow-2xl relative group">
                      {isPlayingVideo && (selectedProject.tourVideoUrl || selectedProject.videoUrl) ? (
                         <video 
                           src={selectedProject.tourVideoUrl || selectedProject.videoUrl} 
                           controls 
                           autoPlay 
                           className="w-full h-full object-cover"
                         />
                      ) : (
                        <>
                          <img 
                            src={selectedProject.imageUrl || `https://picsum.photos/seed/${selectedProject.title}/800/500`}
                            alt={selectedProject.title}
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          
                          {(selectedProject.tourVideoUrl || selectedProject.videoUrl) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                               <button 
                                 onClick={() => setIsPlayingVideo(true)}
                                 className="w-20 h-20 bg-tiktok-cyan text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(37,244,238,0.5)] hover:scale-110 transition-all group/play"
                               >
                                  <Video className="w-10 h-10 group-hover/play:animate-pulse" />
                               </button>
                            </div>
                          )}
                        </>
                      )}
                   </div>

                   <div className="space-y-12">
                      <div>
                        <h4 className="text-[10px] font-mono text-gray-500 tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                          <Cpu className="w-4 h-4 text-tiktok-cyan" /> Core Architecture
                        </h4>
                        <div className="flex flex-wrap gap-2">
                           {Array.from(new Set((selectedProject.techStack || []).map(t => t.trim()))).map((tech, i) => (
                             <span key={`${tech}-${i}`} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-300 font-mono tracking-widest uppercase">
                               {tech}
                             </span>
                           ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                         <a 
                           href={selectedProject.liveUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="w-full py-5 bg-tiktok-cyan text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-4 hover:shadow-[0_0_40px_rgba(37,244,238,0.3)] transition-all"
                         >
                           <Globe className="w-5 h-5" /> View Project Site
                         </a>
                         <a 
                           href={selectedProject.repoUrl} 
                           target="_blank" 
                           rel="noreferrer"
                           className="w-full py-5 bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-4 hover:bg-white/10 transition-all"
                         >
                           <Github className="w-5 h-5" /> View Source Code
                         </a>
                      </div>
                   </div>
                </div>

                {/* Right: Technical Details & AI Analysis */}
                <div className="lg:w-3/5 p-8 lg:p-12 space-y-16">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3 text-tiktok-cyan/40 mb-2">
                         <Terminal className="w-4 h-4" />
                         <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Status: Production Ready</span>
                      </div>
                      <h2 className="text-4xl lg:text-6xl font-black text-text-main tracking-tight uppercase">
                        {selectedProject.title}
                      </h2>
                      <p className="text-lg text-gray-400 font-medium leading-relaxed">
                        {selectedProject.description}
                      </p>
                      
                      {selectedProject.quantitativeSkills && selectedProject.quantitativeSkills.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-4">
                          {selectedProject.quantitativeSkills.map((skill, i) => (
                             <span key={i} className="px-4 py-2 bg-tiktok-cyan/10 border border-tiktok-cyan/30 rounded-xl text-[10px] text-tiktok-cyan font-black uppercase tracking-widest shadow-[0_0_15px_rgba(37,244,238,0.1)]">
                               {skill}
                             </span>
                          ))}
                        </div>
                      )}
                   </div>

                   <div className="space-y-8">
                      <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 lg:p-10 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Layers className="w-20 h-20" />
                         </div>
                         <h4 className="text-[10px] font-mono text-tiktok-cyan tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                            <FileText className="w-4 h-4" /> Technical Summary
                         </h4>
                         <p className="text-sm text-gray-300 leading-loose font-mono opacity-80 whitespace-pre-wrap">
                            {selectedProject.technicalSummary}
                         </p>
                      </div>

                      <div className="bg-tiktok-cyan/5 border border-tiktok-cyan/10 rounded-[32px] p-8 lg:p-10">
                         <h4 className="text-[10px] font-mono text-tiktok-cyan tracking-[0.4em] uppercase mb-6 flex items-center gap-3">
                            <Cpu className="w-4 h-4" /> AI Analysis
                         </h4>
                         <div className="flex items-start gap-4 p-4 bg-black/40 rounded-2xl border border-tiktok-cyan/20">
                            <CheckCircle2 className="w-6 h-6 text-tiktok-cyan flex-shrink-0 mt-1" />
                            <p className="text-sm text-tiktok-cyan leading-relaxed font-bold italic">
                               "{selectedProject.aiDocsAnalysis}"
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 flex flex-wrap gap-12">
                      <div className="space-y-1">
                         <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Platform</span>
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Web / Cross-Env</p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Architect</span>
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Alex Obwogi</p>
                      </div>
                      <div className="space-y-1">
                         <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Security Audit</span>
                         <p className="text-xs font-black uppercase tracking-[0.2em] text-tiktok-cyan">Passed Integrity Check</p>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
