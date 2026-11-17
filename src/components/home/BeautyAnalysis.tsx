import React from 'react';
import { motion } from 'motion/react';
import { Camera, Sparkles, Scissors, Zap, ArrowUpRight } from 'lucide-react';

interface BeautyAnalysisProps {
  onFeature: (path: string) => void;
}

export const BeautyAnalysis: React.FC<BeautyAnalysisProps> = ({ onFeature }) => {
  const cards = [
    {
      title: "Face Glow Analyzer",
      desc: "Reveal your natural radiance with AI-powered skin analysis.",
      tag: "AI Skin Tech",
      icon: Sparkles,
      color: "emerald",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
      path: "/face-glow-landing"
    },
    {
      title: "Hair Fall Analyzer",
      desc: "Analyze root causes of thinning and get specialized care.",
      tag: "Root Analysis",
      icon: Scissors,
      color: "violet",
      img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800",
      path: "/hair-fall-landing"
    },
    {
      title: "AI Body Scan",
      desc: "A holistic visual diagnostic for skin, tongue, and posture.",
      tag: "Visual Diagnosis",
      icon: Camera,
      color: "amber",
      img: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800",
      path: "/body-scan-landing"
    }
  ];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Soft Atmosphere */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-violet-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-emerald-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-ayur-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Visual Bio-Diagnostics</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Beauty & Body <br />
            <span className="premium-gradient-text">Precision Analysis.</span>
          </h2>
          
          <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
            High-definition visual intelligence to decode your aesthetic and physical markers with clinical depth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => onFeature(card.path)}
              className="group cursor-pointer glass-card aspect-[4/5] overflow-hidden relative"
            >
              <div className="absolute inset-0 z-0">
                 <img 
                   src={card.img} 
                   alt={card.title}
                   className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 z-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center border border-white shadow-sm text-${card.color}-500`}>
                       <card.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest text-${card.color}-600`}>{card.tag}</span>
                 </div>

                 <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 leading-none uppercase tracking-tight">{card.title}</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">{card.desc}</p>
                 </div>

                 <motion.div 
                   whileHover={{ x: 5 }}
                   className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white px-5 py-2.5 rounded-full shadow-lg border border-slate-50"
                 >
                    Start Analysis
                    <ArrowUpRight className="w-3.5 h-3.5" />
                 </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
