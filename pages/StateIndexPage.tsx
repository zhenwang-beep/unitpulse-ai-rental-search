import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Home, MapPin, ArrowRight } from 'lucide-react';
import TopNav from '../components/TopNav';
import PageFooter from '../components/PageFooter';
import { ToastData } from '../components/Toast';
import {
  CITIES_BY_STATE,
  STATE_NAMES,
  isValidStateCode,
  getCityUrl,
} from '../urlHelpers';
import { Property } from '../types';
import { getAllProperties } from '../services/propertyService';

interface StateIndexPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast?: (data: ToastData) => void;
}

const StateIndexPage: React.FC<StateIndexPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const { state } = useParams<{ state: string }>();
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    getAllProperties().then(setAllProperties).catch(console.error);
  }, []);

  if (!isValidStateCode(state) || !state) return <Navigate to="/" replace />;

  const stateName = STATE_NAMES[state];
  const cities = CITIES_BY_STATE[state] ?? [];

  // Properties per city for the "X listings" badge on each card.
  const countByCity = (cityName: string) =>
    allProperties.filter((p) => p.location === cityName).length;

  // FAQ for state page — generic but real-world useful, with FAQPage schema.
  const faqs = [
    {
      q: `What are the most popular cities to rent in ${stateName}?`,
      a: `${stateName}'s biggest rental markets are ${cities.map((c) => c.name).join(', ')}. Each market has distinct neighborhoods, price ranges, and lifestyle profiles — explore the city pages below for detailed guides.`,
    },
    {
      q: `What's the average rent in ${stateName}?`,
      a: `Rents in ${stateName} vary widely by city and neighborhood. Coastal metros tend to be the most expensive; inland markets offer more value. See each city page for current average rents and market trends.`,
    },
    {
      q: `When is the best time to rent in ${stateName}?`,
      a: `${stateName} rental activity tends to peak in spring and summer when more inventory comes online. Fall and winter often have softer demand and more room to negotiate.`,
    },
    {
      q: `Are short-term leases available in ${stateName}?`,
      a: `Many ${stateName} properties offer 12-month leases as standard, with shorter terms (3–9 months) available at select buildings. Filter listings or ask the leasing team for current short-term options.`,
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
        <ol className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500">
          <li className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-black transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="text-black font-medium" aria-current="page">{stateName}</li>
        </ol>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Editorial header — extractable summary block for AI engine citation.
            TODO(content): replace with hand-edited copy per state. */}
        <header className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-surface-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
            <MapPin size={12} /> State guide
          </div>
          <h1 className="text-3xl md:text-5xl font-black font-heading tracking-tight text-black">
            Apartments for Rent in {stateName}
          </h1>
          <p className="mt-4 text-base text-neutral-600 leading-relaxed">
            {stateName} is home to some of the most active rental markets in the US. Browse {cities.length}{' '}
            {cities.length === 1 ? 'city' : 'cities'} below for verified listings, neighborhood guides, and
            market insights to help you find your next home.
          </p>
        </header>

        {/* City grid */}
        <section className="mb-16">
          <h2 className="text-xs font-black text-black uppercase tracking-wider mb-5">
            Cities in {stateName}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cities.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to={getCityUrl(state, c.slug)}
                  className="group block bg-white rounded-2xl border border-black/5 p-6 hover:border-black/20 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-black group-hover:underline decoration-2 underline-offset-4">
                      {c.name}
                    </h3>
                    <ArrowRight size={16} className="text-neutral-300 group-hover:text-black transition-colors shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">
                    {countByCity(c.name)} {countByCity(c.name) === 1 ? 'listing' : 'listings'}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl">
          <h2 className="text-xs font-black text-black uppercase tracking-wider mb-5">
            Frequently asked questions about renting in {stateName}
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

export default StateIndexPage;
