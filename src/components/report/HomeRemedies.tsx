import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Brain, Clock, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Remedy {
  name: string;
  ingredients: string[];
  steps: string[];
  timing: string;
  duration: string;
  logic: string;
}

interface HomeRemediesProps {
  remedies: Remedy[];
}

export default function HomeRemedies({ remedies }: HomeRemediesProps) {
  return (
    <section className="px-6 space-y-10">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Ancient Alchemy</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Direct Extraction Rituals</p>
        </div>
      </div>

      <div className="space-y-10">
        {(remedies || []).map((remedy, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden group min-h-[500px] flex flex-col justify-between"
          >
            {/* Background elements */}
            <div className={cn(
              "absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg rounded-full blur-[100px] group-hover:scale-110 transition-all duration-1000",
              ["bg-[#A259FF]/10", "bg-emerald-100/40", "bg-rose-100/40", "bg-blue-100/40"][i % 4]
            )} />
            
            <div className={cn(
               "absolute top-0 right-0 p-12 opacity-5 scale-150 -mr-16 -mt-16 group-hover:scale-[1.7] transition-transform duration-700",
               ["text-[#A259FF]", "text-emerald-500", "text-rose-500", "text-blue-500"][i % 4]
            )}>
               <Sparkles className="w-80 h-80 rotate-12" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
               <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <h4 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">{remedy.name}</h4>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-slate-700"><Zap className="w-5 h-5" /></div>
                    </div>
                    <div className="flex gap-4">
                       <div className="px-5 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 shadow-sm">{remedy.timing}</div>
                       <div className="px-5 py-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 shadow-sm">{remedy.duration}</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Bio-Ingredients</p>
                        <div className="flex flex-wrap gap-3">
                           {(remedy.ingredients || []).map((ing, idx) => (
                             <span key={idx} className="px-5 py-2.5 bg-slate-50 border border-slate-100 shadow-sm rounded-2xl text-sm font-black text-slate-700 hover:bg-white transition-all">{ing}</span>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4 pt-8 border-t border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Expert Calibration</p>
                        <p className="text-xl font-medium text-slate-600 leading-relaxed italic border-l border-slate-200 pl-6">"{remedy.logic}"</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-8">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Execution Protocol</p>
                  <div className="space-y-4">
                     {(remedy.steps || []).map((step, idx) => (
                        <div key={idx} className="flex gap-6 p-6 bg-slate-50/50 backdrop-blur-sm border border-slate-100 shadow-sm rounded-3xl group/step hover:bg-white transition-all">
                           <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-700 text-xs font-black shrink-0 group-hover/step:scale-110 transition-transform">{idx + 1}</div>
                           <p className="text-base font-bold text-slate-700 leading-relaxed">{step}</p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="relative z-10 pt-16 flex items-center justify-between border-t border-slate-100 mt-12">
               <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Extraction V.2.1</span>
               </div>
               <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-widest", ["text-[#A259FF]", "text-emerald-500", "text-rose-500", "text-blue-500"][i % 4])}>
                  Ready for ritual <ChevronRight className="w-4 h-4" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
