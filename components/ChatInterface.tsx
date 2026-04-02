import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Loader2, ChevronRight, ChevronLeft, AudioLines, RotateCcw, Check, MapPin, Star, Wifi, Car, Coffee, ShieldCheck, Upload, CreditCard, PenTool, Key, Zap, ClipboardCheck, Heart, Sparkles, Plus, Phone, Calendar, ArrowUpDown, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, Property } from '../types';
import { AI_AVATAR, SUGGESTION_CHIPS } from '../constants';
import PropertyCard from './PropertyCard';
import ContactFormModal from './ContactFormModal';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onToggleFavorite: (property: Property) => void;
  favorites: Property[];
  onStartLiveMode: () => void;
  onPropertyClick: (property: Property) => void;
  selectedProperty?: Property | null;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  onInputFocus?: () => void;
  isCollapsed?: boolean;
  isLoggedIn?: boolean;
  onResetChat?: () => void;
  onStop?: () => void;
}

// --- INTERACTIVE COMPONENTS ---

export const RichMediaCanvas = ({ property, onAction }: { property: Property, onAction: (action: string) => void }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [property.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-3xl overflow-hidden border border-black/5 shadow-2xl mt-4"
    >
      <div className="relative h-64 md:h-80 overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            src={images[currentImageIndex]} 
            alt={property.title} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-1 bg-[#4A5D23] text-white text-xs font-medium rounded uppercase tracking-wider">Available Now</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold">{property.rating || '4.9'}</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold font-heading tracking-wider">{property.title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h2>
          <div className="flex items-center gap-1 text-white/80 text-sm mt-1">
            <MapPin size={14} />
            <span>{property.location.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 md:space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-2xl border border-black/5 text-center">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Monthly</div>
            <div className="text-base md:text-lg font-bold text-black flex items-baseline justify-center gap-1">
              ${property.price.toLocaleString()}+
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-black/5 text-center">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Bedrooms</div>
            <div className="text-base md:text-lg font-bold text-black">{property.bedsRange || property.bedrooms}</div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-2xl border border-black/5 text-center">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">Sq Ft</div>
            <div className="text-base md:text-lg font-bold text-black">{property.sqftRange || property.sqft || '1,240'}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-4 text-neutral-600">
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-black">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Security</div>
              <div className="font-medium">24/7 Gated</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-neutral-600">
            <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-black">
              <Zap size={16} />
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Utilities</div>
              <div className="font-medium">Eco-Friendly</div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-black uppercase tracking-wider mb-4">Premium Amenities</h3>
          <div className="flex flex-wrap gap-2 md:gap-4">
            {property.amenities.map(amenity => (
              <div key={amenity} className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-full border border-black/5 text-xs md:text-xs font-medium text-neutral-600">
                {amenity === 'WiFi' ? <Wifi size={14} /> : amenity === 'Parking' ? <Car size={14} /> : <Coffee size={14} />}
                {amenity}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">Description</h3>
          <p className="text-neutral-600 leading-relaxed text-xs md:text-sm">
            {property.description}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => onAction("Call Agent")}
              className="py-3 bg-white border border-black/10 text-black rounded-xl font-medium text-xs md:text-xs uppercase tracking-wider hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
            >
              <AudioLines size={16} />
              <span>Call Agent</span>
            </button>
            <button 
              onClick={() => onAction("Schedule Viewing")}
              className="py-3 bg-white border border-black/10 text-black rounded-xl font-medium text-xs md:text-xs uppercase tracking-wider hover:bg-neutral-50 transition-all flex items-center justify-center gap-2"
            >
              <ClipboardCheck size={16} />
              <span>Schedule Viewing</span>
            </button>
          </div>
          <button 
            onClick={() => onAction("Request Tour")}
            className="w-full py-4 bg-[#4A5D23] text-white rounded-xl font-medium text-xs md:text-sm uppercase tracking-wider hover:bg-[#3a4e1a] transition-all shadow-xl shadow-[#4A5D23]/10 flex items-center justify-center gap-2"
          >
            <span>Request Tour</span>
            <ArrowUp size={18} className="rotate-90" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ApplicationForm = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const steps = [
    { name: 'Personal Details', progress: 33 },
    { name: 'Background Check', progress: 66 },
    { name: 'Review & Submit', progress: 100 }
  ];

  const currentStep = steps[step - 1];

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#FCF9F4] rounded-3xl border border-black/5 shadow-lg mt-4 p-8"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-medium text-black uppercase tracking-wider">Application Journey</div>
          <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider">{currentStep.progress}% Complete</div>
        </div>
        <h3 className="text-xl font-bold text-black tracking-tight">Step {step} of 3: {currentStep.name}</h3>
        <div className="w-full h-1.5 bg-neutral-100 rounded-full mt-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${currentStep.progress}%` }}
            className="h-full bg-black"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Personal Information</label>
              <input type="text" placeholder="Full Legal Name" className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm" />
              <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm" />
              <input type="tel" placeholder="Phone Number" className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-black outline-none text-sm" />
            </div>
            <button onClick={nextStep} className="w-full py-3 bg-[#4A5D23] text-white rounded-xl font-medium uppercase tracking-wider hover:bg-[#3a4e1a] transition-colors mt-6">Confirm Details</button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <p className="text-sm text-neutral-600 leading-relaxed">
                Almost there! I'm securely verifying your documents now. This process ensures the highest level of security for your future sanctuary.
              </p>
              
              <div className="p-4 bg-white rounded-2xl border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-black">
                    <Upload size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black">Scanning...</div>
                    <div className="text-xs text-neutral-400">Extracting data from Government ID</div>
                  </div>
                </div>
                <div className="text-[8px] font-medium text-black uppercase tracking-wider">Secure Link</div>
              </div>

              <div 
                className="border-2 border-dashed border-neutral-200 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-black transition-colors cursor-pointer bg-white/50"
                onClick={() => {
                  setIsUploading(true);
                  setTimeout(() => {
                    setIsUploading(false);
                    nextStep();
                  }, 2000);
                }}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="animate-spin text-black" size={32} />
                    <p className="text-xs font-medium uppercase tracking-wider text-black">Verifying...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400">
                      <Upload size={28} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-black">Scan ID</p>
                      <p className="text-xs text-neutral-400 font-medium mt-1">Drag and drop your document here or click to browse</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={nextStep} className="flex-1 py-3 bg-black text-white rounded-xl font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors">Confirm Details</button>
              <button className="px-6 py-3 bg-neutral-100 text-neutral-600 rounded-xl font-medium uppercase tracking-wider hover:bg-neutral-200 transition-colors">Retake</button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Final Review</label>
              <div className="p-4 bg-[#F4F7EC] rounded-2xl border border-[#4A5D23]/15 flex items-start gap-3">
                <ShieldCheck className="text-[#4A5D23] shrink-0 mt-0.5" size={20} />
                <p className="text-xs text-[#243510] leading-relaxed">
                  By clicking complete, you authorize UnitPulse to perform a secure background and credit check. Your data is encrypted and protected.
                </p>
              </div>
            </div>
            <button onClick={nextStep} className="w-full py-3 bg-[#4A5D23] text-white rounded-xl font-medium uppercase tracking-wider hover:bg-[#3a4e1a] transition-colors mt-6">Complete Application</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ContractSummary = ({ property, onComplete }: { property: Property, onComplete?: () => void }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (isPaid && onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isPaid, onComplete]);

  if (isPaid) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full bg-gradient-to-br from-[#F4F7EC] to-[#F4F1EE] rounded-3xl border border-[#4A5D23]/20 shadow-2xl mt-4 overflow-hidden"
      >
        <div className="p-10 flex flex-col items-center text-center gap-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-[#4A5D23] rounded-full flex items-center justify-center shadow-xl shadow-[#4A5D23]/30"
          >
            <Check size={40} strokeWidth={3} className="text-white" />
          </motion.div>
          <div>
            <p className="text-xs font-bold text-[#4A5D23] uppercase tracking-widest mb-2">Lease Signed</p>
            <h3 className="text-2xl font-black font-heading text-black tracking-tight">Welcome home. 🎉</h3>
            <p className="text-sm text-neutral-500 font-medium mt-2">{property.title} · {property.location}</p>
          </div>
          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={() => onComplete?.()}
              className="flex-1 py-3 bg-[#4A5D23] text-white rounded-xl font-semibold text-sm hover:bg-[#3a4e1a] transition-all"
            >
              View Move-in Checklist
            </button>
            <button className="px-4 py-3 bg-white border border-black/5 text-black rounded-xl font-semibold text-sm hover:bg-neutral-50 transition-all">
              Share
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#FCF9F8] rounded-3xl border border-black/5 shadow-2xl mt-4 overflow-hidden"
    >
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-medium text-black uppercase tracking-wider">Official Agreement</div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[#F4F7EC] text-[#4A5D23] rounded-full">
            <div className="w-1 h-1 bg-[#4A5D23] rounded-full animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-wider">Ready to Close</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-black tracking-tight">Contract Summary</h3>
      </div>

      <div className="p-8 pt-0 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Monthly Rent</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-black">${property.price.toLocaleString()}+</span>
              <span className="text-xs text-neutral-400 font-medium">/mo</span>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Security Deposit</div>
            <div className="text-lg font-bold text-black">${(property.price * 2).toLocaleString()}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Move-in Date</div>
            <div className="text-lg font-bold text-black">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-black/5">
            <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">Lease Term</div>
            <div className="text-lg font-bold text-black">12 Months</div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-sm font-bold text-black">{property.title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
              <div className="text-xs text-neutral-400">{property.location.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
            </div>
          </div>
          <ShieldCheck className="text-neutral-300" size={20} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Signature of Tenant</label>
            <button onClick={() => setIsSigned(false)} className="text-[8px] font-medium text-black uppercase tracking-wider hover:underline">Clear Canvas</button>
          </div>
          <div 
            className={`h-40 border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer transition-all relative overflow-hidden ${isSigned ? 'bg-white border-[#4A5D23]/25' : 'bg-white border-neutral-200 hover:border-black'}`}
            onClick={() => setIsSigned(true)}
          >
            {isSigned ? (
              <div className="flex flex-col items-center gap-2">
                <div className="text-black font-heading text-3xl italic opacity-80">Signed digitally</div>
                <div className="text-xs text-[#4A5D23] font-medium uppercase tracking-wider">Verified by UnitPulse</div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-neutral-300">
                <PenTool size={28} strokeWidth={1.5} />
                <p className="text-xs font-medium">Sign with your mouse or finger</p>
              </div>
            )}
            {/* Dot grid background for signature pad */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          </div>
        </div>

        <button 
          disabled={!isSigned || isPaid}
          onClick={() => setIsPaid(true)}
          className={`w-full py-5 rounded-2xl font-medium uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-xl ${isPaid ? 'bg-[#4A5D23] text-white shadow-[#4A5D23]/20' : isSigned ? 'bg-[#4A5D23] text-white hover:bg-[#3a4e1a] shadow-[#4A5D23]/20' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
        >
          {isPaid ? (
            <>
              <Check size={20} strokeWidth={3} />
              <span>Payment Confirmed</span>
            </>
          ) : (
            <>
              <CreditCard size={20} />
              <span>Pay Now & Secure</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

const StyleAnalysis = ({ 
  initialPreference, 
  styleTitle,
  styleAvatar,
  onConfirm, 
  onEdit 
}: { 
  initialPreference: string; 
  styleTitle?: string;
  styleAvatar?: string;
  onConfirm: () => void; 
  onEdit: (newPref: string) => void 
}) => {
  const [step, setStep] = useState<'analyzing' | 'confirming'>('analyzing');
  const [preference, setPreference] = useState(initialPreference);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStep('confirming');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white rounded-3xl border border-black/10 shadow-2xl mt-4 overflow-hidden"
    >
      {step === 'analyzing' ? (
        <div className="p-12 flex flex-col items-center text-center space-y-8">
          <Loader2 className="animate-spin text-[#4A5D23]" size={48} />
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-black">Analyzing your style...</h3>
            <p className="text-neutral-500 text-sm">We're looking at the architecture, amenities, and vibes of your favorite homes.</p>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F4F7EC] rounded-2xl flex items-center justify-center text-[#4A5D23] text-2xl">
              {styleAvatar || <Sparkles size={24} />}
            </div>
            <div>
              <div className="text-xs font-bold text-[#4A5D23] uppercase tracking-[0.2em] mb-0.5">Your Style Profile</div>
              <h3 className="text-xl font-bold tracking-tight">{styleTitle || 'Style Summary'}</h3>
            </div>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 border border-black/5">
            {isEditing ? (
              <textarea 
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-black/5 focus:outline-none text-sm text-neutral-700 leading-relaxed min-h-[120px]"
              />
            ) : (
              <p className="text-neutral-700 text-base font-medium leading-relaxed italic">
                "{preference}"
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {isEditing ? (
              <button 
                onClick={() => {
                  setIsEditing(false);
                  onEdit(preference);
                }}
                className="px-8 py-3 bg-[#4A5D23] text-white rounded-full font-medium text-sm uppercase tracking-wider hover:bg-[#3a4e1a] transition-all"
              >
                Save & Confirm
              </button>
            ) : (
              <>
                <button 
                  onClick={onConfirm}
                  className="px-8 py-3 bg-[#4A5D23] text-white rounded-full font-medium text-sm uppercase tracking-wider hover:bg-[#3a4e1a] transition-all shadow-lg shadow-[#4A5D23]/20"
                >
                  Yes, Find Matches
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-full font-medium text-sm uppercase tracking-wider hover:bg-neutral-50 transition-all"
                >
                  Edit Preferences
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

const MoveInChecklist = ({ onComplete }: { onComplete: () => void }) => {
  const [tasks, setTasks] = useState([
    { id: 'keys', label: 'Key Collection', completed: false, icon: <Key size={16} /> },
    { id: 'utilities', label: 'Utility Setup (Electricity & Water)', completed: false, icon: <Zap size={16} /> },
    { id: 'insurance', label: "Renter's Insurance", completed: false, icon: <ShieldCheck size={16} /> },
    { id: 'inspection', label: 'Move-in Inspection', completed: false, icon: <ClipboardCheck size={16} /> },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const allCompleted = tasks.every(t => t.completed);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-white rounded-3xl border border-black/10 shadow-2xl mt-4 overflow-hidden"
    >
      <div className="bg-black p-6 text-white">
        <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">Next Steps</div>
        <h3 className="text-xl font-bold tracking-tight">Move-in Checklist</h3>
      </div>
      
      <div className="p-6 space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${task.completed ? 'bg-[#F4F7EC] border-[#4A5D23]/15' : 'bg-neutral-50 border-neutral-100 hover:border-black/20'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`${task.completed ? 'text-[#4A5D23]' : 'text-neutral-400'}`}>
                {task.icon}
              </div>
              <span className={`text-sm font-bold ${task.completed ? 'text-[#2e4417] line-through opacity-60' : 'text-black'}`}>
                {task.label}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#4A5D23] border-emerald-500 text-white' : 'border-neutral-300'}`}>
              {task.completed && <Check size={14} strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 pt-0">
        <button 
          disabled={!allCompleted}
          onClick={onComplete}
          className={`w-full py-4 rounded-2xl font-medium uppercase tracking-normal transition-all ${allCompleted ? 'bg-[#4A5D23] text-white hover:bg-[#3a4e1a] shadow-xl shadow-[#4A5D23]/20' : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
        >
          Finalize Move-in
        </button>
      </div>
    </motion.div>
  );
};

const TourScheduling = ({ propertyName, onComplete }: { propertyName: string; onComplete: () => void }) => {
  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (selectedDay === null || !selectedTime || !name.trim() || !phone.trim()) return;
    setConfirmed(true);
  };

  if (confirmed) {
    const confirmedDay = days[selectedDay!];
    const dateStr = confirmedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#F4F7EC] rounded-3xl border border-[#4A5D23]/15 shadow-lg mt-4 p-8 text-center"
      >
        <div className="w-12 h-12 bg-[#4A5D23] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={24} className="text-white" strokeWidth={3} />
        </div>
        <h3 className="text-xl font-black text-black mb-1">Tour Confirmed!</h3>
        <p className="text-sm font-medium text-neutral-500 mb-4">{propertyName}</p>
        <div className="bg-white rounded-2xl border border-[#4A5D23]/15 px-6 py-4 inline-block mb-6">
          <span className="text-sm font-bold text-[#1a2609]">{dateStr} at {selectedTime}</span>
        </div>
        <p className="text-xs font-medium text-neutral-400 mb-6">We'll send a reminder to {phone}</p>
        <button
          onClick={onComplete}
          className="px-6 py-2.5 bg-[#4A5D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3a4e1a] transition-all"
        >
          Back to Chat
        </button>
      </motion.div>
    );
  }

  const canConfirm = selectedDay !== null && selectedTime !== null && name.trim().length > 0 && phone.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#FCF9F4] rounded-3xl border border-black/5 shadow-lg mt-4 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#4A5D23] flex items-center justify-center shrink-0">
          <Calendar size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-black text-black">Schedule a Tour</h3>
          <p className="text-xs font-medium text-neutral-400 truncate max-w-[220px]">{propertyName}</p>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-3">Select a Date</label>
        <div className="grid grid-cols-6 gap-2">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center py-2.5 rounded-xl border text-center transition-all ${
                selectedDay === i
                  ? 'bg-[#4A5D23] border-[#4A5D23] text-white'
                  : 'bg-white border-black/5 hover:border-black/20 text-black'
              }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${selectedDay === i ? 'text-white/70' : 'text-neutral-400'}`}>
                {i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-sm font-black">{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider mb-3">Select a Time</label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                selectedTime === slot
                  ? 'bg-[#4A5D23] border-[#4A5D23] text-white'
                  : 'bg-white border-black/5 hover:border-black/20 text-black'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <label className="block text-xs font-black text-neutral-400 uppercase tracking-wider">Your Contact Info</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-[#4A5D23] outline-none text-sm"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-[#4A5D23] outline-none text-sm"
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="w-full py-3 bg-[#4A5D23] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#3a4e1a] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calendar size={16} />
        Confirm Tour
      </button>
    </motion.div>
  );
};

// --- END INTERACTIVE COMPONENTS ---

const AI_STATUS_MESSAGES = [
  "AI is scanning apartments...",
  "AI is ranking listings...",
  "AI is analyzing neighborhood vibes...",
  "AI is comparing amenities...",
  "AI is calculating commute times...",
  "AI is checking lease terms...",
  "AI is verifying availability..."
];

const CompactPropertyCard = ({
  property,
  isFavorite,
  onToggleFavorite,
  onClick,
  onTour,
}: {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (property: Property) => void;
  onClick?: (property: Property) => void;
  onTour?: (property: Property) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images && property.images.length > 0 ? property.images : [property.image].filter(Boolean) as string[];

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div
      onClick={() => onClick?.(property)}
      className="group relative bg-white rounded-2xl border border-black/5 overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex]}
            alt={property.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/20 hover:bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10"
            >
              <ChevronRight size={14} />
            </button>
            <div className="absolute bottom-2 right-2 flex gap-1 z-10 items-center" style={{ height: '20px' }}>
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-3' : 'bg-white/50 w-1'}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(property); }}
            className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-300 ${isFavorite ? 'bg-black text-white' : 'bg-white/20 text-white hover:bg-white hover:text-black'}`}
          >
            <Heart size={12} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {property.matchScore && (
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1 z-10">
            <Zap size={10} className="text-amber-400 fill-amber-400" />
            {property.matchScore}% Match
          </div>
        )}

        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-xs font-semibold text-white uppercase tracking-wider flex items-baseline gap-1 z-10">
          ${property.price.toLocaleString()}+ / mo
        </div>
      </div>
      <div className="p-4 space-y-2 flex-1">
        <h4 className="text-sm font-black text-black truncate tracking-wider">{property.title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</h4>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium tracking-tight">
          <MapPin size={12} />
          <span className="truncate">{property.location.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
        </div>
        <div className="flex items-center gap-2 pt-2 text-xs font-black text-black uppercase tracking-wider">
          <span>{property.bedsRange || `${property.bedrooms} Bed`}</span>
          <span className="w-1 h-1 bg-neutral-200 rounded-full" />
          <span>{property.bathsRange || `${property.bathrooms} Bath`}</span>
          {property.sqftRange && (
            <>
              <span className="w-1 h-1 bg-neutral-200 rounded-full" />
              <span>{property.sqftRange} SQFT</span>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button 
            onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:+11234567890'; }}
            className="flex-1 py-1.5 bg-transparent hover:text-neutral-600 text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <Phone size={10} />
            <span className="truncate">(123) 456-7890</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onTour ? onTour(property) : onClick?.(property); }}
            className="flex-1 py-1.5 bg-[#4A5D23] hover:bg-[#3a4e1a] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <Calendar size={10} />
            Tour
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyComparisonTable = ({ 
  properties, 
  onPropertyClick, 
  onSendMessage,
  onToggleFavorite,
  favorites
}: { 
  properties: Property[], 
  onPropertyClick: (p: Property) => void, 
  onSendMessage: (t: string) => void,
  onToggleFavorite: (property: Property) => void,
  favorites: Property[]
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Property | 'beds' | 'baths' | 'amenities'; direction: 'asc' | 'desc' } | null>(null);
  const [visibleColumns] = useState<string[]>(['price', 'beds', 'baths', 'sqft', 'amenities']);

  const handleSort = (key: keyof Property | 'beds' | 'baths' | 'amenities') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedProperties = [...properties].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    
    let aValue: any = a[key as keyof Property];
    let bValue: any = b[key as keyof Property];

    if (key === 'beds') {
      aValue = a.bedrooms;
      bValue = b.bedrooms;
    } else if (key === 'baths') {
      aValue = a.bathrooms;
      bValue = b.bathrooms;
    } else if (key === 'amenities') {
      aValue = a.amenities.length;
      bValue = b.amenities.length;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIndicator = ({ column }: { column: keyof Property | 'beds' | 'baths' | 'amenities' }) => (
    <ArrowUpDown 
      size={10} 
      className={`ml-1 inline-block transition-colors ${sortConfig?.key === column ? 'text-black' : 'text-neutral-300'}`} 
    />
  );

  return (
    <div className="w-full mt-4 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-xl animate-fade-in relative">
      <div className="overflow-x-auto custom-scrollbar max-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="sticky top-0 z-10 bg-neutral-50 shadow-sm">
            <tr className="border-b border-black/5">
              <th 
                className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-black transition-colors w-48"
                onClick={() => handleSort('title')}
              >
                Property <SortIndicator column="title" />
              </th>
              {visibleColumns.map(col => (
                <th 
                  key={col}
                  className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 cursor-pointer hover:text-black transition-colors"
                  onClick={() => handleSort(col as any)}
                >
                  {col === 'sqft' ? 'SQFT' : col} <SortIndicator column={col as any} />
                </th>
              ))}
              <th className="px-3 py-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 text-right sticky right-0 bg-neutral-50 shadow-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProperties.map((property) => {
              const isFavorite = favorites.some(f => f.id === property.id);
              return (
                <tr 
                  key={property.id} 
                  onClick={() => onPropertyClick(property)}
                  className="border-b border-black/5 last:border-0 hover:bg-neutral-50/50 transition-colors cursor-pointer group"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-black/5">
                        <img src={property.images?.[0] || property.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium tracking-tight truncate group-hover:text-[#4A5D23] transition-colors">{property.title}</div>
                        <div className="text-xs font-normal text-neutral-400 tracking-normal truncate flex items-center gap-1">
                          <MapPin size={8} />
                          {property.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  {visibleColumns.map(col => (
                    <td key={col} className="px-3 py-3">
                      {col === 'price' && <div className="text-sm font-medium text-black">${property.price.toLocaleString()}+</div>}
                      {col === 'beds' && (
                        <div className="text-xs font-normal text-neutral-500 uppercase tracking-wider">
                          {property.bedsRange || `${property.bedrooms}B`}
                        </div>
                      )}
                      {col === 'baths' && (
                        <div className="text-xs font-normal text-neutral-500 uppercase tracking-wider">
                          {property.bathsRange || `${property.bathrooms}B`}
                        </div>
                      )}
                      {col === 'sqft' && (
                        <div className="text-xs font-normal text-neutral-500 uppercase tracking-wider">
                          {property.sqftRange || property.sqft}
                        </div>
                      )}
                      {col === 'amenities' && (
                        <div className="flex flex-wrap gap-1">
                          {property.amenities.slice(0, 2).map((am, i) => (
                            <span key={i} className="text-xs font-normal uppercase tracking-wider px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-sm">
                              {am}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-3 sticky right-0 bg-white group-hover:bg-neutral-50/50">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(property);
                        }}
                        className={`p-1.5 transition-all ${isFavorite ? 'text-black' : 'text-neutral-400 hover:text-black'}`}
                      >
                        <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendMessage(`I'd like to schedule a tour for ${property.title}`);
                        }}
                        className="px-2 py-1 bg-[#4A5D23] text-white text-xs font-medium uppercase tracking-wider rounded-lg hover:bg-[#3a4e1a] transition-all whitespace-nowrap flex items-center gap-1"
                      >
                        <Calendar size={10} />
                        Tour
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PropertyCarousel = ({
  properties,
  favorites,
  onToggleFavorite,
  onPropertyClick,
  onSendMessage,
  onTour,
}: {
  properties: Property[],
  favorites: Property[],
  onToggleFavorite: (property: Property) => void,
  onPropertyClick: (property: Property) => void,
  onSendMessage: (text: string) => void,
  onTour?: (property: Property) => void,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewMode, setViewMode] = useState<'carousel' | 'table'>('carousel');

  // Sort by match score if available
  const sortedProperties = [...properties].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = 0;
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [properties]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="-mx-4 md:-mx-6 mt-4 animate-fade-in">
      <div className="flex items-center justify-between mb-4 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-amber-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-black">Top Matches</span>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-xl border border-black/5">
          <button 
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${viewMode === 'carousel' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-black'}`}
          >
            List
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${viewMode === 'table' ? 'bg-white text-black shadow-sm' : 'text-neutral-400 hover:text-black'}`}
          >
            Compare
          </button>
        </div>
      </div>

      {viewMode === 'carousel' ? (
        <div className="relative group/carousel w-full">
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll properties left"
            className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-black transition-all ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto pb-8 pt-4 px-4 md:px-6 property-carousel scroll-smooth items-stretch scrollbar-hide"
          >
             {sortedProperties.map((property) => (
               <div key={property.id} className="min-w-[280px] max-w-[320px]">
                 <CompactPropertyCard
                    property={property}
                    isFavorite={favorites.some(f => f.id === property.id)}
                    onToggleFavorite={onToggleFavorite}
                    onClick={onPropertyClick}
                    onTour={onTour}
                 />
               </div>
             ))}
          </div>

          <button
            onClick={() => scroll('right')}
            aria-label="Scroll properties right"
            className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white rounded-full shadow-lg border border-black/5 flex items-center justify-center text-black transition-all ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : (
        <div className="px-4 md:px-6">
          <PropertyComparisonTable
            properties={sortedProperties}
            onPropertyClick={onPropertyClick}
            onSendMessage={onSendMessage}
            onToggleFavorite={onToggleFavorite}
            favorites={favorites}
          />
        </div>
      )}
    </div>
  );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  onToggleFavorite,
  favorites,
  onStartLiveMode,
  onPropertyClick,
  selectedProperty,
  onScroll,
  onInputFocus,
  isCollapsed,
  isLoggedIn,
  onResetChat,
  onStop,
}) => {
  const [input, setInput] = useState('');
  const [ghostText, setGhostText] = useState('');
  const [hasInteractedWithFollowUp, setHasInteractedWithFollowUp] = useState(false);
  const [aiStatusIndex, setAiStatusIndex] = useState(0);
  const [tourProperty, setTourProperty] = useState<Property | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setAiStatusIndex(prev => (prev + 1) % AI_STATUS_MESSAGES.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    setHasInteractedWithFollowUp(false);
  }, [selectedProperty?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const checkSuggestionsScroll = () => {
    if (suggestionsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = suggestionsRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkSuggestionsScroll();
    window.addEventListener('resize', checkSuggestionsScroll);
    return () => window.removeEventListener('resize', checkSuggestionsScroll);
  }, [messages, isLoading]);

  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (suggestionsRef.current) {
      const scrollAmount = 200;
      suggestionsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const lastMessage = messages[messages.length - 1];
  const suggestedReplies = lastMessage?.role === 'assistant' ? lastMessage.suggestedReplies || [] : [];
  
  const filteredSuggestions = suggestedReplies.filter(reply => 
    !input || reply.toLowerCase().startsWith(input.toLowerCase())
  );

  useEffect(() => {
    if (input && filteredSuggestions.length > 0) {
      const match = filteredSuggestions[0];
      if (match.toLowerCase().startsWith(input.toLowerCase())) {
         setGhostText(match);
      } else {
         setGhostText('');
      }
    } else {
      setGhostText('');
    }
  }, [input, filteredSuggestions]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
    setGhostText('');
    setHasInteractedWithFollowUp(true);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    if (onInputFocus) onInputFocus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && ghostText) {
      e.preventDefault();
      setInput(ghostText);
      setGhostText('');
      setTimeout(() => {
        if (inputRef.current) {
           inputRef.current.style.height = 'auto';
           inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
        }
      }, 0);
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasText = input.trim().length > 0;

   return (
    <div className="flex-1 min-h-0 flex flex-col w-full relative h-full overflow-hidden bg-[#FCF9F8]">
       {!isCollapsed && (
         <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth custom-scrollbar relative" ref={scrollRef} onScroll={onScroll}>
            <div className={`max-w-3xl mx-auto px-4 md:px-6 space-y-10 pb-60 ${!selectedProperty ? 'pt-10 md:pt-16' : 'pt-10'}`}>
              {selectedProperty && !isLoading && (
                <div className="animate-fade-in-up">
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center gap-2 ml-1">
                       <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold font-heading">U</div>
                       <span className="text-xs font-medium text-black uppercase tracking-wider">UnitPulse</span>
                    </div>

                    <div className="text-neutral-800 text-sm leading-relaxed pl-1 whitespace-pre-wrap font-medium">
                      I'm here to help! Ask me anything about <span className="font-bold">{selectedProperty.title}</span>—lease terms, amenities, or neighborhood vibes. Would you like to schedule a tour?
                      
                        <div className="flex flex-wrap gap-3 mt-4">
                          <button 
                            onClick={() => onSendMessage(`I'd like to schedule a tour for ${selectedProperty.title}.`)}
                            className="px-4 py-2 bg-neutral-100 text-black text-xs lg:text-xs font-medium rounded-full hover:bg-neutral-200 transition-all tracking-tight"
                          >
                            Schedule Tour
                          </button>
                          <button 
                            onClick={() => onSendMessage(`What are the lease terms for ${selectedProperty.title}?`)}
                            className="px-4 py-2 bg-neutral-100 text-black text-xs lg:text-xs font-medium rounded-full hover:bg-neutral-200 transition-all tracking-tight"
                          >
                            Lease Terms
                          </button>
                          <button 
                            onClick={() => onSendMessage(`Tell me about the amenities at ${selectedProperty.title}.`)}
                            className="px-4 py-2 bg-neutral-100 text-black text-xs lg:text-xs font-medium rounded-full hover:bg-neutral-200 transition-all tracking-tight"
                          >
                            Amenities
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
              )}
             
             {/* Empty state — shown before any conversation starts */}
             {messages.length === 0 && !isLoading && !selectedProperty && (
               <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in-up">
                 <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black font-heading text-lg mb-4 shadow-lg">U</div>
                 <h2 className="text-xl font-black font-heading text-black mb-1">Hi, welcome to UnitPulse</h2>
                 <p className="text-sm text-neutral-500 font-medium mb-8 max-w-xs">Your AI rental concierge. Tell me what you're looking for.</p>
                 <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                   {SUGGESTION_CHIPS.map((chip) => (
                     <button
                       key={chip.label}
                       onClick={() => onSendMessage(chip.query)}
                       className="group relative overflow-hidden rounded-2xl border border-black/5 bg-white hover:border-[#4A5D23]/20 hover:shadow-lg transition-all duration-200 text-left"
                     >
                       <img src={chip.image} alt="" className="w-full h-20 object-cover" referrerPolicy="no-referrer" />
                       <div className="px-3 py-2.5">
                         <span className="text-xs font-bold text-black">{chip.label}</span>
                       </div>
                     </button>
                   ))}
                 </div>
               </div>
             )}

             {messages.map((msg, index) => (
               <div key={msg.id} className="animate-fade-in-up">
                 
                 {msg.role === 'user' ? (
                   <div className="flex flex-col items-end gap-1">
                     <div className="bg-neutral-100 text-neutral-800 px-6 py-3.5 rounded-2xl max-w-[85%] lg:max-w-[70%] text-sm leading-relaxed border border-black/5 whitespace-pre-wrap font-medium shadow-sm">
                       {msg.text}
                     </div>
                     <span className="text-xs text-neutral-400 font-medium px-2">
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </span>
                   </div>
                 ) : (
                   <div className="flex flex-col gap-3 w-full">
                     <div className="flex items-center gap-2 ml-1">
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold font-heading">U</div>
                        <span className="text-xs font-medium text-black uppercase tracking-wider">UnitPulse</span>
                     </div>

                     <div className={`text-neutral-800 text-sm leading-relaxed pl-1 whitespace-pre-wrap font-medium ${msg.isSigningMessage ? 'bg-[#F4F7EC] p-6 rounded-2xl border-2 border-emerald-500/20 shadow-xl shadow-emerald-500/5' : ''}`}>
                        {msg.isSigningMessage && (
                          <div className="flex items-center gap-2 text-[#4A5D23] font-bold uppercase tracking-wider text-xs mb-4">
                            <Check size={14} strokeWidth={3} />
                            Lease Agreement Ready
                          </div>
                        )}
                        {msg.text}

                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-black/5">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">Sources</p>
                            <div className="flex flex-wrap gap-2">
                              {msg.sources.map((src, i) => (
                                <a
                                  key={i}
                                  href={src.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={src.snippet}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 text-xs font-medium transition-colors border border-black/5"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                  {src.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Components */}
                        {msg.interactiveType === 'style-analysis' && (
                          <StyleAnalysis 
                            initialPreference={msg.styleSummary || msg.text}
                            styleTitle={msg.styleTitle}
                            styleAvatar={msg.styleAvatar}
                            onConfirm={() => onSendMessage("I've confirmed my style. Find me some matches!")}
                            onEdit={(newPref) => onSendMessage(`I've updated my preferences: ${newPref}. Now find me some matches!`)}
                          />
                        )}

                        {msg.interactiveType === 'deep-dive' && msg.interactiveData && (
                          <div className="mt-4 max-w-[280px]">
                            <CompactPropertyCard
                              property={msg.interactiveData}
                              isFavorite={favorites.some(f => f.id === msg.interactiveData.id)}
                              onToggleFavorite={onToggleFavorite}
                              onClick={onPropertyClick}
                              onTour={setTourProperty}
                            />
                          </div>
                        )}

                        {msg.interactiveType === 'application-form' && (
                          <ApplicationForm onComplete={() => onSendMessage("I've finished the application form!")} />
                        )}

                        {msg.interactiveType === 'contract' && msg.interactiveData && (
                          <ContractSummary 
                            property={msg.interactiveData} 
                            onComplete={() => onSendMessage("I've completed the payment and signed the contract!")} 
                          />
                        )}

                        {msg.interactiveType === 'move-in-checklist' && (
                          <MoveInChecklist onComplete={() => onSendMessage("I've finished my move-in checklist!")} />
                        )}

                        {msg.interactiveType === 'tour-scheduling' && (
                          <TourScheduling
                            propertyName={msg.interactiveData?.propertyName || 'this property'}
                            onComplete={() => onSendMessage("I've scheduled a tour!")}
                          />
                        )}

                        {msg.isSigningMessage && !msg.interactiveType && (
                          <div className="mt-8 p-6 bg-white rounded-xl border border-[#4A5D23]/15 flex items-center justify-between shadow-sm">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-[#4A5D23] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#4A5D23]/20">
                                   <Check size={20} strokeWidth={3} />
                                </div>
                                <div>
                                   <div className="text-sm font-medium text-black uppercase tracking-tight">Digital Lease Ready</div>
                                   <div className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Secured by UnitPulse</div>
                                </div>
                             </div>
                             <div className="text-xs font-medium text-[#4A5D23] uppercase tracking-wider bg-[#F4F7EC] px-3 py-1.5 rounded-full">Active</div>
                          </div>
                        )}
                      </div>

                     {msg.properties && msg.properties.length > 0 && (
                       <PropertyCarousel
                         properties={msg.properties}
                         favorites={favorites}
                         onToggleFavorite={onToggleFavorite}
                         onPropertyClick={onPropertyClick}
                         onSendMessage={onSendMessage}
                         onTour={setTourProperty}
                       />
                     )}
                   </div>
                 )}
               </div>
             ))}
             
             {isLoading && (
               <div className="flex flex-col gap-3 animate-fade-in-up">
                 <div className="flex items-center gap-2 ml-1">
                   <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold font-heading shrink-0">U</div>
                   <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider animate-pulse">
                     {AI_STATUS_MESSAGES[aiStatusIndex]}
                   </span>
                 </div>
                 <div className="bg-white border border-black/5 rounded-2xl p-5 space-y-3 shadow-sm">
                   <div className="space-y-2">
                     <div className="h-3 bg-neutral-100 rounded-full animate-pulse w-3/4" />
                     <div className="h-3 bg-neutral-100 rounded-full animate-pulse w-full" />
                     <div className="h-3 bg-neutral-100 rounded-full animate-pulse w-5/6" />
                   </div>
                   <div className="flex gap-2 pt-1">
                     <div className="h-7 w-24 bg-neutral-100 rounded-full animate-pulse" />
                     <div className="h-7 w-20 bg-neutral-100 rounded-full animate-pulse" />
                   </div>
                 </div>
               </div>
             )}
           </div>
         </div>
       )}

       <div className={`w-full px-4 flex flex-col items-center justify-end z-50 shrink-0 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#FCF9F8] via-[#FCF9F8]/90 to-transparent ${!isCollapsed ? 'pb-4 pt-8' : 'pb-4 pt-0'}`}>
         
          {!isCollapsed && !isLoading && messages.length > 0 && filteredSuggestions.length > 0 && (
            <div className="relative w-full max-w-3xl mb-2 group">
             {canScrollLeft && (
               <button 
                 type="button"
                 onClick={() => scrollSuggestions('left')}
                 className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md border border-black/5 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
               >
                 <ChevronLeft size={16} />
               </button>
             )}

             <div 
               ref={suggestionsRef}
               onScroll={checkSuggestionsScroll}
               className="flex gap-2 overflow-x-auto max-w-full py-1 px-4 scrollbar-hide scroll-smooth"
               style={{
                 maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'}, black 40px, black calc(100% - 40px), ${canScrollRight ? 'transparent' : 'black'})`,
                 WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent' : 'black'}, black 40px, black calc(100% - 40px), ${canScrollRight ? 'transparent' : 'black'})`
               }}
             >
               {filteredSuggestions.map((reply) => (
                 <button
                   key={reply}
                   onClick={() => {
                      onSendMessage(reply);
                      setInput('');
                      setGhostText('');
                   }}
                   className="whitespace-nowrap px-4 py-2 bg-white border border-black/5 text-black text-xs font-medium rounded-full hover:bg-black hover:text-white transition-all"
                 >
                   {reply}
                 </button>
               ))}
             </div>

             {canScrollRight && (
               <button 
                 type="button"
                 onClick={() => scrollSuggestions('right')}
                 className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white shadow-md border border-black/5 rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
               >
                 <ChevronRight size={16} />
               </button>
             )}
           </div>
         )}

         <div className={`w-full max-w-3xl transition-all duration-500 focus-within:scale-[1.01] focus-within:-translate-y-1 ${isCollapsed ? 'scale-95' : ''}`}>
           <div className={`bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5 transition-all duration-500 focus-within:ring-1 focus-within:ring-black focus-within:shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex flex-col gap-1 ${isCollapsed ? 'p-2 min-h-[3rem]' : 'p-3 min-h-[5rem]'}`}>
             
             <div className="flex-1 relative flex items-start min-h-[2rem] py-1">
               {ghostText && (
                 <div className="absolute inset-0 px-2 pointer-events-none flex items-start pt-1">
                   <div className="w-full">
                     <span className="opacity-0 whitespace-pre-wrap break-words font-sans text-sm leading-normal tracking-tight">{input}</span>
                     <span className="text-neutral-300 whitespace-pre-wrap break-words font-sans text-sm leading-normal tracking-tight">{ghostText.slice(input.length)}</span>
                   </div>
                 </div>
               )}
               
               <textarea
                 ref={inputRef}
                 value={input}
                 onChange={handleInput}
                 onKeyDown={handleKeyDown}
                 onFocus={onInputFocus}
                 placeholder={selectedProperty ? `Ask about ${selectedProperty.title}...` : "Ask UnitPulse anything..."}
                 rows={1}
                 className="flex-1 bg-transparent border-0 px-2 py-0 text-black focus:ring-0 focus:outline-none placeholder:text-neutral-300 text-sm w-full relative z-10 resize-none overflow-hidden leading-normal font-sans tracking-tight font-medium"
                 disabled={isLoading}
                 style={{ maxHeight: '200px' }}
               />
             </div>

             <div className={`flex items-center justify-between mt-1 pt-1 ${isCollapsed ? 'hidden' : ''}`}>
               <div className="flex items-center gap-2">
                 {onResetChat && messages.length > 0 && (
                   <div className="relative">
                     <button
                       type="button"
                       onClick={() => setShowResetConfirm(v => !v)}
                       title="Reset chat"
                       className={`p-2 rounded-full transition-all ${showResetConfirm ? 'bg-neutral-100 text-black' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'}`}
                     >
                       <RotateCcw size={16} />
                     </button>
                     <AnimatePresence>
                       {showResetConfirm && (
                         <motion.div
                           initial={{ opacity: 0, y: 6, scale: 0.95 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           exit={{ opacity: 0, y: 6, scale: 0.95 }}
                           transition={{ duration: 0.15 }}
                           className="absolute bottom-full left-0 mb-2 w-52 bg-white rounded-xl shadow-xl border border-black/8 p-3 z-50"
                         >
                           <p className="text-xs font-semibold text-black mb-0.5">Reset conversation?</p>
                           <p className="text-xs text-neutral-400 mb-3">This will clear all messages.</p>
                           <div className="flex gap-2">
                             <button
                               type="button"
                               onClick={() => setShowResetConfirm(false)}
                               className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-black transition-all"
                             >
                               Cancel
                             </button>
                             <button
                               type="button"
                               onClick={() => { setShowResetConfirm(false); onResetChat(); }}
                               className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-black hover:bg-neutral-800 text-white transition-all"
                             >
                               Reset
                             </button>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 )}
               </div>

               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <button 
                     type="button"
                     onClick={onStartLiveMode}
                     disabled={isLoading || hasText}
                     className={`p-2 rounded-full transition-all ${hasText ? 'text-neutral-200 cursor-not-allowed' : 'text-neutral-400 hover:text-black hover:bg-neutral-100'}`}
                     title="Live Mode"
                   >
                     <AudioLines size={20} />
                   </button>
                   {isLoading ? (
                     <button
                       type="button"
                       onClick={onStop}
                       aria-label="Stop generating"
                       className="h-8 w-8 rounded-full bg-[#4A5D23] text-white hover:bg-[#3a4e1a] transition-all flex items-center justify-center"
                     >
                       <Square size={14} fill="currentColor" />
                     </button>
                   ) : (
                     <button
                       type="button"
                       disabled={!hasText}
                       onClick={handleSubmit}
                       aria-label="Send message"
                       className={`h-8 w-8 rounded-full transition-all flex items-center justify-center ${
                         hasText
                           ? 'bg-[#4A5D23] text-white hover:bg-[#3a4e1a]'
                           : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                       }`}
                     >
                       <ArrowUp size={18} />
                     </button>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

      {tourProperty && (
        <ContactFormModal
          mode="tour"
          property={tourProperty}
          isLoggedIn={isLoggedIn}
          onClose={() => setTourProperty(null)}
        />
      )}
    </div>
  );
};

export default ChatInterface;
