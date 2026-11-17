import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Product {
  name: string;
  benefit: string;
  link_search_term: string;
}

interface ProductRecommendationsProps {
  products: Product[];
}

export default function ProductRecommendations({ products }: ProductRecommendationsProps) {
  return (
    <section className="px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Curation DNA</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Strategic Ayurvedic Support</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100/50 rounded-2xl text-amber-500 shadow-sm">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Bio-Curated</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products || []).map((product, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex flex-col justify-between group transition-all min-h-[340px] relative overflow-hidden"
          >
             <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] max-w-[200px] max-h-[200px] rounded-full blur-[60px] pointer-events-none transition-all duration-1000 bg-amber-50/50 group-hover:scale-110 group-hover:bg-amber-100/40" />
             <div className="space-y-6 relative z-10">
                <div className="flex items-start justify-between">
                   <div className="w-16 h-16 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-slate-700 group-hover:scale-110 group-hover:text-amber-500 transition-all">
                      <Star className="w-8 h-8" />
                   </div>
                   <div className="text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Rating</p>
                      <p className="text-sm font-[1000] text-amber-500 pt-1">4.9/5</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-amber-500 transition-colors">{product.name}</h4>
                   <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category: Vedic Supplement</p>
                </div>

                <p className="text-sm font-medium text-slate-600 leading-relaxed italic border-l-3 border-amber-100 pl-4">
                  "{product.benefit}"
                </p>
             </div>

             <a 
               href={`https://www.amazon.in/s?k=${encodeURIComponent(product.link_search_term)}`} 
               target="_blank" 
               rel="noreferrer"
               className="mt-8 w-full py-4 bg-slate-900 border border-slate-800 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl hover:bg-slate-800 relative z-10"
             >
               Get Authentic DNA <ArrowRight className="w-4 h-4 text-amber-400" />
             </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
