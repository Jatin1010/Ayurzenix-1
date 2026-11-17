import React from 'react';
import { ShieldCheck, Zap, Sparkles, RefreshCcw, FileText } from 'lucide-react';
import { motion } from 'motion/react';

const TRUST_BADGES = [
  { icon: <ShieldCheck className="w-6 h-6" />, label: "Secure Razorpay", sub: "256-bit Encrypted" },
  { icon: <Zap className="w-6 h-6" />, label: "Instant Access", sub: "Zero Wait Time" },
  { icon: <Sparkles className="w-6 h-6" />, label: "AI Intelligence", sub: "Ayurvedic Neural" },
  { icon: <RefreshCcw className="w-6 h-6" />, label: "Flexible Plans", sub: "Cancel Anytime" },
  { icon: <FileText className="w-6 h-6" />, label: "Lifetime History", sub: "Biological Ledger" }
];

export default function TrustSection() {
  return (
    <section className="px-6 py-24 bg-gradient-to-br from-emerald-950 via-black to-emerald-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-ayur-teal/10 blur-[120px] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
         <div className="text-center">
            <h2 className="text-3xl font-black text-white uppercase tracking-tightest mb-4">Architecture of Trust</h2>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Standardization & Protocol Security</p>
         </div>

         <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {TRUST_BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-[1.75rem] bg-white/5 border border-white/10 flex items-center justify-center text-ayur-teal shadow-2xl transition-transform hover:scale-110">
                  {badge.icon}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">{badge.label}</p>
                  <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">{badge.sub}</p>
                </div>
              </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}
