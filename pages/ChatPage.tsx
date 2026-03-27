import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigate, Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import { MOCK_PROPERTIES, SUGGESTION_CHIPS } from '../constants';
import { Property, ChatMessage, SearchFilters } from '../types';
import PropertyCard from '../components/PropertyCard';
import ChatInterface, { RichMediaCanvas } from '../components/ChatInterface';
import LiveInterface from '../components/LiveInterface';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { sendMessageToGemini } from '../services/geminiService';
import { getFilteredProperties } from '../services/propertyService';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Search, Sun, TreePine, Music, PanelRightClose, PanelRightOpen, ChevronDown, RotateCcw, Loader2, AudioLines, MapPin, X, ShieldCheck, Heart, Bed, Bath, Ruler, Calendar, Phone, Sparkles, CheckCircle2, Zap, ChevronLeft, ChevronRight, Info, PenTool, FileText, Check, Menu, LogOut, User, ArrowLeftRight, Calculator, Target, MessageSquare, Clock, Building, Settings, HelpCircle, Eye, EyeOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface ChatPageProps {
  isLoggedIn: boolean;
  setShowLoginView: (v: boolean) => void;
  setShowFavorites: (v: boolean) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ isLoggedIn, setShowLoginView, setShowFavorites }) => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isPropertyPanelOpen = !!useMatch('/search/:chatId/property/:propertyId');

  const { allThreads, updateThread, favorites, toggleFavorite } = useAppContext();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messages = allThreads[chatId!]?.messages || [];

  const setMessages = (newMessages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
    updateThread(chatId!, (prev) => {
      return typeof newMessages === 'function' ? newMessages(prev) : newMessages;
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
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
  }, [isPropertyPanelOpen]);

  const [selectedPropertyImageIndex, setSelectedPropertyImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  const [expandedFloorPlan, setExpandedFloorPlan] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const lastTriggered = useRef<Record<string, boolean>>({});

  // Chat view scroll state (header hide/show)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const handleLandingScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    setIsAtTop(currentScrollY < 20);
    setIsHeaderVisible(true);
  };

  const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

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
    const response = await sendMessageToGemini(text, history, null);

    setIsLoading(false);

    if (response) {
      let results: Property[] = [];

      const shouldSearch = response.intentToSearch !== false;

      if (shouldSearch) {
        const newFilters = { ...currentFilters, ...response.filters };
        setCurrentFilters(newFilters);
        results = getFilteredProperties(newFilters);
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
        styleSummary: response.styleSummary
      };
      setMessages(prev => [...prev, aiMsg]);
    }
  };

  const hasSentInitialQuery = useRef(false);
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

  const handleNewChat = () => {
    navigate('/search');
  };

  const handleSwitchThread = (id: string) => {
    navigate('/search/' + id);
    setIsHistoryOpen(false);
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
      interactiveType: type === 'tour' ? 'contract' : 'application-form',
      interactiveData: undefined,
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
    <div className="flex flex-col h-[100dvh] w-full bg-[#FCF9F8] font-sans text-black overflow-hidden">
       {/* Live Interface Overlay */}
       {isLiveMode && (
         <LiveInterface
           onClose={() => setIsLiveMode(false)}
           onMessage={handleLiveMessage}
           onToggleFavorite={toggleFavorite}
           favorites={favorites}
         />
       )}

       {!isPropertyPanelOpen && (
        <header className={`fixed top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-[60] transition-all duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-[#FCF9F8]' : 'bg-white shadow-sm'}`}>
          <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
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
                       onClick={() => { setIsHistoryOpen(false); }}
                       className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium w-full text-left"
                     >
                       <LogOut size={20} className="text-red-400" />
                       Logout
                     </button>
                   </>
                 )}
               </div>

               {/* Thread history list */}
               <div className="p-4 flex flex-col gap-2">
                 <button
                   onClick={handleNewChat}
                   className="flex items-center gap-2 p-3 rounded-xl bg-black text-white hover:bg-neutral-800 transition-colors font-medium text-sm"
                 >
                   <MessageSquare size={16} />
                   New Chat
                 </button>
                 {Object.entries(allThreads).map(([id, thread]) => (
                   <button
                     key={id}
                     onClick={() => handleSwitchThread(id)}
                     className={`flex items-center gap-2 p-3 rounded-xl transition-colors font-medium text-sm text-left ${id === chatId ? 'bg-neutral-100 text-black' : 'hover:bg-neutral-50 text-neutral-700'}`}
                   >
                     <MessageSquare size={16} className="text-neutral-400 shrink-0" />
                     <span className="truncate">{thread.title || 'Chat'}</span>
                   </button>
                 ))}
               </div>
             </div>
            </motion.div>
           </>
         )}
       </AnimatePresence>

       <div className={`flex-1 flex min-h-0 relative transition-all duration-300 w-full pt-16 md:pt-20`}>
          {/* Chat interface — always visible; narrows on desktop when property panel is open */}
          <div className={`${isPropertyPanelOpen ? 'hidden lg:flex lg:w-[40%]' : 'flex-1'} flex flex-col min-h-0 min-w-0`}>
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
              onStartLiveMode={() => setIsLiveMode(true)}
              onPropertyClick={handlePropertyClick}
              selectedProperty={null}
              onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
              onNewChat={handleNewChat}
              onScroll={handleLandingScroll}
            />
          </div>

          {/* Property panel — mobile: full-screen overlay; desktop: right column */}
          {isPropertyPanelOpen && (
            <div className="fixed inset-0 z-[50] lg:static lg:flex-1 lg:h-full overflow-hidden lg:border-l lg:border-black/5">
              <Outlet />
            </div>
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
                    <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">{selectedPropertyImageIndex + 1} / {modalImages.length}</span>
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
