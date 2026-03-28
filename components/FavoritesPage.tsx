import React from 'react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';
import { X, Heart } from 'lucide-react';

interface FavoritesPageProps {
  favorites: Property[];
  onToggleFavorite: (property: Property) => void;
  onPropertyClick: (property: Property) => void;
  onClose: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites, onToggleFavorite, onPropertyClick, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#FCF9F8] z-[100] overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-black font-heading tracking-tighter text-black">
            Saved Homes ({favorites.length})
          </h1>
          <button onClick={onClose} className="p-3 hover:bg-neutral-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
              <Heart size={48} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-black mb-4">
              Sorry, there are no saved homes currently.
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto">
              When you find a home you love, click the heart icon to save it here for easy access later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {favorites.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                isFavorite={true} 
                onToggleFavorite={onToggleFavorite} 
                onClick={onPropertyClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
