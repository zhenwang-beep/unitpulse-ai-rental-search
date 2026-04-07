import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { Property } from '../types';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';
import { useDwellTime } from '../hooks/useTracker';
import { getPropertyById } from '../services/propertyService';

type OutletCtx = { isLoggedIn: boolean; setShowLoginView: (v: boolean) => void };

const PropertyPanel: React.FC = () => {
  const { chatId, propertyId } = useParams<{ chatId: string; propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const { isLoggedIn, setShowLoginView } = useOutletContext<OutletCtx>();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // Track how long the user spends viewing this property
  useDwellTime(propertyId);

  useEffect(() => {
    if (!propertyId) return;
    getPropertyById(propertyId)
      .then(p => setProperty(p))
      .finally(() => setLoading(false));
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
