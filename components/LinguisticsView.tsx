import React, { useState, useMemo } from 'react';
import { LinguisticControl } from '../types';
import { SpellCheck, Check, Search, Zap, BookOpen, Target, Settings } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { LINGUISTICS } from '../data/linguistics';
import DetailModal from './DetailModal';

const LinguisticCard: React.FC<{ l: LinguisticControl, isActive: boolean, onActivate: () => void, onInfo: () => void }> = ({ l, isActive, onActivate, onInfo }) => (
    <div className={`group relative p-3 rounded-xl border transition-all duration-300 flex flex-col h-full overflow-hidden ${
        isActive 
        ? 'bg-purple-600 border-purple-500 shadow-lg shadow-purple-500/20' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-800 hover:shadow-md'
    }`}>
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 -mr-4 -mt-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-purple-500'}`}>
            <SpellCheck size={64} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex flex-col">
                <span className={`text-[7px] font-black uppercase tracking-[0.2em] mb-0.5 ${isActive ? 'text-purple-100' : 'text-purple-500'}`}>
                    {l.category}
                </span>
                <h3 className={`text-xs font-black tracking-tight ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {l.name}
                </h3>
            </div>
            <div className={`p-1 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-50 dark:bg-slate-800'}`}>
                {isActive ? <Check size={10} className="text-white" strokeWidth={4} /> : <Settings size={10} className="text-slate-400" />}
            </div>
        </div>

        {/* Technical Keypoints */}
        <div className="space-y-1.5 mb-3 flex-1">
            <div className="flex items-center gap-1">
                <Target size={8} className={isActive ? 'text-purple-100' : 'text-purple-500'} />
                <span className={`text-[7px] font-bold uppercase tracking-widest ${isActive ? 'text-purple-100' : 'text-slate-400'}`}>Constraints</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
                {l.keypoints?.slice(0, 3).map((kp, i) => (
                    <div key={i} className={`flex items-center gap-1 text-[8px] ${isActive ? 'text-white/80' : 'text-slate-600 dark:text-slate-300'}`}>
                        <div className={`w-0.5 h-0.5 rounded-full ${isActive ? 'bg-white' : 'bg-purple-500'}`} />
                        {kp}
                    </div>
                ))}
            </div>
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
                    ? 'bg-white text-purple-600 hover:scale-[1.02]' 
                    : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-500/20'
                }`}
            >
                <Zap size={9} /> {isActive ? 'Applied' : 'Deploy'}
            </button>
        </div>
    </div>
);

const LinguisticsView: React.FC = () => {
  const { activeLinguistics, toggleLinguistic, setHistory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedDetail, setSelectedDetail] = useState<LinguisticControl | null>(null);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(LINGUISTICS.map(l => l.category))).sort()]
  , []);

  const filtered = useMemo(() => 
    LINGUISTICS.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            l.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || l.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  , [searchTerm, filterCategory]);

  const handleToggle = (l: LinguisticControl) => {
      toggleLinguistic(l.id);
      const isActivating = !activeLinguistics.some(x => x.id === l.id);
      if (isActivating) {
        setHistory(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: `**Linguistic Filter Deployed: ${l.name}**\nOutput structure restricted to ${l.category} parameters.`,
            timestamp: Date.now()
        }]);
      }
  };

  return (
    <div className="p-3 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar flex flex-col">
      <div className="flex-shrink-0 mb-4 flex items-center justify-between">
        <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter text-purple-500">Linguistic Gates</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Syntax Controllers</p>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
            <Zap size={10} className="text-purple-500" />
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">{filtered.length}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1 group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={12} />
            <input 
                type="text" placeholder="Search syntax..." 
                className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-purple-500/20 text-xs transition-all outline-none"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select 
            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-purple-500/20"
            value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
        >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-3 pb-10">
        {filtered.map((l) => (
            <LinguisticCard 
                key={l.id} 
                l={l} 
                isActive={activeLinguistics.some(x => x.id === l.id)}
                onActivate={() => handleToggle(l)}
                onInfo={() => setSelectedDetail(l)}
            />
        ))}
      </div>

      {selectedDetail && (
        <DetailModal 
            isOpen={!!selectedDetail} onClose={() => setSelectedDetail(null)}
            title={selectedDetail.name} category={selectedDetail.category}
            description={selectedDetail.description} content={selectedDetail.system_instruction}
            keypoints={selectedDetail.keypoints}
            usecases={selectedDetail.usecases}
            metadata={[
                { label: 'Gate', value: selectedDetail.category },
                { label: 'Priority', value: 'High' },
                { label: 'Rules', value: selectedDetail.keypoints?.length || 0 },
                { label: 'Apps', value: selectedDetail.usecases?.length || 0 }
            ]}
            onTest={() => handleToggle(selectedDetail)}
            isActive={activeLinguistics.some(x => x.id === selectedDetail.id)}
        />
      )}
    </div>
  );
};

export default LinguisticsView;