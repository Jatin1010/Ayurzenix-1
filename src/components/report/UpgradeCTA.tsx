import React from 'react';
import { motion } from 'motion/react';
import { Crown, ArrowRight, Zap, Target, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Plan } from '../../lib/pricing';

interface UpgradeCTAProps {
  onUpgrade: (plan: any) => void;
  targetTier: 'pro' | 'premium';
}

export default function UpgradeCTA({ onUpgrade, targetTier }: UpgradeCTAProps) {
  const isPremium = targetTier === 'premium';
  
  return (
     <section className="px-6 py-12">
          <motion.div 
          whileHover={{ scale: 1.01 }}
          className={cn(
            "rounded-[3.5rem] p-12 text-center space-y-10 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03]",
            isPremium ? "bg-white" : "bg-white"
          )}
        >
          {/* Animated background effects */}
          <div className={cn("absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg rounded-full blur-[100px] pointer-events-none transition-all duration-1000", isPremium ? "bg-amber-100/40" : "bg-[#A259FF]/10")} />
          <div className={cn("absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-sm max-h-sm rounded-full blur-[80px] pointer-events-none", isPremium ? "bg-orange-50/50" : "bg-[#A259FF]/5")} />

          <div className={cn("absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-all duration-[2000ms]", isPremium ? "text-amber-500" : "text-[#A259FF]")}>
             <Crown className="w-80 h-80 rotate-12" />
          </div>

          <div className="space-y-6 relative z-10">
            <div className={cn(
               "w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner border transition-transform group-hover:scale-110",
               isPremium ? "bg-amber-50 text-amber-500 border-amber-100/50" : "bg-[#A259FF]/5 text-[#A259FF] border-[#A259FF]/20"
            )}>
               {isPremium ? <Crown className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
            </div>
            <div className="space-y-3">
               <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                  Unlock The Full <span className={cn(isPremium ? "text-amber-500" : "text-[#A259FF]")}>{isPremium ? 'Transformation' : 'Intelligence'}</span>
               </h3>
               <p className="text-base font-bold text-slate-500 italic max-w-sm mx-auto leading-relaxed">
                  {isPremium 
                    ? "Get your 30-day biological roadmap, future risk predictions, and premium offline PDF vault."
                    : "Access full diet synthesis, 7-day protocols, and advanced somatic alignment routines."}
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
             {[
               { label: isPremium ? '30-Day Evolution' : 'Bio-Protocol', icon: <Target className="w-4 h-4" /> },
               { label: isPremium ? 'Future Forecasting' : 'Deep Herbology', icon: <Sparkles className="w-4 h-4" /> }
             ].map((benefit, i) => (
                <div key={i} className={cn(
                   "flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-sm shadow-sm",
                   isPremium ? "bg-amber-50 border-amber-100/50" : "bg-[#A259FF]/5 border-[#A259FF]/10"
                )}>
                   <div className={cn(isPremium ? "text-amber-500" : "text-[#A259FF]")}>{benefit.icon}</div>
                   <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{benefit.label}</span>
                </div>
             ))}
          </div>

          <button 
            onClick={() => onUpgrade({ id: targetTier, price: isPremium ? 99 : 49, title: isPremium ? 'Premium Intelligence' : 'Pro Intelligence' })}
            className={cn(
               "w-full py-6 rounded-[2.5rem] font-[1000] text-sm uppercase tracking-[0.4em] shadow-xl hover:scale-[1.02] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-4 relative z-10 text-white",
               isPremium ? "bg-slate-900 hover:bg-slate-800" : "bg-[#A259FF] hover:bg-[#A259FF]/90"
            )}
          >
            Go {targetTier} <ArrowRight className={cn("w-6 h-6", isPremium ? "text-amber-400" : "text-white")} />
          </button>

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] relative z-10">
             Trusted by 50,000+ Vedic Wellness Enthusiasts
          </p>
        </motion.div>
     </section>
  );
}
