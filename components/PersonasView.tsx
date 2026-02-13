import React, { useState, useMemo } from 'react';
import { Persona } from '../types';
import { UserCheck, Check, Search, Filter, Zap, BookOpen, Target, Sparkles } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { PERSONAS } from '../data/personas';
import DetailModal from './DetailModal';

const PersonaCard: React.FC<{ p: Persona, isActive: boolean, onActivate: () => void, onInfo: () => void }> = ({ p, isActive, onActivate, onInfo }) => (
    <div className={`group relative p-3 rounded-xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isActive 
        ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-500/20' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-800 hover:shadow-md'
    }`}>
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-indigo-500'}`}>
            <UserCheck size={64} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex flex-col">
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] mb-0.5 ${isActive ? 'text-indigo-100' : 'text-indigo-500'}`}>
                    {p.category}
                </span>
                <h3 className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {p.name}
                </h3>
            </div>
            <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                {isActive ? <Check size={10} className="text-white" strokeWidth={4} /> : <UserCheck size={10} className="text-slate-400" />}
            </div>
        </div>

        {/* Technical Keypoints */}
        <div className="space-y-1.5 mb-3 flex-1">
            <div className="flex items-center gap-1">
                <Target size={8} className={isActive ? 'text-indigo-100' : 'text-indigo-500'} />
                <span className={`text-[7px] font-bold uppercase tracking-widest ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>Behaviors</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
                {p.keypoints?.slice(0, 3).map((kp, i) => (
                    <div key={i} className={`flex items-center gap-1 text-[8px] ${isActive ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>
                        <div className={`w-0.5 h-0.5 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-500'}`} />
                        {kp}
                    </div>
                ))}
            </div>
        </div>

        {/* Use Cases */}
        <div className="flex flex-wrap gap-1 mb-4">
            {p.usecases?.slice(0, 2).map((uc, i) => (
                <span key={i} className={`px-1.5 py-0.5 rounded text-[7px] font-medium ${
                    isActive ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-transparent'
                }`}>
                    {uc}
                </span>
            ))}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-1.5 mt-auto pt-2 border-t border-black/5 dark:border-white/5">
            <button 
                onClick={(e) => { e.stopPropagation(); onInfo(); }}
                className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                    isActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
            >
                <BookOpen size={9} /> Details
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onActivate(); }}
                className={`flex-1 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
                    isActive 
                    ? 'bg-white text-indigo-600 hover:scale-[1.02]' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20'
                }`}
            >
                <Sparkles size={9} /> {isActive ? 'Active' : 'Inhabit'}
            </button>
        </div>
    </div>
);

const PersonasView: React.FC = () => {
  const { activePersona, setPersona, setHistory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedDetail, setSelectedDetail] = useState<Persona | null>(null);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(PERSONAS.map(p => p.category))).sort()]
  , []);

  const filtered = useMemo(() => 
    PERSONAS.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  , [searchTerm, filterCategory]);

  const handleToggle = (p: Persona) => {
      const isActivating = activePersona?.id !== p.id;
      setPersona(isActivating ? p.id : null);
      if (isActivating) {
        setHistory(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: `**Identity Shifted: ${p.name}**\nOperational perspective re-aligned to ${p.category} standards.`,
            timestamp: Date.now()
        }]);
      }
  };

  return (
    <div className="p-3 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center justify-between">
        <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter text-indigo-500">Identity Core</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Latent Personas</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <Sparkles size={10} className="text-indigo-500" />
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{filtered.length}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={12} />
            <input 
                type="text" placeholder="Filter identities..." 
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all outline-none"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select 
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20"
            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
        >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 pb-10">
        {filtered.map((p) => (
            <PersonaCard 
                key={p.id} 
                p={p} 
                isActive={activePersona?.id === p.id}
                onActivate={() => handleToggle(p)}
                onInfo={() => setSelectedDetail(p)}
            />
        ))}
      </div>

      {selectedDetail && (
        <DetailModal 
            isOpen={!!selectedDetail} onClose={() => setSelectedDetail(null)}
            title={selectedDetail.name} category={selectedDetail.category}
            description={selectedDetail.description} content={selectedDetail.system_prompt}
            tags={selectedDetail.tags}
            keypoints={selectedDetail.keypoints}
            usecases={selectedDetail.usecases}
            metadata={[
                { label: 'Def. Temp', value: selectedDetail.default_temp || 0.7 },
                { label: 'Category', value: selectedDetail.category },
                { label: 'Traits', value: selectedDetail.keypoints?.length || 0 },
                { label: 'Specialty', value: selectedDetail.tags?.[0] || 'Gen' }
            ]}
            onTest={() => handleToggle(selectedDetail)}
            isActive={activePersona?.id === selectedDetail.id}
        />
      )}
    </div>
  );
};

export default PersonasView;