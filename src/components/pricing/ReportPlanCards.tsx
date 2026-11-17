import React from 'react';
import { motion } from 'motion/react';
import { Check, Lock, Zap, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  locked?: string[];
  badge?: string;
}

interface ReportPlanCardsProps {
  onSelect: (planId: string) => void;
}

const REPORT_PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Report',
    price: 0,
    description: 'Quick Ayurvedic insight for essential wellness awareness.',
    benefits: [
      'Wellness Score',
      'Dominant Dosha',
      'Short Root Cause',
      '1 Home Remedy',
      '1 Lifestyle Tip'
    ],
    locked: [
      'Diet Roadmap',
      'Yoga & Pranayama',
      'Therapy Guidance',
      'Future Prediction',
      '30-Day Blueprint'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Report',
    price: 49,
    badge: 'MOST POPULAR',
    description: 'Deep personalized Ayurvedic analysis with practical healing guidance.',
    benefits: [
      'Full Wellness Dashboard',
      'Deep Root Cause Analysis',
      'Agni & Digestion Mapping',
      'Mental & Emotional Analytics',
      'Bio-Optimal Diet Roadmap',
      'Morning/Night Routines',
      '7-Day Healing Protocol',
      'Neural Trigger Matrix'
    ],
    locked: [
      '30-Day Evolution Blueprint',
      'Future Health Predictor',
      'Premium PDF Ledger'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Report',
    price: 99,
    description: 'Complete Ayurvedic transformation intelligence with future-focused healing roadmap.',
    benefits: [
      'Deep Ayurvedic Intelligence',
      'Advanced Therapy Sequencing',
      '30-Day Transformation Plan',
      'Future Health Predictor (Hormonal/Sleep)',
      'Advanced Recovery Tracking',
      'Personalized Product Curation',
      'Premium PDF Ledger Download',
      'Priority AI Processing Energy'
    ]
  }
];

export default function ReportPlanCards({ onSelect }: ReportPlanCardsProps) {
  return (
    <section className="px-6 py-20 space-y-12">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">Intelligence Reports</h2>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">Choose your depth of analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {REPORT_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "relative group rounded-[3rem] p-10 flex flex-col h-full transition-all duration-700",
              plan.id === 'pro' 
                ? "bg-white border-2 border-ayur-purple shadow-[0_40px_100px_-20px_rgba(162,89,255,0.15)] ring-8 ring-ayur-purple/5 xl:scale-105 z-10" 
                : "bg-white border border-black/5 shadow-premium hover:shadow-2xl"
            )}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0 p-2 px-6 bg-ayur-purple rounded-bl-3xl">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{plan.badge}</span>
              </div>
            )}

            <div className="space-y-6 mb-10">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg",
                    plan.id === 'premium' ? "bg-black" : plan.id === 'pro' ? "bg-ayur-purple" : "bg-ayur-teal"
                  )}>
                    {plan.id === 'premium' ? <Crown className="w-6 h-6 text-ayur-amber" /> : plan.id === 'pro' ? <Zap className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tight">{plan.name}</h3>
                </div>
                <p className="text-sm font-bold text-gray-500 leading-relaxed font-italic line-clamp-2 mt-2">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-black">₹{plan.price}</span>
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">/ Report</span>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Biological Unlocks</p>
                <div className="space-y-3">
                  {plan.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-lg bg-ayur-teal/10 flex items-center justify-center group-hover:bg-ayur-teal/20 transition-colors">
                        <Check className="w-3.5 h-3.5 text-ayur-teal" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 leading-tight">{benefit}</span>
                    </div>
                  ))}
                  {plan.locked?.map((locked, j) => (
                    <div key={j} className="flex items-start gap-4 opacity-40">
                      <div className="mt-1 w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-400 line-through leading-tight decoration-gray-300">{locked}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(plan.id)}
              className={cn(
                "w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] mt-10 shadow-xl transition-all flex items-center justify-center gap-3",
                plan.id === 'premium' ? "bg-gradient-to-br from-ayur-teal to-emerald-800 text-white" : plan.id === 'pro' ? "bg-ayur-purple text-white" : "bg-stone-50 text-black border border-black/5 hover:bg-black hover:text-white"
              )}
            >
              {plan.price === 0 ? 'Try Free' : `Unlock ${plan.id === 'premium' ? 'Premium' : 'Pro'}`} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
