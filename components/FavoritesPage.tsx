// components/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogOut, Menu, X, Search, FileText, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import PropertyCard from './PropertyCard';
import Toast, { ToastData } from './Toast';
import { Property } from '../types';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface FavoritesPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [toast, setToast] = useState<ToastData | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleFavorite = (property: Property) => {
    const isRemoving = favorites.some(p => p.id === property.id);
    toggleFavorite(property);
    if (isRemoving) {
      setToast({ message: 'Removed from Favorites' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FCF9F8] font-sans">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 bg-white shadow-sm">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
            <a href="/blog" className="text-sm font-medium hover:text-black/60 transition-colors">Blog</a>
            <a href="/faq" className="text-sm font-medium hover:text-black/60 transition-colors">FAQ</a>
            <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
            {isLoggedIn ? (
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button
                      onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Heart size={16} />
                      Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginView(true)}
                className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all"
              >
                Login
              </button>
            )}
          </nav>
          <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[65]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] border-r border-black/5 flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={LOGO_URL} alt="UnitPulse" className="h-6" />
                  <h2 className="font-heading font-bold text-lg tracking-wider">UnitPulse</h2>
                </div>
                <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="p-6 border-b border-black/5 flex flex-col gap-6">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-black/5">
                      <div className="w-12 h-12 rounded-full bg-[#4A5D23] text-white text-sm font-black flex items-center justify-center shadow-sm">FZ</div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-neutral-900">Felix Zhou</span>
                        <span className="text-xs font-medium text-neutral-500">felix.zhou@gmail.com</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <h3 className="text-lg font-bold text-neutral-900">Welcome to UnitPulse</h3>
                      <button onClick={() => { setShowLoginView(true); setIsMenuOpen(false); }} className="w-full py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-medium hover:bg-[#3a4e1a] transition-all">Login / Sign up</button>
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Search size={20} className="text-neutral-400" />Find a home</a>
                    <a href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><FileText size={20} className="text-neutral-400" />Blog</a>
                    <a href="/faq" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><FileText size={20} className="text-neutral-400" />FAQ</a>
                    {isLoggedIn && (
                      <button onClick={() => { navigate('/favorites'); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 text-[#4A5D23] transition-colors font-medium w-full text-left">
                        <Heart size={20} className="text-[#4A5D23]" />Favorites
                        {favorites.length > 0 && <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}
                      </button>
                    )}
                  </div>
                  <div className="h-px bg-neutral-100 w-full" />
                  <div className="flex flex-col gap-1">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Building size={20} className="text-neutral-400" />Become a partner</a>
                  </div>
                  {isLoggedIn && (
                    <>
                      <div className="h-px bg-neutral-100 w-full" />
                      <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium w-full text-left">
                        <LogOut size={20} className="text-red-400" />Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
              <Heart size={48} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-black mb-4">
              No favorites yet.
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              When you find a home you love, click the heart icon to save it here for easy access later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-semibold hover:bg-[#3a4e1a] transition-all"
            >
              Start browsing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onClick={(p) => navigate(`/property/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default FavoritesPage;
