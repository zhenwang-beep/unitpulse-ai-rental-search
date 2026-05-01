import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate, Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import { SUGGESTION_CHIPS } from '../constants';
import { Property, ChatMessage, SearchFilters } from '../types';
import PropertyCard from '../components/PropertyCard';
import ChatInterface, { RichMediaCanvas } from '../components/ChatInterface';
import LiveInterface from '../components/LiveInterface';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { sendMessageToGemini } from '../services/geminiService';
import { getFilteredProperties, getAllProperties } from '../services/propertyService';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import { ArrowRight, Search, Sun, TreePine, Music, PanelRightClose, PanelRightOpen, ChevronDown, RotateCcw, Loader2, AudioLines, MapPin, X, ShieldCheck, Heart, Bed, Bath, Ruler, Calendar, Phone, Sparkles, CheckCircle2, Zap, ChevronLeft, ChevronRight, Info, PenTool, FileText, Check, Menu, LogOut, User, ArrowLeftRight, Calculator, Target, Clock, Building, Settings, HelpCircle, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ChatPageProps {
  isLoggedIn: boolean;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ isLoggedIn, setShowLoginView, setPendingFavoriteProperty, handleLogout, showToast }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isPropertyPanelOpen = !!useMatch('/search/:chatId/property/:propertyId');

  const { allThreads, updateThread, favorites, toggleFavorite, renameThread, deleteThread, addThread, userPreferences, addPreferences, removePreference } = useAppContext();

  const handleResetChat = () => {
    deleteThread(chatId!);
    addThread(chatId!, 'UnitPulse');
  };

  const handleToggleFavorite = (property: Property) => {
    if (!isLoggedIn) {
      setPendingFavoriteProperty(property);
      setShowLoginView(true);
      return;
    }
    const adding = !favorites.some(f => f.id === property.id);
    toggleFavorite(property);
    if (adding) {
      showToast({
        message: 'Added to Favorites',
        actionLabel: 'View Favorites →',
        onAction: () => navigate('/favorites'),
      });
    }
  };

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messages = allThreads[chatId!]?.messages || [];

  const setMessages = (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    updateThread(chatId!, (prev) => {
      return typeof newMessages === 'function' ? newMessages(prev) : newMessages;
    });
  };

  const [allDbProperties, setAllDbProperties] = useState<Property[]>([]);
  useEffect(() => {
    getAllProperties().then(setAllDbProperties).catch(console.error);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [isLiveMode, setIsLiveMode] = useState(false);

  const [signedPropertyId, setSignedPropertyId] = useState<string | null>(null);
  const [hasIntelligencePermission, setHasIntelligencePermission] = useState(false);
  const [recommendationStep, setRecommendationStep] = useState<'initial' | 'analyzing' | 'confirming' | 'recommending'>('initial');
  const [exampleLinks, setExampleLinks] = useState('');
  const [summarizedPreference, setSummarizedPreference] = useState('You love modern lofts with high ceilings, industrial accents, and plenty of natural light. You prefer open floor plans and floor-to-ceiling windows.');
  const [isEditingPreference, setIsEditingPreference] = useState(false);
  const [isAiExpanded, setIsAiExpanded] = useState(false);
  const [mobileTab, setMobileTab] = useState<'listing' | 'chat'>('listing');
  const [aiPanelState, setAiPanelState] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isMatchPopoverOpen, setIsMatchPopoverOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isPropertyScrolled, setIsPropertyScrolled] = useState(false);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Resizable split panel
  const [chatPanelWidth, setChatPanelWidth] = useState(40); // percentage
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  const handleDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const newChatWidth = ((rect.right - e.clientX) / rect.width) * 100;
      setChatPanelWidth(Math.min(Math.max(newChatWidth, 25), 55));
    };
    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        setIsResizing(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Reset collapse + mobile tab when panel opens/closes
  useEffect(() => {
    if (!isPropertyPanelOpen) {
      setIsChatCollapsed(false);
    } else {
      setMobileTab('listing');
    }
  }, [isPropertyPanelOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsAtBottom(entry.isIntersecting),
      { threshold: 0 }
    );
    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [isPropertyPanelOpen]);

  const [selectedPropertyImageIndex, setSelectedPropertyImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  const [expandedFloorPlan, setExpandedFloorPlan] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastTriggered = useRef<Record<string, boolean>>({});

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  // Chat view scroll state (header hide/show)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleLandingScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    setIsAtTop(currentScrollY < 20);
    setIsHeaderVisible(true);
  };

  const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

  const handleStop = () => {
    abortRef.current?.abort();
    setIsLoading(false);
  };

  // Add an AI-authored message (e.g. preference prompt) without triggering a real API call
  const handleAiPrompt = (text: string, suggestedReplies?: string[]) => {
    const aiMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      text,
      timestamp: Date.now(),
      suggestedReplies,
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  const handleSendMessage = async (text: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);

    const history = messages.slice(-6).map(m => ({ role: m.role, text: m.text }));
    const response = await sendMessageToGemini(text, history, null, controller.signal, allDbProperties);

    if (controller.signal.aborted) return;
    setIsLoading(false);

    if (response) {
      let results: Property[] = [];

      const shouldSearch = response.intentToSearch !== false;

      if (shouldSearch) {
        const newFilters = { ...currentFilters, ...response.filters };
        setCurrentFilters(newFilters);
        results = await getFilteredProperties(newFilters);
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
        interactiveData: (response.interactiveType === 'deep-dive' || response.interactiveType === 'contract' || response.interactiveType === 'application-form') ? undefined : undefined,
        styleTitle: response.styleTitle,
        styleAvatar: response.styleAvatar,
        styleSummary: response.styleSummary,
        sources: response.sources,
        extractedPreferences: response.extractedPreferences
      };
      setMessages(prev => [...prev, aiMsg]);

      // Accumulate extracted preferences
      if (response.extractedPreferences && response.extractedPreferences.length > 0) {
        addPreferences(response.extractedPreferences);
      }
    }

    // Auto-title thread from first user message
    if (messages.length === 0) {
      const rawTitle = text.trim();
      const title = rawTitle.length > 45 ? rawTitle.slice(0, 45).trimEnd() + '…' : rawTitle;
      renameThread(chatId!, title);
    }
  };

  const hasSentInitialQuery = useRef(false);
  const bubbleWasDragged = useRef(false);
  useEffect(() => {
    if (hasSentInitialQuery.current) return;
    const initialQuery = (location.state as { query?: string } | null)?.query;
    if (initialQuery && (allThreads[chatId!]?.messages.length ?? 0) === 0) {
      hasSentInitialQuery.current = true;
      handleSendMessage(initialQuery);
    }
  }, []); // run once on mount

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


  const handleStartRentalProcess = (type: 'tour' | 'apply') => {
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
        ? `Great! I've started the tour scheduling process. Please confirm your preferred date and time below.`
        : `Excellent choice! I've initiated the application process. Let's get your details ready.`,
      timestamp: Date.now() + 1,
      interactiveType: type === 'tour' ? 'tour-scheduling' : 'application-form',
      interactiveData: type === 'tour' ? { propertyName: 'this property' } : undefined,
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

  const handlePropertyClick = (property: Property) => {
    navigate('./property/' + property.id);
    setMobileTab('listing');
  };

  const handleAnalyzeStyle = () => {
    if (!exampleLinks.trim()) return;
    handleSendMessage(`Analyze my style from these links: ${exampleLinks}`);
    setExampleLinks('');
  };

  // Guard: redirect if thread doesn't exist (must be after all hooks)
  if (!allThreads[chatId!]) return <Navigate to="/" replace />;

  // --- CHAT VIEW (Main Interface) ---
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-app-bg font-sans text-black overflow-hidden">
       {/* Live Interface Overlay */}
       {isLiveMode && (
         <LiveInterface
           onClose={() => setIsLiveMode(false)}
           onMessage={handleLiveMessage}
           onToggleFavorite={handleToggleFavorite}
           favorites={favorites}
         />
       )}

       <header className={`fixed top-0 left-0 right-0 px-4 md:px-8 py-4 flex justify-between items-center z-[60] transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isPropertyPanelOpen ? 'bg-white border-b border-black/10' : isAtTop ? 'bg-app-bg' : 'bg-white shadow-sm'}`}>
          <div className="w-full flex justify-between items-center">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
               <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
               <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
              <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <div
                    className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="w-full h-full bg-brand text-white text-xs font-black flex items-center justify-center">FZ</span>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                      <button
                        onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                      >
                        <Heart size={16} />
                        Favorites
                        {favorites.length > 0 && (
                          <span className="ml-auto w-5 h-5 bg-brand text-white text-[10px] font-black rounded-full flex items-center justify-center">
                            {favorites.length}
                          </span>
                        )}
                      </button>
                      <button
                        onClick={() => { handleLogout(); setIsDropdownOpen(false); }}
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
                  className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-hover transition-all"
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
             initial={{ x: '100%' }}
             animate={{ x: 0 }}
             exit={{ x: '100%' }}
             transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
             className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[70] border-l border-black/5 flex flex-col"
           >
             <div className="px-4 py-3 border-b border-black/5 flex justify-between items-center">
               <span className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Menu</span>
               <button onClick={() => setIsHistoryOpen(false)} aria-label="Close menu" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                 <X size={20} />
               </button>
             </div>

             <div className="flex-1 overflow-y-auto flex flex-col">
               <div className="p-5 flex flex-col gap-5">
                 {isLoggedIn ? (
                   <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-black/5">
                     <div className="w-12 h-12 rounded-full bg-brand text-white text-sm font-black flex items-center justify-center shadow-sm">FZ</div>
                     <div className="flex flex-col">
                       <span className="text-sm font-bold text-neutral-900">Felix Zhou</span>
                       <span className="text-xs font-medium text-neutral-500">felix.zhou@gmail.com</span>
                     </div>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3">
                     <h3 className="text-lg font-bold text-neutral-900">Welcome to UnitPulse</h3>
                     <p className="text-sm text-neutral-500">Sign in to save your favorite homes and track applications.</p>
                     <button
                       onClick={() => { setShowLoginView(true); setIsHistoryOpen(false); }}
                       className="w-full py-3 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand-hover transition-all"
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
                   {isLoggedIn && (
                     <button
                       onClick={() => { navigate('/favorites'); setIsHistoryOpen(false); }}
                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium w-full text-left"
                     >
                       <Heart size={20} className="text-neutral-400" />
                       Saved Homes
                       {favorites.length > 0 && (
                         <span className="ml-auto w-5 h-5 bg-brand text-white text-[10px] font-black rounded-full flex items-center justify-center">
                           {favorites.length}
                         </span>
                       )}
                     </button>
                   )}
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <Clock size={20} className="text-neutral-400" />
                     Recently Viewed
                   </a>
                   <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                     <FileText size={20} className="text-neutral-400" />
                     Applications
                   </a>
                 </div>

                 <div className="h-px bg-neutral-100 w-full" />

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
                     <div className="h-px bg-neutral-100 w-full" />
                     <button
                       onClick={() => { setIsHistoryOpen(false); }}
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

       {/* Mobile tab bar — below app header, only when property panel is open */}
       {isPropertyPanelOpen && !isDesktop && (
         <div className="fixed top-[69px] inset-x-0 z-[58] bg-white border-b border-black/10 flex">
           <button
             onClick={() => setMobileTab('listing')}
             className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === 'listing' ? 'text-black border-b-2 border-brand' : 'text-neutral-400'}`}
           >
             Listing
           </button>
           <button
             onClick={() => setMobileTab('chat')}
             className={`flex-1 py-3 text-sm font-semibold transition-colors ${mobileTab === 'chat' ? 'text-black border-b-2 border-brand' : 'text-neutral-400'}`}
           >
             Chat
           </button>
         </div>
       )}

       <div ref={splitContainerRef} className={`flex-1 flex min-h-0 relative w-full ${!isDesktop && isPropertyPanelOpen ? 'pt-[116px]' : 'pt-[72px]'} overflow-hidden`}>
          {/* Property panel — LEFT side (desktop: dynamic width, mobile: full screen) */}
          <AnimatePresence>
            {isPropertyPanelOpen && (
              <motion.div
                key="property-panel"
                initial={{ width: isDesktop ? 0 : '100%', opacity: 0 }}
                animate={{ width: isDesktop ? (isChatCollapsed ? '100%' : `${100 - chatPanelWidth}%`) : '100%', opacity: 1 }}
                exit={{ width: isDesktop ? 0 : '100%', opacity: 0 }}
                transition={isResizing ? { duration: 0 } : { duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
                style={{ display: !isDesktop && mobileTab !== 'listing' ? 'none' : undefined }}
                className="fixed inset-x-0 top-[116px] bottom-0 z-[50] lg:static lg:flex lg:top-0 lg:h-full overflow-hidden shrink-0"
              >
                <div className="w-full h-full overflow-hidden">
                  <Outlet context={{ isLoggedIn, setShowLoginView }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resize divider — desktop only, visible when panel open and not collapsed */}
          {isPropertyPanelOpen && !isChatCollapsed && (
            <div
              onMouseDown={handleDividerMouseDown}
              className="hidden lg:flex w-1 shrink-0 flex-col items-center justify-center cursor-col-resize select-none relative z-[55] group border-l border-black/10 hover:border-brand/30 hover:bg-brand/5 transition-colors"
            >
              {/* Drag pill — appears on hover */}
              <div className="w-[3px] h-8 rounded-full bg-transparent group-hover:bg-brand/40 transition-all duration-150" />
              {/* Collapse button — positioned at the right edge of the chat panel */}
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={() => setIsChatCollapsed(true)}
                title="Collapse chat"
                className="fixed top-20 right-5 z-[61] w-9 h-9 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
              >
                <PanelRightClose size={12} />
              </button>
            </div>
          )}

          {/* Chat panel — RIGHT side */}
          <div
            className="flex-col min-h-0 min-w-0 isolate"
            style={isPropertyPanelOpen
              ? {
                  width: isDesktop ? `${chatPanelWidth}%` : '100%',
                  flexShrink: 0,
                  flexGrow: 0,
                  display: isDesktop
                    ? (isChatCollapsed ? 'none' : 'flex')
                    : (mobileTab === 'chat' ? 'flex' : 'none'),
                }
              : { flex: 1, display: 'flex' }
            }
          >
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleFavorite={handleToggleFavorite}
              favorites={favorites}
              onStartLiveMode={() => setIsLiveMode(true)}
              onPropertyClick={handlePropertyClick}
              selectedProperty={null}
              onScroll={handleLandingScroll}
              isLoggedIn={isLoggedIn}
              onResetChat={handleResetChat}
              onStop={handleStop}
              userPreferences={userPreferences}
              onRemovePreference={removePreference}
              onAiPrompt={handleAiPrompt}
              onPreferenceLoginPrompt={() => setShowLoginView(true)}
            />
          </div>

          {/* Re-open chat — draggable agent avatar bubble, pinned to right edge */}
          {isPropertyPanelOpen && isChatCollapsed && (
            <motion.button
              drag="y"
              dragConstraints={{ top: -500, bottom: 200 }}
              dragElastic={0.08}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.y) > 4) bubbleWasDragged.current = true;
              }}
              onClick={() => {
                if (bubbleWasDragged.current) { bubbleWasDragged.current = false; return; }
                setIsChatCollapsed(false);
              }}
              title="Chat with UnitPulse"
              className="hidden lg:flex fixed right-5 bottom-28 z-[80] flex-col items-center gap-1 group cursor-grab active:cursor-grabbing touch-none"
              whileDrag={{ scale: 1.08 }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-xl bg-brand flex items-center justify-center text-white text-sm font-black group-hover:scale-105 transition-transform">
                  U
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <span className="text-[11px] font-semibold text-neutral-600 bg-white/90 px-2 py-0.5 rounded-full shadow-sm select-none">Chat</span>
            </motion.button>
          )}
       </div>

        {/* Enlarged Image Modal */}
        <AnimatePresence>
          {isImageModalOpen && (
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
                    <span className="text-xs font-bold opacity-60 uppercase tracking-wider">{selectedPropertyImageIndex + 1} / {modalImages.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
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
    </div>
  );
};

export default ChatPage;
