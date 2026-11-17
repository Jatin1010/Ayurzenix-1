import React from 'react';
import { motion } from 'motion/react';
import { Target, Wind, CheckCircle2, Waves } from 'lucide-react';
import { cn } from '../../lib/utils';

interface YogaPranayamaProps {
  data: {
    yoga: string[];
    breathing: string[];
  };
}

export default function YogaPranayama({ data }: YogaPranayamaProps) {
  return (
    <section className="px-6 space-y-8 relative">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Somatic Alignment</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Yoga & Breathwork</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Yoga Section */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10 group relative overflow-hidden">
          <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-teal-50/50 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-teal-100/40 transition-all duration-1000 pointer-events-none" />

          <div className="absolute top-0 right-0 p-8 text-teal-500/5 -mr-12 -mt-12 group-hover:scale-110 transition-transform">
             <Target className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 space-y-10 flex flex-col h-full">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center text-teal-500 shadow-inner">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Asana Protocol</h4>
            </div>

            <div className="space-y-4 flex-1">
              {(data?.yoga || []).map((pose, i) => (
                <div key={i} className="p-6 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 flex items-center gap-6 group/item hover:bg-white transition-all shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-700 group-hover/item:text-teal-600 transition-colors">0{i + 1}</div>
                  <span className="text-lg font-bold text-slate-700">{pose}</span>
                </div>
              ))}
              {(!data?.yoga || data.yoga.length === 0) && (
                <p className="text-xs text-slate-400 italic">Calibrating somatic flow...</p>
              )}
            </div>

            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-100 mt-auto">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              Focus on depth and precision
            </div>
          </div>
        </div>

        {/* Pranayama Section */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-10 group relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-[#A259FF]/10 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-[#A259FF]/20 transition-all duration-1000 pointer-events-none" />

          <div className="absolute top-0 right-0 p-8 text-[#A259FF]/5 -mr-12 -mt-12 group-hover:scale-110 transition-transform">
             <Waves className="w-64 h-64" />
          </div>

          <div className="relative z-10 space-y-10 flex flex-col h-full">
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-2xl bg-[#A259FF]/5 border border-[#A259FF]/20 flex items-center justify-center text-[#A259FF] shadow-inner">
                <Wind className="w-5 h-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Vedic Breathwork</h4>
            </div>

            <div className="space-y-4 flex-1">
              {(data?.breathing || []).map((technique, i) => (
                <div key={i} className="p-6 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] border border-slate-100 flex items-center gap-6 group/item hover:bg-white transition-all shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-[10px] font-black text-slate-700 group-hover/item:text-[#A259FF] transition-colors">0{i + 1}</div>
                  <span className="text-lg font-bold text-slate-700">{technique}</span>
                </div>
              ))}
              {(!data?.breathing || data.breathing.length === 0) && (
                <p className="text-xs text-slate-400 italic">Calibrating Prana rhythms...</p>
              )}
            </div>

            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-6 border-t border-slate-100 mt-auto">
              <CheckCircle2 className="w-4 h-4 text-[#A259FF]" />
              Restore neural balance through Prana
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
