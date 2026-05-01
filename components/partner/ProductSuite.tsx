import React, { useState, useRef, useEffect } from 'react';
import FadeIn from './ui/FadeIn';
import { 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Calendar,
  User,
  Search,
  ShieldCheck,
  Globe,
  TrendingUp
} from 'lucide-react';

// --- VISUAL COMPONENTS ---

const SourceVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-black">
        {/* Radar Background & Content Container */}
        <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            
            {/* Circles - Centered precisely */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-gray-800 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-gray-800 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] border border-gray-800 rounded-full"></div>
            
            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-full h-[1px] bg-white"></div>
                <div className="h-full w-[1px] bg-white absolute"></div>
            </div>

            {/* Lead Sources on Radar Circles */}
            {[
                { label: 'Zillow', r: 150, deg: 210, delay: 100 },      
                { label: 'Apts.com', r: 150, deg: 330, delay: 1100 },   
                { label: 'Google', r: 150, deg: 270, delay: 500 },      
                
                { label: 'WeChat', r: 100, deg: 0, delay: 700 },        
                { label: 'Rednote', r: 100, deg: 180, delay: 900 },     
                
                { label: 'Facebook', r: 50, deg: 90, delay: 300 },      
            ].map((source, i) => {
                 const rad = (source.deg * Math.PI) / 180;
                 const x = source.r * Math.cos(rad);
                 const y = source.r * Math.sin(rad);

                 return (
                     <div 
                        key={i}
                        className={`absolute flex flex-col items-center justify-center transition-all duration-500`}
                        style={{ 
                            transform: `translate(${x}px, ${y}px) ${isActive ? 'scale(1)' : 'scale(0)'}`,
                            transitionDelay: `${source.delay}ms`,
                            opacity: isActive ? 1 : 0,
                            top: '50%',
                            left: '50%',
                            marginTop: '-6px',
                            marginLeft: '-6px'
                        }}
                     >
                        <div className="relative flex flex-col items-center">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10 border-2 border-black"></div>
                            
                            <div className={`
                                absolute bg-gray-900 border border-gray-800 px-2 py-1 rounded text-[10px] text-gray-300 font-bold uppercase tracking-wider whitespace-nowrap z-20 shadow-xl
                                ${y < -50 ? 'bottom-4' : 'top-4'}
                            `}>
                                {source.label}
                            </div>
                        </div>
                     </div>
                 );
            })}
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none z-30">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-full border border-gray-800 shadow-lg">
                <Globe size={12} className="text-emerald-500" />
                <span className="text-[10px] text-gray-400 font-mono font-bold">OMNICHANNEL LISTENING ACTIVE</span>
             </div>
        </div>
    </div>
  )
}

const ResponseVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col p-6 bg-black">
       <div className="flex items-center justify-between mb-8 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3 opacity-40">
             <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-gray-600"></div>
          </div>
          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Live Conversation</div>
       </div>
       
       <div className="space-y-4 flex-1">
          {/* Incoming Lead */}
          <div className={`flex items-start gap-3 transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
             <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-300 shrink-0">JD</div>
             <div className="bg-gray-900 border border-gray-800 rounded-2xl rounded-tl-none p-3 text-xs text-gray-300 shadow-sm">
                Hi, do you have any 1-bedroom units available for next month?
             </div>
          </div>

          {/* AI Response */}
          <div className={`flex items-start gap-3 flex-row-reverse transition-all duration-700 delay-700 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
             <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold text-white shrink-0">AI</div>
             <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl rounded-tr-none p-3 text-xs text-emerald-100 shadow-sm">
                Yes, John! We have two layouts available for Nov 1st starting at $2,400.
             </div>
          </div>
       </div>

        <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-500 font-bold">
            <Zap size={12} className="text-emerald-500" />
            <span>Response time: 0.8s</span>
        </div>
    </div>
  );
};

const TourVisual = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col p-6 bg-black">
       <div className="flex items-center justify-between mb-6">
          <div className="text-white font-serif text-lg">Calendar</div>
          <div className="flex gap-1">
             <div className="w-6 h-6 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400"><ChevronLeft size={14}/></div>
             <div className="w-6 h-6 rounded bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400"><ChevronRight size={14}/></div>
          </div>
       </div>

       <div className="grid grid-cols-7 gap-2 mb-4 text-center">
          {['S','M','T','W','T','F','S'].map((d,i) => (
             <div key={i} className="text-[10px] text-gray-500 font-bold">{d}</div>
          ))}
       </div>

       <div className="grid grid-cols-7 gap-2 mb-4">
          {Array.from({length: 14}).map((_, i) => {
             const day = 12 + i;
             const isTarget = i === 8;
             return (
                 <div key={i} className={`aspect-square rounded border border-gray-800 bg-gray-900/50 relative flex items-center justify-center text-xs text-gray-400`}>
                    <span className={`transition-opacity duration-300 delay-500 ${isTarget && isActive ? 'opacity-0' : 'opacity-100'}`}>
                        {day}
                    </span>
                    {isTarget && (
                        <div className={`absolute inset-0 bg-emerald-500/20 border border-emerald-500 rounded flex items-center justify-center transition-all duration-500 delay-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                           <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                    )}
                 </div>
             )
          })}
       </div>

       <div className={`mt-auto shrink-0 bg-gray-900 border border-gray-800 shadow-xl rounded-lg p-3 transition-all duration-500 delay-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
           <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center"><User size={12} className="text-gray-400"/></div>
              <div>
                  <div className="text-xs text-white font-medium">New Tour Scheduled</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Auto-confirmed via SMS</div>
              </div>
           </div>
       </div>
    </div>
  );
}

const ScreenVisual = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-black">
             <div className={`relative w-40 h-56 bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden transition-all duration-700 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                 {/* ID Card Content */}
                 <div className="p-4 flex flex-col items-center gap-3">
                     <div className="w-14 h-14 rounded-full bg-gray-800"></div>
                     <div className="space-y-2 w-full">
                         <div className="h-2 w-16 bg-gray-800 rounded mx-auto"></div>
                         <div className="h-2 w-24 bg-gray-800 rounded mx-auto"></div>
                     </div>
                 </div>
                 
                 {/* Scanning Bar */}
                 <div className={`absolute top-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] transition-all duration-[2000ms] ease-in-out ${isActive ? 'top-[100%]' : 'top-0'}`}></div>
                 
                 {/* Success Overlay */}
                 <div className={`absolute inset-0 bg-emerald-900/90 flex flex-col items-center justify-center gap-2 transition-all duration-300 delay-[1500ms] ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                     <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                         <ShieldCheck size={20} />
                     </div>
                     <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Verified</span>
                 </div>
             </div>

             <div className="absolute right-6 top-6 space-y-2">
                  {[
                      { l: 'Identity', d: 1000 },
                      { l: 'Income', d: 1200 },
                      { l: 'Credit', d: 1400 }
                  ].map((item, i) => (
                      <div key={i} className={`flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase transition-all duration-500`} style={{ transitionDelay: `${item.d}ms`, opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0)' : 'translateX(10px)' }}>
                          <CheckCircle2 size={10} className="text-emerald-500" /> {item.l}
                      </div>
                  ))}
             </div>
        </div>
    )
}

const YieldVisual = ({ isActive }: { isActive: boolean }) => {
    return (
        <div className="w-full h-full relative overflow-hidden flex flex-col bg-black">
            {/* Header */}
            <div className="p-6 pb-2 flex justify-between items-start z-10 relative">
                <div>
                   <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Portfolio Revenue</div>
                   <div className="text-2xl font-serif text-white">
                      $1.24M 
                      <span className={`text-sm font-sans text-emerald-500 font-bold ml-2 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>+12%</span>
                   </div>
                </div>
                <div className={`px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] text-emerald-500 font-bold uppercase tracking-wider flex items-center gap-1 transition-opacity duration-1000 delay-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <TrendingUp size={10} /> Active
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative flex-1 w-full min-h-0">
                <div className="absolute left-6 right-6 top-0 bottom-0 flex flex-col justify-between py-4 px-0 opacity-10">
                    <div className="border-t border-gray-800 border-dashed w-full"></div>
                    <div className="border-t border-gray-800 border-dashed w-full"></div>
                    <div className="border-t border-gray-800 border-dashed w-full"></div>
                    <div className="border-t border-gray-800 border-dashed w-full"></div>
                </div>

                <svg className="absolute left-6 right-6 top-0 bottom-0 w-auto h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 150">
                    <defs>
                        <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    
                    <path 
                        d="M0,120 C80,115 150,110 220,105 C260,100 280,102 300,100" 
                        fill="none" 
                        stroke="#374151" 
                        strokeWidth="1.5" 
                        strokeDasharray="4 4"
                        vectorEffect="non-scaling-stroke"
                    />
                    
                    <path 
                        d="M0,120 C40,115 70,100 100,85 C140,70 170,55 200,40 C240,25 270,10 300,5" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="3"
                        className="drop-shadow-[0_2_8px_rgba(16,185,129,0.3)]"
                        strokeDasharray="400"
                        strokeDashoffset={isActive ? 0 : 400}
                        style={{ transition: 'stroke-dashoffset 2s ease-out 0.5s' }}
                        vectorEffect="non-scaling-stroke"
                    />

                     <path 
                        d="M0,120 C40,115 70,100 100,85 C140,70 170,55 200,40 C240,25 270,10 300,5 V 150 H 0 Z" 
                        fill="url(#gradientArea)"
                        className={`transition-opacity duration-1000 delay-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                    
                    {[
                        { x: 0, y: 120, delay: 1500 },
                        { x: 100, y: 85, delay: 1700 },
                        { x: 200, y: 40, delay: 1900 },
                        { x: 300, y: 5, delay: 2100 }
                    ].map((point, i) => (
                        <circle 
                            key={i}
                            cx={point.x} 
                            cy={point.y} 
                            r="4" 
                            fill="#10b981"
                            stroke="#000000" 
                            strokeWidth="2"
                            className={`transition-opacity duration-500 shadow-sm ${isActive ? 'opacity-100' : 'opacity-0'}`}
                            style={{ transitionDelay: `${point.delay}ms` }}
                        />
                    ))}
                </svg>
            </div>

            <div className="px-6 pb-4 flex justify-between mt-auto text-[10px] text-gray-500 font-bold font-mono">
                <span>Q1</span>
                <span>Q2</span>
                <span>Q3</span>
                <span>Q4</span>
            </div>
        </div>
    )
}

// --- CARD COMPONENT ---

const PipelineCard: React.FC<{ slide: any, index: number }> = ({ slide, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        }, { threshold: 0.3 }); 

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const VisualComponent = slide.visual;

    return (
        <div ref={ref} className="min-w-[85vw] md:min-w-[400px] w-[85vw] md:w-[400px] h-full snap-center bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden flex flex-col group hover:border-gray-600 transition-all shadow-xl shrink-0">
            {/* Visual Area */}
            <div className="h-[280px] w-full relative border-b border-white/5">
                 <VisualComponent isActive={isVisible} />
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-emerald-500 font-mono text-sm font-bold">/{slide.step}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{slide.label}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-serif text-white mb-3">{slide.title}</h3>
                {/* <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-6">
                    {slide.description}
                </p> */}

                <div className="mt-auto flex flex-wrap gap-2">
                     {slide.tags.map((tag: string) => (
                         <span key={tag} className="px-2 py-1 rounded bg-gray-900 border border-gray-800 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            {tag}
                         </span>
                     ))}
                </div>
            </div>
        </div>
    )
}

export const Pipeline: React.FC = () => {
    const slides = [
        {
          id: 'source',
          step: '01',
          label: 'Source',
          title: 'Demand Generation.',
          description: 'UnitPulse ingests signals from every major listing network, social platform, and paid channel to identify high-intent renters.',
          tags: ['Omnichannel', 'Lead Scoring', 'Ad Optimization'],
          visual: SourceVisual
        },
        {
          id: 'response',
          step: '02',
          label: 'Capture',
          title: 'Zero-Latency Response.',
          description: 'Engage 100% of inbound leads instantly. UnitPulse handles inquiries across SMS, email, and voice with human-like empathy.',
          tags: ['24/7 Availability', '< 2s Response', 'Multi-channel'],
          visual: ResponseVisual
        },
        {
          id: 'tour',
          step: '03',
          label: 'Convert',
          title: 'Autonomous Touring.',
          description: 'Stop playing phone tag. UnitPulse coordinates schedules, sends calendar invites, and performs no-show recovery automatically.',
          tags: ['Smart Scheduling', 'Calendar Sync', 'Reminders'],
          visual: TourVisual
        },
        {
          id: 'screen',
          step: '04',
          label: 'Verify',
          title: 'Instant Screening.',
          description: 'Secure leases faster with automated identity verification, income validation, and credit checks processed in seconds.',
          tags: ['ID Verification', 'Income Check', 'Fraud Detection'],
          visual: ScreenVisual
        },
        {
          id: 'yield',
          step: '05',
          label: 'Optimize',
          title: 'Dynamic Revenue.',
          description: 'Maximize asset value with real-time pricing adjustments. UnitPulse analyzes market demand to suggest the optimal rent.',
          tags: ['Market Analysis', 'Price Optimization', 'Yield Mgmt'],
          visual: YieldVisual
        }
    ];

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const cardWidth = container.firstElementChild?.clientWidth || 400;
            const gap = 24; 
            const scrollAmount = cardWidth + gap;
            container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
             <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-8">
                 <div>
                      <span className="block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">End-to-End Execution</span>
                      <h2 className="font-serif text-3xl md:text-4xl leading-tight text-white">
                         The Autonomous <br/> Pipeline.
                      </h2>
                 </div>
                 
                 {/* Navigation Controls */}
                 <div className="flex gap-2">
                     <button 
                         onClick={() => scroll('left')} 
                         className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white"
                         aria-label="Previous slide"
                     >
                         <ChevronLeft size={16} />
                     </button>
                     <button 
                         onClick={() => scroll('right')} 
                         className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-white hover:text-black hover:border-white transition-all text-white"
                         aria-label="Next slide"
                     >
                         <ChevronRight size={16} />
                     </button>
                 </div>
             </div>

            {/* Horizontal Scrolling Card List */}
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 pb-4 px-8 md:px-12 -mx-8 md:-mx-12 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden" 
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {slides.map((slide, idx) => (
                    <PipelineCard key={slide.id} slide={slide} index={idx} />
                ))}
            </div>
        </div>
    );
};

const ProductSuite: React.FC = () => {
    return (
        <section id="pipeline" className="py-24 bg-black text-white relative overflow-hidden border-b border-gray-900">
             {/* Subtlest background glow - Gray/Neutral */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-800/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

             <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12">
                <FadeIn>
                    <Pipeline />
                </FadeIn>
            </div>
        </section>
    );
};

export default ProductSuite;