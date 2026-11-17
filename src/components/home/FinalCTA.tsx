import React from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface CTAProps {
  onStart: () => void;
}

export const FinalCTA: React.FC<CTAProps> = ({ onStart }) => {
  return (
    <section className="relative overflow-hidden py-12 lg:py-20 px-4">
      {/* Decorative Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] bg-emerald-50/30 rounded-full blur-[150px] pointer-events-none" />

      <div className="section-container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card bg-white/40 p-8 md:p-20 rounded-[3rem] border border-white/80 shadow-2xl relative overflow-hidden text-center flex flex-col items-center"
        >
           {/* Animated Background Elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100/40 blur-[100px] -mr-48 -mt-48 animate-aura" />
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/40 blur-[100px] -ml-48 -mb-48 animate-aura" style={{ animationDelay: '-2s' }} />

           <div className="relative z-10 max-w-4xl space-y-8 md:space-y-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-white shadow-sm"
              >
                 <Sparkles className="w-3.5 h-3.5 text-ayur-primary" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Begin Your Transformation</span>
              </motion.div>

              <div className="space-y-4 md:space-y-6">
                <h2 className="text-3xl md:text-7xl font-heading font-black text-slate-900 tracking-tight leading-[1] md:leading-[1]">
                  Your Body Already Knows. <br />
                  <span className="premium-gradient-text italic">AI Helps You Understand It.</span>
                </h2>

                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                  Join thousands who have decoded their biological blueprint for a life of perfect balance.
                </p>
              </div>

              <div className="flex flex-col items-center gap-8 md:gap-10">
                 <motion.button 
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={onStart}
                   className="btn-primary px-10 py-5 text-lg group flex items-center gap-4 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl shadow-slate-200"
                 >
                    Start Your Free AI Analysis
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                 </motion.button>

                 <div className="flex flex-wrap justify-center gap-6 md:gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                       </div>
                       Private & Secure
                    </div>
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-violet-50 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-violet-500" />
                       </div>
                       Instant AI Insights
                    </div>
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-amber-500" />
                       </div>
                       Certified Protocols
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
};
