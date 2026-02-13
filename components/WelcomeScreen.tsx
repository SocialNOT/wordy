import React from 'react';
import { Sparkles, Brain, Zap, Globe, Cpu, Command, ArrowRight, Activity, Database, Shield } from 'lucide-react';

interface WelcomeScreenProps {
  onQuickStart: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickStart }) => {
  const cards = [
    {
      icon: <Brain className="text-purple-500" size={18} />,
      title: "Deep Reasoning",
      desc: "Chain of Thought Architecture",
      prompt: "/cot Analyze the long-term impact of AI on specialized education.",
      span: "col-span-2 md:col-span-1"
    },
    {
      icon: <Globe className="text-blue-500" size={18} />,
      title: "Live Research",
      desc: "Real-time Web Grounding",
      prompt: "What are the latest breakthroughs in fusion energy today?",
      span: "col-span-2 md:col-span-1"
    },
    {
      icon: <Zap className="text-amber-500" size={18} />,
      title: "Rapid Ideation",
      desc: "Flash-Lite Engine Speed",
      prompt: "/scamper Brainstorm 10 novel uses for recycled ocean plastic.",
      span: "col-span-2 md:col-span-1"
    },
    {
      icon: <Cpu className="text-emerald-500" size={18} />,
      title: "Engineering",
      desc: "High-Availability Systems",
      prompt: "/cto Design a high-availability vector database architecture.",
      span: "col-span-2 md:col-span-1"
    },
    {
      icon: <Activity className="text-rose-500" size={18} />,
      title: "Critical Audit",
      desc: "Logic Stress Verification",
      prompt: "/devil Critique the logic of universal basic income models.",
      span: "col-span-2"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-start h-full px-4 py-8 animate-in fade-in zoom-in duration-500 max-w-2xl mx-auto overflow-y-auto custom-scrollbar pb-32 sm:pb-12">
      
      {/* Dynamic Status Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between px-3 py-2.5 mb-8 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm gap-3">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">OS READY</span>
           </div>
           <div className="hidden sm:block h-3 w-px bg-slate-300 dark:bg-slate-700"></div>
           <div className="flex items-center gap-2">
              <Database size={12} className="text-blue-500"/>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">NEURAL CORE</span>
           </div>
        </div>
        <div className="flex items-center gap-2">
           <Shield size={12} className="text-indigo-500"/>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-indigo-500">ENCRYPTION ACTIVE</span>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3 justify-center">
          <Sparkles size={28} className="text-blue-500" />
          WO TEXTS <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-lg text-blue-600 dark:text-blue-400">V2.5</span>
        </h1>
        <p className="text-[11px] text-slate-400 mt-2 uppercase font-black tracking-[0.3em]">Cognitive Operating Interface</p>
      </div>

      {/* Masonry-style grid */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {cards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => onQuickStart(card.prompt)}
            className={`group relative p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-left transition-all duration-300 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-700 active:scale-[0.97] ${card.span}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                {card.icon}
              </div>
              <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-500 transition-all opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0" />
            </div>
            <h3 className="font-black text-xs md:text-sm text-slate-800 dark:text-slate-100 leading-tight mb-1">{card.title}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mb-3 opacity-80 font-medium">{card.desc}</p>
            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-black/40 px-2.5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-200 dark:group-hover:border-blue-900 transition-colors font-semibold">
              {card.prompt}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-12 mb-8 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
          <Command size={14} className="text-blue-500" />
          <span>Type <kbd className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm font-black">/</kbd> for direct command injection</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;