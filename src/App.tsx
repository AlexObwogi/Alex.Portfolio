import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import CinematicBackground from './components/CinematicBackground';
import SplitHero from './components/SplitHero';
import SocialDock from './components/SocialDock';
import ProjectGrid from './components/ProjectGrid';
import ExperienceTimeline from './components/ExperienceTimeline';
import AlexAI from './components/AlexAI';
import Navbar from './components/Navbar';
import AdminControls from './components/AdminControls';
import DiamondTransition from './components/DiamondTransition';
import TechStackPage from './pages/TechStack';
import ServicesPage from './pages/Services';
import { Terminal, Code, Cpu, Smartphone, Globe, Mail, Send, CheckCircle, Upload, Image as LucideImage, MessageSquare, Sparkles, Video, Github, ShieldCheck, Award, Trash2, Edit3, Pin, PinOff } from 'lucide-react';
import { cn } from './lib/utils';
import { projects } from './data/projects';

interface Certification {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  iconUrl?: string;
}

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

import { jsPDF } from 'jspdf';
import { experiences } from './data/experience';

function AboutSection() {
  const [profilePic, setProfilePic] = useState<string>(() => localStorage.getItem('alex-profile-pic') || "https://picsum.photos/seed/alex-security/800/800");
  const [resumeStatus, setResumeStatus] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [showNotification, setShowNotification] = useState(false);

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
    
    // Simulate smart analysis 
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setResumeStatus('ready');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 6000);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(22);
    doc.text('ALEX NYANGARESI OBWOGI', 20, 20);
    doc.setFontSize(14);
    doc.text('Lead Security Engineer & Fullstack Architect', 20, 30);
    
    // Summary
    doc.setFontSize(16);
    doc.text('PROFESSIONAL SUMMARY', 20, 45);
    doc.setFontSize(10);
    const summary = "Highly skilled Software Engineer specializing in high-performance digital ecosystems and cloud defense. Expert in MERN stack, AWS Security, and DevOps automation.";
    doc.text(doc.splitTextToSize(summary, 170), 20, 52);
    
    // Experience
    doc.setFontSize(16);
    doc.text('TECHNICAL EXPERIENCE', 20, 70);
    let y = 80;
    experiences.slice(0, 4).forEach(exp => {
      doc.setFontSize(12);
      doc.text(`${exp.role} - ${exp.company}`, 20, y);
      doc.setFontSize(10);
      doc.text(exp.period, 20, y + 5);
      const desc = doc.splitTextToSize(exp.description, 170);
      doc.text(desc, 20, y + 10);
      y += 15 + (desc.length * 5);
    });

    // Save
    doc.save('Alex_Obwogi_Resume.pdf');
    setResumeStatus('idle');
  };

  return (
    <section id="about" className="py-32 px-6 bg-bg-main">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="LAB_PROFILE" title="Engineering Core." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <p className="text-xl text-gray-400 leading-relaxed font-medium">
                Focused on delivering <span className="text-text-main">Production-Grade Security Architectures</span>. My expertise lies in building resilient fullstack applications and automated security perimeters that mitigate modern threat vectors.
              </p>
              <p className="text-lg text-tiktok-cyan font-mono italic border-l-2 border-tiktok-cyan pl-6 bg-tiktok-cyan/5 py-4 rounded-r-2xl">
                Advancing towards Senior Security Engineering leadership.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Smartphone, label: 'Systems', text: 'Linux Hardening & Bash' },
                { icon: Code, label: 'Automation', text: 'Defensive Python' },
                { icon: Cpu, label: 'Cloud', text: 'AWS IAM & Security' },
                { icon: Globe, label: 'Security IaC', text: 'Terraform & Boto3' },
              ].map((skill) => (
                <div 
                  key={skill.label} 
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="p-6 bg-card-bg border border-border-main rounded-3xl hover:border-tiktok-cyan transition-all group cursor-pointer active:scale-95"
                >
                  <skill.icon className="w-5 h-5 text-tiktok-cyan mb-4 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-xs uppercase tracking-widest text-text-main mb-1 group-hover:text-tiktok-cyan transition-colors">{skill.label}</h4>
                  <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{skill.text}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <button 
                onClick={resumeStatus === 'ready' ? handleDownloadPDF : generateResume}
                disabled={resumeStatus === 'generating'}
                className={cn(
                  "px-12 py-5 font-black uppercase tracking-[0.2em] text-xs rounded-full transition-all flex items-center gap-4 shadow-xl active:scale-95",
                  resumeStatus === 'ready' 
                    ? "bg-green-500 text-white hover:bg-green-600" 
                    : "bg-tiktok-cyan text-black hover:scale-105 shadow-tiktok-cyan/20"
                )}
              >
                {resumeStatus === 'idle' && <>Generate AI Resume <Send className="w-4 h-4" /></>}
                {resumeStatus === 'generating' && <>Analyzing Core... <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /></>}
                {resumeStatus === 'ready' && <>Download Now <CheckCircle className="w-4 h-4" /></>}
              </button>

              <AnimatePresence>
                {showNotification && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, x: -50 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-4 bg-bg-main border border-tiktok-cyan p-4 rounded-2xl shadow-2xl z-50 flex items-center gap-4 min-w-[300px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-tiktok-cyan/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-tiktok-cyan" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-tiktok-cyan uppercase tracking-widest font-black">Success</p>
                      <p className="text-xs text-text-main font-bold">Resume synthesized from lab data.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="relative aspect-square rounded-[60px] overflow-hidden group border border-border-main shadow-2xl">
             <img 
               src={profilePic} 
               alt="Alex Obwogi" 
               referrerPolicy="no-referrer"
               className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-bg-main/80 via-transparent to-transparent opacity-60" />
             <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-card-bg backdrop-blur-xl px-6 py-3 rounded-full border border-border-main">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-bold text-text-main">Status: Lab_Active</span>
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
    <section id="contact" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="Network :: Contact" title="Connect Directly." />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-4">
              <p className="text-xl text-gray-400 font-medium">
                Got a high-impact project? I'm currently scanning for <span className="text-text-main font-bold italic">Software Engineering & Security roles</span>. 
              </p>
              <p className="text-gray-500 leading-relaxed max-w-md italic">
                Let's discuss how I can help you build scalable systems and defensible cloud architectures.
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
                 placeholder="MSG_PAYLOAD :: DESCRIBE_YOUR_PROJECT..." 
                 className="w-full bg-bg-main border border-border-main p-5 rounded-3xl focus:border-tiktok-cyan outline-none transition-all resize-none text-sm font-mono text-text-main"
               />
             </div>
             <button 
               disabled={status !== 'idle'}
               type="submit" 
               className={cn(
                 "w-full h-16 rounded-full font-black uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-4 text-xs shadow-lg",
                 status === 'success' ? "bg-green-500 text-white" : "bg-tiktok-cyan text-black hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(37,244,238,0.3)]"
               )}
             >
               {status === 'idle' && <>Send Transmission <Send className="w-4 h-4" /></>}
               {status === 'sending' && <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />}
               {status === 'success' && <>Success Recorded <CheckCircle className="w-4 h-4" /></>}
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
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => setCerts(data))
      .catch(console.error);
  }, []);

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="py-32 px-6 bg-bg-main relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading subtitle="VERIFIED_CREDENTIALS" title="Certifications." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certs.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card-bg border border-border-main p-10 rounded-[40px] group hover:border-tiktok-cyan transition-all relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tiktok-cyan/5 rounded-full blur-3xl group-hover:bg-tiktok-cyan/10 transition-all" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-tiktok-cyan/10 border border-tiktok-cyan/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-tiktok-cyan" />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">{cert.date}</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-2 group-hover:text-tiktok-cyan transition-colors">{cert.title}</h3>
              <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-6">{cert.issuer}</p>
              
              <div className="pt-6 border-t border-white/5 flex items-center gap-3">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em]">Credential_Verified :: Access_Granted</span>
              </div>

              {cert.iconUrl && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-white/5 bg-black/40 p-1">
                   <img src={cert.iconUrl} alt={cert.title} className="w-full h-auto rounded-xl grayscale group-hover:grayscale-0 transition-all opacity-50 group-hover:opacity-100" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
        <AboutSection />
        <section id="projects" className="relative overflow-hidden bg-bg-main border-y border-border-main">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-text-main/[0.03] to-transparent pointer-events-none" />
          <ProjectGrid limit={3} />
        </section>
        <section id="experience" className="bg-bg-main relative">
          <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
            <SectionHeading subtitle="Portfolio :: Career" title="Expertise Timeline." />
          </div>
          <ExperienceTimeline />
        </section>
        <CertificationSection />
        <ContactSection />
      </main>

      <footer className="bg-bg-main py-40 border-t border-border-main">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center space-y-16">
           <div className="flex items-center space-x-4">
             <Terminal className="w-5 h-5 text-text-main animate-pulse" />
             <span className="font-mono text-[10px] tracking-[0.5em] text-gray-700 uppercase font-bold">System Status: Active // © 2026 Alex Obwogi Portfolio</span>
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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [error, setError] = useState('');
  
  // New States for local project info
  const [projectTitle, setProjectTitle] = useState('');
  const [projectMeta, setProjectMeta] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [githubUsername, setGithubUsername] = useState('AlexObwogi');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const [allCerts, setAllCerts] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Certification upload states
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certIcon, setCertIcon] = useState<File | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`/api/github/repos/${githubUsername}`)
        .then(res => res.json())
        .then(data => setGithubRepos(Array.isArray(data) ? data : []))
        .catch(console.error);

      fetch('/api/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(console.error);

      fetchAllData();
    }
  }, [isLoggedIn, githubUsername]);

  const fetchAllData = async () => {
    const [pRes, cRes] = await Promise.all([
      fetch('/api/projects'),
      fetch('/api/certifications')
    ]);
    if (pRes.ok) setAllProjects(await pRes.json());
    if (cRes.ok) setAllCerts(await cRes.json());
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
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
      setError('MISSING_FIELDS :: TITLE_META_REPO_AND_LIVE_REQUIRED');
      return;
    }
    
    setError('');
    setUploadStatus('uploading');

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
        if (uploadRes.ok) {
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
        if (vidRes.ok) {
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
        languages: ['Node.js', 'React', 'MongoDB'], 
        techStack: ['Cloudinary', 'Auth', 'MERN'],
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

      setUploadStatus('success');
      fetchAllData();
      
      setTimeout(() => {
        setUploadStatus('idle');
        setSelectedFile(null);
        setSelectedVideo(null);
        setProjectTitle('');
        setProjectMeta('');
        setRepoLink('');
        setLiveLink('');
        setEditingProject(null);
      }, 3000);
    } catch (err) {
      setError('UPLOAD_FAILED :: CLOUD_SYNC_ERROR');
      setUploadStatus('idle');
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
      setError('MISSING_FIELDS :: CERT_TITLE_ISSUER_DATE_REQUIRED');
      return;
    }
    
    setUploadStatus('uploading');
    try {
      let iconUrl = '';
      if (certIcon) {
        const formData = new FormData();
        formData.append('file', certIcon);
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
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
        setUploadStatus('success');
        fetchAllData();
        setTimeout(() => {
          setUploadStatus('idle');
          setCertTitle('');
          setCertIssuer('');
          setCertDate('');
          setCertIcon(null);
        }, 3000);
      }
    } catch (err) {
      setError('CERT_UPLOAD_FAILED :: OVERRIDE_ERROR');
      setUploadStatus('idle');
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
              <Terminal className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Secure Terminal</h1>
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
              
              <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest flex items-center justify-between">
                      Sync from GitHub
                      <Github className="w-3 h-3" />
                    </label>
                    <select 
                      onChange={(e) => {
                        const repo = githubRepos.find(r => r.name === e.target.value);
                        if (repo) {
                          setProjectTitle(repo.name);
                          setProjectMeta(repo.description || '');
                          setRepoLink(repo.html_url);
                        }
                      }}
                      className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-[12px] text-text-main"
                    >
                      <option value="">Select a Repository...</option>
                      {githubRepos.map(repo => (
                        <option key={repo.id} value={repo.name}>{repo.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Project Title</label>
                     <input 
                        type="text" 
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="SMART_RENT_AI..." 
                        className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                     />
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

                {error && <p className="text-tiktok-red text-[9px] font-mono uppercase tracking-widest font-black">{error}</p>}

                <button 
                  onClick={handleUpload}
                  className={cn(
                    "w-full h-14 rounded-full font-black uppercase tracking-widest transition-all shadow-lg",
                    uploadStatus === 'success' ? "bg-green-500 text-white" : "bg-tiktok-cyan text-black hover:scale-[1.02]"
                  )}
                >
                  {uploadStatus === 'idle' && <>Deploy Project <Send className="w-4 h-4 ml-2" /></>}
                  {uploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  {uploadStatus === 'success' && <>Deployment Triggered <CheckCircle className="w-4 h-4 ml-2" /></>}
                </button>
              </div>
           </div>

           <div className="space-y-8">
               <div className="bg-card-bg border border-border-main p-8 rounded-[40px]">
                  <h3 className="text-xs font-mono text-tiktok-cyan uppercase tracking-widest mb-4">Identity Sync :: Profile Pic</h3>
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
                      { label: 'Access Level', val: 'Engineer' },
                      { label: 'Security Lab', val: allProjects.length.toString() },
                      { label: 'System State', val: 'Defensive' },
                    ].map(stat => (
                      <div key={stat.label} className="flex items-end justify-between border-b border-border-main pb-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{stat.label}</span>
                        <span className="text-xl font-bold text-text-main">{stat.val}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="bg-card-bg border border-border-main p-8 rounded-[40px]">
                 <h3 className="text-xs font-mono text-text-main uppercase tracking-widest mb-4">Active Modules</h3>
                 <div className="flex flex-wrap gap-2">
                    {['LINUX_LAB', 'AWS_SECURITY', 'PYTHON_AUTO', 'IAM_IAM', 'TF_IaC'].map(mod => (
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
                   placeholder="AWS_SECURITY_SPECIALTY..." 
                   className="w-full bg-bg-main border border-border-main p-4 rounded-2xl focus:border-tiktok-cyan outline-none text-text-main" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Issuing Authority</label>
                <input 
                   type="text" 
                   value={certIssuer}
                   onChange={(e) => setCertIssuer(e.target.value)}
                   placeholder="AMAZON_WEB_SERVICES..." 
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
                uploadStatus === 'success' ? "bg-green-500 text-white" : "bg-white text-black hover:scale-[1.02]"
              )}
           >
              {uploadStatus === 'idle' && <>Verify & Upload Certification <Award className="w-4 h-4 ml-2" /></>}
              {uploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {uploadStatus === 'success' && <>Credential Indexed Successfully <CheckCircle className="w-4 h-4 ml-2" /></>}
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

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <Router>
      <CinematicBackground isDark={isDark} />
      <SocialDock />
      <AlexAI />
      
      <Routes>
        <Route path="/" element={<LandingPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/admin" element={<AdminPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/tech-stack" element={<TechStackPage toggleTheme={toggleTheme} isDark={isDark} />} />
        <Route path="/services" element={<ServicesPage toggleTheme={toggleTheme} isDark={isDark} />} />
      </Routes>
    </Router>
  );
}
