import React from 'react';
import { motion } from 'motion/react';
import { Search, AlertCircle, Sparkles, Brain, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';

interface RootCauseAnalysisProps {
  rootCause: string;
}

export default function RootCauseAnalysis({ rootCause }: RootCauseAnalysisProps) {
  const safeRootCause = rootCause || "Deep mapping of biological rhythms in progress...";
  return (
    <section className="px-6 space-y-8">
      <div className="text-center space-y-2">
        <h3 className="text-4xl font-heading font-black text-[#000000] uppercase tracking-tight">Causality Mapping / निदान सूचकांक</h3>
        <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em] leading-none">Diagnostic Intelligence / नैदानिक विश्लेषण</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left Side: Problem - Grayish/Neutral tone with AlertCircle */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-stone-50 p-10 rounded-[3rem] border border-stone-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-stone-100 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 right-0 p-8 text-stone-300/10 -mr-10 -mt-10 transition-transform">
            <Search className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-14 h-14 rounded-2xl bg-stone-200/50 flex items-center justify-center text-stone-600 shadow-inner border border-stone-300/60">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">The Imbalance / विकार</p>
              <h4 className="text-2xl font-black text-[#000000] leading-none tracking-tight uppercase">दोष असंतुलन (Dosha Imbalance)</h4>
              <p className="text-base font-bold text-stone-700 leading-relaxed italic border-l-4 border-stone-300 pl-6">
                {safeRootCause}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Solution - Primary brand color with Sparkles */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-emerald-50/40 p-10 rounded-[3rem] border border-emerald-100 shadow-[0_8px_30px_rgba(16,185,129,0.02)] group relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute bottom-[-20%] left-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-emerald-100/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
          <div className="absolute top-0 right-0 p-8 text-emerald-600/5 -mr-10 -mt-10 transition-transform">
            <Brain className="w-48 h-48" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="w-14 h-14 rounded-2xl bg-[#A259FF] flex items-center justify-center text-white shadow-inner border border-[#A259FF]/25">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black text-[#A259FF] uppercase tracking-widest leading-none">The Solution / शोधन</p>
              <h4 className="text-2xl font-black text-[#000000] leading-none tracking-tight uppercase">जड़ से इलाज (Root Cause Treatment)</h4>
              <div className="space-y-4">
                {[
                  "Linked symptoms directly to biological dosha rhythms / तासीर सुधार",
                  "Personalized circadian nourishment routines / दोषानुसार दिनचर्या",
                  "Active bio-trigger identification / रोग प्रतिरोधक प्रणाली सक्रियता"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-stone-700 p-3 bg-white/75 backdrop-blur-md rounded-2xl border border-stone-200/50 shadow-sm hover:translate-x-1 transition-transform">
                    <Compass className="w-4 h-4 text-[#A259FF] shrink-0" />
                    <span className="text-xs font-bold leading-normal">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
