import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Property } from '../types';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

type OutletCtx = { isLoggedIn: boolean; setShowLoginView: (v: boolean) => void };

const PropertyPanel: React.FC = () => {
  const { chatId, propertyId } = useParams<{ chatId: string; propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const { isLoggedIn, setShowLoginView } = useOutletContext<OutletCtx>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    supabase.from('properties').select('*').eq('id', propertyId).single().then(({ data }) => {
      if (data) {
        setProperty({
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price,
          bedrooms: Number(data.bedrooms),
          bathrooms: Number(data.bathrooms),
          sqft: data.sqft,
          bedsRange: data.beds_range,
          bathsRange: data.baths_range,
          sqftRange: data.sqft_range,
          image: data.image,
          images: data.images ?? [],
          imageSeed: data.image_seed ?? data.id,
          amenities: data.amenities ?? [],
          coordinates: { lat: Number(data.lat) || 34.05, lng: Number(data.lng) || -118.25 },
          type: data.type as Property['type'],
          description: data.description,
          rating: Number(data.rating) || 4.5,
          floorPlans: data.floor_plans ?? [],
          pricingAndFees: data.pricing_and_fees ?? undefined,
        });
      }
      setLoading(false);
    });
  }, [propertyId]);

  const isFavorite = favorites.some(f => f.id === propertyId);

  if (loading) return null;
  if (!property) {
    navigate(`/search/${chatId}`, { replace: true });
    return null;
  }

  const handleToggleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginView(true);
      return;
    }
    if (property?.id === id) toggleFavorite(property);
  };

  return (
    <PropertyDetailsModal
      property={property}
      onClose={() => navigate(`/search/${chatId}`)}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      isInline={true}
      isLoggedIn={isLoggedIn}
    />
  );
};

export default PropertyPanel;
