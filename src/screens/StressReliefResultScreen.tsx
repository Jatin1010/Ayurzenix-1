import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  Zap, 
  Sparkles, 
  Brain, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Activity, 
  AlertCircle,
  Clock3,
  ChevronRight,
  Droplets,
  Sun,
  Shield,
  Eye,
  Coffee,
  Smartphone,
  Flame,
  Wind,
  Droplet,
  Waves,
  ZapOff,
  CloudLightning,
  Dna
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis as RadarPolarAngleAxis,
  Radar
} from 'recharts';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { cn } from '../lib/utils';
import LoadingYogi from '../components/LoadingYogi';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import { analyzeStressRelief } from '../lib/gemini';

// --- Sub-Components ---

const DoshaSilhoutte = ({ vata, pitta, kapha }: { vata: number, pitta: number, kapha: number }) => (
  <div className="relative w-full aspect-[3/4] flex items-center justify-center p-8 bg-white/40 rounded-[2.5rem] border border-black/[0.03]">
    <svg viewBox="0 0 100 150" className="w-full h-full text-stone-100">
      <path d="M50,15 C55,15 60,18 60,25 C60,32 55,35 50,35 C45,35 40,32 40,25 C40,18 45,15 50,15 M40,35 L60,35 L65,70 L60,130 L40,130 L35,70 Z" fill="currentColor" />
      <circle cx="50" cy="25" r="12" className={cn("transition-all duration-1000", vata > 50 ? "fill-purple-500/20 stroke-purple-500 stroke-[0.5]" : "fill-transparent")} />
      <circle cx="50" cy="65" r="15" className={cn("transition-all duration-1000", pitta > 50 ? "fill-rose-500/20 stroke-rose-500 stroke-[0.5]" : "fill-transparent")} />
      <circle cx="50" cy="110" r="18" className={cn("transition-all duration-1000", kapha > 50 ? "fill-teal-500/20 stroke-teal-500 stroke-[0.5]" : "fill-transparent")} />
    </svg>
    <div className="absolute inset-x-8 bottom-8 flex justify-between">
      <div className="text-center">
        <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-1"><Wind className="w-4 h-4" /></div>
        <p className="text-[10px] font-black text-black">{vata}%</p>
      </div>
      <div className="text-center">
        <div className="w-9 h-9 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-1"><Flame className="w-4 h-4" /></div>
        <p className="text-[10px] font-black text-black">{pitta}%</p>
      </div>
      <div className="text-center">
        <div className="w-9 h-9 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-1"><Droplet className="w-4 h-4" /></div>
        <p className="text-[10px] font-black text-black">{kapha}%</p>
      </div>
    </div>
  </div>
);

const ResilienceRadar = ({ resilience, clarity, stamina }: { resilience: number, clarity: number, stamina: number }) => {
  const data = [
    { subject: 'Resilience', A: resilience },
    { subject: 'Clarity', A: clarity },
    { subject: 'Stamina', A: stamina },
    { subject: 'Calm', A: 100 - (resilience + clarity + stamina) / 3 },
  ];
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <RadarPolarAngleAxis dataKey="subject" tick={{ fontSize: 8, fontWeight: 900, fill: '#9ca3af' }} />
          <Radar name="Neuro" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function StressReliefResultScreen({ userData }: { userData: any }) {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (profile: any) => {
    try {
      const result = await analyzeStressRelief(profile, 'en', profile.planId || 'basic');
      const updatedProfile = { ...profile, analysis: result, status: 'completed' };
      await updateProfileLocally(profileId!, updatedProfile);
      
      if (userData?.uid && !userData.is_guest) {
        try {
          await updateDoc(doc(db, 'health_profiles', profileId!), { analysis: result, status: 'completed' });
        } catch (e) { console.warn(e); }
      }
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Analysis linkage failed. Please restart.");
    }
  }, [profileId, userData]);

  useEffect(() => {
    const load = async () => {
      if (!profileId) return;
      setLoading(true);
      const res = await getProfileLocally(profileId);
      if (!res) { setError("Profile registry missing."); setLoading(false); return; }
      if (res.analysis) { setData(res.analysis); setLoading(false); return; }
      await performAnalysis(res);
      setLoading(false);
    };
    load();
  }, [profileId, performAnalysis]);

  if (loading) return <LoadingYogi fullScreenSplash message="Mapping Cortisol Architecture..." />;
  if (error || !data) return (
    <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-stone-50">
      <AlertCircle className="w-12 h-12 text-rose-500 mb-6" />
      <h2 className="text-2xl font-black mb-2">Sync Interrupted</h2>
      <button onClick={() => navigate(-1)} className="px-8 py-3 bg-black text-white rounded-full font-bold">Try Re-Sync</button>
    </div>
  );

  const reportPlanId = data.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  return (
    <div className="min-h-screen bg-[#F8FFFC] pb-40 font-sans selection:bg-emerald-100">
      {/* Cinematic Metabar */}
      <header className="px-6 py-6 sticky top-0 bg-white/80 backdrop-blur-3xl z-50 border-b border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-50 rounded-full border border-stone-100 transition-all">
            <ChevronLeft className="w-5 h-5 text-stone-950" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xs font-black text-black uppercase tracking-[0.2em] leading-none">Manas Intelligence</h1>
            <span className="text-[9px] font-bold text-stone-400 mt-1 uppercase tracking-widest">Biological Resonance Report</span>
          </div>
        </div>
        <div className="bg-emerald-950 text-white px-5 py-2 rounded-2xl flex items-center gap-3 shadow-lg group">
          <Heart className="w-3 h-3 text-emerald-400 group-hover:scale-125 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{reportPlanId.toUpperCase()} GUARD</span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 pt-10 space-y-12">
        {/* MANDATORY REPORT HEADER */}
        <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Stress Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{data.conditionName || 'Stress Assessment'}</span>
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
                        <p><strong>Dominant Dosha:</strong> {data.ayurvedicAnalysis?.dominantDosha || 'N/A'}</p>
                        <p><strong>Root Cause:</strong> {data.ayurvedicAnalysis?.rootCause?.substring(0, 100) + "..." || 'Based on your signals.'}</p> 
                        <p><strong>Key Insight:</strong> {data.ayurvedicAnalysis?.imbalanceExplanation?.substring(0, 150) + "..." || "Understanding your signals is the first step to balance."}</p>
                        <p><strong>Home Remedy:</strong> {data.recommendations?.mantra ? "Mantra practice" : "Consult your practitioner."}</p>
                        <p><strong>Lifestyle Tip:</strong> {data.recommendations?.lifestyle?.[0] || "Maintain regular habits."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={data.overallScore || 0}
          title={isPremium ? "Full Stability Mastered." : isPro ? "Deep Cortisol Mapping." : "Core Stress Pulse."}
          subtitle="Manas Cognitive Pulse"
          label="Emotional Resilience Index"
          color="text-emerald-600"
          accentColor="bg-emerald-600/10"
          onShare={() => {}}
        />

        {/* Dynamic Universal Premium Report Section */}
        {isPremium && (
          <DynamicPremiumReport data={data} featureName="Stress Relief" />
        )}

        {/* AI Mental insight - BASIC+ */}
        <section className="bg-emerald-950 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border border-white/5">
           <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500 rounded-full blur-[140px] opacity-20 -z-0" />
           <div className="relative z-10 flex gap-8">
             <div className="w-28 h-28 shrink-0 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group">
               <Waves className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
             </div>
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Manas Insight AI</span>
                </div>
                <p className="text-lg font-black italic tracking-tight leading-relaxed">
                  "{data.ayurvedicAnalysis?.rootCause || 'Your nervous system is processing high-density emotional input.'}"
                </p>
                {(isPro || isPremium) && (
                  <p className="text-stone-400 text-sm font-medium italic leading-relaxed opacity-80">
                    {data.ayurvedicAnalysis?.imbalanceExplanation}
                  </p>
                )}
             </div>
           </div>
        </section>

        {/* Vitality Matrix - PRO+ */}
        {(isPro || isPremium) && (
          <StandardMetricGrid 
            metrics={[
              { label: 'Anxiety', value: data.metrics?.anxietyLoad, color: 'text-rose-600', icon: CloudLightning },
              { label: 'Focus', value: data.metrics?.mentalClarity, color: 'text-emerald-600', icon: Zap },
              { label: 'Recovery', value: data.metrics?.nervousSystemBalance, color: 'text-blue-600', icon: Dna },
              { label: 'Energy', value: data.metrics?.vitalityIndex || 82, color: 'text-amber-600', icon: Flame },
              { label: 'Calm', value: data.metrics?.emotionalResilience, color: 'text-purple-600', icon: Waves },
              { label: 'Burnout', value: data.metrics?.burnoutRisk, color: 'text-stone-600', icon: ZapOff }
            ]}
          />
        )}

        {/* Biological Resilience Hub - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-black italic tracking-tight">Biological Equilibrium</h3>
               <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <div className="w-2 h-2 rounded-full bg-stone-200" />
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DoshaSilhoutte 
                 vata={data.ayurvedicAnalysis?.doshaPercentages?.vata || 65} 
                 pitta={data.ayurvedicAnalysis?.doshaPercentages?.pitta || 35} 
                 kapha={data.ayurvedicAnalysis?.doshaPercentages?.kapha || 40} 
               />
               
               <div className="bg-white rounded-[2.5rem] border border-black/[0.03] p-10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-4">Resilience Radar</h4>
                    <ResilienceRadar 
                      resilience={data.metrics?.emotionalResilience || 72} 
                      clarity={data.metrics?.mentalClarity || 68} 
                      stamina={data.metrics?.nervousSystemBalance || 75} 
                    />
                  </div>
                  <div className="pt-6 border-t border-black/[0.03] space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-stone-400 uppercase tracking-widest">Stability</span>
                      <span className="text-emerald-600 font-black tracking-tight">{data.metrics?.emotionalResilience || 72}% Solid</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[72%]" />
                    </div>
                  </div>
               </div>
             </div>
          </section>
        )}

        {/* Systemic Connectivity Cards - PREMIUM */}
        {isPremium && (
          <section className="bg-white rounded-[3rem] border border-black/[0.03] p-10 space-y-8 shadow-sm">
             <header>
               <h3 className="text-lg font-black italic tracking-tight">System Connectivity</h3>
               <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest leading-none">Structural impact of emotional load</p>
             </header>
             
             <div className="space-y-6">
               {(data.bodySystemImpacts || [
                 { system: 'Neural Load (Manas)', impact: 78, color: 'purple' },
                 { system: 'Gut Flow (Annavaha)', impact: 42, color: 'amber' },
                 { system: 'Vital Breath (Prana)', impact: 65, color: 'blue' },
                 { system: 'Cellular Immunity', impact: 52, color: 'emerald' }
               ]).map((s: any, i: number) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center">
                     <p className="text-[11px] font-black italic tracking-tight text-stone-800">{s.system}</p>
                     <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{s.impact}% Tension</span>
                   </div>
                   <div className="h-2 w-full bg-stone-50 rounded-full overflow-hidden border border-black/[0.01]">
                     <motion.div 
                       initial={{ width: 0 }}
                       whileInView={{ width: `${s.impact}%` }}
                       transition={{ duration: 1, delay: i * 0.1 }}
                       className={cn("h-full rounded-full shadow-lg opacity-80", `bg-${s.color || 'blue'}-500`)} 
                      />
                   </div>
                 </div>
               ))}
             </div>
          </section>
        )}

        {/* 30-Day Master Reset Roadmap - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-8">
             <header className="px-2">
               <h3 className="text-2xl font-black italic tracking-tighter text-black">Stability Transformation</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Emotional Re-architecture plan</p>
             </header>
             
             <div className="space-y-4">
                {(data.roadmap || []).map((step: any, i: number) => (
                  <div key={i} className="group bg-white rounded-[2.5rem] border border-black/[0.03] overflow-hidden hover:border-emerald-200 transition-all shadow-sm">
                     <div className="p-8 flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-950 flex items-center justify-center text-white text-lg font-black group-hover:bg-emerald-600 transition-colors">
                          0{step.week}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 leading-none">Week Cycle</p>
                          <h4 className="text-xl font-black italic tracking-tight">{step.title}</h4>
                          <p className="text-stone-500 text-xs font-medium italic leading-relaxed">{step.focus}</p>
                        </div>
                     </div>
                     <div className="px-8 pb-8 flex flex-wrap gap-2">
                        {(step.practices || []).map((p: string) => (
                          <span key={p} className="px-4 py-2 bg-stone-50 border border-stone-100 rounded-full text-[9px] font-black text-stone-600 italic group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">{p}</span>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* Scientific Disclosure */}
        <p className="text-[10px] text-stone-300 font-medium italic text-center px-12 leading-relaxed uppercase tracking-widest">
           * AI Bio-synthesis is not a clinical diagnosis. For chronic anxiety or physiological stress, consult a registered practitioner.
        </p>
      </div>

      {/* Premium Interaction Bar */}
      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-40 backdrop-blur-3xl">
        <div className="max-w-xl mx-auto flex gap-4">
          <button 
            onClick={() => navigate('/chat')}
            className="flex-1 bg-emerald-950 text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
          >
            Start Recalibration
            <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          </button>
          <button className="w-20 bg-white border border-black/[0.05] rounded-[2rem] flex items-center justify-center active:scale-[0.95] transition-all shadow-sm">
            <Download className="w-5 h-5 text-stone-950" />
          </button>
        </div>
      </div>
    </div>
  );
}
