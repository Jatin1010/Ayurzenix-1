import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = ({ onStart, onExplore }: { onStart: () => void, onExplore: () => void }) => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-emerald-50/50 via-white to-sky-50/30">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 flex flex-col items-center"
        >
          <div className="mx-auto flex w-fit items-center gap-2 pl-[17px] pr-4 py-2 bg-white rounded-full border border-emerald-100 shadow-sm text-center mb-[15px]">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">India's First AI Ayurveda Engine</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-black tracking-tight leading-tight text-center no-underline">
            Your Body Is Unique.<br />
            <span className="neon-flash-text">Your Ayurveda Should Be Too.</span>
          </h1>
          <p className="text-lg text-gray-600 font-bold leading-relaxed text-center">
            Meet India’s First Adaptive AI Ayurveda Intelligence Engine. Personalized Dosha analysis, organ intelligence, wellness prediction, and lifestyle guidance powered by advanced AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
                onClick={onStart}
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              Start Free Analysis <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={onExplore} className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black uppercase tracking-widest text-sm border border-gray-200 hover:border-emerald-200 transition-all">
              Explore Intelligence
            </button>
          </div>
        </motion.div>

        {/* Right Side - UI Visualization */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[500px]"
        >
        </motion.div>
      </div>
    </section>
  );
};
