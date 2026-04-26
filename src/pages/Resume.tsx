import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Download, CheckCircle, Sparkles, Loader2, Home, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { experiences } from '../data/experience';
import { projects } from '../data/projects';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../App';
import { cn } from '../lib/utils';

export default function ResumePage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');
  const [showToast, setShowToast] = useState(false);

  const generateATSResume = async () => {
    setStatus('generating');
    // Simulate complex parsing and alignment
    await new Promise(resolve => setTimeout(resolve, 2500));
    setStatus('ready');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('ALEX NYANGARESI OBWOGI', margin, y);
    y += 10;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Lead Security Engineer & Fullstack Architect | Nairobi, Kenya', margin, y);
    y += 5;
    doc.text('obwogialex0@gmail.com | +254 706 050 538 | github.com/AlexObwogi', margin, y);
    y += 15;

    // Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('EXECUTIVE SUMMARY', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summary = "Highly skilled Software Engineer specialized in high-performance digital ecosystems and cloud defense. Expert in MERN stack, AWS Security architectures, and automated infrastructure (IaC). Proven track record in leading capstone engineering projects and implementing zero-trust security perimeters.";
    doc.text(doc.splitTextToSize(summary, 170), margin, y);
    y += 20;

    // Skills
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PROFESSIONAL SKILLS', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Languages: TypeScript, JavaScript (ES6+), Python, Bash, SQL, Go', margin, y);
    y += 5;
    doc.text('Frameworks: React, Node.js, Express, Tailwind CSS, Boto3, Scapy', margin, y);
    y += 5;
    doc.text('Cloud/Security: AWS (IAM, Lambda, S3), Linux Hardening, Terraform, CI/CD, JWT, 2FA', margin, y);
    y += 15;

    // Experience
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('PROFESSIONAL EXPERIENCE', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;
    
    experiences.slice(0, 3).forEach(exp => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${exp.role.toUpperCase()} | ${exp.company}`, margin, y);
      doc.setFont('helvetica', 'italic');
      doc.text(exp.period, 190, y, { align: 'right' });
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const desc = doc.splitTextToSize(exp.description, 170);
      doc.text(desc, margin, y);
      y += (desc.length * 5) + 5;
    });

    // Projects
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('SELECTED ENGINEERING PROJECTS', margin, y);
    doc.line(margin, y + 2, 190, y + 2);
    y += 10;
    
    projects.slice(0, 2).forEach(p => {
       doc.setFont('helvetica', 'bold');
       doc.setFontSize(11);
       doc.text(p.title, margin, y);
       y += 5;
       doc.setFont('helvetica', 'normal');
       doc.setFontSize(10);
       const pDesc = doc.splitTextToSize(`${p.description} Tech: ${p.techStack.join(', ')}`, 170);
       doc.text(pDesc, margin, y);
       y += (pDesc.length * 5) + 5;
    });

    doc.save('Alex_Obwogi_ATS_Resume.pdf');
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-bg-main relative">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-20 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
           <Link to="/" className="hover:text-tiktok-cyan transition-colors">Home</Link>
           <span>/</span>
           <span className="text-tiktok-cyan">Resume_Engine</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <SectionHeading subtitle="ATS_OPTIMIZED" title="Resume Engine." />
            <p className="text-xl text-gray-400 mb-12 leading-relaxed">
              Generate a high-authority <span className="text-text-main font-bold">ATS-compatible</span> professional document. Optimized for Senior Engineering roles and Security Leadership vetting.
            </p>

            <div className="space-y-6 mb-12">
              {[
                'Standard Academic Header Structure',
                'Bold Keyword Optimization for Security Skills',
                'Clear Sectional Hierarchy (PDF/SVG Export)',
                'Automated Experience Formatting'
              ].map(item => (
                <div key={item} className="flex items-center gap-4 text-sm font-mono text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan" />
                  {item}
                </div>
              ))}
            </div>

            <div className="relative inline-block group">
              <button
                onClick={status === 'ready' ? downloadPDF : generateATSResume}
                disabled={status === 'generating'}
                className={cn(
                  "px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center gap-4 shadow-2xl overflow-hidden relative",
                  status === 'idle' ? "bg-tiktok-cyan text-black" : 
                  status === 'generating' ? "bg-white/10 text-gray-400 border border-white/10 cursor-wait" : 
                  "bg-[#00FF00] text-black scale-105"
                )}
              >
                {status === 'idle' && <><Sparkles className="w-5 h-5" /> Generate_Resume</>}
                {status === 'generating' && <><Loader2 className="w-5 h-5 animate-spin" /> Aligning_Data...</>}
                {status === 'ready' && <><Download className="w-5 h-5" /> Download_Now</>}
                
                {status === 'idle' && (
                   <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-tiktok-cyan/5 blur-[100px] rounded-full" />
            <motion.div 
              initial={{ rotate: -2, y: 20 }}
              animate={{ rotate: 0, y: 0 }}
              className="bg-card-bg border border-border-main rounded-[48px] p-12 aspect-[1/1.4] relative z-10 shadow-3xl flex flex-col overflow-hidden"
            >
              <div className="w-full flex justify-between items-start mb-16">
                 <div>
                    <div className="h-4 w-32 bg-white/10 rounded-full mb-3" />
                    <div className="h-2 w-48 bg-white/5 rounded-full" />
                 </div>
                 <ShieldCheck className="w-8 h-8 text-tiktok-cyan/20" />
              </div>
              
              <div className="space-y-12">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-3 w-40 bg-white/10 rounded-full" />
                    <div className="space-y-2">
                       <div className="h-1.5 w-full bg-white/5 rounded-full" />
                       <div className="h-1.5 w-[90%] bg-white/5 rounded-full" />
                       <div className="h-1.5 w-[70%] bg-white/5 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {status === 'generating' && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 border-4 border-tiktok-cyan border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-xs text-tiktok-cyan tracking-widest animate-pulse">OPTIMIZING :: ATS_FLOW</span>
                 </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300]"
          >
             <div className="bg-tiktok-cyan text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-4 shadow-[0_0_50px_rgba(37,244,238,0.5)] border border-white/20">
                <CheckCircle className="w-5 h-5 animate-bounce" />
                Resume Engine Optimized Successfully
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
