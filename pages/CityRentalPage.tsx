import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart, LogOut, Menu, X, Search, Building, HelpCircle, TrendingUp, MapPin, ArrowRight, DollarSign, Home, ChevronDown, Star, MessageSquare, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import { CITY_DATA } from './RentalMarketsPage';
import PageFooter from '../components/PageFooter';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface CityRentalPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const CITY_DETAILS: Record<string, {
  sqftPrice: number;
  neighborhoods: { name: string; vibe: string; avgRent: number; walkScore: number }[];
  tips: string[];
  faqs: { q: string; a: string }[];
}> = {
  'new-york': {
    sqftPrice: 85,
    neighborhoods: [
      { name: 'Manhattan \u2013 Midtown', vibe: 'Business & culture hub, high energy', avgRent: 4200, walkScore: 98 },
      { name: 'Brooklyn \u2013 Williamsburg', vibe: 'Trendy, artsy, great food scene', avgRent: 3100, walkScore: 93 },
      { name: 'Queens \u2013 Astoria', vibe: 'Diverse, family-friendly, excellent transit', avgRent: 2400, walkScore: 89 },
      { name: 'Bronx \u2013 Riverdale', vibe: 'Quiet, suburban feel within the city', avgRent: 1900, walkScore: 76 },
    ],
    tips: [
      'Apply immediately \u2013 top NYC apartments rent within 24-48 hours of listing.',
      'Prepare a rental package: credit report, pay stubs (40x monthly rent in income), and references.',
      'Broker fees are increasingly illegal for renters; know your rights under NYC rent laws.',
      'Research flood zones (FEMA maps) especially for basement or ground-floor units.',
      'Many buildings require a co-signer or guarantor if your income is below 40x rent.',
    ],
    faqs: [
      { q: 'What is the average rent in New York City?', a: 'As of 2026, the average rent in NYC is approximately $3,450/month. Manhattan averages $4,200+, while outer boroughs like Queens and the Bronx offer options from $1,900\u2013$2,400.' },
      { q: 'How competitive is the NYC rental market?', a: 'Extremely competitive. Desirable apartments often receive multiple applications within hours. Having your documents ready (ID, income proof, credit report) before you start searching is essential.' },
      { q: 'Are utilities typically included in NYC rent?', a: 'Usually not. Most NYC apartments charge rent separately from utilities (electric, gas). Heat and hot water are often landlord-provided by law, but confirm this before signing.' },
    ],
  },
  'los-angeles': {
    sqftPrice: 52,
    neighborhoods: [
      { name: 'Silver Lake', vibe: 'Hipster haven, creative community, great cafes', avgRent: 2800, walkScore: 82 },
      { name: 'Santa Monica', vibe: 'Beach living, upscale, excellent for families', avgRent: 3600, walkScore: 88 },
      { name: 'Koreatown', vibe: 'Vibrant nightlife, affordable, central location', avgRent: 1900, walkScore: 91 },
      { name: 'Culver City', vibe: 'Tech hub, walkable, growing food scene', avgRent: 2700, walkScore: 79 },
    ],
    tips: [
      'Factor in commute times carefully \u2014 LA traffic can turn a 10-mile commute into 90 minutes.',
      'Check if parking is included; many buildings charge $100\u2013$250/month extra.',
      'Rent control (RSO) applies to many pre-1978 buildings \u2014 research tenant protections.',
      'Ask about air conditioning; older buildings often lack central AC despite summer heat.',
      'Be aware of wildfire and earthquake risk zones when choosing a neighborhood.',
    ],
    faqs: [
      { q: 'What is the average rent in Los Angeles?', a: 'The average rent in LA is around $2,850/month in 2026. Westside neighborhoods like Santa Monica and Brentwood command $3,500+, while areas like Koreatown and Inglewood offer options under $2,000.' },
      { q: 'Do I need a car to live in Los Angeles?', a: 'In most neighborhoods, yes. LA is car-dependent, though areas like Koreatown, Downtown, and Santa Monica have decent transit. Factor in parking costs ($100\u2013$250/month) when budgeting.' },
      { q: 'What tenant protections exist in LA?', a: 'LA has robust renter protections. The Rent Stabilization Ordinance (RSO) caps annual rent increases on qualifying buildings. The Just Cause Eviction ordinance protects tenants citywide.' },
    ],
  },
  'chicago': {
    sqftPrice: 28,
    neighborhoods: [
      { name: 'Lincoln Park', vibe: 'Upscale, family-friendly, great lakefront access', avgRent: 2300, walkScore: 90 },
      { name: 'Wicker Park', vibe: 'Hip, artsy, excellent bar and restaurant scene', avgRent: 1950, walkScore: 88 },
      { name: 'Logan Square', vibe: 'Trendy, affordable, strong community', avgRent: 1650, walkScore: 83 },
      { name: 'Hyde Park', vibe: 'Academic, quiet, great architecture', avgRent: 1400, walkScore: 77 },
    ],
    tips: [
      'Winter heating costs can be significant \u2014 ask about average utility bills before signing.',
      'Chicago has strong tenant protections under the Residential Landlord and Tenant Ordinance (RLTO).',
      'The L train is excellent \u2014 proximity to CTA lines can save significantly on transportation.',
      'Check for basement flooding history in lower units, especially near the river.',
      'Many landlords require first, last, and security deposit \u2014 budget accordingly.',
    ],
    faqs: [
      { q: 'What is the average rent in Chicago?', a: 'Chicago averages around $1,950/month in 2026, making it one of the most affordable major US cities. Upscale neighborhoods like Lincoln Park run $2,300+, while areas like Hyde Park and Logan Square offer options under $1,700.' },
      { q: 'How is public transit in Chicago?', a: 'Excellent. The CTA L train covers most of the city, and buses fill in the gaps. Many residents live car-free, especially in neighborhoods close to downtown.' },
      { q: 'What renter protections does Chicago have?', a: 'The Residential Landlord and Tenant Ordinance (RLTO) is one of the strongest in the US, covering security deposit rules, required disclosures, habitability standards, and retaliation protections.' },
    ],
  },
  'seattle': {
    sqftPrice: 58,
    neighborhoods: [
      { name: 'Capitol Hill', vibe: 'Vibrant, LGBTQ+ friendly, great nightlife', avgRent: 2600, walkScore: 95 },
      { name: 'Ballard', vibe: 'Trendy, Scandinavian roots, excellent restaurants', avgRent: 2200, walkScore: 84 },
      { name: 'South Lake Union', vibe: 'Tech hub, modern apartments, close to Amazon HQ', avgRent: 2800, walkScore: 89 },
      { name: 'Fremont', vibe: 'Quirky, creative, strong community vibe', avgRent: 2000, walkScore: 81 },
    ],
    tips: [
      'Waterproofing matters \u2014 check for proper weatherproofing and mold prevention in units.',
      'Seattle has strict renter protections, including winter eviction moratoriums.',
      'Parking is scarce and expensive downtown \u2014 consider transit-first living.',
      'The tech industry drives demand; move quickly on listings in SLU and Capitol Hill.',
      'Ask about earthquake insurance \u2014 Seattle is in a seismically active zone.',
    ],
    faqs: [
      { q: 'What is the average rent in Seattle?', a: 'Seattle averages around $2,400/month in 2026. The market has softened slightly (-0.5% YoY) as more supply came online. South Lake Union and Capitol Hill are pricier at $2,600\u2013$2,800+.' },
      { q: 'Is Seattle renter-friendly?', a: 'Yes. Seattle has strong renter protections including "just cause" eviction requirements, limits on move-in fees, and mandatory relocation assistance in certain cases.' },
      { q: 'How is Seattle\'s public transit?', a: 'Improving significantly. The Link Light Rail connects SeaTac to UW and is expanding. Buses are extensive but can be slow. Many tech workers use employer shuttles.' },
    ],
  },
  'houston': {
    sqftPrice: 18,
    neighborhoods: [
      { name: 'Midtown', vibe: 'Urban, walkable (for Houston), young professionals', avgRent: 1700, walkScore: 79 },
      { name: 'Montrose', vibe: 'Eclectic, diverse, arts district', avgRent: 1550, walkScore: 72 },
      { name: 'The Heights', vibe: 'Historic, family-friendly, great local dining', avgRent: 1800, walkScore: 68 },
      { name: 'Sugar Land', vibe: 'Suburban, top schools, master-planned', avgRent: 1600, walkScore: 41 },
    ],
    tips: [
      'Houston has no zoning laws \u2014 research your neighborhood carefully for mixed uses nearby.',
      'Flood insurance is essential; check FEMA flood maps before renting, especially post-Harvey.',
      'AC reliability is critical \u2014 confirm HVAC is well-maintained before signing.',
      'Budget for higher electricity bills in summer; Houston heat is intense.',
      'Car ownership is almost mandatory outside a few walkable neighborhoods.',
    ],
    faqs: [
      { q: 'What is the average rent in Houston?', a: 'Houston is one of the most affordable major metros at an average of $1,450/month in 2026. You can find spacious 2-bedroom apartments for under $1,500 in many areas.' },
      { q: 'Should I worry about flooding in Houston?', a: 'Flood risk varies significantly by neighborhood. Always check FEMA flood maps and ask landlords about the property\'s flood history. Properties in the 100-year flood plain require flood insurance.' },
      { q: 'Is Houston a good city for renters?', a: 'Houston offers exceptional value \u2014 you get significantly more space per dollar than coastal cities. The lack of state income tax also boosts your take-home pay.' },
    ],
  },
  'irvine': {
    sqftPrice: 62,
    neighborhoods: [
      { name: 'Woodbury', vibe: 'Master-planned, family-oriented, top-rated schools', avgRent: 3100, walkScore: 55 },
      { name: 'Irvine Spectrum', vibe: 'Modern, tech-adjacent, excellent shopping', avgRent: 2900, walkScore: 62 },
      { name: 'University Park', vibe: 'Quiet, walkable to UCI, green spaces', avgRent: 2500, walkScore: 68 },
      { name: 'Northpark', vibe: 'Established, diverse, great community amenities', avgRent: 2700, walkScore: 58 },
    ],
    tips: [
      'Irvine\'s master-planned communities mean strict HOA rules \u2014 read CC&Rs carefully.',
      'Top-rated schools make Irvine highly competitive for family rentals.',
      'Most residents commute by car; plan your route to work before choosing a neighborhood.',
      'Many apartments are part of large complexes with resort-style amenities \u2014 compare included features.',
      'Irvine is one of the safest large cities in the US \u2014 crime rates are very low.',
    ],
    faqs: [
      { q: 'What is the average rent in Irvine?', a: 'Irvine averages approximately $2,700/month in 2026. The city\'s excellent schools, safety, and amenities command a premium over surrounding Orange County cities.' },
      { q: 'Why is Irvine popular with families?', a: 'Irvine consistently ranks as one of the safest cities in America and has outstanding public schools. Its master-planned communities offer parks, trails, and community centers throughout.' },
      { q: 'Is Irvine good for tech workers?', a: 'Yes. Irvine has a strong tech presence with major employers including Blizzard Entertainment, Edwards Lifesciences, and numerous startups. It\'s also within commuting distance of LA and San Diego tech hubs.' },
    ],
  },
};


const CityRentalPage: React.FC<CityRentalPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { citySlug } = useParams<{ citySlug: string }>();
  const { favorites } = useAppContext();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const city = CITY_DATA.find(c => c.slug === citySlug);
  const details = citySlug ? CITY_DETAILS[citySlug] : undefined;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
    setIsAtTop(currentScrollY < 20);
    if (currentScrollY < 100) {
      setIsHeaderVisible(true);
    } else if (currentScrollY > lastScrollYRef.current + 5) {
      setIsHeaderVisible(false);
    } else if (currentScrollY < lastScrollYRef.current - 5) {
      setIsHeaderVisible(true);
    }
    lastScrollYRef.current = currentScrollY;
  };

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (!city) return;
    document.title = `${city.name} Rental Market Guide 2026 - UnitPulse`;
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = `Explore the ${city.name} rental market: average rents, best neighborhoods, renting tips, and AI-powered apartment search. Find your perfect home in ${city.name}.`;
    meta.id = 'city-meta-desc';
    document.head.appendChild(meta);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'city-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://unitpulse.ai/' },
        { '@type': 'ListItem', position: 2, name: 'Rental Markets', item: 'https://unitpulse.ai/rentals' },
        { '@type': 'ListItem', position: 3, name: city.name, item: `https://unitpulse.ai/rentals/${city.slug}` },
      ],
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById('city-meta-desc')?.remove();
      document.getElementById('city-jsonld')?.remove();
      document.title = 'UnitPulse Rental Search';
    };
  }, [city]);

  if (!city || !details) {
    return (
      <div className="min-h-screen bg-[#FCF9F8] flex flex-col items-center justify-center gap-4">
        <Building size={48} className="text-neutral-300" />
        <h1 className="text-2xl font-black text-neutral-400">City not found</h1>
        <button onClick={() => navigate('/rentals')} className="px-6 py-3 bg-[#4A5D23] text-white rounded-xl font-medium">
          View All Markets
        </button>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-[#FCF9F8] text-black font-sans overflow-y-auto scroll-smooth" onScroll={handleScroll}>
      {/* Header */}
      <header className={`w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-[#FCF9F8]' : 'bg-white shadow-sm'}`}>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
            <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
                      <Heart size={16} /> Favorites
                      {favorites.length > 0 && <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600"><LogOut size={16} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLoginView(true)} className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all">Login</button>
            )}
          </nav>
          <button onClick={() => setIsHistoryOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"><Menu size={24} /></button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[65]" onClick={() => setIsHistoryOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[70] border-l border-black/5 flex flex-col">
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="font-heading font-bold text-lg tracking-wider">Menu</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Search size={20} className="text-neutral-400" /> Find a home</a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Building size={20} className="text-neutral-400" /> Become a partner</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Breadcrumb */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 font-medium">
          <a href="/" className="hover:text-black transition-colors">Home</a>
          <span>/</span>
          <a href="/rentals" className="hover:text-black transition-colors">Rental Markets</a>
          <span>/</span>
          <span className="text-black">{city.name}</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-6 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative rounded-[2rem] overflow-hidden h-72 md:h-96">
          <img src={city.image} alt={`${city.name} skyline`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-black uppercase tracking-wider mb-4">
              <MapPin size={12} />
              {city.state}
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-white mb-2">
              {city.name}
            </h1>
            <p className="text-white/80 text-lg max-w-xl">{city.description}</p>
          </div>
          <div className={`absolute top-6 right-6 px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${city.trendUp ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            {city.trend} YoY
          </div>
        </motion.div>
      </div>

      {/* Market Stats */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: 'Avg Monthly Rent', value: `$${city.avgRent.toLocaleString()}`, color: 'bg-[#4A5D23]/10 text-[#4A5D23]' },
            { icon: TrendingUp, label: 'YoY Change', value: city.trend, color: city.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' },
            { icon: Home, label: 'Active Listings', value: city.listings.toLocaleString(), color: 'bg-blue-50 text-blue-600' },
            { icon: Building, label: 'Avg $/sqft', value: `$${details.sqftPrice}/sqft`, color: 'bg-amber-50 text-amber-600' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }} className="p-5 bg-white rounded-2xl border border-black/5 text-center">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={20} />
              </div>
              <div className="text-2xl font-black text-black mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neighborhood Guide */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-4">
            <MapPin size={14} />
            Neighborhood Guide
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-black">
            Best Neighborhoods in {city.name}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.neighborhoods.map((hood, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }} className="bg-white rounded-2xl border border-black/5 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-black">{hood.name}</h3>
                <div className="flex items-center gap-1 px-2.5 py-1 bg-[#4A5D23]/10 rounded-full">
                  <Star size={12} className="text-[#4A5D23]" fill="#4A5D23" />
                  <span className="text-xs font-bold text-[#4A5D23]">{hood.walkScore}</span>
                </div>
              </div>
              <p className="text-neutral-500 text-sm leading-relaxed mb-4">{hood.vibe}</p>
              <div className="flex items-center justify-between pt-3 border-t border-black/5">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Avg Rent</span>
                <span className="text-lg font-black text-black">${hood.avgRent.toLocaleString()}<span className="text-sm font-medium text-neutral-400">/mo</span></span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Renting Tips */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="p-8 md:p-10 bg-white rounded-[2rem] border border-black/5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-4">
            <Shield size={14} />
            Local Tips
          </div>
          <h2 className="text-3xl font-black font-heading tracking-tighter text-black mb-8">
            Renting in {city.name}: What You Need to Know
          </h2>
          <div className="flex flex-col gap-4">
            {details.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#4A5D23] text-white text-sm font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-neutral-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City FAQ */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-4">
            <HelpCircle size={14} />
            Common Questions
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter text-black">
            {city.name} Rental FAQs
          </h2>
        </div>
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden">
          {details.faqs.map((faq, i) => (
            <div key={i}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-neutral-50/50 transition-colors group">
                <span className="text-base font-semibold text-black pr-4 group-hover:text-[#4A5D23] transition-colors">{faq.q}</span>
                <ChevronDown size={20} className={`shrink-0 text-neutral-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="px-5 md:px-6 pb-5 md:pb-6">
                      <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Other Cities */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <h2 className="text-2xl font-black font-heading tracking-tighter text-black mb-6">Explore Other Markets</h2>
        <div className="flex gap-3 flex-wrap">
          {CITY_DATA.filter(c => c.slug !== citySlug).map(c => (
            <button key={c.slug} onClick={() => navigate(`/rentals/${c.slug}`)} className="px-5 py-2.5 bg-white border border-black/5 rounded-full text-sm font-semibold hover:border-[#4A5D23] hover:text-[#4A5D23] transition-all">
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="w-full max-w-6xl mx-auto px-4 pb-20">
        <div className="p-8 md:p-12 rounded-[2rem] bg-[#4A5D23] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter mb-4">
              Find your perfect home in {city.name}
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
              Let our AI search {city.listings.toLocaleString()}+ listings to match you with the right apartment — based on your lifestyle, not just price.
            </p>
            <button onClick={() => navigate('/search', { state: { query: `Apartments in ${city.name}` } })} className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4A5D23] rounded-2xl font-bold hover:shadow-xl transition-all">
              <MessageSquare size={20} />
              Search {city.name} Rentals
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export default CityRentalPage;
