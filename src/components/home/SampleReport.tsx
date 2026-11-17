import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Zap, Target, Heart, CheckCircle2, Activity, Microscope, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SampleReport() {
  const navigate = useNavigate();

  const benefits = [
    { title: "Deep Dosha Analysis", desc: "Understand your biological blueprint.", icon: Zap },
    { title: "Precision Diet Plan", desc: "Food that acts as medicine for you.", icon: Target },
    { title: "Daily Lifestyle Routine", desc: "Sync your body with sun cycles.", icon: ShieldCheck },
    { title: "Personalized Health Fixes", desc: "Natural remedies for your root causes.", icon: Heart }
  ];

  return (
    <section className="px-6 py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Report Preview Visualization */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full max-w-lg"
        >
          <div className="bg-white rounded-[3rem] shadow-2xl shadow-emerald-900/10 border border-stone-100 overflow-hidden relative">
            {/* Header of Report */}
            <div className="bg-stone-900 p-8 text-white space-y-4">
              <div className="flex justify-between items-center">
                 <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-white">AZ</div>
                 <div className="text-right">
                   <p className="text-[8px] font-black uppercase tracking-widest text-emerald-400">Status</p>
                   <p className="text-[10px] font-bold">Premium Unlocked</p>
                 </div>
              </div>
              <div className="space-y-1">
                 <h4 className="text-xl font-black italic">Vedic Wellness Roadmap</h4>
                 <p className="text-xs font-medium text-gray-400 opacity-80 uppercase tracking-widest">Aditya S. • Pitta-Vata</p>
              </div>
            </div>

            {/* Content Mockup */}
            <div className="p-8 space-y-8 bg-white">
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#F1F5F9" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" strokeWidth="8" strokeDasharray="230 283" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 leading-none">82</span>
                    <span className="text-[8px] font-black text-emerald-600 uppercase">Score</span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-black text-gray-900">Health index is optimized.</p>
                  <p className="text-[10px] font-medium text-gray-400 leading-relaxed">Your Agni (digestive fire) is functioning at 80% capacity. Minor Pitta imbalance detected in liver markers.</p>
                </div>
              </div>

              <div className="space-y-4">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended Ahara (Diet)</p>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-black text-emerald-800">Soaked Almonds</span>
                   </div>
                   <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-black text-emerald-800">Warm Cumin Water</span>
                   </div>
                 </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">AI Summary</p>
                <p className="text-[11px] italic font-medium leading-relaxed text-gray-600">
                  "Transition to lukewarm fluids and avoid acidic fruits after sunset to stabilize Sadhaka Pitta..."
                </p>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="h-2 bg-emerald-500" />
          </div>
        </motion.div>

        {/* Right: Content & CTA */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 space-y-10 text-center lg:text-left"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
               <ShieldCheck className="w-3 h-3" />
               Premium Insights
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              A Report That <br /><span className="text-emerald-600">Actually Changes</span> Your Life
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Move beyond generic advice. Get a technical, data-driven Ayurvedic manual built specifically for your body.
            </p>
            
            <div className="space-y-6 pt-4">
              {[
                {
                  title: "Foundational focus",
                  points: ["Wellness Score", "Dosha Analysis", "Detailed Root Cause", "Actionable Home Remedies", "Plan Upgrade Insight"],
                  icon: Activity
                },
                {
                  title: "Clinical depth and long-term strategy",
                  points: ["Advanced Bio-Analysis", "7-Day Healing Protocol", "Chrono-nutrition Roadmap", "Yoga Therapy"],
                  icon: Microscope
                },
                {
                  title: "Absolute Longevity & Precision",
                  points: ["Ojas / Tejas Reserve metrics", "SOS Symptom Rescue Matrix", "5-Year Future Predictor", "Epigenetic Roadmap", "Personalized High-Fidelity PDF"],
                  icon: Brain
                }
              ].map((section, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <section.icon className="w-5 h-5 text-emerald-600" />
                    <h5 className="text-sm font-black text-gray-900">{section.title}</h5>
                  </div>
                  <ul className="grid grid-cols-2 gap-2">
                    {section.points.map((point, i) => (
                       <li key={i} className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5 bg-white px-2 py-1 rounded-full border border-stone-100 shadow-sm">
                         <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500"/>
                         {point}
                       </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-3xl transition-colors hover:bg-emerald-50"
              >
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-stone-100 flex items-center justify-center shrink-0">
                   <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                   <h4 className="text-sm font-black text-gray-900">{item.title}</h4>
                   <p className="text-[11px] font-medium text-gray-400 group-hover:text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pricing')}
            className="w-full md:w-auto px-12 py-6 bg-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 group"
          >
            Unlock Full Report
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
