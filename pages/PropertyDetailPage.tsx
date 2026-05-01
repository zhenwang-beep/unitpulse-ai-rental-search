import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { PERSISTENT_THREAD_ID } from '../constants';
import { useAppContext } from '../context/AppContext';
import { getPropertyById } from '../services/propertyService';
import { Property } from '../types';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { FEATURES } from '../featureFlags';

// Direct URL access to /property/:id —
// AI_CHAT on:  open in the persistent conversation thread (legacy behavior).
// AI_CHAT off: render PropertyDetailsModal inline as a standalone page so the
//              listing detail is reachable without the chat surface.
const PropertyDetailPage: React.FC = () => {
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
    <div className="h-[100dvh] w-full bg-surface-app overflow-y-auto">
      <PropertyDetailsModal
        property={property}
        onClose={() => navigate('/')}
        isFavorite={isFavorite}
        onToggleFavorite={() => toggleFavorite(property)}
        isInline
      />
    </div>
  );
};

export default PropertyDetailPage;
