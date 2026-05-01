import React from 'react';
import FadeIn from './ui/FadeIn';

interface CallToActionProps {
  onOpenModal: () => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onOpenModal }) => {
  return (
    <section className="py-32 bg-white relative overflow-hidden border-t border-black/5">
      {/* Subtle Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <FadeIn>          
          <h2 className="font-heading text-5xl md:text-7xl mb-8 text-black leading-tight tracking-tight">
            Ready to see the <br /> 
            <span className="italic">future of leasing?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onOpenModal}
              className="w-full sm:w-auto bg-brand text-white px-12 py-5 font-bold text-sm uppercase tracking-widest hover:bg-brand-hover transition-all duration-300 shadow-xl shadow-brand/10 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 rounded-xl"
            >
              Talk to a specialist
            </button>
          </div>
          
          <div className="mt-16 flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">SOC2 Type II</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">GDPR Ready</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Fair Housing Compliant</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CallToAction;