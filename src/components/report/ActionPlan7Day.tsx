import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Target, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DayPlan {
  day: number;
  tasks: string[];
}

interface ActionPlan7DayProps {
  plan: DayPlan[];
}

export default function ActionPlan7Day({ plan }: ActionPlan7DayProps) {
  return (
    <section 
      style={{ backgroundColor: '#006BDF' }}
      className="rounded-[3.5rem] p-12 text-white space-y-16 relative overflow-hidden shadow-2xl mx-6"
    >
      <div className="absolute top-0 right-0 p-12 opacity-5 text-white -mr-16 -mt-16 group-hover:scale-110 transition-transform">
         <Calendar className="w-80 h-80 rotate-12" />
      </div>

      <div className="text-center space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20">
          <Zap className="w-4 h-4 text-ayur-amber" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Phase 01: Stabilization</span>
        </div>
        <h3 className="text-5xl font-[1000] uppercase tracking-tight">The 7-Day Healing Protocol</h3>
        <p className="text-sm font-medium text-white/60 max-w-sm mx-auto leading-relaxed">Your immediate action plan for systemic biological reset.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 relative z-10">
        {(plan || []).map((dayPlan, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col bg-white/10 border border-white/5 rounded-[2.5rem] p-8 group hover:bg-white/20 transition-all hover:translate-y-[-8px]"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="text-2xl font-[1000] text-white italic tracking-tighter">0{dayPlan.day}</div>
               <Target className="w-4 h-4 opacity-30 text-ayur-amber" />
            </div>
            
            <div className="flex-1 space-y-4">
               {(dayPlan.tasks || []).map((task, idx) => (
                 <div key={idx} className="flex gap-4 group/task">
                    <div className="w-5 h-5 rounded-lg border-2 border-white/20 flex items-center justify-center shrink-0 group-hover/task:border-ayur-amber transition-colors">
                       <CheckCircle2 className="w-3 h-3 text-ayur-amber opacity-0 group-hover/task:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-xs font-bold text-white/80 leading-snug group-hover/task:text-white transition-colors">{task}</span>
                 </div>
               ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
               <span className="text-[8px] font-black uppercase tracking-widest leading-none">Milestone</span>
               <div className="w-2 h-2 rounded-full bg-ayur-amber" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
