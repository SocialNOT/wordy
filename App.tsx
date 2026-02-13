import React, { useState, ReactNode, ErrorInfo, Component } from 'react';
import Sidebar from './components/Sidebar';
import Console from './components/Console';
import FrameworksView from './components/FrameworksView';
import PersonasView from './components/PersonasView';
import LinguisticsView from './components/LinguisticsView';
import CompassView from './components/CompassView';
import TrainingView from './components/TrainingView';
import SettingsView from './components/SettingsView';
import RoadmapView from './components/RoadmapView';
import { View } from './types';
import { StoreProvider, useStore } from './contexts/StoreContext';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

// GLOBAL ERROR BOUNDARY
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL APP ERROR:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-8">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertTriangle size={32} />
                    <h1 className="text-2xl font-bold">System Critical Failure</h1>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    The Cognitive OS encountered an unrecoverable error.
                </p>
                
                <div className="bg-slate-100 dark:bg-black/50 p-4 rounded-lg overflow-x-auto mb-6 border border-slate-200 dark:border-slate-800">
                    <p className="font-mono text-red-500 text-sm font-bold mb-2">{this.state.error?.toString()}</p>
                    <pre className="font-mono text-xs text-slate-500 whitespace-pre-wrap">
                        {this.state.errorInfo?.componentStack}
                    </pre>
                </div>

                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20"
                >
                    Hard Reset & Reload
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const { compass, updateCompass, layoutMode } = useStore();
  const [currentView, setCurrentView] = useState<View>('console');

  const closePanel = () => setCurrentView('console');

  const renderContent = (view: View) => {
    switch (view) {
      case 'frameworks': return <FrameworksView />;
      case 'personas': return <PersonasView />;
      case 'linguistic': return <LinguisticsView />;
      case 'training': return <TrainingView />;
      case 'roadmap': return <RoadmapView />;
      case 'compass': return <CompassView settings={compass} updateSetting={updateCompass} />;
      case 'settings': return <SettingsView />;
      default: return null;
    }
  };

  if (layoutMode === 'zen') {
      return (
          <div className="flex h-screen w-full relative overflow-hidden text-slate-900 dark:text-slate-100 bg-white dark:bg-black">
              <main className="flex-1 h-full relative">
                  <Console />
              </main>
          </div>
      );
  }

  if (layoutMode === 'operator') {
    return (
      <div className="flex h-screen w-full relative overflow-hidden text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 bg-dot-pattern">
         <div className="flex-1 relative h-full flex flex-col">
            <div className="flex-1 relative overflow-hidden">
               <Console />
            </div>
            {currentView !== 'console' && (
              <div className="absolute inset-0 z-40 bg-white dark:bg-slate-950 animate-in slide-in-from-bottom-10 duration-200">
                 <div className="h-full relative flex flex-col">
                    <div className="h-12 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-800 dark:text-white">{currentView} Explorer</h3>
                        <button onClick={closePanel} className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-red-500 transition-colors">
                           <X size={14} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-hidden relative pb-16">
                       {renderContent(currentView)}
                    </div>
                 </div>
              </div>
            )}
         </div>
         <Sidebar currentView={currentView} setView={setCurrentView} />
      </div>
    );
  }

  // COMMANDER MODE (Desktop - Sticky Layout)
  const isLeftPanelOpen = currentView !== 'console' && currentView !== 'compass';
  const isRightPanelOpen = currentView === 'compass';

  return (
    <div className="flex h-screen w-full relative overflow-hidden text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 bg-dot-pattern">
      
      <Sidebar currentView={currentView} setView={setCurrentView} />

      {isLeftPanelOpen && (
        <div className="w-[300px] border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm h-full relative shadow-xl z-10 transition-all duration-300 animate-in slide-in-from-left-5 flex flex-col">
           <div className="absolute top-2 right-2 z-20">
               <button onClick={closePanel} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><X size={14}/></button>
           </div>
           {renderContent(currentView)}
        </div>
      )}

      <main className="flex-1 h-full relative min-w-[320px] flex flex-col">
        <Console />
      </main>

      {isRightPanelOpen && (
        <div className="w-[300px] border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm h-full relative shadow-xl z-10 transition-all duration-300 animate-in slide-in-from-right-5 flex flex-col">
           <div className="absolute top-2 right-2 z-20">
               <button onClick={closePanel} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><X size={14}/></button>
           </div>
           {renderContent('compass')}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
        <StoreProvider>
            <AppContent />
        </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;