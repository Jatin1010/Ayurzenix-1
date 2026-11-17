import { motion } from 'motion/react';
import { 
  Heart, 
  Flame, 
  ChevronLeft, 
  Zap, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Stethoscope,
  Info,
  Moon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '../lib/utils';

const COLORS = {
  purple: '#A259FF',
  teal: '#00BFA6',
  coral: '#FF6B6B',
  yellow: '#FFB400',
  azure: '#006BDF',
  textDark: '#000000',
  textGray: '#111827',
  bgLight: '#F7FCF9'
};

const SYMPTOMS = [
  "Sudden palpitations or 'pounding' heart",
  "Unexplained fatigue even after sleep",
  "Mild pressure in the upper abdomen",
  "Anxiety that feels 'physical' in the chest",
  "Shortness of breath during minor stairs",
  "Frequent numbness in left arm or neck"
];

const QUICK_TIPS = [
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Arjuna Bark Tea", text: "Traditionally known as a 'Heart Tonic', consuming Arjuna tea helps strengthen cardiac muscles." },
  { icon: <Activity className="w-5 h-5" />, title: "Left-side Sleep", text: "Sleeping on your left side facilitates better lymphatic drainage and reduces heart strain." },
  { icon: <Stethoscope className="w-5 h-5" />, title: "Garlic Power", text: "Eat one small clove of raw garlic on an empty stomach to clear arterial plaque naturally." },
  { icon: <Zap className="w-5 h-5" />, title: "30min Silence", text: "Practice total silence for 30 minutes daily to lower cortisol and protect the heart pulse." }
];

const USAGE_STEPS = [
  { num: "01", title: "Open Heart Scan", desc: "Navigate to the Smart Health tab and select 'Heart Scan'." },
  { num: "02", title: "Input Bio-Data", desc: "Share your current symptoms, family history, and lifestyle patterns." },
  { num: "03", title: "AI Analysis", desc: "Our engine analyzes your 'Ama' load and 'Pitta' inflammation markers." },
  { num: "04", title: "Get Your Score", desc: "Receive your Vedic Heart Resilience Score (0-100)." },
  { num: "05", title: "Follow Routine", desc: "Implement the custom 'Hrdya' herb and diet plan provided." },
  { num: "06", title: "Track Progress", desc: "Repeat every 2 weeks to see your resilience index improve." }
];

const FAQS = [
  { 
    q: "Can Ayurveda really detect heart risks before they happen?", 
    a: "Yes. Ayurzenix uses AI to analyze bio-signals like breath rhythm (Prana Vayu), eye patterns, and tongue coating to detect 'Ama'—the toxic, sticky buildup that traditional tests often miss until it's too late." 
  },
  { 
    q: "Why are young and fit people getting heart attacks in India?", 
    a: "External muscles (fitness) do not equal internal health. High stress, poor recovery, and chronic inflammation of the 'Sadhaka Pitta' are the silent triggers in young adults today." 
  },
  { 
    q: "Is the Heart Health Scan a substitute for a visit to the Cardiologist?", 
    a: "No. This is a preventative wellness tool. If you have active pain, consult a doctor immediately. Our goal is early awareness and lifestyle correction to prevent a crisis." 
  },
  {
    q: "How many times should I take the heart scan?",
    a: "For the most accurate results, we recommend taking the scan once every 15 days to track how your lifestyle changes are affecting your metabolic heart resilience."
  }
];

export default function HeartHealthBlogScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7FCF9] pb-32 font-sans">
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
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: "linear" }}
          src="/heart_banner.jpg" 
          alt="Heart Health India" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7FCF9] via-[#F7FCF9]/40 to-transparent" />
        
        <div className="relative z-10 w-full px-6 pb-20 max-w-2xl mx-auto text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm mx-auto md:mx-0">
              <Sparkles className="w-4 h-4 text-[#00BFA6]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BFA6]">AI Cardiac Insights</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black leading-[0.85] uppercase">
              The Silent <br />
              <span style={{ color: COLORS.coral }}>Epidemic.</span>
            </h1>
            <p className="text-gray-600 text-lg font-bold leading-relaxed max-w-sm mx-auto md:mx-0">
              Heart attacks in India are rising at an alarming rate. <br />
              <span className="text-black font-black">Unmask your heart's hidden signals</span> before it's too late.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Symptom Checker Card */}
      <section className="px-6 -mt-12 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100 max-w-4xl mx-auto"
        >
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: COLORS.azure }}>Red Flag Signals</h2>
            <h3 className="text-4xl font-black tracking-tighter text-stone-950">Is Your Heart <span className="text-stone-400">Whispering?</span></h3>
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

      {/* 3. Deep Insight Blog - Introduction */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="space-y-16">
          <div className="space-y-8">
            <h2 className="text-5xl font-black tracking-tighter text-[#000000] leading-none uppercase">
                Ancient Wisdom <br />
                <span className="text-[#059669]">Meets Modern AI.</span>
            </h2>
            <div className="pl-6 border-l-4 border-[#FF6B6B]">
              <p className="text-xl text-[#000000] leading-relaxed font-black italic">
                In India, heart disease is no longer a "rich man's problem" or an "old person's concern." It's a national crisis fueled by a toxic mix of genetics and high-vibe burnout.
              </p>
            </div>
            <div className="space-y-8 text-[#111827] text-lg leading-relaxed font-bold">
              <p>
                The modern Indian lifestyle—marked by high-pressure desk jobs, excessive consumption of refined-oil snacks (Samosas and Bhujia), and a "burn the midnight oil" culture—is creating a perfect storm for cardiovascular failure. But the real culprit often goes unnoticed: <strong>Silent Inflammation of the Sadhaka Pitta.</strong>
              </p>
              <p>
                In the last decade, we have seen a 300% rise in heart-related events among those under 40. This isn't just about cholesterol anymore; it's about how your body handles subtle chronic stress. In Ayurveda, the heart (Hridaya) is the seat of <strong>Ojas</strong> (the essence of life). When Ojas is depleted due to poor sleep and inflammatory foods, the heart's defense mechanism collapses.
              </p>
              <p>
                Ayurzenix uses advanced AI to bridge the gap between your physical symptoms and your internal bio-rhythms. By analyzing your 'Vibe' trends, we help you detect the early accumulation of <strong>'Ama'</strong> (metabolic toxins) before they turn into physical blockages.
              </p>
            </div>
          </div>

          {/* 3. Ashtanga Hridayam Section - The "Vedic Foundation" */}
          <section className="py-20 relative">
             <div className="absolute inset-0 bg-stone-900 rounded-[4rem] -rotate-1 scale-[1.02]" />
             <div className="relative bg-black rounded-[4rem] p-16 text-white border border-white/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B6B]/10 blur-[120px] rounded-full" />
                <div className="relative space-y-12">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div className="space-y-4">
                         <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 text-[#FF6B6B]">
                            <Sparkles className="w-4 h-4 fill-current" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Vedic Source: Ashtanga Hridayam</span>
                         </div>
                         <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85]">
                            The Heart <br />
                            <span className="text-emerald-500">of Wisdom.</span>
                         </h2>
                      </div>
                      <div className="max-w-xs text-right">
                         <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
                            "Hridaya is the seat of Ojas and the mahasrotas (great channel) for Prana." <br />
                            <span className="text-emerald-500 font-black">— Ashtanga Hridayam, Sutrasthana</span>
                         </p>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <p className="text-xl text-gray-300 font-bold leading-relaxed">
                            Vagbhata identifies the heart (Hridaya) as more than just an organ. It is the physical manifestation of your **Internal Fire (Sadhaka Pitta)**. When this fire is well-regulated, you experience courage and clarity. When it burns too high (due to anger or excess chillies), it damages the delicate 'Srotas' or micro-channels.
                         </p>
                         <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <h4 className="text-emerald-500 font-black uppercase tracking-widest text-xs">AI Translation</h4>
                            <p className="text-sm text-gray-400 font-medium">
                               What the texts call 'Ama' blocking 'Hridaya-Vaha Srotas' is precisely what modern science calls 'Lipid Plaque' in 'Coronary Arteries'. Our AI maps these parallels instantly.
                            </p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         {[
                           { t: "Ojas Protection", d: "Maintaining vitality through seed-based nutrition." },
                           { t: "Prana Rhythm", d: "Breath patterns that stabilize heart variability (HRV)." },
                           { t: "Sadhaka Balance", d: "Emotional regulation to prevent Pitta-related inflammation." },
                           { t: "Pathya Diet", d: "Heart-friendly fats (Ghee) according to your Agni." }
                         ].map((item, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-gray-900 border border-white/5 hover:border-emerald-500/30 transition-all">
                               <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                                  <Zap className="w-4 h-4 fill-current" />
                               </div>
                               <h5 className="text-sm font-black text-white uppercase mb-2">{item.t}</h5>
                               <p className="text-[10px] text-gray-500 font-bold leading-tight uppercase tracking-widest">{item.d}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* 4. How to Use Section - Added for DNA compliance */}
          <div className="space-y-12 py-10">
             <div className="space-y-2">
                <h3 className="text-4xl font-black tracking-tighter text-black uppercase ring-offset-4">How to Use <span className="text-stone-400">Heart Scan</span></h3>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Follow these 6 simple steps to unlock your cardiac roadmap.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {USAGE_STEPS.map((step, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl group hover:border-[#A259FF] transition-all">
                        <div className="text-4xl font-black text-gray-100 mb-4 group-hover:text-[#A259FF]/20 transition-colors">{step.num}</div>
                        <h5 className="text-xl font-black text-black uppercase mb-2 tracking-tight">{step.title}</h5>
                        <p className="text-sm text-gray-500 font-bold leading-relaxed">{step.desc}</p>
                    </div>
                ))}
             </div>
          </div>

          {/* New Coral Crisis Cards */}
          <div className="space-y-8">
            <h3 className="text-3xl font-black tracking-tighter text-stone-900 uppercase">
              The <span style={{ color: COLORS.coral }}>Silent Killers</span> Checklist
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  title: "Refined Oil 'Ama'", 
                  desc: "Most Indian snacks use oils that turn into 'Ama' (sticky sludge) upon deep frying, acting like glue in your arteries.",
                  icon: <Flame className="w-6 h-6" />
                },
                { 
                  title: "Adrenaline Burnout", 
                  desc: "Constant Zoom calls and digital urgency keep your 'Vata' erratic, causing micro-shivers in the heart muscle tempo.",
                  icon: <Zap className="w-6 h-6" />
                },
                { 
                  title: "Sleep Depletion", 
                  desc: "Sleeping after 11 PM inhibits 'Ojas' replenishment, leaving the heart vulnerable to morning BP spikes.",
                  icon: <Moon className="w-6 h-6" />
                },
                { 
                  title: "Unprocessed Emotions", 
                  desc: "Suppressing grief or anger (Sadhaka Pitta) physically tightens the pericardium, reducing its flexibility index.",
                  icon: <Activity className="w-6 h-6" />
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 rounded-[2.5rem] bg-rose-50 border border-rose-100 text-black shadow-xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FF6B6B] shadow-sm">
                    {item.icon}
                  </div>
                  <h5 className="text-xl font-black uppercase tracking-tight text-black">{item.title}</h5>
                  <p className="text-sm font-bold text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 text-[#1f2937] text-lg leading-relaxed font-medium">
            <h4 className="text-2xl font-black text-stone-950 uppercase tracking-tighter">The Science of 'Ama' Blockages</h4>
            <p>
              Modern medicine calls it plaque; Ayurveda calls it <strong>Ama</strong>. Ama is the byproduct of incomplete digestion. When your 'Agni' (digestive fire) is weak, the food you eat turns into a cold, heavy, and sticky substance. Because the heart is the center of circulation, this Ama is carried directly to the coronary arteries.
            </p>
            <p>
              Once Ama settles in the arteries, it combines with the fat tissue (Meda Dhatu) to form <strong>Khavaigunya</strong>—a localized space of weakness. Over time, high stress (Vata) and high inflammation (Pitta) cause this blockage to harden. Our AI scan targets these metabolic markers specifically to give you a percentage-based 'Ama' load rating.
            </p>
            <p>
              By identifying these signals in their 'Sanchaya' (accumulation) stage, we can use <strong>Hrdya</strong> (heart-loving) herbs to dissolve the sludge before it calcifies. This is the difference between surviving a heart attack and preventing the first one.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <h2 className="text-4xl font-black tracking-tighter text-stone-950 uppercase leading-none">
                  2. Benefits of <br />
                  <span style={{ color: COLORS.azure }}>Vedic Analysis</span>
               </h2>
               <div className="space-y-4">
                  {[
                    "Early detection of 'Ama' (sticky arterial sludge)",
                    "Mapping of Sadhaka Pitta (stress) levels",
                    "Score-based heart resilience reporting",
                    "Personalized 'Hrdya' herb protocols (Arjuna, Guggul)",
                    "Customized Agni-Restoration diet plans",
                    "Integration of Ancient wisdom + AI Logic"
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex gap-3 items-center">
                       <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: COLORS.teal }} />
                       <span className="text-[#111827] font-semibold">{benefit}</span>
                    </div>
                  ))}
               </div>
            </div>
            <div className="bg-white p-8 rounded-[3rem] border border-stone-100 shadow-2xl space-y-6">
               <div className="flex items-center gap-3">
                  <Heart className="w-8 h-8" style={{ color: COLORS.coral }} />
                  <h4 className="text-xl font-black text-stone-900">Why Ayurveda?</h4>
               </div>
               <p className="text-stone-600 font-medium leading-relaxed">
                  Ayurveda doesn't just look at the heart as a pump; it looks at it as the seat of <strong>Ojas</strong> (vital energy) and <strong>Prana</strong>. By strengthening your 'Agni' and balancing 'Pitta', you reduce the internal heat and pressure that causes arterial damage. This is holistic prevention at its peak.
               </p>
            </div>
        </div>
      </section>

      {/* 5. Why Unique Section */}
      <section className="px-6 py-24">
        <div className="bg-[#006BDF] rounded-[4rem] p-12 text-white overflow-hidden relative max-w-6xl mx-auto group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-white/20 uppercase tracking-widest text-[10px] font-black">
                The Unfair Advantage
              </div>
              <h3 className="text-5xl font-black tracking-tighter leading-tight uppercase">
                AI + Ancient <br />
                <span className="text-[#00BFA6]">Vibe Engine.</span>
              </h3>
              <p className="text-blue-100 font-medium text-lg leading-relaxed">
                Standard apps only track your heart rate. Ayurzenix tracks your <strong>Vibe.</strong> Our proprietary algorithm merges Vedic pulse characteristics with modern bio-metrics to give you a preventative edge that simple wearables cannot.
              </p>
              <div className="flex items-center gap-6">
                 <div className="text-center">
                    <p className="text-4xl font-black">98%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Accuracy</p>
                 </div>
                 <div className="w-px h-12 bg-white/20" />
                 <div className="text-center">
                    <p className="text-4xl font-black">60s</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Analysis</p>
                 </div>
              </div>
            </div>

            <div className="relative group">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full scale-110" 
               />
               <div className="bg-white rounded-[3rem] p-10 flex flex-col items-center justify-center space-y-4 shadow-3xl text-stone-900">
                  <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-4">
                     <Activity className="w-10 h-10 text-blue-600" />
                  </div>
                  <h4 className="text-2xl font-black tracking-tighter">Digital Heart-Print</h4>
                  <div className="w-full flex justify-between px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
                     <span className="text-[10px] font-black uppercase text-stone-400">Ama Level</span>
                     <span className="text-[10px] font-black text-rose-500">Critical</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                     <div className="h-full bg-rose-500 w-3/4" />
                  </div>
                  <p className="text-[10px] font-bold text-stone-500 text-center px-6">Your heart vibe indicates high-pressure Pitta accumulation in the pericardium.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Quick Tips Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <h3 className="text-3xl font-black tracking-tighter text-stone-950 uppercase mb-12">
          3. Daily <span className="text-amber-500">Heart Hacks</span>
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_TIPS.map((tip, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2rem] border border-stone-100 shadow-sm space-y-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                {tip.icon}
              </div>
              <div className="space-y-2">
                <h5 className="font-black text-stone-950 uppercase text-sm tracking-widest">{tip.title}</h5>
                <p className="text-xs text-stone-600 leading-relaxed font-bold">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQs Section */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h3 className="text-4xl font-black tracking-tighter text-stone-950 uppercase">Essential <span style={{ color: COLORS.purple }}>Q&A</span></h3>
           <p className="text-stone-500 font-medium">Answering your most searched heart health doubts.</p>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className={cn(
                "rounded-3xl border overflow-hidden transition-all duration-300",
                activeFaq === idx ? "bg-white shadow-xl" : "bg-white border-stone-100"
              )}
              style={activeFaq === idx ? { borderColor: COLORS.purple } : {}}
            >
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-8 text-left flex items-center justify-between gap-6 group"
              >
                <div className="flex items-center gap-4">
                   <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all", activeFaq === idx ? "bg-purple-600 text-white" : "bg-stone-50 text-stone-400 group-hover:bg-purple-50 group-hover:text-purple-600")}>
                      0{idx + 1}
                   </div>
                   <span className="font-black text-stone-900 text-lg leading-tight">{faq.q}</span>
                </div>
                <HelpCircle className={cn("w-6 h-6 shrink-0 transition-all", activeFaq === idx ? "text-purple-600 rotate-12" : "text-stone-300")} />
              </button>
              {activeFaq === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="px-8 pb-8"
                >
                  <p className="text-base text-stone-600 font-medium leading-relaxed border-t border-stone-50 pt-6">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Conclusion & Sticky Footer CTA */}
      <section className="px-6 pb-48 max-w-3xl mx-auto text-center space-y-8">
         <div className="w-20 h-2 bg-emerald-500 mx-auto rounded-full" />
         <h3 className="text-4xl font-black tracking-tighter text-stone-950 uppercase italic">Your Heart Deserves More <br /> Than a "Good Luck" Routine.</h3>
         <p className="text-stone-600 text-lg font-medium">
            Don't wait for a signal that's too loud to ignore. Start your Vedic Heart Scan today and get the roadmap to a lifetime of flow.
         </p>
      </section>

      <div className="fixed bottom-28 left-6 right-6 z-50 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/heart-health-landing')}
          className="w-full max-w-md h-20 rounded-[2.5rem] bg-[#A259FF] text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-between px-8 shadow-[0_20px_40px_rgba(162,89,255,0.3)] group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#A259FF]">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span>Launch Heart Scan</span>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
        </motion.button>
      </div>
    </div>
  );
}
