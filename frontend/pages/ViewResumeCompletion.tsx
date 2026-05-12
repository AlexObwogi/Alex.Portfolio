import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Download, CheckCircle, Home, FileText, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../components/SectionHeading';
import { downloadResumePDF, TailoredContent } from '../lib/resumeUtils';

export default function ViewResumeCompletion({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const location = useLocation();
  const tailoredContent = location.state?.tailoredContent as TailoredContent | null;

  if (!tailoredContent) {
    return <Navigate to="/resume" replace />;
  }

  return (
    <div className="min-h-screen bg-bg-main relative">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="max-w-4xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-20 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
           <Link to="/" className="hover:text-tiktok-cyan transition-colors">Home</Link>
           <span>/</span>
           <Link to="/resume" className="hover:text-tiktok-cyan transition-colors">Generation</Link>
           <span>/</span>
           <span className="text-tiktok-cyan font-black">Ready</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card-bg border border-white/5 rounded-[48px] p-8 lg:p-12 text-left relative overflow-hidden backdrop-blur-3xl shadow-3xl mb-12"
        >
          {/* Resume Content Preview */}
          <div className="bg-white text-black p-8 md:p-16 rounded-2xl shadow-inner font-serif max-w-[210mm] mx-auto min-h-[297mm]">
            <div className="border-b-2 border-black pb-6 mb-8 text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight mb-2 uppercase">{tailoredContent.header?.name || "ALEX N. OBWOGI"}</h1>
              <div className="text-sm flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 text-gray-700 font-medium">
                <span>{tailoredContent.header?.location || "Nairobi, Kenya"}</span>
                <span className="font-bold hidden md:inline">|</span>
                <span>{tailoredContent.header?.email || "obwogialex728@gmail.com"}</span>
                <span className="font-bold hidden md:inline">|</span>
                <span>{tailoredContent.header?.phone || "+254 706 050 538"}</span>
                <span className="font-bold hidden md:inline">|</span>
                <span>github.com/AlexObwogi</span>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Professional Summary</h2>
              <p className="text-sm leading-relaxed text-justify">
                {tailoredContent.summary}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Technical Skills Matrix</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4">
                {tailoredContent.topSkills.map((skillGroup, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="font-bold">{skillGroup.split(':')[0]}:</span> 
                    <span className="ml-2">{skillGroup.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Professional Experience</h2>
              <div className="space-y-6">
                {tailoredContent.tailoredExperience.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-md italic">{exp.role.toUpperCase()}</h3>
                      <span className="text-sm font-bold">{exp.period}</span>
                    </div>
                    <div className="text-sm font-bold mb-2">{exp.company}</div>
                    <ul className="list-disc ml-5 space-y-1">
                      {exp.bulletPoints.map((point, bIdx) => (
                        <li key={bIdx} className="text-sm leading-snug">{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Technical Engineering Projects</h2>
              <div className="space-y-4">
                {tailoredContent.projects.map((project, idx) => (
                  <div key={idx}>
                    <div className="font-bold text-sm mb-1">{project.title} <span className="font-normal italic text-gray-600">[{project.tech}]</span></div>
                    <p className="text-sm leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Education & Academic Achievements</h2>
              <div className="space-y-4">
                {tailoredContent.education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-sm">{edu.degree}</h3>
                      <span className="text-sm">{edu.period}</span>
                    </div>
                    <div className="text-sm">{edu.institution}</div>
                    <p className="text-xs italic text-gray-700 mt-1">{edu.details}</p>
                  </div>
                ))}
              </div>
            </section>

            {tailoredContent.certifications && tailoredContent.certifications.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase tracking-wide">Certifications</h2>
                <div className="space-y-3">
                  {tailoredContent.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between items-baseline">
                      <div>
                        <div className="font-bold text-sm">{cert.title}</div>
                        <div className="text-xs text-gray-600">{cert.issuer}</div>
                      </div>
                      <span className="text-xs font-mono">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card-bg border border-white/5 rounded-[48px] p-12 lg:p-20 text-center relative overflow-hidden backdrop-blur-3xl shadow-3xl"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 bg-tiktok-cyan/[0.02] pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tiktok-cyan/50 to-transparent" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-tiktok-cyan/10 border border-tiktok-cyan/20 flex items-center justify-center mx-auto mb-12 relative">
               <CheckCircle className="w-10 h-10 text-tiktok-cyan" />
               <motion.div 
                 animate={{ scale: [1, 1.4, 1], opacity: [0, 0.4, 0] }}
                 transition={{ repeat: Infinity, duration: 2.5 }}
                 className="absolute inset-0 rounded-full bg-tiktok-cyan"
               />
            </div>

            <SectionHeading subtitle="Success" title="Ready." />
            
            <div className="mb-12 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-tiktok-cyan/10 border border-tiktok-cyan/20">
               <Sparkles className="w-4 h-4 text-tiktok-cyan" />
               <span className="text-[10px] font-mono text-tiktok-cyan uppercase tracking-widest font-bold">Your resume is ready. Download it here.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => downloadResumePDF(tailoredContent)}
                className="w-full sm:w-auto px-12 py-7 rounded-full bg-tiktok-cyan text-black font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(37,244,238,0.3)] hover:scale-[1.05] active:scale-[0.98] transition-all group"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce" /> 
                Download Resume PDF
              </button>

              <Link 
                to="/resume"
                className="w-full sm:w-auto px-12 py-7 rounded-full border border-white/10 text-gray-500 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-white/5 hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back To Generation
              </Link>
            </div>

            <div className="mt-20 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="flex items-center gap-4 justify-center">
                  <ShieldCheck className="w-5 h-5 text-tiktok-cyan/40" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">ATS Optimized</span>
               </div>
               <div className="flex items-center gap-4 justify-center">
                  <Sparkles className="w-5 h-5 text-tiktok-cyan/40" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">AI Tailored</span>
               </div>
               <div className="flex items-center gap-4 justify-center">
                  <FileText className="w-5 h-5 text-tiktok-cyan/40" />
                  <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Production Ready</span>
               </div>
            </div>
          </div>
        </motion.div>

        <p className="mt-12 text-center font-mono text-[9px] text-gray-600 uppercase tracking-[0.3em] leading-loose max-w-lg mx-auto opacity-50">
          Note: This tailored view is temporary. <br/>Ensure you download your binary file before closing this session.
        </p>
      </main>
    </div>
  );
}
