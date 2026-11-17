import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { 
  ArrowLeft, 
  Flame, 
  Zap, 
  Activity, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  Brain,
  Droplets,
  Heart,
  Moon,
  Utensils,
  Sun,
  ShieldCheck,
  TrendingUp,
  Thermometer,
  Clock
} from 'lucide-react';
import { analyzeAgni } from '../services/geminiService';
import LoadingYogi from '../components/LoadingYogi';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function AgniEngineResultScreen({ userData }: { userData: any }) {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndAnalyze = async () => {
      if (!profileId) return;
      try {
        const p = await getProfileLocally(profileId);
        if (!p) {
          navigate('/');
          return;
        }
        setProfile(p);

        if (p.analysis && p.analysis.agniType) {
          setAnalysis(p.analysis);
          setLoading(false);
        } else {
          // Perform AI Analysis
          const result = await analyzeAgni(p.inputs, userData?.language || 'English');
          setAnalysis(result);
          setLoading(false);
          
          try {
             const updates = { analysis: result };
             await updateProfileLocally(profileId, updates);
             
             // Sync to Firestore if user is logged in
             if (userData?.uid && !userData.is_guest) {
                const profileRef = doc(db, 'health_profiles', profileId || '');
                await updateDoc(profileRef, updates);
             }
          } catch(e) { console.error("Failed to save Agni analysis", e); }
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchAndAnalyze();
  }, [profileId, userData]);

  if (loading) return <LoadingYogi />;
  if (!analysis) return (
    <div className="min-h-screen bg-[#F8FFFC] flex flex-col items-center justify-center p-10 text-center gap-6">
      <div className="w-20 h-20 rounded-3xl bg-ayur-neon/10 flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-ayur-neon" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase italic tracking-tighter">Engine Sync Error</h2>
        <p className="text-stone-400 text-sm font-medium">Metabolic Data failed to synchronize correctly.</p>
      </div>
      <button 
        onClick={() => navigate('/')}
        className="px-8 py-4 bg-black text-white rounded-full font-black uppercase text-[10px] tracking-widest"
      >
        Return to Home
      </button>
    </div>
  );

  const { agniType, analysis: detailedAnalysis, scores } = analysis;

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const reportPlanId = profile?.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  const menuItems = [
    { id: 'summary', title: 'Personalized Insight', icon: <Sparkles />, content: detailedAnalysis.personalizedInsightSummary, show: true },
    { id: 'dosha', title: 'Dosha Analysis', icon: <Brain />, content: detailedAnalysis.dominantDoshaAnalysis, show: isPro || isPremium },
    { id: 'imbalance', title: 'Imbalance Detection', icon: <AlertCircle />, content: detailedAnalysis.imbalanceDetection, show: isPro || isPremium },
    { id: 'root', title: 'Root Cause', icon: <Activity />, content: detailedAnalysis.rootCauseExplanation, show: isPro || isPremium },
    { id: 'remedies', title: 'Home Remedies (Nuskha)', icon: <Zap />, content: detailedAnalysis.recommendedRemedies, show: isPro || isPremium },
    { id: 'diet', title: 'Diet (Ahara)', icon: <Utensils />, content: detailedAnalysis.dietRecommendations, show: isPro || isPremium },
    { id: 'avoid', title: 'Avoid (Pathya-Apathya)', icon: <AlertCircle />, content: detailedAnalysis.foodsToAvoid, show: isPro || isPremium },
    { id: 'routine', title: 'Daily Routine', icon: <Clock />, content: detailedAnalysis.dailyRoutine, show: isPro || isPremium },
    { id: 'yoga', title: 'Yoga & Meditation', icon: <Activity />, content: detailedAnalysis.yogaMeditation, show: isPro || isPremium },
    { id: 'mind', title: 'Sleep & Stress', icon: <Moon />, content: detailedAnalysis.sleepStressGuidance, show: isPro || isPremium },
    { id: 'detox', title: 'Hydration & Detox', icon: <Droplets />, content: detailedAnalysis.hydrationDetox, show: isPremium },
    { id: 'herbs', title: 'Herbal Solutions', icon: <Activity />, content: detailedAnalysis.herbalSuggestions, show: isPremium },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-[#F8FFFC] selection:bg-orange-500/10 pb-32">
      
      {/* Premium Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-[100] px-6 py-6 bg-white/80 backdrop-blur-3xl border-b border-black/5 flex items-center justify-between"
      >
        <button onClick={() => navigate('/')} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-stone-50 border border-stone-100 text-stone-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
            <h1 className="text-xl font-black text-black uppercase tracking-tighter italic">Agni Engine Report</h1>
            <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest leading-none mt-1">Bio-Metric Ledger v1.0</p>
        </div>
        <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xl shadow-orange-500/20 active:scale-90 transition-all">
          <Share2 className="w-5 h-5" />
        </button>
      </motion.header>

      <main className="max-w-xl mx-auto px-6 pt-12 space-y-12">
        {/* MANDATORY REPORT HEADER */}
        <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Agni Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{agniType || 'Metabolic Assessment'}</span>
                  </div>
                  <div className="px-4 py-2 bg-emerald-100 rounded-full">
                      <span className="text-[10px] font-black text-emerald-800 uppercase">{reportPlanId} Plan</span>
                  </div>
              </div>
           </div>
        </section>

        {/* STRUCTURED REPORT SECTIONS */}
        <section className="space-y-8">
            {isBasic && (
                <div className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm space-y-4">
                    <h2 className="text-sm font-black text-black uppercase tracking-widest">Wellness Essentials</h2>
                    <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                        <p><strong>Wellness Score:</strong> {scores?.overall || 78}/100</p>
                        <p><strong>Dominant Dosha:</strong> {detailedAnalysis?.dominantDoshaAnalysis?.split(' ')[0] || 'N/A'}</p>
                        <p><strong>Root Cause:</strong> {detailedAnalysis?.rootCauseExplanation?.substring(0, 100) + "..." || 'Based on your signals.'}</p> 
                        <p><strong>Key Insight:</strong> {detailedAnalysis?.personalizedInsightSummary?.substring(0, 150) + "..." || "Understanding your body's subtle signals is the first step to balance."}</p>
                        <p><strong>Home Remedy:</strong> {detailedAnalysis?.recommendedRemedies?.substring(0, 50) || "Consult your practitioner."}</p>
                        <p><strong>Lifestyle Tip:</strong> {detailedAnalysis?.dailyRoutine?.substring(0, 50) || "Maintain regular habits."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={92}
          title={`${agniType} STATUS`}
          subtitle="Engine Synchronized"
          label="Metabolic Precision Index"
          color="text-ayur-neon"
          accentColor="bg-ayur-neon/10"
          onShare={() => {}}
        />

        <div className="max-w-xs mx-auto space-y-4 relative z-10 text-center">
            <div className="w-1.5 h-12 bg-ayur-neon mx-auto rounded-full shadow-[0_0_15px_#CCFF00]" />
            <p className="text-sm font-bold text-gray-500 italic leading-relaxed">
              "{detailedAnalysis.personalizedInsightSummary.split('.')[0]}."
            </p>
        </div>

        {/* Core Metrics Grid */}
        <StandardMetricGrid 
          metrics={[
            { label: 'Energy Index', value: scores.energyScore, icon: Zap, color: 'text-ayur-neon' },
            { label: 'Ama Toxins', value: scores.amaLevel, icon: Thermometer, color: 'text-red-500' }
          ]}
        />

        {/* Detailed Analysis Timeline */}
        <div className="space-y-4">
            <div className="flex items-center gap-3 px-4 mb-4">
                <Activity className="w-5 h-5 text-black" />
                <h3 className="text-sm font-black text-black uppercase tracking-[0.2em] italic">Transformation Protocol</h3>
            </div>
            
            <div className="space-y-3">
                {menuItems.map((item) => (
                    <motion.div 
                        key={item.id}
                        className={`bg-white rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${expandedSection === item.id ? 'border-[#CCFF00]/40 ring-4 ring-[#CCFF00]/10' : 'border-black/[0.03]'}`}
                    >
                        <button 
                            onClick={() => toggleSection(item.id)}
                            className="w-full p-6 flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner border border-slate-100 ${expandedSection === item.id ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-slate-50 text-slate-500 group-hover:text-[#CCFF00]'}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-sm font-black uppercase tracking-tight text-slate-800 italic`}>
                                    {item.title}
                                </span>
                            </div>
                            {expandedSection === item.id ? <ChevronUp className="w-5 h-5 text-[#CCFF00]" /> : <ChevronDown className="w-5 h-5 text-slate-300" />}
                        </button>
                        
                        <AnimatePresence>
                            {expandedSection === item.id && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-8"
                                >
                                    <div className="w-full h-px bg-slate-100 mb-6" />
                                    <p className="text-slate-600 font-medium text-lg leading-relaxed border-l-4 pl-6 border-[#CCFF00]/30 italic">
                                        {item.content}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Motivational Footer */}
        <section className="p-10 rounded-[3rem] bg-ayur-neon text-black space-y-8 relative overflow-hidden shadow-2xl shadow-ayur-neon/20">
            <Sparkles className="absolute top-10 right-10 w-24 h-24 text-black/5" />
            <div className="relative z-10 space-y-4">
                <h4 className="text-3xl font-black italic tracking-tighter uppercase leading-none">The Ayurzenix <br/>Spirit</h4>
                <p className="text-xl font-medium opacity-90 leading-relaxed border-l-4 pl-6 border-black/20 italic">
                    {detailedAnalysis.motivationalMessage}
                </p>
            </div>
            
            <div className="pt-4 relative z-10">
                <button
                   onClick={() => navigate('/referral')}
                   className="w-full py-5 bg-black text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    Share My Engine Status <Share2 className="w-5 h-5" />
                </button>
            </div>
        </section>

        {/* Viral Shareability Layer placeholder */}
        <div className="text-center pt-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-stone-100 rounded-full text-[10px] font-black text-stone-400 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Privacy-Locked Ledger
            </div>
        </div>

      </main>
    </div>
  );
}
