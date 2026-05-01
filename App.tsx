import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { FEATURES } from './featureFlags';
import { motion } from 'motion/react';
import { Eye, EyeOff, X } from 'lucide-react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import ChatPage from './pages/ChatPage';
import SearchRedirect from './pages/SearchRedirect';
import PropertyPanel from './pages/PropertyPanel';
import PropertyDetailPage from './pages/PropertyDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FAQPage from './pages/FAQPage';
import RentalMarketsPage from './pages/RentalMarketsPage';
import CityRentalPage from './pages/CityRentalPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import PartnerPage from './pages/PartnerPage';
import TestPage from './pages/TestPage';
import SearchResultsPage from './pages/SearchResultsPage';
import AllListingsPage from './pages/AllListingsPage';
import StateIndexPage from './pages/StateIndexPage';
import CityIndexPage from './pages/CityIndexPage';
import FavoritesPage from './components/FavoritesPage';
import Toast, { ToastData } from './components/Toast';
import { Property } from './types';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const { toggleFavorite, clearFavorites } = useAppContext();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingFavoriteProperty, setPendingFavoriteProperty] = useState<Property | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLoginView(false);
    if (pendingFavoriteProperty) {
      toggleFavorite(pendingFavoriteProperty);
      setPendingFavoriteProperty(null);
      setToast({
        message: 'Added to Favorites',
        subtext: 'Find it in your account menu',
        actionLabel: 'View Favorites →',
        onAction: () => navigate('/favorites'),
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    clearFavorites();
  };

  return (
    <>
      {showLoginView && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img src={LOGO_URL} alt="UnitPulse" className="h-12" />
              </div>
              <h1 className="text-3xl font-black text-black uppercase tracking-wider">Welcome to UnitPulse</h1>
              <p className="text-neutral-500 font-medium">Find your perfect home with AI-powered search.</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full h-14 bg-white border-2 border-black/5 rounded-2xl flex items-center justify-center gap-3 hover:bg-neutral-50 transition-all group"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5" />
                <span className="text-sm font-black text-black uppercase tracking-wider">Continue with Google</span>
              </button>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/5"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider font-black text-neutral-400 bg-white px-4">Or</div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Email Address</label>
                  <input id="login-email" type="email" placeholder="you@example.com" autoComplete="email" className="w-full h-14 px-6 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-password" className="text-xs font-bold text-neutral-600 uppercase tracking-wider px-1">Password</label>
                  <div className="relative">
                    <input id="login-password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" className="w-full h-14 px-6 pr-14 bg-neutral-50 border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-black transition-all" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button onClick={handleLogin} className="w-full h-14 bg-black text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:bg-neutral-800 transition-all">
                  Sign In
                </button>
              </div>
            </div>

            <div className="text-center">
              <button className="text-xs font-medium text-neutral-400 hover:text-black transition-colors">
                Don't have an account? <span className="text-black font-semibold">Sign up</span>
              </button>
            </div>

            <button
              onClick={() => setShowLoginView(false)}
              className="absolute top-8 right-8 p-3 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}

      <Toast toast={toast} onDismiss={dismissToast} />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              setPendingFavoriteProperty={setPendingFavoriteProperty}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        {FEATURES.AI_CHAT && (
          <Route path="/search" element={<SearchRedirect />} />
        )}
        {FEATURES.AI_CHAT ? (
          <Route
            path="/search/:chatId"
            element={
              <ChatPage
                isLoggedIn={isLoggedIn}
                setShowLoginView={setShowLoginView}
                setPendingFavoriteProperty={setPendingFavoriteProperty}
                handleLogout={handleLogout}
                showToast={setToast}
              />
            }
          >
            <Route path="property/:propertyId" element={<PropertyPanel />} />
          </Route>
        ) : (
          <Route
            path="/search"
            element={
              <SearchResultsPage
                isLoggedIn={isLoggedIn}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                setShowLoginView={setShowLoginView}
                setPendingFavoriteProperty={setPendingFavoriteProperty}
                handleLogout={handleLogout}
                showToast={setToast}
              />
            }
          />
        )}
        <Route
          path="/listings"
          element={
            <AllListingsPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              setPendingFavoriteProperty={setPendingFavoriteProperty}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        {/* Legacy property URL — fetches by id, then 301s to canonical hierarchy URL. */}
        <Route
          path="/property/:propertyId"
          element={
            <PropertyDetailPage
              mode="legacy"
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        {/* Canonical URL hierarchy — see urlHelpers.ts for valid state/city combos.
            TODO(seo): add neighborhood layer (/:state/:city/:neighborhood/:slug) once
            properties carry a neighborhoodSlug field. */}
        <Route
          path="/:state"
          element={
            <StateIndexPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/:state/:city"
          element={
            <CityIndexPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              setPendingFavoriteProperty={setPendingFavoriteProperty}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/:state/:city/:slug"
          element={
            <PropertyDetailPage
              mode="canonical"
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route path="/favorites" element={
          <FavoritesPage
            isLoggedIn={isLoggedIn}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowLoginView={setShowLoginView}
            handleLogout={handleLogout}
          />
        } />
        <Route
          path="/blog"
          element={
            <BlogPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/blog/:id"
          element={
            <BlogPostPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/faq"
          element={
            <FAQPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/rentals"
          element={
            <RentalMarketsPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route
          path="/rentals/:citySlug"
          element={
            <CityRentalPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              handleLogout={handleLogout}
              showToast={setToast}
            />
          }
        />
        <Route path="/privacy" element={
          <PrivacyPage
            isLoggedIn={isLoggedIn}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowLoginView={setShowLoginView}
            handleLogout={handleLogout}
            showToast={setToast}
          />
        } />
        <Route path="/terms" element={
          <TermsPage
            isLoggedIn={isLoggedIn}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowLoginView={setShowLoginView}
            handleLogout={handleLogout}
            showToast={setToast}
          />
        } />
        <Route path="/partner" element={
          <PartnerPage
            isLoggedIn={isLoggedIn}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setShowLoginView={setShowLoginView}
            handleLogout={handleLogout}
            showToast={setToast}
          />
        } />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppShell />
    </AppContextProvider>
  );
};

export default App;
