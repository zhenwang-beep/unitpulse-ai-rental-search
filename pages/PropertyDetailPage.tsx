import React, { useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import { useAppContext } from '../context/AppContext';
import { ChatMessage } from '../types';

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
    const greeting: ChatMessage = {
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
    };
    addThread(chatIdRef.current, 'New Chat', [greeting]);
  }

  return <Navigate to={`/search/${chatIdRef.current}/property/${propertyId}`} replace />;
};

export default PropertyDetailPage;
