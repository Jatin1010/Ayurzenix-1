import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Brain, 
  Clock, 
  Battery, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Target,
  ArrowRight,
  Activity,
  AlertCircle,
  Leaf,
  Utensils,
  Moon
} from 'lucide-react';

const ENERGY_BLOG = {
  title: "⚡ Natural Energy Booster: Build Your Ojas for Infinite Vitality",
  intro: "🔋 True energy isn't found in a cup of coffee; it is the result of high 'Ojas'—the pure essence of your body's vitality. If you suffer from midday crashes, constant morning fatigue, or mental brain fog, your internal battery is leaking energy. Modern lifestyles, constant stress, and poor digestive habits are draining our 'Prana' faster than we can replenish it. Ayurzenix uses AI to decode your fatigue type and rebuild your natural reserves from the root.",
  sections: [
    {
      title: "🚨 Why Your Energy Is Constantly Low",
      points: [
        {
          head: "🧠 Mental Overload",
          content: "Constant digital alerts and work pressure aggravate 'Vata', leading to a scatter-brain feeling and nervous exhaustion.",
          isHighlighted: true
        },
        {
          head: "🍔 Poor Agni (Digestion)",
          content: "When food isn't digested properly, it becomes 'Ama' (toxins). These toxins block your channels, making you feel heavy and lethargic.",
          isHighlighted: false
        },
        {
          head: "💤 Irregular Sleep",
          content: "Ignoring the natural circadian rhythm prevents your body from recharging its 'Ojas' during the night.",
          isHighlighted: false
        },
        {
          head: "🧘 Lack of Prana Flow",
          content: "Shallow breathing and zero movement cause stale energy to accumulate in your body, leading to stiffness and fatigue.",
          isHighlighted: false
        }
      ]
    },
    {
      title: "⚠️ Fatigue Signs You Should Not Ignore",
      content: "Persistent tiredness, irritability over small things, difficulty focusing on a single task, and needing stimulants (caffeine/sugar) just to function are all signals that your Ojas is depleted."
    },
    {
      title: "🌿 The Ayurvedic Secret to Vitality",
      content: "Ayurveda categorizes energy issues into Vata-exhaustion (anxious fatigue) and Kapha-lethargy (heavy sluggishness). By using 'Rasayana' (rejuvenative) herbs like Ashwagandha for Vata and Shilajit for Kapha, we can restore the natural flow of Prana. Correcting your 'Agni' ensures that every bite of food becomes energy instead of waste."
    }
  ],
  conclusion: "Low energy is not a permanent state—it is a correctable imbalance. By identifying your specific energy leakers and using targeted Ayurvedic rituals, you can wake up everyday with a steady, joyful, and infinite supply of vitality."
};

export default function EnergyLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  // Colors matching the "Energy" theme but same style as Heart Health
  const colors = {
    primary: "#F97316", // orange-500
    accent: "#F59E0B",  // amber-500
    cta: "#EA580C",     // orange-600
    secondary: "#10B981", // emerald-500
    bgDark: "#1C1917",  // stone-900
    bgDeep: "#0C0A09",  // stone-950
    bgLight: "#FFF7ED", // orange-50
    textDark: "#000000",
    textLight: "#ffffff"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-32 selection:text-white" style={{ backgroundColor: colors.bgLight, color: colors.textDark }}>
      {/* Hero Section */}
      <div className="relative min-h-[70vh] lg:min-h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          src="/energy_banner.jpg" 
          alt="Energy Booster Banner" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: `${colors.bgDark}80` }} />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-24 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-[60] active:scale-95 transition-all hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 space-y-8 max-w-4xl pt-40 pb-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
            <Sparkles className="w-4 h-4" style={{ color: colors.accent, fill: colors.accent }} />
            Build Your Ojas
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
            Recharge Your Prana <br/>
            <span style={{ color: colors.accent }}>Natural Energy Reserves</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate midday crashes and brain fog with an AI-powered Ayurvedic vitality analysis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/energy-booster')}
              className="px-12 py-5 rounded-full text-white font-black text-lg uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-3"
              style={{ backgroundColor: colors.cta, boxShadow: `0 20px 50px ${colors.cta}4d` }}
            >
              Analyze Your Energy <ArrowRight className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 opacity-70">
            <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" style={{ color: colors.primary }} /> Science + Veda
            </div>
            <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-5 h-5" style={{ color: colors.primary }} /> 60 Sec Result
            </div>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[120%] h-48 rounded-[100%] blur-xl opacity-50" style={{ backgroundColor: colors.bgLight }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-30 space-y-16 pb-20">
        
        {/* Risk Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <Battery className="w-40 h-40" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic">Your Battery is Leaking If:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Unstoppable Afternoon Slumps",
                "Brain Fog & Lack of Clarity",
                "Waking Up Tired Even After Sleep",
                "Constant Need for Caffeine",
                "Feeling Easily Irritated",
                "Low Physical Staminia for Daily Tasks"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-orange-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  </div>
                  <span className="text-sm font-bold text-gray-700 tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Problem & Solution Grid */}
        <div className="grid md:grid-cols-2 gap-8">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
          >
            <h3 className="text-xl font-black text-stone-600 flex items-center gap-3">
              <Brain className="w-6 h-6" /> The Problem
            </h3>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Most people use caffeine or sugar to mask fatigue. <span className="text-orange-500 font-bold block mt-2">This creates a crash cycle that eventually burns out your nervous system.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] text-white shadow-xl space-y-6 shadow-orange-900/20"
            style={{ backgroundColor: colors.primary }}
          >
            <h3 className="text-xl font-black flex items-center gap-3">
              <Zap className="w-6 h-6 fill-white" /> Sustainable Prana
            </h3>
            <p className="text-lg font-medium leading-relaxed opacity-95">
              Rebuild your natural Ojas in 60 seconds. <span className="block mt-2 font-black text-white underline decoration-4 underline-offset-8 text-2xl" style={{ textDecorationColor: colors.accent }}>No Artificial Spikes. Just Pure Vitality.</span>
            </p>
          </motion.div>
        </div>

        {/* Blog Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{ENERGY_BLOG.title}</h2>
            <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>

          <div className="bg-white p-8 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_100px_rgba(0,0,0,0.03)] space-y-16">
            <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-8 pl-8 py-2" style={{ borderColor: colors.primary }}>
              {ENERGY_BLOG.intro}
            </p>

            {/* How to Use Section */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-100/50 border border-gray-200">
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">The 60-Second Vitality Analysis</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  "Log your current energy fluctuations",
                  "Share your sleep habits & screen time",
                  "Describe your digestion (Agni Status)",
                  "Identify emotional energy leakers",
                  "AI decodes your fatigue type (Vata/Kapha)",
                  "Receive your personalized Ojas Roadmap"
                ].map((step, i) => (
                  <div key={i} className="space-y-3 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-50 hover:border-gray-200 transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white" style={{ backgroundColor: colors.primary }}>
                      {i + 1}
                    </div>
                    <p className="font-bold text-gray-700 leading-tight">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {ENERGY_BLOG.sections.map((section, idx) => (
              <div key={idx} className="space-y-8">
                <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: colors.accent }} />
                  {section.title}
                </h3>
                
                {section.points ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.points.map((point, pIdx) => (
                      <div 
                        key={pIdx} 
                        className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-xl ${point.isHighlighted ? 'border-l-[12px]' : 'border-gray-50 bg-gray-50/30'}`}
                        style={point.isHighlighted ? { borderColor: colors.primary, backgroundColor: `${colors.primary}05` } : {}}
                      >
                        <h4 className="text-xl font-black text-gray-900 mb-3" style={{ color: point.isHighlighted ? colors.primary : colors.textDark }}>
                          {point.head}
                        </h4>
                        <p className="text-sm font-medium text-gray-500 leading-relaxed">
                          {point.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 italic font-bold text-gray-600 text-lg leading-relaxed">
                    {section.content}
                  </div>
                )}
              </div>
            ))}

            {/* Unique Section */}
            <div className="bg-stone-900 p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden">
              <Sparkles className="absolute top-10 right-10 w-32 h-32 text-white/5" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black italic">Why This Analyzer is Different?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black" style={{ color: colors.accent }}>Dosha-Timed Energy</h4>
                    <p className="text-white/70 font-medium">We map your energy against the natural Dosha hours—teaching you when your Prana is naturally highest.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-black" style={{ color: colors.accent }}>Deep Ojas Restoration</h4>
                     <p className="text-white/70 font-medium">Unlike stimulants that deplete you further, we offer protocols that build your core life force from within.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="space-y-10">
              <h3 className="text-3xl font-black text-center text-stone-900 leading-tight">Instant Vitality Quick Tips</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { t: "Ashwagandha", d: "Repairs nervous system" },
                  { t: "Kapalabhati", d: "Flushes mental toxins" },
                  { t: "Shilajit Resin", d: "Deep tissue nutrition" },
                  { t: "Morning Sun", d: "Syncs internal clock" }
                ].map((tip, i) => (
                  <div key={i} className="text-center space-y-2 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-black" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      <Zap className="w-6 h-6" />
                    </div>
                    <h5 className="font-black text-gray-900 text-sm italic">{tip.t}</h5>
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{tip.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-10 pt-10 border-t border-gray-100">
              <h3 className="text-3xl font-black text-stone-900 italic">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {[
                  { q: "Is this better than coffee?", a: "Coffee gives you a high by 'borrowing' from your future energy. Ayurveda helps you 'grow' your own energy so you don't need a loan." },
                  { q: "How soon can I feel the difference?", a: "While deep Ojas restoration takes time, simple breathing and dietary shifts can clear brain fog in as little as 3-5 days." },
                  { q: "Can I do this with a busy job?", a: "Yes, our protocols are designed for busy professionals. Most rituals take less than 10 minutes." }
                ].map((faq, i) => (
                  <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 space-y-3">
                    <h4 className="text-lg font-black text-gray-900 flex gap-4">
                      <span style={{ color: colors.primary }}>Q.</span> {faq.q}
                    </h4>
                    <p className="text-gray-600 font-medium leading-relaxed pl-10">
                      <span className="font-bold text-gray-400">Ans:</span> {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-12 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }}>
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
               <h4 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 relative z-10">
                 <Zap className="w-10 h-10" style={{ color: colors.accent }} /> 
                 <span>The Vitality Verdict</span>
               </h4>
               <p className="text-xl font-medium opacity-90 leading-relaxed relative z-10 italic">
                 {ENERGY_BLOG.conclusion}
               </p>
            </div>
          </div>
        </motion.div>

        {/* Result Preview Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8 bg-black py-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Sample Vitality Report</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest italic uppercase">Decode your depletion level</p>
          </div>

          <div className="relative inline-block z-10">
             {/* Pulse Animation */}
             <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: colors.accent }}
             />
             <div className="relative w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center bg-stone-900 shadow-inner" style={{ borderColor: `${colors.primary}30` }}>
                <span className="text-64xl font-black text-white" style={{ fontSize: '3.5rem' }}>42%</span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-1 tracking-widest">Energy Index</span>
             </div>
          </div>

          <div className="max-w-sm mx-auto space-y-2 relative z-10">
            <div className="px-6 py-2 bg-orange-500/20 rounded-full text-xs font-black uppercase tracking-widest inline-block border border-orange-500/30 text-orange-400">
              Low Ojas Detected
            </div>
            <p className="text-white/60 font-bold italic text-sm">"AI suggests nervous exhaustion due to late-night Vata disturbance."</p>
          </div>
        </motion.div>

        {/* What You'll Get */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight italic">What's Inside Your Protocol?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Battery className="w-6 h-6" />, title: "Personalized Energy Score", desc: "Scientific assessment of your current vitality reserves." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Fatigue Root Triggers", desc: "Identification of the habits leaking your Prana." },
              { icon: <Zap className="w-6 h-6" />, title: "Instant Boost Rituals", desc: "5-minute methods to clear brain fog anytime." },
              { icon: <Leaf className="w-6 h-6" />, title: "Herbal Ojas Support", desc: "Specific Rasayana herbs for your fatigue type." }
            ].map((feature, i) => (
              <div key={i} className="flex gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all border-l-[6px]" style={{ borderLeftColor: colors.primary }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-gray-900 uppercase tracking-tighter italic text-sm">{feature.title}</h4>
                  <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tighter opacity-80">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA Area */}
        <div className="text-center space-y-10 py-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">Ready to Reclaim <br/><span className="text-orange-500">Your Infinite Life Force?</span></h2>
            <p className="text-xl text-gray-400 font-bold opacity-70 italic tracking-widest">Take the 60-second vitality test now.</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/energy-booster')}
            className="px-16 py-6 rounded-full text-white font-black text-xl uppercase tracking-widest shadow-xl flex items-center gap-4 mx-auto"
            style={{ backgroundColor: colors.cta, boxShadow: `0 30px 70px ${colors.cta}4d` }}
          >
            Start Analysis <ArrowRight className="w-8 h-8" />
          </motion.button>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/energy-booster')}
            className="w-full py-5 rounded-full text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
            style={{ backgroundColor: colors.primary, boxShadow: `0 20px 40px ${colors.primary}40` }}
          >
            Boost My Energy <Zap className="w-5 h-5 fill-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

