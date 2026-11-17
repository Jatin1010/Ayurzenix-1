import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon, Clock, CheckCircle2, Zap, Hourglass, Sunrise, Sunset } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DinacharyaRoutineProps {
  routine: {
    morning: string[];
    night: string[];
  };
}

export default function DinacharyaRoutine({ routine }: DinacharyaRoutineProps) {
  const [activeCycle, setActiveCycle] = useState<'morning' | 'night'>('morning');

  const morningRituals = routine?.morning || [];
  const nightRituals = routine?.night || [];

  return (
    <section className="px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between px-2 gap-4 max-w-5xl mx-auto">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full border border-stone-200">
            <Hourglass className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="text-[9px] font-black uppercase text-stone-600 tracking-widest">Circadian Calibrator</span>
          </div>
          <h3 className="text-4xl font-heading font-black text-[#000000] uppercase tracking-tight">जीवित दिनचर्या (Dinacharya Rituals)</h3>
          <p className="text-xs font-bold text-stone-500 leading-none">AI-synchronized biological clocks aligned to solar & lunar transitions.</p>
        </div>

        {/* Tab Selector */}
        <div className="inline-flex p-1.5 bg-stone-100 rounded-full border border-stone-200 shadow-inner shrink-0">
          <button
            onClick={() => setActiveCycle('morning')}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
              activeCycle === 'morning' ? "bg-[#000000] text-white shadow-md scale-102" : "text-stone-600 hover:text-black"
            )}
          >
            <Sunrise className="w-4 h-4 text-amber-400" />
            प्रातःकाल (Morning Flow)
          </button>
          <button
            onClick={() => setActiveCycle('night')}
            className={cn(
              "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2",
              activeCycle === 'night' ? "bg-[#000000] text-white shadow-md scale-102" : "text-stone-600 hover:text-black"
            )}
          >
            <Sunset className="w-4 h-4 text-indigo-400" />
            रात्रिचर्या (Night Flow)
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {activeCycle === 'morning' ? (
            <motion.div
              key="morning"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-[0_24px_50px_rgba(0,0,0,0.03)] border border-stone-200/50 group relative overflow-hidden"
            >
              {/* Sun Ambient glow */}
              <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-amber-50 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-0 right-0 p-12 text-amber-500/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Sun className="w-80 h-80" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-[#000000] uppercase tracking-tight">प्रातःकाल (Sunrise Cleansing Activation)</h4>
                    <p className="text-xs font-bold text-stone-500 mt-1">Recommended timeframe: 06:00 AM - 10:00 AM | Earthly activation protocol</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-100/50 rounded-2xl text-amber-700 font-bold text-xs select-none shadow-sm">
                    <Sun className="w-4 h-4 text-amber-500 animate-pulse" />
                    Ojas Booster / प्राण वृद्धि
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {morningRituals.map((ritual, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-6 bg-stone-50 hover:bg-stone-100/80 rounded-[2rem] border border-stone-200/60 flex items-start gap-5 group/item transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-100/60 flex items-center justify-center text-amber-700 font-black text-sm border border-amber-200/60 shadow-inner shrink-0 group-hover/item:rotate-3 transition-transform">
                        0{i + 1}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <p className="text-base font-black text-stone-900 leading-tight">{ritual.split(':')[0]}</p>
                        {ritual.includes(':') && (
                          <p className="text-[11px] font-bold text-stone-600 leading-relaxed italic border-l-2 border-amber-300 pl-3">
                            {ritual.split(':')[1]}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {morningRituals.length === 0 && (
                    <p className="text-sm text-stone-400 italic">Curating custom sunrise rituals for your body type...</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="night"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="bg-stone-950 p-10 md:p-14 rounded-[3.5rem] shadow-[0_24px_50px_rgba(0,0,0,0.15)] border border-stone-800/80 group relative overflow-hidden text-stone-100"
            >
              {/* Moon Ambient glow */}
              <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute top-0 right-0 p-12 text-indigo-500/5 -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <Moon className="w-80 h-80" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-6">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">रात्रिचर्या (Lunar Restorative Reset)</h4>
                    <p className="text-xs font-bold text-stone-400 mt-1">Recommended timeframe: 09:30 PM - 06:00 AM | Cellular repair protocol</p>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-950 border border-indigo-900/50 rounded-2xl text-indigo-300 font-bold text-xs select-none shadow-md">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    Soma Rest / सोमरस चक्र
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nightRituals.map((ritual, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-6 bg-stone-900 hover:bg-stone-800/80 rounded-[2rem] border border-stone-800 flex items-start gap-5 group/item transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-indigo-950 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-900/60 shadow-inner shrink-0 group-hover/item:-rotate-3 transition-transform">
                        0{i + 1}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        <p className="text-base font-black text-white leading-tight">{ritual.split(':')[0]}</p>
                        {ritual.includes(':') && (
                          <p className="text-[11px] font-bold text-stone-400 leading-relaxed italic border-l-2 border-indigo-800 pl-3">
                            {ritual.split(':')[1]}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {nightRituals.length === 0 && (
                    <p className="text-sm text-stone-500 italic">Formulating deep nocturnal sleep resets for your bio-profile...</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
