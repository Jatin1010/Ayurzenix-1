import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Share2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StandardHeroProps {
  score: number;
  title: string;
  subtitle?: string;
  label: string;
  color?: string;
  accentColor?: string;
  onShare?: () => void;
  variant?: 'circle' | 'gauge';
}

export default function StandardHero({ 
  score = 78, 
  title, 
  subtitle, 
  label, 
  color = 'text-emerald-500',
  accentColor = 'bg-emerald-500/10',
  onShare,
  variant = 'circle'
}: StandardHeroProps) {
  const strokeColor = color.replace('text-', '');
  
  return (
    <section className="relative overflow-hidden min-h-[500px] flex items-center mb-12 rounded-[2.5rem] bg-white border border-black/[0.03] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      {/* Background Cinematic Canvas - Apple Soft Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-[2.5rem]">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-emerald-100/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-100/30 rounded-full blur-[120px]"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(248,255,252,0.8)_100%)] backdrop-blur-3xl" />
      </div>

      <div className="relative z-10 w-full px-8 py-20 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 border border-emerald-100/50 backdrop-blur-md shadow-sm"
        >
          <div className={cn("w-2 h-2 rounded-full animate-pulse shadow-sm", color.replace('text-', 'bg-'))} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{subtitle || 'Bio-Sync Active'}</span>
        </motion.div>

        {/* High-Definition Title */}
        <div className="max-w-3xl space-y-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-black tracking-tight leading-[1.05]"
          >
            {title.split(' ').map((word, i) => (
              <span key={i} className={i % 2 !== 0 ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400' : ''}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm md:text-lg text-slate-500 font-medium tracking-wide max-w-xl mx-auto"
          >
            Decoding your ancient genetic blueprint with precision AI.
          </motion.p>
        </div>

        {/* Score Radial - Central Eye */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-100" />
            <motion.circle 
              cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="8" 
              strokeDasharray="100 0"
              pathLength="100"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: score }}
              transition={{ duration: 2, ease: "circOut", delay: 0.2 }}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter"
            >
              {score}
            </motion.span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{label}</span>
          </div>
          
          {/* Decorative Glow */}
          <div className={cn("absolute inset-0 blur-[60px] opacity-30 -z-10", accentColor)} />
        </div>

        {/* Bottom Metadata */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white border border-emerald-50 flex items-center justify-center shadow-sm">
                <Sparkles className={cn("w-5 h-5", color)} />
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left leading-tight">
               Verified by<br/><span className="text-slate-700">Ayurzenix AI v3.0</span>
             </p>
          </div>
          {onShare && (
            <button 
              onClick={onShare}
              className="group flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-black/10"
            >
              <Share2 className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
              <span>Share Report</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
