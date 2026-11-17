import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  ChevronLeft, 
  Zap, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Stethoscope,
  Info,
  Smartphone,
  Share2,
  Activity,
  Wind,
  Flame,
  Moon,
  Utensils
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis } from 'recharts';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFeaturePricing } from '../lib/pricing';
import { generateHeartHealthAnalysis } from '../lib/gemini';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import axios from 'axios';
import PremiumPaywall from '../components/PremiumPaywall';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import ResultCard from '../components/report/ResultCard';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import UpgradeCTA from '../components/report/UpgradeCTA';

export default function HeartHealthResultScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-emerald-500 bg-emerald-50';
    if (score < 70) return 'text-amber-600 bg-amber-50';
    return 'text-rose-600 bg-rose-50';
  };

  const [profile, setProfile] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pricing = getFeaturePricing('heart-health', appConfig);

  useEffect(() => {
    if (profileId) fetchProfile();
  }, [profileId, userData]);

  const fetchProfile = async () => {
    try {
      const pId = profileId!;
      
      // 1. Fetch from Local Storage first (synchronous-like)
      const localData = await getProfileLocally(pId);
      
      // 2. Fetch from Firestore
      const profileRef = doc(db, 'health_profiles', pId);
      const docSnap = await getDoc(profileRef);
      let firestoreData = docSnap.exists() ? docSnap.data() : null;
      
      // Merge: Local data is primary for 'isPaid' to avoid paywall lag
      let data = { ...firestoreData, ...localData };

      if (data && Object.keys(data).length > 0) {
        setProfile(data);
        
        // Use Gemini to generate result ONLY if not already present
        if (data.isPaid && !data.results && !data.analysis) {
          try {
            console.log("Generating fresh analysis for:", pId);
            const result = await generateHeartHealthAnalysis((data as any).data || data);
            if (result) {
              setAnalysis(result);
              // Save to prevent regeneration
              const updates = { analysis: result };
              try {
                 if (userData?.uid && userData.uid !== 'guest') {
                   await updateDoc(profileRef, updates);
                 }
                 await updateProfileLocally(pId, updates);
              } catch(e) { console.warn("Failed to sync AI results to DB"); }
            }
          } catch (aiError) {
            console.error("AI Analysis Error:", aiError);
          }
        } else {
          setAnalysis(data.analysis || data.results);
        }
      } else {
        // If no data found at all
        if (!loading) navigate('/heart-health');
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (plan: any) => {
    if (!profileId || !userData?.uid) return;
    setLoading(true);

    try {
      const isDeveloper = userData?.email?.toLowerCase() === 'help@ayurzenix.in';
      if (isDeveloper) {
          const updates = { isPaid: true, planId: plan.id };
          await updateProfileLocally(profileId, updates);
          setProfile((prev: any) => ({ ...prev, ...updates }));
          return;
      }

      if (plan.price === 0) {
        const updates = { isPaid: true, planId: 'basic' };
        await updateProfileLocally(profileId, updates);
        setProfile((prev: any) => ({ ...prev, ...updates }));
        return;
      }

      const balance = Number(userData.wallet_balance || 0);
      if (balance >= plan.price) {
        const response = await axios.post('/api/wallet/unlock', {
          userId: userData.uid,
          planId: plan.id,
          amount: plan.price,
          featureName: 'Heart Health Analysis',
          profileId: profileId
        });

        if (response.data.success) {
          const updates = { isPaid: true, planId: plan.id };
          await updateProfileLocally(profileId, updates);
          setProfile((prev: any) => ({ ...prev, ...updates }));
        }
      } else {
        navigate(`/analysis-pricing/${profileId}`);
      }
    } catch (e: any) {
      console.error("Unlock error:", e);
      const errorMessage = e.response?.data?.error || e.message || "Failed to unlock report";
      alert("Unlock Error: " + errorMessage);
      navigate(`/analysis-pricing/${profileId}`);
    } finally {
      setLoading(false);
    }
  };

  const isPaid = profile?.isPaid;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FFFC] flex flex-col items-center justify-center p-6 space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative"
        >
          <Heart className="w-16 h-16 text-[#FF6B6B]" fill="#FF6B6B" />
          <motion.div 
             animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
             transition={{ repeat: Infinity, duration: 1.5 }}
             className="absolute inset-0 bg-[#FF6B6B] rounded-full"
          />
        </motion.div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Processing Intelligence...</h2>
          <p className="text-gray-500 font-medium animate-pulse text-sm">Decoding cardiovascular biomarkers</p>
        </div>
      </div>
    );
  }

  // Show paywall if not paid
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-[#F8FFFC]">
        <div className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <button onClick={() => navigate('/heart-health')} className="p-2 -ml-2 text-gray-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <span className="text-sm font-black text-gray-900 uppercase tracking-widest text-[10px]">Report Available</span>
          <div className="w-10" />
        </div>
        <PremiumPaywall 
          pricing={pricing}
          onSelect={handlePlanSelect}
          isLoading={loading}
        />
      </div>
    );
  }
  const reportPlanId = profile?.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  const radarData = [
    { subject: 'Pulse', A: analysis?.riskScore ? 100 - analysis.riskScore : 85, fullMark: 100 },
    { subject: 'Stress', A: analysis?.riskScore || 45, fullMark: 100 },
    { subject: 'Vata', A: 72, fullMark: 100 },
    { subject: 'Ojas', A: 88, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FFFC] pb-32 font-sans selection:bg-rose-100">
      {/* Sticky Header */}
      <div className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <button onClick={() => navigate('/heart-health')} className="p-2 -ml-2 text-gray-400">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-sm font-black text-gray-900">Heart Health Analysis</span>
        <button className="p-2 -mr-2 text-gray-400"><Share2 className="w-5 h-5" /></button>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* MANDATORY REPORT HEADER */}
        <section className="mb-12 bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Heart Health Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{analysis?.conditionName || 'General Assessment'}</span>
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
                        <p><strong>Wellness Score:</strong> {analysis?.riskScore ? 100 - analysis.riskScore : 78}/100</p>
                        <p><strong>Dominant Dosha:</strong> {analysis?.doshaHeader?.dominant || 'N/A'}</p>
                        <p><strong>Root Cause:</strong> {analysis?.rootCause || 'Based on your signals, we see temporary imbalances.'}</p> 
                        <p><strong>Key Insight:</strong> {analysis?.deepInsight ? analysis.deepInsight.substring(0, 150) + "..." : "Understanding your cardiovascular signals is the first step to balance."}</p>
                        <p><strong>Home Remedy:</strong> {analysis?.homeRemedies?.[0]?.name || "Consult your practitioner for personalized herbal support."}</p>
                        <p><strong>Lifestyle Tip:</strong> {analysis?.routine?.lifestyleTips?.[0] || "Practice daily breathing for circulatory stability."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={analysis?.riskScore || 0}
          title={isPremium ? "Total Vitality Decoded." : isPro ? "Advanced Heart Analysis." : "Core Heart Pulse."}
          subtitle="Cardiovascular Intelligence"
          label="Heart Vitality Index"
          color="text-[#FF6B6B]"
          accentColor="bg-rose-500/10"
          onShare={() => {}}
        />

        {/* Emergency Alert */}
        {profile?.isEmergency && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-rose-600 p-6 rounded-3xl text-white space-y-3 shadow-lg shadow-rose-200"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
              <h3 className="font-black tracking-tight">URGENT CAUTION</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              High BP or chest pain detected. Please seek immediate physical consultation with a specialist.
            </p>
          </motion.div>
        )}

        {/* Paid Results Section */}
        <div className="space-y-6">
          {/* Actionable Metrics Radar */}
          <div className="bg-white p-4 rounded-[3rem] shadow-sm border border-black/[0.03]">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Health" dataKey="A" stroke="#FF6B6B" fill="#FF6B6B" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-8 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] text-white shadow-xl"
          >
             <h3 className="text-2xl font-black mb-4">Ayurvedic Verdict</h3>
             <p className="text-sm text-indigo-100 italic leading-relaxed">"{analysis?.doshaHeader?.verdict || "Your cardiovascular profile shows signs of Vata imbalance. Grounding and warming protocols are recommended."}"</p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-[-20%] right-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-teal-100/30 rounded-full blur-[80px] pointer-events-none" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100/50 text-teal-500 shadow-inner flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              Detailed Risk Breakdown
            </h3>
            
            <div className="space-y-4">
              {analysis?.breakdown ? (
                analysis.breakdown.map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50/50 backdrop-blur-sm border border-slate-100 shadow-sm rounded-2xl relative z-10">
                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                    <span className={`text-sm font-black ${getRiskColor(item.score).split(' ')[0]}`}>{item.status}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-400 font-bold italic">
                  Initial insights are being generated...
                </div>
              )}
            </div>
          </motion.div>

        {/* Ashtanga Hridayam Vedic Wisdom Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="bg-stone-950 p-10 rounded-[3rem] text-white space-y-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-500">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-xl font-black tracking-tight uppercase">Vedic Wisdom</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-bold text-gray-400 italic">
                  "Hridaya is the root of Ojas. When the heart is protected, the life force remains stable."
                </p>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Ashtanga Hridayam Insight</p>
                   <p className="text-sm font-medium leading-relaxed text-gray-300">
                      {analysis?.premium?.ashtangaGita || "Vagbhata teaches that the heart is the seat of Sadhaka Pitta. Your results indicate that your lifestyle is affecting this internal fire. Strengthening your Ojas through 'Hrdya' herbs is critical for your recovery."}
                   </p>
                </div>
              </div>

              {analysis?.ashtangaTips && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  {analysis.ashtangaTips.map((tip: any, i: number) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1">
                      <p className="text-xs font-black text-emerald-400 uppercase tracking-tight">{tip.title}</p>
                      <p className="text-[10px] font-bold text-gray-400 leading-relaxed">{tip.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

            {/* Root Cause - PRO+ */}
            {(isPro || isPremium) && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-[-20%] left-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-orange-100/40 rounded-full blur-[80px] pointer-events-none" />
                <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-3 relative z-10">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100/50 text-amber-500 shadow-inner flex items-center justify-center">
                    <Flame className="w-5 h-5" />
                  </div>
                  Ayurvedic Root Cause
                </h3>
                <div className="space-y-4 relative z-10">
                   <div className="p-5 bg-amber-50/50 backdrop-blur-sm shadow-sm rounded-2xl border border-amber-100/50">
                    <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Dominant Imbalance</p>
                    <p className="text-lg font-black text-slate-900">{analysis?.ayurveda?.doshaImbalance}</p>
                  </div>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                    {analysis?.ayurveda?.rootCause}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Premium Protocol - PREMIUM ONLY */}
            {isPremium ? (
              <DynamicPremiumReport data={analysis} featureName="Heart Health" />
            ) : (
              <div className="space-y-10">
                {/* Pro / Premium Nudge */}
                <UpgradeCTA 
                  targetTier={isBasic ? 'pro' : 'premium'}
                  onUpgrade={() => navigate(`/analysis-pricing/${profileId}`)}
                />
              </div>
            )}

            {/* Recommendations - PRO+ */}
            {(isPro || isPremium) && (
              <div className="space-y-6">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 text-center">Lifestyle Corrections</h3>
                 <div className="grid grid-cols-2 gap-4">
                    {analysis?.recommendations?.map((item: any, i: number) => (
                      <div key={i} className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-4 hover:border-slate-200 transition-all">
                         <div className={`w-12 h-12 rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center ${i % 2 === 0 ? 'bg-blue-50 text-blue-500' : 'bg-[#A259FF]/10 text-[#A259FF]'}`}>
                           {i % 2 === 0 ? <Moon className="w-5 h-5" /> : <Utensils className="w-5 h-5" />}
                         </div>
                         <p className="text-xs font-black text-slate-800 leading-tight">{item}</p>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
