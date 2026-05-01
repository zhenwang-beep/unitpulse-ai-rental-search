import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, LogOut, Menu, X, Building } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

export interface TopNavProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  /**
   * 'sticky-scroll' = hides on scroll down, shows on scroll up (LandingPage / FAQPage / Privacy / Terms / RentalMarkets / CityRental / BlogPost)
   * 'sticky-static' = always visible white background (BlogPage)
   * 'static' = no sticky, no scroll behavior (ChatPage uses its own header — not used here)
   */
  variant?: 'sticky-scroll' | 'sticky-static';
  /** Provide the scroll position to drive the hide/show logic (when caller manages its own scroll container). */
  scrollY?: number;
  /** Optional: callback when "Become a partner" is clicked (default navigates to /partner). */
  onPartnerClick?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
  variant = 'sticky-scroll',
  scrollY,
  onPartnerClick,
}) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Drive scroll behavior from caller-provided scrollY when available; otherwise use window scroll.
  useEffect(() => {
    if (variant !== 'sticky-scroll') return;

    const apply = (currentScrollY: number) => {
      setIsAtTop(currentScrollY < 20);
      if (currentScrollY < 100) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > lastScrollYRef.current + 5) {
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollYRef.current - 5) {
        setIsHeaderVisible(true);
      }
      lastScrollYRef.current = currentScrollY;
    };

    if (scrollY !== undefined) {
      apply(scrollY);
      return;
    }

    const onWindowScroll = () => apply(window.scrollY);
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', onWindowScroll);
  }, [variant, scrollY]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen, setIsDropdownOpen]);

  const handlePartnerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onPartnerClick) {
      onPartnerClick();
    } else {
      navigate('/partner');
    }
  };

  const headerClass =
    variant === 'sticky-static'
      ? 'w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 bg-white shadow-sm'
      : `w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isAtTop ? 'bg-[#FCF9F8]' : 'bg-white shadow-sm'}`;

  return (
    <>
      <header className={headerClass}>
        <div className="w-full flex justify-between items-center">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="text-sm font-medium hover:text-black/60 transition-colors"
            >
              Find a home
            </a>
            <a
              href="/partner"
              onClick={handlePartnerClick}
              className="text-sm font-medium hover:text-black/60 transition-colors"
            >
              Become a partner
            </a>
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">
                    FZ
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button
                      onClick={() => {
                        navigate('/favorites');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Heart size={16} /> Favorites
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
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[65]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[70] border-l border-black/5 flex flex-col"
            >
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">
                      FZ
                    </div>
                    <div>
                      <p className="font-bold text-sm">Welcome back</p>
                      <p className="text-xs text-neutral-500">Logged in</p>
                    </div>
                  </div>
                ) : (
                  <h2 className="font-heading font-bold text-lg tracking-wider">Welcome to UnitPulse</h2>
                )}
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"
                >
                  <Search size={20} className="text-neutral-400" /> Find a home
                </a>
                <a
                  href="/partner"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onPartnerClick) {
                      onPartnerClick();
                    } else {
                      navigate('/partner');
                    }
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"
                >
                  <Building size={20} className="text-neutral-400" /> Become a partner
                </a>
                {isLoggedIn && (
                  <>
                    <a
                      href="/favorites"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/favorites');
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"
                    >
                      <Heart size={20} className="text-neutral-400" /> Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </a>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-red-600 transition-colors font-medium text-left"
                    >
                      <LogOut size={20} /> Logout
                    </button>
                  </>
                )}
                {!isLoggedIn && (
                  <button
                    onClick={() => {
                      setShowLoginView(true);
                      setIsMenuOpen(false);
                    }}
                    className="mt-4 w-full px-5 py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-bold hover:bg-[#3a4e1a] transition-all"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default TopNav;
