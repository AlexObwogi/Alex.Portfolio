import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { SectionHeading } from '../App';
import { Code, Shield, Smartphone, Globe, Cloud, Terminal, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { projects } from '../data/projects';

const SERVICES = [
  {
    icon: Code,
    title: 'Fullstack Development',
    desc: 'End-to-end MERN stack engineering with a focus on scalable architecture and clean code. Every module is built for growth.',
    project: 'SmartRent AI',
    skills: ['React', 'Node.js', 'MongoDB', 'Redis']
  },
  {
    icon: Globe,
    title: 'Dynamic Web Development',
    desc: 'Interactive, responsive, and performance-optimized frontends. I build seamless user experiences with modern frameworks.',
    project: 'MERN Estate',
    skills: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux']
  },
  {
    icon: Cloud,
    title: 'CI/CD & DevOps Engineering',
    desc: 'Automating deployment pipelines for maximum efficiency. Reducing downtime through robust version control and delivery workflows.',
    project: 'AutoTerra',
    skills: ['GitHub Actions', 'Docker', 'Go', 'Cloud Build']
  },
  {
    icon: Shield,
    title: 'Cloud Security Audit',
    desc: 'Automated auditing and perimeter defense for AWS/GCP. Implementing Zero-Trust policies and proactive monitoring.',
    project: 'Sentinel Cloud',
    skills: ['IAM Control', 'S3 Hardening', 'Audit Python', 'Boto3']
  },
  {
    icon: Terminal,
    title: 'Systems Automation',
    desc: 'Linux environment hardening and Bash/Python script automation. Reducing human oversight through optimized workflows.',
    project: 'HardenSys',
    skills: ['Linux Kernel', 'Shell Scripting', 'SSH Security', 'Cron Hooks']
  },
  {
    icon: Smartphone,
    title: 'Database Architecture',
    desc: 'Designing high-throughput schemas and ERI diagrams. Optimizing data persistence for scale and performance.',
    project: 'SmartRent AI',
    skills: ['MongoDB', 'SQL', 'Data Modeling', 'Normalization']
  }
];

export default function ServicesPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  return (
    <div className="min-h-screen bg-bg-main font-sans">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-32">
        <div className="flex items-center gap-4 mb-10">
           <button 
             onClick={() => window.history.back()}
             className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-tiktok-cyan hover:text-black transition-all shadow-lg group"
           >
             <Terminal className="w-5 h-5 rotate-180 group-hover:scale-110 transition-transform" />
           </button>
           <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-gray-500">Back to Previous</span>
        </div>

        <SectionHeading subtitle="OFFERINGS :: MODULES" title="Professional Services." />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICES.map((service, index) => {
            const linkedProject = projects.find(p => p.title === service.project);
            
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card-bg border border-border-main p-10 rounded-[40px] group hover:border-tiktok-cyan transition-all"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-tiktok-cyan/10 flex items-center justify-center border border-tiktok-cyan/20 group-hover:scale-110 transition-transform">
                    <service.icon className="w-7 h-7 text-tiktok-cyan" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-mono uppercase tracking-widest text-gray-500">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-4">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">
                  {service.desc}
                </p>

                {linkedProject && (
                  <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-tiktok-cyan" />
                      <span className="text-[10px] font-bold text-text-main uppercase tracking-widest">Case Study :: {linkedProject.title}</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/#view-${linkedProject.title.replace(/\s+/g, '-')}`}
                      className="text-[9px] font-mono text-tiktok-cyan uppercase tracking-widest font-black flex items-center gap-2 group-hover:translate-x-2 transition-transform"
                    >
                      View Samples <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-20 p-12 bg-tiktok-cyan rounded-[48px] flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-black uppercase tracking-tighter leading-none">Need a Specialized<br/>Security Override?</h3>
            <p className="text-black/60 font-medium max-w-md">I am currently available for high-bandwidth engineering roles and technical consulting.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/#contact'}
            className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            Initiate Contact
          </button>
        </div>
      </div>
    </div>
  );
}
