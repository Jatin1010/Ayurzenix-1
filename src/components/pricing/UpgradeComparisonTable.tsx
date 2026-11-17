import React from 'react';
import { Check, X, Shield, Activity, Sparkles, Brain, HeartPulse, History } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const FEATURES = [
  { name: "Biological Wellness Score", basic: true, pro: true, premium: true },
  { name: "Dominant Dosha Context", basic: true, pro: true, premium: true },
  { name: "Metabolic Root Cause", basic: "Basic", pro: "Advanced", premium: "Deep Neural" },
  { name: "Biological Diet Roadmap", basic: false, pro: true, premium: true },
  { name: "Neural Trigger Matrix", basic: false, pro: true, premium: true },
  { name: "Ayurvedic Herbal Protocol", basic: false, pro: true, premium: true },
  { name: "Clinical Therapy Guidance", basic: false, pro: true, premium: true },
  { name: "7-Day Action Protocol", basic: false, pro: true, premium: true },
  { name: "30-Day Evolution Blueprint", basic: false, pro: false, premium: true },
  { name: "Future Health Predictor", basic: false, pro: false, premium: true },
  { name: "Premium PDF Ledger", basic: false, pro: false, premium: true },
  { name: "Vedic AI Processing", basic: "Standard", pro: "Priority", premium: "Elite" }
];

export default function UpgradeComparisonTable() {
  return (
    <section className="px-6 py-24 bg-white/40 backdrop-blur-3xl rounded-[4rem] border border-white/40 shadow-premium max-w-5xl mx-auto overflow-hidden">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl font-black text-black uppercase tracking-tightest leading-none">Full Matrix</h2>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Complete Transparency Index</p>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-black/5">
              <th className="py-8 px-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] w-1/3">Feature Set</th>
              <th className="py-8 px-4 text-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Basic</span>
              </th>
              <th className="py-8 px-4 text-center">
                <span className="text-[10px] font-black text-ayur-purple uppercase tracking-widest">Pro</span>
              </th>
              <th className="py-8 px-4 text-center">
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Premium</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {FEATURES.map((feature, i) => (
              <motion.tr 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group hover:bg-white/50 transition-colors"
              >
                <td className="py-6 px-6">
                  <span className="text-xs font-bold text-gray-600 tracking-tight group-hover:text-black transition-colors">{feature.name}</span>
                </td>
                <td className="py-6 px-4 text-center">
                   {typeof feature.basic === 'boolean' ? (
                     feature.basic ? <Check className="w-4 h-4 text-ayur-teal mx-auto" /> : <X className="w-4 h-4 text-gray-200 mx-auto" />
                   ) : <span className="text-[10px] font-black text-gray-400 uppercase">{feature.basic}</span>}
                </td>
                <td className="py-6 px-4 text-center bg-stone-50/30">
                   {typeof feature.pro === 'boolean' ? (
                     feature.pro ? <Check className="w-4 h-4 text-ayur-purple mx-auto" /> : <X className="w-4 h-4 text-gray-200 mx-auto" />
                   ) : <span className="text-[10px] font-black text-ayur-purple uppercase">{feature.pro}</span>}
                </td>
                <td className="py-6 px-4 text-center">
                   {typeof feature.premium === 'boolean' ? (
                     feature.premium ? <Check className="w-4 h-4 text-black mx-auto" /> : <X className="w-4 h-4 text-gray-200 mx-auto" />
                   ) : <span className="text-[10px] font-black text-black uppercase">{feature.premium}</span>}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
