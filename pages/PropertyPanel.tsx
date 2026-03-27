import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

const PropertyPanel: React.FC = () => {
  const { chatId, propertyId } = useParams<{ chatId: string; propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  const isFavorite = favorites.some(f => f.id === propertyId);

  // Use declarative redirect — never call navigate() during render
  if (!property) {
    return <Navigate to={`/search/${chatId}`} replace />;
  }

  return (
    <PropertyDetailsModal
      property={property}
      onClose={() => navigate(`/search/${chatId}`)}
      isFavorite={isFavorite}
      onToggleFavorite={(id) => {
        const prop = MOCK_PROPERTIES.find(p => p.id === id);
        if (prop) toggleFavorite(prop);
      }}
      isInline={true}
    />
  );
};

export default PropertyPanel;
