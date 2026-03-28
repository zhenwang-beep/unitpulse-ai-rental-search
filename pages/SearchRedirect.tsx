import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MOCK_PROPERTIES } from '../constants';
import { ChatMessage } from '../types';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const SearchRedirect: React.FC = () => {
  const { addThread } = useAppContext();
  const location = useLocation();
  const state = location.state as { query?: string; propertyId?: string } | null;
  const query = state?.query;
  const propertyId = state?.propertyId;

  // Generate and register the thread synchronously — ref prevents double-creation in StrictMode
  const chatIdRef = useRef<string | null>(null);
  if (!chatIdRef.current) {
    chatIdRef.current = generateId();
    const initialMessages: ChatMessage[] = [];
    if (propertyId) {
      const property = MOCK_PROPERTIES.find(p => p.id === propertyId);
      if (property) {
        initialMessages.push({
          id: generateId(),
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
    addThread(chatIdRef.current, 'New Chat', initialMessages);
  }

  const destination = propertyId
    ? `/search/${chatIdRef.current}/property/${propertyId}`
    : `/search/${chatIdRef.current}`;

  return (
    <Navigate
      to={destination}
      state={{ query }}
      replace
    />
  );
};

export default SearchRedirect;
