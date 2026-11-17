import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Crown, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StickyCTAProps {
  isVisible: boolean;
  activeTier: string;
  onCtaClick: () => void;
}

export default function StickyCTA({ isVisible, activeTier, onCtaClick }: StickyCTAProps) {
  const getCtaContent = () => {
    switch (activeTier) {
      case 'premium':
        return { 
          label: 'Unlock Premium Intelligence', 
          icon: <Crown className="w-5 h-5 text-ayur-amber" />,
          color: 'bg-[#73e1e2] text-black shadow-lg shadow-[#73e1e2]/20'
        };
      case 'pro':
        return { 
          label: 'Unlock Full Analysis', 
          icon: <Zap className="w-5 h-5 text-white" />,
          color: 'bg-ayur-purple text-white shadow-glow-purple'
        };
      default:
        return { 
          label: 'Try Free Analysis', 
          icon: <ArrowRight className="w-5 h-5 text-black" />,
          color: 'bg-white text-black'
        };
    }
  };

  const content = getCtaContent();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ y: 100, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           exit={{ y: 100, opacity: 0 }}
           className="fixed bottom-10 left-6 right-6 z-[100] flex justify-center"
        >
          <motion.button
             whileHover={{ y: -5, scale: 1.02 }}
             whileTap={{ scale: 0.96 }}
             onClick={onCtaClick}
             className={cn(
               "w-full max-w-md py-6 px-10 rounded-[2.5rem] flex items-center justify-between shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] group overflow-hidden border border-white/10",
               content.color
             )}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
                   {content.icon}
                </div>
                <div className="text-left">
                   <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 leading-none mb-1">Take Action</p>
                   <p className="text-sm font-black uppercase tracking-tightest leading-none">{content.label}</p>
                </div>
             </div>

             <div className={cn(
               "w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
               activeTier === 'basic' ? "bg-black text-white" : "bg-white/10"
             )}>
                <ArrowRight className="w-6 h-6" />
             </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
