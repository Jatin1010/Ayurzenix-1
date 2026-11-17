import React from 'react';
import { motion } from 'motion/react';
import { Search, Brain, Target, ArrowRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export const Methodology: React.FC = () => {
  const steps = [
    {
      icon: Search,
      title: "AI Analysis",
      desc: "Our neural core maps 200+ distinct physiological symptoms to identify bio-patterns.",
      color: "emerald"
    },
    {
      icon: Brain,
      title: "Dosha Intelligence",
      desc: "Classical Samhita-based logic decodes your unique Vata, Pitta, and Kapha constitution.",
      color: "violet"
    },
    {
      icon: Target,
      title: "Personalized Plan",
      desc: "Receive an adaptive wellness roadmap including diet, herbs, and lifestyle correction.",
      color: "amber"
    }
  ];

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 px-4">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100"
          >
             <Sparkles className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">The Ayurzenix Protocol</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight leading-tight">
            How Your Wellness <br />
            <span className="premium-gradient-text">Syncs with AI.</span>
          </h2>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed">
            A seamless bridge between 5,000 years of observation and future-tech precision.
          </p>
        </div>

        <div className="relative">
          {/* Animated Connectors - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-emerald-100 via-violet-100 to-amber-100 -translate-y-1/2 z-0">
             <motion.div 
               animate={{ left: ['0%', '100%'] }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-ayur-primary to-transparent"
             />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group flex flex-col items-center text-center"
              >
                <div className={`w-24 h-24 rounded-[2.5rem] bg-white shadow-premium flex items-center justify-center mb-8 border border-white group-hover:scale-110 transition-transform duration-500 relative`}>
                   <div className={`absolute inset-0 bg-${step.color}-500/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                   <step.icon className={`w-10 h-10 text-${step.color}-500 relative z-10`} />
                   
                   <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold border-4 border-white">
                      {i + 1}
                   </div>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">
                  {step.desc}
                </p>
                
                {i < steps.length - 1 && (
                  <div className="mt-8 lg:hidden">
                    <ArrowRight className="w-6 h-6 text-slate-200 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-24 p-8 glass-card bg-emerald-50/50 border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8"
        >
           <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-sm overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Expert" className="w-full h-full object-cover" />
                   </div>
                 ))}
              </div>
              <div>
                 <p className="text-sm font-bold text-slate-900">Elite Wellness Network</p>
                 <p className="text-xs text-slate-400 font-medium">Verified by BAMS Doctors & MIT AI Researchers</p>
              </div>
           </div>

           <div className="flex items-center gap-4 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Clinically Grounded Methodology</span>
           </div>
        </motion.div>
      </div>
    </section>
  );
};
