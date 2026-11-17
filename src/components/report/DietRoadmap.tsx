import React from 'react';
import { motion } from 'motion/react';
import { Utensils, CheckCircle2, XCircle, Clock, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DietRoadmapProps {
  diet: {
    eat: string[];
    avoid: string[];
  };
}

export default function DietRoadmap({ diet }: DietRoadmapProps) {
  return (
    <section className="px-6 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Nutritional Reset</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none">Biological Fuel Roadmap</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Favor: Bio-Optimal */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group relative overflow-hidden"
        >
          <div className="absolute top-[-20%] left-[-20%] w-[50vw] h-[50vw] max-w-md max-h-md bg-emerald-100/40 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 right-0 p-8 text-emerald-500/5 -mr-12 -mt-12 transition-transform">
             <Utensils className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Favor (Sattvic)</span>
              </div>
              <h4 className="text-3xl font-black text-slate-900 leading-tight uppercase">Bio-Optimal Fuel</h4>
            </div>

            <div className="space-y-4">
              {(diet?.eat || []).map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-black/5 hover:bg-slate-50 transition-colors shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xs shadow-inner">{i + 1}</div>
                  <span className="text-lg font-bold text-slate-700">{item}</span>
                </div>
              ))}
              {(!diet?.eat || diet.eat.length === 0) && (
                <p className="text-xs text-slate-400 italic">Analysis ongoing...</p>
              )}
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-sm font-bold text-slate-500 shadow-sm">
              "These foods harmonize your dominant Dosha and boost Agni."
            </div>
          </div>
        </motion.div>

        {/* Avoid: Biological Load */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-md max-h-md bg-rose-100/40 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 right-0 p-8 text-rose-500/5 -mr-12 -mt-12 transition-transform">
             <XCircle className="w-64 h-64" />
          </div>

          <div className="relative z-10 space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full border border-rose-100 shadow-sm">
                <XCircle className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Restrict (Rajas/Tamas)</span>
              </div>
              <h4 className="text-3xl font-black text-slate-900 leading-tight uppercase">Toxic Load Triggers</h4>
            </div>

            <div className="space-y-4">
              {(diet?.avoid || []).map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-black/5 hover:bg-slate-50 transition-colors opacity-80 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-400 font-black text-xs shadow-inner">{i + 1}</div>
                  <span className="text-lg font-bold text-slate-500 line-through decoration-rose-200">{item}</span>
                </div>
              ))}
              {(!diet?.avoid || diet.avoid.length === 0) && (
                <p className="text-xs text-slate-300 italic">Analysis ongoing...</p>
              )}
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-sm font-bold text-slate-500 shadow-sm">
              "Eliminating these triggers reduces systemic inflammation and Ama."
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
