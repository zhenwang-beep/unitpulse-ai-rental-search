import React from 'react';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

const PageFooter: React.FC = () => (
  <footer className="w-full py-16 md:py-20 bg-[#F0EDEA]">
    <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src={LOGO_URL} alt="UnitPulse" className="h-5" />
            <span className="font-heading font-bold text-lg tracking-wider">UnitPulse</span>
          </div>
          <p className="text-sm text-neutral-600 mb-3 font-semibold">AI-powered rental search for modern renters.</p>
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">UnitPulse uses AI to understand your lifestyle, budget, and preferences through a natural conversation — so you find homes that truly fit, not just listings that match filters.</p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><a href="/blog" className="hover:text-black transition-colors">Blog</a></li>
              <li><a href="/faq" className="hover:text-black transition-colors">FAQ</a></li>
              <li><a href="/rentals" className="hover:text-black transition-colors">Rental Markets</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3 text-sm text-neutral-500">
              <li><a href="/privacy" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-black transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <p className="text-sm text-neutral-400">&copy; 2026 UnitPulse. All rights reserved.</p>
        <p className="text-xs text-neutral-400">AI-powered rental search</p>
      </div>
    </div>
  </footer>
);

export default PageFooter;
