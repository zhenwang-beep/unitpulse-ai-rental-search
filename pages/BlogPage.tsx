import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, MessageSquare, Search } from 'lucide-react';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import TopNav from '../components/TopNav';

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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = selectedCategory === "All"
    ? ALL_ARTICLES
    : ALL_ARTICLES.filter(article => article.category === selectedCategory);

  return (
    <div
      className="h-[100dvh] w-full bg-[#FCF9F8] flex flex-col text-black font-sans overflow-y-auto scroll-smooth"
    >
      <TopNav
        isLoggedIn={isLoggedIn}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        setShowLoginView={setShowLoginView}
        handleLogout={handleLogout}
        variant="sticky-static"
      />

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
                    loading="lazy"
                    decoding="async"
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
                      loading="lazy"
                      decoding="async"
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
                    loading="lazy"
                    decoding="async"
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
        <PageFooter />
      </main>
    </div>
  );
};

export default BlogPage;