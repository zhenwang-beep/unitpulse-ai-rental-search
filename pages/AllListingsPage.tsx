import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';
import { useAppContext } from '../context/AppContext';
import { Property } from '../types';
import { ToastData } from '../components/Toast';
import { getAllProperties } from '../services/propertyService';
import { getPropertyUrl } from '../urlHelpers';

interface AllListingsPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const POPULAR_CITIES = ['All', 'Los Angeles', 'Seattle', 'Chicago', 'Houston', 'Irvine', 'New York'];

const AllListingsPage: React.FC<AllListingsPageProps> = ({
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
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [cityScrollState, setCityScrollState] = useState({ canScrollLeft: false, canScrollRight: false });
  const cityScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllProperties().then(setAllProperties).catch(console.error);
  }, []);

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
  }, [allProperties]);

  const scrollCityChips = (dir: 'left' | 'right') => {
    const el = cityScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -150 : 150, behavior: 'smooth' });
  };

  const filtered = allProperties.filter(
    (p) => selectedCity === 'All' || p.location.includes(selectedCity),
  );

  const handleToggleFavorite = (property: Property) => {
    if (!isLoggedIn) {
      setPendingFavoriteProperty(property);
      setShowLoginView(true);
      return;
    }
    const adding = !favorites.some((f) => f.id === property.id);
    toggleFavorite(property);
    if (adding) {
      showToast({
        message: 'Added to Favorites',
        actionLabel: 'View Favorites →',
        onAction: () => navigate('/favorites'),
      });
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-surface-app overflow-y-auto flex flex-col">
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-static"
      />

      <nav aria-label="Breadcrumb" className="w-full px-4 md:px-8 py-3 bg-white border-b border-black/5">
        <ol className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500">
          <li className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-black transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="text-black font-medium" aria-current="page">
            All Listings
          </li>
        </ol>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* TODO(seo): when the URL hierarchy ships, this becomes per-state /
            per-city editorial content. For now, a generic intro keeps the page
            indexable and structured. */}
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-black">
            Browse all rentals
          </h1>
          <p className="mt-3 text-base text-neutral-500 leading-relaxed">
            Explore every property across our partner network — filter by city below, then
            tap any listing for full details, photos, and floor plans.
          </p>
        </header>

        {/* City filter — same pattern as the home page chips */}
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
            ref={cityScrollRef}
            onScroll={updateCityScroll}
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

        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-6">
          {filtered.length} {filtered.length === 1 ? 'listing' : 'listings'}
          {selectedCity !== 'All' && ` in ${selectedCity}`}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
            >
              <PropertyCard
                property={p}
                isFavorite={favorites.some((f) => f.id === p.id)}
                onToggleFavorite={handleToggleFavorite}
                onClick={(prop: Property) => navigate(getPropertyUrl(prop))}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <PageFooter />
    </div>
  );
};

export default AllListingsPage;
