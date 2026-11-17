import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Eye,
  Activity,
  Cpu,
  Layers
} from 'lucide-react';

export const IntelligenceSystem: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Abstract Tech Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[60vw] h-[60vw] bg-emerald-50/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[50vw] h-[50vw] bg-violet-50/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Core Neural Architecture</span>
            </motion.div>
            
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-3xl md:text-7xl font-heading font-black text-slate-900 tracking-tight leading-[1]">
                The AI <span className="premium-gradient-text italic">Brain.</span> <br />
                Powered by Ancient <br />
                <span className="premium-gradient-text">Protocol.</span>
              </h2>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                We've combined 5,000 years of biological observation with advanced deep-learning to build the operating system for longevity.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
               <motion.button 
                 whileHover={{ x: 5 }}
                 onClick={() => navigate('/intelligence')}
                 className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm tracking-wide flex items-center gap-3 shadow-2xl shadow-slate-200 group"
               >
                 Explore Tech Depth 
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </motion.button>
               <button 
                 onClick={() => navigate('/about')}
                 className="px-8 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-50 transition-all"
               >
                 Our Methodology
               </button>
            </div>
          </div>

          <div className="relative">
             <div className="absolute inset-0 bg-emerald-50/50 blur-[100px] rounded-full" />
             
             <div className="relative z-10 grid grid-cols-2 gap-4">
                {[
                  { 
                    icon: Eye, 
                    t: "Vision IQ", 
                    d: "Facial & Tongue Scan", 
                    params: ["400+ Landmarks", "Real-time CV"],
                    color: "emerald"
                  },
                  { 
                    icon: Brain, 
                    t: "Vedic IQ", 
                    d: "Dosha Reasoning", 
                    params: ["LLM-v4 Engine", "Sushruta DB"],
                    color: "violet"
                  },
                  { 
                    icon: Activity, 
                    t: "Vital IQ", 
                    d: "Health Diagnostics", 
                    params: ["Agni Mapping", "Guna Matrix"],
                    color: "amber"
                  },
                  { 
                    icon: ShieldCheck, 
                    t: "Bio IQ", 
                    d: "Secure Identity", 
                    params: ["On-device ML", "E2E Encrypted"],
                    color: "blue"
                  }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 group relative overflow-hidden"
                  >
                     <div className={`absolute -inset-10 bg-${card.color}-50/30 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl rounded-full`} />
                     <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                           <div className={`w-12 h-12 rounded-2xl bg-${card.color}-50 text-${card.color}-500 flex items-center justify-center border border-${card.color}-100 shadow-sm transition-transform group-hover:scale-110`}>
                              <card.icon className="w-6 h-6" />
                           </div>
                           <div className="flex flex-col items-end gap-1">
                              {card.params.map((p, idx) => (
                                <span key={idx} className="text-[7px] font-black uppercase px-2 py-0.5 rounded-full bg-white/80 border border-slate-100 text-slate-400">{p}</span>
                              ))}
                           </div>
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{card.t}</h4>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{card.d}</p>
                        </div>
                     </div>
                  </motion.div>
                ))}
             </div>

             {/* Live Logic Stream */}
             <div className="mt-4 glass-card p-6 bg-slate-900/5 border-slate-100 overflow-hidden h-36">
                <div className="flex items-center gap-2 mb-4">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Neural Pipeline Live Feed</span>
                </div>
                <div className="space-y-1.5">
                   {[
                     "INITIALIZING SAMHITA_PROTOCOL_V4...",
                     "EXTRACTING GUNA VECTORS FROM FACIAL MAPPING...",
                     "MAPPING AGNI_LEVEL_v2 WITH RECENT LOGS...",
                     "GENERATING BIOLOGICAL SYNTHESIS REPORT...",
                     "OPTIMIZING PERSONALIZED WELLNESS GRADIENTS..."
                   ].map((log, i) => (
                     <motion.p 
                       key={i}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: [0, 1, 0.3], x: 0 }}
                       transition={{ repeat: Infinity, duration: 4, delay: i * 0.8 }}
                       className="text-[8px] font-mono text-slate-400 flex gap-2"
                     >
                        <span className="text-emerald-500/40">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                        {log}
                     </motion.p>
                   ))}
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Parameter Grid */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 pt-16 border-t border-slate-100">
           {[
             { l: "Neural Parameters", v: "140M+" },
             { l: "Classical Datasets", v: "12K" },
             { l: "Bio-Sync Points", v: "400+" },
             { l: "Synthesis Accuracy", v: "99.8%" }
           ].map((s, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="space-y-1"
             >
                <p className="text-4xl md:text-5xl font-heading font-black text-slate-200 tracking-tighter italic leading-none">{s.v}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{s.l}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
};
