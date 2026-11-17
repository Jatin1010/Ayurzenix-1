import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles, Zap, ShieldCheck, Crown, ChevronRight, Star, ArrowRight, Wallet, Clock, Activity, Target, Shield } from 'lucide-react';
import { FeaturePricing, Plan } from '../lib/pricing';
import { cn } from '../lib/utils';

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricing: FeaturePricing;
  onSelect: (plan: Plan) => void;
}

export default function PlanSelectionModal({ isOpen, onClose, pricing, onSelect }: PlanSelectionModalProps) {
  const [billingCycle, setBillingCycle] = useState<'one-time' | 'monthly'>('one-time');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[3000] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/80 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-xl bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden flex flex-col max-h-[92vh] shadow-[0_32px_64px_rgba(0,0,0,0.4)] border border-white/20"
          >
            {/* Design DNA: Hero Section */}
            <div className="relative h-48 sm:h-56 shrink-0 overflow-hidden">
               <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0a?q=80&w=2000&auto=format&fit=crop" 
                  alt="Ayurveda Premium" 
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-stone-950/20 via-stone-950/60 to-white" />
               
               <div className="absolute inset-0 flex flex-col justify-end p-8 space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ayur-neon text-black text-[9px] font-black uppercase tracking-widest w-fit shadow-lg">
                    <Star className="w-3.5 h-3.5 fill-black" /> Premium Wellness
                  </div>
                  <h2 className="text-3xl font-black text-black tracking-tight leading-none">Choose Your Plan</h2>
                  <p className="text-gray-800 text-xs font-bold uppercase tracking-widest opacity-80">60-Second AI Health Intelligence Ready</p>
               </div>

               <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-black/40 transition-all z-20"
               >
                <X className="w-5 h-5" />
               </button>
            </div>

            {/* Billing Toggle - Premium Style */}
            <div className="px-8 pt-4 pb-2">
                <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1">
                    <button 
                        onClick={() => setBillingCycle('one-time')}
                        className={cn(
                            "flex-1 py-3 justify-center items-center rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            billingCycle === 'one-time' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        One-Time Report
                    </button>
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={cn(
                            "flex-1 py-3 flex justify-center items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative",
                            billingCycle === 'monthly' ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        Monthly Membership
                        {billingCycle !== 'monthly' && (
                            <span className="bg-black text-[#ffffff] text-[7px] px-1.5 py-0.5 rounded-full">Save 50%</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Scrollable Plans List */}
            <div className="px-6 py-6 overflow-y-auto space-y-6 flex-1 scrollbar-hide">
              {pricing?.plans?.map((plan) => {
                const isPro = plan.id === 'pro';
                const isPremium = plan.id === 'premium';
                const isBasic = plan.id === 'basic';
                
                // Adjust price for monthly if needed (mocking monthly as roughly 5x report price for unlimited)
                const priceValue = billingCycle === 'monthly' ? (plan.price > 0 ? Math.floor(plan.price * 4.5) : 0) : plan.price;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      "relative w-full rounded-3xl border-2 transition-all text-left flex flex-col group overflow-hidden",
                      isPro 
                        ? "border-ayur-neon bg-white shadow-[0_20px_40px_rgba(57,255,20,0.1)]" 
                        : isPremium 
                          ? "border-amber-400 bg-stone-950 text-white"
                          : "border-gray-100 bg-white"
                    )}
                  >
                    {plan.badge && (
                      <div className="absolute top-0 right-0 bg-ayur-neon text-black text-[9px] font-black px-4 py-1.5 rounded-bl-3xl shadow-lg z-10">
                        {plan.badge}
                      </div>
                    )}

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    {isPremium && <Crown className="w-5 h-5 text-amber-400" />}
                                    {isPro && <Zap className="w-5 h-5 text-ayur-neon" />}
                                    {isBasic && <Check className="w-5 h-5 text-gray-400" />}
                                    <h3 className={cn(
                                        "text-xl font-black tracking-tight uppercase",
                                        isPremium ? "text-amber-400" : isPro ? "text-black" : "text-gray-900"
                                    )}>
                                        {plan.name}
                                    </h3>
                                </div>
                                <p className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                    isPremium ? "text-gray-400" : "text-gray-400"
                                )}>
                                    {plan.title || "Health Intelligence"}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="flex items-baseline justify-end gap-1">
                                    <span className="text-xs font-black">₹</span>
                                    <span className="text-3xl font-black tracking-tighter">{priceValue}</span>
                                </div>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    {isBasic ? "FREE ALWAYS" : billingCycle === 'monthly' ? "PER MONTH" : "PER REPORT"}
                                </p>
                            </div>
                        </div>

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-1 gap-2.5">
                            {(plan.benefits || ['AI Root Cause Analysis', 'Personalized Solutions', 'PDF Report Download']).map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 scale-90",
                                        isPremium ? "bg-amber-400/20 text-amber-400" : isPro ? "bg-ayur-neon/20 text-ayur-neon" : "bg-gray-100 text-gray-400"
                                    )}>
                                        <Check className="w-3 h-3 stroke-[4px]" />
                                    </div>
                                    <span className={cn(
                                        "text-[11px] font-bold tracking-tight",
                                        isPremium ? "text-gray-300" : "text-gray-600"
                                    )}>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => onSelect({...plan, price: priceValue})}
                            className={cn(
                                "w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-[0.98]",
                                isPremium 
                                    ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20" 
                                    : isPro 
                                        ? "bg-black text-white hover:bg-stone-900 shadow-xl"
                                        : "bg-gray-100 text-black hover:bg-gray-200"
                            )}>
                            {isBasic ? "UNFOLD BASIC" : "ACTIVATE " + plan.name}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer Trust DNA */}
            <div className="px-8 py-6 bg-stone-50 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-ayur-neon">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Encrypted Security</p>
                    <p className="text-[10px] font-bold text-black leading-none">Instant Activation</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-6 bg-gray-200 rounded-md animate-pulse" />
                <div className="w-10 h-6 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
