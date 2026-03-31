import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_PROPERTIES, PERSISTENT_THREAD_ID } from '../constants';
import { ChatMessage } from '../types';

const SearchRedirect: React.FC = () => {
  const { addThread } = useAppContext();
  const location = useLocation();
  const state = location.state as { query?: string; propertyId?: string } | null;
  const query = state?.query;
  const propertyId = state?.propertyId;

  // Ensure the persistent thread exists (addThread is a no-op if it already exists)
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    const initialMessages: ChatMessage[] = [];
    if (propertyId) {
      const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (property) {
        initialMessages.push({
          id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
          role: 'assistant',
          text: `I see you're exploring **${property.title}** in ${property.location}. Great choice! I'm here to help you dig into every detail — lease terms, neighborhood highlights, availability, or how this fits your lifestyle. What would you like to know?`,
          timestamp: Date.now(),
          suggestedReplies: [
            'What are the lease terms?',
            'Tell me about the neighborhood',
            'How does this compare to similar listings?',
            "What's included in the rent?",
          ],
        });
      }
    }
    addThread(PERSISTENT_THREAD_ID, 'UnitPulse', initialMessages);
  }

  const destination = propertyId
    ? `/search/${PERSISTENT_THREAD_ID}/property/${propertyId}`
    : `/search/${PERSISTENT_THREAD_ID}`;

  return (
    <Navigate
      to={destination}
      state={{ query }}
      replace
    />
  );
};

export default SearchRedirect;
