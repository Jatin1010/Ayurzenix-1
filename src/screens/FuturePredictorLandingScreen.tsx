import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Zap,
  Target,
  ShieldAlert,
  Dna,
  Search,
  MessageCircle,
  HelpCircle,
  Activity,
  Heart
} from 'lucide-react';

const PREDICTOR_BLOG = {
  title: "🔮 Vedic Time-Travel: How AI Predicts Your Health Future 10 Years Ahead",
  intro: "🧬 Life isn't a series of random events; it's a sequence of biological patterns. Ancient Ayurveda calls this 'Pragya-paradh' — the mistake of the intellect. When we ignore subtle markers, we invite future diseases. Ayurzenix uses predictive AI to analyze your 'Srotas' (channels of flow) and metabolic momentum. By combining 5,000 years of clinical observation with longitudinal deep learning, we reveal the health risks hiding in your future so you can rewrite your destiny today.",
  sections: [
    {
      title: "The Longevity Blueprint",
      points: [
        { head: "Epigenetic Momentum", text: "Analyze how your current lifestyle is talking to your genes for long-term vitality.", icon: <Dna className="w-6 h-6" /> },
        { head: "Risk Signal Mapping", text: "Detect the 'hidden sparks' of Vata, Pitta, and Kapha that could ignite into future chronic issues.", icon: <ShieldAlert className="w-6 h-6" /> }
      ]
    },
    {
      title: "Predictive Prevention",
      points: [
        { head: "Disease Path Timeline", text: "AI projects your health trajectory over next 5-10 years based on current bio-markers.", icon: <Activity className="w-6 h-6" />, isHighlighted: true },
        { head: "Corrective Vedic Shift", text: "Receive a personalized protocol designed to steer you away from predicted risks.", icon: <Zap className="w-6 h-6" /> }
      ]
    }
  ]
};

const FAQS = [
  { q: "Is this a fortune-telling tool?", a: "No. This is a scientific biological projection based on your current health markers, metabolic rate, and hereditary Ayurvedic patterns." },
  { q: "Can I actually change the predicted outcome?", a: "Absolutely. The goal of the health predictor is to identify risks early enough so that dietary and lifestyle shifts can 'soften' or eliminate the predicted imbalance." },
  { q: "How much data do I need to provide?", a: "The more the better. The AI performs best when you provide symptoms, lifestyle habits, and if possible, existing lab report markers." }
];

export default function FuturePredictorLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const colors = {
    primary: "#00BFA6", 
    accent: "#FFB400", 
    cta: "#FF6B6B", 
    secondary: "#A259FF", 
    bgLight: "#F7FCF9", 
    bgDeep: "#040F49",
    heading: "#000000", // Black Shiny
    body: "#111827",    // Gray-700
    bodyLight: "#1f2937" // Gray-600
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.bgLight }}>
      
      {/* 1. Hero Section (Parallax + DNA) */}
      <div className="relative h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&q=80&w=2000" 
          alt="Future Health Predictor" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-[1px]" />
        
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
            <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
            Predictive Vedic Intelligence
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Your Health <br/>
            <span style={{ color: colors.primary }} className="italic">10 Years Ahead</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            What will your vitality look like in 2035? Our AI analyzes subtle metabolic signals to forecast your future wellness today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Clock className="w-5 h-5" style={{ color: colors.accent }} />
              <span className="text-white text-xs font-black uppercase tracking-widest">Scientific Longevity Mapping</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. The "Symptom Checker" Card (6 Critical Risks) */}
      <div className="px-6 -mt-24 relative z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-teal-50"
        >
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                <TrendingUp className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.heading }}>Future Risks AI Foresees</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                "Metabolic Rate Decay (Aging Factor)",
                "Chronic Inflammation Trajectory",
                "Dosha Degeneration Projections",
                "Cardio-Vascular Resilience Index",
                "Cognitive Function Momentum",
                "Vedic Longevity (Ojas) Vitality"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#00BFA6] transition-all">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ backgroundColor: colors.primary }}>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-tight" style={{ color: colors.body }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Problem vs Solution */}
      <div className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-12 rounded-[3.5rem] bg-stone-100/60 border border-stone-200">
            <Search className="w-12 h-12 text-stone-400 mb-8" />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.heading }}>Reactive Health</h3>
            <p className="text-lg font-bold leading-relaxed opacity-60" style={{ color: colors.body }}>
               Waiting for symptoms to appear before seeking help. By the time you notice, the imbalance has already manifested.
            </p>
         </div>
         <div className="p-12 rounded-[3.5rem] border border-teal-100" style={{ backgroundColor: `${colors.primary}08` }}>
            <Sparkles className="w-12 h-12 mb-8" style={{ color: colors.primary }} />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.primary }}>Proactive Prediction</h3>
            <p className="text-lg font-bold leading-relaxed" style={{ color: colors.body }}>
               AI-driven forecasting that detects subtle biological shifts years in advance, allowing you to intervene and heal early.
            </p>
         </div>
      </div>

      {/* 4. Deep Insight Blog */}
      <div className="px-6 max-w-5xl mx-auto space-y-16 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight" style={{ color: colors.heading }}>
            {PREDICTOR_BLOG.title}
          </h2>
          <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
        </div>

        <div className="bg-white p-10 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-20">
          <p className="text-2xl font-medium leading-relaxed italic border-l-8 pl-8 py-3" style={{ color: colors.bodyLight, borderColor: colors.primary }}>
            {PREDICTOR_BLOG.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {PREDICTOR_BLOG.sections.map((section, idx) => (
              <div key={idx} className="space-y-12">
                <h3 className="text-4xl font-black flex items-center gap-6" style={{ color: colors.heading }}>
                  <div className="w-2 h-12 rounded-full" style={{ backgroundColor: colors.secondary }} />
                  {section.title}
                </h3>
                
                <div className="space-y-8">
                  {section.points.map((point, pIdx) => (
                    <div 
                      key={pIdx} 
                      className={`p-10 rounded-[3rem] border transition-all duration-500 hover:shadow-xl ${point.isHighlighted ? 'border-l-[12px]' : 'bg-gray-50/50'}`}
                      style={point.isHighlighted ? { borderColor: colors.primary, backgroundColor: `${colors.primary}05` } : { borderColor: '#f3f4f6' }}
                    >
                      <h4 className="text-2xl font-black mb-4" style={{ color: point.isHighlighted ? colors.primary : colors.heading }}>
                        {point.head}
                      </h4>
                      <p className="text-lg font-bold leading-relaxed" style={{ color: colors.bodyLight }}>
                        {point.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Sample Report Preview */}
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#040F49] py-24 rounded-[4.5rem] text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${colors.primary}30, transparent)` }} />
          <div className="space-y-4 relative z-10 mb-16">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.4em]">Prophetic Health Index</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest uppercase italic">AI Simulation: Year 2030 Range</p>
          </div>

          <div className="relative w-64 h-64 mx-auto mb-16 flex items-center justify-center">
             <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: colors.primary }}
             />
             <div className="relative w-64 h-64 rounded-full border-[15px] flex flex-col items-center justify-center bg-[#06155a] shadow-2xl" style={{ borderColor: `${colors.primary}40` }}>
                <span className="text-8xl font-black text-white">92<span className="text-4xl" style={{ color: colors.accent }}>%</span></span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-2 tracking-[0.3em]">Destiny Accuracy</span>
             </div>
          </div>

          <div className="max-w-lg mx-auto space-y-6 relative z-10 px-8">
            <div className="inline-block px-10 py-3 rounded-full text-xs font-black uppercase tracking-widest border" style={{ backgroundColor: `${colors.accent}20`, borderColor: `${colors.accent}50`, color: colors.accent }}>
              Future Risk Detected: Joint Heat
            </div>
            <p className="text-white/80 font-bold text-xl leading-relaxed italic px-6 border-x border-white/5">
              "AI identifies a 65% probability of Pitta-aggravated joint issues by age 45. Strategic introduction of Boswellia and cooling pranayama required for prevention."
            </p>
          </div>
        </motion.div>
      </div>

      {/* 6. Quick Tips & FAQs */}
      <div className="py-24 px-6 max-w-5xl mx-auto space-y-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Target className="w-8 h-8" />, t: "Accuracy AI" },
            { icon: <Heart className="w-8 h-8" />, t: "Vedic Heart" },
            { icon: <MessageCircle className="w-8 h-8" />, t: "Future Chat" },
            { icon: <HelpCircle className="w-8 h-8" />, t: "24/7 Expert" }
          ].map((tip, i) => (
            <div key={i} className="flex flex-col items-center gap-5 text-center group">
              <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-xl transition-all shadow-sm" style={{ color: colors.primary }}>
                {tip.icon}
              </div>
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: colors.heading }}>{tip.t}</span>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <h3 className="text-5xl font-black text-center" style={{ color: colors.heading }}>Longevity Insights</h3>
          <div className="space-y-8">
            {FAQS.map((faq, i) => (
              <div key={i} className="p-12 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-5">
                <h4 className="text-2xl font-black flex gap-6" style={{ color: colors.heading }}>
                   <span style={{ color: colors.primary }} className="text-3xl">Q.</span> {faq.q}
                </h4>
                <p className="text-xl font-bold leading-relaxed pl-12" style={{ color: colors.bodyLight }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Sticky Footer CTA */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[100]">
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/future-health')}
          className="max-w-lg mx-auto w-full py-7 rounded-full shadow-[0_20px_50px_rgba(255,107,107,0.3)] flex items-center justify-center gap-5 text-white font-black text-xl uppercase tracking-[0.3em] backdrop-blur-3xl transition-all"
          style={{ backgroundColor: colors.cta }}
        >
          <Zap className="w-7 h-7 fill-white" />
          Predict Future Now
          <ChevronRight className="w-7 h-7" />
        </motion.button>
      </div>

    </div>
  );
}
