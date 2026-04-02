import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu, X, Search, Building, TrendingUp, ArrowRight, DollarSign, Home, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence } from 'motion/react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface RentalMarketsPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const CITY_DATA = [
  {
    slug: 'new-york',
    name: 'New York',
    state: 'NY',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 3450,
    trend: '+2.1%',
    trendUp: true,
    listings: 1240,
    description: 'The city that never sleeps offers unparalleled diversity in housing — from Manhattan high-rises to Brooklyn brownstones.',
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 2850,
    trend: '+1.8%',
    trendUp: true,
    listings: 980,
    description: 'Sun-drenched apartments, beachside living, and vibrant neighborhoods define LA\'s rental landscape.',
  },
  {
    slug: 'chicago',
    name: 'Chicago',
    state: 'IL',
    image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 1950,
    trend: '+0.9%',
    trendUp: true,
    listings: 720,
    description: 'Affordable compared to coastal cities, Chicago offers incredible architecture and diverse neighborhoods.',
  },
  {
    slug: 'seattle',
    name: 'Seattle',
    state: 'WA',
    image: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b4c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 2400,
    trend: '-0.5%',
    trendUp: false,
    listings: 560,
    description: 'Tech hub living with stunning nature access — from waterfront condos to cozy Capitol Hill apartments.',
  },
  {
    slug: 'houston',
    name: 'Houston',
    state: 'TX',
    image: 'https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 1450,
    trend: '+1.2%',
    trendUp: true,
    listings: 890,
    description: 'One of the most affordable major metros, Houston\'s sprawling market offers space and value.',
  },
  {
    slug: 'irvine',
    name: 'Irvine',
    state: 'CA',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    avgRent: 2700,
    trend: '+1.5%',
    trendUp: true,
    listings: 340,
    description: 'Master-planned communities with top-rated schools, making Irvine a magnet for families and professionals.',
  },
];

export { CITY_DATA };

const RentalMarketsPage: React.FC<RentalMarketsPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    document.title = "Rental Markets by City - UnitPulse | AI-Powered Rental Search";
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Explore rental market trends, average rents, and neighborhood guides for top US cities including New York, Los Angeles, Chicago, Seattle, Houston, and Irvine.';
    meta.id = 'rentals-meta-desc';
    document.head.appendChild(meta);
    return () => {
      document.getElementById('rentals-meta-desc')?.remove();
      document.title = 'UnitPulse Rental Search';
    };
  }, []);

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
                    <button onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"><Heart size={16} /> Favorites {favorites.length > 0 && <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}</button>
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
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] border-r border-black/5 flex flex-col">
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-2"><img src={LOGO_URL} alt="UnitPulse" className="h-6" /><h2 className="font-heading font-bold text-lg tracking-wider">UnitPulse</h2></div>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Search size={20} className="text-neutral-400" /> Find a home</a>
                <div className="h-px bg-neutral-100 w-full my-1"></div>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Building size={20} className="text-neutral-400" /> Become a partner</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-6">
            <TrendingUp size={14} />
            Market Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-black mb-6">
            Rental Markets <span style={{ color: '#4A5D23' }}>by City</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore rental trends, average prices, and neighborhood guides for top US cities. Find the perfect market for your next home.
          </p>
        </motion.div>
      </div>

      {/* Market Overview Stats */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building, label: 'Cities Covered', value: '6+', color: 'bg-[#4A5D23]/10 text-[#4A5D23]' },
            { icon: Home, label: 'Active Listings', value: '4,730+', color: 'bg-blue-50 text-blue-600' },
            { icon: DollarSign, label: 'Avg National Rent', value: '$2,467', color: 'bg-amber-50 text-amber-600' },
            { icon: Users, label: 'Renters Helped', value: '12,000+', color: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="p-5 bg-white rounded-2xl border border-black/5 text-center"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon size={20} />
              </div>
              <div className="text-2xl font-black text-black mb-1">{stat.value}</div>
              <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* City Grid */}
      <div className="w-full max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CITY_DATA.map((city, i) => (
            <motion.div
              key={city.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <div
                onClick={() => navigate(`/rentals/${city.slug}`)}
                className="group cursor-pointer bg-white rounded-[1.5rem] border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={city.image}
                    alt={`${city.name} rental market`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">{city.name}</h3>
                    <span className="text-white/70 text-sm font-medium">{city.state}</span>
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${city.trendUp ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                    {city.trend} YoY
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-neutral-500 text-sm leading-relaxed mb-4">{city.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Avg Rent</div>
                      <div className="text-xl font-black text-black">${city.avgRent.toLocaleString()}<span className="text-sm font-medium text-neutral-400">/mo</span></div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Listings</div>
                      <div className="text-xl font-black text-black">{city.listings.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#4A5D23] group-hover:translate-x-0.5 transition-transform">Explore market →</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export default RentalMarketsPage;
