import { motion } from 'motion/react';
import { Mail, Linkedin, Github, MessageCircle, Twitter, Music } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SocialDock() {
  const whatsappMsg = encodeURIComponent("Hi, I saw your portfolio and would like to connect regarding a project.");
  
  const socialLinks = [
    { icon: Mail, href: 'mailto:obwogialex0@gmail.com', label: 'Email' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Music, href: 'https://tiktok.com', label: 'TikTok' },
    { icon: MessageCircle, href: `https://wa.me/254706050538?text=${whatsappMsg}`, label: 'WhatsApp' },
  ];

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-[15px] top-1/2 -translate-y-1/2 z-[100] flex flex-col items-center space-y-4"
    >
      <div className="bg-black/90 backdrop-blur-xl border border-white/5 rounded-full p-2 flex flex-col space-y-2 shadow-2xl">
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, x: 5 }}
            className="p-3 rounded-full border border-white/5 hover:border-tiktok-cyan transition-all group relative"
          >
            <social.icon className="w-4 h-4 text-gray-500 group-hover:text-tiktok-cyan" />
            <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-tiktok-cyan text-black text-[9px] font-mono font-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest whitespace-nowrap">
              {social.label}
            </span>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
