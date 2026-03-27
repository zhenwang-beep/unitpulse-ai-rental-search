import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_PROPERTIES, SUGGESTION_CHIPS } from './constants';
import { Property, ChatMessage, SearchFilters } from './types';
import PropertyCard from './components/PropertyCard';
import ChatInterface, { RichMediaCanvas } from './components/ChatInterface';
import LiveInterface from './components/LiveInterface';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import FavoritesPage from './components/FavoritesPage';
import { sendMessageToGemini } from './services/geminiService';
import { getFilteredProperties } from './services/propertyService';
import { ArrowRight, Search, Sun, TreePine, Music, PanelRightClose, PanelRightOpen, ChevronDown, RotateCcw, Loader2, AudioLines, MapPin, X, ShieldCheck, Heart, Bed, Bath, Ruler, Calendar, Phone, Sparkles, CheckCircle2, Zap, ChevronLeft, ChevronRight, Info, PenTool, FileText, Check, Menu, LogOut, User, ArrowLeftRight, Calculator, Target, MessageSquare, Clock, Building, Settings, HelpCircle, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}


const App: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentThreadId, setCurrentThreadId] = useState('general-1');
  const [allThreads, setAllThreads] = useState<Record<string, ChatMessage[]>>({ 
    'general-1': [] 
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const activeChatId = selectedProperty ? selectedProperty.id : currentThreadId;
  const messages = allThreads[activeChatId] || [];

  const setMessages = (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    setAllThreads(prev => {
      const currentMessages = prev[activeChatId] || [];
      const updatedMessages = typeof newMessages === 'function' ? newMessages(currentMessages) : newMessages;
      return {
        ...prev,
        [activeChatId]: updatedMessages
      };
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [isLiveMode, setIsLiveMode] = useState(false);

  const [signedPropertyId, setSignedPropertyId] = useState<string | null>(null);
  const [hasIntelligencePermission, setHasIntelligencePermission] = useState(false);
  const [recommendationStep, setRecommendationStep] = useState<'initial' | 'analyzing' | 'confirming' | 'recommending'>('initial');
  const [exampleLinks, setExampleLinks] = useState('');
  const [summarizedPreference, setSummarizedPreference] = useState('You love modern lofts with high ceilings, industrial accents, and plenty of natural light. You prefer open floor plans and floor-to-ceiling windows.');
  const [isEditingPreference, setIsEditingPreference] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState<'listing' | 'ai'>('listing');
  const [aiPanelState, setAiPanelState] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isMatchPopoverOpen, setIsMatchPopoverOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isPropertyScrolled, setIsPropertyScrolled] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtBottom(entry.isIntersecting),
      { threshold: 0 }
    );
    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [selectedProperty]);

  const [selectedPropertyImageIndex, setSelectedPropertyImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  // Set default modal images when property is selected
  useEffect(() => {
    if (selectedProperty) {
      setModalImages(selectedProperty.images || [selectedProperty.image]);
      setModalTitle(selectedProperty.title);
    }
  }, [selectedProperty]);
  const [expandedFloorPlan, setExpandedFloorPlan] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const lastTriggered = useRef<Record<string, boolean>>({});

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
  };

  // // Auto-trigger Google Login on mount
  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     const timer = setTimeout(() => {
  //       setShowGooglePrompt(true);
  //     }, 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [isLoggedIn]);

  // Trigger 1: After viewing a unit
  useEffect(() => {
    if (selectedUnit && selectedProperty && !lastTriggered.current[`unit-${selectedUnit}`]) {
      lastTriggered.current[`unit-${selectedUnit}`] = true;
      const timer = setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          text: "This unit matches your preferences perfectly! Would you like to start an application or compare it with other available units?",
          timestamp: Date.now(),
          suggestedReplies: ["Apply Now", "Compare Units"]
        }]);
        setAiPanelState('half');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [selectedUnit, selectedProperty]);

  // Trigger 2: On idle
  useEffect(() => {
    if (!selectedProperty) return;
    const timer = setTimeout(() => {
      if (lastTriggered.current['idle']) return;
      lastTriggered.current['idle'] = true;
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: "Need help deciding? I can break down the total costs or show you some more affordable options nearby.",
        timestamp: Date.now(),
        suggestedReplies: ["Cost breakdown", "Cheaper options"]
      }]);
      setAiPanelState('half');
    }, 45000);
    return () => clearTimeout(timer);
  }, [selectedProperty, messages.length]);

  // Trigger 3: On pricing view
  useEffect(() => {
    if (expandedFloorPlan && selectedProperty && !lastTriggered.current[`pricing-${expandedFloorPlan}`]) {
      lastTriggered.current[`pricing-${expandedFloorPlan}`] = true;
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        text: `The estimated monthly cost for this floor plan is around $${selectedProperty.pricingAndFees?.rent || '2,400'}. Would you like to see a full breakdown of fees?`,
        timestamp: Date.now(),
        suggestedReplies: ["View breakdown", "Ask about fees"]
      }]);
      setAiPanelState('half');
    }
  }, [expandedFloorPlan, selectedProperty]);
  
  const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

  // Chat view scroll state (header hide/show)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleLandingScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    setIsAtTop(currentScrollY < 20);
    setIsHeaderVisible(true);
  };

  // Auto-trigger AI message when a property is selected to guide towards signing
  useEffect(() => {
    if (selectedProperty && !signedPropertyId) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setIsAnalyzing(false);
      }, 2500);

      // Check if the last message was already about this property to avoid duplicates
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'assistant' && lastMsg.text.includes(selectedProperty.title)) {
        return () => clearTimeout(timer);
      }

      const triggerAI = async () => {
        setIsLoading(true);
        const history = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
        const response = await sendMessageToGemini(
          `I just clicked on ${selectedProperty.title}. Please introduce it and guide me to sign the lease.`, 
          history, 
          selectedProperty
        );
        setIsLoading(false);
        if (response) {
          const aiMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            text: response.conversationalReply,
            timestamp: Date.now(),
            suggestedReplies: response.suggestedReplies,
            isSigningMessage: response.intentToSign || response.interactiveType === 'contract',
            interactiveType: response.interactiveType as any,
            interactiveData: (response.interactiveType === 'deep-dive' || response.interactiveType === 'contract' || response.interactiveType === 'application-form') ? selectedProperty : undefined,
            styleTitle: response.styleTitle,
            styleAvatar: response.styleAvatar,
            styleSummary: response.styleSummary
          };
          setMessages(prev => [...prev, aiMsg]);
        }
      };
      triggerAI();
      
      return () => clearTimeout(timer);
    }
  }, [selectedProperty?.id]);

  const handleLiveMessage = (role: 'user' | 'assistant', text: string, properties?: Property[]) => {
    const newMessage: ChatMessage = {
      id: `${role}-${Date.now()}`,
      text,
      role,
      timestamp: Date.now(),
      properties
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleNewChat = () => {
    const newId = `general-${Date.now()}`;
    const greeting: ChatMessage = {
      id: 'greeting',
      text: "Hi! I'm your AI rental assistant. How can I help you find your next home today?",
      role: 'assistant',
      timestamp: Date.now()
    };
    setAllThreads(prev => ({
      ...prev,
      [newId]: [greeting]
    }));
    setCurrentThreadId(newId);
    setSelectedProperty(null);
  };

  const handleSwitchThread = (id: string) => {
    setCurrentThreadId(id);
    setSelectedProperty(null);
    setIsHistoryOpen(false);
  };

  const handleSendMessage = async (text: string) => {
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);

    const history = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
    const response = await sendMessageToGemini(text, history, selectedProperty);

    setIsLoading(false);

    if (response) {
      let results: Property[] = [];
      
      const shouldSearch = selectedProperty 
        ? response.intentToSearch === true 
        : response.intentToSearch !== false;
      
      if (shouldSearch) {
        const newFilters = { ...currentFilters, ...response.filters };
        setCurrentFilters(newFilters);
        results = getFilteredProperties(newFilters);
      }

      // Handle intents
      if (response.intentToSign && selectedProperty) {
        setSignedPropertyId(selectedProperty.id);
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: response.conversationalReply,
        timestamp: Date.now(),
        properties: results.length > 0 ? results : undefined,
        suggestedReplies: response.suggestedReplies,
        isSigningMessage: response.intentToSign || response.interactiveType === 'contract',
        interactiveType: response.interactiveType,
        interactiveData: (response.interactiveType === 'deep-dive' || response.interactiveType === 'contract' || response.interactiveType === 'application-form') ? selectedProperty : undefined,
        styleTitle: response.styleTitle,
        styleAvatar: response.styleAvatar,
        styleSummary: response.styleSummary
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const handleStartRentalProcess = (type: 'tour' | 'apply') => {
    if (!selectedProperty) return;
    
    // Add user message to chat for context
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: type === 'tour' ? "I want to schedule a tour" : "I want to apply for this property",
      timestamp: Date.now()
    };

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: type === 'tour' 
        ? `Great! I've started the tour scheduling process for ${selectedProperty.title}. Please confirm your preferred date and time below.`
        : `Excellent choice! I've initiated the application process for ${selectedProperty.title}. Let's get your details ready.`,
      timestamp: Date.now() + 1,
      interactiveType: type === 'tour' ? 'contract' : 'application-form',
      interactiveData: selectedProperty,
      suggestedReplies: type === 'tour' ? ["Tomorrow at 10am", "This weekend"] : ["Start Form", "Ask about fees"]
    };
    
    setMessages(prev => [...prev, userMsg, aiMsg]);
    
    // Open AI panel on mobile
    if (window.innerWidth < 1024) {
      setAiPanelState('half');
    }
  };

  const handleCallProperty = () => {
    // Standard tel link triggers native call/FaceTime dialog
    window.location.href = 'tel:+1234567890';
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginView(false);
    setShowGooglePrompt(false);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const toggleFavorite = (property: Property) => {
    if (!isLoggedIn) {
      setShowLoginView(true);
      return;
    }
    setFavorites(prev =>
      prev.find(p => p.id === property.id) ? prev.filter(p => p.id !== property.id) : [...prev, property]
    );
  };

  const handleAnalyzeStyle = () => {
    if (!exampleLinks.trim()) return;
    handleSendMessage(`Analyze my style from these links: ${exampleLinks}`);
    setExampleLinks('');
  };

  // --- LOGIN VIEW ---
  if (showLoginView) {
    return (
      <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <img src={LOGO_URL} alt="UnitPulse" className="h-12" />
            </div>
            <h1 className="text-3xl font-black text-black uppercase tracking-wider">Welcome to UnitPulse</h1>
            <p className="text-neutral-500 font-medium">Find your perfect home with AI-powered search.</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleLogin}
              className="w-full h-14 bg-white border-2 border-black/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all group"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5" />
              <span className="text-sm font-black text-black uppercase tracking-wider">Continue with Google</span>
            </button>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase tracking-wider font-black text-neutral-400 bg-white px-4">Or</div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-email" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Email Address</label>
                <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full h-14 px-6 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Password</label>
                <div className="relative">
                  <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" className="w-full h-14 px-6 pr-14 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button onClick={handleLogin} className="w-full h-14 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-neutral-800 transition-all">
                Sign In
              </button>
            </div>
          </div>

          <div className="text-center">
            <button className="text-xs font-medium text-neutral-400 hover:text-black transition-colors">
              Don't have an account? <span className="text-black font-semibold">Sign up</span>
            </button>
          </div>

          <button 
            onClick={() => setShowLoginView(false)}
            className="absolute top-8 right-8 p-3 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </motion.div>
      </div>
    );
  }

  // --- CHAT VIEW (Main Interface) ---
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#f5f4f0] font-sans text-black overflow-hidden">
       {/* Live Interface Overlay */}
       {isLiveMode && (
         <LiveInterface 
           onClose={() => setIsLiveMode(false)} 
           onMessage={handleLiveMessage} 
           onToggleFavorite={toggleFavorite}
           favorites={favorites}
         />
       )}

       {!selectedProperty && (
        <header className={`fixed top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-[60] transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-[#f5f4f0]' : 'bg-white shadow-sm'}`}>
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setAllThreads({'general-1': []}); setCurrentThreadId('general-1'); setSelectedProperty(null); }}>
               <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
               <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
              <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
              {isLoggedIn ? (
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-50">
                      <button 
                        onClick={() => { setShowFavorites(true); setIsDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Heart size={16} /> Favorites
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setShowLoginView(true)}
                  className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all"
                >
                  Login
                </button>
              )}
            </nav>
            <button onClick={() => setIsHistoryOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
               <Menu size={24} />
            </button>
          </div>
        </header>
       )}

       {/* History Sidebar */}
       <AnimatePresence>
         {isHistoryOpen && (
           <>
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               className="fixed inset-0 bg-black/40 z-[65]"
               onClick={() => setIsHistoryOpen(false)}
             />
           <motion.div
             initial={{ x: '-100%' }}
             animate={{ x: 0 }}
             exit={{ x: '-100%' }}
             transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
             className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] border-r border-black/5 flex flex-col"
           >
             <div className="p-6 border-b border-black/5 flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <img src={LOGO_URL} alt="UnitPulse" className="h-6" />
                 <h2 className="font-heading font-bold text-lg tracking-wider">UnitPulse</h2>
               </div>
               <button onClick={() => setIsHistoryOpen(false)} aria-label="Close menu" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                 <X size={20} />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto flex flex-col">
               <div className="p-6 border-b border-black/5 flex flex-col gap-6 md:hidden">
                 {isLoggedIn ? (
                   <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-black/5">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-12 h-12 rounded-full border border-black/5 bg-white shadow-sm" />
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-neutral-900">Felix Zhou</span>
                       <span className="text-xs font-medium text-neutral-500">Pro Member</span>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3">
                     <h3 className="text-lg font-bold text-neutral-900">Welcome to UnitPulse</h3>
                     <p className="text-sm text-neutral-500">Sign in to save your favorite homes and track applications.</p>
                     <button 
                       onClick={() => { setShowLoginView(true); setIsHistoryOpen(false); }}
                       className="w-full py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-medium hover:bg-[#3a4e1a] transition-all"
                     >
                       Login / Sign up
                     </button>
                   </div>
                 )}

                 <div className="flex flex-col gap-1">
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Search size={20} className="text-neutral-400" />
                     Find a home
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Heart size={20} className="text-neutral-400" />
                     Saved Homes
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Clock size={20} className="text-neutral-400" />
                     Recently Viewed
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <FileText size={20} className="text-neutral-400" />
                     Applications
                   </a>
                 </div>

                 <div className="h-px bg-neutral-100 w-full"></div>

                 <div className="flex flex-col gap-1">
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Building size={20} className="text-neutral-400" />
                     Become a partner
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Settings size={20} className="text-neutral-400" />
                     Settings
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <HelpCircle size={20} className="text-neutral-400" />
                     Help
                   </a>
                 </div>

                 {isLoggedIn && (
                   <>
                     <div className="h-px bg-neutral-100 w-full"></div>
                     <button 
                       onClick={() => { setIsLoggedIn(false); setIsHistoryOpen(false); }}
                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium w-full text-left"
                     >
                       <LogOut size={20} className="text-red-400" />
                       Logout
                     </button>
                   </>
                 )}
               </div>
             </div>
            </motion.div>
           </>
         )}
       </AnimatePresence>

       <div className={`flex-1 flex flex-col min-h-0 relative transition-all duration-300 w-full ${!selectedProperty ? 'pt-16 md:pt-20' : ''}`}>
          {selectedProperty && (
            <div 
              className="fixed inset-0 z-[100] bg-white flex flex-col overflow-hidden"
            >
              {/* Mobile/Tablet Header & Tabs */}
              <div className={`lg:hidden flex flex-col bg-white sticky top-0 z-[110] transition-shadow duration-300 ${isPropertyScrolled ? 'shadow-sm' : ''}`}>
                <div className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setSelectedProperty(null); setMobileTab('listing'); }}
                      className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <span className="font-heading font-bold text-lg truncate max-w-[200px] tracking-wider">{selectedProperty.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleFavorite(selectedProperty)}
                      className={`p-2 rounded-full transition-all ${favorites.some(f => f.id === selectedProperty.id) ? 'text-red-500' : 'text-neutral-300 hover:text-red-500 hover:bg-neutral-50'}`}
                    >
                      <motion.div
                        animate={favorites.some(f => f.id === selectedProperty.id) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart size={20} fill={favorites.some(f => f.id === selectedProperty.id) ? "currentColor" : "none"} />
                      </motion.div>
                    </button>
                    <button 
                      onClick={() => setIsAiDrawerOpen(true)}
                      className="lg:hidden p-2 bg-black text-white rounded-full md:flex hidden"
                    >
                      <AudioLines size={18} />
                    </button>
                  </div>
                </div>
                
                {/* Mobile Tabs removed as AI is now a bottom sheet */}
              </div>

              <div className={`flex-1 min-h-0 flex flex-col lg:flex-row max-w-[1440px] mx-auto w-full gap-6 lg:px-6 lg:pt-6 lg:pb-0 transition-all duration-500 ease-in-out ${isAiExpanded ? 'ai-expanded' : ''}`}>
                
                {/* Left Column: Listing Content */}
                <div 
                  className={`flex-col gap-6 transition-all duration-500 ease-in-out flex
                  ${isAiExpanded ? 'lg:flex-[1_1_50%] lg:min-w-[400px]' : 'lg:flex-[1_1_60%] lg:min-w-[520px]'}
                  w-full overflow-y-auto lg:overflow-y-auto custom-scrollbar lg:pr-2 lg:h-full relative pb-24 lg:pb-0
                `}
                  onScroll={(e) => setIsPropertyScrolled(e.currentTarget.scrollTop > 10)}
                >
                  
                  {/* Sticky Desktop Back Button Container */}
                  <div className="hidden lg:block sticky top-4 z-50 w-full pointer-events-none" style={{ height: 0, marginBottom: '-1.5rem' }}>
                    <button 
                      onClick={() => { setSelectedProperty(null); setSelectedPropertyImageIndex(0); }}
                      className="absolute left-4 p-3 bg-white/50 backdrop-blur-md rounded-full text-black shadow-xl hover:bg-white/80 transition-all pointer-events-auto"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {/* Bento Box Image Layout */}
                  <div className="w-full px-6">
                    <div className="w-full grid grid-cols-4 grid-rows-2 gap-2 aspect-[4/3] md:aspect-[21/9] rounded-2xl overflow-hidden relative group">
                      {/* Main Image */}
                      <div 
                        className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
                        onClick={() => { 
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setSelectedPropertyImageIndex(0); 
                          setIsImageModalOpen(true); 
                        }}
                      >
                        <img 
                          src={(selectedProperty.images || [selectedProperty.image])[0]} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                          alt={selectedProperty.title}
                        />
                      </div>
                      {/* Smaller Images (Desktop) */}
                      <div 
                        className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
                        onClick={() => { 
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setSelectedPropertyImageIndex(1); 
                          setIsImageModalOpen(true); 
                        }}
                      >
                        <img 
                          src={(selectedProperty.images || [selectedProperty.image])[1] || selectedProperty.image} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                          alt=""
                        />
                      </div>
                      <div 
                        className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
                        onClick={() => { 
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setSelectedPropertyImageIndex(2); 
                          setIsImageModalOpen(true); 
                        }}
                      >
                        <img 
                          src={(selectedProperty.images || [selectedProperty.image])[2] || selectedProperty.image} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                          alt=""
                        />
                      </div>
                      <div 
                        className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
                        onClick={() => { 
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setSelectedPropertyImageIndex(3); 
                          setIsImageModalOpen(true); 
                        }}
                      >
                        <img 
                          src={(selectedProperty.images || [selectedProperty.image])[3] || selectedProperty.image} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                          alt=""
                        />
                      </div>
                      <div 
                        className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
                        onClick={() => { 
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setSelectedPropertyImageIndex(4); 
                          setIsImageModalOpen(true); 
                        }}
                      >
                        <img 
                          src={(selectedProperty.images || [selectedProperty.image])[4] || selectedProperty.image} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
                          referrerPolicy="no-referrer" 
                          alt=""
                        />
                        {(selectedProperty.images || []).length > 5 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-lg">
                            +{(selectedProperty.images || []).length - 5}
                          </div>
                        )}
                      </div>
                      
                      {/* View All Button */}
                      <button 
                        onClick={() => {
                          setModalImages(selectedProperty.images || [selectedProperty.image]);
                          setModalTitle(selectedProperty.title);
                          setIsImageModalOpen(true);
                        }}
                        className="absolute bottom-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-md border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-xl"
                      >
                        <Menu size={14} />
                        View all photos
                      </button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={`flex flex-col gap-8 px-6 transition-all duration-500`}>
                    <div className="flex justify-between items-start">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 mb-3 relative">
                            <span className="px-2.5 py-1 bg-black text-white text-xs font-black uppercase tracking-wider rounded-full">New Listing</span>
                            <button 
                              onClick={() => setIsMatchPopoverOpen(!isMatchPopoverOpen)}
                              className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-full hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles size={12} />
                              95% Match
                            </button>
                            
                            <AnimatePresence>
                              {isMatchPopoverOpen && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsMatchPopoverOpen(false)}
                                  />
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full left-0 mt-2 w-80 z-50"
                                  >
                                    <div className="bg-gradient-to-br from-emerald-50/95 via-white/95 to-white/95 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100/50 shadow-[0_20px_40px_rgba(16,185,129,0.15)] relative overflow-hidden">
                                      {/* Subtle Background Glows */}
                                      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                                      
                                      <button 
                                        onClick={() => setIsMatchPopoverOpen(false)}
                                        className="absolute top-4 right-4 z-20 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors"
                                      >
                                        <span>Close</span>
                                        <X size={14} />
                                      </button>
                                      
                                      <div className="relative z-10 flex items-center justify-between gap-4">
                                      <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">AI Compatibility</span>
                                        </div>
                                        <h2 className="text-2xl font-black text-black tracking-wider leading-none">95% Match</h2>
                                        <p className="text-[10px] font-bold text-neutral-500 leading-relaxed">Perfectly aligned with your preference for modern lofts and quiet neighborhoods.</p>
                                      </div>
                                      <div className="w-16 h-16 relative flex items-center justify-center shrink-0">
                                        <Zap size={20} className="text-emerald-500 relative z-10" fill="currentColor" />
                                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
                                          <circle 
                                            cx="48" cy="48" r="44" 
                                            fill="none" stroke="currentColor" strokeWidth="8" 
                                            className="text-emerald-50 opacity-50"
                                          />
                                          <circle 
                                            cx="48" cy="48" r="44" 
                                            fill="none" stroke="currentColor" strokeWidth="8" 
                                            className="text-emerald-500"
                                            strokeDasharray={`${2 * Math.PI * 44}`}
                                            strokeDashoffset={`${2 * Math.PI * 44 * (1 - 0.95)}`}
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                    <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-3 mt-6 pt-6 border-t border-emerald-100/50">
                                      {[
                                        { icon: <Sun size={10} />, label: 'Natural Light' },
                                        { icon: <Music size={10} />, label: 'Quiet Zone' },
                                        { icon: <Zap size={10} />, label: 'High-speed Fiber' },
                                        { icon: <MapPin size={10} />, label: 'Prime Location' }
                                      ].map(tag => (
                                        <div key={tag.label} className="flex items-center gap-2">
                                          <div className="w-5 h-5 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600">
                                            {tag.icon}
                                          </div>
                                          <span className="text-[8px] font-black text-neutral-600 uppercase tracking-wider">{tag.label}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </div>
                          <h1 className="text-3xl font-black font-heading tracking-wider text-black leading-none">{selectedProperty.title}</h1>
                        </div>
                        <div className="flex flex-col gap-4">
                          <button 
                            onClick={() => mapRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center gap-2 text-neutral-400 font-bold text-sm tracking-wider hover:text-black transition-colors"
                          >
                            <MapPin size={14} className="text-black" />
                            <span>{selectedProperty.location}</span>
                          </button>
                          <div className="text-3xl font-black font-heading tracking-wider text-black flex items-baseline gap-1">
                            ${selectedProperty.price.toLocaleString()}+
                            <span className="text-xs font-bold opacity-40 ml-1">/mo</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => toggleFavorite(selectedProperty)}
                        className={`hidden lg:flex p-2 rounded-full transition-all ${favorites.some(f => f.id === selectedProperty.id) ? 'text-red-500' : 'text-neutral-300 hover:text-red-500 hover:bg-neutral-50'}`}
                      >
                        <motion.div
                          animate={favorites.some(f => f.id === selectedProperty.id) ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart size={28} fill={favorites.some(f => f.id === selectedProperty.id) ? "currentColor" : "none"} />
                        </motion.div>
                      </button>
                    </div>

                    {/* Specs - Moved Up */}
                    <div className="grid grid-cols-3 border-y border-neutral-100 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-black shrink-0">
                          <Bed size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-black leading-none mb-1">{selectedProperty.bedrooms}</span>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider leading-none">Beds</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3 border-x border-neutral-100">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-black shrink-0">
                          <Bath size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-black leading-none mb-1">{selectedProperty.bathrooms}</span>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider leading-none">Baths</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-black shrink-0">
                          <Ruler size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-black leading-none mb-1">{selectedProperty.sqft}</span>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider leading-none">Sq Ft</span>
                        </div>
                      </div>
                    </div>

                    {/* Lifestyle Insights - Compact & Animated */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50/30 rounded-2xl p-5 border border-emerald-100 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={18} className="text-emerald-600" />
                        <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wider">AI Lifestyle Match</h3>
                      </div>
                      
                      {isAnalyzing ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="h-2.5 bg-emerald-200/50 rounded-full w-3/4"></div>
                          <div className="h-2.5 bg-emerald-200/50 rounded-full w-full"></div>
                          <div className="h-2.5 bg-emerald-200/50 rounded-full w-5/6"></div>
                        </div>
                      ) : (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                          className="text-xs font-medium text-emerald-800 leading-relaxed"
                        >
                          Compared to <span className="font-bold text-emerald-950">The Glass House</span> ($100 cheaper), this unit includes all utilities and features a private terrace. Perfect for your preference for privacy and outdoor space without the hassle of extra bills.
                        </motion.div>
                      )}
                    </div>



                    {/* Floor Plans */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-black uppercase tracking-wider">Floor Plans</h3>
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">3 Units Available</span>
                      </div>
                      <div className="space-y-4">
                        {(selectedProperty.floorPlans || [
                          { type: 'Studio', priceRange: '$1,800 - $2,100', sqft: '450 - 550 sqft', available: 3, units: [
                            { id: 'Unit 101', price: '$1,850', sqft: '480', amenities: ['City View', 'Modern Kitchen'], image: 'https://picsum.photos/seed/studio1/400/300', images: ['https://picsum.photos/seed/studio1/1200/800'] },
                            { id: 'Unit 205', price: '$1,950', sqft: '510', amenities: ['High Floor', 'Balcony'], image: 'https://picsum.photos/seed/studio2/400/300', images: ['https://picsum.photos/seed/studio2/1200/800'] },
                            { id: 'Unit 302', price: '$2,050', sqft: '540', amenities: ['Corner Unit', 'Extra Storage'], image: 'https://picsum.photos/seed/studio3/400/300', images: ['https://picsum.photos/seed/studio3/1200/800'] }
                          ]},
                          { type: '1B1B', priceRange: '$2,400 - $2,800', sqft: '700 - 850 sqft', available: 5, units: [
                            { id: 'Unit 102', price: '$2,450', sqft: '720', amenities: ['Walk-in Closet', 'In-unit Laundry'], image: 'https://picsum.photos/seed/1b1b1/400/300', images: ['https://picsum.photos/seed/1b1b1/1200/800'] },
                            { id: 'Unit 201', price: '$2,550', sqft: '780', amenities: ['Garden View', 'Quiet Side'], image: 'https://picsum.photos/seed/1b1b2/400/300', images: ['https://picsum.photos/seed/1b1b2/1200/800'] },
                            { id: 'Unit 305', price: '$2,650', sqft: '840', amenities: ['Smart Home', 'Hardwood Floors'], image: 'https://picsum.photos/seed/1b1b3/400/300', images: ['https://picsum.photos/seed/1b1b3/1200/800'] }
                          ]},
                          { type: '2B2B', priceRange: '$3,500 - $4,200', sqft: '1,100 - 1,300 sqft', available: 2, units: [
                            { id: 'Unit 601', price: '$3,600', sqft: '1,150', amenities: ['Penthouse Level', 'Private Terrace'], image: 'https://picsum.photos/seed/2b2b1/400/300', images: ['https://picsum.photos/seed/2b2b1/1200/800'] },
                            { id: 'Unit 602', price: '$3,800', sqft: '1,250', amenities: ['Skyline Views', 'Chef\'s Kitchen'], image: 'https://picsum.photos/seed/2b2b2/400/300', images: ['https://picsum.photos/seed/2b2b2/1200/800'] }
                          ]},
                        ]).map(plan => (
                          <div 
                            key={plan.type} 
                            className={`group p-6 bg-white rounded-2xl border transition-all cursor-pointer relative ${expandedFloorPlan === plan.type ? 'border-black border-2' : 'border-black/5 hover:border-black'}`}
                          >
                            <div 
                              className="flex items-center justify-between mb-2"
                              onClick={() => setExpandedFloorPlan(expandedFloorPlan === plan.type ? null : plan.type)}
                            >
                              <span className="text-sm font-black text-black uppercase tracking-wider">{plan.type}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-black">{plan.priceRange}</span>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${expandedFloorPlan === plan.type ? 'rotate-180' : ''}`} />
                              </div>
                            </div>
                            <div 
                              className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider"
                              onClick={() => setExpandedFloorPlan(expandedFloorPlan === plan.type ? null : plan.type)}
                            >
                              <span>{plan.sqft}</span>
                              <span className={plan.available > 0 ? 'text-emerald-600' : 'text-neutral-300'}>
                                {plan.available} Available
                              </span>
                            </div>
                            
                            <AnimatePresence>
                              {expandedFloorPlan === plan.type && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-4 mt-4 border-t border-black/5 flex flex-col gap-4">
                                    {plan.units.map(unit => (
                                      <div key={unit.id} className="flex flex-col gap-3">
                                        {/* Compact View: Left/Right Layout */}
                                        <div 
                                          onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                                          className={`flex gap-4 p-4 rounded-xl transition-all border ${selectedUnit === unit.id ? 'bg-black text-white border-black shadow-lg' : 'bg-neutral-50 border-black/5 hover:border-black/20'}`}
                                        >
                                          {/* Left: Image */}
                                          <div 
                                            className="w-24 h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer relative group/img"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setModalImages(unit.images || [unit.image]);
                                              setModalTitle(`${selectedProperty.title} - ${unit.id}`);
                                              setSelectedPropertyImageIndex(0);
                                              setIsImageModalOpen(true);
                                            }}
                                          >
                                            <img src={unit.image} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                                            {(unit.images?.length || 0) > 1 && (
                                              <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-wider">
                                                {unit.images?.length} Photos
                                              </div>
                                            )}
                                          </div>

                                          {/* Right: Info */}
                                          <div className="flex-1 flex flex-col justify-between py-0.5">
                                            <div className="flex justify-between items-start">
                                              <div className="flex flex-col">
                                                <span className="text-xs font-black uppercase tracking-wider">{unit.id}</span>
                                                <span className={`text-xs font-bold uppercase tracking-wider ${selectedUnit === unit.id ? 'text-white/60' : 'text-neutral-400'}`}>
                                                  {plan.type} • {unit.sqft || plan.sqft}
                                                </span>
                                              </div>
                                              <div className="flex flex-col items-end">
                                                <span className="text-sm font-black tracking-wider">{unit.price}</span>
                                                <span className={`text-xs font-black uppercase tracking-wider ${selectedUnit === unit.id ? 'text-emerald-400' : 'text-emerald-600'}`}>Available Now</span>
                                              </div>
                                            </div>
                                            
                                            <div className="flex gap-2 mt-2">
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); handleStartRentalProcess('tour'); }}
                                                className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${selectedUnit === unit.id ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'}`}
                                              >
                                                Schedule Tour
                                              </button>
                                              <button 
                                                onClick={(e) => { e.stopPropagation(); handleCallProperty(); }}
                                                className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all border ${selectedUnit === unit.id ? 'border-white/20 text-white hover:bg-white/10' : 'border-black/10 text-black hover:bg-black/5'}`}
                                              >
                                                Contact
                                              </button>
                                            </div>
                                          </div>
                                        </div>

                                        <AnimatePresence>
                                          {selectedUnit === unit.id && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: 'auto', opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              className="overflow-hidden px-1"
                                            >
                                              <div className="flex flex-col gap-6 p-6 bg-neutral-50 rounded-2xl border border-black/5 shadow-inner">
                                                <div className="flex justify-between items-end">
                                                  <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Unit Number</span>
                                                    <span className="text-3xl font-black text-black tracking-wider">{unit.id}</span>
                                                  </div>
                                                  <div className="flex flex-col items-end">
                                                    <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Monthly Rent</span>
                                                    <span className="text-4xl font-black text-emerald-600 tracking-wider">{unit.price}</span>
                                                  </div>
                                                </div>

                                                <div className="space-y-2 p-4 bg-white rounded-xl border border-black/5">
                                                  <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Floor Plan Summary</span>
                                                  <p className="text-xs font-bold text-black leading-relaxed tracking-wider">
                                                    {plan.type} • {unit.sqft || plan.sqft} • {selectedProperty.location}
                                                  </p>
                                                  <p className="text-xs font-medium text-neutral-500 leading-relaxed">
                                                    This {plan.type.toLowerCase()} features an open-concept layout with premium finishes and {unit.amenities[0]?.toLowerCase() || 'modern'} features.
                                                  </p>
                                                </div>

                                                <div className="space-y-3">
                                                  <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Unit Amenities</span>
                                                  <div className="grid grid-cols-2 gap-2">
                                                    {unit.amenities.map(am => (
                                                      <div key={am} className="flex items-center gap-2 px-3 py-2 bg-white border border-black/5 rounded-lg">
                                                        <Check size={10} className="text-emerald-500" strokeWidth={4} />
                                                        <span className="text-xs font-black text-black uppercase tracking-wider">{am}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                                
                                                <button 
                                                  onClick={() => handleStartRentalProcess('apply')}
                                                  className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-xl flex items-center justify-center gap-2"
                                                >
                                                  <FileText size={16} />
                                                  Apply for this unit
                                                </button>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </div>



                    {/* Pricing & Fees */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-black uppercase tracking-wider">Pricing & Fees</h3>
                      <div className="bg-neutral-50 rounded-2xl p-6 border border-black/5 space-y-4">
                        {[
                          { label: 'Rent', value: `$${selectedProperty.price.toLocaleString()}` },
                          { label: 'Deposit', value: '$1,500' },
                          { label: 'Application Fee', value: '$50' },
                          { label: 'Pet Fee', value: '$300 (One-time)' },
                          { label: 'Utilities', value: 'Not Included (Water/Trash $45/mo)' }
                        ].map(fee => (
                          <div key={fee.label} className="flex items-center justify-between pb-4 border-b border-black/5 last:border-0 last:pb-0">
                            <span className="text-xs font-bold text-neutral-500 tracking-wider">{fee.label}</span>
                            <span className="text-xs font-black text-black">{fee.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-black uppercase tracking-wider">About this home</h3>
                      <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                        {selectedProperty.description}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black text-black uppercase tracking-wider">Amenities</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedProperty.amenities.map(am => (
                          <div key={am} className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl border border-black/5">
                            <Check size={12} strokeWidth={3} className="text-black" />
                            <span className="text-xs font-bold text-neutral-600 uppercase tracking-wider">{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lifestyle Fit - Map Visualization */}
                    <div ref={mapRef} className="space-y-4">
                      <h3 className="text-xs font-black text-black uppercase tracking-wider">Lifestyle Fit</h3>
                      <div className="w-full aspect-video bg-neutral-100 rounded-2xl border border-black/5 relative overflow-hidden shadow-inner">
                        <iframe
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedProperty.location || selectedProperty.title)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Floating Actions - Moved outside Content Area for better width management and z-index isolation */}
                  <div 
                    className={`flex gap-3 lg:py-4 fixed right-4 lg:right-auto lg:sticky bottom-[var(--mobile-bottom)] lg:bottom-0 lg:bg-white z-[110] lg:z-[60] lg:px-6 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none lg:pointer-events-auto justify-end lg:justify-start lg:w-full ${!isAtBottom ? 'lg:border-t lg:border-black/10 lg:shadow-[0_-8px_30px_rgba(0,0,0,0.04)]' : 'lg:border-t lg:border-transparent'}`}
                    style={{ '--mobile-bottom': aiPanelState === 'full' ? 'calc(90vh + 1rem)' : aiPanelState === 'half' ? 'calc(50vh + 1rem)' : 'calc(80px + 1rem)' } as React.CSSProperties}
                  >
                    <button 
                      onClick={handleCallProperty}
                      className="hidden lg:flex w-10 h-10 bg-neutral-100 text-black rounded-lg font-black items-center justify-center hover:bg-neutral-200 transition-all shrink-0 pointer-events-auto"
                      title="Call Property Manager"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleStartRentalProcess('tour')}
                      className="hidden lg:flex flex-1 h-10 bg-black text-white rounded-lg font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all items-center justify-center gap-2 pointer-events-auto"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>TOUR</span>
                    </button>
                    <button 
                      onClick={() => handleStartRentalProcess('apply')}
                      className="w-14 h-14 lg:w-auto rounded-full shadow-2xl lg:shadow-none lg:flex-1 lg:h-10 bg-emerald-500 text-white lg:rounded-lg font-black text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 pointer-events-auto"
                      title="Apply Now"
                    >
                      <FileText className="w-6 h-6 lg:w-4 lg:h-4" />
                      <span className="hidden lg:inline">Apply Now</span>
                    </button>
                  </div>
                  {/* Sentinel for scroll detection */}
                  <div ref={bottomSentinelRef} className="h-px w-full pointer-events-none" />
                </div>

                {/* Right Column: AI Panel (Desktop) / Bottom Sheet (Mobile/Tablet) */}
                <div className={`transition-all duration-500 ease-in-out hidden lg:flex
                  ${isAiExpanded ? 'lg:flex-[1_1_50%] lg:max-w-[800px]' : 'lg:flex-[0_1_40%] lg:min-w-[360px] lg:max-w-[520px]'}
                `}>
                  <div className="ai-panel sticky top-0 lg:top-6 h-full lg:h-[calc(100vh-3rem)] flex flex-col w-full bg-[#FCF9F8] lg:rounded-2xl lg:border lg:border-black/10 overflow-hidden lg:shadow-[0_12px_60px_rgba(0,0,0,0.08)] relative">
                    
                    {/* AI Expand / Drawer Controls */}
                    <div className="absolute top-4 right-4 z-50 flex gap-2">
                       <button 
                        onClick={() => setIsAiExpanded(!isAiExpanded)}
                        className="hidden lg:flex p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-black transition-all"
                        title={isAiExpanded ? "Collapse AI" : "Expand AI"}
                      >
                        {isAiExpanded ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                      </button>
                    </div>

                    <ChatInterface 
                      messages={messages} 
                      onSendMessage={handleSendMessage} 
                      isLoading={isLoading}
                      onToggleFavorite={(property) => toggleFavorite(property)}
                      favorites={favorites}
                      onStartLiveMode={() => setIsLiveMode(true)}
                      onPropertyClick={handlePropertyClick}
                      selectedProperty={selectedProperty}
                      onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                      onNewChat={handleNewChat}
                    />
                  </div>
                </div>

                {/* Floating CTA Bar (Mobile/Tablet Only) */}
                <div className="lg:hidden">
                  <AnimatePresence>
                    {selectedProperty && (
                      <motion.div
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ 
                          y: aiPanelState === 'collapsed' ? 'calc(100vh - 136px)' : 
                             aiPanelState === 'half' ? 'calc(55vh - 80px)' : '-100px',
                          opacity: aiPanelState === 'full' ? 0 : 1
                        }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed left-0 right-0 z-[140] px-4 pointer-events-none"
                      >
                        <div className="max-w-md mx-auto flex gap-3 pointer-events-auto">
                          <button 
                            onClick={() => handleStartRentalProcess('apply')}
                            className="flex-[2] h-12 lg:h-14 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                          >
                            <Zap size={18} fill="currentColor" />
                            Apply
                          </button>
                          <button 
                            onClick={() => handleStartRentalProcess('tour')}
                            className="flex-1 h-12 lg:h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
                          >
                            <Calendar size={18} />
                            Tour
                          </button>
                          <button 
                            onClick={handleCallProperty}
                            className="w-12 h-12 lg:w-14 lg:h-14 bg-white text-black border border-black/5 rounded-2xl font-black shadow-xl flex items-center justify-center active:scale-95 transition-transform shrink-0"
                          >
                            <Phone size={18} />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile/Tablet Bottom Sheet AI Panel */}
                <div className="lg:hidden">
                  <AnimatePresence>
                    {selectedProperty && (
                      <motion.div
                        initial="collapsed"
                        animate={aiPanelState}
                        variants={{
                          collapsed: { y: 'calc(100% - 70px)', height: '90vh' },
                          half: { y: '55%', height: '90vh' },
                          full: { y: '0%', height: '90vh' }
                        }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                          const velocity = info.velocity.y;
                          const offset = info.offset.y;
                          
                          if (velocity < -300 || offset < -100) {
                            if (aiPanelState === 'collapsed') setAiPanelState('half');
                            else if (aiPanelState === 'half') setAiPanelState('full');
                          } else if (velocity > 300 || offset > 100) {
                            if (aiPanelState === 'full') setAiPanelState('half');
                            else if (aiPanelState === 'half') setAiPanelState('collapsed');
                          }
                        }}
                        className="fixed bottom-0 left-0 right-0 bg-[#FCF9F8] z-[150] rounded-t-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.15)] border-t border-black/5 flex flex-col overflow-hidden"
                      >
                        {/* Drag Handle */}
                        <div 
                          className="w-full py-4 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shrink-0 group"
                          onClick={() => {
                            if (aiPanelState !== 'full') setAiPanelState('full');
                            else setAiPanelState('collapsed');
                          }}
                        >
                          <div className="w-12 h-1.5 bg-neutral-200 rounded-full group-hover:bg-neutral-300 transition-colors" />
                          {aiPanelState === 'collapsed' && (
                            <div className="mt-2 text-[10px] font-black text-neutral-400 uppercase tracking-wider animate-pulse">
                              Tap to expand AI Assistant
                            </div>
                          )}
                        </div>

                        <div className="flex-1 overflow-hidden relative flex flex-col">
                          <ChatInterface 
                            messages={messages} 
                            onSendMessage={(text) => {
                              handleSendMessage(text);
                              if (aiPanelState === 'collapsed') setAiPanelState('half');
                            }} 
                            isLoading={isLoading}
                            onToggleFavorite={toggleFavorite}
                            favorites={favorites}
                            onStartLiveMode={() => setIsLiveMode(true)}
                            onPropertyClick={handlePropertyClick}
                            selectedProperty={selectedProperty}
                            onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                            onNewChat={handleNewChat}
                            onInputFocus={() => {
                              if (aiPanelState === 'collapsed') setAiPanelState('half');
                            }}
                            isCollapsed={aiPanelState === 'collapsed'}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          <div className={`${selectedProperty ? 'lg:w-1/3' : 'flex-1'} flex flex-col min-h-0 min-w-0`}>
            {!selectedProperty && (
              <ChatInterface 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                isLoading={isLoading}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                onStartLiveMode={() => setIsLiveMode(true)}
                onPropertyClick={handlePropertyClick}
                selectedProperty={selectedProperty}
                onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
                onNewChat={handleNewChat}
                onScroll={handleLandingScroll}
              />
            )}
          </div>
       </div>

        {/* Enlarged Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && selectedProperty && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white border-b border-white/10">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black tracking-wider">{modalTitle}</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{selectedPropertyImageIndex + 1} / {modalImages.length}</span>
                  </div>
                  
                  {/* Action Buttons in Modal */}
                  <div className="hidden md:flex items-center gap-3">
                    <button 
                      onClick={handleCallProperty}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-base font-black uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <Phone size={16} />
                      Call
                    </button>
                    <button 
                      onClick={() => handleStartRentalProcess('tour')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-base font-black uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <Calendar size={16} />
                      Tour
                    </button>
                    <button 
                      onClick={() => handleStartRentalProcess('apply')}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-base font-black uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Apply
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                   {/* Mobile Action Buttons */}
                   <div className="flex md:hidden items-center gap-2">
                    <button onClick={handleCallProperty} className="p-2 bg-white/10 rounded-lg"><Phone size={16} /></button>
                    <button onClick={() => handleStartRentalProcess('tour')} className="p-2 bg-white/10 rounded-lg"><Calendar size={16} /></button>
                    <button onClick={() => handleStartRentalProcess('apply')} className="p-2 bg-emerald-500 rounded-lg"><FileText size={16} /></button>
                  </div>
                  <button 
                    onClick={() => setIsImageModalOpen(false)}
                    className="p-3 hover:bg-white/10 rounded-full transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden">
                <button 
                  onClick={() => setSelectedPropertyImageIndex(prev => (prev - 1 + modalImages.length) % modalImages.length)}
                  className="absolute left-4 md:left-8 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-10 border border-white/10"
                >
                  <ChevronLeft size={32} />
                </button>
                
                <div className="w-full h-full flex items-center justify-center">
                  <motion.img 
                    key={selectedPropertyImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={modalImages[selectedPropertyImageIndex]} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <button 
                  onClick={() => setSelectedPropertyImageIndex(prev => (prev + 1) % modalImages.length)}
                  className="absolute right-4 md:right-8 p-4 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-10 border border-white/10"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
              
              <div className="p-6 bg-black/40 backdrop-blur-md border-t border-white/10 overflow-x-auto flex gap-2 justify-center scrollbar-hide shrink-0">
                {modalImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedPropertyImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedPropertyImageIndex === idx ? 'border-emerald-500' : 'border-transparent opacity-40 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {showFavorites && (
          <FavoritesPage 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
            onPropertyClick={(property) => { setSelectedProperty(property); setShowFavorites(false); }}
            onClose={() => setShowFavorites(false)}
          />
        )}
    </div>
  );
};

export default App;