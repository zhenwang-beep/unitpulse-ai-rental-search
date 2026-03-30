// components/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PropertyCard from './PropertyCard';
import Toast, { ToastData } from './Toast';
import { Property } from '../types';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [toast, setToast] = useState<ToastData | null>(null);

  const handleToggleFavorite = (property: Property) => {
    const isRemoving = favorites.some(p => p.id === property.id);
    toggleFavorite(property);
    if (isRemoving) {
      setToast({ message: 'Removed from Saved Homes' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FCF9F8] font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF9F8]/90 backdrop-blur-sm border-b border-black/5 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black font-heading tracking-tight text-black">
            Saved Homes {favorites.length > 0 && `(${favorites.length})`}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
              <Heart size={48} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-black mb-4">
              No saved homes yet.
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
