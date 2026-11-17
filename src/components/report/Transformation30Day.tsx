import React from 'react';
import { motion } from 'motion/react';
import { Crown, Target, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WeekMilestone {
  week: number;
  milestone: string;
  focus: string;
}

interface Transformation30DayProps {
  plan: WeekMilestone[];
  isLocked: boolean;
}

export default function Transformation30Day({ plan, isLocked }: Transformation30DayProps) {
  return (
    <section className="px-6 space-y-12 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">30-Day Evolution</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Sustained Systemic Transformation</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100/50 rounded-2xl text-amber-500 shadow-sm">
          <Crown className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Premium Strategic Asset</span>
        </div>
      </div>

      <div className={cn("relative", isLocked && "filter blur-3xl pointer-events-none opacity-40")}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(plan || []).map((week, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group flex flex-col justify-between min-h-[300px] relative overflow-hidden"
            >
               <div className="absolute bottom-[-20%] left-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-orange-100/30 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute top-0 right-0 p-8 text-black/5 group-hover:scale-110 transition-transform -mr-12 -mt-12">
                  <Target className="w-64 h-64 rotate-6" />
               </div>

               <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="px-5 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                        WEEK 0{week.week}
                     </div>
                     <TrendingUp className="w-6 h-6 text-emerald-400/80" />
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-amber-500 transition-colors">{week.milestone}</h4>
                     <p className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        Focus: {week.focus}
                     </p>
                  </div>
               </div>

               <div className="relative z-10 pt-8 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-5 h-5 text-emerald-400" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Biological Checkpoint</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-slate-700 font-black text-[10px]">0{week.week}</div>
               </div>
            </motion.div>
          ))}
        </div>
      </div>

      {isLocked && (
        <div className="absolute inset-x-6 inset-y-16 flex items-center justify-center z-20">
           <div className="max-w-sm text-center space-y-6">
              <div className="w-20 h-20 bg-amber-50 border border-amber-100 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm animate-float">
                 <Crown className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-2xl font-black text-slate-900">Strategic Mastery Locked</h4>
                 <p className="text-sm font-medium text-slate-500 italic">Upgrade to Premium to unlock your full 30-day biological transformation roadmap.</p>
              </div>
           </div>
        </div>
      )}
    </section>
  );
}
