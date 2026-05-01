import React, { useState } from 'react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';
import PrivacyPolicyUpleasing from '../components/legal/PrivacyPolicyUpleasing';

interface UpleasingPrivacyPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const UpleasingPrivacyPage: React.FC<UpleasingPrivacyPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

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
      <PrivacyPolicyUpleasing />
      <PageFooter />
    </div>
  );
};

export default UpleasingPrivacyPage;
