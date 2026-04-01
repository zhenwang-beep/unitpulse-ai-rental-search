import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Heart, Search, Menu, X, Building, LogOut, ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail, Sparkles } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "What's the screening process and requirements for rentals?",
    answer: "Our screening process includes a comprehensive background check, credit score verification, income verification, and rental history review. We typically require a minimum credit score of 650, proof of income that is at least 2.5 times the monthly rent, and positive references from previous landlords. The process usually takes 2-3 business days to complete.",
    category: "Application",
    icon: <FileText size={24} />
  },
  {
    id: 2,
    question: "Do I need a cosigner if my income meets the requirements but my credit score is lower than 650?",
    answer: "Yes, if your credit score falls below our minimum requirement of 650, you may need a cosigner even if your income meets the requirements. A cosigner must have a credit score of at least 700 and sufficient income to cover the rent if needed. Alternatively, you may qualify by paying an additional security deposit or providing a larger upfront payment.",
    category: "Application",
    icon: <Building size={24} />
  },
  {
    id: 3,
    question: "If I am an international student, I do not have a credit score, do I still qualify?",
    answer: "Yes, international students can still qualify for our rentals! We understand that you may not have a U.S. credit history. In such cases, we require additional documentation such as proof of enrollment, visa status, and financial support. You may also need a U.S.-based cosigner or be asked to pay a higher security deposit. Our team is experienced in working with international students and will guide you through the process.",
    category: "Application",
    icon: <Sparkles size={24} />
  },
  {
    id: 4,
    question: "What is renter's insurance? Do I need to buy renter's insurance?",
    answer: "Renter's insurance is a policy that protects your personal belongings and provides liability coverage in case of accidents or damage. It typically covers theft, fire, water damage, and personal liability. Yes, we require all tenants to have renter's insurance with a minimum coverage of $100,000 for liability. The cost is usually very affordable, ranging from $15-30 per month, and it provides valuable protection for your possessions and peace of mind.",
    category: "Insurance",
    icon: <HelpCircle size={24} />
  },
  {
    id: 5,
    question: "Are utility fees included in the rent?",
    answer: "Utility inclusion varies by property. Some of our rentals include all utilities in the monthly rent, while others may require you to set up and pay for utilities separately. Typical utilities include electricity, gas, water, trash, and internet. The specific utility arrangements for each property are clearly listed in the property details. Our leasing team will provide you with detailed information about estimated utility costs during the application process.",
    category: "Utilities",
    icon: <Building size={24} />
  }
];

const CATEGORIES = [
  { name: "All", icon: <Sparkles size={20} /> },
  { name: "Application", icon: <FileText size={20} /> },
  { name: "Insurance", icon: <HelpCircle size={20} /> },
  { name: "Utilities", icon: <Building size={20} /> }
];

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
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = FAQ_DATA
    .filter(faq => selectedCategory === "All" || faq.category === selectedCategory)
    .filter(faq => 
      searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
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
              <a href="#" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Become a partner
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
                <a href="#" className="block text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                  Become a partner
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#4A5D23] text-white">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              How can we help?
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8">
              Find answers to common questions about our rental process, applications, and policies
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-3 bg-white rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="w-full max-w-5xl mx-auto px-4 py-16 md:py-24">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {CATEGORIES.map((category, index) => (
            <motion.button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-[#4A5D23] text-white shadow-lg shadow-[#4A5D23]/30'
                  : 'bg-white text-neutral-700 border-2 border-neutral-200 hover:border-[#4A5D23] hover:text-[#4A5D23]'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.icon}
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white border-2 border-neutral-100 rounded-2xl overflow-hidden hover:border-[#4A5D23]/30 transition-all duration-300 hover:shadow-xl">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-6 md:px-8 py-6 flex items-start justify-between gap-4 text-left hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-[#4A5D23]/10 rounded-xl flex items-center justify-center text-[#4A5D23] group-hover:bg-[#4A5D23] group-hover:text-white transition-all">
                      {faq.icon}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-bold rounded-full">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-neutral-900 group-hover:text-[#4A5D23] transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <div className="flex-shrink-0 pt-2">
                    <motion.div
                      animate={{ rotate: expandedItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center group-hover:bg-[#4A5D23]/10 transition-colors"
                    >
                      <ChevronDown size={20} className="text-neutral-600 group-hover:text-[#4A5D23] transition-colors" />
                    </motion.div>
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
                      <div className="px-6 md:px-8 pb-6 pt-2 ml-16 border-t border-neutral-100">
                        <p className="text-neutral-600 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <div className="bg-gradient-to-br from-[#F0EDEA] to-[#e8e4df] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl"></div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#4A5D23] rounded-2xl mb-6">
                <MessageCircle size={32} className="text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-neutral-600 mb-8 max-w-lg mx-auto text-lg">
                Can't find the answer you're looking for? Please reach out to our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:support@unitpulse.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#4A5D23] text-white font-bold rounded-xl hover:bg-[#3d4d1c] transition-all shadow-lg shadow-[#4A5D23]/30 hover:shadow-xl hover:shadow-[#4A5D23]/40"
                >
                  <Mail size={20} />
                  Email Us
                </a>
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#4A5D23] font-bold rounded-xl border-2 border-[#4A5D23] hover:bg-[#4A5D23] hover:text-white transition-all"
                >
                  <Phone size={20} />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="w-full py-16 md:py-20 bg-[#F0EDEA]">
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
