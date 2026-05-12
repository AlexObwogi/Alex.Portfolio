import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, User, Briefcase, Mail, Home, MessageSquare, Sun, Moon, Sparkles, LayoutGrid, Code, Cpu, ShieldCheck, FileText, Award } from 'lucide-react';
import { cn } from '../lib/utils';

const primaryNavItems = [
  { name: 'Home', path: '/', isSection: true, icon: Home },
  { name: 'About', path: 'about', isSection: true, icon: User },
  { name: 'Services', path: '/services', isSection: false, icon: Cpu },
  { name: 'Projects', path: 'projects', isSection: true, icon: Code },
];

const secondaryNavItems = [
  { name: 'Timeline', path: 'experience', isSection: true, icon: Briefcase },
  { name: 'Credentials', path: '/credentials', isSection: false, icon: Award },
  { name: 'Tech Stack', path: '/tech-stack', isSection: false, icon: LayoutGrid },
  { name: 'Resume', path: '/resume', isSection: false, icon: FileText },
  { name: 'Contact', path: 'contact', isSection: true, icon: Mail },
];

export default function Navbar({ toggleTheme, isDark }: { toggleTheme: () => void, isDark: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
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
      setIsMoreOpen(false);
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
    setIsMoreOpen(false);
  };

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-[200] transition-all duration-500",
        isScrolled ? "py-4 bg-black/40 backdrop-blur-3xl" : "py-8"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        {/* Left Cluster: Logo & System Info */}
        <div className="flex items-center gap-8">
          <Link to="/" onClick={() => handleNavClick('/', true)} className="flex items-center gap-4 group">
            <div className="relative">
              <div className="absolute inset-0 bg-tiktok-cyan/20 blur-xl rounded-full scale-150 animate-pulse" />
              <div className="w-12 h-12 rounded-full bg-tiktok-cyan flex items-center justify-center group-hover:bg-tiktok-red transition-all duration-500 shadow-[0_0_30px_rgba(37,244,238,0.4)] relative z-10 border border-white/20">
                <Home className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-black text-xl tracking-[0.2em] uppercase hidden md:block text-white">
                ALEX N. OBWOGI
              </span>
              <div className="hidden md:flex items-center gap-2 overflow-hidden h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-tiktok-cyan animate-pulse" />
                <span className="font-mono text-[8px] text-tiktok-cyan/70 uppercase tracking-[0.3em] whitespace-nowrap">
                  Operational // Portfolio
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Cluster: Primary Nav + More Toggle + Actions */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2 pr-6 border-r border-white/5">
            {primaryNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path, item.isSection || false)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group flex items-center gap-2",
                  ((item.path === '/' && location.pathname === '/' && !location.hash) || 
                   (location.pathname === '/' && location.hash === `#${item.path}`) ||
                   (location.pathname === item.path)) 
                    ? "text-tiktok-cyan" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                {item.icon && <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                <span>{item.name}</span>
                {((item.path === '/' && location.pathname === '/' && !location.hash) || 
                  (location.pathname === '/' && location.hash === `#${item.path}`) ||
                  (location.pathname === item.path)) && (
                  <motion.div 
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/5 rounded-full border border-white/10 -z-10"
                  />
                )}
              </button>
            ))}

            {/* Desktop More Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={cn(
                  "px-4 py-2.5 rounded-full flex items-center gap-3 transition-all duration-300 border",
                  isMoreOpen 
                    ? "bg-tiktok-cyan text-black border-tiktok-cyan" 
                    : "bg-white/5 text-gray-400 border-white/10 hover:border-tiktok-cyan/30"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">More.</span>
              </button>

              <AnimatePresence>
                {isMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-72 bg-black/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-[0_30px_60px_-15px_rgba(37,244,238,0.2)] overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-tiktok-cyan/30" />
                    <div className="absolute inset-0 bg-gradient-to-br from-tiktok-cyan/5 to-transparent pointer-events-none" />
                    
                    <div className="space-y-1 relative z-10">
                      <p className="text-[8px] font-mono text-tiktok-cyan/50 uppercase tracking-[0.4em] mb-3 px-4 px-4 font-black">All Categories</p>
                      {secondaryNavItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavClick(item.path, item.isSection || false)}
                          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-white/5 transition-all text-left group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-tiktok-cyan group-hover:text-black transition-all">
                             <item.icon className="w-4 h-4" />
                          </div>
                          <span className="font-black uppercase tracking-[0.15em] text-[10px] text-gray-400 group-hover:text-white transition-colors">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Core Actions */}
          <div className="flex items-center gap-2 ml-4">
             <button
              onClick={toggleTheme}
              className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all hover:border-tiktok-cyan/50"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link 
              to="/admin" 
              className="px-6 py-2.5 rounded-full bg-tiktok-cyan text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(37,244,238,0.3)] flex items-center gap-2 border border-tiktok-cyan/30"
            >
              <ShieldCheck className="w-4 h-4" strokeWidth={3} />
              <span className="hidden sm:inline">Portal</span>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-11 h-11 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md text-white border border-white/10"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar View */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-screen w-[85%] max-w-sm bg-black/95 backdrop-blur-3xl lg:hidden flex flex-col p-8 border-l border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="space-y-1">
                   <h3 className="font-black text-xl tracking-[0.2em] text-white">MENU.</h3>
                   <div className="w-12 h-1 bg-tiktok-cyan rounded-full" />
                 </div>
                 <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-white/5 rounded-xl">
                   <X className="w-6 h-6 text-tiktok-cyan" />
                 </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-4">
                <p className="text-[9px] font-mono text-tiktok-cyan/50 tracking-[0.4em] uppercase mb-4 px-2 font-black">Navigation</p>
                {[...primaryNavItems, ...secondaryNavItems].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.path, item.isSection || false)}
                    className="w-full flex items-center gap-5 p-5 rounded-2xl hover:bg-tiktok-cyan/10 group transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-tiktok-cyan group-hover:text-black transition-all border border-white/5">
                       {item.icon && <item.icon className="w-5 h-5" />}
                    </div>
                    <span className="font-black uppercase tracking-[0.2em] text-sm text-gray-400 group-hover:text-white">{item.name}</span>
                  </button>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <a 
                  href="https://wa.me/254706050538"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 group hover:border-tiktok-cyan transition-all"
                >
                  <MessageSquare className="w-5 h-5 text-tiktok-cyan" />
                  <span className="font-black uppercase tracking-widest text-xs">Direct_Pulse</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
