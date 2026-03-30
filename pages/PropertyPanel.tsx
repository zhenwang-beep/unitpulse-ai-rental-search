import React from 'react';
import { useParams, useNavigate, Navigate, useOutletContext } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

type OutletCtx = { isLoggedIn: boolean; setShowLoginView: (v: boolean) => void };

const PropertyPanel: React.FC = () => {
  const { chatId, propertyId } = useParams<{ chatId: string; propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const { isLoggedIn, setShowLoginView } = useOutletContext<OutletCtx>();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  const isFavorite = favorites.some(f => f.id === propertyId);

  // Use declarative redirect — never call navigate() during render
  if (!property) {
    return <Navigate to={`/search/${chatId}`} replace />;
  }

  const handleToggleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginView(true);
      return;
    }
    const prop = MOCK_PROPERTIES.find(p => p.id === id);
    if (prop) toggleFavorite(prop);
  };

  return (
    <PropertyDetailsModal
      property={property}
      onClose={() => navigate(`/search/${chatId}`)}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      isInline={true}
    />
  );
};

export default PropertyPanel;
