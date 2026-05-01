import React, { useEffect } from 'react';
import FadeIn from '../partner/ui/FadeIn';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h1 className="font-serif text-5xl text-black mb-6">Privacy Policy</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-16">Last Updated: April 30, 2026</p>

          <div className="space-y-12 text-gray-600 leading-relaxed font-light">
            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">1. Introduction</h3>
              <p className="mb-4">
                UnitPulse AI ("we," "our," or "us") provides an AI-powered workforce for property management and leasing. We respect your privacy and are committed to protecting the personal information of our clients, their residents, and prospective tenants.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, submit an inquiry on a UnitPulse-hosted property landing page (e.g., narikoreatown.unitpulse.ai), submit a contact or demo request on unitpulse.ai, or use the UnitPulse AI platform.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">2. Information We Collect</h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li><strong className="text-black font-medium">Client Data:</strong> Business contact information, property details, and system integration credentials (e.g., Yardi, Entrata, RealPage access).</li>
                <li><strong className="text-black font-medium">Prospect Data (Renters):</strong> Information collected during AI conversations or via inquiry forms on property landing pages, including names, email addresses, phone numbers, housing preferences, income data (for screening), and identification documents.</li>
                <li><strong className="text-black font-medium">Business Inquiry Data:</strong> When you submit a demo or contact request on unitpulse.ai, we collect your name, business email, phone number, company, role, and any details you provide in the form.</li>
                <li><strong className="text-black font-medium">Usage Data:</strong> Metadata regarding how you interact with our AI agents, response times, and session durations.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">3. How We Use Your Data</h3>
              <p className="mb-4">We use the collected data to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li>Automate leasing workflows including inquiry responses, tour scheduling, and application screening.</li>
                <li>Send SMS, email, and voice communications related to your inquiry (see Section 4 for SMS specifics).</li>
                <li>Respond to demo requests and sales inquiries.</li>
                <li>Verify identity and income for lease applications.</li>
                <li>Train and improve our AI models (using anonymized and aggregated data only).</li>
                <li>Ensure compliance with Fair Housing laws and other regulations.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">4. SMS Messaging Program</h3>
              <p className="mb-4">
                If you provide your phone number through one of our inquiry or contact forms, you consent to receive SMS text messages from UnitPulse related to your inquiry. Message frequency varies based on the conversation. Message and data rates may apply. Reply <strong className="text-black font-medium">HELP</strong> for help or <strong className="text-black font-medium">STOP</strong> to unsubscribe at any time. Opting out of SMS will not affect your ability to use our other services.
              </p>
              <p className="mb-4">
                <strong className="text-black font-medium">We do not share, sell, or rent mobile phone numbers or SMS opt-in data with any third parties for their own marketing purposes. SMS opt-in consent is not shared with third parties under any circumstances.</strong>
              </p>
              <p>
                For prospective renter inquiries on property landing pages, your contact information (including phone number) may be shared with the specific property management company that owns or manages the listing you inquired about, solely so they can respond to your inquiry. This is a service provider relationship and is not for third-party marketing.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">5. Data Sharing & Integrations</h3>
              <p>
                UnitPulse AI integrates directly with Property Management Systems (PMS). Data collected by our agents is synchronized with your designated PMS. We do not sell personal data to third-party advertisers. We may share data with service providers (e.g., cloud hosting, SMS gateways such as Twilio) solely to provide our services, under contractual confidentiality obligations.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">6. Your Choices</h3>
              <p className="mb-4">You may:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li>Reply <strong className="text-black font-medium">STOP</strong> to any SMS message to opt out of further messages from that program.</li>
                <li>Unsubscribe from marketing emails using the link in any email.</li>
                <li>Request access, correction, or deletion of your personal information by emailing <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a>.</li>
              </ul>
              <p>
                If you are a California resident, you have additional rights under the CCPA, including the right to know what personal information we collect and the right to request deletion. Contact <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a> to exercise these rights.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">7. Security</h3>
              <p>
                We implement SOC2 Type II compliant security measures, including encryption in transit and at rest, strict access controls, and regular security audits to protect your information.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">8. Contact Us</h3>
              <p>
                If you have questions about this policy, please contact us at <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PrivacyPolicy;