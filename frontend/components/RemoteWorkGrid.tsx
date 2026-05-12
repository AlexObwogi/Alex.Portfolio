import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Terminal, Shield, Cpu, Globe, Video, FileText, ChevronRight, Play, Maximize2, X, Briefcase, Calendar, LayoutGrid, ArrowDownAZ, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export interface RemoteWork {
  _id?: string;
  title: string;
  clientName: string;
  description: string;
  platform: string;
  serviceType: string;
  imageUrl: string;
  videoUrl: string;
  techStack: [string];
  liveUrl: string;
  date: string;
}

export default function RemoteWorkGrid() {
  const [works, setWorks] = useState<RemoteWork[]>([]);
  const [selectedWork, setSelectedWork] = useState<RemoteWork | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'latest' | 'platform'>('latest');
  const lastFetchRef = useRef<number>(0);

  // Unified Filtering Logic
  const getFilteredItems = () => {
    let result = [...works];

    if (currentFilter && currentFilter !== 'All') {
      result = result.filter(w => 
        (w.serviceType && w.serviceType === currentFilter) || 
        (w.techStack && w.techStack.includes(currentFilter)) ||
        (w.title && w.title.toLowerCase().includes(currentFilter.toLowerCase())) ||
        (w.platform && w.platform.toLowerCase() === currentFilter.toLowerCase())
      );
    }

    if (sortBy === 'platform') {
      result.sort((a, b) => (a.platform || '').localeCompare(b.platform || ''));
    } else {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  };

  const finalWorks = getFilteredItems();

  useEffect(() => {
    const fetchWork = async () => {
      const now = Date.now();
      if (now - lastFetchRef.current < 2000) return;
      lastFetchRef.current = now;

      try {
        const res = await fetch(`/api/client-work?t=${now}`, { cache: 'no-store' });
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
          console.warn('API returned non-JSON or error');
          return;
        }
        const data = await res.json();
        setWorks(data);
      } catch (err) {
        console.error('Failed to fetch client work:', err);
      }
    };
    
    fetchWork();

    const handleSync = (e: any) => {
      if (e.detail?.type?.startsWith('CLIENT_WORK_')) {
        console.log('[REMOTE_WORK_GRID] Sync triggered by SSE');
        fetchWork();
      }
    };

    window.addEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
    return () => window.removeEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
  }, []);

  // Extra Dynamic Filters
  const allServiceTypes = Array.from(new Set(works.map(w => w.serviceType).filter(Boolean)));
  const allTech = Array.from(new Set(works.flatMap(w => w.techStack))).slice(0, 10); // Limit tech filters to avoid clutter

  useEffect(() => {
    const handleNavigation = () => {
      const params = new URLSearchParams(window.location.search);
      const filter = params.get('filter');
      const hash = window.location.hash;

      if (filter) {
        setCurrentFilter(filter);
      }

      if (hash === '#client-work') {
        const element = document.getElementById('client-work');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [works, window.location.search, window.location.hash]);

  return (
    <div className="space-y-12">
      {/* Enhanced Filter & Sort Bar */}
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">Service Categories</h4>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => {
                window.history.pushState({}, '', '/#client-work');
                setCurrentFilter('All');
              }}
              className={cn(
                "px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                currentFilter === 'All' || !currentFilter
                  ? "bg-tiktok-cyan text-black border-tiktok-cyan shadow-[0_0_30px_rgba(37,244,238,0.3)]"
                  : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30"
              )}
            >
              All Categories
              <span className={cn(
                "ml-1 px-1.5 py-0.5 rounded-md text-[8px]",
                currentFilter === 'All' || !currentFilter ? "bg-black/20 text-black" : "bg-white/10 text-gray-500"
              )}>
                {works.length}
              </span>
            </button>
            
            {allServiceTypes.map((type, i) => (
              <button 
                key={`${type || 'service'}-${i}`}
                onClick={() => setCurrentFilter(type)}
                className={cn(
                  "px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border flex items-center gap-2",
                  currentFilter === type
                    ? "bg-tiktok-cyan text-black border-tiktok-cyan shadow-[0_0_30px_rgba(37,244,238,0.3)]"
                    : "bg-white/5 text-gray-500 border-white/10 hover:border-white/30 text-white/50"
                )}
              >
                {type}
                <span className={cn(
                  "ml-1 px-1.5 py-0.5 rounded-md text-[8px]",
                  currentFilter === type ? "bg-black/20 text-black" : "bg-white/10 text-gray-600"
                )}>
                  {works.filter(w => w.serviceType === type).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-white/5 pt-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest self-center mr-2">Tech Stack:</span>
            {allTech.map(tech => (
              <button 
                key={tech}
                onClick={() => setCurrentFilter(tech)}
                className={cn(
                  "px-4 py-2 rounded-xl text-[8px] font-mono transition-all border",
                  currentFilter === tech
                    ? "bg-tiktok-cyan/20 text-tiktok-cyan border-tiktok-cyan/40"
                    : "bg-transparent text-gray-500 border-white/5 hover:border-white/20"
                )}
              >
                {tech}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 px-3 mr-1 border-r border-white/10">
              <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Sort By</span>
            </div>
            <button 
              onClick={() => setSortBy('latest')}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                sortBy === 'latest' ? "bg-tiktok-cyan text-black shadow-[0_0_20px_rgba(37,244,238,0.2)]" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Clock className="w-3 h-3" />
              Latest
            </button>
            <button 
              onClick={() => setSortBy('platform')}
              className={cn(
                "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                sortBy === 'platform' ? "bg-tiktok-cyan text-black shadow-[0_0_20_rgba(37,244,238,0.2)]" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <ArrowDownAZ className="w-3 h-3" />
              Platform
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {finalWorks.map((work, index) => (
            <motion.div
              layout
              key={work._id || `work-${index}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative bg-[#0a0a0a] border border-white/5 rounded-[40px] overflow-hidden hover:border-tiktok-cyan/30 transition-all duration-500"
            >
            {/* Visual Header */}
            <div className="aspect-video relative overflow-hidden">
               <img 
                 src={work.imageUrl || "https://picsum.photos/seed/remotework/1200/800"} 
                 alt={work.title}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
               
               {/* Platform Tag */}
               <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/70">{work.platform}</span>
               </div>

               {/* Interaction Tools */}
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
                  {work.videoUrl && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveVideo(work.videoUrl); }}
                      className="w-16 h-16 bg-tiktok-cyan text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 fill-black" />
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedWork(work)}
                    className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Maximize2 className="w-6 h-6" />
                  </button>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-8 lg:p-10 space-y-6">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
            <div className="flex items-center gap-2">
                      <p className="text-[10px] font-mono text-tiktok-cyan tracking-[0.3em] uppercase">{work.clientName}</p>
                      {work.serviceType && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{work.serviceType}</span>
                        </>
                      )}
                   </div>
                     <h3 className="text-2xl font-black text-white tracking-tight uppercase group-hover:text-tiktok-cyan transition-colors">
                       {work.title}
                     </h3>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 font-bold">{work.date}</span>
               </div>

               <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
                 {work.description}
               </p>

               <div className="flex flex-wrap gap-2">
                  {Array.from(new Set((work.techStack || []).map(t => t.trim()))).map((tech, i) => (
                    <span 
                       key={`${tech}-${i}`} 
                       className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-mono text-gray-400 border border-white/10 uppercase tracking-widest"
                    >
                      {tech}
                    </span>
                  ))}
               </div>
            </div>
          </motion.div>
        ))}
        </AnimatePresence>
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setActiveVideo(null)}
               className="absolute inset-0 bg-black/95 backdrop-blur-3xl"
            />
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] overflow-hidden shadow-3xl border border-white/10"
            >
               <video 
                 src={activeVideo} 
                 controls 
                 autoPlay 
                 className="w-full h-full object-contain"
               />
               <button 
                 onClick={() => setActiveVideo(null)}
                 className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-all"
               >
                 <X className="w-6 h-6" />
               </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Work Details Modal */}
      <AnimatePresence>
        {selectedWork && (
          <div className="fixed inset-0 z-[550] flex items-center justify-center p-4 lg:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWork(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="relative w-full max-w-6xl h-full max-h-[85vh] bg-[#0d0d0d] border border-white/5 rounded-[48px] overflow-hidden flex flex-col lg:flex-row shadow-3xl"
            >
               <button 
                 onClick={() => setSelectedWork(null)}
                 className="absolute top-6 right-6 z-50 w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all"
               >
                 <X className="w-6 h-6" />
               </button>

               {/* Left: Hero Image */}
               <div className="lg:w-1/2 relative bg-black">
                  <img 
                    src={selectedWork.imageUrl || "https://picsum.photos/seed/remotework/1200/800"} 
                    className="w-full h-full object-cover opacity-70" 
                    alt={selectedWork.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                  
                  <div className="absolute bottom-12 left-12 right-12 space-y-4">
                     <div className="flex items-center gap-3">
                        <Briefcase className="w-5 h-5 text-tiktok-cyan" />
                        <span className="text-[10px] font-mono tracking-[0.4em] text-tiktok-cyan uppercase">Remote Delivery</span>
                     </div>
                     <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                       {selectedWork.title}
                     </h2>
                  </div>
               </div>

               {/* Right: Info */}
               <div className="lg:w-1/2 p-12 lg:p-16 overflow-y-auto custom-scrollbar space-y-12">
                  <div className="grid grid-cols-2 gap-8 border-b border-white/5 pb-12">
                     <div>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Client</p>
                        <p className="text-lg font-bold text-white">{selectedWork.clientName}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Platform</p>
                        <p className="text-lg font-bold text-tiktok-cyan">{selectedWork.platform}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Timeline</p>
                        <p className="text-lg font-bold text-white">{selectedWork.date}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-lg font-bold text-green-500">Delivered</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em]">Project Overview</h4>
                     <p className="text-gray-400 leading-loose text-lg font-medium">
                       {selectedWork.description}
                     </p>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.4em]">Technologies</h4>
                      <div className="flex flex-wrap gap-3">
                        {Array.from(new Set((selectedWork.techStack || []).map(t => t.trim()))).map((tech, i) => (
                          <div key={`${tech}-${i}`} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan" />
                             <span className="text-[10px] font-black text-white tracking-widest uppercase">{tech}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {selectedWork.liveUrl && (
                    <a 
                      href={selectedWork.liveUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center gap-4 py-5 px-10 bg-tiktok-cyan text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:shadow-[0_0_40px_rgba(37,244,238,0.4)] hover:scale-105 transition-all"
                    >
                      View Solution <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
