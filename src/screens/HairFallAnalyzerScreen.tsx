import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Scissors, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  Search, 
  Zap, 
  ShieldCheck, 
  Leaf,
  CheckCircle,
  Activity,
  User,
  Layout,
  Target,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import SocialShare from '../components/SocialShare';
import SEOContentSection from '../components/SEOContentSection';
import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

interface HairFallAnalyzerScreenProps {
  userData: any;
  appConfig?: any;
}

export default function HairFallAnalyzerScreen({ userData, appConfig }: HairFallAnalyzerScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('hair-fall', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [inputs, setInputs] = useState({
    hairType: 'Normal',
    fallPattern: 'Roots',
    dandruff: 'None',
    waterQuality: 'Soft',
    stressLevel: 'Medium',
    digestion: 'Good'
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'hair-fall') {
      // Auto-resume disabled
    }
  }, [location.state]);

  const OPTIONS = {
    hairType: ['Dry/Frizzy', 'Oily', 'Normal', 'Mixed'],
    fallPattern: ['From Roots', 'Breakage (Middle)', 'Patches', 'All over thinning'],
    dandruff: ['Dry Flakes', 'Oily/Sticky Scales', 'None'],
    waterQuality: ['Hard Water', 'Soft Water', 'Filtered']
  };

  const handleStartAnalysis = async () => {
    if (userData?.is_guest || !userData?.uid) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'hair_fall',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false, 
      }));
      navigate('/auth');
      return;
    }
    
    try {
      const docId = await saveProfileLocally({
        uid: userData.uid,
        type: 'hair_fall',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false, 
      });
      navigate(`/analysis-pricing/${docId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save your analysis. Please try again.");
    }
  };

  // Landing Page View
  if (!showForm) {
    return (
      <div className="min-h-screen bg-[#F7F8FC] pb-32">
        {/* Hero Section */}
        <div className="relative h-[80vh] lg:h-[85vh] w-full overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=1200" 
            alt="Hair Health Care" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* No overlay shadow as per request */}
          
          <button onClick={() => navigate(-1)} className="absolute top-8 left-6 w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-gray-200 z-50 text-gray-800 shadow-sm active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="absolute inset-0 flex flex-col items-center justify-start pt-32 px-6 text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                <Sparkles className="w-4 h-4 fill-[#FF6B6B]" />
                Advanced Hair Genetics
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-[#0B0F1A] leading-[1.1] tracking-tighter">
                🚨 Hair Fall Getting <br/>
                <span className="text-[#A259FF]">Worse?</span>
              </h1>
              
              <p className="text-lg md:text-xl text-[#5B6472] font-medium max-w-xl mx-auto tracking-wide leading-relaxed">
                You’re missing the real cause. Root-level imbalances cannot be fixed by shampoo alone.
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowForm(true)}
                className="mt-8 px-12 py-5 rounded-[14px] bg-[#FFB400] text-[#0B0F1A] font-black text-sm uppercase tracking-widest shadow-[0_15px_35px_rgba(255,180,0,0.3)] hover:brightness-105 transition-all flex items-center gap-3 mx-auto"
              >
                Analyze Hair <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-6 -mt-16 relative z-30 space-y-12 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Target className="w-6 h-6" />, title: "Root issue detection", desc: "Identify the exact internal cause behind your hair thinning.", color: "#FF6B6B" },
              { icon: <Search className="w-6 h-6" />, title: "Scalp insights", desc: "Understand your scalp ecosystem and follicles health.", color: "#A259FF" },
              { icon: <RotateCcw className="w-6 h-6" />, title: "Recovery plan", desc: "Get a personalized 90-day natural regrowth protocol.", color: "#A259FF" }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="bg-white p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: `${benefit.color}15`, border: `1px solid ${benefit.color}30` }}
                >
                  <div style={{ color: benefit.color }}>{benefit.icon}</div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                   <CheckCircle className="w-4 h-4 text-[#00BFA6]" />
                   <h3 className="text-lg font-black text-[#0B0F1A] tracking-tight">{benefit.title}</h3>
                </div>
                <p className="text-sm text-[#5B6472] font-medium leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust Elements */}
          <div className="max-w-xl mx-auto flex flex-wrap items-center justify-center gap-8 py-8 border-t border-gray-200">
            <div className="flex items-center gap-2 text-[#006BDF] text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" /> 🔒 100% Private
            </div>
            <div className="flex items-center gap-2 text-[#006BDF] text-xs font-bold uppercase tracking-widest">
              <Zap className="w-5 h-5" /> ⚡ Fast AI Detection
            </div>
            <div className="flex items-center gap-2 text-[#006BDF] text-xs font-bold uppercase tracking-widest">
              <Leaf className="w-5 h-5" /> 🌿 Natural Recovery
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
             <SEOContentSection content={FEATURE_SEO_CONTENT['hair-fall']} />
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-gradient-to-t from-[#F7F8FC] via-[#F7F8FC]/95 to-transparent pt-16">
          <div className="max-w-lg mx-auto">
            <motion.button
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowForm(true)}
              className="w-full py-6 rounded-full bg-[#FFB400] text-[#0B0F1A] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(255,180,0,0.4)] flex items-center justify-center gap-3"
            >
              Analyze Now <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-32">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=800" 
          alt="Hair Fall Analyzer" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* No overlay shadow as per request */}
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20 -mt-10">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-[#A259FF] mb-2">
              <Scissors className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight text-[#0B0F1A]">Hair <span className="text-[#A259FF]">Analyzer</span></h2>
            </div>
            <p className="text-[#5B6472] text-sm font-medium">Ayurvedic hair health assessment for targeted recovery.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-[#FF6B6B] p-4 rounded-2xl mb-6 font-bold text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <div className="space-y-8">
            {Object.entries(OPTIONS).map(([key, options]) => (
              <div key={key} className="space-y-4">
                <label className="text-sm font-black text-[#0B0F1A] uppercase tracking-widest pl-1">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {options.map((opt: string) => (
                    <button
                      key={opt}
                      onClick={() => setInputs(prev => ({ ...prev, [key]: opt }))}
                      className={`py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${(inputs as any)[key] === opt ? 'bg-[#A259FF] text-white border-[#7A36D6] shadow-[0_0_15px_rgba(162,89,255,0.3)]' : 'bg-[#F7F8FC] text-[#5B6472] border-gray-100'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <SocialShare title="Hair Fall Analyzer" url={window.location.href} />

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartAnalysis} 
              className="w-full mt-12 py-6 rounded-2xl bg-[#FFB400] text-[#0B0F1A] font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,180,0,0.3)] flex items-center justify-center gap-3 transition-all"
            >
              Analyze Hair <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="mt-8">
           <SEOContentSection content={FEATURE_SEO_CONTENT['hair-fall']} />
        </div>
      </div>
    </div>
  );
}


