import React from 'react';
import { useStore } from '../contexts/StoreContext';
import { ShieldAlert, User, Zap, Star, Activity, Award, Crown } from 'lucide-react';
import { TRAINING_MODULES } from '../data/training';

const SettingsView: React.FC = () => {
  const { xp, level, nextLevelXp, completedModules, history } = useStore();

  const progressPercent = Math.min((xp / nextLevelXp) * 100, 100);
  const totalModules = TRAINING_MODULES.reduce((acc, phase) => acc + phase.modules.length, 0);

  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
           <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Profile</h2>
           <p className="text-xs text-slate-500 dark:text-slate-400">System preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4">
           <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                 {level.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white dark:border-slate-900 flex items-center gap-0.5">
                 <Crown size={10} /> {level}
              </div>
           </div>
           
           <div className="flex-1 w-full text-center md:text-left">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Operator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">ID: WOT-882-ALPHA</p>
              
              <div className="space-y-1.5">
                 <div className="flex justify-between text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    <span>XP: {xp}</span>
                    <span>Next Level: {nextLevelXp}</span>
                 </div>
                 <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${progressPercent}%` }} 
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
           <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
               <div className="text-blue-500 mb-1 flex justify-center"><Zap size={16} /></div>
               <div className="text-lg font-bold text-slate-900 dark:text-white">{completedModules.length}/{totalModules}</div>
               <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Modules</div>
           </div>
           <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
               <div className="text-green-500 mb-1 flex justify-center"><Activity size={16} /></div>
               <div className="text-lg font-bold text-slate-900 dark:text-white">{history.length}</div>
               <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Messages</div>
           </div>
           <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
               <div className="text-purple-500 mb-1 flex justify-center"><Star size={16} /></div>
               <div className="text-lg font-bold text-slate-900 dark:text-white">{xp}</div>
               <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Total XP</div>
           </div>
           <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
               <div className="text-yellow-500 mb-1 flex justify-center"><Award size={16} /></div>
               <div className="text-lg font-bold text-slate-900 dark:text-white">{Math.floor(xp / 1000)}</div>
               <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Badges</div>
           </div>
        </div>

        {/* Subscription / System Status */}
        <div className="grid md:grid-cols-2 gap-4">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="text-green-600" size={16} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Plan</h3>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
                     <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-green-800 dark:text-green-400">PRO</span>
                        <span className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-[9px] px-1.5 py-0.5 rounded-full font-bold">ACTIVE</span>
                     </div>
                     <p className="text-[10px] text-green-700 dark:text-green-300">
                        Gemini 2.0 Flash.<br/>
                        All Personas Unlocked.
                     </p>
                </div>
             </div>

             <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="text-slate-500" size={16} />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">API</h3>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                     <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="font-bold">Model:</span> Gemini 2.0<br/>
                        <span className="font-bold">Latency:</span> 45ms<br/>
                        <span className="font-bold">Status:</span> <span className="text-green-600">OK</span>
                     </p>
                </div>
             </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsView;