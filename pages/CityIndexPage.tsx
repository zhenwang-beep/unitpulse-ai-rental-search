import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Home, ArrowRight, MapPin, Star } from 'lucide-react';
import TopNav from '../components/TopNav';
import PageFooter from '../components/PageFooter';
import PropertyCard from '../components/PropertyCard';
import { ToastData } from '../components/Toast';
import {
  CITIES_BY_STATE,
  STATE_NAMES,
  isValidStateCode,
  isValidCity,
  getStateUrl,
  getPropertyUrl,
} from '../urlHelpers';
import { Property } from '../types';
import { getAllProperties } from '../services/propertyService';
import { useAppContext } from '../context/AppContext';

interface CityIndexPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

// Editorial city content. Replaces the older `/rentals/:city` `CityRentalPage`
// for cities that exist in our hierarchy. The old route stays in place and
// can later 301 to here once feature parity is confirmed.
//
// TODO(content): hand-edit this per city — current copy is templated.
const CITY_EDITORIAL: Record<string, { tagline: string; intro: string; neighborhoods: { name: string; vibe: string }[]; marketStats: { label: string; value: string }[] }> = {
  'los-angeles': {
    tagline: "Sun, sprawl, and a rental market that rewards local knowledge.",
    intro: "From the beach to the hills, LA's rental market is really 50 markets stacked on top of each other. Our city guide breaks down the neighborhoods, average rents, and lifestyle fit so you can find the version of LA that fits you — not the postcard version.",
    neighborhoods: [
      { name: 'Koreatown', vibe: 'Walkable, vibrant nightlife, central transit' },
      { name: 'Silver Lake', vibe: 'Creative, hip, great cafes and design shops' },
      { name: 'Santa Monica', vibe: 'Beachside, family-friendly, premium' },
      { name: 'Culver City', vibe: 'Tech hub, walkable, growing food scene' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$2,850' },
      { label: 'YoY change', value: '+1.8%' },
      { label: 'Median sqft', value: '720' },
    ],
  },
  'seattle': {
    tagline: "Tech-fueled growth, evergreen views, and one of the strongest renter-protection regimes in the US.",
    intro: "Seattle's rental market has cooled slightly as more supply comes online, but the best Capitol Hill and South Lake Union listings still move within days. Use our neighborhood guides to compare commute, walkability, and lifestyle.",
    neighborhoods: [
      { name: 'Capitol Hill', vibe: 'LGBTQ+ friendly, vibrant nightlife' },
      { name: 'Ballard', vibe: 'Scandinavian roots, excellent food scene' },
      { name: 'South Lake Union', vibe: 'Tech-forward, modern apartments' },
      { name: 'Fremont', vibe: 'Quirky, creative, strong community vibe' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$2,400' },
      { label: 'YoY change', value: '−0.5%' },
      { label: 'Median sqft', value: '690' },
    ],
  },
  'chicago': {
    tagline: "Strong renter protections, a phenomenal transit network, and some of the best price-per-square-foot in major metros.",
    intro: "Chicago is one of the most affordable major metros in the US for rent. Our guide highlights the neighborhoods worth knowing, from upscale Lincoln Park to artsy Wicker Park to family-friendly Hyde Park.",
    neighborhoods: [
      { name: 'Lincoln Park', vibe: 'Upscale, family-friendly, lakefront access' },
      { name: 'Wicker Park', vibe: 'Hip, artsy, excellent bar scene' },
      { name: 'Logan Square', vibe: 'Trendy, affordable, strong community' },
      { name: 'Hyde Park', vibe: 'Academic, quiet, great architecture' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$1,950' },
      { label: 'YoY change', value: '+2.3%' },
      { label: 'Median sqft', value: '780' },
    ],
  },
  'houston': {
    tagline: "Big space, big variety, and rents that go further than almost any other major US city.",
    intro: "Houston offers more square footage per dollar than nearly any major metro. The challenge is sprawl — the right neighborhood depends heavily on commute and lifestyle. Our guide cuts through the noise.",
    neighborhoods: [
      { name: 'Montrose', vibe: 'Eclectic, walkable, great food and bars' },
      { name: 'The Heights', vibe: 'Historic, charming, family-friendly' },
      { name: 'Midtown', vibe: 'Urban energy, nightlife, transit access' },
      { name: 'Rice Village', vibe: 'Upscale, quiet, walkable retail' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$1,650' },
      { label: 'YoY change', value: '+0.9%' },
      { label: 'Median sqft', value: '880' },
    ],
  },
  'irvine': {
    tagline: "Master-planned suburb, top-ranked schools, and one of the most consistent rental markets in California.",
    intro: "Irvine is built on a planned-community model: clean, safe, and predictable. Rentals tend to be larger, newer, and family-oriented. Our guide highlights the right villages for different lifestyles.",
    neighborhoods: [
      { name: 'Woodbridge', vibe: 'Lake community, family-friendly, top schools' },
      { name: 'Northpark', vibe: 'Newer construction, parks, walkable' },
      { name: 'Quail Hill', vibe: 'Hillside, modern, great commute' },
      { name: 'Portola Springs', vibe: 'Newest, family-oriented, growing' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$3,200' },
      { label: 'YoY change', value: '+2.7%' },
      { label: 'Median sqft', value: '1,050' },
    ],
  },
  'new-york': {
    tagline: "Five boroughs, infinite trade-offs. The most competitive rental market in the country.",
    intro: "NYC is the deepest and fastest-moving rental market in the US. Whether you want Manhattan high-rises or Brooklyn brownstones, our guide breaks down the neighborhoods, broker fees, and timing tricks that make the difference between getting the apartment and missing it.",
    neighborhoods: [
      { name: 'Manhattan – Midtown', vibe: 'Business hub, high energy, premium' },
      { name: 'Brooklyn – Williamsburg', vibe: 'Trendy, artsy, food scene' },
      { name: 'Queens – Astoria', vibe: 'Diverse, family-friendly, transit' },
      { name: 'Bronx – Riverdale', vibe: 'Quiet, suburban feel within the city' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$3,450' },
      { label: 'YoY change', value: '+2.1%' },
      { label: 'Median sqft', value: '650' },
    ],
  },
  'san-francisco': {
    tagline: "Recovering market, premium prices, and neighborhoods with the strongest character of any US city.",
    intro: "San Francisco's rental market has softened since the 2021 peak but remains one of the most expensive in the country. Our guide explains where the value still lives and which neighborhoods reward a longer search.",
    neighborhoods: [
      { name: 'Mission', vibe: 'Vibrant, food-forward, dense' },
      { name: 'Marina', vibe: 'Waterfront, premium, social' },
      { name: 'NoPa', vibe: 'Up-and-coming, great cafes' },
      { name: 'SOMA', vibe: 'Tech hub, modern apartments, transit' },
    ],
    marketStats: [
      { label: 'Avg. rent', value: '$3,150' },
      { label: 'YoY change', value: '−1.2%' },
      { label: 'Median sqft', value: '710' },
    ],
  },
};

const CityIndexPage: React.FC<CityIndexPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  setPendingFavoriteProperty,
  handleLogout,
  showToast,
}) => {
  const { state, city } = useParams<{ state: string; city: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    getAllProperties().then(setAllProperties).catch(console.error);
  }, []);

  if (!isValidStateCode(state) || !state || !city || !isValidCity(state, city)) {
    return <Navigate to="/" replace />;
  }

  const stateName = STATE_NAMES[state];
  const cityMeta = CITIES_BY_STATE[state]?.find((c) => c.slug === city);
  const cityName = cityMeta?.name ?? '';
  const editorial = CITY_EDITORIAL[city] ?? {
    tagline: '',
    intro: `Browse rentals in ${cityName}.`,
    neighborhoods: [],
    marketStats: [],
  };

  const cityProperties = useMemo(
    () => allProperties.filter((p) => p.location === cityName),
    [allProperties, cityName],
  );
  const trendingInCity = cityProperties.slice(0, 6);

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

  const faqs = [
    {
      q: `What is the average rent in ${cityName}?`,
      a: `As of 2026, average rent in ${cityName} is around ${editorial.marketStats[0]?.value ?? '—'}. Pricing varies significantly by neighborhood and unit size — see the listings below for current rates.`,
    },
    {
      q: `What are the best neighborhoods in ${cityName}?`,
      a: editorial.neighborhoods.length
        ? `Top neighborhoods in ${cityName} include ${editorial.neighborhoods.map((n) => n.name).join(', ')}. Each has a distinct lifestyle profile — see the neighborhood section above for details.`
        : `Top neighborhoods vary by lifestyle. Browse listings below or explore the neighborhood guides for ${cityName}.`,
    },
    {
      q: `How competitive is the ${cityName} rental market?`,
      a: `The ${cityName} market moves quickly — the best listings often see multiple applications within 24–48 hours. Have your application materials (ID, income proof, credit report) ready before you start touring.`,
    },
    {
      q: `When is the best time to rent in ${cityName}?`,
      a: `Activity in ${cityName} peaks in spring and summer. Fall and winter typically have softer demand and more room to negotiate concessions or longer move-in dates.`,
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  return (
    <div className="h-[100dvh] w-full bg-surface-app overflow-y-auto flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-static"
      />

      <nav aria-label="Breadcrumb" className="w-full px-4 md:px-8 py-3">
        <ol className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
          <li className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-black transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="flex items-center gap-2">
            <Link to={getStateUrl(state)} className="hover:text-black transition-colors">{stateName}</Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="text-black font-medium" aria-current="page">{cityName}</li>
        </ol>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Editorial header with extractable summary block — AI-engine bait. */}
        <header className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-surface-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <MapPin size={12} /> {stateName}
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-black">
            Apartments for Rent in {cityName}
          </h1>
          {editorial.tagline && (
            <p className="mt-4 text-lg text-brand font-semibold leading-relaxed">{editorial.tagline}</p>
          )}
          <p className="mt-3 text-base text-neutral-600 leading-relaxed">{editorial.intro}</p>
        </header>

        {/* Market stats */}
        {editorial.marketStats.length > 0 && (
          <section className="mb-12">
            <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-3xl">
              {editorial.marketStats.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-black/5 px-4 py-5">
                  <p className="text-2xl md:text-3xl font-black text-black tracking-tight">{stat.value}</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Neighborhoods */}
        {editorial.neighborhoods.length > 0 && (
          <section className="mb-16">
            <h2 className="text-xs font-black text-black uppercase tracking-wider mb-5">
              Neighborhoods in {cityName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {editorial.neighborhoods.map((n, i) => (
                <motion.div
                  key={n.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-black/5 p-5"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <Star size={14} className="text-brand mt-0.5 shrink-0" />
                    <h3 className="text-sm font-bold text-black leading-tight">{n.name}</h3>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{n.vibe}</p>
                </motion.div>
              ))}
            </div>
            {/* TODO(eng): when neighborhoods are first-class data, link each
                tile to /{state}/{city}/{neighborhood-slug} for a real
                neighborhood index page. */}
          </section>
        )}

        {/* Trending properties in this city */}
        {trendingInCity.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-xs font-black text-black uppercase tracking-wider">
                Trending in {cityName}
              </h2>
              <Link to="/listings" className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingInCity.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
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
          </section>
        )}

        {/* FAQ */}
        <section className="max-w-3xl">
          <h2 className="text-xs font-black text-black uppercase tracking-wider mb-5">
            FAQs about renting in {cityName}
          </h2>
          <div className="rounded-2xl border border-black/5 divide-y divide-black/5 overflow-hidden bg-white">
            {faqs.map(({ q, a }) => (
              <div key={q} className="px-5 py-5">
                <h3 className="text-sm font-semibold text-black mb-2">{q}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
};

export default CityIndexPage;
