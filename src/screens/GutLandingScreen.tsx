import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Utensils, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Brain, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Target,
  ArrowRight,
  Activity,
  AlertCircle,
  Leaf,
  Moon,
  Flame,
  Search
} from 'lucide-react';
const GUT_BLOG = {
  title: "🌿 Ancient Agni, Modern AI: The Secret to a Disease-Free Life",
  intro: "🧬 In Ayurveda, the gut is the 'Mother of All Diseases'. When your internal fire, or 'Agni', is weak, food is not transformed into energy but into 'Ama'—a sticky toxic sludge that blocks your channels and triggers bloating, acidity, and fatigue. Ayurzenix uses advanced AI to decode your unique digestive rhythm and provides a precision roadmap to reignite your Agni and eliminate toxins forever.",
  sections: [
    {
      title: "🔥 Why Your Digestion Is Failing You",
      points: [
        {
          head: "🦠 Accumulation of Ama",
          content: "Undigested food residues (Ama) act as a breeding ground for inflammation, leading to modern lifestyle issues like IBS and acid reflux.",
          isHighlighted: true
        },
        {
          head: "❄️ Snuffed Out Agni",
          content: "Drinking cold water, irregular eating times, and high-stress levels 'cool down' your digestive fire, making weight loss impossible.",
          isHighlighted: false
        },
        {
          head: "🧠 The Brain-Gut Leak",
          content: "Anxiety and mental stress directly freeze your digestive enzymes, leading to the feeling of a 'knot' in your stomach.",
          isHighlighted: false
        },
        {
          head: "🍽️ Incompatible Food Combinations",
          content: "Mixing the wrong foods (like milk and fruit) creates metabolic confusion, causing instant bloating and skin issues.",
          isHighlighted: false
        }
      ]
    },
    {
      title: "⚠️ Warning Signs of a Weak Gut",
      content: "Persistent bloating after meals, a thick white coating on the tongue in the morning, feeling heavy even after a light meal, and irregular bowel movements are critical signals that your Agni needs immediate attention."
    },
    {
      title: "🛡️ The AI-Ayurveda Shield",
      content: "Our AI doesn't just look at what you eat; it looks at HOW you digest. By identifying whether you have Mandagni (slow), Tikshnagni (sharp/acidic), or Vishamagni (irregular), we provide the exact herbal and dietary corrections needed to balance your system."
    }
  ],
  conclusion: "A healthy gut is the foundation of mental clarity, high energy, and a glowing complexion. Don't just treat the symptoms—rebuild your digestive fire from the root."
};

export default function GutLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const colors = {
    primary: "#10B981", // emerald-500
    accent: "#34D399",  // emerald-400
    cta: "#059669",     // emerald-600
    secondary: "#047857", // emerald-700
    bgDark: "#064E3B",  // emerald-900
    bgDeep: "#022C22",  // emerald-950
    bgLight: "#ECFDF5", // emerald-50
    textDark: "#000000",
    textLight: "#ffffff"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-32 selection:text-white" style={{ backgroundColor: colors.bgLight, color: colors.textDark }}>
      <SEO 
        title="Heal Your Gut Naturally – AI Digestive Analysis"
        description="Decode your unique digestive rhythm with AI. Identify Ama (toxins) and reignite your Agni for energy, clarity, and disease-free life with Ayurzenix."
        image="/gut_image.jpg"
      />
      {/* Hero Section */}
      <div className="relative min-h-[70vh] lg:min-h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          src="/gut_image.jpg" 
          alt="Gut Health Analyzer Banner" 
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
        <div className="absolute inset-0" style={{ backgroundColor: `${colors.bgDeep}90` }} />
        
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
            <Flame className="w-4 h-4" style={{ color: colors.accent, fill: colors.accent }} />
            Ignite Your Agni
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
            AI Gut & Digestion <br/>
            <span style={{ color: colors.accent }}>Root Cause Analysis</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Eliminate bloating, acidity, and toxins with a precision diagnostic powered by ancient Ayurvedic wisdom.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/agni-engine-scan')}
              className="px-12 py-5 rounded-full text-white font-black text-lg uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-3"
              style={{ backgroundColor: colors.cta, boxShadow: `0 20px 50px ${colors.cta}4d` }}
            >
              Analyze Your Agni <Search className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 opacity-70">
            <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" style={{ color: colors.accent }} /> 100% Personalised
            </div>
            <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
              <Clock className="w-5 h-5" style={{ color: colors.accent }} /> Instant Report
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
             <Utensils className="w-40 h-40" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic">Your Agni is Weak If:</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Persistent Bloating After Meals",
                "Morning White Coating on Tongue",
                "Frequent Acidity or Heartburn",
                "Irregular Bowel Movements",
                "Skin Breakouts & Acne",
                "Feeling Lethargic After Eating"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-emerald-200 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
              <AlertCircle className="w-6 h-6" /> The Problem
            </h3>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              Most gut issues are treated with antacids or laxatives. <span className="text-emerald-600 font-bold block mt-2">This only hides the fire while toxins (Ama) continue to seep into your bloodstream.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] text-white shadow-xl space-y-6 shadow-emerald-900/20"
            style={{ backgroundColor: colors.cta }}
          >
           <h3 className="text-xl font-black flex items-center gap-3">
              <Sparkles className="w-6 h-6 fill-white" /> AI Root Solution
            </h3>
            <p className="text-lg font-medium leading-relaxed opacity-95">
              Re-ignite your digestive fire in 60 seconds. <span className="block mt-2 font-black text-white underline decoration-4 underline-offset-8 text-2xl" style={{ textDecorationColor: colors.accent }}>Stop Suppressing Symptoms. Start Healing Roots.</span>
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
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{GUT_BLOG.title}</h2>
            <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
          </div>

          <div className="bg-white p-8 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_100px_rgba(0,0,0,0.03)] space-y-16">
            <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-8 pl-8 py-2" style={{ borderColor: colors.primary }}>
              {GUT_BLOG.intro}
            </p>

            {/* How to Use Section */}
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-100/50 border border-gray-200">
                <CheckCircle2 className="w-5 h-5" style={{ color: colors.primary }} />
                <span className="text-xs font-black uppercase tracking-widest text-gray-600">The 60-Second Gut Analysis</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  "Answer questions about your hunger patterns",
                  "Identify your primary food triggers",
                  "Describe your post-meal energy levels",
                  "Share your bowel movement consistency",
                  "AI calculates your Agni type and Ama level",
                  "Get your personalised detox & diet roadmap"
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

            {GUT_BLOG.sections.map((section, idx) => (
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
            <div className="p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }}>
              <Sparkles className="absolute top-10 right-10 w-32 h-32 text-white/5" />
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black italic">Why The Ayurzenix Engine?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black" style={{ color: colors.accent }}>Ama-Detection AI</h4>
                    <p className="text-white/70 font-medium">We identify exactly which systems in your body are being blocked by undigested toxins.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="text-xl font-black" style={{ color: colors.accent }}>Agni Restoration</h4>
                     <p className="text-white/70 font-medium">Move beyond 'healthy eating' to 'efficient digestion' with protocols tailored to your fire type.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="space-y-10">
              <h3 className="text-3xl font-black text-center text-stone-900 leading-tight">Instant Gut Healing Hacks</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { t: "Ginger Water", d: "Kindles digestive fire" },
                  { t: "CCF Tea", d: "Clears internal Ama" },
                  { t: "Sun Gazing", d: "Syncs metabolic rhythm" },
                  { t: "Vajrasana", d: "Post-meal digestion aid" }
                ].map((tip, i) => (
                  <div key={i} className="text-center space-y-2 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-black" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                      <Leaf className="w-6 h-6" />
                    </div>
                    <h5 className="font-black text-gray-900 text-[10px] italic">{tip.t}</h5>
                    <p className="text-[9px] uppercase font-black text-gray-400 tracking-widest leading-tight">{tip.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-10 pt-10 border-t border-gray-100">
              <h3 className="text-3xl font-black text-stone-900 italic">Frequently Asked Questions</h3>
              <div className="space-y-6">
                {[
                  { q: "Can this help with weight loss?", a: "Weight is often just 'Ama' and slow metabolism. By fixing your Agni, weight loss becomes a natural side effect." },
                  { q: "I have IBS. Can this help?", a: "Yes, Ayurveda treats IBS as 'Grahani'—an imbalance of Agni. Our protocols help soothe the intestinal lining." },
                  { q: "Is this a meal plan?", a: "It's much more. It's a protocol that includes timing, food combinations, and herbs to fix how your body processes food." }
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

            <div className="p-12 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden" style={{ backgroundColor: colors.bgDeep }}>
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
               <h4 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 relative z-10">
                 <Flame className="w-10 h-10" style={{ color: colors.accent }} /> 
                 <span>The Final Verdict</span>
               </h4>
               <p className="text-xl font-medium opacity-90 leading-relaxed relative z-10 italic">
                 {GUT_BLOG.conclusion}
               </p>
            </div>
          </div>
        </motion.div>

        {/* Result Preview Score */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-8 bg-stone-950 py-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent" />
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em]">Sample Gut Report</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest italic uppercase">Decode your fire level</p>
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
                <span className="text-64xl font-black text-white" style={{ fontSize: '3.5rem' }}>🔥</span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-1 tracking-widest">Mandagni Type</span>
             </div>
          </div>

          <div className="max-w-sm mx-auto space-y-2 relative z-10">
            <div className="px-6 py-2 bg-emerald-500/20 rounded-full text-xs font-black uppercase tracking-widest inline-block border border-emerald-500/30 text-emerald-400">
              Ama Toxins Detected
            </div>
            <p className="text-white/60 font-bold italic text-sm">"AI identifies critical blockages in the small intestine causing metabolic lag."</p>
          </div>
        </motion.div>

        {/* What You'll Get */}
        <div className="space-y-10">
          <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight italic">What's Inside Your Protocol?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: <Activity className="w-6 h-6" />, title: "Agni Type Diagnostics", desc: "Scientific classification of your metabolic fire." },
              { icon: <TrendingUp className="w-6 h-6" />, title: "Personalised Detox Map", desc: "Step-by-step rituals to clear accumulated toxins." },
              { icon: <Utensils className="w-6 h-6" />, title: "Dosha-Specific Food Guide", desc: "What to eat, when to eat, and how to eat." },
              { icon: <ShieldCheck className="w-6 h-6" />, title: "Acidity-Relief Hacks", desc: "Immediate Ayurvedic fixes for bloating & gas." }
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
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic leading-none">Ready to Reignite <br/><span className="text-emerald-600">Your Digestive Fire?</span></h2>
            <p className="text-xl text-gray-400 font-bold opacity-70 italic tracking-widest">Take the 60-second gut test now.</p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/agni-engine-scan')}
            className="px-16 py-6 rounded-full text-white font-black text-xl uppercase tracking-widest shadow-xl flex items-center gap-4 mx-auto"
            style={{ backgroundColor: colors.cta, boxShadow: `0 30px 70px ${colors.cta}4d` }}
          >
            Start Analysis <Search className="w-8 h-8" />
          </motion.button>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/agni-engine-scan')}
            className="w-full py-5 rounded-full text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
            style={{ backgroundColor: colors.cta, boxShadow: `0 20px 40px ${colors.cta}40` }}
          >
            Master My Metabolism <Flame className="w-5 h-5 fill-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
