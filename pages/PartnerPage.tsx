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
  const [scrollY, setScrollY] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [prefilledEmail, setPrefilledEmail] = useState('');

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

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

  return (
    <div className="h-[100dvh] w-full bg-[#FCF9F8] text-black font-sans overflow-y-auto scroll-smooth" onScroll={handleScroll}>
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-scroll"
        scrollY={scrollY}
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
