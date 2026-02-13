import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { CompassSettings } from '../types';
import { Sliders } from 'lucide-react';

interface CompassViewProps {
  settings: CompassSettings;
  updateSetting: (key: keyof CompassSettings, value: number) => void;
}

const CompassView: React.FC<CompassViewProps> = ({ settings, updateSetting }) => {
  const chartData = [
    { subject: 'Creativity', A: settings.temp, fullMark: 1 },
    { subject: 'Diversity', A: settings.topp, fullMark: 1 },
    { subject: 'Novelty', A: settings.freq / 2, fullMark: 1 },
    { subject: 'Shift', A: settings.pres / 2, fullMark: 1 },
  ];

  return (
    <div className="p-3 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 custom-scrollbar">
      <div className="max-w-xl mx-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Sliders size={14} />
            </div>
            <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Technical Compass</h2>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Fine-tune stochastic parameters.</p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4">
          <div className="h-40 w-full mb-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" strokeOpacity={0.5} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
                <Radar
                  name="Config"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold text-blue-500 pointer-events-none">
                NET
            </div>
          </div>

          <div className="space-y-4">
            <div className="group">
              <div className="flex justify-between mb-1.5">
                <label htmlFor="temp-range" className="font-bold text-slate-700 dark:text-slate-200 text-[10px] flex items-center gap-1.5">
                    Temperature <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-400 font-normal">Randomness</span>
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-bold">{settings.temp}</span>
              </div>
              <input
                id="temp-range"
                name="temp-range"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.temp}
                onChange={(e) => updateSetting('temp', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
              />
            </div>

            <div className="group">
               <div className="flex justify-between mb-1.5">
                <label htmlFor="topp-range" className="font-bold text-slate-700 dark:text-slate-200 text-[10px] flex items-center gap-1.5">
                    Top P <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-400 font-normal">Diversity</span>
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-bold">{settings.topp}</span>
              </div>
              <input
                id="topp-range"
                name="topp-range"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.topp}
                onChange={(e) => updateSetting('topp', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
              />
            </div>

             <div className="group">
               <div className="flex justify-between mb-1.5">
                <label htmlFor="freq-range" className="font-bold text-slate-700 dark:text-slate-200 text-[10px] flex items-center gap-1.5">
                    Frequency Penalty <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-400 font-normal">Repetition</span>
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-bold">{settings.freq}</span>
              </div>
              <input
                id="freq-range"
                name="freq-range"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.freq}
                onChange={(e) => updateSetting('freq', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
              />
            </div>

             <div className="group">
               <div className="flex justify-between mb-1.5">
                <label htmlFor="pres-range" className="font-bold text-slate-700 dark:text-slate-200 text-[10px] flex items-center gap-1.5">
                    Presence Penalty <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[8px] text-slate-400 font-normal">Topic Shift</span>
                </label>
                <span className="font-mono text-blue-600 dark:text-blue-400 text-[10px] font-bold">{settings.pres}</span>
              </div>
              <input
                id="pres-range"
                name="pres-range"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={settings.pres}
                onChange={(e) => updateSetting('pres', parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompassView;