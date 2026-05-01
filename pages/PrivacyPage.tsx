import React, { useState, useRef } from 'react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';

interface PrivacyPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ isLoggedIn, isDropdownOpen, setIsDropdownOpen, setShowLoginView, handleLogout }) => {
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
