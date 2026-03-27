import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const SearchRedirect: React.FC = () => {
  const { addThread } = useAppContext();
  const location = useLocation();
  const query = (location.state as { query?: string } | null)?.query;

  // Generate and register the thread synchronously — ref prevents double-creation in StrictMode
  const chatIdRef = useRef<string | null>(null);
  if (!chatIdRef.current) {
    chatIdRef.current = generateId();
    addThread(chatIdRef.current);
  }

  return (
    <Navigate
      to={`/search/${chatIdRef.current}`}
      state={{ query }}
      replace
    />
  );
};

export default SearchRedirect;
