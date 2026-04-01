import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Heart, Search, Menu, X, Building, LogOut, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "What's the screening process and requirements for rentals?",
    answer: "Our screening process includes a comprehensive background check, credit score verification, income verification, and rental history review. We typically require a minimum credit score of 650, proof of income that is at least 2.5 times the monthly rent, and positive references from previous landlords. The process usually takes 2-3 business days to complete.",
    category: "Application"
  },
  {
    id: 2,
    question: "Do I need a cosigner if my income meets the requirements but my credit score is lower than 650?",
    answer: "Yes, if your credit score falls below our minimum requirement of 650, you may need a cosigner even if your income meets the requirements. A cosigner must have a credit score of at least 700 and sufficient income to cover the rent if needed. Alternatively, you may qualify by paying an additional security deposit or providing a larger upfront payment.",
    category: "Application"
  },
  {
    id: 3,
    question: "If I am an international student, I do not have a credit score, do I still qualify?",
    answer: "Yes, international students can still qualify for our rentals! We understand that you may not have a U.S. credit history. In such cases, we require additional documentation such as proof of enrollment, visa status, and financial support. You may also need a U.S.-based cosigner or be asked to pay a higher security deposit. Our team is experienced in working with international students and will guide you through the process.",
    category: "Application"
  },
  {
    id: 4,
    question: "What is renter's insurance? Do I need to buy renter's insurance?",
    answer: "Renter's insurance is a policy that protects your personal belongings and provides liability coverage in case of accidents or damage. It typically covers theft, fire, water damage, and personal liability. Yes, we require all tenants to have renter's insurance with a minimum coverage of $100,000 for liability. The cost is usually very affordable, ranging from $15-30 per month, and it provides valuable protection for your possessions and peace of mind.",
    category: "Insurance"
  },
  {
    id: 5,
    question: "Are utility fees included in the rent?",
    answer: "Utility inclusion varies by property. Some of our rentals include all utilities in the monthly rent, while others may require you to set up and pay for utilities separately. Typical utilities include electricity, gas, water, trash, and internet. The specific utility arrangements for each property are clearly listed in the property details. Our leasing team will provide you with detailed information about estimated utility costs during the application process.",
    category: "Utilities"
  }
];

const CATEGORIES = ["All", "Application", "Insurance", "Utilities"];

interface FAQPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  setShowLoginView: (show: boolean) => void;
  handleLogout: () => void;
  showToast: (toast: ToastData | null) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
  showToast
}) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredFAQs = selectedCategory === "All" 
    ? FAQ_DATA 
    : FAQ_DATA.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <img src={LOGO_URL} alt="UnitPulse" className="h-5" />
              <span className="font-heading font-bold text-lg tracking-wider">UnitPulse</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Find a home
              </a>
              <a href="/blog" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Blog
              </a>
              <a href="/faq" className="text-sm font-medium text-[#4A5D23] font-semibold">
                FAQ
              </a>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#4A5D23] flex items-center justify-center text-white font-bold">
                      U
                    </div>
                    <span className="hidden md:inline">User</span>
                  </button>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-100 py-2 z-50"
                      >
                        <a
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <Heart size={16} />
                          <span>Favorites</span>
                          {favorites.length > 0 && (
                            <span className="ml-auto bg-[#4A5D23] text-white text-xs px-2 py-0.5 rounded-full">
                              {favorites.length}
                            </span>
                          )}
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors w-full"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginView(true)}
                  className="px-4 py-2 bg-[#4A5D23] text-white text-sm font-medium rounded-md hover:bg-[#3d4d1c] transition-colors"
                >
                  Login
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-neutral-100"
            >
              <nav className="px-4 py-4 space-y-3">
                <a href="/" className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                  Find a home
                </a>
                <a href="/blog" className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                  Blog
                </a>
                <a href="/faq" className="block text-sm font-medium text-[#4A5D23] font-semibold">
                  FAQ
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div className="w-full bg-[#4A5D23] text-white py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle size={32} className="text-white/80" />
              <div className="text-sm font-medium text-white/80">FAQ</div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Find answers to common questions about our rental process, applications, and policies
            </p>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="w-full max-w-4xl mx-auto mt-16 px-4 mb-20">
        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === category
                  ? 'bg-[#4A5D23] text-white border-[#4A5D23]'
                  : 'bg-white text-neutral-700 border-neutral-200 hover:border-[#4A5D23] hover:text-[#4A5D23]'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-bold rounded-md">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 mt-1">
                  {expandedItems.includes(faq.id) ? (
                    <ChevronUp size={20} className="text-[#4A5D23]" />
                  ) : (
                    <ChevronDown size={20} className="text-neutral-400" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {expandedItems.includes(faq.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2 border-t border-neutral-100">
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-[#F0EDEA] rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-neutral-600 mb-6 max-w-lg mx-auto">
              Can't find the answer you're looking for? Please reach out to our friendly team.
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-[#4A5D23] text-white font-bold rounded-md hover:bg-[#3d4d1c] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-16 md:py-20 bg-[#F0EDEA] mt-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 mb-12 md:mb-16">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={LOGO_URL} alt="UnitPulse" className="h-5" />
                <span className="font-heading font-bold text-lg tracking-wider">UnitPulse</span>
              </div>
              <p className="text-sm text-neutral-600 mb-3 font-semibold">AI-powered rental operations for modern landlords.</p>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 pt-8 text-center">
            <p className="text-sm text-neutral-500">© 2024 UnitPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;
