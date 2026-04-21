import React from 'react';
import { Monitor, Award, Pin, PinOff, Edit3, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Project {
  _id: string;
  title: string;
  imageUrl?: string;
  isPinned?: boolean;
  technicalSummary?: string;
  description: string;
  repoUrl: string;
  liveUrl: string;
}

interface Cert {
  _id: string;
  title: string;
  issuer: string;
  date: string;
}

interface AdminControlsProps {
  allProjects: Project[];
  allCerts: Cert[];
  togglePin: (project: Project) => void;
  setEditingProject: (project: Project) => void;
  setProjectTitle: (title: string) => void;
  setProjectMeta: (meta: string) => void;
  setRepoLink: (link: string) => void;
  setLiveLink: (link: string) => void;
  handleDeleteProject: (id: string) => void;
  handleDeleteCert: (id: string) => void;
}

export default function AdminControls({
  allProjects,
  allCerts,
  togglePin,
  setEditingProject,
  setProjectTitle,
  setProjectMeta,
  setRepoLink,
  setLiveLink,
  handleDeleteProject,
  handleDeleteCert
}: AdminControlsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 pb-20">
      <div className="bg-card-bg border border-border-main p-10 rounded-[48px] space-y-8 shadow-2xl overflow-hidden">
        <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-text-main">
          <Monitor className="w-4 h-4 text-tiktok-cyan" /> Project Vector Inventory
        </h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar px-2">
          {allProjects.map((project) => (
            <div key={project._id} className="p-6 bg-bg-main rounded-3xl border border-border-main flex items-center justify-between group hover:border-tiktok-cyan/50 transition-all text-text-main">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40">
                  {project.imageUrl && <img src={project.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tighter">{project.title}</h4>
                  <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                    {project.isPinned ? '[ PINNED_CORE ]' : '[ STD_SECTOR ]'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => togglePin(project)}
                  className={cn(
                    "p-3 rounded-xl border transition-all",
                    project.isPinned ? "bg-tiktok-cyan/10 border-tiktok-cyan text-tiktok-cyan" : "border-border-main text-gray-600 hover:border-tiktok-cyan hover:text-tiktok-cyan"
                  )}
                >
                  {project.isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => {
                    setEditingProject(project);
                    setProjectTitle(project.title);
                    setProjectMeta(project.technicalSummary || project.description);
                    setRepoLink(project.repoUrl);
                    setLiveLink(project.liveUrl);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-3 bg-white/5 rounded-xl border border-border-main text-gray-500 hover:text-white hover:border-white transition-all shadow-sm"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteProject(project._id)}
                  className="p-3 bg-tiktok-red/5 rounded-xl border border-border-main text-gray-500 hover:text-tiktok-red hover:border-tiktok-red transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {allProjects.length === 0 && <p className="text-xs text-gray-600 font-mono text-center py-10 uppercase tracking-widest">No Projects Indexed.</p>}
        </div>
      </div>

      <div className="bg-card-bg border border-border-main p-10 rounded-[48px] space-y-8 shadow-2xl overflow-hidden">
        <h3 className="font-bold uppercase tracking-widest text-xs flex items-center gap-2 text-text-main">
          <Award className="w-4 h-4 text-tiktok-cyan" /> Verified Credentials Ledger
        </h3>
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar px-2">
          {allCerts.map((cert) => (
            <div key={cert._id} className="p-6 bg-bg-main rounded-3xl border border-border-main flex items-center justify-between group hover:border-tiktok-cyan/50 transition-all text-text-main">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-tiktok-cyan/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-tiktok-cyan" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tighter">{cert.title}</h4>
                  <p className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">{cert.issuer} // {cert.date}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteCert(cert._id)}
                className="p-3 bg-tiktok-red/5 rounded-xl border border-border-main text-gray-500 hover:text-tiktok-red hover:border-tiktok-red transition-all shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {allCerts.length === 0 && <p className="text-xs text-gray-600 font-mono text-center py-10 uppercase tracking-widest">No Credentials Indexed.</p>}
        </div>
      </div>
    </div>
  );
}
