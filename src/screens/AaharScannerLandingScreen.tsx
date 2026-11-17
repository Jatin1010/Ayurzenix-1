import { useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Activity,
  AlertCircle,
  Zap,
  Camera,
  Utensils,
  Leaf,
  Info,
  Scale,
  Brain,
  Search
} from 'lucide-react';

const AAHAR_BLOG = {
  title: "🌿 Ancient Food Wisdom Meets AI Vision: The Aahar Revolution",
  intro: "🧬 Most of us eat what tastes good, but does your body truly accept it? Ayurveda teaches that 'Aahar' (Diet) is the first pillar of life. However, one person's nectar can be another's poison. The Ayurzenix Aahar Vision Scanner uses advanced computer vision to decode the elemental qualities of your meal, matching it against your unique Prakriti (Dosha) to ensure perfect compatibility.",
  sections: [
    {
      title: "Real-Time Food Intelligence",
      points: [
        { head: "Instant Dish Recognition", text: "AI identifies your meal components and their Ayurvedic properties in seconds.", icon: <Search className="w-6 h-6" /> },
        { head: "Compatibility Scoring", text: "Get a real-time percentage score of how suitable this meal is for your Dosha.", icon: <Activity className="w-6 h-6" /> }
      ]
    },
    {
      title: "Smart Corrections",
      points: [
        { head: "Dosha Neutralization", text: "AI suggests simple additions like Ghee or Cumin to balance a harmful meal.", icon: <Leaf className="w-6 h-6" />, isHighlighted: true },
        { head: "Digestive Fire Optimization", text: "Understand if the meal will strengthen your Agni or create Ama (toxins).", icon: <Zap className="w-6 h-6" /> }
      ]
    }
  ]
};

const FAQS = [
  { q: "How do I use the Aahar Scanner?", a: "Simply point your camera at your food plate or upload a photo. The AI will analyze the dish and provide instant feedback." },
  { q: "Does it work for all cuisines?", a: "Yes, our AI is trained on global food databases with a deep layer of Ayurvedic logic for multi-cuisine dishes." },
  { q: "What if I don't know my Prakriti?", a: "You can still use it! The scanner will provide general healthy eating advice. We recommend completing the AI Body Scan first for personalized results." }
];

export default function AaharScannerLandingScreen() {
  const navigate = useNavigate();

  const colors = {
    primary: "#059669", // Emerald Green
    secondary: "#10B981", 
    accent: "#F59E0B", // Amber
    bgLight: "#F0FDF4", 
    heading: "#000000", 
    body: "#111827",    
    bodyLight: "#1f2937" 
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: colors.bgLight }}>
      
      {/* 1. Hero Section */}
      <div className="relative h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=2000" 
          alt="Aahar Scanner Banner" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[1px]" />
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-[60] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 space-y-8 max-w-4xl pt-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
            <Sparkles className="w-4 h-4" style={{ color: colors.secondary }} />
            AI-Powered Dish Compatibility
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Aahar <br/>
            <span style={{ color: colors.secondary }} className="italic">Vision Scanner</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Is your lunch compatible with your Dosha? Scan your plate and find out the Ayurvedic truth in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Clock className="w-5 h-5 text-amber-400" />
              <span className="text-white text-xs font-black uppercase tracking-widest">Instant Results</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Camera className="w-5 h-5 text-blue-400" />
              <span className="text-white text-xs font-black uppercase tracking-widest">Vision powered</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. Features Card */}
      <div className="px-6 -mt-20 relative z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-emerald-50"
        >
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                <Utensils className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight" style={{ color: colors.heading }}>How Aahar Vision Works</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Smart Dish Recognition",
                "Personalized Dosha Score",
                "Ingredient Quality Check",
                "Digestive Fire (Agni) Impact",
                "Balancing Tips (Corrections)",
                "Daily Food Log Integration"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#10B981] transition-all">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 bg-emerald-600">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight text-gray-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* 3. Problem vs Solution */}
      <div className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="p-10 rounded-[3rem] bg-stone-100/50 border border-stone-200">
            <AlertCircle className="w-12 h-12 text-stone-400 mb-6" />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.heading }}>Random Eating</h3>
            <p className="text-lg font-bold leading-relaxed opacity-70" style={{ color: colors.body }}>
               Eating food that aggravates your Dosha leads to bloating, low energy, and internal toxicity (Ama).
            </p>
         </div>
         <div className="p-10 rounded-[3rem] border border-emerald-100 bg-emerald-50/20">
            <Leaf className="w-12 h-12 text-emerald-600 mb-6" />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.primary }}>Aahar Intelligence</h3>
            <p className="text-lg font-bold leading-relaxed text-gray-800">
               Know exactly which foods support your metabolism and receive instant AI tips to neutralize harmful effects.
            </p>
         </div>
      </div>

      {/* 4. Blog Style Insight */}
      <div className="px-6 max-w-5xl mx-auto space-y-16 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight" style={{ color: colors.heading }}>
            {AAHAR_BLOG.title}
          </h2>
          <div className="w-32 h-2 mx-auto rounded-full bg-emerald-600" />
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-16">
          <p className="text-2xl font-medium leading-relaxed italic border-l-8 border-emerald-600 pl-8 py-2 text-gray-700">
            {AAHAR_BLOG.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {AAHAR_BLOG.sections.map((section, idx) => (
              <div key={idx} className="space-y-10">
                <h3 className="text-3xl font-black flex items-center gap-6 text-gray-900">
                  <div className="w-2 h-12 rounded-full bg-amber-500" />
                  {section.title}
                </h3>
                
                <div className="space-y-8">
                  {section.points.map((point, pIdx) => (
                    <div 
                      key={pIdx} 
                      className={`p-10 rounded-[3rem] border transition-all duration-500 hover:shadow-xl ${point.isHighlighted ? 'border-l-[12px] border-emerald-600 bg-emerald-50/20' : 'bg-gray-50/50 border-gray-100'}`}
                    >
                      <h4 className="text-2xl font-black mb-4 text-gray-900">
                        {point.head}
                      </h4>
                      <p className="text-lg font-bold leading-relaxed text-gray-600">
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

      {/* 5. Sample Preview */}
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-black py-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent" />
          <div className="space-y-4 relative z-10 mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Compatibility Result</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest uppercase">Aahar Vision Scan</p>
          </div>

          <div className="relative w-56 h-56 mx-auto mb-12 flex items-center justify-center">
             <div className="relative w-56 h-56 rounded-full border-[12px] border-emerald-600/30 flex flex-col items-center justify-center bg-stone-900 shadow-2xl">
                <span className="text-7xl font-black text-white">92<span className="text-3xl text-amber-500">%</span></span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-2 tracking-widest">Compatibility</span>
             </div>
          </div>

          <div className="max-w-md mx-auto space-y-4 relative z-10 px-8">
            <div className="inline-block px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-600/40 bg-emerald-600/20 text-emerald-400">
              Balanced for Vata-Pitta
            </div>
            <p className="text-white/70 font-bold text-lg leading-relaxed italic">
              "AI has detected Fresh Salad & Dal. Perfect for your cooling needs. Add a touch of black pepper to support Vata digestion."
            </p>
          </div>
        </motion.div>
      </div>

      {/* 6. FAQs */}
      <div className="py-24 px-6 max-w-5xl mx-auto space-y-12">
        <h3 className="text-4xl font-black text-center text-gray-900">Common Questions</h3>
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 space-y-4">
              <h4 className="text-xl font-black flex gap-4 text-gray-900">
                  <span className="text-emerald-600">Q.</span> {faq.q}
              </h4>
              <p className="text-lg font-bold leading-relaxed pl-10 text-gray-600">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Sticky Footer CTA */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[100]">
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/aahar-scanner')}
          className="max-w-md mx-auto w-full py-6 rounded-full shadow-2xl flex items-center justify-center gap-4 text-white font-black text-lg uppercase tracking-[0.2em] backdrop-blur-xl transition-all bg-emerald-600"
        >
          <div className="flex items-center gap-4">
            <Zap className="w-6 h-6 fill-white" />
            Launch Scanner
            <ChevronRight className="w-6 h-6" />
          </div>
        </motion.button>
      </div>

    </div>
  );
}
