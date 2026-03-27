import React, { useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import { useAppContext } from '../context/AppContext';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Direct URL access to /property/:id — create a fresh chat and open the split view
const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { addThread } = useAppContext();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  if (!property) return <Navigate to="/" replace />;

  const chatIdRef = useRef<string | null>(null);
  if (!chatIdRef.current) {
    chatIdRef.current = generateId();
    addThread(chatIdRef.current);
  }

  return <Navigate to={`/search/${chatIdRef.current}/property/${propertyId}`} replace />;
};

export default PropertyDetailPage;
