import React, { useEffect } from 'react';
import FadeIn from '../partner/ui/FadeIn';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-12 md:pt-16 pb-24 bg-app-bg">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h1 className="font-heading text-5xl text-black mb-6">Terms of Service</h1>
          <p className="text-neutral-500 text-sm uppercase tracking-widest mb-16">
            Last Updated: April 30, 2026
          </p>

          <div className="space-y-12 text-neutral-600 leading-relaxed font-light">
            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">1. Acceptance of Terms</h3>
              <p>
                By accessing or using the UnitPulse AI platform ("Service"), provided by UnitPulse AI, Inc. ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">2. Description of Service</h3>
              <p className="mb-4">
                UnitPulse AI provides an artificial intelligence workforce for property management, including automated responses, tour scheduling, and lease drafting.
              </p>
              <p>
                <strong className="text-black font-medium">Disclaimer:</strong> While our AI agents are designed to be accurate, they may occasionally produce incorrect information ("hallucinations"). You acknowledge that UnitPulse AI is a software tool, not a licensed real estate broker or legal advisor. We recommend human oversight for critical decisions, particularly regarding Fair Housing compliance and lease execution.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">3. User Accounts & Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">4. Use of Data</h3>
              <p className="mb-4">
                By using the Service, you grant us a worldwide, non-exclusive license to use, reproduce, and display the data you provide solely for the purpose of providing and improving the Service.
              </p>
              <p>
                We may use anonymized and aggregated data derived from your use of the Service to train our machine learning models and improve performance for all users. We will never share your specific proprietary data or trade secrets with competitors.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">5. Acceptable Use</h3>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li>Use the Service to discriminate against any individual in violation of the Fair Housing Act or other applicable laws.</li>
                <li>Attempt to reverse engineer, decompile, or extract the source code or model weights of the AI agents.</li>
                <li>Use the Service to transmit spam, malware, or fraudulent content.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">6. UnitPulse SMS Program</h3>
              <p className="mb-4">
                <strong className="text-black font-medium">Program name:</strong> UnitPulse SMS Program
              </p>
              <p className="mb-4">
                <strong className="text-black font-medium">Program description:</strong> UnitPulse operates SMS messaging programs for two audiences:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li><strong className="text-black font-medium">Rental Inquiry Messaging:</strong> When you submit an inquiry on a UnitPulse-hosted property landing page (e.g., narikoreatown.unitpulse.ai), you may receive SMS messages related to your inquiry, including responses to questions, tour scheduling, application reminders, and move-in coordination.</li>
                <li><strong className="text-black font-medium">Business Inquiry Messaging:</strong> When you submit a contact or demo request on unitpulse.ai, you may receive SMS messages related to your inquiry, including demo scheduling, sales follow-ups, and product information.</li>
              </ul>
              <p className="mb-4">
                <strong className="text-black font-medium">Message frequency:</strong> Message frequency varies based on your conversation. Recipients typically receive 2–8 messages per inquiry.
              </p>
              <p className="mb-4">
                <strong className="text-black font-medium">Message and data rates:</strong> Message and data rates may apply. Check with your wireless carrier for details.
              </p>
              <p className="mb-4">
                <strong className="text-black font-medium">Help and opt-out instructions:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li>Reply <strong className="text-black font-medium">HELP</strong> to any message to receive support contact information.</li>
                <li>Reply <strong className="text-black font-medium">STOP</strong> to any message to unsubscribe at any time. You will receive a confirmation message and no further SMS messages from that program.</li>
              </ul>
              <p className="mb-4">
                <strong className="text-black font-medium">Supported carriers:</strong> The SMS program is available on major U.S. wireless carriers. Carriers are not liable for delayed or undelivered messages.
              </p>
              <p>
                <strong className="text-black font-medium">Support contact:</strong> For SMS support, email <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a>.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">7. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, UnitPulse AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with your use of the Service.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">8. Modifications to Service</h3>
              <p>
                We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">9. Contact</h3>
              <p>
                For legal inquiries, please contact us at <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a>.
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default TermsOfService;