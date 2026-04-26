import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Code, Database, Globe, Smartphone, ArrowRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { SectionHeading } from '../App';
import Navbar from '../components/Navbar';

const services = [
  {
    id: 'sec-automation',
    title: 'Security Automation',
    icon: ShieldCheck,
    description: 'Developing automated security perimeters using Boto3, Python, and AWS Lambda. Targeted at zero-trust architectures and continuous compliance.',
    projects: ['Sentinel Cloud', 'HardenSys'],
    color: 'tiktok-cyan'
  },
  {
    id: 'fullstack',
    title: 'Fullstack Systems',
    icon: Code,
    description: 'Architecting high-performance MERN stack applications with real-time capabilities and AI integration.',
    projects: ['SmartRent AI', 'MERN Estate', 'VibeChat'],
    color: 'tiktok-red'
  },
  {
    id: 'cloud-iac',
    title: 'Cloud Infrastructure',
    icon: Globe,
    description: 'Infrastructure as Code deployment using Terraform and Go. Automating cloud provisioning with high availability.',
    projects: ['AutoTerra', 'Sentinel Cloud'],
    color: 'tiktok-cyan'
  },
  {
    id: 'backend',
    title: 'Secure Backend Design',
    icon: Database,
    description: 'Robust authentication systems, JWT handling, and multi-tenant database architectures.',
    projects: ['AuthGuard', 'Nexus Terminal'],
    color: 'white'
  }
];

export default function ServicesPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  return (
    <div className="min-h-screen bg-bg-main relative">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-20 text-[10px] font-mono tracking-[0.3em] uppercase opacity-50">
           <Link to="/" className="hover:text-tiktok-cyan transition-colors">Home</Link>
           <span>/</span>
           <span className="text-tiktok-cyan">Services</span>
        </div>

        <SectionHeading subtitle="SERVICE_INVENTORY" title="Engineering Solutions." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card-bg border border-border-main p-12 rounded-[48px] group hover:border-tiktok-cyan transition-all relative overflow-hidden"
            >
              <div className={cn(
                "absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-all",
                service.color === 'tiktok-cyan' ? 'bg-tiktok-cyan' : service.color === 'tiktok-red' ? 'bg-tiktok-red' : 'bg-white'
              )} />

              <div className="flex items-start justify-between mb-10">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <service.icon className="w-8 h-8 text-tiktok-cyan" />
                </div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">SRV::{service.id}</div>
              </div>

              <h3 className="text-3xl font-black text-text-main uppercase tracking-tighter mb-4 group-hover:text-tiktok-cyan transition-colors">
                {service.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-12 max-w-md">
                {service.description}
              </p>

              <div className="space-y-6">
                <h4 className="text-[10px] font-mono text-gray-600 uppercase tracking-widest font-black flex items-center gap-2">
                  <ArrowRight className="w-3 h-3" /> Linked_Artifacts
                </h4>
                <div className="flex flex-wrap gap-3">
                  {service.projects.map(pTitle => {
                    const project = projects.find(p => p.title === pTitle);
                    return project ? (
                      <Link 
                        key={pTitle}
                        to={`/#view-${pTitle.toLowerCase().replace(/ /g, '-')}`}
                        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400 uppercase tracking-widest hover:border-tiktok-cyan hover:text-white transition-all hover:bg-tiktok-cyan/10"
                      >
                        {pTitle}
                      </Link>
                    ) : (
                      <span key={pTitle} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-gray-700 uppercase tracking-widest opacity-50 cursor-not-allowed">
                        {pTitle}
                      </span>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="py-20 px-6 border-t border-border-main bg-black/20 text-center">
         <div className="flex justify-center gap-8 mb-8">
            <a href="#" className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center text-gray-500 hover:text-tiktok-cyan hover:border-tiktok-cyan border border-border-main transition-all">
               <Smartphone className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-card-bg flex items-center justify-center text-gray-500 hover:text-tiktok-cyan hover:border-tiktok-cyan border border-border-main transition-all">
               <Code className="w-4 h-4" />
            </a>
         </div>
         <p className="text-[10px] font-mono text-gray-700 uppercase tracking-widest">Defense Solutions :: 2026</p>
      </footer>
    </div>
  );
}

import { cn } from '../lib/utils';
