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
  Moon,
  Sun,
  Coffee,
  Heart,
  MessageCircle,
  HelpCircle,
  ClipboardList
} from 'lucide-react';

const ROUTINE_BLOG = {
  title: "🧘 Ancient Rhythm, AI Precision: The Secret to Boundless Energy",
  intro: "🧬 In the Vedic texts, 'Dinacharya' (Daily Routine) is the ultimate medicine. Health is not a destination but a daily practice of aligning your internal biological clock with the cosmic rhythms of the sun and moon. When this alignment breaks, 'Ama' (metabolic waste) accumulates, leading to persistent fatigue, poor digestion, and mental fog. Ayurzenix uses advanced AI to synchronize your unique Dosha profile with personalized daily targets, ensuring every hour works for your longevity.",
  sections: [
    {
      title: "The Ayurvedic Foundation",
      points: [
        { head: "Brahma Muhurta Alignment", text: "Optimize your morning routine during the 'Amrit' hours for peak mental clarity.", icon: <Sun className="w-6 h-6" /> },
        { head: "Agni Synchronization", text: "Align your meal timings with your digestive fire's natural solar peaks.", icon: <Zap className="w-6 h-6" /> }
      ]
    },
    {
      title: "AI Lifestyle Engineering",
      points: [
        { head: "Circadian Mapping", text: "AI predicts your energy dips and peaks to schedule high-focus tasks accurately.", icon: <Activity className="w-6 h-6" />, isHighlighted: true },
        { head: "Habit Stacking", text: "Vedic-backed micro-habits that integrate seamlessly into your modern workday.", icon: <ClipboardList className="w-6 h-6" /> }
      ]
    }
  ]
};

const FAQS = [
  { q: "Do I need to wake up at 4 AM?", a: "While 'Brahma Muhurta' is ideal, Ayurzenix adapts the principles to your current lifestyle, gradually moving you towards a healthier cycle without overwhelming you." },
  { q: "How does the AI personalize my routine?", a: "By analyzing your responses and physical markers, the AI identifies which 'Dosha' is currently out of balance and prioritizes tasks that pacify that specific energy." },
  { q: "What if I miss a day?", a: "Ayurveda emphasizes consistency over perfection. The AI helps you 'reset' the next day with specific recovery protocols." }
];

export default function DailyRoutineLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const colors = {
    primary: "#3B82F6", // Blue for calm/routine
    secondary: "#F59E0B", // Amber for solar energy
    accent: "#10B981", // Emerald for health
    cta: "#2563EB", 
    bgLight: "#EFF6FF", 
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
      <div className="relative h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2000" 
          alt="Daily Routine Banner" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-blur-[1px]" />
        
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
            Vedic Daily Synchronicity
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter" style={{ color: '#FFFFFF' }}>
            Master Your <br/>
            <span style={{ color: colors.primary }} className="italic">Daily Flow</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
            Stop living by chance. Align your life with AI-powered 'Dinacharya' precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-md border border-white/20">
              <Clock className="w-5 h-5" style={{ color: colors.secondary }} />
              <span className="text-white text-xs font-black uppercase tracking-widest">60s Result Promise</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 2. The "Symptom Checker" Card */}
      <div className="px-6 -mt-20 relative z-30">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-blue-50"
        >
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${colors.primary}10`, color: colors.primary }}>
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-black tracking-tight italic" style={{ color: colors.heading }}>6 Signs Your Routine is Broken</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Waking up Tired & Unrefreshed",
                "Unpredictable Energy Crashes",
                "Late Night Cravings & Insomnia",
                "Irregular Digestive Cycles",
                "High Afternoon Stress/Anxiety",
                "Difficulty Focusing on One Task"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-[#3B82F6] transition-all">
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
         <div className="p-10 rounded-[3rem] bg-stone-100/50 border border-stone-200">
            <Coffee className="w-12 h-12 text-stone-400 mb-6" />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.heading }}>The Modern Chaos</h3>
            <p className="text-lg font-bold leading-relaxed opacity-70" style={{ color: colors.body }}>
               Reacting to notifications, skipping breakfast, and staring at blue screens late at night. A recipe for chronic burnout.
            </p>
         </div>
         <div className="p-10 rounded-[3rem] border border-blue-100" style={{ backgroundColor: `${colors.primary}05` }}>
            <Sparkles className="w-12 h-12 mb-6" style={{ color: colors.primary }} />
            <h3 className="text-2xl font-black mb-4" style={{ color: colors.primary }}>The Ayurzenix Harmony</h3>
            <p className="text-lg font-bold leading-relaxed" style={{ color: colors.body }}>
               Proactive daily structures mapped to your unique metabolic peak. We turn your daily tasks into a healing ritual.
            </p>
         </div>
      </div>

      {/* 4. Deep Insight Blog */}
      <div className="px-6 max-w-5xl mx-auto space-y-16 py-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight" style={{ color: colors.heading }}>
            {ROUTINE_BLOG.title}
          </h2>
          <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[4rem] border border-gray-100 shadow-sm space-y-16">
          <p className="text-2xl font-medium leading-relaxed italic border-l-8 pl-8 py-2" style={{ color: colors.bodyLight, borderColor: colors.primary }}>
            {ROUTINE_BLOG.intro}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {ROUTINE_BLOG.sections.map((section, idx) => (
              <div key={idx} className="space-y-10">
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
          className="bg-stone-950 py-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(to top, ${colors.primary}20, transparent)` }} />
          <div className="space-y-4 relative z-10 mb-12">
            <h2 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Routine Consistency Index</h2>
            <p className="text-white/40 font-bold text-sm tracking-widest uppercase">Ayurzenix Weekly Audit</p>
          </div>

          <div className="relative w-56 h-56 mx-auto mb-12 flex items-center justify-center">
             <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: colors.accent }}
             />
             <div className="relative w-56 h-56 rounded-full border-[12px] flex flex-col items-center justify-center bg-stone-900 shadow-2xl" style={{ borderColor: `${colors.primary}30` }}>
                <span className="text-7xl font-black text-white">82<span className="text-3xl" style={{ color: colors.accent }}>%</span></span>
                <span className="text-[10px] font-black text-white/40 uppercase mt-2 tracking-widest">Consistency Score</span>
             </div>
          </div>

          <div className="max-w-md mx-auto space-y-4 relative z-10 px-8">
            <div className="inline-block px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border" style={{ backgroundColor: `${colors.primary}20`, borderColor: `${colors.primary}40`, color: colors.primary }}>
              Harmonious Routine (Kapha Balanced)
            </div>
            <p className="text-white/70 font-bold text-lg leading-relaxed italic">
              "Your routine shows high morning consistency. To improve, focus on reducing late-night screen time to optimize Ojas."
            </p>
          </div>
        </motion.div>
      </div>

      {/* 6. Quick Tips & FAQs */}
      <div className="py-24 px-6 max-w-5xl mx-auto space-y-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Moon className="w-8 h-8" />, t: "Deep Rest" },
            { icon: <Heart className="w-8 h-8" />, t: "Ojas Boost" },
            { icon: <MessageCircle className="w-8 h-8" />, t: "Expert Chat" },
            { icon: <HelpCircle className="w-8 h-8" />, t: "24/7 Support" }
          ].map((tip, i) => (
            <div key={i} className="flex flex-col items-center gap-4 text-center group">
              <div className="w-20 h-20 rounded-[2rem] bg-white border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" style={{ color: colors.primary }}>
                {tip.icon}
              </div>
              <span className="text-sm font-black uppercase tracking-widest" style={{ color: colors.heading }}>{tip.t}</span>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          <h3 className="text-4xl font-black text-center" style={{ color: colors.heading }}>Common Questions</h3>
          <div className="space-y-6">
            {FAQS.map((faq, i) => (
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

      {/* 7. Sticky Footer CTA */}
      <div className="fixed bottom-8 left-0 right-0 px-6 z-[100]">
        <motion.button
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/daily-routine')}
          className="max-w-md mx-auto w-full py-6 rounded-full shadow-2xl flex items-center justify-center gap-4 text-white font-black text-lg uppercase tracking-[0.2em] backdrop-blur-xl transition-all"
          style={{ backgroundColor: colors.primary }}
        >
          <Zap className="w-6 h-6 fill-white" />
          Get Plan Now
          <ChevronRight className="w-6 h-6" />
        </motion.button>
      </div>

    </div>
  );
}
