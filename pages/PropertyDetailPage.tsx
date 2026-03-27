import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  const isFavorite = favorites.some(f => f.id === propertyId);

  const handleClose = () => {
    navigate('/');
  };

  // Use declarative redirect — never call navigate() during render
  if (!property) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
      <PropertyDetailsModal
        property={property}
        onClose={handleClose}
        isFavorite={isFavorite}
        onToggleFavorite={(id) => {
          const prop = MOCK_PROPERTIES.find(p => p.id === id);
          if (prop) toggleFavorite(prop);
        }}
        isInline={false}
      />
    </div>
  );
};

export default PropertyDetailPage;
