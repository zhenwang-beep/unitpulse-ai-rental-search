import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home, Share, Heart, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getAllProperties, getPropertyById } from '../services/propertyService';
import { Property } from '../types';
import PropertyDetailsView from '../components/PropertyDetailsView';
import TopNav from '../components/TopNav';
import { ToastData } from '../components/Toast';
import {
  getCityUrl,
  getPropertySlug,
  getPropertyUrl,
  getStateUrl,
  isValidStateCode,
  STATE_NAMES,
  CITIES_BY_STATE,
} from '../urlHelpers';

// Direct URL access to a property — always renders the standalone page
// regardless of AI_CHAT state. This preserves SEO/GEO investment in the
// canonical URL hierarchy (`/{state}/{city}/{slug}`); the chat experience
// lives in its own URL space (`/search/:chatId/...`) and never absorbs
// canonical URLs. See TODO.md "SEO architecture (canonical URLs)".
//
// Two URL shapes handled by the same component:
//   /property/:id                    legacy route — fetches by id, then
//                                    301s to canonical hierarchy URL
//   /:state/:city/:slug              canonical hierarchy URL. Resolves by
//                                    matching `imageSeed` against the slug.

interface PropertyDetailPageProps {
  isLoggedIn?: boolean;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (v: boolean) => void;
  setShowLoginView?: (v: boolean) => void;
  handleLogout?: () => void;
  showToast?: (data: ToastData) => void;
  /** Routing mode: 'legacy' for /property/:id, 'canonical' for /:state/:city/:slug. */
  mode?: 'legacy' | 'canonical';
}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  isLoggedIn = false,
  isDropdownOpen = false,
  setIsDropdownOpen = () => {},
  setShowLoginView = () => {},
  handleLogout = () => {},
  mode = 'legacy',
}) => {
  const { propertyId, state, city, slug } = useParams<{
    propertyId?: string;
    state?: string;
    city?: string;
    slug?: string;
  }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (mode === 'legacy' && propertyId) {
      getPropertyById(propertyId)
        .then((p) => (p ? setProperty(p) : setNotFound(true)))
        .catch(() => setNotFound(true));
    } else if (mode === 'canonical' && state && city && slug) {
      // Resolve canonical URL → property by matching imageSeed (which we use
      // as the slug). Engineers will replace this with a server-side lookup
      // by (state, city, slug) once those become first-class fields.
      getAllProperties()
        .then((all) => {
          const match = all.find((p) => getPropertySlug(p) === slug);
          if (match) setProperty(match);
          else setNotFound(true);
        })
        .catch(() => setNotFound(true));
    }
  }, [mode, propertyId, state, city, slug]);

  // Validate state/city for canonical routes early.
  if (mode === 'canonical' && (!isValidStateCode(state) || !state || !city)) {
    return <Navigate to="/" replace />;
  }

  if (notFound) return <Navigate to="/" replace />;
  if (!property) return null;

  // If we landed on the legacy /property/:id route and we can resolve a
  // canonical URL, redirect for SEO consolidation.
  if (mode === 'legacy') {
    const canonical = getPropertyUrl(property);
    if (canonical !== `/property/${property.id}`) {
      return <Navigate to={canonical} replace />;
    }
  }

  const isFavorite = favorites.some((f) => f.id === property.id);

  // Share button next to the breadcrumb. Uses the native share sheet on
  // mobile, falls back to clipboard. The richer share-sheet modal still
  // lives inside PropertyDetailsView for the chat-panel context.
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = { title: property.title, text: `${property.title} on UnitPulse`, url };
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch {
        // ignore
      }
    }
  };

  // Compose breadcrumb based on what we know about the property.
  const stateForCrumb = mode === 'canonical' ? state : null;
  const stateName = stateForCrumb ? STATE_NAMES[stateForCrumb] : null;
  const cityNameForCrumb = (() => {
    if (!stateForCrumb) return null;
    const found = CITIES_BY_STATE[stateForCrumb]?.find((c) => c.slug === city);
    return found ? found.name : null;
  })();

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

      {/* Breadcrumbs + page-level actions on the same row.
          Breadcrumbs also rendered as BreadcrumbList JSON-LD for SEO. */}
      <div className="w-full px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <nav aria-label="Breadcrumb" className="flex-1 min-w-0">
            <ol className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
              <li className="flex items-center gap-2">
                <Link to="/" className="inline-flex items-center gap-1 hover:text-black transition-colors">
                  <Home size={12} />
                  <span>Home</span>
                </Link>
                <ChevronRight size={12} className="text-neutral-300" />
              </li>
              {stateForCrumb && stateName ? (
                <>
                  <li className="flex items-center gap-2">
                    <Link to={getStateUrl(stateForCrumb)} className="hover:text-black transition-colors">
                      {stateName}
                    </Link>
                    <ChevronRight size={12} className="text-neutral-300" />
                  </li>
                  {city && cityNameForCrumb && (
                    <li className="flex items-center gap-2">
                      <Link to={getCityUrl(stateForCrumb, city)} className="hover:text-black transition-colors">
                        {cityNameForCrumb}
                      </Link>
                      <ChevronRight size={12} className="text-neutral-300" />
                    </li>
                  )}
                </>
              ) : (
                <li className="flex items-center gap-2">
                  <Link to="/listings" className="hover:text-black transition-colors">Listings</Link>
                  <ChevronRight size={12} className="text-neutral-300" />
                </li>
              )}
              <li className="text-black font-medium truncate" aria-current="page">
                {property.title}
              </li>
            </ol>
          </nav>

          {/* Page-level actions — share + favorite. Lives here (not in
              PropertyDetailsView) so the row stays consolidated. */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShare}
              aria-label={linkCopied ? "Link copied" : "Share property"}
              className="w-9 h-9 flex items-center justify-center rounded-full text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              {linkCopied ? <Check size={16} className="text-brand" /> : <Share size={16} />}
            </button>
            <button
              onClick={() => toggleFavorite(property)}
              aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isFavorite
                  ? 'bg-black text-white hover:bg-neutral-800'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-100'
              }`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
              ...(stateForCrumb && stateName
                ? [
                    { '@type': 'ListItem', position: 2, name: stateName, item: window.location.origin + getStateUrl(stateForCrumb) },
                    ...(city && cityNameForCrumb
                      ? [{ '@type': 'ListItem', position: 3, name: cityNameForCrumb, item: window.location.origin + getCityUrl(stateForCrumb, city) }]
                      : []),
                    { '@type': 'ListItem', position: city && cityNameForCrumb ? 4 : 3, name: property.title },
                  ]
                : [
                    { '@type': 'ListItem', position: 2, name: 'Listings', item: window.location.origin + '/listings' },
                    { '@type': 'ListItem', position: 3, name: property.title },
                  ]),
            ],
          }),
        }}
      />

      <div className="flex-1 min-h-0">
        <PropertyDetailsView
          property={property}
          onClose={() => navigate('/')}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(property)}
          isInline
          hideBackButton
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default PropertyDetailPage;
