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

  // Always land on the chat page itself. Even when a propertyId is passed
  // (e.g. from clicking a card on the landing page), the user should see the
  // chat first and click into a property card from there — not have the
  // detail panel auto-open over the chat. The propertyId is forwarded as
  // initial-message context only, used inside the assistant greeting above.
  return (
    <Navigate
      to={`/search/${PERSISTENT_THREAD_ID}`}
      state={{ query }}
      replace
    />
  );
};

export default SearchRedirect;
