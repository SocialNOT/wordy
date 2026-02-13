import React from 'react';
import { Map, Zap, Rocket, CheckCircle, Circle, Milestone, Cpu, Brain, Database, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

const RoadmapView: React.FC = () => {
  const milestones = [
    {
      id: 1,
      title: "V1.0 Neural Core",
      status: "completed",
      date: "Q4 2024",
      desc: "Baseline prompt engineering protocols and basic context grounding using high-speed flash engines.",
      icon: <Database size={16} />
    },
    {
      id: 2,
      title: "V2.0 Cognitive Architectures",
      status: "current",
      date: "Q1 2025",
      desc: "Multi-persona orchestration, R.A.C.E implementation, and low-latency native audio integration for real-time synthesis.",
      icon: <Brain size={16} />
    },
    {
      id: 3,
      title: "V2.5 World of TEXTS",
      status: "upcoming",
      date: "Q2 2025",
      desc: "Advanced RAG optimization with cross-session persistence and token-efficient context distillation protocols.",
      icon: <Cpu size={16} />
    },
    {
      id: 4,
      title: "V3.0 Autonomous OS",
      status: "planned",
      date: "Q4 2025",
      desc: "Self-correcting agentic loops, custom external tool integration, and hardware-level bridging for physical orchestration.",
      icon: <Globe size={16} />
    }
  ];

  return (
    <div className="p-4 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar">
      <div className="max-w-xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 ring-1 ring-blue-400">
            <Map size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Evolution Roadmap</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Cognitive OS Milestones
            </p>
          </div>
        </div>

        {/* Milestone List */}
        <div className="space-y-4 relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 ml-5">
          {milestones.map((item, idx) => (
            <div key={item.id} className="relative group animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className={`absolute -left-[44px] top-0 p-2 rounded-xl z-10 transition-all duration-300 ${
                item.status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                item.status === 'current' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/10 scale-110' : 
                'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}>
                {item.status === 'completed' ? <CheckCircle size={18} /> : 
                 item.status === 'current' ? <Rocket size={18} className="animate-float" /> : 
                 item.icon}
              </div>

              <div className={`p-5 rounded-2xl border transition-all duration-500 ${
                item.status === 'current' 
                ? 'bg-white dark:bg-slate-900 border-blue-500 shadow-xl ring-1 ring-blue-500/20' 
                : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-black text-sm uppercase tracking-tight ${item.status === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                            {item.date}
                        </span>
                        {item.status === 'current' && (
                            <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-widest animate-pulse">
                                Active Module
                            </span>
                        )}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Master Training Detail Module Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-900 dark:to-black rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl border border-slate-800 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-blue-400" />
              <h3 className="text-sm font-black uppercase tracking-widest italic text-blue-400">Master Class: Cognitive Design</h3>
            </div>
            
            <div className="space-y-3">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-slate-300 mb-1 tracking-wide uppercase opacity-60">Technical Blueprint</p>
                    <p className="text-xs leading-relaxed text-slate-200">
                        Detailed training involves shifting from token-based retrieval to logic-first synthesis. Operators must master the "Constraint Matrix" to prevent hallucination gradients.
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                        <span className="block text-[8px] font-black uppercase text-blue-400">Complexity</span>
                        <span className="text-[10px] font-bold">Strategic Tier A</span>
                    </div>
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-center">
                        <span className="block text-[8px] font-black uppercase text-blue-400">Duration</span>
                        <span className="text-[10px] font-bold">128 Cycles</span>
                    </div>
                </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95">
                Initialize Detailed Sequence <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;