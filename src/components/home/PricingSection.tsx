import React from 'react';
import { motion } from 'motion/react';
import { Check, Zap, Crown, Star, Sparkles, ShieldCheck } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      desc: "Experience the basics of AI Yoga & Ayurveda.",
      features: [
        "2 Free Smart Scans",
        "Basic Dosha Analysis",
        "General Wellness Tips",
        "AI Assistant Access (Basic)",
        "Daily Tips Feed"
      ],
      button: "Get Started",
      premium: false
    },
    {
      name: "Elite Membership",
      price: "499",
      period: "per month",
      desc: "The ultimate biometric-to-vedic bridge.",
      features: [
        "Unlimited Smart Scans",
        "Exclusive Shakti & Prana Engines",
        "Lifetime Digital Health Records",
        "Priority Specialist Connection",
        "Deep Root-Cause Analysis Reports",
        "Advanced Wearable Data Sync"
      ],
      button: "Unlock Elite Access",
      premium: true,
      popular: true
    }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-violet-50/50 rounded-full blur-[120px] pointer-events-none opacity-30" />

      <div className="section-container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100"
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Member Exclusive Benefits</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 tracking-tight leading-[1] uppercase">
             Invest in Your <br />
             <span className="premium-gradient-text italic">Biological Future.</span>
          </h2>
          
          <p className="text-xl text-slate-500 font-medium font-body leading-relaxed max-w-xl mx-auto">
             Choose the protocol that fits your commitment level. Unlock the full depth of the Ayurzenix AI engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {plans.map((plan, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`relative glass-card p-10 md:p-12 flex flex-col justify-between overflow-hidden group ${plan.popular ? 'border-ayur-neon/30 ring-4 ring-ayur-neon/5' : 'border-white/50'}`}
             >
                {plan.popular && (
                  <div className="absolute top-8 right-8 px-4 py-1.5 bg-ayur-neon text-black rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                     <Sparkles className="w-3.5 h-3.5" />
                     Recommended
                  </div>
                )}

                <div className="space-y-8">
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 flex items-center gap-2">
                        {plan.premium && <Crown className="w-6 h-6 text-amber-500" />}
                        {plan.name}
                      </h3>
                      <p className="text-slate-400 text-sm font-medium italic">{plan.desc}</p>
                   </div>

                   <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-slate-400">₹</span>
                      <span className="text-6xl font-heading font-black text-slate-900 tracking-tighter">{plan.price}</span>
                      {plan.period && <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{plan.period}</span>}
                   </div>

                   <div className="space-y-4 pt-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                           <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${plan.premium ? 'bg-violet-50 border-violet-100 text-violet-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                           </div>
                           <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight">{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-12">
                   <motion.button
                     whileHover={{ scale: plan.premium ? 1.05 : 1 }}
                     whileTap={{ scale: 0.95 }}
                     className={`w-full py-5 rounded-[2rem] font-black uppercase text-xs tracking-widest transition-all shadow-xl ${
                       plan.premium 
                       ? 'bg-ayur-neon text-black shadow-ayur-neon/20 hover:scale-[1.02]' 
                       : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
                     }`}
                   >
                     {plan.button}
                   </motion.button>
                   
                   {plan.premium && (
                     <div className="flex items-center justify-center gap-2 mt-4">
                       <ShieldCheck className="w-3.5 h-3.5 text-slate-300" />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-300">Secure Razorpay Checkout</span>
                     </div>
                   )}
                </div>

                {/* Decorative Pattern Background for premium */}
                {plan.premium && (
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px] group-hover:bg-violet-500/10 transition-colors" />
                )}
             </motion.div>
           ))}
        </div>

        {/* Comparison Footnote */}
        <div className="mt-20 text-center max-w-2xl mx-auto space-y-4">
           <div className="flex justify-center gap-6">
              {[
                { icon: Star, text: "99% Success Rate" },
                { icon: Zap, text: "Instant Activation" },
                { icon: ShieldCheck, text: "Cancel Anytime" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                   <item.icon className="w-3.5 h-3.5 text-slate-300" />
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{item.text}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </section>
  );
};
