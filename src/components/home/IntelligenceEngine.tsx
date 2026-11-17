import React from 'react';
import { motion } from 'motion/react';
import { Brain, Wind, Flame, Shield, Zap, Sparkles, ChevronRight, Activity } from 'lucide-react';

interface EngineProps {
  onFeature: (path: string) => void;
}

const engines = [
  {
    id: 'prana',
    title: 'Prana Engine',
    desc: 'Heart and respiratory intelligence for vital life force.',
    icon: Wind,
    path: '/heart-health',
    color: 'emerald'
  },
  {
    id: 'agni',
    title: 'Agni Engine',
    desc: 'Gut intelligence and metabolic fire analysis.',
    icon: Flame,
    path: '/gut-landing',
    color: 'orange'
  },
  {
    id: 'yakrut',
    title: 'Yakrut Engine',
    desc: 'Liver detoxification and blood purity monitoring.',
    icon: Shield,
    path: '/liver-health',
    color: 'blue'
  },
  {
    id: 'manas',
    title: 'Manas Engine',
    desc: 'Mental recovery and cognitive balance analytics.',
    icon: Brain,
    path: '/smart-mental-scan-landing',
    color: 'violet'
  },
  {
    id: 'shakti',
    title: 'Shakti Engine',
    desc: 'Hormonal harmony and reproductive vitality.',
    icon: Zap,
    path: '/hormonal-balance-landing',
    color: 'pink'
  },
  {
    id: 'ojas',
    title: 'Ojas Engine',
    desc: 'Immunity defense and biological aging prediction.',
    icon: Sparkles,
    path: '/future-predictor-landing',
    color: 'amber'
  }
];

export const IntelligenceEngine: React.FC<EngineProps> = ({ onFeature }) => {
  return (
    <section className="relative overflow-hidden py-10 lg:py-16">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="section-container relative z-10 px-4">
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-ayur-primary/5 border border-ayur-primary/10 mb-5"
          >
            <Activity className="w-3.5 h-3.5 text-ayur-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-ayur-primary">Hexa-Core Intelligence</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-heading font-black mb-6 leading-[1.1] text-slate-900 tracking-tight"
          >
            Decode Your Biology with <br />
            <span className="premium-gradient-text">6 Precision Engines.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 leading-relaxed font-medium"
          >
            Highly specialized diagnostic systems that map ancient bio-markers to modern clinical intelligence for total body awareness.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {engines.map((engine, index) => (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onFeature(engine.path)}
              whileHover={{ y: -8 }}
              className="glass-card group cursor-pointer p-8 md:p-10 hover:shadow-2xl transition-all duration-500 overflow-hidden relative"
            >
              {/* Corner Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${engine.color}-100/30 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative">
                <div className={`w-16 h-16 rounded-3xl bg-${engine.color}-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <engine.icon className={`w-8 h-8 text-${engine.color}-600`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{engine.title}</h3>
                <p className="text-slate-500 mb-8 font-medium leading-relaxed text-sm md:text-base">
                  {engine.desc}
                </p>
                
                <div className="flex items-center gap-2 text-ayur-primary font-bold uppercase text-[10px] tracking-widest group-hover:gap-4 transition-all">
                  Analyze This Engine <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
