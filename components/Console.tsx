
import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { Send, Cpu, Activity, X, Zap, Trash2, Minimize2, Database, Command, ChevronRight, Mic, Volume2, Globe, Brain, Headphones, ArrowUp, Copy, RefreshCw, Share2, Info, Check, User, AlertCircle, Sliders, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message, ModelMode, SlashCommand, CompassSettings } from '../types';
import { sendMessageToGemini, transcribeAudio, generateSpeech } from '../services/geminiService';
import { useStore } from '../contexts/StoreContext';
import { PromptEngine } from '../utils/promptEngine';
import { RagEngine } from '../utils/ragEngine';
import { PERSONAS } from '../data/personas';
import { FRAMEWORKS } from '../data/frameworks';
import LiveInterface from './LiveInterface';
import WelcomeScreen from './WelcomeScreen';

// Subcomponent for the Chat Bubble
const ChatBubble: React.FC<{ 
    msg: Message, 
    onRegenerate: (text: string) => void, 
    onTTS: (text: string, id: string) => void, 
    isPlaying: boolean,
    onDelete: (id: string) => void 
}> = ({ msg, onRegenerate, onTTS, isPlaying, onDelete }) => {
    const [copied, setCopied] = useState(false);
    const [viewSource, setViewSource] = useState<number | null>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(msg.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isUser = msg.role === 'user';
    const hasGrounding = msg.groundingMetadata?.groundingChunks;

    // Logic to highlight text influenced by grounding
    const renderContent = () => {
        if (isUser) return <div className="whitespace-pre-wrap font-medium">{msg.text}</div>;
        
        // Basic highlighting of sentences if they appear to have supporting links
        // In a real app, we'd use msg.groundingMetadata.groundingSupports for precise offsets
        return (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1.5 prose-headings:my-2 prose-pre:bg-slate-50 dark:prose-pre:bg-slate-950 prose-pre:p-2 prose-pre:rounded-xl">
                <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
        );
    };

    return (
        <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-1 duration-200 group relative`}>
            <div className={`flex flex-col max-w-[98%] sm:max-w-[90%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                
                {!isUser && (
                    <div className="flex items-center gap-1.5 mb-1 pl-1 select-none">
                        <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
                            <Cpu size={10} className="text-white" />
                        </div>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                            {msg.model || 'CORE'}
                        </span>
                        {hasGrounding && (
                             <span className="text-[8px] font-bold text-emerald-500 uppercase flex items-center gap-0.5 ml-2 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded-full">
                                <Globe size={8} /> Grounded
                             </span>
                        )}
                    </div>
                )}

                <div
                    className={`px-3 py-2.5 rounded-2xl text-[13px] sm:text-sm leading-relaxed shadow-sm transition-all relative ${
                    isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                    }`}
                >
                    {renderContent()}

                    {hasGrounding && (
                        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Research Sources</span>
                                <Info size={10} className="text-slate-300" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => (
                                    chunk.web?.uri && (
                                        <div key={i} className="relative">
                                            <button 
                                                onClick={() => setViewSource(viewSource === i ? null : i)}
                                                className={`text-[9px] font-bold px-2 py-1 rounded-lg border transition-all flex items-center gap-1.5 max-w-[140px] truncate ${
                                                    viewSource === i 
                                                    ? 'bg-blue-600 text-white border-blue-500' 
                                                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-500'
                                                }`}
                                            >
                                                {chunk.web.title || "Source"} <ChevronRight size={10} className={viewSource === i ? 'rotate-90' : ''} />
                                            </button>
                                            {viewSource === i && (
                                                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Grounding Metadata</h4>
                                                        <a href={chunk.web.uri} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500"><ExternalLink size={12}/></a>
                                                    </div>
                                                    <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium line-clamp-3 mb-2">{chunk.web.title}</p>
                                                    <div className="text-[9px] font-mono text-blue-500 truncate mb-2">{chunk.web.uri}</div>
                                                    <button onClick={() => window.open(chunk.web.uri, '_blank')} className="w-full py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Open Full Context</button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 mt-1.5 pl-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button onClick={handleCopy} title="Copy" className="p-1.5 hover:text-blue-500 rounded-lg text-slate-400 bg-slate-50 dark:bg-slate-800 sm:bg-transparent">{copied ? <Check size={12}/> : <Copy size={12}/>}</button>
                    {!isUser && (
                        <>
                            <button onClick={() => onRegenerate(msg.text)} title="Regenerate" className="p-1.5 hover:text-blue-500 rounded-lg text-slate-400 bg-slate-50 dark:bg-slate-800 sm:bg-transparent"><RefreshCw size={12}/></button>
                            <button onClick={() => onTTS(msg.text, msg.id)} title="Play Audio" className={`p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 sm:bg-transparent ${isPlaying ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`}><Volume2 size={12}/></button>
                        </>
                    )}
                    <button onClick={() => onDelete(msg.id)} title="Delete Message" className="p-1.5 hover:text-red-500 rounded-lg text-slate-400 bg-slate-50 dark:bg-slate-800 sm:bg-transparent"><Trash2 size={12}/></button>
                </div>
            </div>
        </div>
    );
};

const ConfirmationDialog: React.FC<{ isOpen: boolean, onConfirm: () => void, onCancel: () => void, title: string, desc: string }> = ({ isOpen, onConfirm, onCancel, title, desc }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 text-red-600 mb-4">
                    <AlertCircle size={24} />
                    <h3 className="text-lg font-black tracking-tight">{title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 font-medium leading-relaxed">{desc}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20">Purge Data</button>
                </div>
            </div>
        </div>
    );
};

const Console: React.FC = () => {
  const { 
    history, setHistory, deleteMessage, clearHistory,
    activeFrameworks, activePersona, activeLinguistics, toggleFramework, setPersona, toggleLinguistic,
    compass, updateCompass, clearAllActive, layoutMode, setLayoutMode, modelMode, setModelMode
  } = useStore();
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [contextChunks, setContextChunks] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showModeSettings, setShowModeSettings] = useState(false);
  
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isZen = layoutMode === 'zen';
  const isMobile = layoutMode === 'operator';

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
        const { scrollHeight, clientHeight } = chatContainerRef.current;
        chatContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: loading ? 'auto' : 'smooth' });
    }
  }, [history, loading]);

  const handleMicClick = async () => {
    if (recording) {
        if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                     const base64String = (reader.result as string).split(',')[1];
                     setLoading(true);
                     try {
                        const transcript = await transcribeAudio(base64String);
                        setInput(prev => prev + (prev ? ' ' : '') + transcript);
                     } catch (e) { console.error(e); } finally { setLoading(false); if(inputRef.current) inputRef.current.focus(); }
                };
                stream.getTracks().forEach(track => track.stop());
            };
            mediaRecorder.start();
            setRecording(true);
        } catch (err) { alert("Mic denied."); }
    }
  };
  
  useEffect(() => { if (mediaRecorderRef.current) mediaRecorderRef.current.onstop = () => setRecording(false); }, [recording]);

  const handleTTS = async (text: string, msgId: string) => {
    if (playingAudio === msgId) return;
    try {
        setPlayingAudio(msgId);
        const audioBase64 = await generateSpeech(text);
        if (!audioBase64) return;
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const binaryString = atob(audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const dataInt16 = new Int16Array(bytes.buffer);
        const buffer = audioCtx.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.start(0);
        source.onended = () => setPlayingAudio(null);
    } catch (e) { setPlayingAudio(null); }
  };

  const filteredCommands = useMemo(() => {
    const cmds: SlashCommand[] = [
        { id: 'cmd-reset', label: '/reset', desc: 'Wipe History', type: 'system', action: () => setShowConfirmation(true) },
        { id: 'cmd-zen', label: '/zen', desc: 'Focus Mode', type: 'system', action: () => setLayoutMode('zen') }
    ];
    PERSONAS.forEach(p => cmds.push({ id: `p-${p.id}`, label: `/${p.id}`, desc: p.name, type: 'persona', action: () => setPersona(p.id) }));
    FRAMEWORKS.forEach(f => cmds.push({ id: `f-${f.id}`, label: `/${f.id}`, desc: f.name, type: 'framework', action: () => toggleFramework(f.id) }));
    return cmds.filter(c => c.label.toLowerCase().includes(commandFilter.toLowerCase()));
  }, [commandFilter, setPersona, toggleFramework, setLayoutMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    if (val.startsWith('/')) {
        setShowCommands(true);
        setCommandFilter(val);
        setSelectedCommandIndex(0);
    } else { setShowCommands(false); }
  };

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input.trim();
    if (!text || loading) return;
    if (text.startsWith('/') && filteredCommands.length > 0 && filteredCommands[0].label === text) {
        filteredCommands[0].action(); setInput(''); setShowCommands(false); return;
    }
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text, timestamp: Date.now() };
    setHistory(prev => [...prev, userMsg]);
    setInput(''); setLoading(true); setShowCommands(false);
    try {
      const retrievedChunks = RagEngine.search(text);
      setContextChunks(retrievedChunks);
      const sys = PromptEngine.constructSystemPrompt({
        basePrompt: "You are the WO TEXTS Cognitive OS. Provide dense, high-fidelity responses.",
        activePersona, activeFrameworks, activeLinguistics, contextChunks: retrievedChunks
      });
      const res = await sendMessageToGemini(text, sys, compass, [...history, userMsg], modelMode);
      setHistory(prev => [...prev, { 
          id: crypto.randomUUID(), role: 'model', text: res.text, 
          groundingMetadata: res.groundingMetadata, timestamp: Date.now(), 
          config: { ...compass }, model: modelMode 
      }]);
    } catch (error: any) {
      setHistory(prev => [...prev, { id: crypto.randomUUID(), role: 'model', text: `Error: ${error.message}`, timestamp: Date.now() }]);
    } finally { setLoading(false); if(inputRef.current) inputRef.current.focus(); }
  };

  const ModelSelector = () => (
      <div className="flex flex-col gap-2 relative">
          <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              {[{ id: 'fast', icon: Zap, label: 'Turbo' }, { id: 'balanced', icon: Cpu, label: 'Standard' }, { id: 'thinking', icon: Brain, label: 'Reason' }, { id: 'research', icon: Globe, label: 'Research' }].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                        setModelMode(m.id as ModelMode);
                        setShowModeSettings(true);
                    }}
                    title={m.label}
                    className={`p-1 px-2 rounded flex items-center gap-1.5 transition-all ${modelMode === m.id ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <m.icon size={12} />
                      <span className="text-[9px] font-black uppercase hidden sm:inline">{m.label}</span>
                  </button>
              ))}
              <button 
                onClick={() => setShowModeSettings(!showModeSettings)}
                className={`p-1 px-2 rounded flex items-center transition-all ${showModeSettings ? 'text-blue-500 bg-white dark:bg-slate-700' : 'text-slate-400'}`}
              >
                <Sliders size={12} />
              </button>
          </div>

          {showModeSettings && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-[60] animate-in slide-in-from-top-1">
                  <div className="flex justify-between items-center mb-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Parameter Injection</h4>
                      <button onClick={() => setShowModeSettings(false)}><X size={12}/></button>
                  </div>
                  <div className="space-y-4">
                      {/* Temp Slider */}
                      <div>
                          <div className="flex justify-between mb-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Entropy (Temp)</span>
                              <span className="text-[10px] font-mono font-bold text-blue-500">{compass.temp}</span>
                          </div>
                          <input type="range" min="0" max="2" step="0.1" value={compass.temp} onChange={e => updateCompass('temp', parseFloat(e.target.value))} className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none accent-blue-500" />
                      </div>
                      {/* TopP Slider */}
                      <div>
                          <div className="flex justify-between mb-1.5">
                              <span className="text-[9px] font-bold text-slate-500 uppercase">Diversity (Top P)</span>
                              <span className="text-[10px] font-mono font-bold text-blue-500">{compass.topp}</span>
                          </div>
                          <input type="range" min="0" max="1" step="0.05" value={compass.topp} onChange={e => updateCompass('topp', parseFloat(e.target.value))} className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none accent-blue-500" />
                      </div>
                      {/* Penalty Sliders */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Frequency</span>
                            <input type="range" min="0" max="2" step="0.1" value={compass.freq} onChange={e => updateCompass('freq', parseFloat(e.target.value))} className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none accent-indigo-500" />
                        </div>
                        <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase block mb-1">Presence</span>
                            <input type="range" min="0" max="2" step="0.1" value={compass.pres} onChange={e => updateCompass('pres', parseFloat(e.target.value))} className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none accent-indigo-500" />
                        </div>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  return (
    <div className={`flex flex-col h-full bg-dot-pattern relative transition-all duration-300 ${isZen ? 'max-w-2xl mx-auto border-x dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm' : ''}`}>
      
      {!isZen && (
      <div className="h-14 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
            <h2 className="font-black text-[10px] text-slate-800 dark:text-white tracking-widest uppercase">Console</h2>
            <ModelSelector />
            {contextChunks.length > 0 && <span className="hidden lg:inline-block text-[8px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-black border border-green-200 dark:border-green-800">RAG INJECTED</span>}
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => setLiveMode(true)} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-red-500/20 active:scale-95 transition-all"><Headphones size={14} /> LIVE</button>
           <button onClick={() => setShowConfirmation(true)} className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"><Trash2 size={16} /></button>
        </div>
      </div>
      )}

      {/* Chips Bar */}
      {!isZen && (activePersona || activeFrameworks.length > 0 || activeLinguistics.length > 0) && (
        <div className="px-4 py-1.5 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60 flex flex-wrap gap-1.5 backdrop-blur-sm z-30">
           {activePersona && <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1"><User size={10}/> {activePersona.name}</span>}
           {activeFrameworks.map(fw => <span key={fw.id} className="text-[9px] font-black px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"><Database size={10}/> {fw.name}</span>)}
        </div>
      )}

      <div ref={chatContainerRef} className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar ${isZen ? 'pt-16' : ''}`}>
        {history.length <= 1 ? <WelcomeScreen onQuickStart={handleSend} /> : history.slice(1).map((msg, idx) => (
            <ChatBubble 
                key={msg.id} 
                msg={msg} 
                onRegenerate={handleSend} 
                onTTS={handleTTS} 
                isPlaying={playingAudio === msg.id}
                onDelete={deleteMessage}
            />
        ))}
        {loading && (
          <div className="flex justify-start w-full animate-pulse pl-1">
             <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded-2xl flex items-center gap-2.5 border border-slate-200 dark:border-slate-800">
               <Activity size={14} className="text-blue-500 animate-spin" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesizing...</span>
            </div>
          </div>
        )}
      </div>

      <div className={`px-4 z-50 transition-all ${isZen ? 'fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl pb-0' : isMobile ? 'pb-20' : 'pb-4'} relative`}>
        {showCommands && (
            <div className={`absolute bottom-full left-4 mb-3 w-[calc(100%-2rem)] sm:w-80 glass-panel rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200 ring-1 ring-black/10`}>
                <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar bg-white dark:bg-slate-900">
                    <div className="px-3 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 mb-1">Commands</div>
                    {filteredCommands.map((cmd, idx) => (
                        <button key={cmd.id} onClick={() => { cmd.action(); setInput(''); setShowCommands(false); }} className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${idx === selectedCommandIndex ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                            <div className="flex flex-col"><span className="font-bold font-mono">{cmd.label}</span><span className="text-[9px] opacity-70 tracking-tight">{cmd.desc}</span></div>
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className={`relative flex gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ${isZen ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl' : 'bg-white dark:bg-slate-900'} ${recording ? 'ring-2 ring-red-500/50' : ''}`}>
          <button 
            onClick={handleMicClick} 
            className={`p-2.5 rounded-xl transition-all ${recording ? 'bg-red-500 text-white animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500'}`}
          >
            <Mic size={18}/>
          </button>
          
          <input 
            ref={inputRef} 
            type="text" 
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400 font-semibold text-sm px-1" 
            placeholder={recording ? "Listening..." : "Query the OS /"} 
            value={input} 
            onChange={handleInputChange} 
            onKeyDown={(e) => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); handleSend(); } }} 
            autoComplete="off" 
          />
          
          <button 
            onClick={() => handleSend()} 
            disabled={loading || !input.trim()} 
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-30 disabled:grayscale transition-all shadow-lg shadow-blue-500/30 active:scale-90"
          >
            <ArrowUp size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
      
      {liveMode && <LiveInterface onClose={() => setLiveMode(false)} />}
      
      <ConfirmationDialog 
        isOpen={showConfirmation} 
        onCancel={() => setShowConfirmation(false)} 
        onConfirm={() => { clearHistory(); setShowConfirmation(false); }}
        title="Purge Consciousness?"
        desc="This will erase all active conversation logs from the neural matrix. This action is irreversible."
      />
    </div>
  );
};

export default Console;
