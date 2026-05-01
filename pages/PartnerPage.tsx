import React, { useState, useEffect } from 'react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';
import Hero from '../components/partner/Hero';
import Clients from '../components/partner/Clients';
import Stats from '../components/partner/Stats';
import FeatureCanvas from '../components/partner/FeatureCanvas';
import PathRecommendation from '../components/partner/PathRecommendation';
import Pricing from '../components/partner/Pricing';
import CallToAction from '../components/partner/CallToAction';
import ContactModal from '../components/partner/ContactModal';

interface PartnerPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const PartnerPage: React.FC<PartnerPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  const openContactModal = (emailOrEvent?: string | React.MouseEvent) => {
    if (typeof emailOrEvent === 'string') {
      setPrefilledEmail(emailOrEvent);
    } else {
      setPrefilledEmail('');
    }
    setIsContactModalOpen(true);
  };

  // Smooth scroll to anchor on initial mount if hash present
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.replace('#', '');
    if (!id) return;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // PartnerPage uses natural body scroll (rather than the rental site's inner-scroll container)
  // so framer-motion's `useScroll` in FeatureCanvas can track window scroll for its animations.
  // TopNav falls back to window.scrollY when no scrollY prop is passed.
  return (
    <div className="w-full bg-app-bg text-black font-sans">
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-scroll"
      />

      <main>
        <Hero onOpenModal={openContactModal} />
        <Clients />
        <Stats />
        <FeatureCanvas />
        <PathRecommendation onOpenModal={() => openContactModal()} />
        <Pricing onOpenModal={() => openContactModal()} />
        <CallToAction onOpenModal={() => openContactModal()} />
      </main>

      <PageFooter />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        initialEmail={prefilledEmail}
      />
    </div>
  );
};

export default PartnerPage;
