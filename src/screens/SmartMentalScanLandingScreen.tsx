import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Brain, 
  ChevronLeft, 
  Zap, 
  Moon, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2,
  Heart,
  ShieldCheck,
  Timer,
  ChevronRight,
  Star,
  Activity
} from 'lucide-react';
import { cn } from '../lib/utils';
import FeatureBlog from '../components/FeatureBlog';

export default function SmartMentalScanLandingScreen({ appConfig }: { appConfig?: any }) {
  const navigate = useNavigate();

  const risks = [
    "Feeling 'burnt out' despite resting?",
    "Constant chatter in the head (Rajasic Mind)?",
    "Brain fog or mental heaviness (Tamasic State)?",
    "Irritability or uncontrolled anger spikes?",
    "Poor focus and wavering attention?",
    "Sleep that doesn't feel restorative?"
  ];

  const faqs = [
    {
      q: "How does AI analyze my mind?",
      a: "Our AI uses Vedic pattern recognition to map your emotional responses to the three Gunas (Sattva, Rajas, Tamas) and mental Doshas."
    },
    {
      q: "Is this a clinical diagnosis?",
      a: "No, this is a wellness assessment based on Ayurvedic Psychology (Manas Vigyana) to help you find mental balance."
    },
    {
      q: "What will I get in the report?",
      a: "A full breakdown of your mental Doshas, 7/30 day detox plan, specific Mantras, and Diet for mental clarity."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-32 font-sans selection:bg-purple-100 gpu-accelerated">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden gpu-accelerated">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          src="/stressrelief.png" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-stone-950/80 backdrop-grayscale-[0.2]" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 pt-12">
          <button 
            onClick={() => navigate('/')}
            className="absolute top-12 left-6 p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white active:scale-90 transition-transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white"
            >
              <Brain className="w-3 h-3" />
              AI Neural Analysis
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl font-black text-white leading-[1] tracking-tighter"
            >
              Decode Your <br />
              <span className="text-purple-400 italic">Silent Mastery</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/60 text-base font-medium max-w-[280px] italic"
            >
              Mapping the resonance of Sattva, Rajas & Tamas within your nervous system.
            </motion.p>
          </div>
        </div>
      </section>

      <div className="px-6 -mt-16 relative z-20 space-y-12">
        {/* Symptom Checker Card */}
        <section className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-purple-900/5 border border-stone-50 gpu-accelerated">
          <h2 className="text-xl font-black text-black mb-8 flex items-center gap-3">
             Current Signal Markers
            <AlertCircle className="w-5 h-5 text-purple-600" />
          </h2>
          <div className="space-y-4">
            {risks.map((risk, i) => (
              <div key={i} className="flex items-center gap-5 p-5 bg-stone-50/50 rounded-3xl border border-stone-100/50 hover:bg-stone-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0 shadow-lg shadow-purple-200" />
                <p className="text-sm font-bold text-stone-800 italic">{risk}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problem vs Solution */}
        <section className="grid grid-cols-1 gap-6">
          <div className="bg-stone-50 rounded-[2.5rem] p-8 border border-stone-100">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Genetic Static
            </h3>
            <p className="text-base text-stone-600 font-bold leading-relaxed italic">
              Standard therapies often ignore the specific <span className="text-stone-900">biological Guna frequency</span> that triggers your unique stress response.
            </p>
          </div>
          <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-purple-100">
            <h3 className="text-xs font-black text-purple-200 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Synchronization
            </h3>
            <p className="text-base text-white font-bold leading-relaxed italic">
              Our analyzer maps your <span className="text-purple-300">Bio-Neural Matrix</span> to reclaim mental clarity and restorative peace.
            </p>
          </div>
        </section>

        {/* Deep Insight Blog Hook */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-stone-100 space-y-6">
          <div className="inline-block px-3 py-1 bg-amber-50 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest border border-amber-100">
            Ancient + AI
          </div>
          <h2 className="text-2xl font-black text-black leading-tight">
            The Silent Mastery: How your mind shapes your destiny according to Ayurveda.
          </h2>
          <div className="pl-4 border-l-4 border-purple-600 py-1">
            <p className="text-stone-700 text-sm font-medium leading-relaxed italic">
              "Your mind is not a cage; it is a garden. Whether you are dealing with the Rajasic rush or Tamasic fog, Ayurveda has the key."
            </p>
          </div>
          <p className="text-stone-600 text-sm font-medium leading-relaxed">
            By understanding the dance of Sattva (Clarity), Rajas (Agitation), and Tamas (Inertia), we can move from mental chaos to a state of luminous peace.
          </p>
        </section>

        {/* Sample Report Preview */}
        <section className="bg-stone-950 rounded-[2.5rem] p-8 text-white space-y-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-10" />
          
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-black">Sample Analysis</h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Premium AI Interpretation</p>
          </div>

          <div className="flex justify-center flex-col items-center gap-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" strokeDasharray={440} strokeDashoffset={440 - (72/100) * 440} strokeLinecap="round" fill="transparent" className="text-purple-600" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">72</span>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Resilience</span>
              </div>
            </div>
            <div className="space-y-1 text-center">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs font-black uppercase">Rajas Domination Detected</span>
              </div>
              <p className="text-[10px] text-white/60 font-medium px-4">AI detected high agitation levels. Your mind is in 'Rajas' mode, seeking constant stimulation.</p>
            </div>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="grid grid-cols-2 gap-4">
           {[
             { icon: <Timer className="w-5 h-5" />, label: "60s Scan" },
             { icon: <ShieldCheck className="w-5 h-5" />, label: "100% Private" },
             { icon: <Star className="w-5 h-5" />, label: "Expert Logic" },
             { icon: <Heart className="w-5 h-5" />, label: "Root Fix" }
           ].map((tip, i) => (
             <div key={i} className="bg-white p-4 rounded-3xl border border-stone-200 flex items-center gap-3">
               <div className="text-purple-600">{tip.icon}</div>
               <span className="text-[10px] font-black uppercase tracking-wide text-stone-900">{tip.label}</span>
             </div>
           ))}
        </section>

        {/* FAQs */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-black px-2">Common Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                <h3 className="text-sm font-black text-black mb-2">{faq.q}</h3>
                <p className="text-xs text-stone-600 font-bold leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-50">
        <button 
          onClick={() => navigate('/smart-mental-scan')}
          className="w-full bg-stone-900 hover:bg-black text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-purple-200 flex items-center justify-center gap-4 group transition-all"
        >
          <Zap className="w-4 h-4 fill-purple-400 text-purple-400 group-hover:scale-110 transition-transform" />
          Initialize Analysis
          <ChevronRight className="w-4 h-4 opacity-50" />
        </button>
      </div>
    </div>
  );
}
