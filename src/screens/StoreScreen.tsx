import { useState, useEffect, useMemo } from 'react';
import { SEO } from '../components/SEO';
import { 
  Search, 
  ShoppingBag, 
  Star, 
  TrendingUp, 
  Leaf, 
  Zap, 
  ChevronRight,
  Sparkles,
  ArrowLeft,
  Filter,
  Brain,
  Droplets,
  Wind,
  Moon,
  Heart,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, Product } from '../lib/productService';
import ProductCard from '../components/ProductCard';
import { NativeAd } from '../components/AdManager';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { cn } from '../lib/utils';

interface StoreScreenProps {
  userData: any;
  appConfig?: any;
}

const CATEGORIES = ['All Products', 'Herbals', 'Oils', 'Facial Care', 'Wellness', 'Body Type'];

const TOP_CATEGORIES = [
  { id: 'Wellness', label: 'Daily Wellness', image: 'https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=600', size: 'large' },
  { id: 'Oils', label: 'Essence Oils', image: 'https://images.pexels.com/photos/5412270/pexels-photo-5412270.jpeg?auto=compress&cs=tinysrgb&w=600', size: 'small' },
  { id: 'Facial Care', label: 'Skin Glow', image: 'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=600', size: 'small' },
];

const CONCERNS = [
  { id: 'stress', label: 'Stress', icon: Brain },
  { id: 'skin', label: 'Glowing Skin', icon: Sparkles },
  { id: 'energy', label: 'Max Energy', icon: Zap },
  { id: 'digestion', label: 'Digestion', icon: Flame },
  { id: 'hair', label: 'Hair Care', icon: Droplets },
  { id: 'heart', label: 'Heart Health', icon: Heart },
];

export default function StoreScreen({ userData, appConfig }: StoreScreenProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [selectedConcern, setSelectedConcern] = useState<string | null>(null);
  const [userDosha, setUserDosha] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    const fetchUserDosha = async () => {
      // Don't fetch for guest or missing uid
      if (!userData?.uid || userData.is_guest) {
        setLoading(false);
        return;
      }
      try {
        const q = query(
          collection(db, 'health_profiles'),
          where('uid', '==', userData.uid),
          orderBy('createdAt', 'desc'),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestProfile = querySnapshot.docs[0].data();
          setUserDosha(latestProfile.analysis?.doshaAnalysis?.dominantDosha || null);
        }
      } catch (error) {
        console.error("Error fetching user dosha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDosha();
  }, [userData?.uid]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.benefit.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory === 'Herbals') matchesCategory = product.category === 'Daily Wellness' || product.category === 'Most Popular';
      else if (selectedCategory === 'Oils') matchesCategory = product.name.toLowerCase().includes('oil');
      else if (selectedCategory === 'Wellness') matchesCategory = product.category === 'Daily Wellness';
      else if (selectedCategory === 'Facial Care') matchesCategory = product.name.toLowerCase().includes('face') || product.name.toLowerCase().includes('neem');
      else if (selectedCategory === 'Trending Now') matchesCategory = !!product.isTrending;
      else if (selectedCategory === 'Body Type') matchesCategory = !!(userDosha && product.bodyType?.includes(userDosha));
      else if (selectedCategory !== 'All Products') matchesCategory = product.category === selectedCategory;

      const matchesConcern = !selectedConcern || product.concern === selectedConcern;

      return matchesSearch && matchesCategory && matchesConcern;
    });
  }, [searchQuery, selectedCategory, userDosha, selectedConcern]);

  const doshaProducts = useMemo(() => {
    if (!userDosha) return [];
    return PRODUCTS.filter(p => p.bodyType?.includes(userDosha)).slice(0, 6);
  }, [userDosha]);

  return (
    <div className="min-h-screen bg-white pb-32">
      <SEO 
        title="Ayurvedic Store - Pure Herbs & Supplements" 
        description="Shop authentic Ayurvedic herbs, wellness products, and personalized supplements on Ayurzenix Store."
        url="/store"
      />
      {/* Minimalist Header */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-30 px-6 pt-14 pb-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black active:scale-90 transition-all border border-black/5 shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black uppercase tracking-tight text-black">Ayurzenix Store</h1>
          </div>
          <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black border border-black/5 shadow-sm">
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-12">
        {/* Bento Gallery Categories */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[400px]">
          {TOP_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] group border border-black/5",
                cat.size === 'large' ? "row-span-2" : "col-span-1"
              )}
            >
              <img 
                src={cat.image} 
                alt={cat.label} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-ayur-neon/70 mb-1">Explore</p>
                <h4 className="text-xl font-black uppercase tracking-tighter text-white">{cat.label}</h4>
              </div>
            </button>
          ))}
        </div>

        {/* Search Input Area */}
        <div className="relative group">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search wellness products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8f8f8] border-2 border-transparent rounded-[2rem] pl-16 pr-12 py-6 text-sm font-black focus:bg-white focus:border-black shadow-none focus:shadow-xl transition-all placeholder:text-gray-400 outline-none"
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Wellness Bundles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-black tracking-tight">Wellness Bundles</h2>
            <span className="text-[9px] font-black text-ayur-purple uppercase tracking-[0.2em] bg-ayur-purple/5 px-4 py-1.5 rounded-full border border-ayur-purple/10 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-ayur-purple rounded-full animate-pulse" />
              Save 30%
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { id: 'b1', title: 'Ultimate Immunity Kit', items: 'Amla + Giloy + Tulsi', price: '₹799', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { id: 'b2', title: 'Deep Stress Recovery', items: 'Ashwagandha + Brahmi', price: '₹999', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { id: 'b3', title: 'Vitality Booster Stack', items: 'Shilajit + Safed Musli', price: '₹1,499', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' }
            ].map((bundle) => (
              <motion.div
                key={bundle.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="p-6 bg-white rounded-[2.5rem] border border-black/5 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-5">
                  <div className={cn("w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:rotate-12", bundle.bg, bundle.color)}>
                    <bundle.icon className="w-7 h-7" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">{bundle.title}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{bundle.items}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-lg font-black text-black tabular-nums">{bundle.price}</p>
                  <div className="flex items-center gap-1 text-ayur-purple">
                    <span className="text-[9px] font-black uppercase tracking-widest group-hover:mr-2 transition-all">Buy Bundle</span>
                    <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Shop by Concern Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-black tracking-tight">Shop by Concern</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
            {CONCERNS.map(concern => (
              <button
                key={concern.id}
                onClick={() => setSelectedConcern(prev => prev === concern.id ? null : concern.id)}
                className={cn(
                  "flex flex-col items-center gap-3 min-w-[100px] p-6 rounded-[2.5rem] transition-all border-2",
                  selectedConcern === concern.id
                    ? "bg-black border-black shadow-xl"
                    : "bg-white border-black/5 hover:border-black/10"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  selectedConcern === concern.id ? "bg-white/10" : "bg-gray-50"
                )}>
                  <concern.icon className={cn("w-6 h-6", selectedConcern === concern.id ? "text-ayur-neon" : "text-black")} />
                </div>
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-widest",
                  selectedConcern === concern.id ? "text-white" : "text-gray-400"
                )}>
                  {concern.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Dosha Section */}
        {userDosha && !searchQuery && !selectedConcern && (
          <div className="space-y-6">
            <div className="bg-black rounded-[3rem] p-10 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-neon/20 blur-[100px] -mr-32 -mt-32" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-ayur-neon animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Personalized for you</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">Balanced for <span className="text-ayur-neon">{userDosha}</span></h3>
                  </div>
                  <Sparkles className="w-12 h-12 text-ayur-neon" />
                </div>
                
                {/* Horizontal Product List for Dosha */}
                <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
                  {doshaProducts.map((product) => (
                    <div key={product.id} className="min-w-[280px]">
                      <ProductCard product={product} variant="recommended" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Featured Selection */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-black tracking-tight">
              {selectedCategory === 'All Products' ? 'Curated Selection' : selectedCategory}
            </h2>
            <div className="flex items-center gap-2 bg-black/5 px-4 py-2 rounded-full border border-black/5">
              <div className="w-1.5 h-1.5 bg-ayur-neon rounded-full" />
              <span className="text-[9px] font-black uppercase tracking-widest text-black">{filteredProducts.length} items</span>
            </div>
          </div>

          {/* Categories Horizontal Chips */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-b-4",
                  selectedCategory === cat 
                    ? "bg-black text-white border-ayur-neon shadow-xl -translate-y-1" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-black/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-12 pt-4">
            {filteredProducts.slice(0, visibleCount).map((product) => (
              <ProductCard key={product.id} product={product} variant="store" />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-24 space-y-6 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div className="space-y-1">
                <p className="text-gray-900 font-black text-sm uppercase tracking-widest">No Products Found</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Try a different search or category</p>
              </div>
            </div>
          )}

          {visibleCount < filteredProducts.length && (
            <div className="pt-8 text-center">
              <button 
                onClick={() => setVisibleCount(prev => prev + 20)}
                className="w-full py-6 bg-black text-white rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
