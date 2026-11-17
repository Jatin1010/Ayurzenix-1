import React from 'react';
import { motion } from 'motion/react';
import { Clock, Heart, Moon, Zap, Smile, ArrowRight, Sparkles, Utensils, Headphones } from 'lucide-react';

interface DailyProps {
  onFeature: (path: string) => void;
}

export const DailyOptimization: React.FC<DailyProps> = ({ onFeature }) => {
  const items = [
    { icon: Clock, title: 'Nature-Synced Routine', path: '/daily-routine-landing', color: 'emerald' },
    { icon: Utensils, title: 'Aahar Vision Scanner', path: '/aahar-scanner-landing', color: 'emerald' },
    { icon: Headphones, title: 'AI Soundscapes', path: '/soundscapes', color: 'violet' },
    { icon: Smile, title: 'Mood-Based Ayurveda', path: '/mood-ayurveda-landing', color: 'violet' },
    { icon: Moon, title: 'Sleep Optimization', path: '/goal/better-sleep', color: 'blue' },
    { icon: Zap, title: 'Instant Energy Boosters', path: '/energy-landing', color: 'amber' }
  ];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-[30vw] h-[30vw] bg-emerald-50 rounded-full blur-[100px] -translate-x-1/2 opacity-50" />

      <div className="section-container relative z-10 px-4">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Biological Rhythm Optimization</span>
              </motion.div>

              <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight uppercase">
                Optimize Your <br />
                <span className="premium-gradient-text">Everyday Life.</span>
              </h2>
              
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                Alignment with circadian rhythms is the master key to human performance. Our AI architects your day around your unique biology.
              </p>
            </div>

            <div className="grid gap-4">
               {items.map((item, i) => (
                 <motion.button
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   whileHover={{ x: 10 }}
                   onClick={() => onFeature(item.path)}
                   className="group w-full glass-card p-6 flex items-center justify-between border-slate-100/50 hover:border-emerald-200 transition-all text-left"
                 >
                   <div className="flex items-center gap-5">
                     <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 flex items-center justify-center text-${item.color}-500 border border-${item.color}-100 group-hover:scale-110 transition-transform shadow-sm`}>
                       <item.icon className="w-7 h-7" />
                     </div>
                     <div>
                        <span className="font-heading font-black text-lg text-slate-900 uppercase tracking-tight leading-none">{item.title}</span>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Activate Protocol</p>
                     </div>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ArrowRight className="w-5 h-5" />
                   </div>
                 </motion.button>
               ))}
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative group">
              {/* Photo Frame */}
              <div className="absolute -inset-4 bg-emerald-50 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative z-10 glass-card p-4 rounded-[4.5rem]">
                <img 
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=800" 
                  alt="Ayurvedic Routine"
                  className="w-full rounded-[3.5rem] object-cover aspect-[4/5] shadow-sm"
                />
              </div>

              {/* Dynamic Badge */}
              <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
                className="absolute -top-6 -right-6 z-20 glass-card p-6 border-emerald-100/50 flex flex-col items-center gap-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                  <Heart className="w-6 h-6 text-emerald-500 fill-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Consistency</p>
                  <p className="text-2xl font-black text-slate-900 leading-none">12 Days</p>
                </div>
              </motion.div>

              {/* Activity Indicator */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute bottom-10 -left-10 z-20 glass-card p-4 flex items-center gap-4 border-slate-100"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Daily Optimization Active</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
