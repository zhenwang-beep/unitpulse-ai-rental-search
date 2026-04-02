import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Heart, LogOut, Menu, X, FileText, Building, Sparkles, MessageSquare, Shield, CreditCard, Home, ArrowRight, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface FAQPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const FAQ_CATEGORIES = [
  {
    id: 'getting-started',
    label: 'Getting Started',
    icon: Sparkles,
    questions: [
      {
        q: "How does UnitPulse work?",
        a: "UnitPulse uses AI to understand your lifestyle, budget, and preferences through a natural conversation. Instead of filling out forms and scrolling through hundreds of listings, you simply chat with our AI assistant, Lumina, who curates a shortlist of properties that genuinely match what you're looking for."
      },
      {
        q: "Do I need to create an account?",
        a: "You can search and explore properties without an account. However, creating a free account lets you save favorite properties, track your application status, and pick up conversations where you left off."
      },
      {
        q: "What cities does UnitPulse cover?",
        a: "We currently serve major US metropolitan areas including New York, Los Angeles, Chicago, Seattle, Houston, and Irvine. We're expanding rapidly — new cities are added every month based on demand."
      },
      {
        q: "How is UnitPulse different from other rental sites?",
        a: "Traditional rental sites give you filters and endless scrolling. UnitPulse gives you a conversation. Our AI understands context — like wanting a quiet neighborhood for remote work near good coffee shops — and finds properties that match the full picture, not just bedrooms and price."
      },
    ]
  },
  {
    id: 'ai-search',
    label: 'AI Search',
    icon: MessageSquare,
    questions: [
      {
        q: "What kind of questions can I ask the AI?",
        a: "Anything you'd ask a knowledgeable friend who knows the rental market. Try natural queries like \"Find me a pet-friendly 2-bedroom near good schools under $2,500\" or \"What's the best neighborhood for a young professional in Seattle?\" The AI understands lifestyle preferences, commute needs, budget constraints, and more."
      },
      {
        q: "How accurate are the AI recommendations?",
        a: "Our AI analyzes dozens of factors including location, pricing, amenities, neighborhood characteristics, and commute times. It continuously learns from interactions to improve accuracy. Every recommendation includes a match score so you can see exactly why a property was suggested."
      },
      {
        q: "Can I compare multiple properties?",
        a: "Yes! Simply ask the AI to compare properties side by side. It will break down the differences in rent, amenities, location, commute times, and total monthly costs so you can make an informed decision."
      },
      {
        q: "Does the AI work with voice input?",
        a: "Yes, UnitPulse supports voice-powered search through our Live mode. Click the microphone icon to have a natural spoken conversation with Lumina about your rental needs."
      },
    ]
  },
  {
    id: 'pricing',
    label: 'Pricing & Costs',
    icon: CreditCard,
    questions: [
      {
        q: "Is UnitPulse free for renters?",
        a: "Yes, UnitPulse is completely free for renters. We partner directly with property managers and landlords who pay for the platform. You'll never be charged a fee for searching, saving, or applying to properties."
      },
      {
        q: "Are there any hidden fees?",
        a: "None. UnitPulse is 100% free for renters. The total cost breakdowns we provide for each listing include all known fees — rent, utilities, parking, pet fees — so there are no surprises."
      },
      {
        q: "How does UnitPulse make money?",
        a: "We work with property managers and landlords who subscribe to our platform for AI-powered leasing tools, tenant matching, and listing optimization. This business model means renters always search for free."
      },
    ]
  },
  {
    id: 'properties',
    label: 'Properties & Listings',
    icon: Home,
    questions: [
      {
        q: "How often are listings updated?",
        a: "Our property database is updated in real-time. When a landlord marks a unit as available or rented, the change is reflected instantly on UnitPulse, so you're always seeing current availability."
      },
      {
        q: "Can I schedule a property tour through UnitPulse?",
        a: "Yes! Once you find a property you're interested in, you can request a tour directly through the platform. Our AI assistant can help you coordinate scheduling and prepare questions to ask during your visit."
      },
      {
        q: "What information is available for each property?",
        a: "Each listing includes photos, floor plans, detailed amenity lists, pricing breakdowns, neighborhood insights, walk scores, commute estimates, and an AI-generated lifestyle match analysis that explains why the property might be a good fit for you."
      },
      {
        q: "How do I apply for a rental?",
        a: "When you're ready to apply, click the 'Apply Now' button on any listing. UnitPulse streamlines the application process — you fill out your info once, and we handle formatting it for each property's requirements."
      },
    ]
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    icon: Shield,
    questions: [
      {
        q: "Is my personal data secure?",
        a: "Absolutely. We use industry-standard encryption for all data in transit and at rest. Your personal information is never shared with third parties without your explicit consent. We comply with CCPA and other applicable privacy regulations."
      },
      {
        q: "Does the AI store my conversations?",
        a: "Conversations are stored locally on your device to let you continue where you left off. If you create an account, conversation history is encrypted and stored securely. You can delete your data at any time from your account settings."
      },
      {
        q: "Who can see my saved properties and searches?",
        a: "Only you. Your favorites, search history, and application data are private and visible only to your account. Property managers only see your information when you explicitly submit an application."
      },
    ]
  },
];

const FAQPage: React.FC<FAQPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState('all');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  const toggleItem = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    questions: cat.questions.filter(
      q =>
        (activeCategory === 'all' || cat.id === activeCategory) &&
        (searchQuery === '' ||
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.a.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter(cat => cat.questions.length > 0);

  const totalResults = filteredCategories.reduce((sum, c) => sum + c.questions.length, 0);

  // JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_CATEGORIES.flatMap(cat =>
      cat.questions.map(q => ({
        "@type": "Question",
        "name": q.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.a,
        },
      }))
    ),
  };

  useEffect(() => {
    document.title = "FAQ - UnitPulse | AI-Powered Rental Search";
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.id = 'faq-jsonld';
    document.head.appendChild(script);
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = 'Find answers to common questions about UnitPulse, AI-powered rental search, pricing, privacy, and more.';
    meta.id = 'faq-meta-desc';
    document.head.appendChild(meta);
    return () => {
      document.getElementById('faq-jsonld')?.remove();
      document.getElementById('faq-meta-desc')?.remove();
      document.title = 'UnitPulse Rental Search';
    };
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-[#FCF9F8] text-black font-sans overflow-y-auto scroll-smooth">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 sticky top-0 bg-white shadow-sm">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
            <a href="/blog" className="text-sm font-medium hover:text-black/60 transition-colors">Blog</a>
            <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2">
                      <Heart size={16} /> Favorites
                      {favorites.length > 0 && <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">{favorites.length}</span>}
                    </button>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowLoginView(true)} className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all">Login</button>
            )}
          </nav>
          <button onClick={() => setIsHistoryOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-[65]" onClick={() => setIsHistoryOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }} className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] border-r border-black/5 flex flex-col">
              <div className="p-6 border-b border-black/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <img src={LOGO_URL} alt="UnitPulse" className="h-6" />
                  <h2 className="font-heading font-bold text-lg tracking-wider">UnitPulse</h2>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Search size={20} className="text-neutral-400" /> Find a home</a>
                <a href="/blog" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><FileText size={20} className="text-neutral-400" /> Blog</a>
                <div className="h-px bg-neutral-100 w-full my-1"></div>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium"><Building size={20} className="text-neutral-400" /> Become a partner</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-black uppercase tracking-wider mb-6">
            <HelpCircle size={14} />
            Help Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-heading tracking-tighter text-black mb-6">
            Frequently Asked <span style={{ color: '#4A5D23' }}>Questions</span>
          </h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Everything you need to know about UnitPulse and AI-powered rental search. Can't find your answer? Chat with our AI assistant anytime.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full h-14 pl-14 pr-6 bg-white border border-black/5 rounded-2xl text-sm focus:outline-none focus:border-[#4A5D23]/30 transition-all shadow-sm"
            />
            {searchQuery && (
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 font-medium">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Category Filters */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-[#4A5D23] text-white' : 'bg-white border border-black/5 text-neutral-600 hover:border-black/20'}`}
          >
            All Topics
          </button>
          {FAQ_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-[#4A5D23] text-white' : 'bg-white border border-black/5 text-neutral-600 hover:border-black/20'}`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-16">
        {filteredCategories.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <HelpCircle size={48} className="mx-auto text-neutral-300 mb-4" />
            <h3 className="text-xl font-bold text-neutral-400 mb-2">No results found</h3>
            <p className="text-neutral-400 text-sm">Try a different search term or browse all topics.</p>
          </motion.div>
        ) : (
          filteredCategories.map((cat, catIdx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.08 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#4A5D23]/10 flex items-center justify-center text-[#4A5D23]">
                  <cat.icon size={20} />
                </div>
                <h2 className="text-xl font-bold text-black tracking-tight">{cat.label}</h2>
              </div>

              <div className="bg-white rounded-2xl border border-black/5 overflow-hidden divide-y divide-black/5">
                {cat.questions.map((item, i) => {
                  const key = `${cat.id}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggleItem(key)}
                        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-neutral-50/50 transition-colors group"
                      >
                        <span className="text-base font-semibold text-black pr-4 group-hover:text-[#4A5D23] transition-colors">{item.q}</span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 md:px-6 pb-5 md:pb-6">
                              <p className="text-neutral-600 leading-relaxed">{item.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* CTA Section */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-20">
        <div className="p-8 md:p-12 rounded-[2rem] bg-[#4A5D23] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-20 -mb-20" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black font-heading tracking-tighter mb-4">Still have questions?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">Our AI assistant Lumina is available 24/7 to answer any question about rentals, neighborhoods, or the platform.</p>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#4A5D23] rounded-2xl font-bold hover:shadow-xl transition-all"
            >
              <MessageSquare size={20} />
              Chat with Lumina
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <PageFooter />
    </div>
  );
};

export default FAQPage;
