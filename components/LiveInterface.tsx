import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from '@google/genai';
import { X, Mic, MicOff, ChevronRight } from 'lucide-react';
import LiveAudioVisualizer from './LiveAudioVisualizer';
import { getFilteredProperties } from '../services/propertyService';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface LiveInterfaceProps {
  onClose: () => void;
  onMessage: (role: 'user' | 'assistant', text: string, properties?: Property[]) => void;
  onToggleFavorite: (property: Property) => void;
  favorites: Property[];
}

interface TranscriptItem {
  role: 'user' | 'model';
  text: string;
}

// Audio processing helpers
function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const searchPropertiesTool: FunctionDeclaration = {
  name: 'searchProperties',
  description: 'Search for rental properties based on filters like location, price, bedrooms, and amenities.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: { type: Type.STRING, description: "City or neighborhood" },
      minPrice: { type: Type.NUMBER },
      maxPrice: { type: Type.NUMBER },
      minBedrooms: { type: Type.NUMBER },
      amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
      propertyType: { type: Type.STRING }
    }
  }
};

const LiveInterface: React.FC<LiveInterfaceProps> = ({ onClose, onMessage, onToggleFavorite, favorites }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [status, setStatus] = useState("Connecting...");
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Audio Contexts
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  
  // Live API Session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Refs for mutable state in closures
  const isMutedRef = useRef(false);

  // Current Turn Transcription Accumulators
  const currentInputTransRef = useRef("");
  const currentOutputTransRef = useRef("");
  
  // Store properties found in a tool call to attach to the subsequent model message
  const pendingPropertiesRef = useRef<Property[]>([]);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Sync mute state to ref and toggle tracks
  useEffect(() => {
    isMutedRef.current = isMuted;
    if (userStream) {
      userStream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted, userStream]);

  useEffect(() => {
    const startSession = async () => {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        setStatus("API Key missing");
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      try {
        // 1. Setup Audio Contexts
        inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        
        const outputNode = outputAudioContextRef.current.createGain();
        outputNode.connect(outputAudioContextRef.current.destination);

        // 2. Get User Media
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        setUserStream(stream);

        // 3. Connect to Live API
        sessionPromiseRef.current = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            // Explicitly instruct model to speak first
            systemInstruction: { parts: [{ text: "You are UnitPulse, an advanced rental AI. START THE CONVERSATION IMMEDIATELY. As soon as you connect, say 'Hello! I'm UnitPulse. What kind of home are you looking for today?' Do not wait for the user to speak. Talk to the user naturally. If they ask to find homes, call the searchProperties tool. Be warm, concise, and helpful." }] },
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            tools: [{ functionDeclarations: [searchPropertiesTool] }],
          },
          callbacks: {
            onopen: () => {
              setStatus("Listening...");
              setIsConnected(true);
              
              // Ensure audio context is active (often suspended by browser policy)
              if (outputAudioContextRef.current && outputAudioContextRef.current.state === 'suspended') {
                outputAudioContextRef.current.resume();
              }

              // Stream Input Audio
              const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
              const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
              
              scriptProcessor.onaudioprocess = (e) => {
                // Check the ref instead of state to get the latest value in this closure
                if (isMutedRef.current) return; 
                
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                
                if (sessionPromiseRef.current) {
                  sessionPromiseRef.current.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                  });
                }
              };
              
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContextRef.current!.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle Transcription
              if (message.serverContent?.inputTranscription) {
                currentInputTransRef.current += message.serverContent.inputTranscription.text;
              }
              if (message.serverContent?.outputTranscription) {
                currentOutputTransRef.current += message.serverContent.outputTranscription.text;
              }

              if (message.serverContent?.turnComplete) {
                if (currentInputTransRef.current.trim()) {
                  const text = currentInputTransRef.current;
                  setTranscripts(prev => [...prev, { role: 'user', text }]);
                  onMessage('user', text); 
                  currentInputTransRef.current = "";
                }
                if (currentOutputTransRef.current.trim()) {
                  const text = currentOutputTransRef.current;
                  setTranscripts(prev => [...prev, { role: 'model', text }]);
                  
                  const properties = pendingPropertiesRef.current.length > 0 ? [...pendingPropertiesRef.current] : undefined;
                  onMessage('assistant', text, properties);
                  
                  pendingPropertiesRef.current = []; 
                  currentOutputTransRef.current = "";
                }
              }

              // Handle Tool Call
              if (message.toolCall) {
                 for (const fc of message.toolCall.functionCalls) {
                    if (fc.name === 'searchProperties') {
                       const filters = fc.args as any;
                       const results = getFilteredProperties(filters);
                       setSearchResults(results);
                       pendingPropertiesRef.current = results; 
                       
                       sessionPromiseRef.current?.then(session => {
                         session.sendToolResponse({
                           functionResponses: [{
                             id: fc.id,
                             name: fc.name,
                             response: { result: { count: results.length, success: true } }
                           }]
                         })
                       });
                    }
                 }
              }

              // Handle Audio Output
              const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              
              if (base64Audio && outputAudioContextRef.current) {
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                
                const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  outputAudioContextRef.current,
                  24000,
                  1
                );
                
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputNode);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                });
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                sourcesRef.current.add(source);
              }

              if (message.serverContent?.interrupted) {
                 sourcesRef.current.forEach(source => {
                   source.stop();
                   sourcesRef.current.delete(source);
                 });
                 nextStartTimeRef.current = 0;
                 currentOutputTransRef.current = ""; 
              }
            },
            onclose: () => {
              setStatus("Disconnected");
              setIsConnected(false);
            },
            onerror: (e) => {
              console.error("Live API Error", e);
              setStatus("Error connecting");
            }
          }
        });

        sessionPromiseRef.current.catch((err) => {
          console.error("Session connection failed", err);
          setStatus("Connection Failed");
        });

      } catch (error) {
        console.error("Failed to start Live session", error);
        setStatus("Connection Failed");
      }
    };

    startSession();

    return () => {
      userStream?.getTracks().forEach(track => track.stop());
      inputAudioContextRef.current?.close();
      outputAudioContextRef.current?.close();
      sessionPromiseRef.current?.then(s => s.close());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden animate-fade-in">
       {/* Header */}
       <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-10">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Live Session</span>
          </div>
          <button 
            onClick={onClose}
            className="p-4 rounded-full bg-neutral-50 hover:bg-black text-black hover:text-white transition-all shadow-xl"
          >
            <X size={24} />
          </button>
       </div>

       {/* Main Visualizer Area */}
       <div className={`flex-1 flex flex-col items-center justify-center transition-all duration-700 ${searchResults.length > 0 ? 'pb-[400px]' : ''}`}>
          <div className="relative">
             <div className="w-[400px] h-[400px] flex items-center justify-center">
                <LiveAudioVisualizer stream={userStream} isActive={isConnected} />
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-2xl">
                      <span className="text-white font-heading font-bold text-3xl">U</span>
                   </div>
                   <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider animate-pulse">{status}</span>
                </div>
             </div>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`p-8 rounded-full transition-all transform hover:scale-110 shadow-2xl ${isMuted ? 'bg-neutral-100 text-neutral-400' : 'bg-black text-white'}`}
            >
              {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
            </button>
          </div>
          
          {/* Captions / Transcript Preview */}
          <div className="mt-12 w-full max-w-xl h-40 overflow-y-auto px-6 text-center space-y-4 scrollbar-hide" ref={transcriptContainerRef}>
             {transcripts.map((t, i) => (
                <p key={i} className={`text-lg font-medium leading-relaxed ${t.role === 'model' ? 'text-black' : 'text-neutral-300'}`}>
                   {t.text}
                </p>
             ))}
          </div>
       </div>

       {/* Results Tray */}
       <div className={`absolute bottom-0 left-0 right-0 bg-white border-t border-black/5 transition-transform duration-700 ease-in-out shadow-[0_-20px_60px_rgba(0,0,0,0.05)] ${searchResults.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="px-8 py-10">
             <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-8">Found {searchResults.length} Properties</h3>
             <div className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide snap-x">
                {searchResults.map((property) => (
                  <div key={property.id} className="min-w-[320px] snap-start">
                    <PropertyCard 
                      property={property} 
                      isFavorite={favorites.some(f => f.id === property.id)} 
                      onToggleFavorite={onToggleFavorite} 
                    />
                  </div>
                ))}
                {searchResults.length > 0 && (
                  <div className="min-w-[80px] flex items-center justify-center">
                      <button onClick={onClose} className="flex flex-col items-center text-black hover:scale-110 transition-all">
                          <div className="w-14 h-14 rounded-full bg-neutral-50 flex items-center justify-center mb-2 border border-black/5">
                             <ChevronRight size={24} />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider">View All</span>
                      </button>
                  </div>
                )}
             </div>
          </div>
       </div>
    </div>
  );
};

export default LiveInterface;