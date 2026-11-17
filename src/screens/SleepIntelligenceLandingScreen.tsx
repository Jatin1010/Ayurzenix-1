import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Moon, 
  Zap, 
  AlertCircle, 
  Activity, 
  ShieldCheck, 
  Clock,
  Heart,
  Droplets,
  Star,
  Sun
} from 'lucide-react';
import { motion } from 'motion/react';
import FeatureBlog from '../components/FeatureBlog';
import { FEATURE_PRICES } from '../constants/pricing';

export default function SleepIntelligenceLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const risks = [
    "Waking up tired despite 8 hours of sleep",
    "Racing thoughts the moment you hit the pillow",
    "Dependency on late-night screens or caffeine",
    "Frequent waking between 2 AM and 4 AM",
    "Physical stiffness and mental fog in the morning",
    "Dream-disturbed or shallow, non-restorative rest"
  ];

  const faqs = [
    {
      q: "How does AI analyze my sleep without a watch?",
      a: "Our AI uses Circadian Rhythm Mapping and Guna Analysis based on your biological markers, lifestyle inputs, and optional fatigue-scan to determine sleep quality and recovery potential."
    },
    {
      q: "What is an Ayurvedic Sleep Intelligence Protocol?",
      a: "It's a personalized 30-day roadmap that aligns your Dinacharya (daily routine) with your Dosha's specific sleep window and nervous system needs."
    },
    {
      q: "Can this help with chronic insomnia?",
      a: "Yes. By identifying whether your insomnia is Vata-driven (anxiety), Pitta-driven (heat/anger), or Kapha-driven (lethargy), we provide root-cause remedies."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-32 font-sans selection:bg-purple-100 gpu-accelerated">
      {/* Hero Section */}
      <section className="relative h-[650px] overflow-hidden gpu-accelerated">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1600" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/60 to-transparent backdrop-grayscale-[0.2]" />
        
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
              className="inline-flex items-center gap-3 px-4 py-1.5 bg-purple-600/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/20"
            >
              <Moon className="w-3.5 h-3.5 fill-current" />
              Neural Sleep intelligence
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
            >
              Master Your <br />
              <span className="text-purple-400 italic font-serif">Night Rhythm</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-white/60 text-lg font-medium max-w-[320px] leading-relaxed tracking-tight"
            >
              The world's first AI mapping system for Dosha-specific biological rest intervals.
            </motion.p>
            
            <div className="flex items-center gap-5 pt-4">
               <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-stone-800 overflow-hidden bg-stone-700 shadow-2xl">
                      <img src={`https://i.pravatar.cc/150?u=sleep_ai_${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                    </div>
                  ))}
               </div>
               <div className="space-y-0.5">
                 <p className="text-white font-black text-xs">Premium Access</p>
                 <span className="text-white/40 text-[9px] font-black uppercase tracking-widest leading-none">Join 18.2K+ Optimized Restorers</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Cinematic Bottom Fade */}
        <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
      </section>

      <div className="px-6 -mt-12 relative z-20 space-y-16 max-w-xl mx-auto">
        {/* Symptom Checker Card */}
        <section className="bg-white rounded-[3.5rem] p-12 shadow-[0_40px_100px_-20px_rgba(162,89,255,0.08)] border border-stone-50 gpu-accelerated">
          <header className="flex flex-col gap-2 mb-10">
            <h2 className="text-2xl font-black text-black tracking-tight flex items-center gap-3">
               Restoration Signals
               <Activity className="w-5 h-5 text-purple-600" />
            </h2>
            <p className="text-stone-400 text-xs font-bold uppercase tracking-widest italic leading-none">Is your nervous system actually recovering?</p>
          </header>
          
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={i} 
                className="flex items-center gap-6 p-6 bg-stone-50/40 rounded-[2rem] border border-stone-100/50 hover:bg-stone-50 hover:border-purple-100 transition-all group cursor-default"
              >
                <div className="w-3 h-3 rounded-full bg-purple-200 group-hover:bg-purple-600 transition-colors shadow-inner" />
                <p className="text-sm font-bold text-stone-800 leading-tight italic tracking-tight">{risk}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Problem vs Solution - Grid Refinement */}
        <section className="grid grid-cols-1 gap-6">
          <div className="bg-stone-50 rounded-[3rem] p-10 border border-stone-100/80 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
              <AlertCircle className="w-24 h-24 text-stone-900" />
            </div>
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              Incomplete Rest Architecture
            </h3>
            <p className="text-lg text-stone-900 font-black leading-[1.3] italic tracking-tight">
              Standard hygiene ignores your <span className="text-stone-400">Dosha-specific thermal window</span>. You aren't sleeping; you're just drifting.
            </p>
          </div>
          
          <div className="bg-purple-600 rounded-[3rem] p-10 text-white shadow-[0_20px_50px_-10px_rgba(162,89,255,0.3)] relative overflow-hidden group">
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
            <h3 className="text-[10px] font-black text-purple-200 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              AI Circadian Precision
            </h3>
            <p className="text-lg text-white font-black leading-[1.3] italic tracking-tight">
              Ayurzenix AI synchronizes your <span className="text-purple-300 underline decoration-2 underline-offset-4">Deep Neural Recovery</span> with the Earth's biological cadence.
            </p>
          </div>
        </section>

        {/* Feature Blog Content */}
        <div className="pt-4">
          <FeatureBlog featureId="better-sleep" />
        </div>

        {/* Sample Report Preview */}
        <section className="bg-stone-950 rounded-[4rem] p-12 text-white space-y-12 overflow-hidden relative shadow-[0_50px_100px_-30px_rgba(0,0,0,0.5)] border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse" />
          
          <div className="space-y-3 text-center relative z-10">
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-purple-500 to-transparent mx-auto mb-6 opacity-50" />
            <h2 className="text-3xl font-black italic tracking-tighter">Resonance Report</h2>
            <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.5em]">Quantum Intelligence Synthesis</p>
          </div>

          <div className="flex flex-col items-center gap-12 relative z-10">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="118" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/10" />
                <circle 
                  cx="128" cy="128" r="118" 
                  stroke="currentColor" strokeWidth="10" 
                  strokeDasharray={741} 
                  strokeDashoffset={741 - (84/100) * 741} 
                  strokeLinecap="round" 
                  fill="transparent" 
                  className="text-purple-500 drop-shadow-[0_0_15px_rgba(162,89,255,0.5)]" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-7xl font-black tracking-tighter tabular-nums">84</span>
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mt-3 bg-purple-500/10 px-4 py-1 rounded-full border border-purple-500/20">Recovery Index</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full">
              {[
                { label: 'Circadian State', value: 'Phase Locked', color: 'emerald', icon: <Sun /> },
                { label: 'Neural Static', value: 'Minimal', color: 'blue', icon: <Brain /> }
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] p-7 border border-white/10 text-center space-y-2 group hover:bg-white/[0.06] transition-colors">
                  <div className={`mx-auto w-8 h-8 rounded-full bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 mb-2`}>
                    {item.icon}
                  </div>
                  <p className="text-stone-500 text-[9px] font-black uppercase tracking-widest tracking-[0.2em]">{item.label}</p>
                  <p className={`text-base font-black text-${item.color}-400 italic`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 relative z-10">
            <p className="text-center text-xs text-stone-400 italic max-w-xs mx-auto leading-relaxed">
               "Neural scan detected <span className="text-purple-400">Vata-Spike</span> at 11:24 PM. Subconscious load is preventing Stage 3 entry. recommended: Ashwagandha extract + Warm oil application."
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-12 pb-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-black italic tracking-tight">Technical Inquiry</h2>
            <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">Decoding the AI Logic</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-white rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <span className="text-sm font-black text-stone-900 pr-6 leading-tight tracking-tight italic">{faq.q}</span>
                  <div className="p-2 rounded-full bg-stone-50 group-open:bg-purple-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-stone-300 group-open:rotate-90 group-open:text-purple-600 transition-transform" />
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

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-50 backdrop-blur-3xl">
        <button 
          onClick={() => navigate('/sleep-intelligence-scan')}
          className="w-full max-w-xl mx-auto bg-stone-950 hover:bg-black text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] shadow-[0_20px_50px_-10px_rgba(162,89,255,0.4)] flex items-center justify-center gap-6 group transition-all active:scale-[0.97] border border-white/5"
        >
          <Zap className="w-5 h-5 fill-purple-400 text-purple-400 group-hover:scale-125 transition-transform duration-500" />
          Initialize Analysis
          <ChevronRight className="w-5 h-5 opacity-30 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>

  );
}
