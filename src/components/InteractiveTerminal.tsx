import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight, Command } from 'lucide-react';
import { cn } from '../lib/utils';

const COMMANDS = {
  help: 'Available commands: about, projects, skills, contact, clear, system, whoami',
  about: 'Alex Nyangaresi Obwogi. Lead Security Engineer & Fullstack Architect. Specializing in high-performance digital ecosystems and cloud defense.',
  projects: 'PKT_01: SmartRent AI, PKT_02: Lab Security Suite, PKT_03: Cloud Perimeter.',
  skills: 'React, Node.js, TypeScript, Python, AWS Security, MongoDB, Docker, CI/CD.',
  contact: 'Email: obwogialex0@gmail.com | WhatsApp: +254706050538',
  system: 'OS: AlexCore v4.2.0 | Status: LAB_ACTIVE | Security: ENFORCED',
  whoami: 'Guest Identity: UNKNOWN | Access Level: VIEW_ONLY',
  clear: ''
};

export function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['ALEX_CORE_TERMINAL v4.2.0', 'Type "help" to list available commands.', '']);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;

    const newHistory = [...history, `> ${input}`];

    if (cmd === 'clear') {
      setHistory(['Terminal cleared.', '']);
    } else if (COMMANDS[cmd as keyof typeof COMMANDS]) {
      newHistory.push(COMMANDS[cmd as keyof typeof COMMANDS]);
      newHistory.push('');
      setHistory(newHistory);
    } else {
      newHistory.push(`Error: Command "${cmd}" not recognized. Type "help" for options.`);
      newHistory.push('');
      setHistory(newHistory);
    }

    setInput('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-[250] flex flex-col pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 40 : 400,
              width: isMinimized ? 200 : 500
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto backdrop-blur-2xl flex flex-col mb-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/5">
              <div className="flex items-center gap-2">
                <TerminalIcon className="w-3 h-3 text-tiktok-cyan" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60">sys_shell_v4</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(!isMinimized)} className="hover:text-tiktok-cyan transition-colors">
                  {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:text-tiktok-red transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 scrollbar-hide">
                  {history.map((line, i) => (
                    <div key={i} className={cn(
                      line.startsWith('>') ? "text-tiktok-cyan" : "text-white/80",
                      line.startsWith('Error') ? "text-tiktok-red" : ""
                    )}>
                      {line}
                    </div>
                  ))}
                  <form onSubmit={handleCommand} className="flex items-center gap-2 pt-1">
                    <ChevronRight className="w-3 h-3 text-tiktok-cyan animate-pulse" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="bg-transparent border-none outline-none flex-1 text-white lowercase placeholder:text-white/10"
                      placeholder="root@obwogi:~$"
                      spellCheck={false}
                      autoFocus
                    />
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-tiktok-cyan hover:border-tiktok-cyan/50 hover:bg-tiktok-cyan/5 transition-all pointer-events-auto backdrop-blur-lg group shadow-xl"
      >
        {isOpen ? <Command className="w-5 h-5 text-tiktok-cyan" /> : <TerminalIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />}
        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-tiktok-cyan animate-ping opacity-60" />
      </motion.button>
    </div>
  );
}
