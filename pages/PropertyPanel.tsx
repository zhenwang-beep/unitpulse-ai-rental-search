import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Property } from '../types';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

const SUPABASE_URL = 'https://qrcajdeipgefbceaxswv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyY2FqZGVpcGdlZmJjZWF4c3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzA1MjcsImV4cCI6MjA5MDY0NjUyN30.02X7yELYEzOmnBKRGP8fU8fKVFEA0xijLJTG63LSLhM';
const DB_HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

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
    fetch(`${SUPABASE_URL}/rest/v1/properties?id=eq.${propertyId}&select=*&limit=1`, { headers: DB_HEADERS })
      .then(r => r.json())
      .then((rows: Record<string, unknown>[]) => {
        const data = rows[0];
        if (data) {
          setProperty({
            id: data.id as string,
            title: data.title as string,
            location: data.location as string,
            price: data.price as number,
            bedrooms: Number(data.bedrooms),
            bathrooms: Number(data.bathrooms),
            sqft: data.sqft as number,
            bedsRange: data.beds_range as string | undefined,
            bathsRange: data.baths_range as string | undefined,
            sqftRange: data.sqft_range as string | undefined,
            image: data.image as string,
            images: (data.images as string[]) ?? [],
            imageSeed: (data.image_seed as string) ?? String(data.id),
            amenities: (data.amenities as string[]) ?? [],
            coordinates: { lat: Number(data.lat) || 34.05, lng: Number(data.lng) || -118.25 },
            type: data.type as Property['type'],
            description: data.description as string,
            rating: Number(data.rating) || 4.5,
            floorPlans: (data.floor_plans as Property['floorPlans']) ?? [],
            pricingAndFees: (data.pricing_and_fees as Property['pricingAndFees']) ?? undefined,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
