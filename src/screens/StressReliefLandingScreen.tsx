import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Zap, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Brain, 
  Wind,
  AlertCircle,
  ChevronRight,
  Sun,
  Heart
} from 'lucide-react';
import FeatureBlog from '../components/FeatureBlog';

export default function StressReliefLandingScreen() {
  const navigate = useNavigate();

  const risks = [
    "Irritable mental state & mood volatility",
    "Physical tension in neck and shoulders",
    "Racing thoughts preventing deep sleep",
    "Frequent fatigue despite regular rest",
    "Digestive sensitivity and 'butterflies'",
    "Difficulty focusing on singular tasks"
  ];

  const faqs = [
    {
      q: "How does AI detect my stress type?",
      a: "Our algorithm analyzes clinical markers like sleep latency, mental fatigue patterns, and emotional sensitivity against Ayurvedic Guna (Sattva, Rajas, Tamas) logic."
    },
    {
      q: "Is this a substitute for therapy?",
      a: "No. This is a wellness mapping tool designed to synchronize your biological rhythms and suggest natural Ayurvedic adjustments for daily balance."
    },
    {
      q: "What is a 'Neural Reset'?",
      a: "It's a specific set of 15-minute rituals (Pranayama, Oil application, Mantras) calculated to switch your nervous system from 'Fight/Flight' to 'Rest/Digest'."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-32 font-sans selection:bg-emerald-100 gpu-accelerated overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[650px] overflow-hidden gpu-accelerated">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-transparent backdrop-blur-[1px]" />
        
        <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-32 max-w-xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-16 left-6 p-4 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 text-white active:scale-90 transition-all hover:bg-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-emerald-600/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/20"
            >
              <Brain className="w-3.5 h-3.5" />
              Neural Decompression
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
            >
              Decompress <br />
              <span className="text-emerald-400 italic font-serif">Your Soul</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-white/60 text-lg font-medium max-w-[320px] leading-relaxed tracking-tight"
            >
              Beyond temporary relief. Map your nervous system's response to modern chaos.
            </motion.p>
            
            <div className="flex items-center gap-5 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-stone-800 overflow-hidden bg-stone-700 shadow-2xl">
                      <img src={`https://i.pravatar.cc/150?u=stress_ai_${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                    </div>
                  ))}
               </div>
               <div className="space-y-0.5">
                 <p className="text-white font-black text-xs">Premium Reset</p>
                 <span className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Mapping 22.4K+ Neural Paths</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </section>

      <div className="px-6 -mt-12 relative z-20 space-y-16 max-w-xl mx-auto">
        {/* Symptom Checker Card */}
        <section className="bg-white rounded-[3.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(16,185,129,0.08)] border border-stone-50">
          <header className="flex flex-col gap-2 mb-10 text-center">
            <h2 className="text-2xl font-black text-black tracking-tight flex items-center justify-center gap-3">
               Anxiety Signal Markers
               <Activity className="w-5 h-5 text-emerald-600" />
            </h2>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Are you in 'Fight or Flight' mode?</p>
          </header>
          
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i} 
                className="flex items-center gap-6 p-6 bg-stone-50/40 rounded-[2rem] border border-stone-100/50 hover:bg-emerald-50/30 hover:border-emerald-100 transition-all group"
              >
                <div className="w-3 h-3 rounded-full bg-emerald-200 group-hover:bg-emerald-600 transition-colors" />
                <p className="text-sm font-bold text-stone-800 leading-tight italic tracking-tight">{risk}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Comparison Grid */}
        <section className="grid grid-cols-1 gap-6">
          <div className="bg-stone-50 rounded-[3rem] p-10 border border-stone-100 relative overflow-hidden group">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              Generic Relaxation
            </h3>
            <p className="text-lg text-stone-900 font-black leading-[1.3] italic tracking-tight">
              Temporary distraction without clearing the <span className="text-stone-400">Mental Ama (toxins)</span> in your deep subconscious.
            </p>
          </div>
          
          <div className="bg-emerald-600 rounded-[3rem] p-10 text-white shadow-[0_20px_50px_-10px_rgba(16,185,129,0.3)] relative overflow-hidden">
            <h3 className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              Sattvic Recalibration
            </h3>
            <p className="text-lg text-white font-black leading-[1.3] italic tracking-tight">
              AI maps your <span className="text-emerald-300 underline decoration-2 underline-offset-4">Guna Balance</span> to proactively lower cortisol before it peaks.
            </p>
          </div>
        </section>

        {/* Feature Blog */}
        <FeatureBlog featureId="stress-relief" />

        {/* Sample Report Preview */}
        <section className="bg-stone-950 rounded-[4rem] p-12 text-white space-y-12 overflow-hidden relative shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full blur-[150px] opacity-20" />
          
          <div className="space-y-3 text-center">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-emerald-500 to-transparent mx-auto mb-6 opacity-50" />
            <h2 className="text-3xl font-black italic tracking-tighter">Stress-Resilience Map</h2>
            <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.5em]">Neural Load Analysis</p>
          </div>

          <div className="flex flex-col items-center gap-12">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="118" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/10" />
                <circle 
                  cx="128" cy="128" r="118" 
                  stroke="currentColor" strokeWidth="10" 
                  strokeDasharray={741} 
                  strokeDashoffset={741 - (68/100) * 741} 
                  strokeLinecap="round" 
                  fill="transparent" 
                  className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black tracking-tighter tabular-nums">12</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-3 bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20">Anxiety Load low</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              {[
                { label: 'Neural Static', value: 'Minimal', color: 'emerald', icon: <Wind className="w-4 h-4" /> },
                { label: 'Vata Recovery', value: 'High', color: 'blue', icon: <ShieldCheck className="w-4 h-4" /> }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-7 border border-white/10 text-center space-y-2">
                  <div className={`mx-auto w-8 h-8 rounded-full bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 mb-2`}>
                    {item.icon}
                  </div>
                  <p className="text-stone-500 text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</p>
                  <p className={`text-base font-black text-${item.color}-400 italic`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-12 pb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-black italic tracking-tight">Technical Inquiry</h2>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">Decoding the Reset Logic</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <span className="text-sm font-black text-stone-900 pr-6 leading-tight italic">{faq.q}</span>
                  <div className="p-2 rounded-full bg-stone-50 group-open:bg-emerald-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-stone-300 group-open:rotate-90 group-open:text-emerald-600 transition-transform" />
                  </div>
                </summary>
                <div className="px-8 pb-8 text-sm text-stone-500 leading-relaxed font-medium pt-2 border-t border-stone-50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-50 backdrop-blur-3xl">
        <button 
          onClick={() => navigate('/stress-relief-scan')}
          className="w-full max-w-xl mx-auto bg-stone-950 hover:bg-black text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-6 group transition-all active:scale-[0.97] border border-white/5"
        >
          <Zap className="w-5 h-5 fill-emerald-400 text-emerald-400 group-hover:scale-125 transition-transform duration-700" />
          Initialize Analysis
          <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
