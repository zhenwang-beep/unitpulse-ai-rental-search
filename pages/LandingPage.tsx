import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SUGGESTION_CHIPS } from '../constants';
import { getAllProperties } from '../services/propertyService';
import { Property } from '../types';
import PropertyCard from '../components/PropertyCard';
import LiveInterface from '../components/LiveInterface';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Search, AudioLines, ChevronDown, ChevronLeft, ChevronRight, ArrowLeftRight, Calculator, Target, MessageSquare, Sparkles } from 'lucide-react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';

const PLACEHOLDER_PROMPTS = [
  "A modern loft in SoHo under $3000...",
  "2 bedroom apartment with a private garden...",
  "Pet-friendly home near Central Park...",
  "Quiet studio for a remote worker...",
  "Luxury penthouse with skyline views..."
];

const ALL_DROPDOWN_SUGGESTIONS = [
  "A modern loft in SoHo under $3000",
  "2 bedroom apartment with a private garden",
  "Pet-friendly home near Central Park",
  "Quiet studio for a remote worker",
  "Luxury penthouse with skyline views",
  "Find me a modern loft with high ceilings and an open floor plan",
  "I want a home with a private garden or a large backyard",
  "Show me pet-friendly apartments with nearby parks",
  "Looking for a high-floor unit with panoramic city skyline views",
  "1 bedroom apartment in Los Angeles under $2000",
  "Studio apartment near downtown with gym access",
  "2-bedroom with in-unit laundry and parking",
  "Affordable apartment for students in Chicago",
  "Spacious condo with ocean views in Seattle",
  "Dog-friendly apartment with a yard in Seattle",
  "Modern apartment with rooftop access in New York",
  "Short-term furnished rental in San Francisco",
  "Cozy 1-bedroom near good coffee shops",
  "Apartment with a home office and fast internet",
  "Family-friendly home near top-rated schools",
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

  const [landingProperties, setLandingProperties] = useState<Property[]>([]);
  useEffect(() => {
    getAllProperties().then(setLandingProperties).catch(console.error);
  }, []);

  const [landingInput, setLandingInput] = useState('');
  const [landingGhostText, setLandingGhostText] = useState('');
  const [isLandingFocused, setIsLandingFocused] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const [dropdownIndex, setDropdownIndex] = useState(-1);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const landingInputRef = useRef<HTMLTextAreaElement>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastScrollTarget, setLastScrollTarget] = useState<EventTarget | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [selectedCity, setSelectedCity] = useState('All');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const cityScrollRef = useRef<HTMLDivElement>(null);
  const [cityScrollState, setCityScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsHistoryOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const dropdownSuggestions = useMemo(() => {
    if (!landingInput.trim() || !isLandingFocused) return [];
    const q = landingInput.toLowerCase();
    return ALL_DROPDOWN_SUGGESTIONS
      .filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q)
      .slice(0, 6);
  }, [landingInput, isLandingFocused]);

  useEffect(() => { setDropdownIndex(-1); }, [landingInput]);

  const updateCityScroll = () => {
    const el = cityScrollRef.current;
    if (!el) return;
    setCityScrollState({
      canScrollLeft: el.scrollLeft > 2,
      canScrollRight: el.scrollLeft < el.scrollWidth - el.clientWidth - 2,
    });
  };

  useEffect(() => {
    updateCityScroll();
    const el = cityScrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateCityScroll, { passive: true });
    window.addEventListener('resize', updateCityScroll);
    return () => {
      el.removeEventListener('scroll', updateCityScroll);
      window.removeEventListener('resize', updateCityScroll);
    };
  }, []);

  const scrollCityChips = (dir: 'left' | 'right') => {
    const el = cityScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' });
  };

  const handleLandingSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!landingInput.trim()) return;
    navigate('/search', { state: { query: landingInput } });
    setLandingGhostText('');
  };

  const handleLandingInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLandingInput(e.target.value);
    e.target.style.height = 'auto';
    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
    setIsMultiline(newHeight > 36);
  };

  const handleLandingKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Dropdown navigation
    if (dropdownSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setDropdownIndex(i => Math.min(i + 1, dropdownSuggestions.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setDropdownIndex(i => Math.max(i - 1, -1));
        return;
      }
      if (e.key === 'Escape') {
        setDropdownIndex(-1);
        setIsLandingFocused(false);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && dropdownIndex >= 0) {
        e.preventDefault();
        navigate('/search', { state: { query: dropdownSuggestions[dropdownIndex] } });
        return;
      }
    }

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
      ref={scrollContainerRef}
      className="h-[100dvh] w-full bg-surface-app flex flex-col text-black font-sans overflow-y-auto scroll-smooth"
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

      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-scroll"
        scrollY={lastScrollY}
      />

      <main className="flex-1 flex flex-col items-center relative w-full">
        <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 mt-12 lg:mt-[15vh] shrink-0 px-4">

          <h1 className="text-3xl md:text-5xl lg:text-7xl mb-8 leading-tight">
            <span className="font-heading font-extrabold text-black block mb-4 tracking-tight opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>Discover a sanctuary</span>
            <span className="font-sans font-light text-neutral-500 block text-xl md:text-3xl lg:text-4xl tracking-wide opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>tailored to your lifestyle.</span>
          </h1>

          <form onSubmit={handleLandingSubmit} className="w-full max-w-3xl relative group opacity-0 animate-fade-in-up z-10" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <div className={`border-2 ${isLandingFocused ? 'shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-brand' : 'shadow-[0_10px_20px_rgba(0,0,0,0.05)] border-transparent'}`} style={{ borderRadius: isMultiline ? 16 : 9999, transition: 'border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s, border-color 0.3s' }}>
              <div className={`relative bg-white pl-6 p-2 pr-4 flex gap-2 overflow-hidden z-10 ${isMultiline ? 'items-end' : 'items-center'}`} style={{ borderRadius: isMultiline ? 14 : 9999, transition: 'border-radius 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div className={`flex-1 relative flex items-center min-w-0 ${isMultiline ? 'py-3' : 'py-2'}`}>
                  {/* Rotating Placeholder */}
                  {!landingInput && (
                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <span
                        key={placeholderIndex}
                        className="text-neutral-400 text-sm md:text-lg animate-fade-in-up truncate w-full text-left font-sans leading-normal tracking-normal"
                      >
                        {PLACEHOLDER_PROMPTS[placeholderIndex]}
                      </span>
                    </div>
                  )}

                  {/* Ghost Text Overlay */}
                  {landingGhostText && isLandingFocused && (
                    <div className="absolute inset-0 pointer-events-none flex items-center overflow-hidden">
                      <div className="w-full flex overflow-hidden">
                        <span className="text-sm md:text-lg opacity-0 whitespace-pre font-sans leading-normal tracking-normal shrink-0">{landingInput}</span>
                        <span className="text-neutral-400/40 whitespace-pre font-sans text-sm md:text-lg leading-normal tracking-normal truncate">{landingGhostText.slice(landingInput.length)}</span>
                      </div>
                    </div>
                  )}

                  <textarea
                    ref={landingInputRef}
                    value={landingInput}
                    onChange={handleLandingInput}
                    onFocus={() => setIsLandingFocused(true)}
                    onBlur={() => setTimeout(() => setIsLandingFocused(false), 150)}
                    onKeyDown={handleLandingKeyDown}
                    placeholder=""
                    aria-label="Describe your ideal home"
                    rows={1}
                    className="flex-1 bg-transparent border-0 p-0 text-black focus:ring-0 focus:outline-none text-sm md:text-lg min-w-0 w-full relative z-10 resize-none overflow-hidden leading-normal font-sans tracking-normal"
                    style={{ maxHeight: '200px' }}
                  />
                </div>

                {/* Tab hint */}
                {landingGhostText && isLandingFocused && (
                  <div className="hidden md:flex items-center shrink-0 z-10 pointer-events-none">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-100 border border-black/8 text-neutral-400 text-xs font-medium">
                      <kbd className="font-sans">Tab</kbd>
                      <span>↵</span>
                    </span>
                  </div>
                )}

                {/* Combined Action Button */}
                <button
                  type={hasLandingText ? "submit" : "button"}
                  onClick={(e) => {
                    if (!hasLandingText) {
                      e.preventDefault();
                      setIsLiveMode(true);
                    }
                  }}
                  aria-label={hasLandingText ? "Search" : "Start voice search"}
                  className={`h-11 w-11 md:h-10 md:w-10 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center shrink-0 z-10 ${isMultiline ? 'mb-1' : ''} ${
                    hasLandingText
                      ? 'bg-brand text-white hover:bg-brand-hover'
                      : 'bg-brand text-white hover:bg-brand-hover'
                  }`}
                >
                  {hasLandingText ? <ArrowRight size={20} /> : <AudioLines size={20} />}
                </button>
              </div>
            </div>
            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {dropdownSuggestions.length > 0 && isLandingFocused && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-black/5 overflow-hidden z-50"
                >
                  {dropdownSuggestions.map((s, i) => {
                    const q = landingInput.toLowerCase();
                    const idx = s.toLowerCase().indexOf(q);
                    const before = s.slice(0, idx);
                    const match = s.slice(idx, idx + landingInput.length);
                    const after = s.slice(idx + landingInput.length);
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate('/search', { state: { query: s } });
                        }}
                        onMouseEnter={() => setDropdownIndex(i)}
                        className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors text-sm ${
                          dropdownIndex === i ? 'bg-neutral-50' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <Search size={14} className="shrink-0 text-neutral-400" />
                        <span className="text-neutral-700 truncate">
                          {before}
                          <span className="font-semibold text-black">{match}</span>
                          {after}
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="w-full px-4">
            <div className="flex flex-wrap justify-center gap-2 mt-8 max-w-3xl mx-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
              {SUGGESTION_CHIPS.map((chip, index) => (
                <button
                  key={index}
                  onClick={() => navigate('/search', { state: { query: chip.query } })}
                  className="group flex items-center gap-2 px-3 py-2 min-h-11 md:min-h-0 bg-white/80 backdrop-blur-md border border-black/5 rounded-full hover:bg-brand hover:text-white transition-all duration-500 hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5"
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-black/5">
                    <img src={chip.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-xs font-medium whitespace-nowrap">{chip.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto mt-16 md:mt-24 px-4 animate-fade-in pb-20" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center mt-12 mb-0">
            <span className="text-xs font-bold tracking-wider uppercase mb-6 text-neutral-400">Explore</span>

            {/* City Filters */}
            <div className="w-full relative mb-8">
              {cityScrollState.canScrollLeft && (
                <button
                  onClick={() => scrollCityChips('left')}
                  aria-label="Scroll cities left"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md border border-black/5 text-neutral-500 hover:text-black transition-colors md:hidden"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              {cityScrollState.canScrollRight && (
                <button
                  onClick={() => scrollCityChips('right')}
                  aria-label="Scroll cities right"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-md border border-black/5 text-neutral-500 hover:text-black transition-colors md:hidden"
                >
                  <ChevronRight size={16} />
                </button>
              )}
              <div
                className="relative overflow-hidden"
                style={{
                  maskImage: (cityScrollState.canScrollLeft || cityScrollState.canScrollRight)
                    ? `linear-gradient(to right, ${cityScrollState.canScrollLeft ? 'transparent, black 32px' : 'black, black'}, ${cityScrollState.canScrollRight ? 'black calc(100% - 32px), transparent' : 'black, black'})`
                    : undefined,
                  WebkitMaskImage: (cityScrollState.canScrollLeft || cityScrollState.canScrollRight)
                    ? `linear-gradient(to right, ${cityScrollState.canScrollLeft ? 'transparent, black 32px' : 'black, black'}, ${cityScrollState.canScrollRight ? 'black calc(100% - 32px), transparent' : 'black, black'})`
                    : undefined,
                }}
              >
                <div
                  ref={cityScrollRef}
                  className="flex justify-start md:justify-center gap-2 overflow-x-auto scrollbar-hide px-4"
                >
                  {POPULAR_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-4 py-2 min-h-11 md:min-h-0 inline-flex items-center justify-center rounded-full text-xs font-bold tracking-wider transition-all border shrink-0 ${
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
          </div>

          {(() => {
            const filteredProperties = landingProperties.filter(p => selectedCity === 'All' || p.location.includes(selectedCity));
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((p) => (
                  <div key={p.id} className="transform transition-all duration-700 animate-fade-in-up">
                    <PropertyCard
                      property={p}
                      isFavorite={favorites.some(f => f.id === p.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onClick={(property: Property) => navigate('/search', { state: { propertyId: property.id } })}
                    />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {/* AI Capabilities Section */}
        <div className="w-full max-w-6xl mx-auto mt-24 px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-black uppercase tracking-wider mb-6">
              <Sparkles size={14} />
              AI Capabilities
            </div>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tighter text-black">
              What AI does for you
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="p-8 rounded-[2rem] bg-white border border-black/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-2xl bg-surface-app border border-black/5 flex items-center justify-center text-brand mb-6 shadow-sm">
                <ArrowLeftRight size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Compare listings side by side</h3>
              <p className="text-neutral-500 leading-relaxed">
                Instantly evaluate multiple properties, weighing pros and cons to make an informed decision without the spreadsheet.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-[2rem] bg-white border border-black/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-2xl bg-surface-app border border-black/5 flex items-center justify-center text-brand mb-6 shadow-sm">
                <Calculator size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Break down total monthly cost</h3>
              <p className="text-neutral-500 leading-relaxed">
                Get full transparency on rent, utilities, parking, and hidden fees so you know exactly what you'll pay.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-[2rem] bg-white border border-black/5 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -ml-20 -mb-20" />
              <div className="w-14 h-14 rounded-2xl bg-surface-app border border-black/5 flex items-center justify-center text-brand mb-6 shadow-sm">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Recommend best-fit units</h3>
              <p className="text-neutral-500 leading-relaxed">
                Our AI learns your lifestyle preferences and automatically surfaces the homes that match your unique needs.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-8 rounded-[2rem] bg-brand border border-brand relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-6 shadow-sm backdrop-blur-md">
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
                <div key={i} className="py-8 border-b border-black/10 first:pt-0 last:border-0">
                  <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">{item.q}</h3>
                  <p className="text-neutral-600 text-base leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <PageFooter />
      </main>

    </div>
  );
};

export default LandingPage;
