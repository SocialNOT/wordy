import React, { useState, useMemo } from 'react';
import { Framework } from '../types';
import { Box, Layers, Zap, BookOpen, Activity, Search, Filter, ChevronRight, Lightbulb } from 'lucide-react';
import { useStore } from '../contexts/StoreContext';
import { FRAMEWORKS } from '../data/frameworks';
import DetailModal from './DetailModal';

const FrameworkCard: React.FC<{ 
  fw: Framework, 
  isActive: boolean, 
  onActivate: () => void, 
  onInfo: () => void 
}> = ({ fw, isActive, onActivate, onInfo }) => (
    <button 
      onClick={onInfo}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col h-full overflow-hidden text-left ${
        isActive 
        ? 'bg-blue-600 border-blue-500 shadow-xl shadow-blue-500/30 ring-2 ring-blue-400' 
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800 hover:shadow-lg'
    }`}>
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-24 h-24 opacity-5 -mr-6 -mt-6 transition-transform group-hover:scale-125 ${isActive ? 'text-white' : 'text-blue-500'}`}>
            <Layers size={96} />
        </div>

        {/* Header Section */}
        <div className="flex justify-between items-start mb-3 relative z-10 w-full">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}>
                      {fw.category}
                  </span>
                  <span className={`text-[8px] font-bold uppercase ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                      {fw.complexity}
                  </span>
                </div>
                <h3 className={`text-sm font-black tracking-tight mt-1 ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {fw.name}
                </h3>
            </div>
            <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-white text-blue-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                {isActive ? <Zap size={14} fill="currentColor" /> : <Box size={14} />}
            </div>
        </div>

        {/* Description */}
        <p className={`text-[10px] leading-relaxed mb-4 font-medium line-clamp-2 ${isActive ? 'text-blue-50' : 'text-slate-600 dark:text-slate-400'}`}>
            {fw.description}
        </p>

        {/* Technical Keypoints / Logic Core */}
        {fw.keypoints && fw.keypoints.length > 0 && (
          <div className="mb-4 space-y-1.5 relative z-10">
              <div className="flex items-center gap-1.5">
                  <Activity size={10} className={isActive ? 'text-blue-100' : 'text-blue-500'} />
                  <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>Logic Core</span>
              </div>
              <div className="flex flex-col gap-1">
                  {fw.keypoints.slice(0, 3).map((kp, i) => (
                      <div key={i} className={`flex items-start gap-2 text-[9px] leading-tight ${isActive ? 'text-white/90' : 'text-slate-700 dark:text-slate-300'}`}>
                          <div className={`mt-1 w-1 h-1 rounded-full shrink-0 ${isActive ? 'bg-white' : 'bg-blue-500'}`} />
                          <span className="truncate">{kp}</span>
                      </div>
                  ))}
              </div>
          </div>
        )}

        {/* Use Cases - Targeted Chips */}
        {fw.usecases && (
          <div className="flex flex-wrap gap-1 mb-4 mt-auto relative z-10">
              {fw.usecases.slice(0, 3).map((uc, i) => (
                  <span key={i} className={`px-2 py-0.5 rounded-md text-[8px] font-bold tracking-tight border ${
                      isActive 
                      ? 'bg-white/10 text-white border-white/20' 
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700'
                  }`}>
                      {uc}
                  </span>
              ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex gap-2 pt-3 border-t border-black/5 dark:border-white/5 w-full relative z-10">
            <button 
                onClick={(e) => { e.stopPropagation(); onInfo(); }}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
                <BookOpen size={11} /> Specs
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); onActivate(); }}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
                    isActive 
                    ? 'bg-white text-blue-600 hover:shadow-white/20' 
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                }`}
            >
                <Zap size={11} /> {isActive ? 'In Use' : 'Inject'}
            </button>
        </div>
    </button>
);

const FrameworksView: React.FC = () => {
  const { activeFrameworks, toggleFramework, setHistory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [selectedDetail, setSelectedDetail] = useState<Framework | null>(null);

  const categories = useMemo(() => 
    ['All', ...Array.from(new Set(FRAMEWORKS.map(f => f.category))).sort()]
  , []);

  const filtered = useMemo(() => 
    FRAMEWORKS.filter(fw => {
      const matchesSearch = fw.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            fw.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || fw.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  , [searchTerm, filterCategory]);

  const handleToggle = (fw: Framework) => {
      toggleFramework(fw.id);
      const isActivating = !activeFrameworks.some(f => f.id === fw.id);
      if (isActivating) {
        setHistory(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'model',
            text: `### Strategy Injected: ${fw.name}\nLogic protocol established. System now adhering to **${fw.category}** standards.`,
            timestamp: Date.now()
        }]);
      }
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar flex flex-col">
      <div className="flex-shrink-0 mb-6 flex items-center justify-between">
        <div className="flex flex-col">
            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">Strategic Vault</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Logic Modules</span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <Layers size={12} className="text-blue-500" />
            <span className="text-xs font-black text-slate-700 dark:text-slate-300">{filtered.length} <span className="text-[10px] text-slate-400 font-medium">MODS</span></span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6 bg-white/50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
                type="text" placeholder="Filter blueprint data..." 
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 text-xs transition-all outline-none font-medium"
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="flex gap-2">
            <select 
                className="flex-1 sm:w-32 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold outline-none cursor-pointer focus:ring-2 focus:ring-blue-500/20"
                value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
            >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-20">
        {filtered.map((fw) => (
            <FrameworkCard 
                key={fw.id} 
                fw={fw} 
                isActive={activeFrameworks.some(f => f.id === fw.id)}
                onActivate={() => handleToggle(fw)}
                onInfo={() => setSelectedDetail(fw)}
            />
        ))}
      </div>

      {selectedDetail && (
        <DetailModal 
            isOpen={!!selectedDetail} onClose={() => setSelectedDetail(null)}
            type="Framework"
            title={selectedDetail.name} category={selectedDetail.category}
            description={selectedDetail.description} content={selectedDetail.content}
            tags={selectedDetail.tags}
            keypoints={selectedDetail.keypoints}
            usecases={selectedDetail.usecases}
            metadata={[
                { label: 'Intensity', value: selectedDetail.complexity },
                { label: 'Category', value: selectedDetail.category },
                { label: 'Logic Nodes', value: selectedDetail.keypoints?.length || 0 },
                { label: 'Apps', value: selectedDetail.usecases?.length || 0 }
            ]}
            onTest={() => handleToggle(selectedDetail)}
            isActive={activeFrameworks.some(f => f.id === selectedDetail.id)}
        />
      )}
    </div>
  );
};

export default FrameworksView;