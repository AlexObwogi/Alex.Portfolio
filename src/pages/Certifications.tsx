import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../App';
import { cn } from '../lib/utils';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  status: 'completed' | 'in-progress';
  iconUrl?: string;
}

export default function CertificationsPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => {
        // Mocking some in-progress for demo if none exist
        if (data.length < 5) {
          const mockInProgress = [
            { id: 'm1', title: 'AWS Certified Security - Specialty', issuer: 'Amazon Web Services', date: 'Expected 2026', status: 'in-progress' },
            { id: 'm2', title: 'OSCP :: OffSec Certified Professional', issuer: 'OffSec', date: 'In Training', status: 'in-progress' }
          ];
          setCerts([...data.map((c: any) => ({ ...c, status: 'completed' })), ...mockInProgress]);
        } else {
          setCerts(data);
        }
      })
      .catch(console.error);
  }, []);

  const completed = certs.filter(c => c.status === 'completed');
  const inProgress = certs.filter(c => c.status === 'in-progress');

  return (
    <div className="min-h-screen bg-bg-main relative">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-20 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
           <Link to="/" className="hover:text-tiktok-cyan transition-colors">Home</Link>
           <span>/</span>
           <span className="text-tiktok-cyan">Credentials</span>
        </div>

        <SectionHeading subtitle="VERIFIED_LEDGER" title="Expert Credentials." />

        <div className="space-y-40">
          {/* Completed */}
          <section>
            <div className="flex items-center gap-4 mb-12">
               <ShieldCheck className="w-6 h-6 text-green-500" />
               <h3 className="text-2xl font-black text-text-main uppercase tracking-widest">Validated Artifacts</h3>
               <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completed.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card-bg border border-border-main p-10 rounded-[40px] group hover:border-tiktok-cyan transition-all relative"
                >
                  <Award className="w-12 h-12 text-tiktok-cyan mb-8" />
                  <h4 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2">{cert.title}</h4>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-6">{cert.issuer}</p>
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">{cert.date}</span>
                    <ShieldCheck className="w-4 h-4 text-green-500/50" />
                  </div>
                  {cert.iconUrl && (
                    <div className="mt-8 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all opacity-30 group-hover:opacity-100">
                      <img src={cert.iconUrl} alt={cert.title} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          {/* In Progress */}
          <section>
            <div className="flex items-center gap-4 mb-12">
               <Clock className="w-6 h-6 text-tiktok-red" />
               <h3 className="text-2xl font-black text-text-main uppercase tracking-widest">Active Acquisitions</h3>
               <div className="flex-1 h-[1px] bg-white/5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {inProgress.map((cert, idx) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card-bg/50 border border-border-dash p-8 rounded-[32px] flex items-center justify-between group hover:bg-tiktok-red/5 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full border border-tiktok-red/20 flex items-center justify-center animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-tiktok-red" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-text-main uppercase tracking-tighter mb-1">{cert.title}</h4>
                      <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-tiktok-red uppercase tracking-[0.2em] font-black">{cert.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
