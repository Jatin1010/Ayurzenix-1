import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
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
  AlertCircle, 
  Zap,
  Activity,
  Droplets,
  Filter,
  Flame,
  Shield
} from 'lucide-react';

const LIVER_BLOG = {
  title: "🌿 Ancient Pitta Secrets + AI: How to Reset Your Liver for Maximum Longevity",
  intro: "🧬 Often called the 'General' of the body in ancient texts, your liver (Yakrit) is responsible for over 500 vital functions. When your internal heat—Pitta—becomes aggravated, it 'cooks' the liver, leading to toxin buildup (Ama). Modern processed diets and stress are overwhelming this master filter. Ayurzenix uses AI to detect subtle Pitta imbalances and provides a cooling, detoxifying roadmap to restore your liver's regenerative power.",
  sections: [
    {
      title: "🔥 Why Your Internal Filter Is Overheating",
      points: [
        {
          head: "🍔 Metabolic Sludge (Ama)",
          content: "High-fat diets and chemicals create a sticky residue that slows down hepatic bile flow, leading to sluggishness and weight gain.",
          isHighlighted: true
        },
        {
          head: "😡 Emotional Heat",
          content: "In Ayurveda, suppressed anger and frustration directly impact Liver health, causing 'Pitta' to flare and inflame tissues.",
          isHighlighted: false
        },
        {
          head: "🍺 Synthetic Load",
          content: "Over-reliance on pills and environmental pollutants forces the liver to work overtime, leading to premature aging of cells.",
          isHighlighted: false
        }
      ]
    },
    {
      title: "⚠️ Liver Warning Signs You Must Not Ignore",
      content: "Chronic fatigue that doesn't go away with sleep, skin issues like acne or itchiness, a bitter taste in the mouth, and yellowish tint in the eyes are all urgent signals that your liver is crying for a reset."
    }
  ]
};

export default function LiverLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const colors = {
    primary: "#00BFA6",
    accent: "#FFB400",
    cta: "#FF6B6B",
    secondary: "#A259FF",
    bgLight: "#F0FFFC", 
    heading: "#000000",
    body: "#222222",
    bodyLight: "#444444"
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-32 selection:text-white" style={{ backgroundColor: colors.bgLight }}>
      
      {/* 1. Hero Section (Parallax + DNA) */}
      <div className="relative h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="/liver_banner.jpg" 
          alt="Liver Health Banner" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[2px]" />
        
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
            <Filter className="w-4 h-4" style={{ color: colors.primary }} />
            The Master Filter Reset
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-2xl">
            Revitalize Your <br/>
            <span style={{ color: colors.accent }} className="italic">Yakrit (Liver)</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            AI-powered Pitta diagnostics to detoxify your blood and restore metabolic fire in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Clock className="w-5 h-5" style={{ color: colors.primary }} />
              <span className="text-white text-xs font-black uppercase tracking-widest">60s Result Promise</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Symptom Checker Card */}
      <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-10 md:p-14 rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-white"
        >
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight italic" style={{ color: colors.heading }}>6 Signs Your Liver Is Stressed</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Persistent Afternoon Fatigue",
                "Morning Bitter Taste in Mouth",
                "Skin Itchiness or Sudden Acne",
                "Difficulty Digesting Fatty Foods",
                "Yellowish Eyes or Pale Skin",
                "Unusual Abdominal Bloating"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#00BFA6] transition-all">
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

      {/* 3. Problem vs Solution Grid */}
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-8">
           <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
          >
            <h3 className="text-xl font-black text-gray-400 flex items-center gap-3">
              <Activity className="w-6 h-6" /> The Blind Path
            </h3>
            <p className="text-xl font-bold leading-relaxed" style={{ color: colors.bodyLight }}>
              Ignoring liver fatigue leads to <span className="text-red-500">chronic toxicity</span> and metabolic burnout. Standard detox teas often ignore your specific Pitta type.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-[2.5rem] text-white shadow-[0_20px_50px_rgba(5,150,105,0.3)] space-y-6"
            style={{ backgroundColor: colors.cta }}
          >
            <h3 className="text-xl font-black flex items-center gap-3">
              <Sparkles className="w-6 h-6 fill-white" /> AI Precision
            </h3>
            <p className="text-xl font-bold leading-relaxed opacity-95">
              Identify the root of liver heat. <span className="block mt-2 font-black text-white underline decoration-4 underline-offset-8 text-2xl">Re-Balance Your Blood and Reset Your Energy Flow.</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* 4. Deep Insight Blog */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight" style={{ color: colors.heading }}>
            {LIVER_BLOG.title}
          </h2>
          <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-16">
          <p className="text-2xl font-medium leading-relaxed italic border-l-8 pl-8 py-2" style={{ color: colors.bodyLight, borderColor: colors.primary }}>
            {LIVER_BLOG.intro}
          </p>

          {LIVER_BLOG.sections.map((section, idx) => (
            <div key={idx} className="space-y-10">
              <h3 className="text-4xl font-black flex items-center gap-6" style={{ color: colors.heading }}>
                <div className="w-2 h-12 rounded-full" style={{ backgroundColor: colors.accent }} />
                {section.title}
              </h3>
              
              {section.points ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                        {point.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-[3rem] bg-gray-50 border border-gray-100 font-bold text-2xl leading-relaxed text-gray-700">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sample Report Preview (Dark Theme) */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-stone-950 py-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent" style={{ backgroundImage: `linear-gradient(to top, ${colors.primary}20, transparent)` }} />
          <div className="space-y-4 relative z-10 mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Liver Health Index</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest uppercase">Proprietary AI Assessment</p>
          </div>

          <div className="relative inline-block z-10 mb-10">
             <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: colors.accent }}
             />
             <div className="relative w-56 h-56 rounded-full border-[12px] flex flex-col items-center justify-center bg-stone-900 shadow-2xl" style={{ borderColor: `${colors.primary}30` }}>
                <span className="text-7xl font-black text-white">68<span className="text-3xl" style={{ color: colors.accent }}>%</span></span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-2 tracking-widest">Congestion Level</span>
             </div>
          </div>

          <div className="max-w-md mx-auto space-y-4 relative z-10 px-8">
            <div className="inline-block px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}40`, color: colors.primary }}>
              Pitta Imbalance Detected
            </div>
            <p className="text-white/70 font-bold text-lg leading-relaxed italic">
              "Your liver is showing early signs of thermal stress. AI recommends a 7-day Bhumyamalaki detox protocol."
            </p>
          </div>
        </motion.div>
      </div>

      {/* 6. Quick Tips & FAQs */}
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Droplets />, title: "Aloe Vera Juice", desc: "Cools Pitta Heat" },
            { icon: <Shield />, title: "Milk Thistle", desc: "Tissue Repair" },
            { icon: <Flame />, title: "Agni Deepana", desc: "Metabolism Boost" },
            { icon: <ShieldCheck />, title: "Early Sleep", desc: "Nocturnal Repair" }
          ].map((tip, i) => (
            <div key={i} className="text-center p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.bgLight}`, color: colors.primary }}>
                {tip.icon}
              </div>
              <h5 className="font-black text-lg italic mb-1" style={{ color: colors.heading }}>{tip.title}</h5>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{tip.desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-10">
          <h3 className="text-4xl font-black italic text-center" style={{ color: colors.heading }}>Questions We Answer</h3>
          <div className="grid gap-6">
            {[
              { q: "Is this test medical?", a: "This is an Ayurvedic wellness assessment based on traditional Pitta-Kapha principles and not a medical diagnosis." },
              { q: "Can I use it if I don't drink?", a: "Yes. Non-alcoholic fatty liver issues are rising due to high-sugar diets and poor lifestyle habits." },
              { q: "What will the report include?", a: "A detailed Ojas/Pitta index, specific herbal recommendations, and a 14-day liver-reset dietary protocol." }
            ].map((faq, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 space-y-4">
                <h4 className="text-xl font-black flex gap-4" style={{ color: colors.heading }}>
                   <span style={{ color: colors.primary }}>Q.</span> {faq.q}
                </h4>
                <p className="text-lg font-bold leading-relaxed pl-10" style={{ color: colors.bodyLight }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Sticky Footer CTA (DNA Verified) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-white/20 backdrop-blur-xl border-t border-white/20">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/liver-health')}
            className="w-full py-6 rounded-full text-white font-black text-lg uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 relative overflow-hidden group"
            style={{ backgroundColor: colors.cta }}
          >
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative z-10">Start Liver Analysis</span>
            <Zap className="w-6 h-6 fill-white relative z-10" />
          </motion.button>
        </div>
      </div>

    </div>
  );
}
