import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../../lib/productService';
import ProductCard from '../ProductCard';
import { useNavigate } from 'react-router-dom';

export function HomeStoreSpotlight() {
  const navigate = useNavigate();
  const spotlightProduct = PRODUCTS.find(p => p.isPopular) || PRODUCTS[0];

  return (
    <div className="px-6 py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-black tracking-tight">Vedic Essential Pick</h2>
          <button 
            onClick={() => navigate('/store')}
            className="flex items-center gap-2 group"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">Everything</span>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="bg-white rounded-[3rem] p-8 text-black relative overflow-hidden group border border-black/5 shadow-2xl">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-neon/20 blur-[100px] -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ayur-neon animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Deal of the day</span>
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter leading-[0.9]">Transform your <br/><span className="text-ayur-neon drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]">Daily Routine</span></h3>
              <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-sm">
                Authentic Ayurvedic wisdom meets modern daily needs. 100% pure, lab-tested, and ethically sourced.
              </p>
              <button 
                onClick={() => navigate('/store')}
                className="px-8 py-4 bg-ayur-neon text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                Visit Full Store
              </button>
            </div>
            
            <div className="w-full md:w-64">
              <ProductCard product={spotlightProduct} variant="store" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
