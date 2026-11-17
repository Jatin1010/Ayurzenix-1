import React from 'react';
import { motion } from 'motion/react';
import { Zap, Activity, ChevronRight, Crown, Sparkles, Brain } from 'lucide-react';

export const DailyAyurvedicPath: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-8 mt-2">
      <div className="bg-stone-950 rounded-[3rem] p-1 shadow-2xl relative overflow-hidden group border border-white/5">
        {/* Animated Background Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="bg-stone-950 rounded-[2.8rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-12 relative z-10">
          
          {/* 1. The "Score Circle" - High HD Animation */}
          <div className="relative shrink-0">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="74"
                className="stroke-white/5 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="74"
                className="stroke-emerald-500 fill-none"
                strokeWidth="8"
                strokeDasharray="465"
                initial={{ strokeDashoffset: 465 }}
                animate={{ strokeDashoffset: 465 - (465 * 0.84) }}
                transition={{ duration: 2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tighter">84</span>
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Index</span>
            </div>
          </div>

          {/* 2. AI Intelligence & Verdict Section */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <Crown className="w-3 h-3" />
                  Premium Intelligence
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
                Veda AI <span className="text-stone-500">Verdict</span>
              </h3>
              <p className="text-stone-400 font-medium text-lg italic leading-relaxed">
                "Biological coherence is at <span className="text-white">Optimum</span>. Current transition to Grishma Ritu indicates rising Pitta. Increase hydration with Coconut Water & Moonlit Walks."
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
               {[
                 { label: 'Hydration', val: '92%', icon: Sparkles },
                 { label: 'Digestion', val: 'Low Fire', icon: Activity },
                 { label: 'Prana', val: 'Deep', icon: Brain }
               ].map((stat, i) => (
                 <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                   <stat.icon className="w-3.5 h-3.5 text-stone-500" />
                   <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest">{stat.label}:</span>
                   <span className="text-[10px] font-black text-white">{stat.val}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* 3. Global CTA Arrow */}
          <motion.button 
            whileHover={{ x: 10 }}
            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-xl"
          >
            <ChevronRight className="w-8 h-8" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
