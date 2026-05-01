import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Share2, Facebook, Twitter, Link, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { ToastData } from '../components/Toast';
import PageFooter from '../components/PageFooter';
import PropertyCard from '../components/PropertyCard';
import TopNav from '../components/TopNav';
import { MOCK_PROPERTIES } from '../constants';
import { Property } from '../types';

// Mock blog data
const BLOG_POSTS = [
  {
    id: 1,
    title: "10 Tips for Finding the Perfect Apartment in 2026",
    excerpt: "Discover expert strategies to find your ideal rental home in today's competitive market.",
    content: `
      <h2>Introduction</h2>
      <p>Finding the perfect apartment can be a daunting task, especially in today's competitive rental market. With rising prices and limited availability, it's more important than ever to have a strategic approach to your apartment search. In this article, we'll share 10 expert tips to help you find your ideal rental home in 2026.</p>
      
      <h2>1. Determine Your Budget</h2>
      <p>Before you start your search, it's crucial to establish a realistic budget. Financial experts recommend spending no more than 30% of your monthly income on rent. This will ensure you have enough money left for other expenses like utilities, groceries, and savings.</p>
      
      <h2>2. Create a Wishlist</h2>
      <p>Make a list of your must-haves and nice-to-haves. Must-haves might include a certain number of bedrooms, proximity to public transportation, or pet-friendly policies. Nice-to-haves could be a gym, rooftop terrace, or in-unit washer and dryer.</p>
      
      <h2>3. Start Your Search Early</h2>
      <p>The best apartments tend to go quickly, so start your search at least 6-8 weeks before your desired move-in date. This will give you enough time to explore different neighborhoods and compare options.</p>
      
      <h2>4. Use Multiple Search Platforms</h2>
      <p>Don't limit yourself to just one rental website. Use a combination of platforms like UnitPulse, Zillow, Apartments.com, and local classifieds to maximize your options.</p>
      
      <h2>5. Consider Neighborhoods</h2>
      <p>Research different neighborhoods to find the one that best fits your lifestyle. Consider factors like commute time, amenities, safety, and overall vibe. Visit the area at different times of day to get a sense of what it's like to live there.</p>
      
      <h2>6. Attend Open Houses</h2>
      <p>Open houses are a great way to see multiple apartments in a short amount of time. Come prepared with questions about the property, lease terms, and any additional fees.</p>
      
      <h2>7. Check for Hidden Costs</h2>
      <p>Be sure to ask about additional costs like security deposits, application fees, parking fees, and utilities. These can add up quickly and significantly impact your budget.</p>
      
      <h2>8. Read the Lease Carefully</h2>
      <p>Before signing a lease, read it thoroughly and make sure you understand all the terms and conditions. Pay special attention to clauses about rent increases, maintenance responsibilities, and early termination policies.</p>
      
      <h2>9. Get Everything in Writing</h2>
      <p>Any verbal agreements with the landlord or property manager should be documented in writing. This includes promises about repairs, upgrades, or rent concessions.</p>
      
      <h2>10. Trust Your Gut</h2>
      <p>Finally, trust your instincts. If something doesn't feel right about a property or landlord, it's probably best to keep looking. You'll be spending a significant amount of time in your new home, so it's important to feel comfortable and secure.</p>
      
      <h2>Conclusion</h2>
      <p>Finding the perfect apartment takes time and effort, but with these tips, you'll be well-equipped to navigate the rental market and find a home that meets your needs and budget. Remember to stay organized, be patient, and don't settle for something that doesn't feel right. Happy hunting!</p>
    `,
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Apartment Guide",
    date: "March 28, 2026",
    readTime: "5 min read",
    author: "Sarah Johnson",
    authorBio: "Sarah Johnson is a real estate expert with over 10 years of experience helping renters find their perfect homes. She specializes in urban markets and has a passion for helping people navigate the rental process with ease."
  },
  {
    id: 2,
    title: "The Rise of Coliving Spaces: What You Need to Know",
    excerpt: "Explore the growing trend of coliving and how it's changing the rental landscape.",
    content: `
      <h2>Introduction</h2>
      <p>Coliving has emerged as one of the fastest-growing trends in the rental market, especially among young professionals and digital nomads. This innovative housing model offers a unique blend of private space and shared amenities, creating a sense of community that traditional apartments often lack. In this article, we'll explore what coliving is, its benefits and challenges, and how to determine if it's the right fit for you.</p>
      
      <h2>What is Coliving?</h2>
      <p>Coliving is a housing arrangement where individuals or small groups rent private bedrooms within a larger shared space. Typically, coliving spaces include shared common areas like kitchens, living rooms, and sometimes workspaces. Unlike traditional roommates, coliving arrangements are often managed by professional companies that handle utilities, cleaning, and other logistics.</p>
      
      <h2>The Benefits of Coliving</h2>
      <p>One of the primary benefits of coliving is flexibility. Many coliving spaces offer month-to-month leases, which is ideal for people who need temporary housing or aren't ready to commit to a long-term lease. Coliving also provides a built-in community, which can be especially valuable for people new to a city.</p>
      
      <h2>Is Coliving Right for You?</h2>
      <p>Coliving isn't for everyone, but it can be a great option for certain individuals. If you value flexibility, community, and convenience, coliving might be the perfect fit. However, if you prefer complete privacy and control over your living space, traditional apartments may be a better choice.</p>
    `,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Coliving",
    date: "March 25, 2026",
    readTime: "4 min read",
    author: "Michael Chen",
    authorBio: "Michael Chen is a urban housing expert and author of 'The Future of Living: Coliving and the New Urban Lifestyle.' He has studied housing trends around the world and is a leading voice in the coliving movement."
  },
  {
    id: 3,
    title: "Local Guide: Best Neighborhoods in Los Angeles",
    excerpt: "Discover the most vibrant and livable neighborhoods in LA for renters.",
    content: `
      <h2>Introduction</h2>
      <p>Los Angeles is a city of neighborhoods, each with its own unique character and charm. From the bustling streets of downtown to the laid-back vibes of the beach communities, there's something for everyone in LA. In this guide, we'll explore some of the best neighborhoods for renters, highlighting their key features, amenities, and average rental prices.</p>
      
      <h2>1. Silver Lake</h2>
      <p>Silver Lake is a trendy neighborhood known for its hip restaurants, bars, and music venues. It's popular among young professionals and artists, offering a mix of apartments, condos, and bungalows. The average rent for a one-bedroom apartment in Silver Lake is around $2,800 per month.</p>
      
      <h2>2. Echo Park</h2>
      <p>Located just north of downtown, Echo Park is another popular neighborhood for young renters. It's known for its beautiful lake, vibrant nightlife, and diverse dining options. The average rent for a one-bedroom apartment in Echo Park is slightly lower than Silver Lake, at around $2,500 per month.</p>
      
      <h2>3. West Hollywood</h2>
      <p>West Hollywood, or WeHo, is famous for its nightlife, shopping, and entertainment options. It's a diverse and inclusive neighborhood that attracts people from all walks of life. The average rent for a one-bedroom apartment in West Hollywood is around $3,200 per month.</p>
      
      <h2>4. Culver City</h2>
      <p>Culver City has undergone significant development in recent years, becoming a hub for tech companies and creative professionals. It offers a mix of urban amenities and suburban charm, with the average rent for a one-bedroom apartment around $2,700 per month.</p>
    `,
    image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Local Guide",
    date: "March 30, 2026",
    readTime: "6 min read",
    author: "Emily Rodriguez",
    authorBio: "Emily Rodriguez is a Los Angeles native and lifestyle blogger who specializes in neighborhood guides and urban living. She has explored every corner of LA and loves sharing her insights with others."
  }
];

interface BlogPostPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  handleLogout: () => void;
  showToast: (data: ToastData) => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  handleLogout,
  showToast,
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { favorites, toggleFavorite } = useAppContext();

  const blogPost = BLOG_POSTS.find(post => post.id === parseInt(id || '1')) || BLOG_POSTS[0];
  const relatedPosts = BLOG_POSTS.filter(post => post.id !== blogPost.id).slice(0, 3);
  const recommendedProperties = MOCK_PROPERTIES.slice(0, 3);

  const handleToggleFavorite = (property: Property) => {
    if (!isLoggedIn) {
      setShowLoginView(true);
      return;
    }
    toggleFavorite(property);
  };

  const handleShare = (platform: string) => {
    showToast({
      message: `Shared to ${platform}!`,
      actionLabel: 'View',
      onAction: () => console.log(`Share to ${platform}`),
    });
  };

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
        {/* Breadcrumb */}
        <div className="w-full max-w-5xl mx-auto mt-8 px-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <a href="/" className="hover:text-[#4A5D23] transition-colors">Home</a>
            <ChevronRight size={14} />
            <a href="/blog" className="hover:text-[#4A5D23] transition-colors">Blog</a>
            <ChevronRight size={14} />
            <span className="text-[#4A5D23]">{blogPost.title}</span>
          </div>
        </div>

        {/* Blog Post Header */}
        <div className="w-full max-w-5xl mx-auto mt-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 bg-[#4A5D23] text-white text-xs font-bold rounded-full inline-block mb-6">
              {blogPost.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {blogPost.title}
            </h1>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#4A5D23] text-white text-sm font-black flex items-center justify-center">
                  {blogPost.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{blogPost.author}</p>
                  <p className="text-sm text-neutral-500">{blogPost.date} • {blogPost.readTime}</p>
                </div>
              </div>
            </div>
            <div className="relative h-80 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden mb-12">
              <img 
                src={blogPost.image} 
                alt={blogPost.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Blog Post Content and Top Choices */}
        <div className="w-full max-w-5xl mx-auto px-4 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Blog Content */}
            <div className="lg:col-span-8 space-y-12">
              {/* Blog Post Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg max-w-none prose-headings:text-[#4A5D23] prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-hr:my-8 prose-hr:border-neutral-200"
                dangerouslySetInnerHTML={{ __html: blogPost.content }}
              />

              {/* Share Section */}
              <div className="border-t border-neutral-200 pt-8">
                <h3 className="text-lg font-bold mb-6">Share this article</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleShare('Facebook')}
                    className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#166FE5] transition-colors"
                  >
                    <Facebook size={18} />
                  </button>
                  <button 
                    onClick={() => handleShare('Twitter')}
                    className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:bg-[#1A91DA] transition-colors"
                  >
                    <Twitter size={18} />
                  </button>
                  <button 
                    onClick={() => handleShare('Xiaohongshu')}
                    className="w-10 h-10 rounded-full bg-[#FE2C55] text-white flex items-center justify-center hover:bg-[#E81C45] transition-colors"
                  >
                    <MessageSquare size={18} />
                  </button>
                  <button 
                    onClick={() => handleShare('Copy Link')}
                    className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center hover:bg-neutral-200 transition-colors"
                  >
                    <Link size={18} />
                  </button>
                </div>
              </div>

              {/* Author Bio */}
              <div className="p-6 bg-[#F0EDEA] rounded-xl">
                <h3 className="text-xl font-bold mb-4">About the Author</h3>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4A5D23] text-white text-base font-black flex items-center justify-center flex-shrink-0">
                    {blogPost.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">{blogPost.author}</h4>
                    <p className="text-neutral-600">{blogPost.authorBio}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Top Choices For You */}
                <div className="bg-white rounded-xl border border-black/5 p-6">
                  <h2 className="text-xl font-bold mb-6">Top Choices For You</h2>
                  <div className="space-y-6">
                    {recommendedProperties.map((property, index) => (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                      >
                        <PropertyCard
                          property={property}
                          isFavorite={favorites.some(f => f.id === property.id)}
                          onToggleFavorite={handleToggleFavorite}
                          onClick={(property: Property) => navigate('/search', { state: { propertyId: property.id } })}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 text-center">
                    <a 
                      href="/" 
                      className="inline-flex items-center gap-2 font-medium text-[#4A5D23] hover:text-[#3a4e1a] transition-colors text-sm"
                    >
                      View More Properties <ArrowRight size={14} />
                    </a>
                  </div>
                </div>

                {/* Related Posts */}
                <div className="bg-white rounded-xl border border-black/5 p-6">
                  <h2 className="text-xl font-bold mb-6">Related Articles</h2>
                  <div className="space-y-4">
                    {relatedPosts.map((post, index) => (
                      <motion.a
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className="group flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={post.image}
                            alt={post.title}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs text-[#4A5D23] font-medium mb-1">
                            {post.category}
                          </div>
                          <h3 className="text-sm font-bold mb-1 group-hover:text-[#4A5D23] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="text-xs text-neutral-500">
                            {post.date}
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Footer */}
        <PageFooter />
      </main>
    </div>
  );
};

export default BlogPostPage;