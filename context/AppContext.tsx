import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Property } from '../types';

type Thread = { messages: ChatMessage[]; title: string };
type AllThreads = Record<string, Thread>;

interface AppContextValue {
  allThreads: AllThreads;
  addThread: (id: string, title?: string, initialMessages?: ChatMessage[]) => void;
  updateThread: (id: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  renameThread: (id: string, title: string) => void;
  deleteThread: (id: string) => void;
  favorites: Property[];
  toggleFavorite: (property: Property) => void;
  clearFavorites: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'unitpulse_threads';
const FAV_STORAGE_KEY = 'unitpulse_favorites';

function loadThreads(): AllThreads {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadFavorites(): Property[] {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allThreads, setAllThreads] = useState<AllThreads>(loadThreads);
  // Always start with empty favorites — isLoggedIn is not persisted,
  // so we can't know if the user is authenticated on a fresh page load.
  const [favorites, setFavorites] = useState<Property[]>([]);

  // Persist allThreads to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allThreads));
  }, [allThreads]);

  const addThread = (id: string, title = 'New Chat', initialMessages: ChatMessage[] = []) => {
    setAllThreads(prev => {
      if (prev[id]) return prev; // Don't overwrite existing thread
      return { ...prev, [id]: { messages: initialMessages, title } };
    });
  };

  const updateThread = (id: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setAllThreads(prev => {
      const current = prev[id]?.messages || [];
      return {
        ...prev,
        [id]: { ...prev[id], messages: updater(current) }
      };
    });
  };

  const renameThread = (id: string, title: string) => {
    setAllThreads(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], title } };
    });
  };

  const deleteThread = (id: string) => {
    setAllThreads(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const toggleFavorite = (property: Property) => {
    setFavorites(prev =>
      prev.find(p => p.id === property.id)
        ? prev.filter(p => p.id !== property.id)
        : [...prev, property]
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem(FAV_STORAGE_KEY);
  };

  return (
    <AppContext.Provider value={{ allThreads, addThread, updateThread, renameThread, deleteThread, favorites, toggleFavorite, clearFavorites }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider');
  return ctx;
};
