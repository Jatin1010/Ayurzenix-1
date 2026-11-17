import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Info, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Herb {
  name: string;
  why: string;
  usage: string;
}

interface HerbsSectionProps {
  herbs: Herb[];
}

export default function HerbsSection({ herbs }: HerbsSectionProps) {
  return (
    <section className="px-6 space-y-8">
      <div className="flex items-end justify-between px-2">
        <div>
          <h3 className="text-4xl font-heading font-black text-slate-900 uppercase tracking-tight">Ayurvedic Materia</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] leading-none mt-2">Dravya Guna Protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {(herbs || []).map((herb, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-6 group hover:-translate-y-2 transition-all relative overflow-hidden"
          >
            <div className="absolute top-[-20%] right-[-20%] w-[30vw] h-[30vw] max-w-xs max-h-xs bg-emerald-50/50 rounded-full blur-[80px] group-hover:bg-emerald-100/40 transition-colors duration-1000" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100/50 shadow-inner flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <Leaf className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocol</p>
                  <p className="text-xs font-black text-emerald-500">STRATEGIC</p>
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none group-hover:text-emerald-600 transition-colors">{herb.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Molecular Target: {herb.name.length > 5 ? 'Systemic' : 'Cellular'}</p>
              </div>

              <div className="space-y-4 mt-6">
                <div className="p-5 bg-slate-50/50 backdrop-blur-sm rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    <Zap className="w-3 h-3" /> Biological Logic
                  </div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{herb.why}</p>
                </div>

                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-black/5 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-emerald-500 shrink-0 border border-slate-100 shadow-inner">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Dosage Protocol</p>
                     <p className="text-xs font-bold text-slate-700 leading-tight">{herb.usage}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
