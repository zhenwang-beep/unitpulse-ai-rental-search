import React, { useEffect } from 'react';
import FadeIn from '../partner/ui/FadeIn';

const PrivacyPolicyUpleasing: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="pt-40 pb-24 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <h1 className="font-serif text-5xl text-black mb-6">Privacy Policy for UP Leasing</h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-16">Last Updated: April 20, 2026</p>
          <p className="text-gray-400 text-xs mb-16">Effective Date: April 20, 2026 | App Version: 1.0.3</p>

          <div className="space-y-12 text-gray-600 leading-relaxed font-light">
            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">1. Introduction</h3>
              <p className="mb-4">
                UP Leasing ("we," "our," or "us") is a mobile application designed for leasing agents and property management professionals. The app enables users to record apartment tour conversations and receive AI-powered analysis to improve leasing outcomes.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the UP Leasing mobile application (available on iOS App Store).
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">2. Information We Collect</h3>

              <h4 className="text-black font-semibold mb-2">2.1 Account Information</h4>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li><strong className="text-black font-medium">Google Account:</strong> When you sign in via Google SSO, we receive your name, email address, and Google profile information.</li>
                <li><strong className="text-black font-medium">Authentication Token:</strong> We securely store a JWT token issued by our backend server for session management.</li>
              </ul>

              <h4 className="text-black font-semibold mb-2">2.2 Audio Recordings</h4>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li><strong className="text-black font-medium">Tour Recordings:</strong> Audio recordings (m4a format) of apartment tours between leasing agents and prospects.</li>
                <li><strong className="text-black font-medium">Recording Metadata:</strong> Duration, timestamp, property ID, unit number, and prospect information you provide.</li>
              </ul>

              <h4 className="text-black font-semibold mb-2">2.3 AI Analysis Data</h4>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li><strong className="text-black font-medium">Transcripts:</strong> AI-generated transcriptions of recorded conversations.</li>
                <li><strong className="text-black font-medium">Analysis Results:</strong> Interest level assessment (hot/warm/cold), budget range, move-in date preferences, and suggested follow-up actions.</li>
              </ul>

              <h4 className="text-black font-semibold mb-2">2.4 Device & Usage Information</h4>
              <ul className="list-disc pl-5 space-y-2 marker:text-black mb-4">
                <li><strong className="text-black font-medium">Device Data:</strong> iOS version, device model, app version, and unique device identifiers.</li>
                <li><strong className="text-black font-medium">Usage Data:</strong> Recording sessions, upload status, feature interactions, and session duration.</li>
                <li><strong className="text-black font-medium">Calendar Data:</strong> With your permission, we access Google Calendar to display scheduled tour appointments (read-only access).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">3. How We Use Your Data</h3>
              <p className="mb-4">We use the collected data to:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li>Record and transcribe apartment tour conversations for AI analysis.</li>
                <li>Generate actionable insights including prospect interest level, budget preferences, and follow-up recommendations.</li>
                <li>Display your scheduled tours from Google Calendar within the app.</li>
                <li>Maintain a queue of recordings awaiting upload to our servers.</li>
                <li>Improve our AI models using anonymized and aggregated transcription data.</li>
                <li>Provide customer support and respond to inquiries.</li>
                <li>Comply with legal obligations and enforce our terms of service.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">4. Data Storage & Security</h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li><strong className="text-black font-medium">Local Storage:</strong> Audio recordings are temporarily stored on your device in the app's sandboxed storage. After successful upload, recordings are removed from local storage (FIFO policy keeps last 10 recordings).</li>
                <li><strong className="text-black font-medium">Secure Storage:</strong> Authentication tokens are encrypted and stored in iOS Keychain via expo-secure-store.</li>
                <li><strong className="text-black font-medium">Cloud Storage:</strong> Uploaded recordings and analysis results are stored on secure cloud servers (AWS S3 with encryption in transit and at rest).</li>
                <li><strong className="text-black font-medium">Retention:</strong> We retain recordings and associated data for as long as your account is active and for a reasonable period thereafter for business and legal purposes.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">5. Permissions We Request</h3>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li><strong className="text-black font-medium">Microphone (Required):</strong> To record audio during apartment tours. Without this permission, the core recording functionality cannot work.</li>
                <li><strong className="text-black font-medium">Background Audio (Required):</strong> To continue recording when the app is in the background or screen is locked.</li>
                <li><strong className="text-black font-medium">Google Calendar (Required):</strong> Read-only access to display your scheduled tour appointments.</li>
                <li><strong className="text-black font-medium">Camera (Optional):</strong> To take photos for in-app messaging features.</li>
                <li><strong className="text-black font-medium">Photo Library (Optional):</strong> To select and share images in messages.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">6. Data Sharing & Third Parties</h3>
              <p className="mb-4">We share data with the following third parties solely to provide our services:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li><strong className="text-black font-medium">Google:</strong> For authentication (Google Sign-In) and calendar integration (Google Calendar API).</li>
                <li><strong className="text-black font-medium">AWS (Amazon Web Services):</strong> For cloud storage of recordings and backend infrastructure (S3, server infrastructure).</li>
                <li><strong className="text-black font-medium">AI Processing Services:</strong> For transcription and analysis of recorded conversations.</li>
                <li><strong className="text-black font-medium">Statsig:</strong> For feature flag management and usage analytics (statsig-react-native SDK).</li>
                <li><strong className="text-black font-medium">Firebase:</strong> For backend services and data synchronization.</li>
              </ul>
              <p className="mt-4">
                <strong className="text-black font-medium">We do not sell</strong> your personal data to third-party advertisers or data brokers.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">7. Children's Privacy</h3>
              <p className="mb-4">
                UP Leasing is intended for use by professional leasing agents and property management staff who are 18 years of age or older. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such data.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">8. Your Rights & Choices</h3>
              <p className="mb-4">Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-5 space-y-2 marker:text-black">
                <li><strong className="text-black font-medium">Access:</strong> Request access to the personal data we hold about you.</li>
                <li><strong className="text-black font-medium">Correction:</strong> Request correction of inaccurate or incomplete data.</li>
                <li><strong className="text-black font-medium">Deletion:</strong> Request deletion of your personal data, subject to legal obligations.</li>
                <li><strong className="text-black font-medium">Opt-Out:</strong> Opt out of marketing communications (if applicable).</li>
                <li><strong className="text-black font-medium">Data Portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a>.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">9. International Data Transfers</h3>
              <p className="mb-4">
                Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws, including standard contractual clauses where required.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">10. Changes to This Privacy Policy</h3>
              <p className="mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. When we make material changes, we will notify you through the app or via email. The "Last Updated" date at the top of this policy will be revised accordingly.
              </p>
            </div>

            <div>
              <h3 className="text-black font-bold text-lg mb-4 font-sans">11. Contact Us</h3>
              <p className="mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-700"><strong className="text-black">Email:</strong> <a href="mailto:support@unitpulse.ai" className="text-black underline decoration-1 underline-offset-4">support@unitpulse.ai</a></p>
                <p className="text-gray-700 mt-2"><strong className="text-black">Address:</strong> UnitPulse AI, Inc.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default PrivacyPolicyUpleasing;
