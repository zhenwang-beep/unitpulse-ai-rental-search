import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, LogOut, Menu, X, Building } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface TermsPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ isLoggedIn, isDropdownOpen, setIsDropdownOpen, setShowLoginView, handleLogout }) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollYRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollY = e.currentTarget.scrollTop;
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

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen, setIsDropdownOpen]);

  return (
    <div className="h-[100dvh] w-full bg-[#FCF9F8] text-black font-sans overflow-y-auto scroll-smooth" onScroll={handleScroll}>
      {/* Header */}
      <header className={`w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'} ${isAtTop ? 'bg-[#FCF9F8]' : 'bg-white shadow-sm'}`}>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
            <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
                      <Heart size={16} /> Favorites
                      {favorites.length > 0 && <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLoginView(true)} className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all">Login</button>
            )}
          </nav>
          <button onClick={() => setIsHistoryOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[65]" onClick={() => setIsHistoryOpen(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-[70] border-l border-black/5 flex flex-col">
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <h2 className="font-heading font-bold text-lg tracking-wider">Menu</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Search size={20} className="text-neutral-400" /> Find a home</a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Building size={20} className="text-neutral-400" /> Become a partner</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: April 1, 2026</p>

        <div className="space-y-8 text-neutral-600 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using UnitPulse, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. Description of Service</h2>
            <p>UnitPulse provides an AI-powered rental search platform that helps users find rental properties through conversational AI. Our service includes property recommendations, search assistance, and related features.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>You must be at least 18 years old to create an account</li>
              <li>You are responsible for maintaining the security of your account credentials</li>
              <li>You agree to provide accurate and complete information</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Scrape, harvest, or collect data from the platform without permission</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. AI-Generated Content</h2>
            <p>UnitPulse uses artificial intelligence to provide property recommendations and search assistance. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. Property details, pricing, and availability should always be verified directly with property managers or landlords.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Intellectual Property</h2>
            <p>All content, features, and functionality of UnitPulse are owned by UnitPulse and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Limitation of Liability</h2>
            <p>UnitPulse is provided "as is" without warranties of any kind. We are not responsible for any decisions made based on information provided through our platform. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">8. Third-Party Links</h2>
            <p>Our service may contain links to third-party websites or services. We are not responsible for the content or practices of any third-party sites.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">9. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at any time for violations of these terms. You may also delete your account at any time. Upon termination, your right to use the service will immediately cease.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">10. Changes to Terms</h2>
            <p>We may modify these Terms of Service at any time. Continued use of the service after changes constitutes acceptance of the updated terms. We will provide notice of material changes.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">11. Governing Law</h2>
            <p>These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">12. Contact Us</h2>
            <p>If you have any questions about these Terms of Service, please contact us at <a href="mailto:legal@unitpulse.ai" className="text-[#4A5D23] font-medium hover:underline">legal@unitpulse.ai</a>.</p>
          </section>
        </div>
      </main>

      <PageFooter />
    </div>
  );
};

export default TermsPage;
