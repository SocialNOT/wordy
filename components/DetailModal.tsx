import React from 'react';
import { X, Play, BookOpen, Settings, Tag, Target, CheckCircle, Zap, Activity, Lightbulb, Code, ExternalLink, Shield } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  description: string;
  content: string;
  metadata?: { label: string; value: string | number | React.ReactNode }[];
  tags?: string[];
  keypoints?: string[];
  usecases?: string[];
  onTest?: () => void;
  isActive?: boolean;
  type?: 'Framework' | 'Persona' | 'Control' | 'Module';
}

const DetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, onClose, title, category, description, content, metadata, tags, keypoints, usecases, onTest, isActive, type = 'Framework'
}) => {
  if (!isOpen) return null;

  const typeColors = {
    Framework: 'from-blue-600/20 to-blue-400/5',
    Persona: 'from-indigo-600/20 to-indigo-400/5',
    Control: 'from-purple-600/20 to-purple-400/5',
    Module: 'from-emerald-600/20 to-emerald-400/5'
  };

  const accentColor = {
    Framework: 'text-blue-500 bg-blue-600',
    Persona: 'text-indigo-500 bg-indigo-600',
    Control: 'text-purple-500 bg-purple-600',
    Module: 'text-emerald-500 bg-emerald-600'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 border-x border-b md:border border-slate-200 dark:border-slate-800 rounded-none md:rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col h-full md:h-auto md:max-h-[90vh] ring-1 ring-black/10 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Gradient Background */}
        <div className={`absolute top-0 left-0 w-full h-40 bg-gradient-to-br ${typeColors[type]} pointer-events-none`} />

        {/* Top Control Bar */}
        <div className="flex items-center justify-between p-4 md:p-6 relative z-30">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${accentColor[type]} text-white shadow-lg`}>
                    {type === 'Framework' && <Activity size={16} />}
                    {type === 'Persona' && <Target size={16} />}
                    {type === 'Control' && <Shield size={16} />}
                    {type === 'Module' && <BookOpen size={16} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Blueprint Explorer</span>
            </div>
            <button 
                onClick={onClose}
                className="p-2 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all shadow-sm border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
            >
                <X size={18} className="text-slate-500 dark:text-slate-400" />
            </button>
        </div>

        {/* Content Area */}
        <div className="px-6 md:px-10 pb-6 overflow-y-auto custom-scrollbar flex-1 relative z-10 space-y-8">
            {/* Title & Status */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    {category && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${accentColor[type].split(' ')[1]}`}>
                            {category}
                        </span>
                    )}
                    {isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                            <CheckCircle size={10} /> Active
                        </span>
                    )}
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{title}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {description}
                </p>
            </div>

            {/* Stats/Metadata Grid */}
            {metadata && metadata.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {metadata.map((meta, idx) => (
                        <div key={idx} className="bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/50 transition-colors group hover:bg-slate-100 dark:hover:bg-slate-800 flex flex-col justify-center">
                            <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1 group-hover:text-blue-500 transition-colors">{meta.label}</span>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{meta.value}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Strategic Detail Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {keypoints && keypoints.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className={accentColor[type].split(' ')[0]} />
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">Logic Nodes</h3>
                        </div>
                        <div className="space-y-2.5">
                            {keypoints.map((kp, i) => (
                                <div key={i} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
                                    <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${accentColor[type].split(' ')[1]}`} />
                                    {kp}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {usecases && usecases.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Lightbulb size={16} className="text-amber-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">Applications</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {usecases.map((uc, i) => (
                                <span key={i} className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                                    {uc}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Raw Directive Display */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Code size={16} className="text-indigo-500" />
                        <h3 className="text-xs font-black uppercase tracking-[0.15em] text-slate-900 dark:text-slate-100">Directives</h3>
                    </div>
                    <button className="text-[9px] font-bold text-slate-400 hover:text-blue-500 uppercase flex items-center gap-1 transition-colors">
                        <ExternalLink size={10} /> Copy Source
                    </button>
                </div>
                <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-10 group-hover:opacity-15 transition duration-500`} />
                    <div className="relative bg-slate-950 dark:bg-black rounded-2xl p-6 border border-slate-800 shadow-inner">
                        <pre className="text-xs font-mono text-blue-400 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar scroll-smooth font-medium">
                            {content}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Interaction Footer (Tags) */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    {tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1.5 rounded-full border border-transparent hover:border-blue-500/30 transition-all cursor-default">
                            #{tag.toUpperCase()}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {/* Action Persistent Footer */}
        <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80 backdrop-blur-md flex gap-4 flex-shrink-0 z-40">
            {onTest && (
                <button
                    onClick={() => { onTest(); onClose(); }}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 group ${
                        isActive 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                    }`}
                >
                    {isActive ? 'Revoke Deployment' : 'Authorize Deployment'}
                    <Zap size={16} fill="currentColor" className="group-hover:animate-pulse" />
                </button>
            )}
            <button
                onClick={onClose}
                className="px-12 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 shadow-sm border border-slate-200 dark:border-slate-700"
            >
                Return
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;