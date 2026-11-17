import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const categories = ["Digestion", "Sleep", "Dosha", "Stress", "Hormones", "Skin", "Weight Loss"];

const articles = [
  {
    title: "Understanding Your Dosha: The Blueprint of Your Soul",
    category: "Dosha",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600",
    readTime: "5 Min Read"
  },
  {
    title: "Gut-Brain Connection: Why Your Digestion Affects Your Mood",
    category: "Digestion",
    image: "https://images.unsplash.com/photo-1543333309-8744b866c1b3?auto=format&fit=crop&q=80&w=600",
    readTime: "7 Min Read"
  },
  {
    title: "Ayurvedic Secrets for Deep, Restorative Sleep",
    category: "Sleep",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
    readTime: "6 Min Read"
  }
];

export const ContentHub: React.FC<{ onViewAll: () => void }> = ({ onViewAll }) => {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-50 rounded-full blur-[120px] pointer-events-none opacity-40 translate-x-1/2 -translate-y-1/2" />

      <div className="section-container relative z-10 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Professional Wellness Blogs</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-[1.1] uppercase">
             Ancient Wisdom. <br />
             <span className="premium-gradient-text italic">Modern Science.</span>
          </h2>
          
          <p className="text-lg text-slate-700 font-medium font-body leading-relaxed max-w-xl mx-auto">
             Deep insights into the perfect synthesis of 5,000-year-old biological healing and cutting-edge neural computation.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 pt-4">
             {categories.map((cat, i) => (
               <motion.button 
                 key={cat}
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 onClick={onViewAll}
                 className="px-5 py-2 rounded-full bg-white border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-emerald-200 hover:text-emerald-500 hover:bg-emerald-50 transition-all shadow-sm"
               >
                 {cat}
               </motion.button>
             ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {articles.map((article, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               whileHover={{ y: -10 }}
               className="group cursor-pointer glass-card overflow-hidden transition-all duration-500 border-white/50"
             >
                <div className="aspect-[1.6/1] overflow-hidden relative">
                   <img 
                     src={article.image} 
                     alt={article.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                   />
                   <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 border border-white/50 shadow-sm">
                      {article.category}
                   </div>
                </div>
                <div className="p-8 space-y-6">
                   <h3 className="text-xl font-black text-slate-900 leading-[1.25] tracking-tight group-hover:text-emerald-500 transition-colors uppercase">
                     {article.title}
                   </h3>
                   <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[9px] tracking-widest">
                         <BookOpen className="w-3.5 h-3.5" />
                         {article.readTime}
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all group-hover:border-transparent">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        <div className="mt-20 text-center">
           <motion.button 
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             onClick={onViewAll}
             className="px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-100 hover:bg-slate-50 transition-all"
           >
              Explore Blogs
           </motion.button>
        </div>
      </div>
    </section>
  );
};
