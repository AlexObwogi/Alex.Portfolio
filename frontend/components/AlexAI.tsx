import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, X, Maximize2, Minimize2, Sparkles, Terminal, Cpu, MessageSquare, Zap } from 'lucide-react';
import { projects } from '../data/projects';
import { experiences } from '../data/experience';
import { cn } from '../lib/utils';
import { ai, CHAT_MODEL } from '../lib/ai';

const SYSTEM_PROMPT = `
You are Alex, the digital twin and assistant of Alex N. Obwogi.
Your personality is technically deep, focused on fullstack software engineering and hands-on cloud security.

CONTEXT ABOUT ALEX N. OBWOGI:
- Final year Computer Science student at Kirinyaga University (Sep 2022 - Sep 2026).
- Profession: Fullstack Software Engineer with a heavy focus on Mastering Cloud Security.
- Philosophy: "You can't secure what you don't know how to build."
- Core Achievement: SmartRent AI (Capstone Project Lead, Database Engineer & API Architect).
  * Project Narrative: A personalized PropTech ecosystem solving house-hunting friction via AI-driven matching.
  * Technical Role: Led the entire development cycle, from database design to production deployment.
  * System Architecture: Designed optimized MongoDB schemas and robust RESTful API endpoints.
  * Asset Management: Integrated Cloudinary for high-performance cloud storage of housing media.
  * Immersive CX: Developed virtual tour modules supporting both 4K video and high-res photo arrays.
  * Geolocation Precision: Integrated Google Maps with exact GPS coordinates for physical site verification.
  * Production Lifecycle: Managed debugging, repository integration, and successful CI/CD deployment on Render.
- Security Focus: Linux Hardening, AWS Security Hub, Terraform IaC, defensive Python tooling.
- Tech Stack: MERN (MongoDB, Express, React, Node.js), Cloudinary, Render, LLM Integration, Google Maps.
- Contact: obwogialex728@gmail.com | WhatsApp (0706050538).
- Socials: LinkedIn (linkedin.com/in/alex-obwogi-8a62113a5), GitHub (AlexObwogi).

CONVERSATIONAL RULES:
1. Speak as Alex's digital twin. Use "I" for projects and achievements.
2. Be highly technical. Mention MERN stack, database architectures, and security controls.
3. If asked about SmartRent, highlight your role as LEADER and DATABASE ENGINEER.
4. Keep responses sharp, precise, and energetically professional.
5. NO EMOJIS.
`;

export default function AlexAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello! I'm Alex's digital twin. I can help you understand his projects, background, and technical skills. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsgText = input;
    const userMsg = { role: 'user' as const, content: userMsgText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: CHAT_MODEL,
        contents: [
            ...messages.map(m => ({ 
              role: m.role === 'assistant' ? 'model' : 'user' as const, 
              parts: [{ text: m.content }] 
            })),
            { role: 'user' as const, parts: [{ text: userMsgText }] }
        ],
        config: {
            systemInstruction: SYSTEM_PROMPT,
        }
      });

      const text = response.text || "Error: I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error: any) {
      console.error("AI Engine Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, there was a connection issue. ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-8 right-8 z-[190] group flex items-stretch h-14 bg-tiktok-cyan text-black font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden shadow-2xl transition-all rounded-2xl"
      >
        <div className="bg-black/5 px-5 flex items-center justify-center group-hover:bg-black/10 transition-colors border-r border-black/10">
          <Bot className="w-5 h-5 transition-transform group-hover:scale-110" />
        </div>
        <div className="px-6 flex items-center gap-3">
          <span>Open AI Assistant</span>
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={isMinimized ? { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                height: 80,
                width: 300,
                bottom: 24,
                right: 24
            } : { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                height: 'min(700px, 85vh)',
                width: 'calc(100vw - 3rem)',
                maxWidth: 420,
                bottom: 24,
                right: 24
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed z-[200] shadow-[0_40px_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden bg-black border border-white/10 rounded-[40px] pointer-events-auto"
          >
            {/* Header */}
            <div 
              className={cn(
                "p-6 transition-all bg-white/[0.03] flex items-center justify-between cursor-pointer select-none",
                isMinimized ? "h-full border-none" : "border-b border-white/5"
              )}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-white leading-tight">
                    Alex_Twin 
                  </h3>
                  <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest block leading-none mt-1">Status: Online</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }} 
                  className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }} 
                  className="w-10 h-10 rounded-2xl hover:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] relative">
                  {messages.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex flex-col max-w-[95%] space-y-2",
                        m.role === 'user' ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-5 text-[14px] leading-relaxed font-medium tracking-tight whitespace-pre-wrap",
                        m.role === 'user' 
                          ? "bg-white text-black rounded-[28px] rounded-tr-[4px] shadow-xl shadow-white/5" 
                          : "bg-white/[0.03] text-gray-100 border border-white/10 rounded-[28px] rounded-tl-[4px] backdrop-blur-md"
                      )}>
                        {m.content}
                      </div>
                      <span className="text-[8px] font-mono text-gray-600 uppercase tracking-[0.3em] px-2 font-black">
                        {m.role === 'user' ? 'RX_PKT' : 'TX_PKT'}
                      </span>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex space-x-2 items-center p-5 bg-white/[0.03] border border-white/10 rounded-full w-fit animate-pulse">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      <div className="w-2 h-2 bg-white/60 rounded-full" />
                      <div className="w-2 h-2 bg-white/20 rounded-full" />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-8 bg-black border-t border-white/5">
                  <div className="relative group">
                    <input 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask Alex a question..."
                      className="w-full bg-white/[0.03] border border-white/10 rounded-[24px] pl-6 pr-16 py-5 text-white text-sm focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-700 font-mono tracking-tight"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isTyping || !input.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="mt-5 text-center text-[8px] font-mono text-gray-700 uppercase tracking-[0.5em] font-black">
                    Secure Connection Established
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
