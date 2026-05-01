import React from 'react';
import FadeIn from './ui/FadeIn';
import { Check, Plus, Zap, Info } from 'lucide-react';

interface PricingProps {
  onOpenModal: () => void;
}

const Pricing: React.FC<PricingProps> = ({ onOpenModal }) => {
  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-4xl md:text-5xl mb-6 text-black">
              Pay for performance.<br />
              <span className="text-neutral-400">Not software.</span>
            </h2>
            <p className="text-lg text-neutral-500">
              Start with free tools. Upgrade to autonomous agents. Pay for results.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* UP Marketing */}
          <FadeIn delay={100} className="h-full">
            <div className="h-full p-8 rounded-2xl border border-black/5 bg-white flex flex-col hover:border-black/10 transition-all hover:shadow-xl relative group">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-black mb-2">UP Marketing</h3>
                <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">The Hunter</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-black">Free</span>
                  <span className="text-neutral-500">/ 30 days</span>
                </div>
                <div className="text-sm text-neutral-400 mt-2">
                  Custom pricing based on portfolio size.
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Automated Listing Syndication</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Real-time Ad Optimization</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Plus size={16} className="text-black mt-0.5 shrink-0" />
                  <span>Channel Autopilots Available</span>
                </li>
                
                {/* Channel Logos */}
                <li className="pt-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-40">
                       <img src="https://cdn.simpleicons.org/facebook/1877F2" alt="Facebook" className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-30">
                       <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram" className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-20">
                       <img src="https://cdn.simpleicons.org/xiaohongshu/FF2442" alt="RedNote" className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-10">
                       <img src="https://cdn.simpleicons.org/zillow/0074E4" alt="Zillow" className="w-5 h-5" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden z-0">
                       <img src="https://www.freelogovectors.net/wp-content/uploads/2021/12/apartments-com-logo-freelogovectors.net_.png" alt="Apartments.com" className="w-5 h-5 object-contain" />
                    </div>
                  </div>
                </li>
              </ul>

              <button
                onClick={onOpenModal}
                className="w-full py-4 rounded-xl bg-neutral-100 text-black border border-black/5 font-semibold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                Get Started
              </button>
            </div>
          </FadeIn>

          {/* UP Leasing — featured tier */}
          <FadeIn delay={200} className="h-full">
            <div className="h-full p-8 rounded-2xl border-2 border-brand/25 bg-ai-tint flex flex-col transition-all hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/15 shadow-xl shadow-brand/10 relative group transform md:-translate-y-6 overflow-hidden ring-1 ring-brand/10">
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-black mb-2">UP Leasing</h3>
                <p className="text-sm text-brand font-bold uppercase tracking-wider">The Closer</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-black">Let's Talk</span>
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  Performance based. Client only pays when a lease is signed. Zero risk.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>24/7 AI Lead Engagement</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Autonomous Tour Scheduling</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Application & Lease Automation</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Zero Upfront Cost</span>
                </li>
              </ul>

              <button
                onClick={onOpenModal}
                className="w-full py-4 rounded-xl bg-brand text-white font-semibold text-sm uppercase tracking-widest hover:bg-brand-hover transition-all shadow-xl shadow-brand/10 hover:shadow-2xl hover:shadow-brand/20"
              >
                Schedule a Demo
              </button>
            </div>
          </FadeIn>

          {/* UP Insight */}
          <FadeIn delay={300} className="h-full">
            <div className="h-full p-8 rounded-2xl border border-black/5 bg-white flex flex-col hover:border-black/10 transition-all hover:shadow-xl relative group overflow-hidden">
              <div className="mb-6">
                <h3 className="font-heading text-2xl font-bold text-black mb-2">UP Insight</h3>
                <p className="text-sm text-neutral-500 font-medium uppercase tracking-wider">The Brain</p>
              </div>
              
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-black">Free</span>
                  <span className="text-neutral-500">/ forever</span>
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  The cockpit for your entire operation.
                </p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Unified Data Dashboard</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Full-Funnel Visualization</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>Market & Competitor Analysis</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-neutral-600">
                  <Check size={16} className="text-brand mt-0.5 shrink-0" />
                  <span>"Data Copilot" Query Interface</span>
                </li>
              </ul>

              <button
                onClick={onOpenModal}
                className="w-full py-4 rounded-xl bg-neutral-100 text-black border border-black/5 font-semibold text-sm uppercase tracking-widest hover:bg-neutral-200 transition-all"
              >
                Get Started
              </button>
            </div>
          </FadeIn>
        </div>

        {/* LAAS Section */}
        <FadeIn delay={400}>
          <div className="max-w-6xl mx-auto mt-16 rounded-3xl overflow-hidden relative group shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Architecture" 
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900/50"></div>
              <div className="absolute inset-0 bg-brand/20 mix-blend-overlay"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-10 md:p-16 flex flex-col items-center justify-center text-center">
              <div className="max-w-3xl flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ai-tint border border-brand/20 mb-6">
                  <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
                  <span className="text-brand font-mono text-xs font-bold tracking-widest uppercase">
                    Premium Offering
                  </span>
                </div>
                
                <h3 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                  Leasing as a Service <span className="text-neutral-400 italic font-light text-3xl md:text-4xl">(LaaS)</span>
                </h3>
                
                <p className="text-xl text-neutral-300 mb-10 leading-relaxed">
                  Go beyond software. We run the entire leasing operation for you—an end-to-end, fully managed solution powered by our AI agents and overseen by our industry experts.
                </p>
                
                <button
                  onClick={onOpenModal}
                  className="px-8 py-4 rounded-xl bg-brand text-white font-semibold text-sm uppercase tracking-widest hover:bg-brand-hover transition-all shadow-xl shadow-brand/20 hover:shadow-2xl hover:shadow-brand/30 inline-flex items-center gap-3 group/btn"
                >
                  Inquire About LaaS
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};

export default Pricing;
