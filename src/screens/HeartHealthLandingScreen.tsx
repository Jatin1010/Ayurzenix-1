import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Zap, 
  AlertCircle, 
  Sparkles, 
  Heart, 
  Activity, 
  Flame, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  Brain
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
  bgDark: '#0A2F30',
  bgDeep: '#040F49',
  bgLight: '#F7FCF9',
  textDark: '#000000',
  textGray: '#111827'
};

const RISKS = [
  "Fluctuating Blood Pressure",
  "High Stress or Anxiety",
  "Poor Diet & Junk Food",
  "Lack of Physical Activity",
  "Unexplained Fatigue",
  "Family History of Cardiac Issues"
];

const QUICK_TIPS = [
  { icon: <Flame className="w-5 h-5" />, title: "Agni Boost", text: "Sip warm water with ginger to clear toxins (Ama)." },
  { icon: <Clock className="w-5 h-5" />, title: "Sleep by 10", text: "Ensures heart recovery." },
  { icon: <Activity className="w-5 h-5" />, title: "Pranayama", text: "Regulates heart rhythm." },
  { icon: <Heart className="w-5 h-5" />, title: "Low Salt", text: "Essential for BP control." }
];

const FAQS = [
  { 
    q: "Is this analyzer 100% accurate?", 
    a: "It provides a wellness risk assessment based on clinical algorithms and Ayurvedic principles. It is NOT a medical diagnosis." 
  },
  { 
    q: "Why check heart health early?", 
    a: "Most risks are manageable if caught before developing into chronic conditions." 
  },
  { 
    q: "What follow-up is recommended?", 
    a: "Follow the personalized Ayurvedic routines and consult a cardiologist if high risk is detected." 
  }
];

export default function HeartHealthLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F7FCF9] pb-32">
      <SEO 
        title="Understand Heart Risk – Heart Health AI"
        description="Identify hidden patterns and get a clinical-grade heart health analysis based on Ayurvedic principles in 60 seconds."
        image="/heart_banner.jpg"
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

      {/* Hero Section */}
      <section className="relative h-[85vh] overflow-hidden flex items-end">
        <motion.img 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
          src="/heart_banner.jpg" 
          alt="Heart Health" 
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
              UNDERSTAND <br />
              <span className="text-[#00BFA6]">YOUR HEART.</span>
            </h1>
            <p className="text-gray-600 text-lg font-bold leading-relaxed max-w-sm">
              Identify hidden patterns before they manifest.
              <span className="text-black font-black ml-1">Get a clinical-grade heart analysis</span> in 60 seconds.
            </p>
            <button 
              onClick={() => navigate('/heart-health')}
              className="bg-[#00BFA6] text-black font-black px-12 py-5 rounded-full hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,191,166,0.3)] mt-4"
            >
              START ANALYSIS
            </button>
          </motion.div>
        </div>
      </section>

      {/* Risks */}
      <section className="px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-100 max-w-4xl mx-auto">
          <h3 className="text-4xl font-black tracking-tighter text-stone-950 mb-12 text-center">You May Be At Risk If:</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {RISKS.map((risk, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-6 h-6 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                </div>
                <p className="text-[#111827] font-medium text-lg tracking-tight">{risk}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/Info */}
      <section className="px-6 py-24 max-w-4xl mx-auto space-y-12">
         <h2 className="text-5xl font-black tracking-tighter text-[#000000] leading-none text-center">
            Ancient Wisdom. <br />
            <span className="text-emerald-500">Supercharged by AI.</span>
         </h2>
         <div className="p-10 rounded-[3rem] bg-white border border-gray-100 shadow-sm space-y-6">
            <h4 className="text-2xl font-black tracking-tighter">Insights from Ayurveda</h4>
            <p className="text-stone-600 font-medium leading-relaxed">
              Ayurveda teaches that the heart (Hridaya) is the seat of Ojas (vitality). Imbalance in doshas (Vata, Pitta, Kapha) can strain this center. Our AI maps these ancient signals to modern health markers.
            </p>
         </div>
      </section>
      
      {/* FAQs */}
      <section className="px-6 py-12 max-w-6xl mx-auto">
         <div className="space-y-10">
            <h3 className="text-3xl font-black tracking-tighter text-stone-950 uppercase text-center">Common <span className="text-[#A259FF]">Doubts</span></h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="rounded-3xl border border-stone-100 bg-white overflow-hidden">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 font-black text-stone-900"
                  >
                    {faq.q}
                    <HelpCircle className="w-5 h-5 text-stone-300" />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-6 pb-6 text-sm text-stone-600 font-medium leading-relaxed border-t border-stone-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
      </section>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-10 left-6 right-6 z-50 flex justify-center">
        <button
          onClick={() => navigate('/heart-health')}
          className="w-full max-w-md h-20 rounded-[2.5rem] bg-stone-950 text-white font-black text-sm uppercase tracking-[0.3em] flex items-center justify-center px-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] gap-4"
        >
          <Zap className="w-5 h-5 fill-current" />
          START ANALYSIS
        </button>
      </div>
    </div>
  );
}
