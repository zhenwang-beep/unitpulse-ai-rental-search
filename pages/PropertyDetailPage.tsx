import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PERSISTENT_THREAD_ID } from '../constants';
import { useAppContext } from '../context/AppContext';

// Direct URL access to /property/:id — open in the persistent conversation thread
const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { addThread } = useAppContext();

  if (!propertyId) return <Navigate to="/" replace />;

  // Ensure persistent thread exists (no-op if already created)
  addThread(PERSISTENT_THREAD_ID, 'UnitPulse');

  return <Navigate to={`/search/${PERSISTENT_THREAD_ID}/property/${propertyId}`} replace />;
};

export default PropertyDetailPage;
