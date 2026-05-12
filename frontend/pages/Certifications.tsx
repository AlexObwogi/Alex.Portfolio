import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck, Clock, Bookmark, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../components/SectionHeading';
import { cn } from '../lib/utils';
import { Certification } from '../types';

export default function CertificationsPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    fetch(`/api/certifications?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => {
        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) throw new Error('Invalid JSON');
        return res.json();
      })
      .then(data => {
        const normalizedData = data.map((c: any, i: number) => ({
          ...c,
          id: c.id || c._id?.toString() || `cert-${i}`,
          status: c.status || 'completed'
        }));
        // Mocking some in-progress for demo if none exist
        if (normalizedData.length < 5) {
          const mockInProgress: Certification[] = [
            { id: 'm1', title: 'AWS Certified Security - Specialty', issuer: 'Amazon Web Services', date: 'Expected 2026', status: 'in-progress' },
            { id: 'm2', title: 'OSCP :: OffSec Certified Professional', issuer: 'OffSec', date: 'In Training', status: 'in-progress' }
          ];
          setCerts([...normalizedData, ...mockInProgress]);
        } else {
          setCerts(normalizedData);
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
                  className="bg-card-bg border border-border-main rounded-[40px] group hover:border-tiktok-cyan transition-all relative overflow-hidden flex flex-col"
                >
                  {/* Visual Preview at Top */}
                  <div className="h-48 w-full relative overflow-hidden bg-black/40">
                    {cert.iconUrl ? (
                      <img 
                        src={cert.iconUrl} 
                        alt={cert.title} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-tiktok-cyan/5">
                        <Award className="w-12 h-12 text-tiktok-cyan/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card-bg to-transparent" />
                  </div>

                  <div className="p-10 pt-0 flex-1 flex flex-col">
                    <Award className="w-10 h-10 text-tiktok-cyan mb-6 -mt-5 relative z-10 bg-card-bg rounded-xl p-2 border border-border-main" />
                    <h4 className="text-xl font-black text-text-main uppercase tracking-tighter mb-2 group-hover:text-tiktok-cyan transition-colors">{cert.title}</h4>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-8">{cert.issuer}</p>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between pb-6 border-b border-white/5">
                        <span className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">{cert.date}</span>
                        <ShieldCheck className="w-4 h-4 text-green-500/50" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => window.open(cert.iconUrl || '#', '_blank')}
                          className="group relative flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-text-main overflow-hidden transition-all hover:bg-tiktok-cyan hover:text-black hover:border-tiktok-cyan"
                        >
                          <span className="relative z-10">View Certificate</span>
                          <Bookmark className="w-3 h-3 relative z-10 group-hover:fill-current" />
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 group-hover:h-full transition-all duration-300" />
                        </button>
                        <a 
                          href="https://www.wqu.edu/verify" 
                          target="_blank" 
                          rel="noreferrer"
                          className="group relative flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 overflow-hidden transition-all hover:bg-white hover:text-black hover:border-white"
                        >
                          <span className="relative z-10">Verify</span>
                          <ExternalLink className="w-3 h-3 relative z-10" />
                          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 group-hover:h-full transition-all duration-300" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* In Progress */}
          <section>
            <div className="flex items-center gap-4 mb-12">
               <Clock className="w-6 h-6 text-tiktok-red" />
               <h3 className="text-2xl font-black text-text-main uppercase tracking-widest">My Credentials</h3>
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
