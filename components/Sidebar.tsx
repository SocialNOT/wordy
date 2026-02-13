import React from 'react';
import { Terminal, Layers, User, Compass, GraduationCap, Settings, SpellCheck, Maximize, Map } from 'lucide-react';
import { View } from '../types';
import { useStore } from '../contexts/StoreContext';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const { layoutMode, setLayoutMode } = useStore();

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'console', label: 'Console', icon: <Terminal size={18} /> },
    { id: 'frameworks', label: 'Vault', icon: <Layers size={18} /> },
    { id: 'personas', label: 'Personas', icon: <User size={18} /> },
    { id: 'linguistic', label: 'Syntax', icon: <SpellCheck size={18} /> },
    { id: 'training', label: 'Academy', icon: <GraduationCap size={18} /> },
    { id: 'roadmap', label: 'Roadmap', icon: <Map size={18} /> },
  ];

  const handleCompassClick = () => {
    setView(currentView === 'compass' ? 'console' : 'compass');
  };

  // MOBILE: Floating Bottom Dock - Enhanced with labels for active state
  if (layoutMode === 'operator') {
    return (
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-[420px] z-[80]">
        <div className="glass-panel rounded-2xl p-1.5 flex justify-between items-center shadow-2xl backdrop-blur-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800/50 ring-1 ring-black/5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all duration-300 min-w-0 ${
                currentView === item.id 
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30' 
                : 'text-slate-400'
              }`}
            >
              <div className={`${currentView === item.id ? '-translate-y-1 scale-90' : ''} transition-all duration-300`}>
                {item.icon}
              </div>
              {currentView === item.id && (
                <span className="absolute bottom-1 text-[8px] font-black uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-1 duration-300 truncate w-full text-center px-1">
                  {item.label}
                </span>
              )}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5 shrink-0" />
          <button
             onClick={handleCompassClick}
             className={`relative flex flex-col items-center justify-center flex-1 h-12 rounded-xl transition-all duration-300 min-w-0 ${
                currentView === 'compass' ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/30' : 'text-slate-400'
              }`}
          >
              <div className={`${currentView === 'compass' ? '-translate-y-1 scale-90' : ''} transition-all duration-300`}>
                <Compass size={18} />
              </div>
              {currentView === 'compass' && (
                <span className="absolute bottom-1 text-[8px] font-black uppercase tracking-tighter animate-in fade-in slide-in-from-bottom-1 duration-300">
                  Comp
                </span>
              )}
          </button>
        </div>
      </div>
    );
  }

  // DESKTOP: Sticky Rail
  return (
    <div className="h-full flex flex-col w-16 border-r border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-[60] items-center py-4 flex-shrink-0 relative transition-all duration-300">
      <div className="mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            W
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col w-full px-2 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id === currentView && item.id !== 'console' ? 'console' : item.id)}
            className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-300 ${
              currentView === item.id
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 ring-1 ring-blue-400'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <div className={`${currentView === item.id ? '-translate-y-1' : ''} transition-transform duration-300`}>
                {item.icon}
            </div>
            
            {currentView === item.id && (
                <span className="absolute bottom-1.5 text-[7px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">
                    {item.label}
                </span>
            )}

            {/* Hover Tooltip */}
            <span className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl z-50 border border-white/10 dark:border-slate-200">
                {item.label}
            </span>
          </button>
        ))}

        <div className="w-full py-1">
            <div className="h-px w-full bg-slate-200 dark:bg-slate-800 mx-auto max-w-[20px]" />
        </div>

        <button
          onClick={handleCompassClick}
          className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-xl transition-all duration-300 ${
              currentView === 'compass'
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500'
            }`}
        >
          <div className={`${currentView === 'compass' ? '-translate-y-1' : ''} transition-transform duration-300`}>
            <Compass size={18} />
          </div>
          {currentView === 'compass' && (
            <span className="absolute bottom-1.5 text-[7px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-bottom-1">
                COMP
            </span>
          )}
          <span className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl z-50 border border-white/10 dark:border-slate-200">
             Technical Compass
          </span>
        </button>
      </nav>

      <div className="flex flex-col gap-2 w-full px-2 mt-auto">
        <button
          onClick={() => setLayoutMode(layoutMode === 'zen' ? 'commander' : 'zen')}
          className="group relative flex items-center justify-center w-full aspect-square rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-500 transition-all"
        >
          <Maximize size={18} />
          <span className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl z-50">
             Toggle Zen
          </span>
        </button>
        <button
          onClick={() => setView('settings')}
          className={`group relative flex items-center justify-center w-full aspect-square rounded-xl transition-all duration-300 ${
             currentView === 'settings' 
             ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
             : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings size={18} />
          <span className="absolute left-full ml-3 px-2 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[9px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-2xl z-50">
             System Settings
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;