import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote, CheckCircle2, Users, Award, Zap } from 'lucide-react';

const testimonials = [
  {
    name: "Ananya Sharma",
    role: "UX Strategy Lead",
    text: "Ayurzenix decoded my constant fatigue. The personalized Vata-Pitta diet was a game changer for my high-stress work environment.",
    rating: 5,
    tag: "Energy Booster",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    name: "Dr. Rajesh Iyer",
    role: "Integrative Health Consultant",
    text: "As a doctor, I'm impressed by the precision of the AI diagnostic patterns. It's a true bridge between science and tradition.",
    rating: 5,
    tag: "Medically Accurate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    name: "Priya Desai",
    role: "Holistic Wellness Influencer",
    text: "The Face Glow analyzer actually works! My skin has never looked better after following the Ojas-building routine suggested by AI.",
    rating: 5,
    tag: "Skin Glow",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
  }
];

export const SocialProof: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-10 lg:py-16">
      {/* Background blobs for light atmosphere */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-violet-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="section-container relative z-10 px-4">
        <div className="text-center mb-12 space-y-4">
           <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-premium"
           >
              <Users className="w-3.5 h-3.5 text-ayur-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted by Global High-Performers</span>
           </motion.div>
           
           <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-slate-900 leading-tight">
             The Future of <br className="md:hidden" />
             <span className="premium-gradient-text">Personal Wellness.</span>
           </h2>

           <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 pt-4">
              {[
                { val: "50k+", label: "Elite Users", icon: Users },
                { val: "4.9/5", label: "App Rating", icon: Award },
                { val: "220M+", label: "Data Points", icon: Zap }
              ].map((stat, sIdx) => (
                <div key={sIdx} className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-2">
                      <stat.icon className="w-5 h-5 text-ayur-primary opacity-50" />
                      <span className="text-4xl font-heading font-black text-slate-900 tracking-tighter">{stat.val}</span>
                   </div>
                   <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">{stat.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {testimonials.map((item, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               whileHover={{ y: -10 }}
               className="glass-card p-10 relative group hover:shadow-2xl hover:bg-white/90 transition-all duration-500"
             >
                <Quote className="absolute top-10 right-10 w-12 h-12 text-slate-100 group-hover:text-ayur-primary/10 transition-colors" />
                
                <div className="flex gap-1 mb-6 relative">
                   {[...Array(item.rating)].map((_, i) => (
                     <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                   ))}
                </div>

                <p className="text-lg md:text-xl font-medium text-slate-700 leading-relaxed mb-10 relative italic">
                   "{item.text}"
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-slate-100 relative">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                         <img src={item.image} alt={`Ayurvedic wellness success story: ${item.name}`} title={item.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div>
                         <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.role}</p>
                      </div>
                   </div>
                   <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                      <CheckCircle2 className="w-3.3 h-3.3" />
                      {item.tag}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
