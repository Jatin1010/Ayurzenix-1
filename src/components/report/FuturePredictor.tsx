import React from 'react';
import { motion } from 'motion/react';
import { Crown, Sparkles, AlertCircle, ArrowRight, TrendingUp, Target } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FuturePredictorProps {
  prediction: string;
  isLocked: boolean;
}

export default function FuturePredictor({ prediction, isLocked }: FuturePredictorProps) {
  const safePrediction = prediction || "Analyzing high-confidence systemic trajectories...";
  
  return (
    <section className="px-6 space-y-8 relative overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Biological Forecast</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">AI Future Health Predictor</p>
        </div>
      </div>

      <div className={cn("relative", isLocked && "filter blur-3xl pointer-events-none opacity-40")}>
        <div className="bg-white p-12 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group relative overflow-hidden min-h-[400px] flex flex-col justify-between">
           <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-teal-50/50 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-teal-100/40 transition-all duration-1000" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-emerald-50/50 rounded-full blur-[80px]" />

           <div className="absolute top-0 right-0 p-12 text-teal-500/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform">
              <Sparkles className="w-80 h-80 rotate-12" />
           </div>

           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-100/50 text-teal-500 shadow-sm">
                       <TrendingUp className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">30-90 Day Outlook</span>
                    </div>
                    <h4 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Systemic Evolution</h4>
                 </div>
                 
                 <div className="relative">
                    <div className="absolute left-0 top-0 w-1.5 h-full bg-teal-400 rounded-full shadow-inner" />
                    <p className="pl-8 text-xl font-medium text-slate-600 leading-relaxed italic border-l border-slate-100">
                      "{safePrediction}"
                    </p>
                 </div>
              </div>

              <div className="space-y-10">
                 <div className="p-8 bg-slate-50 border border-slate-100/60 rounded-[2.5rem] space-y-6 shadow-sm">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle className="w-4 h-4 text-rose-400" /> Risk Matrix Mapping
                    </div>
                    <div className="space-y-4">
                       {[
                         { label: 'Metabolic Stability', val: 'Improving' },
                         { label: 'Dosha Resurgence', val: 'Mitigated' },
                         { label: 'Long-term Vitality', val: 'High' }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm">
                           <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
                           <span className="text-xs font-black text-teal-500">{item.val}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 rounded-[2.5rem] bg-teal-50 shadow-inner border border-teal-100/50 flex items-center justify-center text-teal-500 animate-float">
                       <Target className="w-8 h-8" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expert Protocol Optimized</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-x-6 inset-y-16 flex items-center justify-center z-20">
           <div className="max-w-md text-center space-y-8 bg-white/60 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="w-24 h-24 bg-amber-50 border border-amber-100/50 text-amber-500 rounded-[3rem] flex items-center justify-center mx-auto shadow-sm">
                 <Crown className="w-12 h-12" />
              </div>
              <div className="space-y-4">
                 <h4 className="text-3xl font-[1000] text-slate-900 tracking-tight uppercase leading-none">Unlock Biological Foresight</h4>
                 <p className="text-base font-bold text-slate-500 italic max-w-sm mx-auto leading-relaxed">Our AI can predict your future health risks based on current systemic entropy. Upgrade to see your 90-day trajectory.</p>
              </div>
              <button className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-[1000] uppercase tracking-[0.4em] text-xs shadow-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors">
                 Go Premium <ArrowRight className="w-5 h-5 text-amber-400" />
              </button>
           </div>
        </div>
      )}
    </section>
  );
}
