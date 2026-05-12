import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import CinematicBackground from './components/CinematicBackground';
import SplitHero from './components/SplitHero';
import SocialDock from './components/SocialDock';
import ProjectGrid from './components/ProjectGrid';
import ExperienceTimeline from './components/ExperienceTimeline';
import RemoteWorkGrid from './components/RemoteWorkGrid';
import AlexAI from './components/AlexAI';
import Navbar from './components/Navbar';
import AdminControls from './components/AdminControls';
import DiamondTransition from './components/DiamondTransition';
import { generateTailoredResume } from './lib/resumeAi';
import { SkillGraph } from './components/SkillGraph';
import { SectionHeading } from './components/SectionHeading';
import TechStackPage from './pages/TechStack';
import ServicesPage from './pages/Services';
import CertificationsPage from './pages/Certifications';
import ResumePage from './pages/Resume';
import ViewResumeCompletion from './pages/ViewResumeCompletion';
import { Terminal, Code, Cpu, Smartphone, Globe, Mail, Send, CheckCircle, Upload, Image as LucideImage, MessageSquare, Sparkles, Video, Github, ShieldCheck, Award, Trash2, Edit3, Pin, PinOff, Twitter, Music, Linkedin, MessageCircle, X, Briefcase, ArrowRight, RefreshCw, Loader2, Monitor } from 'lucide-react';
import { cn } from './lib/utils';
import { projects } from './data/projects';
import { experiences } from './data/experience';
import { Certification } from './types';

function AboutSection() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState<string>(() => localStorage.getItem('alex-profile-pic') || "https://picsum.photos/seed/alex-security/800/800");
  const [resumeStatus, setResumeStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

  useEffect(() => {
    const handleStorageChange = () => {
      const pic = localStorage.getItem('alex-profile-pic');
      if (pic) setProfilePic(pic);
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000); 
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const generateResume = async () => {
    setResumeStatus('generating');
    
    try {
      // Fetch certificates and projects for the resume
      const [certRes, projRes] = await Promise.all([
        fetch(`/api/certifications?t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`/api/projects?t=${Date.now()}`, { cache: 'no-store' })
      ]);
      
      const certifications = certRes.ok && certRes.headers.get('content-type')?.includes('application/json') 
        ? await certRes.json() 
        : [];
        
      const liveProjects = projRes.ok && projRes.headers.get('content-type')?.includes('application/json')
        ? await projRes.json()
        : [];
      
      // Combine static and live projects for the resume
      const allResumeProjects = [...liveProjects, ...projects.filter(sp => !liveProjects.find((ap: any) => ap.title === sp.title))];

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
        projects: allResumeProjects.map(p => ({ 
          title: p.title, 
          description: p.description, 
          tech: (p.techStack || []).join(', ')
        })),
        education: [
          {
            degree: "MSc in Financial Engineering (MScFE)",
            institution: "WorldQuant University",
            period: "Jun 2026 - 2028 (Incoming)",
            details: "Core focus on Stochastic Calculus, Risk Management, and Algorithmic Trading systems. Commencing June 8, 2026."
          },
          {
            degree: "Applied Data Science Lab",
            institution: "WorldQuant University",
            period: "May 2026 - Aug 2026 (Ongoing)",
            details: "Intensive 16-week program focused on practical machine learning applications and high-fidelity financial data processing."
          },
          {
            degree: "BSc Computer Science",
            institution: "Kirinyaga University",
            period: "2022 - 2026",
            details: "High-Performance Systems and Defensive Cloud Architecture."
          }
        ],
        certifications: certifications.map((c: any) => ({
          title: c.title,
          issuer: c.issuer,
          date: c.date
        }))
      };

      // Generate tailored content using AI directly in frontend
      const tailoredResume = await generateTailoredResume(userData, {
        description: "Specialized Quantitative Developer with a master's level understanding of financial engineering and high-frequency data pipelines.",
        keywords: "Quantitative Finance, Stochastic Calculus, Risk Analytics, Pandas, NumPy, C++, Python, High-Performance Computing"
      });

      setResumeStatus('ready');
      // Automatic Navigation once content is ready
      navigate('/view-resume', { state: { tailoredContent: tailoredResume } });
    } catch (err) {
      console.error('Resume Workflow Error:', err);
      setResumeStatus('idle');
    }
  };

  return (
    <section id="about" className="py-40 px-6 bg-bg-main relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="STRATEGIC_PRACTICE" title="Core Competencies." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="space-y-16">
            <div className="space-y-8">
              <p className="text-2xl text-gray-400 leading-tight font-medium">
                Pivoting high-performance Software Engineering into <span className="text-text-main italic underline decoration-tiktok-cyan underline-offset-8">Quantitative Development</span>. 
              </p>
              <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                Bridging core systems architecture with stochastic data-driven modeling. Specialized in building low-latency, resilient pipelines and predictive risk evaluation engines.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Cpu, label: 'Quant Eng', text: 'Stochastic Calculus & ML' },
                { icon: Code, label: 'Systems Arch', text: 'Low-Latency C++ / Rust' },
                { icon: ShieldCheck, label: 'Risk Intelligence', text: 'Predictive Modeling' },
              ].map((skill) => (
                <div 
                  key={skill.label} 
                  className="p-8 bg-card-bg border border-border-main rounded-3xl hover:border-tiktok-cyan transition-all group shadow-sm"
                >
                  <skill.icon className="w-6 h-6 text-tiktok-cyan mb-6 group-hover:scale-110 transition-transform" />
                  <h4 className="font-black text-[11px] uppercase tracking-[0.2em] text-text-main mb-2 transition-colors">{skill.label}</h4>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-relaxed">{skill.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-8">
              <button 
                onClick={generateResume}
                disabled={resumeStatus === 'generating'}
                className={cn(
                  "group relative px-14 py-6 bg-tiktok-cyan text-black font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl",
                  resumeStatus === 'generating' && "opacity-80 scale-95"
                )}
              >
                <span className="relative z-10 flex items-center gap-4">
                  {resumeStatus === 'idle' && <>View Resume <ArrowRight className="w-4 h-4" /></>}
                  {resumeStatus === 'generating' && <>Processing Lab Data... <Loader2 className="w-4 h-4 animate-spin" /></>}
                  {resumeStatus === 'ready' && <>Redirecting... <CheckCircle className="w-4 h-4" /></>}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-tiktok-cyan/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden border border-border-main shadow-2xl">
               <img 
                 src={profilePic} 
                 alt="Alex Obwogi" 
                 referrerPolicy="no-referrer"
                 className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 group-hover:scale-105"
               />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg-main to-transparent" />
               <div className="absolute bottom-12 left-12">
                  <div className="bg-card-bg/40 backdrop-blur-xl px-10 py-5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-mono text-tiktok-cyan uppercase tracking-[0.5em] font-black mb-1">Status</p>
                    <p className="text-xl font-black text-white uppercase tracking-tighter italic">Quantitative Finance Professional</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setStatus('sending');
     setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <section id="contact" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Contact Me" title="Connect Directly." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-xl text-gray-400 font-medium">
                Scanning for <span className="text-text-main font-bold italic">Quantitative Developer & Financial Engineering opportunities</span>. 
              </p>
              <p className="text-gray-500 leading-relaxed max-w-md italic">
                Bridging the gap between high-performance computing and predictive risk modeling. Let's discuss stochastic calculus implementations or high-frequency data pipeline architecture.
              </p>
            </div>
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-tiktok-red/20 flex items-center justify-center border border-tiktok-red/30 shadow-lg shadow-tiktok-red/10">
                   <Mail className="w-6 h-6 text-tiktok-red" />
                 </div>
                 <div>
                   <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Email Vector</h4>
                   <a href="mailto:obwogialex728@gmail.com" className="font-bold text-lg hover:text-tiktok-cyan transition-colors">obwogialex728@gmail.com</a>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-lg shadow-green-500/10">
                   <MessageSquare className="w-6 h-6 text-green-500" />
                 </div>
                 <div>
                   <h4 className="text-[10px] font-mono uppercase tracking-widest text-gray-500">WhatsApp High-Priority</h4>
                   <a 
                     href="https://wa.me/254706050538" 
                     target="_blank" 
                     rel="noreferrer"
                     className="font-bold text-lg hover:text-green-500 transition-colors"
                   >
                     +254 706 050 538
                   </a>
                 </div>
               </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-card-bg border border-border-main p-10 rounded-[40px] space-y-8">
             <div className="space-y-3">
               <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-700 font-black">Identity Name</label>
               <input 
                 required
                 type="text" 
                 placeholder="TRANS_PKT_NAME..." 
                 className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none transition-all text-sm font-mono text-text-main"
               />
             </div>
             <div className="space-y-3">
               <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-700 font-black">Contact Vector</label>
               <input 
                 required
                 type="email" 
                 placeholder="SRC_ADDR@CORE.COM" 
                 className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none transition-all text-sm font-mono text-text-main"
               />
             </div>
             <div className="space-y-3">
               <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-gray-700 font-black">Transmission Content</label>
               <textarea 
                 required
                 rows={4}
                 placeholder="Describe your project here..." 
                 className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none transition-all resize-none text-sm font-mono text-text-main"
               />
             </div>
             <button 
               disabled={status !== 'idle'}
               type="submit" 
               className={cn(
                 "group relative w-full h-20 bg-tiktok-cyan text-black font-black uppercase tracking-[0.3em] text-[11px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl",
                 status === 'success' && "bg-green-500 text-white"
               )}
             >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  {status === 'idle' && <>Send Transmission <Send className="w-4 h-4" /></>}
                  {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                  {status === 'success' && <>Transmission Logged <CheckCircle className="w-4 h-4" /></>}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
             </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function CertificationSection() {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    const fetchCerts = () => {
      fetch(`/api/certifications?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => {
          if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Invalid JSON');
          return res.json();
        })
        .then(data => setCerts(data))
        .catch(err => {
          console.error('Failed to fetch certifications:', err);
          setCerts([]);
        });
    };

    fetchCerts();

    const handleSync = (e: any) => {
      if (e.detail?.type?.startsWith('CERT_')) {
        console.log('[CERT_SECTION] Sync triggered by SSE');
        fetchCerts();
      }
    };

    window.addEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
    return () => window.removeEventListener('DATA_SYNC_EVENT', handleSync as EventListener);
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-32 px-6 bg-bg-main relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="VERIFIED_CREDENTIALS" title="Certifications." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, index) => (
            <motion.div
              key={cert.id || `landing-cert-${index}-${cert.title}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg border border-border-main rounded-[2rem] group hover:border-tiktok-cyan transition-all relative overflow-hidden flex flex-col"
            >
              <div className="h-40 w-full overflow-hidden relative">
                 {cert.iconUrl ? (
                   <img 
                     src={cert.iconUrl} 
                     alt={cert.title} 
                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-30 group-hover:opacity-80" 
                   />
                 ) : (
                   <div className="w-full h-full bg-white/[0.02] flex items-center justify-center">
                     <Award className="w-12 h-12 text-tiktok-cyan/10" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-card-bg to-transparent" />
              </div>

              <div className="p-8 pt-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-tiktok-cyan/10 border border-tiktok-cyan/20 flex items-center justify-center -mt-6 relative z-10 bg-card-bg p-2 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-tiktok-cyan" />
                </div>
                
                <div className="mt-6 space-y-2">
                  <h3 className="text-xl font-black text-text-main uppercase tracking-tighter group-hover:text-tiktok-cyan transition-colors">{cert.title}</h3>
                  <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{cert.issuer}</p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[9px] font-mono text-gray-700 uppercase tracking-widest font-black">{cert.date}</span>
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                     <span className="text-[8px] font-mono text-gray-700 uppercase tracking-widest">Verified</span>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IdentityBar() {
  return (
    <div className="w-full bg-card-bg border-y border-border-main py-6 overflow-hidden relative group">
      <div className="absolute inset-0 bg-tiktok-cyan/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-text-main font-bold">Current: Applied_Data_Science_Lab</span>
        </div>
        <div className="h-4 w-px bg-border-main hidden md:block" />
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-tiktok-cyan shadow-[0_0_10px_rgba(37,244,238,0.5)]" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-tiktok-cyan font-bold">Incoming: MScFE @ WorldQuant_University</span>
        </div>
        <div className="h-4 w-px bg-border-main hidden md:block" />
        <div className="flex items-center gap-4">
          <Globe className="w-4 h-4 text-gray-700" />
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-gray-700">Location: Nairobi_KE // Remote_Global</span>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [showTransition, setShowTransition] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTransition(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen">
      <DiamondTransition isVisible={showTransition} />
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main>
        <SplitHero />
        <IdentityBar />
        <AboutSection />
        
        <section id="skills" className="py-40 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <SectionHeading subtitle="TECHNICAL_FOUNDATIONS" title="The High-Performance Stack." />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2">
                <SkillGraph />
              </div>
              <div className="space-y-8">
                <div className="p-8 bg-card-bg border border-border-main rounded-[2rem] hover:border-tiktok-cyan transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-tiktok-cyan/10 flex items-center justify-center">
                      <Monitor className="text-tiktok-cyan w-5 h-5" />
                    </div>
                    <h4 className="font-bold uppercase tracking-widest text-sm">System Ops</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Real-time visualization of the interconnected tech stack. Each node represents a certified proficiency in modern full-stack development and security engineering.
                  </p>
                </div>

                <div className="p-8 bg-card-bg border border-border-main rounded-[2rem] hover:border-tiktok-red transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-tiktok-red/10 flex items-center justify-center">
                      <ShieldCheck className="text-tiktok-red w-5 h-5" />
                    </div>
                    <h4 className="font-bold uppercase tracking-widest text-sm">Security Layer</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Architecting resilient digital perimeters using AWS Security best practices and automated threat detection systems.
                  </p>
                </div>

                <div className="p-8 bg-card-bg border border-border-main rounded-[2rem] hover:border-green-500 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <Cpu className="text-green-500 w-5 h-5" />
                    </div>
                    <h4 className="font-bold uppercase tracking-widest text-sm">AI Integration</h4>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Leveraging Advanced LLMs and Vector Databases to build context-aware intelligent agents and predictive workflows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="relative overflow-hidden bg-bg-main border-y border-border-main">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-text-main/[0.03] to-transparent pointer-events-none" />
          <div className="py-40">
            <ProjectGrid limit={3} />
          </div>
        </section>

        <section id="client-work" className="bg-bg-main relative">
          <div className="max-w-7xl mx-auto px-6 py-40">
            <SectionHeading subtitle="ENTERPRISE_PARTNERSHIPS" title="Enterprise Partnerships & Solutions." />
            <RemoteWorkGrid />
          </div>
        </section>
        <section id="experience" className="bg-bg-main relative">
          <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
            <SectionHeading subtitle="Career Timeline" title="Expertise Timeline." />
          </div>
          <ExperienceTimeline />
        </section>
        <ContactSection />
      </main>

      <footer className="bg-bg-main py-40 border-t border-border-main">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-16">
           <div className="flex items-center space-x-4">
             <Sparkles className="w-5 h-5 text-text-main animate-pulse" />
             <span className="font-mono text-[10px] tracking-[0.5em] text-gray-700 uppercase font-bold">© 2026 Alex Nyangaresi Obwogi Portfolio</span>
           </div>
           <div className="flex flex-wrap gap-8 justify-center">
             {[
               { name: 'GitHub', url: 'https://github.com/AlexObwogi' },
               { name: 'Twitter', url: 'https://twitter.com' },
               { name: 'TikTok', url: 'https://tiktok.com' },
               { name: 'Hashnode', url: 'https://hashnode.com/@alexobwogi' },
               { name: 'LinkedIn', url: 'https://linkedin.com/in/alex-obwogi-8a62113a5' },
               { name: 'WhatsApp', url: 'https://wa.me/254706050538' }
             ].map((social) => (
                <div key={social.name} className="relative group">
                  <a href={social.url} target="_blank" rel="noreferrer" className="text-xs font-mono uppercase tracking-widest text-gray-700 hover:text-tiktok-cyan transition-colors">
                    {social.name}
                  </a>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-card-bg backdrop-blur-md rounded-lg text-[10px] text-text-main opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-border-main">
                    Follow {social.name}
                  </div>
                </div>
             ))}
           </div>
        </div>
      </footer>
    </div>
  );
}

function AdminPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [projectUploadStatus, setProjectUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [clientUploadStatus, setClientUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [certUploadStatus, setCertUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [projectError, setProjectError] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // New States for local project info
  const [projectTitle, setProjectTitle] = useState('');
  const [projectMeta, setProjectMeta] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [projectLanguages, setProjectLanguages] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [githubUsername, setGithubUsername] = useState('AlexObwogi');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allCerts, setAllCerts] = useState<any[]>([]);
  const [allClientWorks, setAllClientWorks] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);

  useEffect(() => {
    const handleSync = () => {
      if (isLoggedIn) {
        console.log('[ADMIN_SYNC] Refreshing data from SSE event');
        fetchAllData();
        fetch(`/api/stats?t=${Date.now()}`, { cache: 'no-store' })
          .then(res => res.json())
          .then(s => setStats(s))
          .catch(() => {});
      }
    };
    window.addEventListener('DATA_SYNC_EVENT', handleSync);
    return () => window.removeEventListener('DATA_SYNC_EVENT', handleSync);
  }, [isLoggedIn]);

  // Client Work States
  const [clientWorkTitle, setClientWorkTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientWorkDesc, setClientWorkDesc] = useState('');
  const [clientPlatform, setClientPlatform] = useState('');
  const [clientServiceType, setClientServiceType] = useState(''); // New State
  const [clientWorkDate, setClientWorkDate] = useState('');
  const [clientTechStack, setClientTechStack] = useState('');
  const [clientLiveUrl, setClientLiveUrl] = useState('');
  const [clientImageFile, setClientImageFile] = useState<File | null>(null);
  const [clientVideoFile, setClientVideoFile] = useState<File | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLoggedIn(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Certification upload states
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certIcon, setCertIcon] = useState<File | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      // Fetch stats and projects on login
      fetch(`/api/stats?t=${Date.now()}`, { cache: 'no-store' })
        .then(res => {
          if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Invalid JSON');
          return res.json();
        })
        .then(data => setStats(data))
        .catch(err => {
          console.error('Failed to fetch stats:', err);
          setStats(null);
        });

      fetchAllData();
    }
  }, [isLoggedIn]);

  const handleFetchRepos = async () => {
    if (!githubUsername) return;
    setIsLoadingRepos(true);
    setGithubRepos([]); // Clear previous
    try {
      const res = await fetch(`/api/github/repos/${githubUsername}`);
      if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Failed to fetch repositories: Invalid response');
      }
      const data = await res.json();
      setGithubRepos(Array.isArray(data) ? data : []);
      if (data.length === 0) setError('NO_REPOS_FOUND');
    } catch (error) {
      console.error('Failed to fetch repos:', error);
      setError('GITHUB_FETCH_FAILED :: CHECK_USERNAME_OR_LIMITS');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const lastFetchRef = useRef<number>(0);
  const fetchAllData = async () => {
    // Throttling: avoid fetching more than once every 2 seconds unless forced
    const now = Date.now();
    if (now - lastFetchRef.current < 2000) {
      console.log('[ADMIN_SYNC] Throttle active, skipping fetch');
      return;
    }
    lastFetchRef.current = now;

    try {
      const [pRes, cRes, cwRes] = await Promise.all([
        fetch(`/api/projects?t=${now}`, { cache: 'no-store' }),
        fetch(`/api/certifications?t=${now}`, { cache: 'no-store' }),
        fetch(`/api/client-work?t=${now}`, { cache: 'no-store' })
      ]);
      
      if (pRes.ok && pRes.headers.get('content-type')?.includes('application/json')) {
        setAllProjects(await pRes.json());
      }
      if (cRes.ok && cRes.headers.get('content-type')?.includes('application/json')) {
        setAllCerts(await cRes.json());
      }
      if (cwRes.ok && cwRes.headers.get('content-type')?.includes('application/json')) {
        setAllClientWorks(await cwRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        const errorText = await response.text();
        console.error('Login failed with non-JSON response:', errorText);
        setError('ACCESS_DENIED :: SERVER_COMM_ERROR');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setIsLoggedIn(true);
        localStorage.setItem('admin-token', data.token);
        setError('');
      } else {
        setError(data.error || 'ACCESS_DENIED :: INVALID_KEY');
      }
    } catch (err) {
      setError('COMM_ERROR :: LINE_DISCONNECTED');
    }
  };

  const handleUpload = async () => {
    if (!projectTitle || !projectMeta || !repoLink || !liveLink) {
      setProjectError('MISSING_FIELDS :: TITLE_META_REPO_AND_LIVE_REQUIRED');
      return;
    }
    
    setProjectError(null);
    setProjectUploadStatus('uploading');

    try {
      let imageUrl = editingProject?.imageUrl || '';
      let videoUrl = editingProject?.videoUrl || '';

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok && uploadRes.headers.get('content-type')?.includes('application/json')) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
      }

      if (selectedVideo) {
        const formData = new FormData();
        formData.append('file', selectedVideo);
        const vidRes = await fetch('/api/admin/upload-video', {
          method: 'POST',
          body: formData
        });
        if (vidRes.ok && vidRes.headers.get('content-type')?.includes('application/json')) {
          const vidData = await vidRes.json();
          videoUrl = vidData.url;
        }
      }

        const projectPayload = {
        title: projectTitle,
        description: projectMeta.slice(0, 500), 
        technicalSummary: projectMeta,
        repoUrl: repoLink,
        liveUrl: liveLink,
        imageUrl: imageUrl || `https://picsum.photos/seed/${projectTitle}/1920/1080`,
        videoUrl: videoUrl,
        languages: projectLanguages.split(',').map(s => s.trim()).filter(Boolean), 
        techStack: projectTechStack.split(',').map(s => s.trim()).filter(Boolean),
        aiDocsAnalysis: 'Architecture verified by Alex.',
        isPinned: editingProject?.isPinned || false
      };

      const url = editingProject ? `/api/admin/projects/${editingProject._id}` : '/api/admin/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const saveRes = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectPayload)
      });

      if (!saveRes.ok) throw new Error('Database save failed');

      setProjectUploadStatus('success');
      fetchAllData();
      
      setTimeout(() => {
        setProjectUploadStatus('idle');
        setSelectedFile(null);
        setSelectedVideo(null);
        setProjectTitle('');
        setProjectMeta('');
        setRepoLink('');
        setLiveLink('');
        setEditingProject(null);
      }, 3000);
    } catch (err) {
      setProjectError('UPLOAD_FAILED :: CLOUD_SYNC_ERROR');
      setProjectUploadStatus('idle');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Confirm deletion of Project Vector?')) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAllData();
  };

  const handleDeleteCert = async (id: string) => {
    if (!window.confirm('Confirm deletion of Credential?')) return;
    const res = await fetch(`/api/admin/certifications/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAllData();
  };

  const handleDeleteClientWork = async (id: string) => {
    if (!window.confirm('Confirm deletion of Client Module?')) return;
    const res = await fetch(`/api/admin/client-work/${id}`, { method: 'DELETE' });
    if (res.ok) fetchAllData();
  };

  const togglePin = async (project: any) => {
    const res = await fetch(`/api/admin/projects/${project._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...project, isPinned: !project.isPinned })
    });
    if (res.ok) fetchAllData();
  };

  const handleProfileUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setProfilePic(dataUrl);
          localStorage.setItem('alex-profile-pic', dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCertificationUpload = async () => {
    if (!certTitle || !certIssuer || !certDate) {
      setCertError('MISSING_FIELDS :: CERT_TITLE_ISSUER_DATE_REQUIRED');
      return;
    }
    
    setCertUploadStatus('uploading');
    setCertError(null);
    try {
      let iconUrl = '';
      if (certIcon) {
        const formData = new FormData();
        formData.append('file', certIcon);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok && uploadRes.headers.get('content-type')?.includes('application/json')) {
          const data = await uploadRes.json();
          iconUrl = data.url;
        }
      }

      const res = await fetch('/api/admin/certifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: certTitle,
          issuer: certIssuer,
          date: certDate,
          iconUrl
        })
      });

      if (res.ok) {
        setCertUploadStatus('success');
        fetchAllData();
        setTimeout(() => {
          setCertUploadStatus('idle');
          setCertTitle('');
          setCertIssuer('');
          setCertDate('');
          setCertIcon(null);
        }, 3000);
      }
    } catch (err) {
      setCertError('CERT_UPLOAD_FAILED :: OVERRIDE_ERROR');
      setCertUploadStatus('idle');
    }
  };

  const handleClientWorkUpload = async () => {
    if (!clientWorkTitle || !clientName) {
      setClientError('MISSING_FIELDS :: CLIENT_WORK_TITLE_AND_NAME_REQUIRED');
      return;
    }

    setClientUploadStatus('uploading');
    setClientError(null);
    try {
      let imageUrl = '';
      let videoUrl = '';

      if (clientImageFile) {
        const formData = new FormData();
        formData.append('file', clientImageFile);
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          imageUrl = data.url;
        }
      }

      if (clientVideoFile) {
        const formData = new FormData();
        formData.append('file', clientVideoFile);
        const res = await fetch('/api/admin/upload-video', { method: 'POST', body: formData });
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          const data = await res.json();
          videoUrl = data.url;
        }
      }

      const res = await fetch('/api/admin/client-work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: clientWorkTitle,
          clientName: clientName,
          description: clientWorkDesc,
          platform: clientPlatform,
          serviceType: clientServiceType, // New Field
          date: clientWorkDate,
          techStack: clientTechStack ? clientTechStack.split(',').map(s => s.trim()).filter(Boolean) : [],
          liveUrl: clientLiveUrl,
          imageUrl,
          videoUrl
        })
      });

      if (res.ok) {
        setClientUploadStatus('success');
        fetchAllData();
        setTimeout(() => {
          setClientUploadStatus('idle');
          setClientWorkTitle('');
          setClientName('');
          setClientWorkDesc('');
          setClientPlatform('');
          setClientWorkDate('');
          setClientTechStack('');
          setClientLiveUrl('');
          setClientImageFile(null);
          setClientVideoFile(null);
        }, 3000);
      }
    } catch (err) {
      setClientError('CLIENT_WORK_UPLOAD_FAILED');
      setClientUploadStatus('idle');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 font-sans">
        <Navbar toggleTheme={toggleTheme} isDark={isDark} />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/[0.02] border border-white/5 rounded-[48px] shadow-2xl space-y-8 p-12"
        >
          <div className="flex flex-col items-center space-y-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Secure Portal</h1>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest text-center">Authentication Required</p>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest ml-1">Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••••••" 
                className={cn(
                  "w-full bg-black/80 border p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-center tracking-[0.5em] font-mono text-white placeholder-gray-500",
                  error ? "border-red-500" : "border-white/10"
                )} 
              />
              {error && <p className="text-red-500 text-[9px] font-mono text-center mt-1 uppercase tracking-widest">{error}</p>}
            </div>
            <button 
              onClick={handleLogin}
              className="w-full h-14 rounded-full bg-white text-black font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
            >
              Initialize Override
            </button>
          </div>
          <p className="text-[9px] text-gray-700 text-center uppercase tracking-widest leading-relaxed">
            Warning: Remote trace active. Unauthorized attempts are logged.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main p-6 lg:p-12 font-sans pt-32">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-4xl mx-auto space-y-12 pb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
             <span className="text-xs font-mono text-white/50 uppercase tracking-widest block mb-2">Internal Management</span>
             <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter">Command Center.</h1>
           </div>
           <button onClick={() => setIsLoggedIn(false)} className="text-[10px] font-mono uppercase tracking-widest text-tiktok-red hover:text-white transition-colors">
              Terminate Session [ESC]
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card-bg border border-border-main p-12 rounded-[48px] space-y-10 group hover:border-tiktok-cyan transition-all text-text-main shadow-2xl">
              <div className="flex items-center gap-3">
                 <Upload className="w-5 h-5 text-tiktok-cyan" />
                 <h2 className="font-bold uppercase tracking-widest text-sm text-text-main">Upload Project Scape</h2>
              </div>
              
              <div className="space-y-6">
                  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                    <div className="space-y-4">
                       <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-black flex items-center gap-2">
                         System Identity (GitHub) <Github className="w-3 h-3 text-tiktok-cyan" />
                       </label>
                       <div className="flex flex-col sm:flex-row gap-3">
                         <input 
                            type="text" 
                            value={githubUsername}
                            onChange={(e) => setGithubUsername(e.target.value)}
                            placeholder="AlexObwogi..." 
                            className="flex-1 bg-black/40 border border-border-main p-4 rounded-xl focus:border-tiktok-cyan outline-none text-[12px] text-text-main font-mono min-w-0" 
                         />
                         <button 
                            onClick={handleFetchRepos}
                            disabled={isLoadingRepos || !githubUsername}
                            className="px-6 h-[52px] rounded-xl bg-tiktok-cyan text-black text-[10px] uppercase font-black tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,244,238,0.2)] flex-shrink-0"
                         >
                           {isLoadingRepos ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <RefreshCw className="w-4 h-4 text-black" />}
                           Sync
                         </button>
                       </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em] font-black flex items-center justify-between">
                        <span>Repository Sync {githubRepos.length > 0 && `(${githubRepos.length} Found)`}</span>
                        <div className={cn("w-2 h-2 rounded-full", githubRepos.length > 0 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-gray-800")} />
                      </label>
                      <div className="relative group">
                          <select 
                            onChange={(e) => {
                              const repo = githubRepos.find(r => r.name === e.target.value);
                              if (repo) {
                                setProjectTitle(repo.name);
                                setProjectMeta(repo.description || '');
                                setRepoLink(repo.html_url);
                                // Auto-populate languages and tech stack
                                if (repo.language) setProjectLanguages(repo.language);
                                if (repo.topics && repo.topics.length > 0) {
                                  setProjectTechStack(repo.topics.join(', '));
                                }
                              }
                            }}
                            className="w-full bg-bg-main border border-border-main p-4 rounded-xl focus:border-tiktok-cyan outline-none text-[12px] text-text-main font-mono appearance-none cursor-pointer hover:border-tiktok-cyan/50 transition-colors pr-10"
                          >
                            <option value="" className="bg-bg-main text-text-main text-black dark:text-white">Select Vector Repository...</option>
                            {githubRepos.map(repo => (
                              <option key={repo.id} value={repo.name} className="bg-bg-main text-text-main text-black dark:text-white">
                                {repo.name.toUpperCase()} {repo.language ? `[${repo.language}]` : ''}
                              </option>
                            ))}
                          </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover:text-tiktok-cyan transition-colors">
                           <ArrowRight className="w-4 h-4 rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project Title</label>
                     <input 
                        type="text" 
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Smart Rent AI Platform" 
                        className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Languages (comma separated)</label>
                       <input 
                          type="text" 
                          value={projectLanguages}
                          onChange={(e) => setProjectLanguages(e.target.value)}
                          placeholder="TypeScript, Python..." 
                          className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Tech Stack (comma separated)</label>
                       <input 
                          type="text" 
                          value={projectTechStack}
                          onChange={(e) => setProjectTechStack(e.target.value)}
                          placeholder="React, AWS, Docker..." 
                          className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                       />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Screenshot (Image)</label>
                       <div className="group relative w-full h-32 border-2 border-dashed border-border-main rounded-3xl hover:border-tiktok-cyan hover:bg-card-bg transition-all flex flex-col items-center justify-center cursor-pointer">
                          <LucideImage className={cn("w-6 h-6 transition-colors", selectedFile ? "text-tiktok-cyan" : "text-gray-600 group-hover:text-tiktok-cyan")} />
                          <p className="mt-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest text-center px-2">
                            {selectedFile ? selectedFile.name : 'Image Upload'}
                          </p>
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Demo Video</label>
                       <div className="group relative w-full h-32 border-2 border-dashed border-border-main rounded-3xl hover:border-tiktok-cyan hover:bg-card-bg transition-all flex flex-col items-center justify-center cursor-pointer">
                          <Video className={cn("w-6 h-6 transition-colors", selectedVideo ? "text-tiktok-cyan" : "text-gray-600 group-hover:text-tiktok-cyan")} />
                          <p className="mt-2 text-[9px] font-mono text-gray-500 uppercase tracking-widest text-center px-2">
                            {selectedVideo ? selectedVideo.name : 'Video Upload'}
                          </p>
                          <input 
                            type="file" 
                            accept="video/*"
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
                          />
                       </div>
                    </div>
                  </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project Meta</label>
                   <textarea 
                      rows={3} 
                      value={projectMeta}
                      onChange={(e) => setProjectMeta(e.target.value)}
                      placeholder="Enter architecture breakdown..." 
                      className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none resize-none font-mono text-sm text-text-main" 
                   />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">GitHub Repo URL</label>
                      <input 
                          type="text" 
                          value={repoLink}
                          onChange={(e) => setRepoLink(e.target.value)}
                          placeholder="https://github.com/..." 
                          className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-[12px] text-text-main" 
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Live Project URL</label>
                      <input 
                          type="text" 
                          value={liveLink}
                          onChange={(e) => setLiveLink(e.target.value)}
                          placeholder="https://..." 
                          className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-[12px] text-text-main" 
                      />
                  </div>
                </div>

                {projectError && <p className="text-tiktok-red text-[9px] font-mono uppercase tracking-widest font-black">{projectError}</p>}
 
                <button 
                  onClick={handleUpload}
                  className={cn(
                    "w-full h-14 rounded-full font-black uppercase tracking-widest transition-all shadow-lg",
                    projectUploadStatus === 'success' ? "bg-green-500 text-white" : "bg-tiktok-cyan text-black hover:scale-[1.02]"
                  )}
                >
                  {projectUploadStatus === 'idle' && <>Deploy Project <Send className="w-4 h-4 ml-2" /></>}
                  {projectUploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  {projectUploadStatus === 'success' && <>Deployment Triggered <CheckCircle className="w-4 h-4 ml-2" /></>}
                </button>
              </div>
           </div>

           <div className="space-y-8">
               <div className="bg-card-bg border border-border-main p-8 rounded-[40px]">
                  <h3 className="text-xs font-mono text-tiktok-cyan uppercase tracking-widest mb-4">Profile Picture</h3>
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-3xl bg-bg-main border border-border-main overflow-hidden relative group">
                       {profilePic ? (
                         <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <LucideImage className="w-8 h-8 text-gray-700 absolute inset-0 m-auto" />
                       )}
                       <input 
                          type="file" 
                          onChange={handleProfileUpdate}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                       />
                       <div className="absolute inset-0 bg-tiktok-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[9px] font-bold text-text-main uppercase">Update</span>
                       </div>
                    </div>
                    <div className="flex-1 space-y-1">
                       <h4 className="font-bold text-text-main uppercase text-sm">Alex Nyangaresi Obwogi</h4>
                       <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Digital Twin ID: #7280538</p>
                    </div>
                 </div>
              </div>

              <div className="bg-card-bg border border-border-main p-8 rounded-[40px]">
                 <h3 className="text-xs font-mono text-text-main uppercase tracking-widest mb-4">Core Telemetry</h3>
                 <div className="space-y-6">
                    {[
                      { label: 'Role', val: 'Administrator' },
                      { label: 'Projects', val: allProjects.length.toString() },
                      { label: 'Health', val: 'Operational' },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-end justify-between border-b border-border-main pb-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        <span className="text-xl font-bold text-text-main">{stat.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-card-bg border border-border-main p-8 rounded-[40px]">
                 <h3 className="text-xs font-mono text-text-main uppercase tracking-widest mb-4">Stack Details</h3>
                 <div className="flex flex-wrap gap-2">
                    {['Linux', 'AWS Security', 'Python', 'Cloud Infrastructure', 'DevOps'].map(mod => (
                      <span key={mod} className="px-3 py-1 rounded-full bg-card-bg border border-border-main text-[9px] font-mono font-bold tracking-widest text-gray-400">
                        {mod}
                      </span>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-card-bg border border-border-main p-12 rounded-[48px] space-y-10 group hover:border-tiktok-cyan transition-all text-text-main shadow-2xl mt-12">
           <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-tiktok-cyan" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Upload Credentials (Certifications)</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Certification Title</label>
                <input 
                   type="text" 
                   value={certTitle}
                   onChange={(e) => setCertTitle(e.target.value)}
                   placeholder="e.g. AWS Security Specialty" 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Issuing Authority</label>
                <input 
                   type="text" 
                   value={certIssuer}
                   onChange={(e) => setCertIssuer(e.target.value)}
                   placeholder="e.g. Amazon Web Services" 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Date Issued</label>
                <input 
                   type="text" 
                   value={certDate}
                   onChange={(e) => setCertDate(e.target.value)}
                   placeholder="MAY 2026..." 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
               <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Cert Badge / Icon</label>
               <div className="group relative w-full h-14 border-2 border-dashed border-border-main rounded-2xl hover:border-tiktok-cyan hover:bg-card-bg transition-all flex items-center justify-center cursor-pointer">
                 <LucideImage className={cn("w-4 h-4 mr-3", certIcon ? "text-tiktok-cyan" : "text-gray-600")} />
                 <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                   {certIcon ? certIcon.name : 'Upload Icon'}
                 </span>
                 <input 
                   type="file" 
                   className="absolute inset-0 opacity-0 cursor-pointer" 
                   onChange={(e) => setCertIcon(e.target.files?.[0] || null)}
                 />
               </div>
             </div>
           </div>

           <button 
              onClick={handleCertificationUpload}
              className={cn(
                "w-full h-14 rounded-full font-black uppercase tracking-widest transition-all shadow-lg",
                certUploadStatus === 'success' ? "bg-green-500 text-white" : "bg-white text-black hover:scale-[1.02]"
              )}
           >
              {certUploadStatus === 'idle' && <>Verify & Upload Certification <Award className="w-4 h-4 ml-2" /></>}
              {certUploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {certUploadStatus === 'success' && <>Credential Indexed Successfully <CheckCircle className="w-4 h-4 ml-2" /></>}
           </button>
        </div>

        <div className="bg-card-bg border border-border-main p-12 rounded-[48px] space-y-10 group hover:border-tiktok-cyan transition-all text-text-main shadow-2xl mt-12">
           <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-tiktok-cyan" />
              <h2 className="font-bold uppercase tracking-widest text-sm">Online Client Work (Remote Ops)</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project Title</label>
                <input 
                   type="text" 
                   value={clientWorkTitle}
                   onChange={(e) => setClientWorkTitle(e.target.value)}
                   placeholder="e.g. E-commerce Strategy" 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Client Name</label>
                <input 
                   type="text" 
                   value={clientName}
                   onChange={(e) => setClientName(e.target.value)}
                   placeholder="e.g. Upwork Enterprise" 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Platform</label>
                <input 
                   type="text" 
                   value={clientPlatform}
                   onChange={(e) => setClientPlatform(e.target.value)}
                   placeholder="e.g. Remote Hub" 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Service Category</label>
                <select 
                   value={clientServiceType}
                   onChange={(e) => setClientServiceType(e.target.value)}
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main"
                >
                   <option value="" className="bg-bg-main text-text-main">Link to Service...</option>
                   <option value="Security Automation" className="bg-bg-main text-text-main">Security Automation</option>
                   <option value="Fullstack Systems" className="bg-bg-main text-text-main">Fullstack Systems</option>
                   <option value="Cloud Infrastructure" className="bg-bg-main text-text-main">Cloud Infrastructure</option>
                   <option value="Secure Backend Design" className="bg-bg-main text-text-main">Secure Backend Design</option>
                </select>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Photo Evidence</label>
                <div className="group relative w-full h-24 border-2 border-dashed border-border-main rounded-2xl hover:border-tiktok-cyan hover:bg-card-bg transition-all flex items-center justify-center cursor-pointer">
                   <LucideImage className={cn("w-4 h-4 mr-3", clientImageFile ? "text-tiktok-cyan" : "text-gray-600")} />
                   <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                     {clientImageFile ? clientImageFile.name : 'Upload Work Photo'}
                   </span>
                   <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setClientImageFile(e.target.files?.[0] || null)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Video Demo</label>
                <div className="group relative w-full h-24 border-2 border-dashed border-border-main rounded-2xl hover:border-tiktok-cyan hover:bg-card-bg transition-all flex items-center justify-center cursor-pointer">
                   <Video className={cn("w-4 h-4 mr-3", clientVideoFile ? "text-tiktok-cyan" : "text-gray-600")} />
                   <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                     {clientVideoFile ? clientVideoFile.name : 'Upload Work Video'}
                   </span>
                   <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setClientVideoFile(e.target.files?.[0] || null)} />
                </div>
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">About Project</label>
              <textarea 
                 rows={3} 
                 value={clientWorkDesc}
                 onChange={(e) => setClientWorkDesc(e.target.value)}
                 placeholder="Describe the remote operation scope..." 
                 className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none resize-none font-mono text-sm text-text-main" 
              />
           </div>

           <button 
              onClick={handleClientWorkUpload}
              className={cn(
                "w-full h-14 rounded-full font-black uppercase tracking-widest transition-all shadow-lg",
                clientUploadStatus === 'success' ? "bg-green-500 text-white" : "bg-tiktok-cyan text-black hover:scale-[1.02]"
              )}
           >
              {clientUploadStatus === 'idle' && <>Synchronize Client Work <Send className="w-4 h-4 ml-2" /></>}
              {clientUploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {clientUploadStatus === 'success' && <>Client Module Indexed Successfully <CheckCircle className="w-4 h-4 ml-2" /></>}
           </button>
        </div>

        <AdminControls 
          allProjects={allProjects}
          allCerts={allCerts}
          togglePin={togglePin}
          setEditingProject={setEditingProject}
          setProjectTitle={setProjectTitle}
          setProjectMeta={setProjectMeta}
          setRepoLink={setRepoLink}
          setLiveLink={setLiveLink}
          handleDeleteProject={handleDeleteProject}
          handleDeleteCert={handleDeleteCert}
        />

        <div className="bg-card-bg border border-border-main p-10 rounded-[48px] space-y-8 shadow-2xl overflow-hidden mt-12">
            <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-text-main">
              <Briefcase className="w-4 h-4 text-tiktok-cyan" /> Client Work Sync Inventory
            </h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar px-2">
              {allClientWorks.map((work) => (
                <div key={work._id} className="p-6 bg-bg-main rounded-3xl border border-border-main flex items-center justify-between group hover:border-tiktok-cyan/50 transition-all text-text-main">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-bg-main border border-border-main">
                      {work.imageUrl && <img src={work.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tighter">{work.title}</h4>
                      <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                        {work.clientName} // {work.platform} // {work.serviceType || 'NO_CATEGORY'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteClientWork(work._id)}
                      className="p-3 bg-tiktok-red/5 rounded-xl border border-border-main text-gray-500 hover:text-tiktok-red hover:border-tiktok-red transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {allClientWorks.length === 0 && <p className="text-xs text-gray-600 font-mono text-center py-10 uppercase tracking-widest">No Client Missions Indexed.</p>}
            </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const [activeProject, setActiveProject] = useState<any>(null);
  const [modalType, setModalType] = useState<'summary' | 'docs' | null>(null);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#view-')) {
        const titleSlug = hash.replace('#view-', '');
        const project = projects.find(p => p.title.toLowerCase().replace(/\s+/g, '-') === titleSlug);
        if (project) {
          setActiveProject(project);
          setModalType('summary');
        }
      } else {
        setActiveProject(null);
        setModalType(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const closeProjectModal = () => {
    window.location.hash = '';
    setActiveProject(null);
    setModalType(null);
  };

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    // SSE Real-time Synchronization (Root level)
    let eventSource: EventSource | null = null;
    let retryTimeout: NodeJS.Timeout | null = null;
    let retryDelay = 1000;

    const connectSSE = () => {
      if (eventSource) eventSource.close();
      
      console.log('[APP_SSE] Connecting to event stream...');
      eventSource = new EventSource('/api/admin/events');
      
      eventSource.onopen = () => {
        console.log('[APP_SSE] Stream established');
        retryDelay = 1000;
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'CONNECTED') return;
          console.log('[APP_SSE] Received Event:', data.type);
          window.dispatchEvent(new CustomEvent('DATA_SYNC_EVENT', { detail: data }));
        } catch (err) {
          console.error('[APP_SSE] Error parsing event:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.warn('[APP_SSE] Stream disrupted. Reconnecting in', retryDelay, 'ms');
        eventSource?.close();
        if (retryTimeout) clearTimeout(retryTimeout);
        retryTimeout = setTimeout(() => {
          retryDelay = Math.min(retryDelay * 2, 30000); // Backoff
          connectSSE();
        }, retryDelay);
      };
    };

    connectSSE();

    return () => {
      if (eventSource) eventSource.close();
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, []);

  return (
    <Router>
      <div className="relative min-h-screen">
        <CinematicBackground isDark={isDark} />
        <SocialDock />
        <AlexAI />

        <AnimatePresence>
          {activeProject && modalType && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[999] flex items-center justify-center p-4 lg:p-6 pointer-events-auto"
            >
              <div 
                className="absolute inset-0 bg-black/95 backdrop-blur-3xl cursor-pointer" 
                onClick={closeProjectModal}
              />
              
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-black border border-white/20 rounded-[40px] w-full max-w-4xl overflow-hidden shadow-[0_0_150px_rgba(37,244,238,0.1)] p-1 max-h-[90vh] overflow-y-auto relative z-[1000] pointer-events-auto"
              >
                 <div className="p-6 lg:p-8 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/90 backdrop-blur-md z-[520]">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <Terminal className="w-4 h-4 text-tiktok-cyan" />
                      </div>
                      <span className="font-mono text-[9px] text-tiktok-cyan uppercase tracking-[0.3em] font-black">
                        {modalType === 'summary' ? 'Technical Architecture' : 'Project Insights'}
                      </span>
                    </div>
                    <button 
                      onClick={closeProjectModal} 
                      className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:text-tiktok-red hover:bg-tiktok-red/20 transition-all cursor-pointer shadow-xl relative z-[1010] active:scale-90"
                    >
                      <X className="w-6 h-6 pointer-events-none" />
                    </button>
                 </div>
                 <div className="p-6 lg:p-12 space-y-10 selection:bg-tiktok-cyan selection:text-black">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                      <h3 className="text-4xl lg:text-6xl font-black text-white tracking-widest uppercase leading-none">{activeProject.title}</h3>
                      <div className="flex gap-4">
                        <a href={activeProject.liveUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-black bg-tiktok-cyan px-6 py-3 rounded-full hover:scale-105 transition-all font-black uppercase tracking-widest">Live</a>
                        <a href={activeProject.repoUrl} target="_blank" rel="noreferrer" className="text-[9px] font-mono text-white border border-white/10 px-6 py-3 rounded-full hover:bg-white/5 transition-all font-black uppercase tracking-widest">Repo</a>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-8 lg:p-10 rounded-[40px] font-mono text-sm leading-relaxed text-gray-400">
                       <p className="text-tiktok-cyan mb-8 uppercase tracking-[0.3em] text-[9px] font-black flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan animate-pulse" />
                          Security Analysis
                       </p>
                       <div className="prose prose-invert max-w-none text-xs lg:text-sm text-gray-400">
                         {activeProject.technicalSummary || activeProject.description}
                       </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from(new Set((activeProject.techStack || []).map((t: string) => t.trim()))).map((tech: string, i: number) => (
                        <div key={`${tech}-${i}`} className="p-6 bg-white/5 border border-white/10 rounded-[32px] flex items-center gap-3">
                           <div className="w-1 h-1 rounded-full bg-tiktok-cyan/50" />
                           <span className="text-[10px] font-mono text-gray-400 font-bold uppercase tracking-widest">{tech}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-6">
                       <button 
                         onClick={closeProjectModal}
                         className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-white/20"
                       >
                          Close_Session
                       </button>
                    </div>
                 </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Routes>
        <Route path="/" element={<LandingPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/admin" element={<AdminPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/tech-stack" element={<TechStackPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/services" element={<ServicesPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/credentials" element={<CertificationsPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/resume" element={<ResumePage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/view-resume" element={<ViewResumeCompletion toggleTheme={toggleTheme} isDark={isDark} />} />
      </Routes>
      </div>
    </Router>
  );
}
