import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Share2, 
  Download, 
  Moon, 
  Zap, 
  Sparkles, 
  Brain, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Activity, 
  AlertCircle,
  Clock3,
  CloudMoon,
  ChevronRight,
  Droplets,
  Sun,
  Shield,
  Eye,
  Coffee,
  Smartphone,
  Flame,
  Wind,
  Droplet
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
  PolarAngleAxis
} from 'recharts';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { cn } from '../lib/utils';
import LoadingYogi from '../components/LoadingYogi';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import { analyzeSleepIntelligence } from '../lib/gemini';

// --- Sub-Components ---

const DoshaSilhoutte = ({ vata, pitta, kapha }: { vata: number, pitta: number, kapha: number }) => (
  <div className="relative w-full aspect-[3/4] flex items-center justify-center p-8 bg-white/40 rounded-[2.5rem] border border-black/[0.03]">
    <svg viewBox="0 0 100 150" className="w-full h-full text-stone-100">
      <path d="M50,15 C55,15 60,18 60,25 C60,32 55,35 50,35 C45,35 40,32 40,25 C40,18 45,15 50,15 M40,35 L60,35 L65,70 L60,130 L40,130 L35,70 Z" fill="currentColor" />
      {/* Vata - Brain Glow */}
      <circle cx="50" cy="25" r="12" className={cn("transition-all duration-1000", vata > 50 ? "fill-purple-500/20 stroke-purple-500 stroke-[0.5]" : "fill-transparent")} />
      {/* Pitta - Solar Plexus Glow */}
      <circle cx="50" cy="65" r="15" className={cn("transition-all duration-1000", pitta > 50 ? "fill-rose-500/20 stroke-rose-500 stroke-[0.5]" : "fill-transparent")} />
      {/* Kapha - Lower Glow */}
      <circle cx="50" cy="110" r="18" className={cn("transition-all duration-1000", kapha > 50 ? "fill-teal-500/20 stroke-teal-500 stroke-[0.5]" : "fill-transparent")} />
    </svg>
    <div className="absolute inset-x-8 bottom-8 flex justify-between">
      <div className="text-center group">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-1 shadow-sm"><Wind className="w-5 h-5" /></div>
        <p className="text-[10px] font-bold text-stone-400 group-hover:text-purple-600">Vata</p>
        <p className="text-xs font-black text-black">{vata}%</p>
      </div>
      <div className="text-center group">
        <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-1 shadow-sm"><Flame className="w-5 h-5" /></div>
        <p className="text-[10px] font-bold text-stone-400 group-hover:text-rose-600">Pitta</p>
        <p className="text-xs font-black text-black">{pitta}%</p>
      </div>
      <div className="text-center group">
        <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 mb-1 shadow-sm"><Droplet className="w-5 h-5" /></div>
        <p className="text-[10px] font-bold text-stone-400 group-hover:text-teal-600">Kapha</p>
        <p className="text-xs font-black text-black">{kapha}%</p>
      </div>
    </div>
  </div>
);

const ImpactBadge = ({ level }: { level: string }) => (
  <div className={cn(
    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
    level === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" :
    level === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
    "bg-emerald-50 text-emerald-600 border-emerald-100"
  )}>
    {level} Impact
  </div>
);

const GunaRing = ({ sativa, rajas, tamas }: { sativa: number, rajas: number, tamas: number }) => {
  const data = [
    { name: 'Sattva', value: sativa, fill: '#10b981' },
    { name: 'Rajas', value: rajas, fill: '#f59e0b' },
    { name: 'Tamas', value: tamas, fill: '#6366f1' },
  ];
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => <Cell key={index} fill={entry.fill} stroke="transparent" />)}
          </Pie>
          <Tooltip content={() => null} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// --- Main Component ---

export default function SleepIntelligenceResultScreen({ userData }: { userData: any }) {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async (profile: any) => {
    try {
      const result = await analyzeSleepIntelligence(profile, 'en', profile.planId || 'basic');
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
      setError("Analysis engine offline. Please retry.");
    }
  }, [profileId, userData]);

  useEffect(() => {
    const load = async () => {
      if (!profileId) return;
      setLoading(true);
      const res = await getProfileLocally(profileId);
      if (!res) { setError("Profile missing."); setLoading(false); return; }
      if (res.analysis) { setData(res.analysis); setLoading(false); return; }
      await performAnalysis(res);
      setLoading(false);
    };
    load();
  }, [profileId, performAnalysis]);

  if (loading) return <LoadingYogi fullScreenSplash message="Synthesizing Neuro-Vedic Pulse..." />;
  if (error || !data) return (
    <div className="h-screen flex flex-col items-center justify-center p-12 text-center bg-stone-50">
      <AlertCircle className="w-12 h-12 text-rose-500 mb-6" />
      <h2 className="text-2xl font-black mb-2">Sync Error</h2>
      <button onClick={() => navigate(-1)} className="px-8 py-3 bg-black text-white rounded-full font-bold">Retry</button>
    </div>
  );

  const reportPlanId = data.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  const sleepGraphData = [
    { name: 'Start', level: 85 },
    { name: '2h', level: 65 },
    { name: '4h', level: 45 },
    { name: '6h', level: 55 },
    { name: '8h', level: 75 },
    { name: 'Wake', level: 92 },
  ];

  return (
    <div className="min-h-screen bg-[#F8FFFC] pb-40 font-sans selection:bg-purple-100">
      {/* Futuristic Header Metabar */}
      <header className="px-6 py-6 sticky top-0 bg-white/80 backdrop-blur-3xl z-50 border-b border-black/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-50 rounded-full transition-all active:scale-90 border border-stone-100">
            <ChevronLeft className="w-5 h-5 text-stone-950" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xs font-black text-black uppercase tracking-widest leading-none">Intelligence Report</h1>
            <span className="text-[9px] font-bold text-stone-400 mt-1 uppercase">ID: {data.reportId || 'AZ-7819X'} • MAY 2025</span>
          </div>
        </div>
        <div className="bg-stone-900 text-white px-5 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
          <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isPremium ? 'Mastery Mode' : isPro ? 'Protocol Mode' : 'Basic Mode'}
          </span>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 pt-10 space-y-12">
        {/* MANDATORY REPORT HEADER */}
        <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Sleep Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{data.conditionName || 'Sleep Assessment'}</span>
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
                        <p><strong>Home Remedy:</strong> {data.recommendations?.diet?.[0] || "Consult your practitioner."}</p>
                        <p><strong>Lifestyle Tip:</strong> {data.recommendations?.lifestyle?.[0] || "Maintain regular habits."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={data.overallScore || 0}
          title={isPremium ? "Full Neuro-Vedic Logic." : isPro ? "Advanced Sleep Data." : "Core Sleep Pulse."}
          subtitle="Analysis Synchronized"
          label="Sleep Recovery Index"
          color="text-purple-600"
          accentColor="bg-purple-600/10"
          onShare={() => {}}
        />

        {/* Dynamic Universal Premium Report Section */}
        {isPremium && (
          <DynamicPremiumReport data={data} featureName="Sleep Intelligence" />
        )}

        {/* AI Primary Insight Card */}
        <section className="bg-white rounded-[3rem] p-10 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] group">
           <div className="absolute top-[-20%] right-[-20%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-[#A259FF]/10 rounded-full blur-[100px] group-hover:scale-110 group-hover:bg-[#A259FF]/20 transition-all duration-1000 pointer-events-none" />
           <div className="relative z-10 flex gap-8">
             <div className="w-32 h-32 shrink-0 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner overflow-hidden relative">
               <motion.div 
                 animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 4, repeat: Infinity }}
                 className="absolute inset-0 bg-gradient-to-br from-[#A259FF]/20 to-blue-500/20 blur-xl" 
               />
               <Brain className="w-12 h-12 text-[#A259FF] relative z-10" />
             </div>
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-[#A259FF]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">AI Bio-Analysis</span>
                </div>
                <p className="text-xl font-black italic tracking-tight leading-relaxed text-slate-800">
                  "{data.ayurvedicAnalysis?.rootCause || 'Your neural system is fluctuating during sleep cycles.'}"
                </p>
                {(isPro || isPremium) && (
                  <p className="text-slate-500 text-sm font-medium italic leading-relaxed">
                    {data.ayurvedicAnalysis?.imbalanceExplanation}
                  </p>
                )}
             </div>
           </div>
        </section>

        {/* Intelligence Grid - PRO+ */}
        {(isPro || isPremium) && (
          <StandardMetricGrid 
            metrics={[
              { label: 'Quality', value: data.metrics?.sleepQuality, color: 'text-emerald-600', icon: Droplets },
              { label: 'Debt', value: data.metrics?.sleepDebt, color: 'text-rose-600', icon: Clock },
              { label: 'Deep', value: data.metrics?.deepSleep, color: 'text-blue-600', icon: Activity },
              { label: 'Pulse', value: data.metrics?.nervousSystemRecovery, color: 'text-purple-600', icon: Brain },
              { label: 'Stress', value: data.metrics?.stressImpact, color: 'text-amber-600', icon: Shield },
              { label: 'Balance', value: data.metrics?.circadianBalance, color: 'text-teal-600', icon: Sun }
            ]}
          />
        )}

        {/* Visual Analytics Hub - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-black italic tracking-tight">Biological Mapping</h3>
               <div className="flex gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500" />
                 <div className="w-2 h-2 rounded-full bg-stone-200" />
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DoshaSilhoutte 
                 vata={data.ayurvedicAnalysis?.doshaPercentages?.vata || 68} 
                 pitta={data.ayurvedicAnalysis?.doshaPercentages?.pitta || 42} 
                 kapha={data.ayurvedicAnalysis?.doshaPercentages?.kapha || 28} 
               />
               
               <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] p-10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Neural Decay Trend</h4>
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sleepGraphData}>
                          <defs>
                            <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a259ff" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#a259ff" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="level" stroke="#a259ff" fillOpacity={1} fill="url(#colorLevel)" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-black/[0.03] space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-stone-400 uppercase tracking-widest">Efficiency</span>
                      <span className="text-emerald-600 font-black tracking-tight">{data.metrics?.sleepQuality || 72}% Optimal</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-emerald-500 w-[72%]" />
                    </div>
                  </div>
               </div>
             </div>
          </section>
        )}

        {/* Root Cause Matrix - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-6">
            <header className="px-2">
               <h3 className="text-lg font-black italic tracking-tight text-slate-900">Root Cause Distortions</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detected via biometric noise</p>
            </header>
            
            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="flex gap-4 w-max">
                {(data.rootCauses || [
                  { id: 'think', label: 'Neural Static', impact: 'High', icon: <Brain /> },
                  { id: 'screen', label: 'Blue Light Pulse', impact: 'High', icon: <Smartphone /> },
                  { id: 'caffeine', label: 'Caffeine Echo', impact: 'Medium', icon: <Coffee /> },
                  { id: 'timing', label: 'Sync Shift', impact: 'Medium', icon: <Clock3 /> }
                ]).map((rc: any, i: number) => (
                  <div key={i} className="w-48 bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] space-y-4 hover:border-[#A259FF]/20 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-100 shadow-inner">
                      {rc.icon || <Brain className="w-5 h-5" />}
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-black italic tracking-tight leading-none">{rc.label}</p>
                      <ImpactBadge level={rc.impact} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Body Systems Connectivity - PREMIUM */}
        {isPremium && (
          <section className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] p-10 space-y-8">
             <header>
               <h3 className="text-lg font-black italic tracking-tight text-slate-900">Biological Connectivity</h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">System-wide impact analysis</p>
             </header>
             
             <div className="space-y-6">
               {(data.bodySystemImpacts || [
                 { system: 'Metabolic Fire (Agni)', impact: 42, color: 'rose' },
                 { system: 'Neural Clarity', impact: 68, color: 'blue' },
                 { system: 'Cellular Immunity', impact: 35, color: 'emerald' },
                 { system: 'Hormonal Balance', impact: 55, color: 'purple' }
               ]).map((s: any, i: number) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between items-center">
                     <p className="text-[11px] font-black italic tracking-tight text-slate-800">{s.system}</p>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.impact}% Integrity</span>
                   </div>
                   <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
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

        {/* Guna Analysis - PREMIUM */}
        {isPremium && (
          <section className="grid grid-cols-2 gap-6 items-center">
             <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03]">
               <header className="mb-4">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Atmospheric Guna</h3>
                 <p className="text-xs font-black italic text-slate-800">Mental Density Analysis</p>
               </header>
               <GunaRing 
                 sativa={data.ayurvedicAnalysis?.gunaBalance?.sattva || 45} 
                 rajas={data.ayurvedicAnalysis?.gunaBalance?.rajas || 35} 
                 tamas={data.ayurvedicAnalysis?.gunaBalance?.tamas || 20} 
               />
             </div>
             <div className="space-y-4">
               <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100/50 flex flex-col gap-1 shadow-sm hover:bg-white transition-colors">
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-600">Ideal Bedtime</p>
                  <p className="text-lg font-black text-emerald-950 italic">10:15 PM - 10:45 PM</p>
               </div>
               <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100/50 flex flex-col gap-1 shadow-sm hover:bg-white transition-colors">
                  <p className="text-[8px] font-black uppercase tracking-widest text-amber-600">Brahma Muhurta</p>
                  <p className="text-lg font-black text-amber-950 italic">5:15 AM - 6:00 AM</p>
               </div>
             </div>
          </section>
        )}

        {/* Roadmap - PRO+ */}
        {(isPro || isPremium) && (
          <section className="space-y-8">
             <header className="px-2">
               <h3 className="text-2xl font-black italic tracking-tighter text-slate-900">Neuro-Vedic Transformation</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">A structured biological reset</p>
             </header>
             
             <div className="space-y-4">
                {(data.roadmap || []).map((step: any, i: number) => (
                  <div key={i} className="group bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] overflow-hidden hover:border-[#A259FF]/20 transition-all">
                     <div className="p-8 flex items-start gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-slate-50 shadow-inner border border-slate-100 flex items-center justify-center text-slate-800 text-lg font-black group-hover:bg-[#A259FF] group-hover:text-white transition-colors">
                          0{step.week}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 leading-none">Week Cycle</p>
                          <h4 className="text-xl font-black italic tracking-tight text-slate-800">{step.title}</h4>
                          <p className="text-slate-500 text-xs font-medium italic leading-relaxed">{step.focus}</p>
                        </div>
                     </div>
                     <div className="px-8 pb-8 flex flex-wrap gap-2">
                        {(step.practices || []).map((p: string) => (
                          <span key={p} className="px-4 py-2 bg-slate-50 border border-slate-100 shadow-sm rounded-full text-[9px] font-black text-slate-600 italic group-hover:bg-[#A259FF]/5 group-hover:text-[#A259FF] transition-colors">{p}</span>
                        ))}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        {/* Transformation Disclaimer */}
        <p className="text-[10px] text-slate-300 font-medium italic text-center px-12 leading-relaxed uppercase tracking-widest">
           * AI synthesis is for biological insight only. Always consult a physician for clinical sleep disorders. Non-medical report.
        </p>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-40 backdrop-blur-3xl">
        <div className="max-w-xl mx-auto flex gap-4">
          <button 
            className="flex-1 bg-stone-950 text-white py-6 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-[0.98] transition-all"
          >
            Update Protocol
            <Activity className="w-4 h-4 text-emerald-400" />
          </button>
          {isPremium && (
            <button 
              className="w-20 bg-white border border-black/[0.05] rounded-[2rem] flex items-center justify-center active:scale-[0.95] transition-all shadow-sm hover:bg-stone-50"
            >
              <Download className="w-5 h-5 text-stone-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
