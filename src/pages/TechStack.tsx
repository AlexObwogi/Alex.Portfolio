import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';
import { Cpu, Code2, Globe, Database, Shield, Zap, ExternalLink, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';
import { Project } from '../data/projects';
import { SectionHeading } from '../App';

const TECH_CATEGORIES = [
  {
    name: 'Frontend Architect',
    icon: <Globe className="w-5 h-5" />,
    techs: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Redux'],
    status: 'experienced'
  },
  {
    name: 'Backend & Systems',
    icon: <Database className="w-5 h-5" />,
    techs: ['Node.js', 'Express', 'Python', 'Go', 'RESTful APIs', 'WebSockets'],
    status: 'experienced'
  },
  {
    name: 'Data & Storage',
    icon: <Database className="w-5 h-5" />,
    techs: ['MongoDB', 'PostgreSQL', 'Redis', 'SQL', 'Mongoose'],
    status: 'experienced'
  },
  {
    name: 'Cloud & Security',
    icon: <Shield className="w-5 h-5" />,
    techs: ['AWS', 'Terraform', 'Docker', 'Linux Hardening', 'IAM', 'Security Hub'],
    status: 'experienced'
  },
  {
    name: 'Researching (Alpha)',
    icon: <Zap className="w-5 h-5" />,
    techs: ['Rust', 'WebAssembly', 'Deep Learning', 'Kubernetes'],
    status: 'exploring'
  }
];

export default function TechStackPage({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(console.error);
  }, []);

  const filteredProjects = projects.filter(p => 
    selectedTech ? (p.languages?.includes(selectedTech) || p.techStack?.includes(selectedTech)) : false
  );

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-24 px-6">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      <div className="max-w-7xl mx-auto space-y-24">
        <div className="space-y-4">
          <SectionHeading subtitle="Ecosystem :: Core" title="Technological Mastery." />
          <p className="max-w-2xl text-gray-500 font-mono text-sm uppercase tracking-widest leading-relaxed">
            Building secure ecosystems requires mastery over the full stack. From low-level systems to high-level cloud architectures, these are my tools for crafting digital resilience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-10">
            {TECH_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-tiktok-cyan/10 border border-tiktok-cyan/20">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold uppercase tracking-tighter text-xl">{cat.name}</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {cat.techs.map(tech => (
                    <button
                      key={tech}
                      onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                      className={cn(
                        "px-6 py-3 rounded-2xl border text-xs font-mono font-bold uppercase tracking-widest transition-all",
                        cat.status === 'exploring' ? "border-dashed border-gray-700 text-gray-500" : "border-border-main text-text-main",
                        selectedTech === tech ? "bg-tiktok-cyan text-black border-tiktok-cyan scale-105 shadow-[0_0_20px_rgba(37,244,238,0.4)]" : "hover:border-tiktok-cyan/50"
                      )}
                    >
                      {tech}
                      {cat.status === 'exploring' && <span className="ml-2 opacity-50">#</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="sticky top-40 bg-card-bg border border-border-main rounded-[48px] p-10 min-h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black uppercase tracking-widest text-sm flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-tiktok-cyan" />
                  Implementation Logic
                </h4>
                {selectedTech && <span className="text-[10px] font-mono text-tiktok-cyan bg-tiktok-cyan/10 px-3 py-1 rounded-full">{selectedTech}</span>}
              </div>

              {selectedTech ? (
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  {filteredProjects.length > 0 ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Active Instances using this Module:</p>
                      <div className="grid gap-4">
                        {filteredProjects.map(p => (
                          <div key={p.title} className="p-6 bg-bg-main border border-border-main rounded-3xl group hover:border-tiktok-cyan transition-all">
                            <h5 className="font-bold text-lg mb-1">{p.title}</h5>
                            <p className="text-xs text-gray-500 line-clamp-1 mb-4">{p.description}</p>
                            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-[10px] font-mono uppercase tracking-[0.2em] text-tiktok-cyan">
                              View Project <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                      <Terminal className="w-12 h-12 text-gray-700" />
                      <p className="text-xs font-mono uppercase tracking-widest">No public projects currently linked to this module.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                   <Code2 className="w-16 h-16 text-gray-800" />
                   <p className="max-w-[200px] text-xs font-mono uppercase tracking-widest leading-loose">
                      Select a technology module to view its deployment context and architectural footprint.
                   </p>
                </div>
              )}

              <div className="mt-auto pt-8 border-t border-border-main flex items-center justify-between text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                 <span>Architecture Type: Distributed</span>
                 <span>Signal: Strong</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
