import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Zap, ShieldCheck, Crown, ChevronRight, Lock, Clock, UserCheck, Shield } from 'lucide-react';
import { FeaturePricing, Plan } from '../lib/pricing';
import { cn } from '../lib/utils';

interface PremiumPaywallProps {
  pricing: FeaturePricing;
  onSelect: (plan: Plan) => void;
  isLoading?: boolean;
}

export default function PremiumPaywall({ pricing, onSelect, isLoading }: PremiumPaywallProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex flex-col items-center px-6 py-12 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-xl shadow-emerald-500/10">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-4">
          Your Personalized Result is Ready
        </h2>
        <p className="text-md text-gray-600 font-medium max-w-sm mx-auto">
           Unlocking your Ayurveda insights will give you a clear path to vitality. Choose your plan to begin.
        </p>
      </motion.div>

      <div className="w-full space-y-6 max-w-md">
        {pricing?.plans?.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => !isLoading && onSelect(plan)}
            className={cn(
              "p-8 rounded-[2.5rem] cursor-pointer group transition-all relative shadow-lg shadow-emerald-500/5",
              plan.badge 
                ? "bg-white border-2 border-emerald-500" 
                : "bg-white/60 border border-black/5 hover:border-emerald-200"
            )}
          >
            {plan.badge && (
              <span className="absolute -top-3 right-8 px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {plan.badge}
              </span>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-black uppercase tracking-tight mb-1">{plan.title}</h3>
                <p className="text-xs text-gray-500 font-medium">{plan.description}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-black">₹{plan.price}</div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.benefits?.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-900">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {benefit}
                </li>
              ))}
            </ul>

            <button 
                onClick={(e) => { e.stopPropagation(); !isLoading && onSelect(plan); }}
                className={cn(
                    "w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all",
                    plan.badge ? "bg-emerald-600 text-white" : "bg-gray-100 text-black hover:bg-emerald-100"
                )}
            >
                Select {plan.name}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
