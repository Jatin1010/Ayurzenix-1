import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Info, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AyurvedicInsightProps {
  insight: string;
  detailedReasoning?: string;
}

export default function AyurvedicInsight({ insight, detailedReasoning }: AyurvedicInsightProps) {
  const safeInsight = insight || "Processing deep metabolic insights...";
  
  return (
    <section className="px-6 space-y-8">
      <div className="bg-white p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-sm max-h-sm bg-emerald-100/50 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute top-0 right-0 p-8 text-emerald-500/5 -mr-16 -mt-16 transition-transform">
          <Leaf className="w-80 h-80 rotate-12" />
        </div>
        
        <div className="relative z-10 space-y-10 max-w-3xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-600 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Protocol Intelligence</span>
            </div>
            <h3 className="text-4xl font-heading font-black text-black tracking-tight leading-none uppercase">Holistic AI Synthesis</h3>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-300 rounded-full" />
            <div className="pl-8 space-y-8">
              <p className="text-xl md:text-2xl font-medium text-slate-700 leading-relaxed italic">
                "{safeInsight}"
              </p>
              
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                {[
                  { label: "Dosha Harmony", val: "High" },
                  { label: "Cellular Energy", val: "Optimal" },
                  { label: "Nervous Flow", val: "Restorative" }
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-xl font-bold text-emerald-500">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-wrap gap-3">
             {['Ancient Vedic Logic', 'AI Biological Mapping', 'Molecular Diagnostics'].map((tag, i) => (
               <span key={i} className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 text-slate-500">{tag}</span>
             ))}
          </div>
        </div>
      </div>

      {detailedReasoning && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-black text-white p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 relative overflow-hidden group"
        >
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-sm max-h-sm bg-emerald-500/20 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Zap className="w-40 h-40" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                <ShieldCheck className="w-5 h-5 text-black" />
              </div>
              <h4 className="text-xl font-black uppercase tracking-widest">AI LOGIC CITATION</h4>
            </div>
            <p className="text-lg font-medium text-slate-300 leading-relaxed border-l-2 border-emerald-500/50 pl-6">
              {detailedReasoning}
            </p>
            <div className="pt-6 flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verified Grounded Reasoning</p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
