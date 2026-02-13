
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Framework, Persona, LinguisticControl, Message, CompassSettings, LayoutMode, ModelMode } from '../types';
import { FRAMEWORKS } from '../data/frameworks';
import { PERSONAS } from '../data/personas';
import { LINGUISTICS } from '../data/linguistics';

interface StoreContextType {
  // Chat State
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  deleteMessage: (id: string) => void;
  clearHistory: () => void;
  
  // Cognitive State
  activeFrameworks: Framework[];
  toggleFramework: (id: string) => void;
  activePersona: Persona | null;
  setPersona: (id: string | null) => void;
  activeLinguistics: LinguisticControl[];
  toggleLinguistic: (id: string) => void;
  
  // Compass State
  compass: CompassSettings;
  updateCompass: (key: keyof CompassSettings, value: number) => void;

  // Layout & Model State
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
  modelMode: ModelMode;
  setModelMode: (mode: ModelMode) => void;

  // Training & Gamification State
  completedModules: string[];
  completeModule: (id: string) => void;
  xp: number;
  level: string;
  nextLevelXp: number;

  // Utilities
  clearAllActive: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Initialization with Persistence ---
  
  const [history, setHistory] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('wot_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [{ 
      id: 'init-0', 
      role: 'model', 
      text: 'Cognitive OS Online. Initialize parameters.', 
      timestamp: Date.now() 
    }];
  });
  
  const [activeFrameworks, setActiveFrameworks] = useState<Framework[]>(() => {
    try {
      const saved = localStorage.getItem('wot_active_frameworks');
      if (saved) {
        const ids = JSON.parse(saved);
        return FRAMEWORKS.filter(f => ids.includes(f.id));
      }
    } catch (e) {}
    return [];
  });

  const [activePersona, setActivePersona] = useState<Persona | null>(() => {
    try {
      const saved = localStorage.getItem('wot_active_persona');
      if (saved) return PERSONAS.find(p => p.id === saved) || null;
    } catch (e) {}
    return null;
  });

  const [activeLinguistics, setActiveLinguistics] = useState<LinguisticControl[]>(() => {
    try {
      const saved = localStorage.getItem('wot_active_linguistics');
      if (saved) {
        const ids = JSON.parse(saved);
        return LINGUISTICS.filter(l => ids.includes(l.id));
      }
    } catch (e) {}
    return [];
  });
  
  const [compass, setCompass] = useState<CompassSettings>(() => {
    try {
      const saved = localStorage.getItem('wot_compass');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { temp: 0.7, topp: 0.9, freq: 0.0, pres: 0.0 };
  });

  const [layoutMode, setLayoutMode] = useState<LayoutMode>('commander');
  const [modelMode, setModelMode] = useState<ModelMode>('balanced');
  
  const [completedModules, setCompletedModules] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wot_completed_modules');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // --- Gamification Logic ---
  const xp = useMemo(() => completedModules.length * 150, [completedModules]);
  
  const { level, nextLevelXp } = useMemo(() => {
    if (xp >= 1200) return { level: 'Architect', nextLevelXp: 2000 };
    if (xp >= 600) return { level: 'Adept', nextLevelXp: 1200 };
    if (xp >= 300) return { level: 'Apprentice', nextLevelXp: 600 };
    return { level: 'Novice', nextLevelXp: 300 };
  }, [xp]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLayoutMode('operator');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- Persistence Effects ---
  useEffect(() => { localStorage.setItem('wot_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('wot_active_frameworks', JSON.stringify(activeFrameworks.map(f => f.id))); }, [activeFrameworks]);
  useEffect(() => { 
    if (activePersona) localStorage.setItem('wot_active_persona', activePersona.id);
    else localStorage.removeItem('wot_active_persona');
  }, [activePersona]);
  useEffect(() => { localStorage.setItem('wot_active_linguistics', JSON.stringify(activeLinguistics.map(l => l.id))); }, [activeLinguistics]);
  useEffect(() => { localStorage.setItem('wot_compass', JSON.stringify(compass)); }, [compass]);
  useEffect(() => { localStorage.setItem('wot_completed_modules', JSON.stringify(completedModules)); }, [completedModules]);

  // --- Actions ---
  const deleteMessage = useCallback((id: string) => {
    setHistory(prev => prev.filter(m => m.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([{ 
      id: 'init-' + Date.now(), 
      role: 'model', 
      text: 'Cognitive OS Online. Initialize parameters.', 
      timestamp: Date.now() 
    }]);
  }, []);

  const toggleFramework = useCallback((id: string) => {
    const fw = FRAMEWORKS.find(f => f.id === id);
    if (!fw) return;
    setActiveFrameworks(prev => 
      prev.some(f => f.id === id) ? prev.filter(f => f.id !== id) : [...prev, fw]
    );
  }, []);

  const setPersona = useCallback((id: string | null) => {
    if (!id) {
      setActivePersona(null);
      return;
    }
    const p = PERSONAS.find(p => p.id === id);
    if (p) {
      setActivePersona(p);
      if (p.default_temp !== undefined) {
        setCompass(prev => ({ ...prev, temp: p.default_temp! }));
      }
    }
  }, []);

  const toggleLinguistic = useCallback((id: string) => {
    const l = LINGUISTICS.find(x => x.id === id);
    if (!l) return;
    setActiveLinguistics(prev => 
      prev.some(x => x.id === id) ? prev.filter(x => x.id !== id) : [...prev, l]
    );
  }, []);

  const updateCompass = useCallback((key: keyof CompassSettings, value: number) => {
    setCompass(prev => ({ ...prev, [key]: value }));
  }, []);

  const completeModule = useCallback((id: string) => {
    setCompletedModules(prev => prev.includes(id) ? prev : [...prev, id]);
  }, []);

  const clearAllActive = useCallback(() => {
    setActiveFrameworks([]);
    setActivePersona(null);
    setActiveLinguistics([]);
    clearHistory();
  }, [clearHistory]);

  return (
    <StoreContext.Provider value={{
      history, setHistory, deleteMessage, clearHistory,
      activeFrameworks, toggleFramework,
      activePersona, setPersona,
      activeLinguistics, toggleLinguistic,
      compass, updateCompass,
      layoutMode, setLayoutMode,
      modelMode, setModelMode,
      completedModules, completeModule,
      xp, level, nextLevelXp,
      clearAllActive
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
