import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Target, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TriggerAnalysisProps {
  triggers: string[];
}

export default function TriggerAnalysis({ triggers }: TriggerAnalysisProps) {
  const safeTriggers = triggers || [];
  
  return (
    <section className="px-6 space-y-6">
      <div className="flex items-center gap-3 px-2">
        <ShieldAlert className="w-5 h-5 text-rose-500" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Negative Bio-Triggers</h3>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden space-y-12">
         <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-rose-50/50 rounded-full blur-[100px] pointer-events-none" />
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {safeTriggers.map((trigger, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-start gap-5 p-6 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] border border-black/5 shadow-sm hover:bg-white transition-all group"
              >
                 <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 shadow-inner transition-transform">
                    <AlertTriangle className="w-5 h-5" />
                 </div>
                 <div className="space-y-1 pt-1">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Diagnostic: #{i + 1}</p>
                    <p className="text-sm font-bold text-slate-700 leading-snug">{trigger}</p>
                 </div>
              </motion.div>
            ))}
            {safeTriggers.length === 0 && (
              <p className="text-xs text-slate-400 italic">Scanning systemic interference...</p>
            )}
         </div>

         <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-rose-500/5 group-hover:scale-110 transition-transform">
               <Zap className="w-48 h-48" />
            </div>
            <div className="w-16 h-16 rounded-[2rem] bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center shrink-0 shadow-inner relative z-10 animate-float">
               <Target className="w-8 h-8" />
            </div>
            <div className="space-y-2 relative z-10">
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Systemic Neutralization</h4>
               <p className="text-sm font-medium text-slate-600 leading-relaxed italic max-w-2xl">
                 Removing these triggers is CRITICAL. Ayurzenix AI has detected that 92% of your current biological imbalance stems from these specific systemic drivers.
               </p>
            </div>
         </div>
      </div>
    </section>
  );
}
