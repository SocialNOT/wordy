
import React, { useEffect, useRef, useState } from 'react';
import { X, Mic, MicOff, VideoOff, Activity } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveInterfaceProps {
    onClose: () => void;
}

const LiveInterface: React.FC<LiveInterfaceProps> = ({ onClose }) => {
    const [connected, setConnected] = useState(false);
    const [muted, setMuted] = useState(false);
    const [volume, setVolume] = useState(0);
    const [status, setStatus] = useState('Initializing...');

    const audioContextRef = useRef<AudioContext | null>(null);
    const inputContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sessionRef = useRef<any>(null);

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    useEffect(() => {
        let nextStartTime = 0;
        const sources = new Set<AudioBufferSourceNode>();
        
        const startSession = async () => {
            // Fix: Use process.env.API_KEY directly as required
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;

                const sessionPromise = ai.live.connect({
                    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: {
                            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                        },
                        systemInstruction: 'You are World of TEXTS Live. You are in a real-time voice conversation. Be concise, sharp, and helpful.'
                    },
                    callbacks: {
                        onopen: () => {
                            setConnected(true);
                            setStatus('Connected');
                            
                            const source = inputContextRef.current!.createMediaStreamSource(stream);
                            const scriptProcessor = inputContextRef.current!.createScriptProcessor(4096, 1, 1);
                            processorRef.current = scriptProcessor;

                            scriptProcessor.onaudioprocess = (e) => {
                                if (muted) return;
                                const inputData = e.inputBuffer.getChannelData(0);
                                
                                // Volume metering
                                let sum = 0;
                                for(let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                                setVolume(Math.sqrt(sum / inputData.length) * 100);

                                const int16 = new Int16Array(inputData.length);
                                for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                                
                                const pcmBlob = {
                                    data: encode(new Uint8Array(int16.buffer)),
                                    mimeType: 'audio/pcm;rate=16000'
                                };

                                // CRITICAL: Use sessionPromise to prevent stale closures and ensure session is ready
                                sessionPromise.then(sess => {
                                    sess.sendRealtimeInput({ media: pcmBlob });
                                });
                            };

                            source.connect(scriptProcessor);
                            scriptProcessor.connect(inputContextRef.current!.destination);
                        },
                        onmessage: async (msg: LiveServerMessage) => {
                            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                            if (audioData && audioContextRef.current) {
                                const ctx = audioContextRef.current;
                                nextStartTime = Math.max(nextStartTime, ctx.currentTime);
                                
                                const data = decode(audioData);
                                const dataInt16 = new Int16Array(data.buffer);
                                const frameCount = dataInt16.length;
                                const buffer = ctx.createBuffer(1, frameCount, 24000);
                                const channelData = buffer.getChannelData(0);
                                for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;

                                const source = ctx.createBufferSource();
                                source.buffer = buffer;
                                source.connect(ctx.destination);
                                source.addEventListener('ended', () => sources.delete(source));
                                source.start(nextStartTime);
                                nextStartTime += buffer.duration;
                                sources.add(source);
                            }

                            if (msg.serverContent?.interrupted) {
                                sources.forEach(s => { try { s.stop(); } catch(e){} });
                                sources.clear();
                                nextStartTime = 0;
                            }
                        },
                        onclose: () => {
                            setConnected(false);
                            onClose();
                        },
                        onerror: (err) => {
                            console.error("Live Error:", err);
                            setStatus('Connection Error');
                        }
                    }
                });

                sessionRef.current = await sessionPromise;
            } catch (err) {
                console.error("Init Error:", err);
                setStatus('Mic Access Denied');
            }
        };

        startSession();

        return () => {
            if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
            if (processorRef.current) processorRef.current.disconnect();
            if (inputContextRef.current) inputContextRef.current.close();
            if (audioContextRef.current) audioContextRef.current.close();
            if (sessionRef.current) sessionRef.current.close();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center text-white animate-in fade-in duration-500">
            <div className="absolute top-6 right-6">
                <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-48 h-48 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 bg-blue-500/10 transition-all duration-75" style={{ height: `${volume * 2}%` }} />
                        {connected ? <Activity size={48} className="text-blue-500 animate-pulse" /> : <div className="w-4 h-4 bg-yellow-500 rounded-full animate-ping" />}
                    </div>
                    
                    <h2 className="mt-8 text-xl font-bold font-mono tracking-widest text-blue-400">
                        {status.toUpperCase()}
                    </h2>
                    <p className="text-slate-500 mt-2 text-xs font-mono">Gemini 2.5 Native Audio Engine</p>
                </div>
            </div>

            <div className="h-32 flex items-center gap-6 pb-12">
                 <button className="p-5 bg-slate-900 text-slate-500 rounded-full border border-slate-800 cursor-not-allowed">
                    <VideoOff size={24} />
                 </button>
                 <button 
                    onClick={() => setMuted(!muted)}
                    className={`p-6 rounded-full transition-all border-4 ${muted ? 'bg-red-600 border-red-500' : 'bg-white text-black border-white hover:scale-105'}`}
                 >
                    {muted ? <MicOff size={24} /> : <Mic size={24} />}
                 </button>
            </div>
        </div>
    );
};

export default LiveInterface;
