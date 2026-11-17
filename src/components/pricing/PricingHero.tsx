import React from 'react';
import { motion } from 'motion/react';
import { Crown, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PricingHeroProps {
  onCtaClick: () => void;
}

export default function PricingHero({ onCtaClick }: PricingHeroProps) {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-20%] w-[80%] h-[120%] bg-ayur-purple/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[120%] bg-ayur-teal/10 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-xl border border-black/5 shadow-premium text-ayur-purple font-black text-[10px] uppercase tracking-[0.3em]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Elite Wellness Ecosystem
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-black leading-[0.95] tracking-tightest uppercase"
        >
          Unlock your <br/>
          <span className="text-ayur-purple">Ayurvedic</span> <br/>
          <span className="relative">
            Intelligence
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute -bottom-2 left-0 h-2 bg-ayur-teal/20 rounded-full" 
            />
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl font-bold text-gray-500 max-w-2xl mx-auto leading-relaxed"
        >
          Ancient Ayurveda + Advanced AI to decode your body, mind, energy, and future wellness patterns. Experience the biological reset.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCtaClick}
          className="bg-gradient-to-br from-ayur-teal to-emerald-800 text-white px-10 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 mx-auto shadow-[0_30px_60px_-10px_rgba(0,191,166,0.3)] group mt-8"
        >
          Start Your Healing Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </section>
  );
}
