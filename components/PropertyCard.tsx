import React, { useState } from 'react';
import { Property } from '../types';
import { Heart, MapPin, Bed, Bath, Ruler, Star, ChevronLeft, ChevronRight, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContactFormModal from './ContactFormModal';
import { useTracker } from '../hooks/useTracker';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (property: Property) => void;
  onClick?: (property: Property) => void;
  showDescription?: boolean;
  isLoggedIn?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, isFavorite, onToggleFavorite, onClick, showDescription = false, isLoggedIn = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTourModal, setShowTourModal] = useState(false);
  const images = property.images || [`https://picsum.photos/seed/${property.imageSeed}/800/600`];
  const { trackView, trackPhotoNav, trackFavorite, trackTourSchedule } = useTracker();

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(newIndex);
    trackPhotoNav(property.id, newIndex, images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    trackPhotoNav(property.id, newIndex, images.length);
  };

  return (
    <>
    <div
      className="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-500 overflow-hidden border border-black/5 cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => { trackView(property); onClick?.(property); }}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
            >
              <ChevronRight size={16} />
            </button>
            <div className="absolute bottom-4 right-4 flex gap-1 z-10">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 h-1 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-3' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-white text-xs font-bold uppercase tracking-wider rounded-md text-black shadow-sm">
              {property.type}
            </span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            trackFavorite(property.id, !isFavorite);
            onToggleFavorite(property);
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite ? 'bg-black text-white' : 'bg-white/20 text-white hover:bg-white hover:text-black'}`}
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 text-white">
           <p className="text-xl font-extrabold font-heading tracking-tight flex items-baseline">
             ${property.price.toLocaleString()}+
             <span className="text-xs font-medium opacity-70 ml-1">/mo</span>
           </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-2 text-black group-hover:underline decoration-2 underline-offset-4 transition-all line-clamp-1">
          {property.title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </h2>

        <p className="text-sm text-neutral-600 mb-4 flex items-center">
          <MapPin size={14} className="mr-1.5 shrink-0" />
          <span className="truncate">
            {property.location.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </p>

        <div className="flex gap-4 text-xs font-medium mb-4 text-black border-y border-black/5 py-3">
          <div className="flex items-center gap-1.5">
            <Bed size={14} />
            <span>{property.bedsRange || `${property.bedrooms} Bed`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath size={14} />
            <span>{property.bathsRange || `${property.bathrooms} Bath`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Ruler size={14} />
            <span>{property.sqftRange ? (property.sqftRange.includes('SF') ? property.sqftRange : `${property.sqftRange} SF`) : `${property.sqft} SF`}</span>
          </div>
        </div>
        
        {/* Description Preview — only shown when explicitly requested */}
        {showDescription && (
          <p className="text-xs leading-relaxed text-neutral-600 mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Amenities Tags */}
        <div className="flex flex-nowrap overflow-hidden gap-2 mb-4 mt-auto relative">
           {property.amenities.map((am, i) => (
             <span key={i} className="text-xs whitespace-nowrap shrink-0 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md">
               {am}
             </span>
           ))}
           {/* Optional fade out effect on the right edge */}
           <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:+1234567890'; }}
            aria-label="Call property"
            className="flex-1 py-2.5 bg-transparent hover:bg-neutral-50 text-black text-sm font-semibold transition-all flex items-center justify-center gap-1.5 rounded-lg overflow-hidden"
          >
            <Phone size={14} className="shrink-0" />
            <span className="truncate">(123) 456-7890</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); trackTourSchedule(property.id); setShowTourModal(true); }}
            aria-label="Schedule a tour"
            className="flex-1 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar size={14} className="shrink-0" />
            Tour
          </button>
        </div>
      </div>
    </div>

    {showTourModal && (
      <ContactFormModal
        mode="tour"
        property={property}
        isLoggedIn={isLoggedIn}
        onClose={() => setShowTourModal(false)}
      />
    )}
    </>
  );
};

export default PropertyCard;