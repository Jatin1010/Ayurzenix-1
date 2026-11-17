import React from 'react';
import { motion } from 'motion/react';
import { Activity, Zap, Moon, Heart, Flame, ShieldCheck, Award, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WellnessDashboardProps {
  score: {
    score: number;
    vata: number;
    pitta: number;
    kapha: number;
  };
  planId?: string;
}

export default function WellnessDashboard({ score, planId = 'basic' }: WellnessDashboardProps) {
  const isBasic = planId === 'basic';
  
  // Safeguard against missing score data
  const safeScore = {
    score: score?.score ?? 70,
    vata: score?.vata ?? 33,
    pitta: score?.pitta ?? 33,
    kapha: score?.kapha ?? 33
  };

  // 1. Apple Fitness Style rings
  // Ring values
  const ring1 = safeScore.score;  // Wellness Score
  const ring2 = safeScore.vata;   // Vata
  const ring3 = safeScore.pitta;  // Pitta
  const ring4 = safeScore.kapha;  // Kapha

  const indicators = [
    { label: 'ऊर्जा प्रवाह (Energy Flow)', value: safeScore.score + 5 > 100 ? 98 : safeScore.score + 5, icon: <Zap className="w-4 h-4 text-emerald-500" />, color: 'from-[#10B981] to-[#059669]', stroke: '#10B981' },
    { label: 'तनाव प्रतिरोध (Stress Defense)', value: Math.max(10, Math.round(100 - (safeScore.vata * 0.8))), icon: <Activity className="w-4 h-4 text-cyan-500" />, color: 'from-[#06B6D4] to-[#0891B2]', stroke: '#06B6D4' },
    { label: 'पाचन क्षमता (Gut Agni)', value: Math.max(10, Math.round(100 - (safeScore.pitta * 0.7))), icon: <Flame className="w-4 h-4 text-orange-500" />, color: 'from-[#F97316] to-[#EA580C]', stroke: '#F97316' },
    { label: 'गहरी नींद सूचकांक (Sleep Quality)', value: Math.max(10, Math.round(100 - (safeScore.kapha * 0.6))), icon: <Moon className="w-4 h-4 text-indigo-500" />, color: 'from-[#6366F1] to-[#4F46E5]', stroke: '#6366F1' },
  ];

  return (
    <section className="space-y-8 px-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Biometric Matrix / जैविक मैट्रिक्स</h3>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border-2 border-white shadow-md" />
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Real-time Biosync / सजीव सेंसर</span>
        </div>
      </div>

      <div className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_24px_50px_rgba(0,0,0,0.04)] border border-stone-200/50 relative overflow-hidden group">
        {/* Glow ambient backdrops */}
        <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-md max-h-md bg-emerald-50 rounded-full blur-[120px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[35vw] h-[35vw] max-w-sm max-h-sm bg-cyan-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          
          {/* Main Concentric Rings Container (Left Side) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-10 lg:border-r lg:border-stone-100 lg:pr-12">
            <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
              
              {/* Dynamic Concentric Rings SVG */}
              <svg className="w-full h-full transform" viewBox="0 0 300 300">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="grad-score" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="grad-vata" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                  <linearGradient id="grad-pitta" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EA580C" />
                  </linearGradient>
                  <linearGradient id="grad-kapha" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                  
                  {/* Shadow Filter for 3D depth */}
                  <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.15"/>
                  </filter>
                </defs>

                {/* Base tracks */}
                <circle cx="150" cy="150" r="115" stroke="#F1F5F9" strokeWidth="15" fill="none" />
                <circle cx="150" cy="150" r="92" stroke="#F1F5F9" strokeWidth="15" fill="none" />
                <circle cx="150" cy="150" r="69" stroke="#F1F5F9" strokeWidth="15" fill="none" />
                <circle cx="150" cy="150" r="46" stroke="#F1F5F9" strokeWidth="15" fill="none" />

                {/* Active concentric rings rotated to start from top */}
                <g transform="rotate(-90 150 150)">
                  {/* Outer: Wellness Score (Circumference = 2 * PI * 115 = 722.5) */}
                  <motion.circle
                    cx="150" cy="150" r="115"
                    stroke="url(#grad-score)" strokeWidth="15" fill="none"
                    strokeDasharray="722.5"
                    initial={{ strokeDashoffset: 722.5 }}
                    animate={{ strokeDashoffset: 722.5 - (722.5 * ring1) / 100 }}
                    transition={{ duration: 1.8, ease: "easeOut" }}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                  {/* Second: Vata (Circumference = 2 * PI * 92 = 578) */}
                  <motion.circle
                    cx="150" cy="150" r="92"
                    stroke="url(#grad-vata)" strokeWidth="15" fill="none"
                    strokeDasharray="578"
                    initial={{ strokeDashoffset: 578 }}
                    animate={{ strokeDashoffset: 578 - (578 * ring2) / 100 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.1 }}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                  {/* Third: Pitta (Circumference = 2 * PI * 69 = 433.5) */}
                  <motion.circle
                    cx="150" cy="150" r="69"
                    stroke="url(#grad-pitta)" strokeWidth="15" fill="none"
                    strokeDasharray="433.5"
                    initial={{ strokeDashoffset: 433.5 }}
                    animate={{ strokeDashoffset: 433.5 - (433.5 * ring3) / 100 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                  {/* Inner: Kapha (Circumference = 2 * PI * 46 = 289) */}
                  <motion.circle
                    cx="150" cy="150" r="46"
                    stroke="url(#grad-kapha)" strokeWidth="15" fill="none"
                    strokeDasharray="289"
                    initial={{ strokeDashoffset: 289 }}
                    animate={{ strokeDashoffset: 289 - (289 * ring4) / 100 }}
                    transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
                    strokeLinecap="round"
                    filter="url(#shadow)"
                  />
                </g>
              </svg>

              {/* Core Index Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-[#000000] font-black tracking-tighter leading-none"
                >
                  {safeScore.score}
                </motion.span>
                <div className="flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[9px] font-black uppercase text-stone-700 tracking-[0.2em] leading-none">ऊर्जा लेवल (Index)</span>
                </div>
              </div>

            </div>

            {/* Prakriti Badges */}
            <div className="space-y-4 w-full">
              <div className="text-center">
                <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest bg-stone-100 px-4 py-1.5 rounded-full">
                  शरीर की तासीर (Prakriti Profile)
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { name: 'वात (Vata)', val: safeScore.vata, color: 'text-cyan-600 bg-cyan-50/70 border-cyan-100', dot: 'bg-cyan-500' },
                  { name: 'पित्त (Pitta)', val: safeScore.pitta, color: 'text-orange-600 bg-orange-50/70 border-orange-100', dot: 'bg-orange-500' },
                  { name: 'कफ (Kapha)', val: safeScore.kapha, color: 'text-indigo-600 bg-indigo-50/70 border-indigo-100', dot: 'bg-indigo-500' }
                ].map((d) => (
                  <div key={d.name} className={cn("flex flex-col items-center gap-1 py-4 border rounded-[2rem] shadow-sm relative overflow-hidden group hover:scale-[1.03] transition-all", d.color)}>
                    <div className="flex items-center gap-1">
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", d.dot)} />
                      <span className="text-[10px] font-black uppercase tracking-tight">{d.name}</span>
                    </div>
                    <span className="text-2xl font-black text-[#000000] tracking-tight leading-none mt-1">{d.val}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Clinical Bio-Sync Matressed Checklist (Right Side) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h4 className="text-2xl font-black text-[#000000] uppercase tracking-tight leading-none">
                त्रिदोष संतुलन (Tridosha Sync)
              </h4>
              <p className="text-xs font-bold text-stone-500 leading-relaxed">
                Biomedical algorithms analyzing systemic stress cycles, digestive flow, and sleep homeostasis.
              </p>
            </div>

            <div className="space-y-4">
              {indicators.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-5 rounded-[2rem] bg-stone-50 border border-stone-200/50 flex items-center justify-between shadow-sm hover:shadow-md transition-all gap-4 group/item"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-stone-100 shadow-sm group-hover/item:scale-105 transition-transform shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h5 className="text-[11px] font-black uppercase tracking-widest text-stone-500 leading-none mb-1.5">
                        {item.label}
                      </h5>
                      <span className="text-[10px] font-bold text-stone-600">सक्रिय जैव-सूचकांक (Bio-index value)</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-2xl font-black text-[#000000] leading-none tracking-tight">
                      {item.value} <span className="text-xs text-stone-400">/100</span>
                    </span>
                    <div className="w-20 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-stone-900 rounded-full" style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

