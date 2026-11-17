import React from 'react';
import { motion } from 'motion/react';
import { Flame, Droplets, Wind, Mountain } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AgniAnalysisProps {
  agni: string;
}

export default function AgniAnalysis({ agni }: AgniAnalysisProps) {
  // Safe string handling
  const safeAgni = agni || "Analysis pending...";
  
  // Try to determine agni type from text if possible, otherwise default to "Balanced"
  const getAgniType = () => {
    const text = safeAgni.toLowerCase();
    if (text.includes('vishama')) return { name: 'Vishama Agni', type: 'Irregular', icon: <Wind />, color: 'bg-ayur-blue', text: 'Vata dominance in digestion causing bloating and gas.' };
    if (text.includes('tikshna')) return { name: 'Tikshna Agni', type: 'Intense', icon: <Flame />, color: 'bg-ayur-coral', text: 'Pitta dominance causing hyperacidity and quick hunger.' };
    if (text.includes('manda')) return { name: 'Manda Agni', type: 'Slow', icon: <Droplets />, color: 'bg-ayur-teal', text: 'Kapha dominance causing heaviness and slow metabolism.' };
    return { name: 'Sama Agni', type: 'Balanced', icon: <Flame />, color: 'bg-ayur-amber', text: 'The ideal state of balanced metabolic fire.' };
  };

  const agniData = getAgniType();

  return (
    <section className="px-6 space-y-6">
      <div className="flex items-center gap-3 px-2">
        <Flame className="w-5 h-5 text-orange-400" />
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Metabolic Fire (Agni)</h3>
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-sm max-h-sm bg-orange-100/50 rounded-full blur-[100px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-8 lg:space-y-12">
            <div className="flex items-center gap-6">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], filter: ["blur(0px)", "blur(2px)", "blur(0px)"] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-20 h-20 rounded-[2rem] flex items-center justify-center bg-gradient-to-br from-orange-400 to-rose-400 text-white shadow-[0_10px_25px_rgba(251,146,60,0.3)]"
              >
                {React.cloneElement(agniData.icon as React.ReactElement, { className: 'w-10 h-10' } as any)}
              </motion.div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Diagnostic: {agniData.type}</p>
                <h4 className="text-3xl font-black text-black leading-tight uppercase">{agniData.name}</h4>
              </div>
            </div>
            <p className="text-lg font-medium text-slate-600 leading-relaxed italic border-l-4 border-orange-200 pl-6">
              "{safeAgni}"
            </p>
          </div>

          <div className="bg-slate-50/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 space-y-8 shadow-sm">
            <div className="space-y-6">
              <h5 className="text-xs font-black text-black uppercase tracking-widest">Digestive Bio-Analytics</h5>
              <div className="space-y-5">
                {[
                  { label: "Absorption Rate", value: 85, color: "bg-emerald-400" },
                  { label: "Toxin (Ama) Level", value: 15, color: "bg-rose-400" },
                  { label: "Ojas Production", value: 72, color: "bg-amber-400" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</span>
                      <span className="text-[10px] font-black">{stat.value}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        className={cn("h-full rounded-full shadow-sm", stat.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
