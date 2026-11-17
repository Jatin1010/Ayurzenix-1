import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, CheckCircle2, Circle, Target, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProgressTrackerProps {
  progress: string;
  isLocked: boolean;
}

export default function ProgressTracker({ progress, isLocked }: ProgressTrackerProps) {
  const safeProgress = progress || "Estimating your unique path to systemic balance...";
  
  return (
    <section className="px-6 space-y-8 relative overflow-hidden">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Recovery Timeline</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Healing Progress Tracking</p>
        </div>
      </div>

      <div className={cn("relative", isLocked && "filter blur-3xl pointer-events-none opacity-40")}>
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-12 relative overflow-hidden group">
           <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-teal-50/50 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-teal-100/40 transition-all duration-1000 pointer-events-none" />

           <div className="flex items-start gap-8 relative z-10">
              <div className="w-16 h-16 rounded-[2.5rem] bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-500 shrink-0 shadow-inner">
                 <TrendingUp className="w-8 h-8" />
              </div>
              <div className="flex-1 space-y-4">
                 <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Vedic Progress Synthesis</h4>
                 <p className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 border-teal-100 pl-6">
                   "{safeProgress}"
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                { week: 1, label: 'Bio-Stabilization', status: 'complete', color: 'text-teal-600', iconColor: 'text-teal-500' },
                { week: 2, label: 'Systemic Detox', status: 'current', color: 'text-amber-500', iconColor: 'text-amber-400' },
                { week: 3, label: 'Deep Tissue Healing', status: 'pending', color: 'text-slate-400', iconColor: 'border-slate-200' },
                { week: 4, label: 'Optimal Resonance', status: 'pending', color: 'text-slate-400', iconColor: 'border-slate-200' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50/50 backdrop-blur-sm rounded-[2rem] p-6 border border-slate-100 shadow-sm group-hover/card:border-teal-200/50 transition-all hover:bg-white hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Week 0{item.week}</span>
                     {item.status === 'complete' ? <CheckCircle2 className={cn("w-5 h-5", item.iconColor)} /> : item.status === 'current' ? <Activity className={cn("w-5 h-5 animate-pulse", item.iconColor)} /> : <div className={cn("w-5 h-5 rounded-full border-2", item.iconColor)} />}
                  </div>
                  <p className={cn("text-sm font-[1000] uppercase tracking-tight", item.color)}>{item.label}</p>
                </div>
              ))}
           </div>
        </div>
      </div>

       {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center space-y-6 bg-white/60 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-sm">
            <div className="w-16 h-16 bg-amber-50 border border-amber-100/50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm animate-float">
                <Target className="w-8 h-8" />
            </div>
            <div className="space-y-2">
                <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Tracker Locked</p>
                <p className="text-[11px] font-bold text-slate-500 italic max-w-[200px] mx-auto">Upgrade to Pro to track your biological healing milestones.</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
