// components/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PropertyCard from './PropertyCard';
import Toast, { ToastData } from './Toast';
import TopNav from './TopNav';
import { Property } from '../types';

interface FavoritesPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [toast, setToast] = useState<ToastData | null>(null);

  const handleToggleFavorite = (property: Property) => {
    const isRemoving = favorites.some(p => p.id === property.id);
    toggleFavorite(property);
    if (isRemoving) {
      setToast({ message: 'Removed from Favorites' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FCF9F8] font-sans">
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-static"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
              <Heart size={48} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-black mb-4">
              No favorites yet.
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              When you find a home you love, click the heart icon to save it here for easy access later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-semibold hover:bg-[#3a4e1a] transition-all"
            >
              Start browsing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onClick={(p) => navigate(`/property/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default FavoritesPage;
