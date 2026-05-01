import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { PERSISTENT_THREAD_ID } from '../constants';
import { useAppContext } from '../context/AppContext';
import { getPropertyById } from '../services/propertyService';
import { Property } from '../types';
import PropertyDetailsView from '../components/PropertyDetailsView';
import TopNav from '../components/TopNav';
import { FEATURES } from '../featureFlags';
import { ToastData } from '../components/Toast';

// Direct URL access to /property/:id —
// AI_CHAT on:  open in the persistent conversation thread (legacy behavior).
// AI_CHAT off: render PropertyDetailsView as a standalone page with full site
//              chrome (TopNav + breadcrumbs) so it can be linked, indexed,
//              and shared like any other content page.
//
// TODO(eng): once the URL hierarchy migration ships, this page will live at
// /{state}/{city}/{neighborhood}/{property-slug}/ and the breadcrumbs will
// reflect the real path. See unitpulse-domain-strategy.md.

interface PropertyDetailPageProps {
  isLoggedIn?: boolean;
  isDropdownOpen?: boolean;
  setIsDropdownOpen?: (v: boolean) => void;
  setShowLoginView?: (v: boolean) => void;
  handleLogout?: () => void;
  showToast?: (data: ToastData) => void;
}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  isLoggedIn = false,
  isDropdownOpen = false,
  setIsDropdownOpen = () => {},
  setShowLoginView = () => {},
  handleLogout = () => {},
}) => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { addThread, favorites, toggleFavorite } = useAppContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!propertyId || FEATURES.AI_CHAT) return;
    getPropertyById(propertyId)
      .then((p) => (p ? setProperty(p) : setNotFound(true)))
      .catch(() => setNotFound(true));
  }, [propertyId]);

  if (!propertyId) return <Navigate to="/" replace />;

  if (FEATURES.AI_CHAT) {
    addThread(PERSISTENT_THREAD_ID, 'UnitPulse');
    return <Navigate to={`/search/${PERSISTENT_THREAD_ID}/property/${propertyId}`} replace />;
  }

  if (notFound) return <Navigate to="/" replace />;
  if (!property) return null;

  const isFavorite = favorites.some((f) => f.id === property.id);

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

      {/* Breadcrumbs — also rendered as BreadcrumbList JSON-LD for SEO. */}
      <nav
        aria-label="Breadcrumb"
        className="w-full px-4 md:px-8 py-3 bg-white border-b border-black/5"
      >
        <ol className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-500">
          <li className="flex items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-black transition-colors">
              <Home size={12} />
              <span>Home</span>
            </Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="flex items-center gap-2">
            <Link to="/listings" className="hover:text-black transition-colors">Listings</Link>
            <ChevronRight size={12} className="text-neutral-300" />
          </li>
          <li className="text-black font-medium truncate" aria-current="page">
            {property.title}
          </li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: window.location.origin + '/' },
              { '@type': 'ListItem', position: 2, name: 'Listings', item: window.location.origin + '/listings' },
              { '@type': 'ListItem', position: 3, name: property.title },
            ],
          }),
        }}
      />

      {/* Property detail body — uses PropertyDetailsView in inline mode so it
          fills the page below the nav + breadcrumb chrome. */}
      <div className="flex-1 min-h-0">
        <PropertyDetailsView
          property={property}
          onClose={() => navigate('/')}
          isFavorite={isFavorite}
          onToggleFavorite={() => toggleFavorite(property)}
          isInline
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
};

export default PropertyDetailPage;
