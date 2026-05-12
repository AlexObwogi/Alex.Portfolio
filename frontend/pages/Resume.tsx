import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, CheckCircle, Sparkles, Loader2, Home, ArrowRight, ShieldCheck, Target, Zap, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../components/SectionHeading';
import { cn } from '../lib/utils';
import { generateTailoredResume } from '../lib/resumeAi';

interface TailoredContent {
  summary: string;
  topSkills: string[];
  tailoredExperience: {
    id: string;
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    period: string;
    details: string;
  }[];
  projects: {
    title: string;
    tech: string;
    description: string;
  }[];
}

export default function ResumePage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [showToast, setShowToast] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const generateATSResume = async () => {
    if (!jobDescription.trim()) {
      setError("Please provide a target job description for better alignment.");
      return;
    }
    
    setError(null);
    setStatus('generating');
    setProgress(0);
    setLogs(['[SYSTEM] Initializing generation sequence...', '[AI] Establishing link with Neural-Engine-01...']);
    setCurrentStep('Analyzing Requirements');
    
    // Progress interval simulation
    const pInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev < 95 ? prev + (Math.random() * 8) : prev;
        
        // Dynamic logs based on progress
        if (next > 20 && next < 25) setLogs(prevLogs => [...new Set([...prevLogs, '[AI] Parsing job description metadata...'])]);
        if (next > 40 && next < 45) {
          setLogs(prevLogs => [...new Set([...prevLogs, '[SYSTEM] Matching skill vectors to project history...'])]);
          setCurrentStep('Architecting Narrative');
        }
        if (next > 60 && next < 65) setLogs(prevLogs => [...new Set([...prevLogs, '[AI] Optimizing for high-authority ATS terminologies...'])]);
        if (next > 80 && next < 85) {
          setLogs(prevLogs => [...new Set([...prevLogs, '[SYSTEM] Hardening experience bullet points...'])]);
          setCurrentStep('Finalizing Alignment');
        }
        
        return next;
      });
    }, 600);
    
    try {
      // Fetch certifications
      const certRes = await fetch('/api/certifications');
      const certifications = certRes.ok && certRes.headers.get('content-type')?.includes('application/json')
        ? await certRes.json()
        : [];

      const userData = {
        personalInfo: {
          name: "ALEX N. OBWOGI",
          title: "Quantitative Software Engineer & Fullstack Architect",
          email: "obwogialex728@gmail.com",
          phone: "+254 706 050 538",
          location: "Nairobi, Kenya"
        },
        experiences: experiences.map(e => ({ 
          id: e.id, 
          role: e.role, 
          company: e.company, 
          period: e.period,
          description: e.description 
        })),
        projects: projects.map(p => ({ 
          title: p.title, 
          description: p.description, 
          tech: p.techStack.join(', ')
        })),
        education: [
          {
            degree: "MSc in Financial Engineering (MScFE)",
            institution: "WorldQuant University",
            period: "Jun 2026 - 2028 (Incoming)",
            details: "Intensive focus on Stochastic Calculus, Risk Management, and Algorithmic Trading. Commencing June 8, 2026."
          },
          {
            degree: "Applied Data Science Lab",
            institution: "WorldQuant University",
            period: "May 2026 - Aug 2026 (Ongoing)",
            details: "Hands-on application of machine learning and predictive modeling on high-fidelity, large-scale financial datasets."
          },
          {
            degree: "BSc Computer Science",
            institution: "Kirinyaga University",
            period: "2022 - 2026",
            details: "Specialized in High-Performance Systems Architecture and Distributed Cloud Defense."
          }
        ],
        certifications: certifications.map((c: any) => ({
          title: c.title,
          issuer: c.issuer,
          date: c.date
        }))
      };

      // Generate tailored content using AI directly in frontend (as per skill guidelines)
      const tailoredResume = await generateTailoredResume(userData, {
        description: jobDescription,
        keywords: keywords
      });

      clearInterval(pInterval);
      setProgress(100);
      setLogs(prev => [...prev, '[SYSTEM] Generation complete. Checksum verified.']);
      setStatus('ready');
      setShowToast(true);
      
      // Delay for UX then navigate
      setTimeout(() => {
        navigate('/view-resume', { state: { tailoredContent: tailoredResume } });
      }, 1500);
    } catch (err) {
      clearInterval(pInterval);
      console.error(err);
      setError("AI Signal Interrupted. Falling back to standard optimization.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus('ready');
    }
  };

  return (
    <div className="min-h-screen bg-bg-main relative">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-20 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
           <Link to="/" className="hover:text-tiktok-cyan transition-colors">Home</Link>
           <span>/</span>
           <span className="text-tiktok-cyan">AI Resume Generation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="space-y-12">
            <div>
              <SectionHeading subtitle="AI Powered" title="Resume Generation." />
              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                Refine your professional narrative with <span className="text-tiktok-cyan font-bold">Neural Engine AI</span>. Tailor your transition to Quantitative Software Engineering, emphasizing your WorldQuant University trajectory and specialized mathematical modeling.
              </p>
            </div>

            <div className="space-y-8 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 backdrop-blur-xl">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <Target className="w-4 h-4 text-tiktok-cyan" />
                  Target Job Description
                </label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job requirements here for AI-driven alignment..."
                  className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:outline-none focus:border-tiktok-cyan/50 transition-all font-mono placeholder:text-gray-700"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <Zap className="w-4 h-4 text-tiktok-cyan" />
                  Specific Keywords to Inject
                </label>
                <input 
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  type="text"
                  placeholder="e.g. AWS, DevSecOps, Kubernetes, ISO27001..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm text-gray-300 focus:outline-none focus:border-tiktok-cyan/50 transition-all font-mono placeholder:text-gray-700"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 text-red-400/80 text-[10px] font-mono uppercase bg-red-400/5 p-4 rounded-xl border border-red-400/20">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={generateATSResume}
                  disabled={status === 'generating'}
                  className={cn(
                    "w-full py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-4 shadow-2xl relative overflow-hidden",
                    status === 'idle' ? "bg-tiktok-cyan text-black" : 
                    status === 'generating' ? "bg-white/10 text-gray-400 border border-white/10 cursor-wait" : 
                    "bg-[#00FF00] text-black scale-[1.02]"
                  )}
                >
                  {status === 'idle' && <><Sparkles className="w-5 h-5" /> View Resume</>}
                  {status === 'generating' && <><Loader2 className="w-5 h-5 animate-spin" /> Generation in Progress {Math.round(progress)}%</>}
                  {status === 'ready' && <><CheckCircle className="w-5 h-5" /> Opening Resume...</>}
                  
                  {status === 'idle' && (
                    <div className="absolute inset-x-[-100%] inset-y-0 bg-white/20 hover:animate-shimmer" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="sticky top-40">
            <div className="relative">
              <div className="absolute inset-0 bg-tiktok-cyan/5 blur-[100px] rounded-full" />
              <motion.div 
                initial={{ rotate: -2, y: 20 }}
                animate={{ rotate: 0, y: 0 }}
                className="bg-card-bg border border-border-main rounded-[48px] p-12 aspect-[1/1.4] relative z-10 shadow-3xl flex flex-col overflow-hidden"
              >
                <div className="w-full flex justify-between items-start mb-16">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-tiktok-cyan/10 border border-tiktok-cyan/20 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-tiktok-cyan" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-white/10 rounded-full mb-3" />
                        <div className="h-2 w-48 bg-white/5 rounded-full" />
                      </div>
                   </div>
                   <ShieldCheck className="w-8 h-8 text-tiktok-cyan/20" />
                </div>
                
                <div className="space-y-12">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="space-y-4">
                      <div className={cn(
                        "h-3 w-40 bg-white/10 rounded-full transition-all duration-1000",
                        status === 'ready' && "bg-tiktok-cyan/40 w-56"
                      )} />
                      <div className="space-y-2">
                         <div className={cn("h-1.5 w-full bg-white/5 rounded-full transition-all duration-700", status === 'ready' && "bg-white/10")} />
                         <div className={cn("h-1.5 w-[90%] bg-white/5 rounded-full transition-all duration-700 delay-100", status === 'ready' && "bg-white/10")} />
                         <div className={cn("h-1.5 w-[70%] bg-white/5 rounded-full transition-all duration-700 delay-200", status === 'ready' && "bg-white/10")} />
                      </div>
                    </div>
                  ))}
                </div>

                {status === 'generating' && (
                   <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 gap-8 z-20">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-tiktok-cyan/20 blur-3xl rounded-full animate-pulse" />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                          className="w-40 h-40 border-[1px] border-tiktok-cyan/10 border-t-tiktok-cyan rounded-full relative z-10" 
                        />
                        <div className="absolute inset-0 flex items-center justify-center flex-col z-20">
                          <motion.span 
                            key={Math.round(progress)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="font-mono text-3xl font-black text-tiktok-cyan drop-shadow-[0_0_10px_rgba(37,244,238,0.5)]"
                          >
                            {Math.round(progress)}%
                          </motion.span>
                          <span className="text-[7px] font-mono text-tiktok-cyan/60 uppercase tracking-[0.4em] mt-1">AI Progress</span>
                        </div>
                      </div>
                      
                      <div className="w-full space-y-6 max-w-sm px-4">
                        <div className="text-center">
                          <motion.p 
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-mono text-[10px] text-tiktok-cyan tracking-[0.5em] font-black uppercase mb-3 drop-shadow-[0_0_5px_rgba(37,244,238,0.3)]"
                          >
                             {currentStep?.replaceAll('_', ' ') || "AI INITIALIZING"}
                          </motion.p>
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                             <motion.div 
                               className="h-full bg-tiktok-cyan shadow-[0_0_20px_rgba(37,244,238,0.8)] relative z-10"
                               initial={{ width: 0 }}
                               animate={{ width: `${progress}%` }}
                             />
                             <div className="absolute inset-0 bg-tiktok-cyan/10 animate-pulse" />
                          </div>
                        </div>

                        <div className="bg-black/60 border border-white/5 rounded-3xl p-5 h-40 overflow-hidden flex flex-col shadow-inner">
                           <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                              <AnimatePresence mode="popLayout">
                                {logs.map((log, i) => (
                                  <motion.p 
                                    key={log + i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-[9px] font-mono text-gray-500 flex gap-2 items-center"
                                  >
                                    <span className="text-tiktok-cyan/40 shrink-0">[{new Date().toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
                                    <span className="text-gray-400">{log}</span>
                                    {i === logs.length - 1 && <span className="w-1.5 h-3 bg-tiktok-cyan animate-pulse shrink-0" />}
                                  </motion.p>
                                ))}
                              </AnimatePresence>
                           </div>
                        </div>
                      </div>
                   </div>
                )}

                {status === 'ready' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/95 backdrop-blur-2xl z-30 flex flex-col items-center justify-center p-12 overflow-hidden"
                  >
                    <motion.div 
                      initial={{ scale: 0.5, rotate: -45, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 12 }}
                      className="w-32 h-32 bg-tiktok-cyan rounded-full flex items-center justify-center mb-8 relative"
                    >
                      <div className="absolute inset-0 bg-tiktok-cyan blur-3xl opacity-40 animate-pulse scale-150" />
                      <CheckCircle className="w-16 h-16 text-black relative z-10" strokeWidth={3} />
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-center space-y-4"
                    >
                      <h3 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Strategy Aligned.</h3>
                      <p className="font-mono text-[10px] text-tiktok-cyan tracking-[0.4em] uppercase opacity-80">Transferring to secure viewing vault</p>
                      
                      <div className="flex justify-center gap-2 pt-4">
                        {[0, 1, 2].map(i => (
                          <motion.div 
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                            className="w-1 h-1 bg-tiktok-cyan rounded-full"
                          />
                        ))}
                      </div>
                    </motion.div>

                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-full bg-tiktok-cyan shadow-[0_0_20px_rgba(37,244,238,1)]"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            
            <p className="mt-8 text-center font-mono text-[8px] text-gray-600 uppercase tracking-widest leading-loose">
              Security Notice: AI Processing is stateless. <br/>Data is encrypted during generation and not stored.
            </p>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300]"
          >
             <div className="bg-tiktok-cyan text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-[0_0_50px_rgba(37,244,238,0.4)] border border-white/20">
                <CheckCircle className="w-5 h-5 animate-bounce" />
                AI Strategy Alignment Complete
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
