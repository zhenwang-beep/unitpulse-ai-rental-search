import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Home, Search, ArrowRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';
import { useAppContext } from '../context/AppContext';
import { Property } from '../types';
import { ToastData } from '../components/Toast';
import { getAllProperties } from '../services/propertyService';

interface SearchResultsPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

// Token-AND keyword filter — same shape as the live filter on LandingPage when
// AI_CHAT is on, but here it's the explicit destination of a form submission.
const STOPWORDS = new Set([
  'a','an','the','for','with','and','or','of','in','to','me','my','i',
  'find','show','want','need','looking','near','under','over',
]);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9$]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

function matchesQuery(property: Property, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const haystack = [
    property.title,
    property.location,
    property.type,
    property.description,
    ...(property.amenities ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return tokens.every((t) => haystack.includes(t));
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  setPendingFavoriteProperty,
  handleLogout,
  showToast,
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const { favorites, toggleFavorite } = useAppContext();

  useEffect(() => {
    getAllProperties().then(setAllProperties).catch(console.error);
  }, []);

  // Keep input in sync when user navigates with new ?q= via back/forward.
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const tokens = useMemo(() => tokenize(query), [query]);
  const filtered = useMemo(
    () => allProperties.filter((p) => matchesQuery(p, tokens)),
    [allProperties, tokens],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = query.trim();
    if (next) {
      setSearchParams({ q: next });
    } else {
      setSearchParams({});
    }
  };

  // Heuristic city redirect — if user typed a city name, suggest the city page.
  const cityRedirect = useMemo(() => {
    const KNOWN_CITIES: { match: string; slug: string; label: string }[] = [
      { match: 'los angeles', slug: '/rentals/los-angeles', label: 'Los Angeles' },
      { match: 'la', slug: '/rentals/los-angeles', label: 'Los Angeles' },
      { match: 'new york', slug: '/rentals/new-york', label: 'New York' },
      { match: 'nyc', slug: '/rentals/new-york', label: 'New York' },
      { match: 'seattle', slug: '/rentals/seattle', label: 'Seattle' },
      { match: 'chicago', slug: '/rentals/chicago', label: 'Chicago' },
      { match: 'houston', slug: '/rentals/houston', label: 'Houston' },
      { match: 'irvine', slug: '/rentals/irvine', label: 'Irvine' },
    ];
    const lower = query.toLowerCase();
    return KNOWN_CITIES.find((c) => lower.includes(c.match));
  }, [query]);

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
            Search
          </li>
        </ol>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Page header + search input */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight text-black">
            {initialQuery ? `Results for "${initialQuery}"` : 'Search rentals'}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {initialQuery
              ? `${filtered.length} matching ${filtered.length === 1 ? 'listing' : 'listings'}`
              : 'Browse all listings or refine your search'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex items-center gap-3 max-w-2xl">
            <div className="flex-1 flex items-center gap-3 px-5 py-3 bg-white border border-black/10 rounded-full shadow-sm focus-within:border-brand transition-colors">
              <Search size={16} className="text-neutral-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 2 bedroom in Koreatown"
                aria-label="Search rentals"
                className="flex-1 bg-transparent border-0 p-0 text-sm md:text-base focus:ring-0 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-12 px-5 bg-brand text-white rounded-full font-semibold text-sm hover:bg-brand-hover transition-colors shrink-0"
            >
              Search
            </button>
          </form>

          {cityRedirect && (
            <Link
              to={cityRedirect.slug}
              className="mt-4 inline-flex items-center gap-2 text-sm text-brand font-semibold hover:underline"
            >
              <span>Browse all rentals in {cityRedirect.label}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white py-16 px-8 text-center">
            <Search size={28} className="text-neutral-300 mx-auto mb-4" />
            <h2 className="text-base font-bold text-black mb-1">No matches for "{initialQuery}"</h2>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
              Try a shorter query, a city name, or browse all rentals to refine from there.
            </p>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand text-white rounded-full font-semibold text-sm hover:bg-brand-hover transition-colors"
            >
              Browse all rentals
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              >
                <PropertyCard
                  property={p}
                  isFavorite={favorites.some((f) => f.id === p.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onClick={(prop: Property) => navigate(`/property/${prop.id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <PageFooter />
    </div>
  );
};

export default SearchResultsPage;
