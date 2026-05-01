import React, { useState } from 'react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';

interface TermsPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const TermsPage: React.FC<TermsPageProps> = ({ isLoggedIn, isDropdownOpen, setIsDropdownOpen, setShowLoginView, handleLogout }) => {
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
