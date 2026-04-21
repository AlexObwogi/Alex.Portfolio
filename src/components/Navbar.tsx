import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Terminal, User, Briefcase, Mail, Home, MessageSquare, Sun, Moon, Sparkles, LayoutGrid, Code, Cpu, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { name: 'Home', path: '/', isSection: true, icon: Home },
  { name: 'About', path: 'about', isSection: true, icon: User },
  { name: 'Services', path: '/services', isSection: false, icon: ShieldCheck },
  { name: 'Stack', path: '/tech-stack', isSection: false, icon: Code },
  { name: 'Projects', path: 'projects', isSection: true, icon: LayoutGrid },
  { name: 'Exp', path: 'experience', isSection: true, icon: Briefcase },
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
          <span className="font-mono font-black text-lg tracking-[0.2em] uppercase hidden xl:block">
            Alex.Portfolio
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 dark:bg-black/20 backdrop-blur-3xl border border-black/5 dark:border-white/10 rounded-full p-1.5 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path, item.isSection || false, item.isExternal)}
              className={cn(
                "px-3 lg:px-5 py-2 rounded-full text-[9px] lg:text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative group flex items-center gap-2",
                ((item.path === '/' && location.pathname === '/' && !location.hash) || 
                 (location.pathname === '/' && location.hash === `#${item.path}`) ||
                 (location.pathname === item.path)) 
                  ? "text-tiktok-cyan" 
                  : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{item.name}</span>
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
            className="ml-4 px-6 py-2 rounded-full bg-tiktok-cyan text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(37,244,238,0.4)] border border-tiktok-cyan/50 flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            <span className="hidden xl:inline">Terminal</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all active:scale-95"
          >
            {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md"
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
            className="absolute top-full left-0 right-0 mt-4 mx-6 p-6 glass flex flex-col gap-4 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path, item.isSection || false, item.isExternal)}
                className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-left transition-colors"
              >
                <span className="font-bold uppercase tracking-widest text-sm">{item.name}</span>
              </button>
            ))}
            <a 
              href="https://wa.me/254706050538"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-[#25D366] text-white font-bold uppercase tracking-widest text-sm"
            >
              <MessageSquare className="w-5 h-5" /> WhatsApp Me
            </a>
            <Link 
              to="/admin" 
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 w-full py-4 rounded-2xl bg-tiktok-red text-white text-center font-bold uppercase tracking-widest text-sm"
            >
              Admin Terminal
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
