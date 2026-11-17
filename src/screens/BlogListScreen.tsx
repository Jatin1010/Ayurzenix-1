import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../lib/blogService';
import { Clock, ChevronRight, Sparkles, Search, Filter, Zap, ArrowRight } from 'lucide-react';
import { AdUnit } from '../components/AdUnit';
import { SEO } from '../components/SEO';
import { useState } from 'react';
import { cn } from '../lib/utils';

export default function BlogListScreen() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...new Set(BLOG_POSTS.map(post => post.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(post => post.category === selectedCategory);

  const featuredPost = BLOG_POSTS[10]; // Taking the heart health one as featured for now

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 font-sans selection:bg-emerald-600 selection:text-white">
      <SEO 
        title="Blogs – Ayurvedic Wisdom for Modern Life"
        description="Explore our library of Ayurvedic wisdom. Deep insights into Doshas, gut health, stress relief, and natural wellness by Ayurzenix AI."
      />

      {/* Header */}
      <div className="pt-20 px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600">
               <Sparkles className="w-4 h-4 fill-current" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">The Blogs Library</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-[0.85]">
              Vedic <br />
              <span className="text-emerald-600">Blogs.</span>
            </h1>
          </div>
          <p className="text-gray-500 font-bold max-w-sm text-lg leading-snug">
            Expert Ayurvedic insights meet cutting-edge AI pattern recognition. Explore the future of wellness.
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => navigate(`/blog/${featuredPost.id}`)}
            className="relative h-[60vh] rounded-[4rem] overflow-hidden group cursor-pointer shadow-4xl"
          >
            <img 
              src={featuredPost.imageUrl} 
              alt={featuredPost.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                Recommended by AI
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none max-w-3xl">
                {featuredPost.title}
              </h2>
              <div className="flex items-center gap-6 text-white/60 text-[10px] font-black uppercase tracking-widest">
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories */}
        <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
           {categories.map((cat) => (
             <button
               key={cat}
               onClick={() => setSelectedCategory(cat)}
               className={cn(
                 "px-8 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap border-2",
                 selectedCategory === cat 
                   ? "bg-black text-white border-black shadow-xl" 
                   : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
               )}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredPosts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/blog/${post.id}`)}
              className="bg-white rounded-[3.5rem] shadow-xl overflow-hidden border border-gray-50 cursor-pointer group hover:shadow-3xl transition-all duration-500"
            >
              <div className="h-64 w-full overflow-hidden relative">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6 px-4 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-black uppercase tracking-widest shadow-sm">
                  {post.category}
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Clock className="w-4 h-4" /> {post.readTime}
                </div>
                <h3 className="text-2xl font-black text-black leading-tight tracking-tight uppercase group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 font-bold leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="pt-4 flex items-center gap-2 text-black text-[10px] font-black uppercase tracking-[0.3em] group-hover:gap-4 transition-all">
                  Deep Read <ChevronRight className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="py-20 flex flex-col items-center gap-10">
           <AdUnit />
           <div className="w-px h-24 bg-gray-200" />
           <div className="text-center space-y-4">
              <h4 className="text-2xl font-black uppercase tracking-tighter text-black">Stay Ahead in Wellness</h4>
              <p className="text-gray-400 font-bold max-w-xs mx-auto">New AI-driven health protocols added every Monday.</p>
           </div>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-12 left-6 right-6 z-50 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/health-scan')}
          className="w-full max-w-xl h-24 rounded-[3rem] bg-black text-white font-black text-sm uppercase tracking-[0.4em] flex items-center justify-between px-12 shadow-[0_40px_80px_rgba(0,0,0,0.4)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/0 via-emerald-600/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-xl">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs md:text-sm">Launch Free Wellness Scan</span>
          </div>
          <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform relative z-10 text-emerald-500" />
        </motion.button>
      </div>
    </div>
  );
}
