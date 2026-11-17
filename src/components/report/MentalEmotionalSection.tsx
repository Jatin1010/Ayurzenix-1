import React from 'react';
import { motion } from 'motion/react';
import { Brain, Smile, Zap, Cloud, Moon, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MentalEmotionalSectionProps {
  mentalState: string;
}

export default function MentalEmotionalSection({ mentalState }: MentalEmotionalSectionProps) {
  const safeState = mentalState || "Processing mental architecture...";
  return (
    <section className="px-6 space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Brain className="w-5 h-5 text-indigo-500" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Psychological Mapping</h3>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-sm max-h-sm bg-indigo-100/50 rounded-full blur-[120px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] max-w-sm max-h-sm bg-purple-100/40 rounded-full blur-[100px] -ml-16 -mb-16" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 lg:space-y-12">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100 text-indigo-600 shadow-sm">
                <Cloud className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Stress Load</span>
              </div>
              <p className="text-2xl font-medium text-slate-700 leading-relaxed italic border-l-4 border-indigo-200 pl-6">
                "{safeState}"
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { label: 'Sattva', value: 65, sub: 'Purity', color: 'bg-emerald-400' },
                { label: 'Rajas', value: 25, sub: 'Agitation', color: 'bg-amber-400' },
                { label: 'Tamas', value: 10, sub: 'Inertia', color: 'bg-rose-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                   <div className="relative h-24 bg-slate-100 rounded-3xl overflow-hidden flex flex-col justify-end shadow-inner">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${item.value}%` }}
                        className={cn("w-full transition-all duration-1000 rounded-t-lg", item.color)}
                      />
                   </div>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/50 backdrop-blur-xl border border-white/60 p-8 space-y-8 rounded-[2.5rem] shadow-sm">
            <div className="space-y-2">
              <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Vedic Resilience Score
              </h5>
              <div className="text-6xl font-black text-slate-900 tracking-tighter">82%</div>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 bg-white rounded-2xl border border-black/5 hover:bg-slate-50 transition-colors shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Primary Sentiment</p>
                <p className="text-sm font-bold text-slate-700 italic">"High awareness with occasional Vata-induced restlessness."</p>
              </div>
              <div className="p-5 bg-white rounded-2xl border border-black/5 hover:bg-slate-50 transition-colors shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">Neural Recovery</p>
                <p className="text-sm font-bold text-slate-700 italic">"Rapid restoration possible through guided Pranayama."</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
