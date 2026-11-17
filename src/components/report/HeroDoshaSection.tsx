import React from 'react';
import { motion } from 'motion/react';
import { Dna, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeroDoshaSectionProps {
  dosha: {
    dominant: string;
    insight: string;
  };
}

export default function HeroDoshaSection({ dosha }: HeroDoshaSectionProps) {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative px-6 pt-8"
    >
      <div className="bg-white rounded-[3rem] p-10 flex flex-col lg:flex-row lg:items-center justify-between group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] overflow-hidden relative gap-8 lg:gap-16">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-emerald-100/40 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 space-y-6 flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Dominant Constitution</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-slate-900 uppercase tracking-tight leading-tight"
            >
              {dosha?.dominant || "Analyzing..."}
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-start gap-4 pt-2"
            >
              <div className="w-1 self-stretch bg-emerald-200 rounded-full shrink-0" />
              <p className="text-lg lg:text-xl font-medium text-slate-600 leading-relaxed italic max-w-2xl">
                "{dosha?.insight || "Extracting biological constitution parameters..."}"
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center lg:items-end justify-center gap-6 shrink-0 pt-8 lg:pt-0 lg:border-l lg:border-black/5 lg:pl-16">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
            ))}
          </div>
          
          <div className="text-center lg:text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reliability Index</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">98.4%</p>
            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1">AI-Vedic Sync Active</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
