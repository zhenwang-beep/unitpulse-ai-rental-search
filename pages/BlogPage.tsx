import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowRight, Heart, Search, Menu, X, Building, LogOut, ChevronRight, MessageSquare } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

// Mock blog data
const FEATURED_BLOGS = [
  {
    id: 1,
    title: "10 Tips for Finding the Perfect Apartment in 2026",
    excerpt: "Discover expert strategies to find your ideal rental home in today's competitive market.",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Apartment Guide",
    date: "March 28, 2026",
    readTime: "5 min read",
    author: "Sarah Johnson"
  },
  {
    id: 2,
    title: "The Rise of Coliving Spaces: What You Need to Know",
    excerpt: "Explore the growing trend of coliving and how it's changing the rental landscape.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Coliving",
    date: "March 25, 2026",
    readTime: "4 min read",
    author: "Michael Chen"
  }
];

const LATEST_ARTICLES = [
  {
    id: 3,
    title: "Local Guide: Best Neighborhoods in Los Angeles",
    excerpt: "Discover the most vibrant and livable neighborhoods in LA for renters.",
    image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Local Guide",
    date: "March 30, 2026",
    readTime: "6 min read",
    author: "Emily Rodriguez"
  },
  {
    id: 4,
    title: "Home Rental News: Market Trends for 2026",
    excerpt: "Stay updated on the latest trends and predictions for the rental market.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Home Rental News",
    date: "March 29, 2026",
    readTime: "3 min read",
    author: "David Wilson"
  },
  {
    id: 5,
    title: "Residential Property Management: A Landlord's Guide",
    excerpt: "Essential tips for landlords to effectively manage their rental properties.",
    image: "https://images.unsplash.com/photo-1560520653-2f9a46a7b7b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Residential Property Management",
    date: "March 27, 2026",
    readTime: "7 min read",
    author: "Jennifer Lee"
  }
];

const ALL_ARTICLES = [
  ...FEATURED_BLOGS,
  ...LATEST_ARTICLES,
  {
    id: 6,
    title: "How to Negotiate Rent Like a Pro",
    excerpt: "Learn effective strategies to negotiate your rent and save money.",
    image: "https://images.unsplash.com/photo-1522156373667-4c7234bbd804?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Apartment Guide",
    date: "March 26, 2026",
    readTime: "4 min read",
    author: "Sarah Johnson"
  },
  {
    id: 7,
    title: "Coliving vs. Traditional Rentals: Pros and Cons",
    excerpt: "Compare coliving arrangements with traditional rentals to find the best fit.",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Coliving",
    date: "March 24, 2026",
    readTime: "5 min read",
    author: "Michael Chen"
  },
  {
    id: 8,
    title: "Local Guide: Hidden Gems in San Francisco",
    excerpt: "Explore lesser-known neighborhoods and attractions in SF.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Local Guide",
    date: "March 23, 2026",
    readTime: "6 min read",
    author: "Emily Rodriguez"
  },
  {
    id: 9,
    title: "Home Rental News: New Regulations in 2026",
    excerpt: "Stay informed about the latest rental regulations affecting tenants and landlords.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Home Rental News",
    date: "March 22, 2026",
    readTime: "3 min read",
    author: "David Wilson"
  },
  {
    id: 10,
    title: "Residential Property Management: Tenant Screening Best Practices",
    excerpt: "Learn how to effectively screen tenants to find the right fit for your property.",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Residential Property Management",
    date: "March 21, 2026",
    readTime: "5 min read",
    author: "Jennifer Lee"
  }
];

const CATEGORIES = [
  "All",
  "Coliving",
  "Local Guide",
  "Apartment Guide",
  "Home Rental News",
  "Residential Property Management"
];

interface BlogPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
  showToast,
}) => {
  const navigate = useNavigate();
  const { favorites } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsHistoryOpen(false); };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredArticles = selectedCategory === "All"
    ? ALL_ARTICLES
    : ALL_ARTICLES.filter(article => article.category === selectedCategory);

  return (
    <div
      className="h-[100dvh] w-full bg-[#FCF9F8] flex flex-col text-black font-sans overflow-y-auto scroll-smooth"
    >
      <header className="w-full px-4 md:px-8 py-4 flex justify-between items-center z-[60] shrink-0 transition-all duration-300 sticky top-0 bg-white shadow-sm">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <img src={LOGO_URL} alt="UnitPulse" className="h-8" />
            <span className="font-heading font-bold text-xl tracking-wider">UnitPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="/" className="text-sm font-medium hover:text-black/60 transition-colors">Find a home</a>
            <a href="/blog" className="text-sm font-medium text-[#4A5D23] transition-colors">Blog</a>
            <a href="/faq" className="text-sm font-medium hover:text-black/60 transition-colors">FAQ</a>
            <a href="#" className="text-sm font-medium hover:text-black/60 transition-colors">Become a partner</a>
            {isLoggedIn ? (
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full bg-neutral-100 border border-black/5 flex items-center justify-center overflow-hidden cursor-pointer hover:border-black transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="w-full h-full bg-[#4A5D23] text-white text-xs font-black flex items-center justify-center">FZ</span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-black/5 py-2 z-[70]">
                    <button
                      onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
                    >
                      <Heart size={16} />
                      Favorites
                      {favorites.length > 0 && (
                        <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginView(true)}
                className="px-5 py-2 bg-[#4A5D23] text-white rounded-lg text-sm font-medium hover:bg-[#3a4e1a] transition-all"
              >
                Login
              </button>
            )}
          </nav>
          <button onClick={() => setIsHistoryOpen(true)} aria-label="Open menu" className="md:hidden p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 z-[65]"
              onClick={() => setIsHistoryOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 w-80 bg-white shadow-2xl z-[70] border-r border-black/5 flex flex-col"
            >
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src={LOGO_URL} alt="UnitPulse" className="h-6" />
              <h2 className="font-heading font-bold text-lg tracking-wider">UnitPulse</h2>
            </div>
            <button onClick={() => setIsHistoryOpen(false)} aria-label="Close menu" className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-6 border-b border-black/5 flex flex-col gap-6">
              {isLoggedIn ? (
                <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-black/5">
                  <div className="w-12 h-12 rounded-full bg-[#4A5D23] text-white text-sm font-black flex items-center justify-center shadow-sm">FZ</div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">Felix Zhou</span>
                    <span className="text-xs font-medium text-neutral-500">felix.zhou@gmail.com</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-bold text-neutral-900">Welcome to UnitPulse</h3>
                  <p className="text-sm text-neutral-500">Sign in to save your favorite homes and track applications.</p>
                  <button
                    onClick={() => { setShowLoginView(true); setIsHistoryOpen(false); }}
                    className="w-full py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-medium hover:bg-[#3a4e1a] transition-all"
                  >
                    Login / Sign up
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <a href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                  <Search size={20} className="text-neutral-400" />
                  Find a home
                </a>
                <a href="/blog" className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 text-[#4A5D23] transition-colors font-medium">
                  <FileText size={20} className="text-[#4A5D23]" />
                  Blog
                </a>
                <a href="/faq" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                  <FileText size={20} className="text-neutral-400" />
                  FAQ
                </a>
                {isLoggedIn && (
                  <button
                    onClick={() => { navigate('/favorites'); setIsHistoryOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium w-full text-left"
                  >
                    <Heart size={20} className="text-neutral-400" />
                    Favorites
                    {favorites.length > 0 && (
                      <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </button>
                )}
              </div>

              <div className="h-px bg-neutral-100 w-full"></div>

              <div className="flex flex-col gap-1">
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium">
                  <Building size={20} className="text-neutral-400" />
                  Become a partner
                </a>
              </div>

              {isLoggedIn && (
                <>
                  <div className="h-px bg-neutral-100 w-full"></div>
                  <button
                    onClick={() => { handleLogout(); setIsHistoryOpen(false); }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors font-medium w-full text-left"
                  >
                    <LogOut size={20} className="text-red-400" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col items-center relative w-full">
        {/* Hero Section */}
        <div className="w-full bg-[#4A5D23] text-white py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-sm font-medium mb-4">THE BLOG</div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  11 Employee Benefits Irish Startups Should Offer and Why
                </h1>
                <div className="text-white/80 mb-8">August 15, 2024</div>
                <a 
                  href="/blog/1" 
                  className="inline-block px-6 py-3 bg-white text-[#4A5D23] font-bold rounded-md hover:bg-white/90 transition-colors"
                >
                  Read article
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                    alt="Blog feature" 
                    className="w-full h-auto"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Featured Article */}
        <div className="w-full max-w-5xl mx-auto mt-12 px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Featured Article</h2>
          <div>
            {FEATURED_BLOGS.slice(0, 1).map((blog, index) => (
              <motion.a
                key={blog.id}
                href={`/blog/${blog.id}`}
                className="group block rounded-xl overflow-hidden border border-black/5 transition-all duration-500 hover:shadow-xl bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative h-64 md:h-auto overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="inline-block px-3 py-1 bg-[#4A5D23] text-white text-xs font-bold rounded-md mb-4 w-fit">
                      {blog.category}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-[#4A5D23] transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-neutral-600 mb-6 line-clamp-3">{blog.excerpt}</p>

                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* All Articles */}
        <div className="w-full max-w-5xl mx-auto mt-16 px-4 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">All Articles</h2>
            <div className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="What are you looking for?" 
                className="w-full px-4 py-2 pl-10 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-3 mb-10">
            {CATEGORIES.map((category, index) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${selectedCategory === category
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

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <motion.a
                key={article.id}
                href={`/blog/${article.id}`}
                className="group block rounded-xl overflow-hidden border border-black/5 transition-all duration-500 hover:shadow-xl bg-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="inline-block px-2 py-1 bg-[#4A5D23] text-white text-xs font-bold rounded-md mb-3 w-fit">
                    {article.category}
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-[#4A5D23] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>

                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="w-full bg-[#F0EDEA] py-16 md:py-20 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#4A5D23]/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4A5D23]/10 rounded-full mb-6"
            >
              <MessageSquare size={16} className="text-[#4A5D23]" />
              <span className="text-sm font-medium text-[#4A5D23]">Stay Connected</span>
            </motion.div>
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Stay Updated with the Latest Rental Insights
            </motion.h2>
            <motion.p 
              className="text-neutral-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Subscribe to our newsletter to receive weekly updates on market trends, expert tips, and new blog posts.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-6 py-4 rounded-full bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]"
              />
              <button className="px-8 py-4 bg-[#4A5D23] text-white rounded-full font-bold hover:bg-[#3a4e1a] transition-all whitespace-nowrap shadow-lg shadow-[#4A5D23]/20 hover:shadow-xl hover:shadow-[#4A5D23]/30">
                Subscribe
              </button>
            </motion.div>
            <motion.p 
              className="text-xs text-neutral-400 mt-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
            </motion.p>
          </div>
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
                <p className="text-sm text-neutral-500 mb-8 leading-relaxed">UnitPulse helps landlords and property managers streamline leasing with AI. From listing optimization to tenant engagement and application workflows, we turn rental operations into a faster, smarter, and more data-driven experience.</p>
                <a href="#" className="inline-flex items-center gap-2 font-bold text-black hover:text-[#4A5D23] hover:underline text-sm transition-colors">
                  Start using AI to power your rental business →
                </a>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Resources</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="/blog" className="hover:text-black transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">API Docs</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Company</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-black mb-4 text-sm uppercase tracking-wider">Legal</h4>
                  <ul className="space-y-3 text-sm text-neutral-500">
                    <li><a href="#" className="hover:text-black transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-black transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <p className="text-sm text-neutral-400">© 2026 UnitPulse. All rights reserved.</p>
              <p className="text-xs text-neutral-400">AI-powered rental search</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default BlogPage;