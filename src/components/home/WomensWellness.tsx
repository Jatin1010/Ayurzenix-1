import React from 'react';
import { motion } from 'motion/react';
import { Activity, ShieldCheck, Heart, Sparkles, ArrowUpRight } from 'lucide-react';

interface WellnessProps {
  onFeature: (path: string) => void;
}

export const WomensWellness: React.FC<WellnessProps> = ({ onFeature }) => {
  return (
    <section className="relative py-12 lg:py-20 overflow-hidden bg-rose-50/20">
      {/* Soft Atmosphere */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-rose-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="order-2 lg:order-1 relative px-0">
             <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4 md:space-y-8">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-rose-200/50"
                   >
                      <img src="https://images.unsplash.com/photo-1574621100236-d25b64cfd647?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Wellness" />
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.1 }}
                     className="glass-card p-6 md:p-8 aspect-square flex flex-col justify-between border-slate-100/50"
                   >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                        <Heart className="w-5 h-5 md:w-6 md:h-6 fill-rose-500" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-slate-900 text-lg uppercase tracking-tight leading-none mb-1">PCOS Support</h4>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Hormonal Protocol</p>
                      </div>
                   </motion.div>
                </div>
                <div className="space-y-4 md:space-y-8 pt-8 md:pt-16">
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.2 }}
                     className="glass-card p-6 md:p-8 aspect-square flex flex-col justify-between border-slate-100/50"
                   >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center border border-violet-100">
                        <Activity className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-heading font-black text-slate-900 text-lg uppercase tracking-tight leading-none mb-1">Cycle Care</h4>
                        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Lunar Tracking</p>
                      </div>
                   </motion.div>
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.3 }}
                     className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-violet-200/50"
                   >
                      <img src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" alt="Yoga" />
                   </motion.div>
                </div>
             </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">The Shakti Engine Architecture</span>
              </motion.div>
              
              <h2 className="text-3xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-[1] uppercase">
                 Women's <br />
                 Wellness <br />
                 <span className="premium-gradient-text italic">Reimagined.</span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed">
                 Specialized Ayurvedic protocols for hormonal sovereignty, cycle intelligence, and maternal health, guided by high-precision AI.
              </p>
            </div>

            <div className="space-y-4">
               <div className="glass-card p-6 flex gap-6 border-rose-100/30">
                  <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                     <ShieldCheck className="w-7 h-7 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-heading font-black text-slate-900 text-xl tracking-tight leading-none mb-1 uppercase">Evidence-Backed Protocol</h4>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">Safe, effective, and rooted in both ancient Charaka Samhita and modern clinical markers.</p>
                  </div>
               </div>
            </div>

            <div className="pt-4">
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => onFeature('/hormonal-balance-landing')}
                 className="group px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest flex items-center gap-4 shadow-2xl shadow-slate-200"
               >
                  Explore Hormonal Wellness
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
