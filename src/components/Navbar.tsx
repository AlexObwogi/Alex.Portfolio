import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, User, Briefcase, Mail, Home, MessageSquare, Sun, Moon, Sparkles, LayoutGrid, Code, Cpu, ShieldCheck, FileText, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', path: '/', isSection: true, icon: Home },
  { name: 'About', path: 'about', isSection: true, icon: User },
  { name: 'Services', path: '/services', isSection: false, icon: Cpu },
  { name: 'Tech Stack', path: '/tech-stack', isSection: false, icon: LayoutGrid },
  { name: 'Projects', path: 'projects', isSection: true, icon: Code },
  { name: 'Timeline', path: 'experience', isSection: true, icon: Briefcase },
  { name: 'Credentials', path: '/credentials', isSection: false, icon: Award },
  { name: 'Resume', path: '/resume', isSection: false, icon: FileText },
  { name: 'Contact', path: 'contact', isSection: true, icon: Mail },
];

export default function Navbar({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string, isSection: boolean, isExternal?: boolean) => {
    if (isExternal) {
      window.open(path, '_blank');
      setIsMenuOpen(false);
      return;
    }
    if (isSection) {
      if (location.pathname !== '/') {
        navigate('/' + (path === '/' ? '' : '#' + path));
      } else {
        if (path === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(path);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    } else {
      navigate(path);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] transition-all duration-500",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Logo or Back */}
        <div className="flex items-center gap-4">
          {location.pathname !== '/' ? (
            <button 
              onClick={() => navigate(-1)} 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-tiktok-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(37,244,238,0.2)]"
            >
              <Terminal className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <Link to="/" onClick={() => handleNavClick('/', true)} className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-tiktok-cyan flex items-center justify-center group-hover:bg-tiktok-red transition-all duration-500 shadow-[0_0_20px_rgba(37,244,238,0.3)]">
                <Home className="w-5 h-5 text-black" />
              </div>
            </Link>
          )}
          <div className="flex flex-col">
            <span className="font-mono font-black text-lg tracking-[0.2em] uppercase hidden md:block">
              Alex.Portfolio
            </span>
            <div className="hidden md:flex items-center gap-1.5 overflow-hidden h-4">
              <div className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan animate-pulse" />
              <div className="font-mono text-[7px] text-tiktok-cyan/70 uppercase tracking-[0.3em] whitespace-nowrap animate-marquee">
                System_Status::Active // Core_Secure // Lab_Sync_Complete // Access_Granted
              </div>
            </div>
          </div>
        </div>

          {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1 bg-white/5 dark:bg-black/20 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-full p-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path, item.isSection || false)}
              className={cn(
                "px-3 lg:px-4 py-2 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative group flex items-center gap-2",
                ((item.path === '/' && location.pathname === '/' && !location.hash) || 
                 (location.pathname === '/' && location.hash === `#${item.path}`) ||
                 (location.pathname === item.path)) 
                  ? "text-tiktok-cyan" 
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{item.name}</span>
              <div className="absolute inset-0 bg-tiktok-cyan/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              {((item.path === '/' && location.pathname === '/' && !location.hash) || 
                (location.pathname === '/' && location.hash === `#${item.path}`) ||
                (location.pathname === item.path)) && (
                <motion.div 
                  layoutId="nav-active"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full border border-black/10 dark:border-white/20 -z-10"
                />
              )}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-main hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 ml-2"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a 
            href="https://wa.me/254706050538"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-main hover:bg-white hover:text-black transition-all active:scale-95 ml-2"
          >
            <MessageSquare className="w-5 h-5 relative z-10" />
          </a>
          <Link 
            to="/admin" 
            className="px-5 py-2 rounded-full bg-tiktok-cyan text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(37,244,238,0.4)] border border-tiktok-cyan/50 flex items-center gap-2 ml-2"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden md:inline">Terminal</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center transition-all active:scale-95 text-text-main"
          >
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center backdrop-blur-md text-text-main border border-black/10 dark:border-white/10"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-4 mx-6 p-6 bg-card-bg dark:bg-black/90 backdrop-blur-2xl flex flex-col gap-4 lg:hidden rounded-[32px] border border-black/10 dark:border-white/10 max-h-[70vh] overflow-y-auto shadow-2xl custom-scrollbar"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path, item.isSection || false)}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-tiktok-cyan/10 hover:text-tiktok-cyan transition-all text-left border border-transparent hover:border-tiktok-cyan/20"
              >
                {item.icon && <item.icon className="w-5 h-5 text-tiktok-cyan" />}
                <span className="font-bold uppercase tracking-widest text-sm text-text-main group-hover:text-tiktok-cyan">{item.name}</span>
              </button>
            ))}
            <div className="pt-4 mt-2 border-t border-black/5 dark:border-white/10 space-y-4">
              <a 
                href="https://wa.me/254706050538"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-5 rounded-2xl bg-[#25D366] text-white font-bold uppercase tracking-widest text-sm shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-5 h-5" /> WhatsApp Me
              </a>
              <Link 
                to="/admin" 
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-5 rounded-2xl bg-tiktok-cyan text-black text-center font-bold uppercase tracking-widest text-sm shadow-lg shadow-tiktok-cyan/20 flex items-center justify-center gap-2"
              >
                <Terminal className="w-5 h-5" /> Admin Terminal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
