import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Brain, 
  ChevronLeft, 
  Sparkles, 
  Heart, 
  Zap, 
  Moon, 
  AlertCircle, 
  Share2,
  Calendar,
  Activity,
  CheckCircle2,
  Star,
  Wind,
  Shield,
  Layers,
  Sun,
  LayoutGrid,
  Lock,
  ArrowRight,
  Droplets
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getProfileLocally } from '../lib/localHistory';
import LoadingYogi from '../components/LoadingYogi';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import ResultCard from '../components/report/ResultCard';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export default function SmartMentalScanResultScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchResult = async () => {
      if (!profileId || !userData) return;
      
      // Try local history first
      const localProfile = await getProfileLocally(profileId);
      if (localProfile?.analysis) {
        setData(localProfile.analysis);
        setLoading(false);
        return;
      }

      // Try standardized health_profiles collection in Firestore
      const docRef = doc(db, 'health_profiles', profileId);
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const profileData = snap.data();
          setData(profileData.analysis || profileData);
        } else {
          // Fallback to the old nested path just in case
          const oldDocRef = doc(db, 'users', userData.uid, 'analysis_results', profileId);
          const oldSnap = await getDoc(oldDocRef);
          if (oldSnap.exists()) {
            setData(oldSnap.data());
          } else {
            console.log("No result found in any collection.");
          }
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, docRef.path);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [profileId, userData]);

  if (loading) return <LoadingYogi message="Visualizing Emotional Map..." fullScreenSplash />;
  if (!data) return (
    <div className="min-h-screen bg-[#F8FFFC] flex flex-col items-center justify-center p-8 text-center space-y-6">
               <div className="bg-white p-8 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex items-center justify-center text-stone-300">
          <Brain className="w-10 h-10" />
       </div>
       <h1 className="text-2xl font-black text-stone-900">Intelligence Not Found</h1>
       <p className="text-stone-500 font-medium">The analysis for this profile either doesn't exist or is still processing.</p>
       <button onClick={() => navigate(-1)} className="px-8 py-3 bg-stone-900 text-white rounded-full font-black uppercase text-xs tracking-widest">Go Back</button>
    </div>
  );

  const reportPlanId = data?.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  const metrics = data.metrics || {};
  const gunaBalance = data.gunaBalance || { sattva: 60, rajas: 30, tamas: 10 };

  return (
    <div className="min-h-screen bg-[#F8FFFC] pb-32 font-sans selection:bg-purple-100 italic-none gpu-accelerated">
      {/* Cinematic Header Overlay */}
      <div className="absolute top-0 inset-x-0 h-[40rem] bg-gradient-to-b from-purple-100/30 via-white to-transparent -z-10" />

      {/* Header */}
       <div className="px-6 pt-12 pb-6 sticky top-0 bg-white/90 backdrop-blur-2xl z-50 flex items-center justify-between border-b border-black/5">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-50 rounded-full transition-colors active:scale-90">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
           <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600">Emotional Intelligence</h1>
           <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mt-0.5">Neural Pattern decoded</p>
        </div>
        <button className="p-2 hover:bg-stone-50 rounded-full">
          <Share2 className="w-5 h-5 text-stone-600" />
        </button>
      </div>

      <div className="p-6 space-y-12">
        {/* MANDATORY REPORT HEADER */}
        <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Mental Health Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{data.conditionName || 'Mental Scan'}</span>
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
                        <p><strong>Wellness Score:</strong> {data.overallScore || 78}/100</p>
                        <p><strong>Dominant Dosha:</strong> {data.dominantDosha || 'N/A'}</p>
                        <p><strong>Root Cause:</strong> {data.rootCause?.substring(0, 100) + "..." || 'Based on your signals.'}</p> 
                        <p><strong>Key Insight:</strong> {data.deepInsights?.[0]?.substring(0, 150) + "..." || "Understanding your signals is the first step to balance."}</p>
                        <p><strong>Home Remedy:</strong> {data.recommendations?.mantra ? "Mantra practice" : "Consult your practitioner."}</p>
                        <p><strong>Lifestyle Tip:</strong> {data.recommendations?.lifestyle?.[0] || "Maintain regular habits."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={data.overallScore || 0}
          title={isPremium ? "Full Consciousness Decoded." : isPro ? "Deep Emotional Map." : "Core Neural Pulse."}
          subtitle="Emotional Intelligence"
          label="Resilience Intelligence Index"
          color="text-purple-600"
          accentColor="bg-purple-600/10"
          onShare={() => {}}
        />

        {/* Dynamic Universal Premium Report Section */}
        {isPremium && (
          <DynamicPremiumReport data={data} featureName="Mental Health" />
        )}

        {/* Intelligence Matrix Grid - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Intelligence Matrix</h3>
                <LayoutGrid className="w-4 h-4 text-stone-300" />
             </div>
             
             <StandardMetricGrid 
               metrics={[
                 { label: 'Stress Score', value: metrics.stressScore, icon: Zap, color: 'text-amber-600' },
                 { label: 'Anxiety Load', value: metrics.anxietyLoad, icon: Wind, color: 'text-teal-600' },
                 { label: 'Stability', value: metrics.emotionalStability, icon: Activity, color: 'text-red-600' },
                 { label: 'Resilience', value: metrics.mentalResilience, icon: Shield, color: 'text-purple-600' },
                 { label: 'Neural Sync', value: metrics.nervousSystemBalance, icon: Layers, color: 'text-indigo-600' },
                 { label: 'Sleep Recovery', value: metrics.sleepRecoveryScore, icon: Moon, color: 'text-blue-600' },
                 { label: 'Burnout Risk', value: metrics.burnoutRisk, icon: AlertCircle, color: 'text-stone-600' },
                 { label: 'Emotion Energy', value: metrics.emotionalEnergy, icon: Heart, color: 'text-pink-600' },
               ]}
             />
          </section>
        )}

        {/* Sattva / Rajas / Tamas Ratio - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Consciousness Ratio (Gunas)</h3>
                <Droplets className="w-4 h-4 text-stone-300" />
             </div>
             <div className="bg-white rounded-[3rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-8 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-[200px] max-h-[200px] rounded-full blur-[60px] bg-[#A259FF]/10 pointer-events-none" />
                <div className="h-4 w-full flex rounded-full overflow-hidden shadow-inner bg-slate-50 border border-slate-100 relative z-10">
                   <div style={{ width: `${gunaBalance.sattva}%` }} className="h-full bg-emerald-500 relative group gpu-accelerated">
                      <div className="absolute inset-0 bg-white/20 animate-pulse opacity-0 group-hover:opacity-100" />
                   </div>
                   <div style={{ width: `${gunaBalance.rajas}%` }} className="h-full bg-amber-500" />
                   <div style={{ width: `${gunaBalance.tamas}%` }} className="h-full bg-stone-900" />
                </div>
                <div className="grid grid-cols-3 gap-6">
                   {[
                     { label: 'Sattva', value: gunaBalance.sattva, desc: 'Clarity & Peace', color: 'bg-emerald-500' },
                     { label: 'Rajas', value: gunaBalance.rajas, desc: 'Agitation & Drive', color: 'bg-amber-500' },
                     { label: 'Tamas', value: gunaBalance.tamas, desc: 'Heaviness & Inertia', color: 'bg-stone-900' }
                   ].map((g, i) => (
                     <div key={i} className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-1.5">
                           <div className={`w-2 h-2 rounded-full ${g.color}`} />
                           <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">{g.label}</span>
                        </div>
                        <p className="text-2xl font-black text-stone-900">{g.value}%</p>
                        <p className="text-[8px] font-bold text-stone-400 uppercase leading-tight tracking-tighter">{g.desc}</p>
                     </div>
                   ))}
                </div>
                <div className="pt-6 border-t border-slate-100 relative z-10">
                   <p className="text-xs font-medium text-slate-600 leading-relaxed italic text-center">
                     “Your mind is currently transitioning from <span className="font-black text-amber-600">Rajas</span> to <span className="font-black text-emerald-600">Sattva</span>. Biological synchronization is required.”
                   </p>
                </div>
             </div>
          </section>
        )}

        {/* Root Cause & Deep Insights - BASIC+ */}
        <section className="space-y-6">
           <div className="flex items-center gap-4 bg-white p-8 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100/30 rounded-full blur-[40px]" />
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/50 shadow-inner">
                 <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 relative z-10">
                 <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Root Imbalance (Vigyan)</p>
                 <p className="text-sm font-bold text-slate-800 leading-relaxed italic">{data.rootCause}</p>
              </div>
           </div>

           {(isPro || isPremium) && (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400 px-2">Neural Insights</h3>
                <div className="space-y-3">
                   {(data.deepInsights || []).map((insight: string, i: number) => (
                     <div key={i} className="bg-white p-6 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex gap-4 items-start hover:border-purple-500/20 transition-all">
                        <div className="mt-1 w-2 h-2 rounded-full bg-[#A259FF] shrink-0 shadow-[0_0_10px_#A259FF]" />
                        <p className="text-sm font-medium text-slate-700 leading-relaxed italic">{insight}</p>
                     </div>
                   ))}
                </div>
              </div>
           )}
        </section>

        {/* Recommendations - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-8">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">Restoration Protocol</h3>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
             </div>

             <div className="space-y-4">
                {isPremium && (
                  <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-6 shadow-xl relative overflow-hidden">
                     <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-[#A259FF]/20 rounded-full blur-[100px] pointer-events-none" />
                     <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                           <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[#A259FF]">Veda Master Mantra</h4>
                     </div>
                     <p className="text-2xl font-bold italic tracking-tighter text-white relative z-10">“{data.recommendations.mantra}”</p>
                     <p className="text-[10px] font-medium text-slate-400 relative z-10">Chant 108 times daily during Brahma Muhurta (4:00 AM - 6:00 AM).</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                   <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex gap-5 items-center hover:border-blue-500/20 transition-all">
                      <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/50 shadow-inner">
                         <Wind className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Pranayama Sync</p>
                         <p className="text-sm font-bold text-slate-900">{(data.recommendations.pranayama || []).join(', ')}</p>
                      </div>
                   </div>

                   <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] flex gap-5 items-center hover:border-teal-500/20 transition-all">
                      <div className="w-14 h-14 bg-teal-50 text-teal-500 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100/50 shadow-inner">
                         <Activity className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest">Guna Balance Diet</p>
                         <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">{(data.recommendations.diet || []).slice(0, 3).join(', ')}...</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03]">
                   <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 border border-amber-100/50 shadow-inner flex items-center justify-center">
                        <Sun className="w-4 h-4" />
                     </div>
                     Lifestyle Adjustments
                   </h4>
                   <div className="space-y-4 pt-2">
                      {(data.recommendations.lifestyle || []).map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 items-center text-sm font-bold text-slate-600 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                           <div className="w-2 h-2 rounded-full bg-slate-300" />
                           {item}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </section>
        )}

        {/* Roadmap - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">7-Day Healing Protocol</h3>
                <Calendar className="w-4 h-4 text-stone-300" />
             </div>
             
             <div className="space-y-4">
                {(data.protocol || []).map((step: any, i: number) => (
                  <div key={i} className="bg-white rounded-[2rem] p-6 border border-stone-100 flex items-start gap-5 relative overflow-hidden group">
                     <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500" />
                     <div className="text-2xl font-black text-stone-200 group-hover:text-purple-100 transition-colors">
                        {step.day < 10 ? `0${step.day}` : step.day}
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest">{step.focus}</p>
                        <p className="text-sm font-bold text-stone-800 italic leading-snug">{step.task}</p>
                     </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* 30-Day Roadmap - PREMIUM */}
        {isPremium && (
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-stone-400">30-Day Evolution Matrix</h3>
              <Zap className="w-4 h-4 text-amber-500" />
           </div>
           <div className="space-y-4">
              {(data.transformationroadmap || []).map((step: any, i: number) => (
                <div key={i} className="bg-stone-950 rounded-[2rem] p-8 border border-white/5 space-y-4">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Phase 0{step.week}</p>
                      <div className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase text-stone-500">Locked In</div>
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-lg font-black text-white italic">{step.focus}</h4>
                      <p className="text-sm font-medium text-stone-400 leading-relaxed italic">{step.outcome}</p>
                   </div>
                </div>
              ))}
           </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 flex gap-4">
           <AlertCircle className="w-5 h-5 text-stone-300 shrink-0" />
           <p className="text-[10px] text-stone-400 font-bold leading-relaxed italic uppercase">
             {data.disclaimer}
           </p>
        </div>
      </div>

       {/* Sticky Footer CTA */}
       <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40 backdrop-blur-sm">
        <button 
          onClick={() => navigate('/chat')}
          className="w-full bg-stone-900 text-white py-5 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-purple-200 flex items-center justify-center gap-4 transition-all active:scale-95 border border-white/10"
        >
          Activate Recovery Protocol
          <Zap className="w-4 h-4 fill-purple-400 text-purple-400" />
        </button>
      </div>
    </div>
  );
}
