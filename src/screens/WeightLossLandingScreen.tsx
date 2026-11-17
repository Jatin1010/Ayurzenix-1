import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Zap, 
  AlertCircle, 
  Sparkles, 
  Target, 
  Scale, 
  Flame, 
  Clock, 
  PieChart, 
  CheckCircle2, 
  ChevronRight,
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

const COLORS = {
  primary: '#00BFA6',
  accent: '#FFB400',
  alert: '#FF6B6B',
  secondary: '#A259FF',
  dark: '#0A2F30',
  deepNavy: '#040F49',
  bgLight: '#F7FCF9',
  textDark: '#000000',
  textGray: '#111827'
};

const SYMPTOMS = [
  "Stubborn belly fat that won't nudge",
  "Constant low energy & afternoon slumps",
  "Intense sugar & late-night cravings",
  "Slow metabolism regardless of diet",
  "Bloating & heavy feeling after meals",
  "Emotional eating during stress"
];

const QUICK_TIPS = [
  { icon: <Flame className="w-5 h-5" />, title: "Agni Boost", text: "Sip warm water with ginger through the day to ignite your digestive fire." },
  { icon: <Clock className="w-5 h-5" />, title: "Eat at Noon", text: "Make lunch your biggest meal when the sun and your Agni are strongest." },
  { icon: <Scale className="w-5 h-5" />, title: "3-Hour Gap", text: "Keep at least 3 hours between dinner and sleep for complete digestion." },
  { icon: <Activity className="w-5 h-5" />, title: "Kapha Walk", text: "Walk 100 steps after every meal to prevent Kapha accumulation." }
];

const FAQS = [
  { 
    q: "How is this different from a normal diet?", 
    a: "Normal diets focus only on calories. Ayurzenix focuses on your 'Agni' (digestive fire) and 'Dosha'. We identify if your weight is due to Kapha imbalance, slow metabolism, or toxins (Ama), then provide a solution that works for YOUR body type." 
  },
  { 
    q: "When will I see results?", 
    a: "Within 60 seconds, you get your AI analysis. Most users feel a significant difference in energy and bloating within 7 days of following their personalized Ayurvedic routine." 
  },
  { 
    q: "Is this suitable for people with PCOD/Thyroid?", 
    a: "Yes! Ayurveda specializes in hormonal balance. Our AI scan takes into account hormonal signals like bloating and fatigue to suggest corrective lifestyle shifts." 
  }
];

export default function WeightLossLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7FCF9] pb-32">
      <SEO 
        title="Burn Fat Vibe Fast – Ayurvedic Weight Loss AI"
        description="Unlock your ancient genetic code for fat loss. Ayurzenix AI analyzes your Agni and metabolism to provide personalized Ayurvedic weight loss plans."
        image="/weightloss1.png"
      />
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center border border-stone-200 active:scale-90 transition-all text-stone-950"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {/* 1. Hero Section */}
      <section className="relative h-[85vh] overflow-hidden flex items-end">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="/weightloss1.png" 
          alt="Ayurvedic Weight Loss" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7FCF9] via-[#F7FCF9]/40 to-transparent" />
        
        <div className="relative z-10 w-full px-6 pb-20 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
              <Sparkles className="w-4 h-4 text-[#00BFA6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BFA6]">AI-Powered Precision</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black leading-[0.9]">
              BURN FAT <br />
              <span className="text-[#00BFA6]">VIBE FAST.</span>
            </h1>
            <p className="text-gray-600 text-lg font-bold leading-relaxed max-w-sm">
              Stop fighting your metabolism. 
              <span className="text-black font-black ml-1">Unlock your Ancient genetic code</span> with AI-powered fat analytics.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-stone-300 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  10K+ Successful Scans
                </p>
                <div className="flex items-center gap-2">
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded border border-gray-200 italic">ISO 9001</span>
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded border border-gray-200 italic">AI-VERIFIED</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Symptom Checker Card */}
      <section className="px-6 -mt-10 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">The Metabolism Trap</h2>
            <h3 className="text-4xl font-black tracking-tighter text-stone-950">Is Your Weight <span className="text-stone-400">Stuck?</span></h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {SYMPTOMS.map((symptom, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0 group-hover:bg-rose-50 group-hover:border-rose-100 transition-colors">
                  <AlertCircle className="w-4 h-4 text-stone-300 group-hover:text-[#FF6B6B]" />
                </div>
                <p className="text-[#111827] font-medium text-lg leading-tight">{symptom}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. Problem vs Solution */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 bg-stone-50 p-10 rounded-[3rem] border border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-rose-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-black tracking-tighter">The Error</h4>
            </div>
            <p className="text-stone-600 font-medium leading-relaxed">
              Most diets ignore that <span className="text-stone-950 font-bold">Ama (Toxins)</span> act like glue for fat cells. When Ama is high, your body protects itself by holding onto fat, making weight loss nearly impossible despite heavy cardio.
            </p>
          </div>

          <div className="space-y-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00BFA6]/5 blur-[60px] rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#00BFA6] shadow-xl flex items-center justify-center text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-black tracking-tighter text-black">The Zenith Way</h4>
            </div>
            <p className="text-gray-600 font-bold leading-relaxed relative z-10">
              Ayurzenix uses <span className="text-[#00BFA6] font-black">Deep Vibe Analytics</span> to detect your Agni state. We target the root—clearing Ama first so your metabolism naturally incinerates fat at a 3x faster rate.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Deep Insight Blog */}
      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl font-black tracking-tighter text-[#000000] leading-none">
              Ancient Wisdom. <br />
              <span className="text-emerald-500">Supercharged by AI.</span>
            </h2>
            <div className="pl-6 border-l-4 border-amber-500">
              <p className="text-xl text-[#111827] leading-relaxed font-semibold italic">
                "Weight is not a number. It's a signal of stagnant energy."
              </p>
            </div>
            <p className="text-[#1f2937] text-lg leading-relaxed font-medium">
              In Ayurveda, excess weight is often a result of accumulated <strong>Kapha</strong> and <strong>Meda Dhatu</strong> (fat tissue) imbalance. While modern gyms tell you to 'run it off', we show you how to 'vibe it off' by aligning your internals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
              <Target className="w-8 h-8 text-emerald-500 mb-4" />
              <h4 className="text-xl font-black text-stone-950 mb-3">Metabolic Typing</h4>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                Our AI scans 24+ bio-signals to determine if you are a Slow, Blocked, or Hyper-Metabolizer. No more guessing.
              </p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm">
              <Flame className="w-8 h-8 text-amber-500 mb-4" />
              <h4 className="text-xl font-black text-stone-950 mb-3">Agni Calibration</h4>
              <p className="text-sm text-stone-600 leading-relaxed font-medium">
                Fix your digestive fire. We provide the exact herbs and timing needed to convert food into energy, not storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sample Report Preview */}
      <section className="px-6 py-24">
        <div className="bg-white rounded-[4rem] p-12 text-black border border-gray-100 overflow-hidden relative max-w-6xl mx-auto group shadow-3xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gray-50 border border-gray-100 uppercase tracking-widest text-[10px] font-black text-[#00BFA6]">
                Report Preview
              </div>
              <h3 className="text-5xl font-black tracking-tighter leading-tight text-black">
                Your Digital <br />
                <span className="text-[#00BFA6]">Metabolic Twin.</span>
              </h3>
              <p className="text-gray-500 font-bold text-lg leading-relaxed">
                See exactly what's happening under your skin. From Ama levels to specific Dosha obstructions, we map your weight journey in high definition.
              </p>
              <div className="space-y-4">
                {["Ama Overload: 64%", "Kapha Dominance: High", "Metabolic Speed: Sub-optimal"].map(t => (
                  <div key={t} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00BFA6]" />
                    <span className="font-black text-gray-900 uppercase tracking-widest text-xs">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-8 shadow-inner">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="96" cy="96" r="90" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-gray-100" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 565 }}
                    whileInView={{ strokeDashoffset: 565 - (565 * 0.78) }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="96" cy="96" r="90" 
                    fill="transparent" 
                    stroke="#00BFA6" 
                    strokeWidth="12" 
                    strokeDasharray="565"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_15px_rgba(0,191,166,0.5)]"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-black">78</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#00BFA6]">Metabolic score</span>
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-rose-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Action Required</p>
                <p className="text-gray-600 text-sm font-bold">Your Ama levels are obstructing lipid breakdown.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quick Tips & FAQs */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Quick Tips */}
          <div className="space-y-10">
            <h3 className="text-3xl font-black tracking-tighter text-stone-950 uppercase">Ancient <span className="text-amber-500">Quick Hacks</span></h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {QUICK_TIPS.map((tip, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    {tip.icon}
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-black text-stone-950 uppercase text-sm tracking-widest">{tip.title}</h5>
                    <p className="text-xs text-stone-500 leading-relaxed font-bold">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-10">
            <h3 className="text-3xl font-black tracking-tighter text-stone-950 uppercase">Common <span className="text-[#A259FF]">Doubts</span></h3>
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "rounded-3xl border overflow-hidden transition-all duration-300",
                    activeFaq === idx ? "bg-white border-[#A259FF] shadow-lg" : "bg-white border-stone-100"
                  )}
                >
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-black text-stone-900 group-hover:text-[#A259FF] transition-colors">{faq.q}</span>
                    <HelpCircle className={cn("w-5 h-5 shrink-0 transition-all", activeFaq === idx ? "text-[#A259FF] rotate-12" : "text-stone-300")} />
                  </button>
                  {activeFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-sm text-stone-600 font-medium leading-relaxed border-t border-stone-50 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Sticky Footer CTA */}
      <div className="fixed bottom-10 left-6 right-6 z-50 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/goal/weight-loss')}
          className="w-full max-w-md h-20 rounded-[2.5rem] bg-stone-950 text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Vibe it Off Now</span>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
        </motion.button>
      </div>
    </div>
  );
}
