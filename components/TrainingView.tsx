import React, { useState, useMemo } from 'react';
import { TRAINING_MODULES } from '../data/training';
import { useStore } from '../contexts/StoreContext';
import { BookOpen, Lock, CheckCircle, ChevronRight, Play, Maximize2, ShieldCheck, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DetailModal from './DetailModal';

const TrainingView: React.FC = () => {
  const { completedModules, completeModule } = useStore();
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [showFullDetail, setShowFullDetail] = useState(false);

  const isLocked = (phaseIndex: number, modIndex: number) => {
    if (phaseIndex === 0 && modIndex === 0) return false;
    if (modIndex > 0) {
      const prevMod = TRAINING_MODULES[phaseIndex].modules[modIndex - 1];
      return !completedModules.includes(prevMod.id);
    }
    if (phaseIndex > 0) {
        const prevPhase = TRAINING_MODULES[phaseIndex - 1];
        const lastMod = prevPhase.modules[prevPhase.modules.length - 1];
        return !completedModules.includes(lastMod.id);
    }
    return true;
  };

  const activeModuleData = useMemo(() => 
    activeModuleId ? TRAINING_MODULES.flatMap(p => p.modules).find(m => m.id === activeModuleId) : null
  , [activeModuleId]);

  const totalModules = TRAINING_MODULES.reduce((acc, p) => acc + p.modules.length, 0);
  const progress = (completedModules.length / totalModules) * 100;

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      {/* List Column */}
      <div className={`w-full md:w-[320px] border-r border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 transition-all ${activeModuleId ? 'hidden lg:block' : 'block'}`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                  <GraduationCap size={18} />
              </div>
              <div>
                  <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">WoT Academy</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Mastery Program</p>
              </div>
          </div>
          
          <div className="space-y-1.5">
              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <span>System Progress</span>
                  <span>{completedModules.length} / {totalModules}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-lg" style={{ width: `${progress}%` }} />
              </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {TRAINING_MODULES.map((phase, i) => (
            <div key={phase.id} className="space-y-3">
              <div className="px-2">
                <h3 className="font-black text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-[0.2em] opacity-50">{phase.phase}</h3>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{phase.desc}</p>
              </div>
              <div className="space-y-1.5">
                {phase.modules.map((mod, j) => {
                  const locked = isLocked(i, j);
                  const completed = completedModules.includes(mod.id);
                  const isActive = activeModuleId === mod.id;

                  return (
                    <button
                      key={mod.id}
                      disabled={locked}
                      onClick={() => setActiveModuleId(mod.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between group relative overflow-hidden ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                          : locked
                          ? 'bg-slate-50 dark:bg-slate-950 opacity-40 grayscale cursor-not-allowed'
                          : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                           {locked ? <Lock size={12} /> : completed ? <CheckCircle size={12} className="text-emerald-500" /> : <Play size={12} className={isActive ? 'text-white' : 'text-blue-500'} />}
                        </div>
                        <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'text-white' : ''}`}>{mod.title}</span>
                      </div>
                      <ChevronRight size={14} className={`relative z-10 transition-transform ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Column */}
      <div className={`w-full flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar ${activeModuleId ? 'block' : 'hidden lg:flex items-center justify-center'}`}>
        {activeModuleData ? (
           <div className="max-w-3xl mx-auto p-6 md:p-12 lg:p-20 space-y-10 animate-in slide-in-from-bottom-5 duration-500">
              {/* Back button for mobile */}
              <button onClick={() => setActiveModuleId(null)} className="lg:hidden flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors">
                  &larr; Phase Index
              </button>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <ShieldCheck size={18} />
                    <span className="font-black tracking-[0.2em] text-[10px] uppercase">Validated Training Module</span>
                </div>
                <button 
                  onClick={() => setShowFullDetail(true)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all hover:scale-110"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                    {activeModuleData.title}
                  </h1>
                  <div className="h-1 w-20 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
              </div>

              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-strong:text-blue-600 dark:prose-strong:text-blue-400 prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800">
                 <ReactMarkdown>{activeModuleData.content}</ReactMarkdown>
              </div>

              <div className="pt-10 border-t border-slate-200 dark:border-slate-800">
                <div className={`p-8 rounded-3xl border flex flex-col items-center text-center transition-all ${
                    completedModules.includes(activeModuleData.id)
                    ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl'
                }`}>
                    <div className={`p-4 rounded-full mb-6 ${completedModules.includes(activeModuleData.id) ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 animate-bounce'}`}>
                        <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Knowledge Validation</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
                        Authorize this module as "Completed" once you have fully integrated the cognitive patterns presented.
                    </p>
                    
                    {completedModules.includes(activeModuleData.id) ? (
                        <div className="flex flex-col items-center gap-2">
                            <span className="px-6 py-2 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20">Module Verified</span>
                            <p className="text-[10px] font-bold text-emerald-600 opacity-60">Pattern integrated into Neural Matrix</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => completeModule(activeModuleData.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                        >
                            Complete Authorization
                        </button>
                    )}
                </div>
              </div>
           </div>
        ) : (
            <div className="text-center p-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700 shadow-inner">
                    <GraduationCap size={48} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Access Restricted</h3>
                <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">Select a knowledge module from the terminal on the left to begin your training sequence.</p>
            </div>
        )}
      </div>

      {activeModuleData && showFullDetail && (
          <DetailModal 
              isOpen={showFullDetail} 
              onClose={() => setShowFullDetail(false)}
              title={activeModuleData.title}
              type="Module"
              category="Academy"
              description="Full Module Specification"
              content={activeModuleData.content}
              metadata={[
                  { label: 'Status', value: completedModules.includes(activeModuleData.id) ? 'Validated' : 'Pending' },
                  { label: 'Complexity', value: 'High' },
                  { label: 'Module ID', value: activeModuleData.id }
              ]}
              onTest={!completedModules.includes(activeModuleData.id) ? () => completeModule(activeModuleData.id) : undefined}
              isActive={completedModules.includes(activeModuleData.id)}
          />
      )}
    </div>
  );
};

export default TrainingView;