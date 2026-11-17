import { motion } from 'motion/react';
import heartHealthInfographic from '../../assets/images/heart_health_infographic_1779135515957.png';
import { Apple, Zap, Activity, AlertCircle, Wind, Flame, Mountain, Info, Sparkles, ShieldCheck, Brain, Heart, Moon, Utensils, Target } from 'lucide-react';

export function Infographic({ onSelect }: { onSelect: (path: string) => void }) {
  const doshas = [
    {
      name: "Vata",
      element: "Air & Space",
      desc: "The principle of movement. Governs breathing, heart muscles, and nervous system.",
      traits: ["Creative", "Light", "Energetic"],
      icon: Wind,
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      name: "Pitta",
      element: "Fire & Water",
      desc: "The principle of transformation. Governs digestion, metabolism, and temperature.",
      traits: ["Focused", "Sharp", "Confident"],
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-50"
    },
    {
      name: "Kapha",
      element: "Earth & Water",
      desc: "The principle of structure. Governs bones, muscles, and joint lubrication.",
      traits: ["Calm", "Strong", "Loving"],
      icon: Mountain,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    }
  ];

  const risks = [
    { title: "Fluctuating Blood Pressure", icon: "💔" },
    { title: "High Stress or Anxiety", icon: "🧠" },
    { title: "Poor Diet & Junk Food", icon: "🍔" },
    { title: "Lack of Physical Activity", icon: "🏃" },
    { title: "Unexplained Fatigue", icon: "🔋" },
    { title: "Family History of Cardiac Issues", icon: "🧬" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
        {name: "Agni Engine", icon: Flame, path: "/intelligence"},
        {name: "Mental Scan", icon: Brain, path: "/smart-mental-scan-landing"},
        {name: "Body Scan", icon: Activity, path: "/body-scan-landing"},
        {name: "Hormone Bal.", icon: Zap, path: "/hormonal-balance-landing"},
        {name: "Heart Health", icon: Heart, path: "/heart-health-landing"},
        {name: "Sleep Intel", icon: Moon, path: "/sleep-intelligence-landing"},
        {name: "Gut Health", icon: Utensils, path: "/gut-landing"},
        {name: "Stress Relief", icon: Wind, path: "/stress-relief-landing"},
        {name: "Immunity Intel", icon: ShieldCheck, path: "/symptom-checker-landing"},
        {name: "Dosha Balance", icon: Sparkles, path: "/dosha-test-landing"},
        {name: "Skin Health", icon: Apple, path: "/face-glow-landing"},
        {name: "Liver Care", icon: Mountain, path: "/liver-landing"},
        {name: "Daily Routine", icon: Info, path: "/daily-routine-landing"},
        {name: "Diet Plan", icon: Utensils, path: "/aahar-scanner-landing"},
        {name: "Yoga/Movement", icon: Activity, path: "/intelligence"},
        {name: "Meditation", icon: Brain, path: "/soundscapes"},
        {name: "Weight Mgt", icon: Target, path: "/weight-loss-landing"},
        {name: "Respiratory", icon: Wind, path: "/intelligence"},
        {name: "Hair Care", icon: Sparkles, path: "/hair-fall-landing"},
        {name: "Blood Pressure", icon: Heart, path: "/heart-health-landing"},
        {name: "Energy Boost", icon: Zap, path: "/energy-landing"},
        {name: "Future Pred", icon: Info, path: "/future-predictor-landing"},
  ];

  return (
    <section id="infographic-section" className="px-6 py-24 bg-white/50 space-y-24 scroll-mt-20">
      {/* 2. Full System Features Grid */}
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <p className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">Ayurzenix Platform</p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Complete Health Intelligence</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
                <div key={i} onClick={() => onSelect(feature.path)} className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center text-center gap-3 cursor-pointer hover:shadow-lg transition-all">
                    <feature.icon className="w-8 h-8 text-emerald-600" />
                    <span className="text-xs font-black uppercase tracking-widest">{feature.name}</span>
                </div>
            ))}
        </div>
      </div>


      {/* 3. Three Doshas Card Grid */}
      <div className="max-w-6xl mx-auto space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <p className="text-[10px] font-black text-emerald-600 tracking-[0.3em] uppercase">The Tri-Dosha Theory</p>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Find Your Balance</h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {doshas.map((dosha, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="group p-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm transition-all duration-500 space-y-6"
            >
              <div className={`w-14 h-14 ${dosha.bg} ${dosha.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                <dosha.icon className="w-7 h-7" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{dosha.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{dosha.element}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">{dosha.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {dosha.traits.map((trait, j) => (
                    <span key={j} className="px-3 py-1 bg-stone-50 rounded-full text-[10px] font-bold text-gray-500 border border-stone-100">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 3. Root Cause vs Symptom Comparison - REMOVED */}
    </section>
  );
}
