import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, LogOut, Menu, X, Building } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface PrivacyPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ isLoggedIn, isDropdownOpen, setIsDropdownOpen, setShowLoginView, handleLogout }) => {
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
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: April 1, 2026</p>

        <div className="space-y-8 text-neutral-600 text-[15px] leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-black mb-3">1. Information We Collect</h2>
            <p className="mb-3">We collect information you provide directly when using UnitPulse, including:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Account information (name, email address) when you create an account</li>
              <li>Search preferences and conversation data when you interact with our AI assistant</li>
              <li>Saved properties and favorites</li>
              <li>Device and browser information for analytics and service improvement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Provide, personalize, and improve our rental search service</li>
              <li>Train and improve our AI models to deliver better recommendations</li>
              <li>Communicate with you about your account and service updates</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Protect against fraud and unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">3. Data Sharing</h2>
            <p>We do not sell your personal information to third parties. We may share data with trusted service providers who assist us in operating our platform, subject to confidentiality agreements. We may also disclose information when required by law or to protect our rights.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information, including encryption in transit and at rest. However, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">5. Cookies and Tracking</h2>
            <p>We use cookies and similar technologies to maintain your session, remember preferences, and analyze site traffic. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">6. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Object to or restrict certain processing</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">7. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">8. Children's Privacy</h2>
            <p>UnitPulse is not intended for users under the age of 18. We do not knowingly collect personal information from children.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-black mb-3">10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@unitpulse.ai" className="text-[#4A5D23] font-medium hover:underline">privacy@unitpulse.ai</a>.</p>
          </section>
        </div>
      </main>

      <PageFooter />
    </div>
  );
};

export default PrivacyPage;
