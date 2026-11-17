import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Activity, ShieldAlert, Timer, ChevronRight, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Therapy {
  name: string;
  description: string;
  benefits: string;
  doshaImpact: string;
  recoveryImpact: string;
  frequency: string;
}

interface TherapySectionProps {
  therapies: Therapy[];
}

export default function TherapySection({ therapies }: TherapySectionProps) {
  if (!therapies || therapies.length === 0) return null;

  return (
    <section className="px-6 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Clinical Protocols</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Deep Ayurvedic Therapies</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100/50 rounded-2xl text-rose-500 shadow-sm">
          <ShieldAlert className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Expert Guidance Required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {(therapies || []).map((therapy, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group flex flex-col justify-between min-h-[420px] relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-teal-50/50 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-teal-100/40 transition-all duration-1000" />
            <div className="absolute top-0 right-0 p-8 text-teal-500/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform">
               <Activity className="w-64 h-64" />
            </div>

            <div className="relative z-10 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-500 shadow-inner group-hover:bg-teal-500 group-hover:text-white transition-all border border-teal-100">
                     <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                     <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Target Depth</p>
                     <p className="text-xs font-black text-teal-500">CELLULAR</p>
                  </div>
               </div>

               <div className="space-y-3">
                  <h4 className="text-3xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none group-hover:text-teal-600 transition-colors">{therapy.name}</h4>
                  <div className="flex gap-3">
                     <span className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-100 shadow-sm">{therapy.doshaImpact}</span>
                  </div>
               </div>

               <p className="text-base text-slate-600 font-medium leading-relaxed italic border-l-3 border-teal-100 pl-6">
                 "{therapy.description}"
               </p>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm transition-colors group-hover:bg-white">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Recovery</p>
                     <p className="text-xs font-bold text-slate-700 leading-tight uppercase">{therapy.recoveryImpact}</p>
                  </div>
                  <div className="p-4 bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm transition-colors group-hover:bg-white">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> Frequency</p>
                     <p className="text-xs font-bold text-slate-700 leading-tight">{therapy.frequency}</p>
                  </div>
               </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 flex items-center justify-between group-hover:scale-[1.02] transition-transform">
               <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100 shadow-sm">
                     <ShieldAlert className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Certified</span>
               </div>
               <div className="text-[9px] font-black text-teal-600 uppercase tracking-widest flex items-center gap-1">
                  View Detail <ChevronRight className="w-3 h-3" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
