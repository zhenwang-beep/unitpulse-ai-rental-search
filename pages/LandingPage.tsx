import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PROPERTIES, SUGGESTION_CHIPS } from '../constants';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import LiveInterface from '../components/LiveInterface';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Search, AudioLines, ChevronDown, Loader2, Heart, LogOut, Menu, X, ArrowLeftRight, Calculator, Target, MessageSquare, Sparkles, Clock, FileText, Building, Settings, HelpCircle } from 'lucide-react';
import { ToastData } from '../components/Toast';

const PLACEHOLDER_PROMPTS = [
  "A modern loft in SoHo under $3000...",
  "2 bedroom apartment with a private garden...",
  "Pet-friendly home near Central Park...",
  "Quiet studio for a remote worker...",
  "Luxury penthouse with skyline views..."
];

const POPULAR_CITIES = [
  'All', 'Los Angeles', 'Seattle', 'Chicago', 'Houston', 'Irvine', 'New York'
];

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface LandingPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  setPendingFavoriteProperty,
  handleLogout,
  showToast,
}) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();

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

  const [landingInput, setLandingInput] = useState('');
  const [landingGhostText, setLandingGhostText] = useState('');
  const [isLandingFocused, setIsLandingFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [landingVisibleCount, setLandingVisibleCount] = useState(6);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const landingInputRef = useRef<HTMLTextAreaElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastScrollTarget, setLastScrollTarget] = useState<EventTarget | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen, setIsDropdownOpen]);

  const handleLandingScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    const target = e.currentTarget;
    const headerHeight = 100;

    setIsAtTop(currentScrollY < 20);

    const effectiveLastScrollY = lastScrollTarget === target ? lastScrollY : currentScrollY;

    if (currentScrollY < headerHeight) {
      setIsHeaderVisible(true);
    } else if (currentScrollY > effectiveLastScrollY + 5) {
      setIsHeaderVisible(false);
    } else if (currentScrollY < effectiveLastScrollY - 5) {
      setIsHeaderVisible(true);
    }

    setLastScrollY(currentScrollY);
    setLastScrollTarget(target);
  };

  // Rotate placeholders (pauses when focused)
  useEffect(() => {
    if (isLandingFocused) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isLandingFocused]);

  // Autocomplete logic for landing page
  useEffect(() => {
    const allSuggestions = [...PLACEHOLDER_PROMPTS, ...SUGGESTION_CHIPS.map(c => c.query)];

    if (landingInput && isLandingFocused) {
      const match = allSuggestions.find(s =>
        s.toLowerCase().startsWith(landingInput.toLowerCase()) &&
        s.toLowerCase() !== landingInput.toLowerCase()
      );

      if (match) {
        setLandingGhostText(match);
      } else {
        setLandingGhostText('');
      }
    } else {
      setLandingGhostText('');
    }
  }, [landingInput, isLandingFocused]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLandingVisibleCount((prev) => Math.min(prev + 3, MOCK_PROPERTIES.length));
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [landingVisibleCount]);

  const handleLandingSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!landingInput.trim()) return;
    navigate('/search', { state: { query: landingInput } });
    setLandingGhostText('');
  };

  const handleLandingInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLandingInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const handleLandingKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && landingGhostText) {
      e.preventDefault();
      setLandingInput(landingGhostText);
      setLandingGhostText('');
      setTimeout(() => {
        if (landingInputRef.current) {
          landingInputRef.current.style.height = 'auto';
          landingInputRef.current.style.height = `${Math.min(landingInputRef.current.scrollHeight, 200)}px`;
        }
      }, 0);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLandingSubmit();
    }
  };

  const hasLandingText = landingInput.trim().length > 0;

  const handleLiveMessage = () => {
    // Live messages are handled within LiveInterface; no-op here
  };

  return (
    <div
      className="h-[100dvh] w-full bg-[#FCF9F8] flex flex-col text-black font-sans overflow-y-auto scroll-smooth"
      onScroll={handleLandingScroll}
    >
      {/* Live Interface Overlay */}
      {isLiveMode && (
        <LiveInterface
          onClose={() => setIsLiveMode(false)}
          onMessage={() => {}}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
        />
      )}

      <header className={`w-full px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-[#FCF9F8]' : 'bg-white shadow-sm'}`}>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => {}}>
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
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
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
                        <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
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
                      <div className="w-12 h-12 rounded-full bg-[#4A5D23] text-white text-sm font-black flex items-center justify-center shadow-sm">FZ</div>
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
                    {isLoggedIn && (
                      <button
                        onClick={() => { navigate('/favorites'); setIsHistoryOpen(false); }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium w-full text-left"
                      >
                        <Heart size={20} className="text-neutral-400" />
                        Favorites
                        {favorites.length > 0 && (
                          <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
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
                        onClick={() => { handleLogout(); setIsHistoryOpen(false); }}
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

      <main className="flex-1 flex flex-col items-center px-4 relative w-full">
        <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 mt-12 lg:mt-[15vh] shrink-0">

          <h1 className="text-3xl md:text-5xl lg:text-7xl mb-8 leading-tight">
            <span className="font-heading font-extrabold text-black block mb-4 tracking-tight opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>Discover a sanctuary</span>
            <span className="font-sans font-light text-neutral-500 block text-xl md:text-3xl lg:text-4xl tracking-wide opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>tailored to your lifestyle.</span>
          </h1>

          <form onSubmit={handleLandingSubmit} className="w-full max-w-3xl relative group opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className={`transition-all duration-500 rounded-3xl border-2 ${isLandingFocused ? 'shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-[#4A5D23]' : 'shadow-[0_10px_20px_rgba(0,0,0,0.05)] border-transparent'}`}>
              <div className="relative bg-white rounded-3xl pl-6 p-2 pr-4 flex items-end gap-2 overflow-hidden min-h-[4rem] z-10">
                <div className="flex-1 relative flex items-start min-w-0 py-3">
                  {/* Rotating Placeholder */}
                  {!landingInput && (
                    <div className="absolute inset-0 flex items-start pt-3 pointer-events-none">
                      <span
                        key={placeholderIndex}
                        className="text-neutral-400 text-lg animate-fade-in-up truncate w-full text-left font-sans leading-normal tracking-normal"
                      >
                        {PLACEHOLDER_PROMPTS[placeholderIndex]}
                      </span>
                    </div>
                  )}

                  {/* Ghost Text Overlay */}
                  {landingGhostText && isLandingFocused && (
                    <div className="absolute inset-0 px-2 pointer-events-none flex items-start pt-3">
                      <div className="w-full flex">
                        <span className="text-lg opacity-0 whitespace-pre-wrap font-sans leading-normal tracking-normal break-words">{landingInput}</span>
                        <span className="text-neutral-400/40 whitespace-pre-wrap break-words font-sans text-lg leading-normal tracking-normal">{landingGhostText.slice(landingInput.length)}</span>
                      </div>
                    </div>
                  )}

                  <textarea
                    ref={landingInputRef}
                    value={landingInput}
                    onChange={handleLandingInput}
                    onFocus={() => setIsLandingFocused(true)}
                    onBlur={() => setIsLandingFocused(false)}
                    onKeyDown={handleLandingKeyDown}
                    placeholder=""
                    rows={1}
                    className="flex-1 bg-transparent border-0 p-0 text-black focus:ring-0 focus:outline-none text-lg min-w-0 w-full relative z-10 resize-none overflow-hidden leading-normal font-sans self-start tracking-normal"
                    style={{ maxHeight: '200px' }}
                  />
                </div>

                {/* Combined Action Button */}
                <button
                  type={hasLandingText ? "submit" : "button"}
                  onClick={(e) => {
                    if (!hasLandingText) {
                      e.preventDefault();
                      setIsLiveMode(true);
                    }
                  }}
                  className={`h-10 w-10 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center shrink-0 z-10 mb-1.5 ${
                    hasLandingText
                      ? 'bg-[#4A5D23] text-white hover:bg-[#3a4e1a]'
                      : 'bg-[#4A5D23] text-white hover:bg-[#3a4e1a]'
                  }`}
                >
                  {hasLandingText ? <ArrowRight size={20} /> : <AudioLines size={20} />}
                </button>
              </div>
            </div>
          </form>

          <div className="w-full overflow-x-auto scrollbar-hide px-4">
            <div className="flex justify-start md:justify-center gap-3 mt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              {SUGGESTION_CHIPS.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => navigate('/search', { state: { query: chip.query } })}
                  className="group relative flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-md border border-black/5 rounded-2xl hover:bg-[#4A5D23] hover:text-white transition-all duration-500 hover:shadow-2xl hover:shadow-[#4A5D23]/20 hover:-translate-y-1 shrink-0"
                >
                  <div className="w-8 h-8 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-sm border border-black/5">
                    <img src={chip.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-xs font-black capitalize tracking-wider whitespace-nowrap">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 px-4 animate-fade-in pb-20" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center mt-12 mb-0">
            <span className="text-xs font-bold tracking-wider uppercase mb-6 text-neutral-400">Explore</span>

            {/* City Filters */}
            <div className="w-full overflow-x-auto scrollbar-hide px-4">
              <div className="flex justify-start md:justify-center gap-2 mb-8">
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all border shrink-0 ${
                      selectedCity === city
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-500 border-black/10 hover:border-black hover:text-black'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PROPERTIES
              .filter(p => selectedCity === 'All' || p.location === selectedCity)
              .slice(0, landingVisibleCount).map((p, i) => (
              <div key={p.id} className={`transform transition-all duration-700 animate-fade-in-up`}>
                <PropertyCard
                  property={p}
                  isFavorite={favorites.some(f => f.id === p.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={(property: Property) => navigate('/search', { state: { propertyId: property.id } })}
                />
              </div>
            ))}
          </div>

          {landingVisibleCount < MOCK_PROPERTIES.length && (
            <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center mt-10">
              <Loader2 className="animate-spin text-neutral-300" size={24} />
            </div>
          )}
        </div>

        {/* AI Capabilities Section */}
        <div className="w-full max-w-6xl mx-auto mt-24 px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              AI Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-black">
              What AI does for you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-black/5 hover:border-[#4A5D23]/20 hover:shadow-2xl hover:shadow-[#4A5D23]/5 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
              <div className="w-14 h-14 rounded-2xl bg-[#FCF9F8] border border-black/5 flex items-center justify-center text-[#4A5D23] mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <ArrowLeftRight size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Compare listings side by side</h3>
              <p className="text-neutral-500 leading-relaxed">
                Instantly evaluate multiple properties, weighing pros and cons to make an informed decision without the spreadsheet.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-black/5 hover:border-[#4A5D23]/20 hover:shadow-2xl hover:shadow-[#4A5D23]/5 transition-all duration-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
              <div className="w-14 h-14 rounded-2xl bg-[#FCF9F8] border border-black/5 flex items-center justify-center text-[#4A5D23] mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Break down total monthly cost</h3>
              <p className="text-neutral-500 leading-relaxed">
                Get full transparency on rent, utilities, parking, and hidden fees so you know exactly what you'll pay.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-[2rem] bg-white border border-black/5 hover:border-[#4A5D23]/20 hover:shadow-2xl hover:shadow-[#4A5D23]/5 transition-all duration-500 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-150" />
              <div className="w-14 h-14 rounded-2xl bg-[#FCF9F8] border border-black/5 flex items-center justify-center text-[#4A5D23] mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Recommend best-fit units</h3>
              <p className="text-neutral-500 leading-relaxed">
                Our AI learns your lifestyle preferences and automatically surfaces the homes that match your unique needs.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-8 rounded-[2rem] bg-[#4A5D23] border border-[#4A5D23] hover:shadow-2xl hover:shadow-[#4A5D23]/20 transition-all duration-500 relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500 backdrop-blur-md">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Answer questions about policies, fees, and amenities</h3>
              <p className="text-white/70 leading-relaxed">
                Skip the leasing office hold music. Ask anything 24/7 and get instant, accurate answers about the property.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="w-full max-w-6xl mx-auto mt-16 px-4 py-16 border-t border-black/5">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="md:w-1/3 shrink-0">
              <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-black mb-6">
                Common <br className="hidden md:block" /><span style={{ color: '#4A5D23' }}>Questions</span>
              </h2>
              <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-sm">
                Everything you need to know about the product and how it works. Can't find an answer? Just ask our AI assistant.
              </p>
            </div>
            <div className="md:w-2/3 flex flex-col">
              {[
                { q: "How does UnitPulse work?", a: "UnitPulse uses AI to analyze your style, budget, and lifestyle preferences to find the perfect rental home. Instead of endless scrolling, you simply chat with our assistant to get curated, highly-matched properties." },
                { q: "Is it free to use?", a: "Yes, UnitPulse is completely free for renters. We partner directly with property managers and landlords to bring you the most accurate listings without any hidden search fees." },
                { q: "What cities do you cover?", a: "We currently cover major metropolitan areas across the US, including New York, Los Angeles, Chicago, and Austin. We are constantly expanding our network and adding new markets regularly." }
              ].map((item, i) => (
                <div key={i} className="py-8 border-b border-black/10 first:pt-0 last:border-0 group">
                  <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-[#4A5D23] transition-colors tracking-tight">{item.q}</h3>
                  <p className="text-neutral-600 text-base leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-[calc(100%+2rem)] -mx-4 py-16 md:py-20 bg-[#F0EDEA] mt-16">
          <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <img src={LOGO_URL} alt="UnitPulse" className="h-5" />
                  <span className="font-heading font-bold text-lg tracking-wider">UnitPulse</span>
                </div>
                <p className="text-sm text-neutral-600 mb-3 font-semibold">AI-powered rental operations for modern landlords.</p>
                <p className="text-sm text-neutral-500 mb-8 leading-relaxed">UnitPulse helps landlords and property managers streamline leasing with AI. From listing optimization to tenant engagement and application workflows, we turn rental operations into a faster, smarter, and more data-driven experience.</p>
                <a href="#" className="inline-flex items-center gap-2 font-bold text-black hover:text-[#4A5D23] hover:underline text-sm transition-colors">
                  Start using AI to power your rental business →
                </a>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Resources</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">API Docs</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Company</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Legal</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-sm text-neutral-400">© 2026 UnitPulse. All rights reserved.</p>
              <p className="text-xs text-neutral-400">AI-powered rental search</p>
            </div>
          </div>
        </footer>
      </main>

    </div>
  );
};

export default LandingPage;
