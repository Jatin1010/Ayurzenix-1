import axios from 'axios';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { analyzeHealthProfile, analyzeBodyScan, analyzeAdvancedProfile, generateProductSketch } from '../lib/gemini';
import { Loader2, Share2, ShoppingCart, CheckCircle2, XCircle, Info, MessageSquare, ExternalLink, Sparkles, Wand2, Brain, Zap, Heart, TrendingUp, Target, ShoppingBag, Languages, Mail, Utensils, ShieldAlert, Calendar, ShieldCheck, Crown, Clock, Timer, ArrowRight, ArrowLeft, Activity, Moon, Leaf, Download, Dna, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import ProductCard from '../components/ProductCard';
import LoadingYogi from '../components/LoadingYogi';
import LanguageToggle from '../components/LanguageToggle';
import PremiumPaywall from '../components/PremiumPaywall';
import SubscriptionNudge from '../components/SubscriptionNudge';

// Premium Report Components
import StandardHero from '../components/report/StandardHero';
import HeroDoshaSection from '../components/report/HeroDoshaSection';
import WellnessDashboard from '../components/report/WellnessDashboard';
import RootCauseAnalysis from '../components/report/RootCauseAnalysis';
import AgniAnalysis from '../components/report/AgniAnalysis';
import MentalEmotionalSection from '../components/report/MentalEmotionalSection';
import AyurvedicInsight from '../components/report/AyurvedicInsight';
import DietRoadmap from '../components/report/DietRoadmap';
import DinacharyaRoutine from '../components/report/DinacharyaRoutine';
import HerbsSection from '../components/report/HerbsSection';
import HomeRemedies from '../components/report/HomeRemedies';
import YogaPranayama from '../components/report/YogaPranayama';
import TherapySection from '../components/report/TherapySection';
import ActionPlan7Day from '../components/report/ActionPlan7Day';
import Transformation30Day from '../components/report/Transformation30Day';
import TriggerAnalysis from '../components/report/TriggerAnalysis';
import FuturePredictor from '../components/report/FuturePredictor';
import ProgressTracker from '../components/report/ProgressTracker';
import ProductRecommendations from '../components/report/ProductRecommendations';
import PremiumPDFSection from '../components/report/PremiumPDFSection';
import UpgradeCTA from '../components/report/UpgradeCTA';
import StickyBottomCTA from '../components/report/StickyBottomCTA';
import LockedSection from '../components/report/LockedSection';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import SeasonalRecommendation from '../components/SeasonalRecommendation';
import { AdUnit } from '../components/AdUnit';

import { getFeaturePricing, Plan } from '../lib/pricing';
import { PLANS } from './AnalysisPlanSelectionScreen';
import { PRODUCTS } from '../lib/productService';
import { useAds } from '../components/AdManager';
import { cn } from '../lib/utils';

interface ResultScreenProps {
  userData: any;
  appConfig?: any;
  setUserData?: (data: any) => void;
}

export default function ResultScreen({ userData, appConfig, setUserData }: ResultScreenProps) {
  useEffect(() => {
    window.scrollTo(0, 0);

    // Google Translate Initialization
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({ pageLanguage: 'en', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE }, 'google_translate_element');
    };
    document.body.appendChild(script);
  }, []);

  const { language } = useLanguage();
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { showInterstitial } = useAds();
  
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [showSubNudge, setShowSubNudge] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const FEATURE_NAMES: Record<string, string> = {
    body_scan: "AI Body Scan",
    hormonal_balance: "Hormonal Balance",
    gut_health: "Gut Health Analysis",
    liver_health: "Liver Health Check",
    hair_fall: "Hair Fall Analyzer",
    energy_booster: "Energy Booster",
    future_prediction: "Health Future Prediction",
    smart_scan: "Smart Health Scan",
    health_scan: "Smart Health Scan",
    smart_mental_scan: "Deep Mental Scan",
    symptom_checker: "AI Symptom Checker",
    report_analyzer: "AI Report Analyst",
    weight_loss: "Weight Loss Plan",
    stress_relief: "Stress Relief Plan",
    better_sleep: "Better Sleep Plan"
  };

  const reportPlanId = profile?.planId || 'basic';

  const fetchAndAnalyze = async (lang?: string) => {
    if (!profileId || !userData?.uid) return;
    setLoading(true);
    setApiError(null);

    try {
      const localProfile = await getProfileLocally(profileId);
      if (!localProfile) {
        navigate('/history');
        return;
      }

      setProfile(localProfile);
      const currentLang = lang || language || 'en';

      // Check if unlocked: Premium members, Admins or specific purchase
      const isPaid = localProfile.isPaid || false;
      setIsUnlocked(isPaid); 
      
      // ... same as before
      if (localProfile.analysis && 
          localProfile.analysisLang === currentLang && 
          localProfile.analysisPlanId === localProfile.planId) {
        setAnalysis(localProfile.analysis);
        setLoading(false);
        return;
      }
      
      // Need to generate payment logic here...
      const chargeWallet = async (planId: string) => {
        if (!userData || !userData.uid) return;
        const plan = PLANS.find((p) => p.id === planId);
        if (!plan || plan.price === 0) return;
        
        try {
          await axios.post('/api/wallet/unlock', {
            userId: userData.uid,
            planId: plan.id,
            amount: plan.price,
            featureName: localProfile?.type || 'Intelligence Analysis',
            profileId: profileId
          });
          // Update local state if provided
          if (setUserData) {
            setUserData((prev: any) => ({
              ...prev,
              wallet_balance: (prev.wallet_balance || 0) - plan.price
            }));
          }
        } catch (e) {
          console.error("Failed to charge wallet:", e);
          throw e;
        }
      };

      // Generate Analysis
      let result;
      if (localProfile.type === 'body_scan') {
        result = await analyzeBodyScan(localProfile.image || null, localProfile.inputs || {}, currentLang, localProfile.planId || 'basic');
      } else if (localProfile.type === 'smart_scan' || localProfile.type === 'health_scan') {
        result = await analyzeHealthProfile(localProfile || {}, currentLang);
      } else {
        result = await analyzeAdvancedProfile(localProfile.type, localProfile.inputs || {}, currentLang, localProfile.planId || 'basic');
      }

      if (result) {
        setAnalysis(result);
        const updates = { 
          analysis: result, 
          // @ts-ignore
          analysisLang: currentLang,
          analysisPlanId: localProfile.planId || 'basic',
          isPaid: localProfile.planId === 'basic' ? true : localProfile.isPaid
        };
        
        // PAYMENT DEDUCTION
        if (localProfile.planId !== 'basic' && !localProfile.isPaid) {
          await chargeWallet(localProfile.planId);
          updates.isPaid = true;
          setIsUnlocked(true);
        }

        await updateProfileLocally(profileId, updates);
        
        // Also update Firestore if logged in
        if (userData?.uid && !userData.is_guest) {
          try {
            const profileRef = doc(db, 'health_profiles', profileId);
            await updateDoc(profileRef, updates);
          } catch (e) {
            console.error("Failed to sync to Firestore:", e);
          }
        }
      } else {
        setApiError("Bio-sync failed. Our experts are recalibrating...");
      }
    } catch (error: any) {
      console.error("Analysis Error:", error);
      setApiError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndAnalyze();
  }, [profileId, userData?.uid]);

  const handleLanguageChange = async (newLang: string) => {
    if (newLang === userData.language || isChangingLanguage) return;
    setIsChangingLanguage(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { language: newLang });
      if (setUserData) setUserData({ ...userData, language: newLang });
      await fetchAndAnalyze(newLang);
    } catch (error) {
      console.error("Error changing language:", error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${userData.uid}`);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const handleShare = () => {
    const text = `*Ayurzenix - Ayurvedic Analysis*\n\n*Dominant Dosha:* ${analysis?.doshaHeader?.dominant || 'N/A'}\n\n*Wellness Index:* ${analysis?.wellnessScore?.score || 0}/100\n\nCheck your analysis here: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: 'Ayurzenix Health Analysis', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert("Report copied to clipboard!");
    }
  };

  const handleWhatsAppShare = () => {
    const text = `*Ayurzenix - Ayurvedic Analysis*\n\n*Dominant Dosha:* ${analysis?.doshaHeader?.dominant || 'N/A'}\n\n*Wellness Index:* ${analysis?.wellnessScore?.score || 0}/100\n\nCheck your analysis here: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePayment = async (plan: Plan) => {
    if (!userData || !userData.uid) return;
    try {
      setLoading(true);
      await axios.post('/api/wallet/unlock', {
        userId: userData.uid,
        planId: plan.id,
        amount: plan.price,
        featureName: FEATURE_NAMES[profile.type] || 'Intelligence Analysis',
        profileId: profileId
      });

      // Update local state if provided
      if (setUserData) {
        setUserData((prev: any) => ({
          ...prev,
          wallet_balance: (prev.wallet_balance || 0) - plan.price
        }));
      }
      
      await finalizeUnlock(plan);
      setLoading(false);
    } catch (e) {
      console.error("Failed to charge wallet:", e);
      setApiError("Failed to deduct balance. Please check your wallet.");
      setLoading(false);
    }
  };

  // Auto-unlock effect removed as everything is free
  useEffect(() => {
    if (isUnlocked || !profile || !userData?.uid) return;
    setIsUnlocked(true);
  }, [profile, userData]);

  const finalizeUnlock = async (plan: Plan) => {
    if (!profileId) return;
    await updateProfileLocally(profileId, { isPaid: true, planId: plan.id });
    setIsUnlocked(true);
    // Don't call fetchAndAnalyze again if we already have it, just update state
    // But we might need more data if upgrading from basic to pro
    if (analysis && (plan.id === 'pro' || plan.id === 'premium') && reportPlanId === 'basic') {
        fetchAndAnalyze(); 
    }
    setTimeout(() => setShowSubNudge(true), 1500);
  };

  if (loading) return <LoadingYogi />;

  if (apiError) return (
    <div className="min-h-screen bg-[#F8FFFC] flex items-center justify-center p-8">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl text-center space-y-6 max-w-sm border border-black/5">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500 shadow-inner">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black text-black">TECHNICAL HICCUP</h3>
          <p className="text-sm text-gray-500 font-medium italic">{apiError}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">This is not a payment issue. Our AI servers are recalibrating your data.</p>
        </div>
        <button onClick={() => fetchAndAnalyze()} className="w-full py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Restart Bio-Sync</button>
      </div>
    </div>
  );

  // REMOVED THE FULL-PAGE Paywall LOCK HERE
  // We now show the report and lock individual sections if needed

// ... (Refined ResultScreen layout reconstruction)
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro' || reportPlanId === 'premium';
  const isPremium = reportPlanId === 'premium';

  // Plan Upgrade Insight component for Basic tier
  const PlanUpgradeInsight = () => (
    <div className="bg-stone-50 rounded-[3.5rem] p-10 md:p-14 border border-stone-250/80 shadow-[0_24px_60px_rgba(0,0,0,0.03)] max-w-5xl mx-auto space-y-12 relative overflow-hidden group">
      {/* Background radial effects */}
      <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-lg max-h-lg bg-[#A259FF]/5 rounded-full blur-[140px] pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute bottom-[-10%] left-[-20%] w-[40vw] h-[40vw] max-w-sm max-h-sm bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center space-y-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200/80 rounded-full shadow-sm text-[10px] font-black uppercase tracking-[0.25em] text-[#A259FF]">
          <Crown className="w-4 h-4 text-amber-500 animate-pulse" />
          The Inside Premium Advantage
        </div>
        <h3 className="text-4xl md:text-5xl font-heading font-black text-[#000000] tracking-tight uppercase">
          Unleash Clinical-Grade Wellness
        </h3>
        <p className="text-sm font-bold text-stone-600 max-w-2xl mx-auto leading-relaxed italic">
          "A Report That Actually Changes Your Life. Move beyond generic advice. Get a technical, data-driven Ayurvedic manual built specifically for your body."
        </p>
      </div>

      {/* Grid of 3 tiers matching User Request #4 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Tier 1: Foundational Focus */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200/50 shadow-sm flex flex-col justify-between space-y-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-700 border border-stone-200 shadow-inner">
                <Dna className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 uppercase tracking-tight">Foundational Focus</h4>
                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">Level 1: Core Map</p>
              </div>
            </div>

            <p className="text-xs font-bold text-stone-500 leading-relaxed border-l-2 border-stone-200 pl-3">
              Essential diagnostic analysis providing clinical baselines for your body type.
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                { label: "Wellness Score", icon: "🎯" },
                { label: "Dosha Analysis", icon: "🧬" },
                { label: "Detailed Root Cause", icon: "🔍" },
                { label: "Actionable Home Remedies", icon: "🌿" },
                { label: "Plan Upgrade Insight", icon: "📈" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100 shadow-sm hover:translate-x-1 transition-transform">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="text-xs font-black text-stone-800">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-stone-150">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block text-center">Standard Baseline Enabled</span>
          </div>
        </div>

        {/* Tier 2: Clinical Depth */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-200/50 shadow-sm flex flex-col justify-between space-y-6 hover:scale-[1.02] transition-transform duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-[#A259FF] border border-purple-100 shadow-inner">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 uppercase tracking-tight">Clinical Depth</h4>
                <p className="text-[9px] font-bold text-[#A259FF] uppercase tracking-wider">Level 2: Remedying Plan</p>
              </div>
            </div>

            <p className="text-xs font-bold text-stone-500 leading-relaxed border-l-2 border-purple-200 pl-3">
              Circadian bio-analytics and long-term roadmap calibration protocols.
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                { label: "Advanced Bio-Analysis", icon: "🧠" },
                { label: "7-Day Healing Protocol", icon: "🗓️" },
                { label: "Chrono-nutrition Roadmap", icon: "🍎" },
                { label: "Yoga Therapy", icon: "🧘" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-purple-50/40 p-2.5 rounded-xl border border-purple-100/40 shadow-sm hover:translate-x-1 transition-transform">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="text-xs font-black text-stone-800">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {!isPro ? (
            <button 
              onClick={() => navigate(`/paywall/${profileId}`)}
              className="w-full py-4 bg-[#A259FF] text-white hover:bg-purple-700 transition-all rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95"
            >
              Go Pro Now <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="pt-4 border-t border-stone-150">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block text-center">✔ Pro Tier Authorized</span>
            </div>
          )}
        </div>

        {/* Tier 3: Absolute Longevity */}
        <div className="bg-stone-950 p-8 rounded-[2.5rem] border border-stone-850 shadow-md flex flex-col justify-between space-y-6 hover:scale-[1.02] transition-transform duration-300 text-stone-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/50 flex items-center justify-center text-amber-500 border border-amber-900 shadow-inner">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-white uppercase tracking-tight">Absolute Longevity</h4>
                <p className="text-[9px] font-bold text-amber-500 uppercase tracking-wider">Level 3: Premium Intel</p>
              </div>
            </div>

            <p className="text-xs font-bold text-stone-400 leading-relaxed border-l-2 border-amber-800 pl-3">
              Deep epigenetic forecasting and standard High-Fid printable manual compilation.
            </p>

            <ul className="space-y-3.5 pt-2">
              {[
                { label: "Ojas / Tejas Reserve metrics", icon: "✨" },
                { label: "SOS Symptom Rescue Matrix", icon: "🚨" },
                { label: "5-Year Future Predictor", icon: "🔮" },
                { label: "Epigenetic Roadmap", icon: "🗺️" },
                { label: "Personalized High-Fidelity PDF", icon: "📄" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-[#1c1917] p-2.5 rounded-xl border border-stone-800 shadow-sm hover:translate-x-1 transition-transform">
                  <span className="text-base shrink-0">{item.icon}</span>
                  <span className="text-xs font-black text-stone-100">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => navigate(`/paywall/${profileId}`)}
            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-black rounded-[1.5rem] text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] active:scale-95 transition-all"
          >
            Start Premium Protocol <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );

  // Hierarchical Sections
  const BasicReport = () => (
    <div className="space-y-24">
      {/* 1. Report Title and Hero Header */}
      <section className="text-center space-y-8 max-w-4xl z-10 mx-auto">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-stone-100 rounded-full border border-stone-200 shadow-inner">
          <Dna className="w-5 h-5 text-[#4A90E2] animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.4em] text-stone-700">Holistic Biosync Calibration</span>
        </div>
        <div className="space-y-4">
          <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-[0.85] uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text pb-4 drop-shadow-sm">
            Vitality Ledger
          </h1>
          <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
        </div>
        <p className="text-xl md:text-2xl font-bold text-[#000000] max-w-3xl mx-auto italic leading-relaxed opacity-90">
          Unveiling classical biological dynamics mapped with deep AI diagnostics. Meticulously engineered for deep self-awareness.
        </p>
      </section>

      {/* NEW: Executive Summary "At a Glance" Section */}
      <section className="pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Power Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-black text-white p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
              <Zap className="w-12 h-12 text-[#FFD700]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Vitality Index</span>
            <div className="space-y-1">
              <h4 className="text-6xl font-black tracking-tighter">{analysis.wellnessScore?.score || 0}%</h4>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Protocol Active</p>
            </div>
            <p className="text-sm font-medium text-stone-300 leading-snug">
              Your systemic recovery potential is currently at peak capacity.
            </p>
          </motion.div>

          {/* Card 2: Dominant Force */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#F8FFFC] border border-stone-200 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Biological Force</span>
            </div>
            <div className="space-y-1">
              <h4 className="text-4xl font-black text-black tracking-tight uppercase leading-none">
                {analysis.doshaHeader?.dominant || 'N/A'}
              </h4>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Dominant Dosha</p>
            </div>
            <p className="text-sm font-bold text-stone-700 leading-snug">
              Primary energetic signature guiding your current cellular state.
            </p>
          </motion.div>

          {/* Card 3: Core Insight */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-stone-50 border border-stone-200 p-8 rounded-[2.5rem] flex flex-col justify-between space-y-6 shadow-xl md:col-span-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Deep Diagnostic Insight</span>
              </div>
              <div className="px-3 py-1 bg-white rounded-full border border-stone-200 text-[9px] font-black uppercase tracking-widest text-stone-400">
                AI Summary
              </div>
            </div>
            <p className="text-base md:text-lg font-bold text-[#000000] leading-tight line-clamp-3 italic">
              "{analysis.deepInsight || 'Biological alignment detected.'}"
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-black text-[10px] uppercase tracking-widest group cursor-pointer hover:gap-4 transition-all">
              Read Detailed Analysis <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Point 1.1: Wellness Score Dashboard */}
      <div className="space-y-8 pt-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400">Section I / Score & Metrics</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
            Vitality Metrics / सूचकांक
          </h2>
          <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">Systemic balance across primary biological nodes</p>
          <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <WellnessDashboard score={analysis.wellnessScore} />
        </div>
      </div>

      {/* Point 1.2: Dosha Analysis */}
      <div className="space-y-8 pt-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400">Section II / Bio-Energetics</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
            Dosha Energetics / त्रिदोष
          </h2>
          <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">Quantifying your elemental governance</p>
          <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <HeroDoshaSection dosha={analysis.doshaHeader} />
        </div>
      </div>

      {/* Point 1.3: Detailed Root Cause */}
      <div className="space-y-8 pt-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400">Section III / Causality Analysis</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
            Root Cause Mapping / निदान
          </h2>
          <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">Architectural breakdown of biological triggers</p>
          <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <RootCauseAnalysis rootCause={analysis.rootCause} />
        </div>
      </div>

      {/* Point 1.4: Actionable Home Remedies */}
      <div className="space-y-8 pt-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400">Section IV / Clinical Remedies</span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
            Kitchen Alchemy / घरेलू उपचार
          </h2>
          <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">High-potency botanical prescriptions</p>
          <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto">
          <HomeRemedies remedies={analysis.homeRemedies || []} />
        </div>
      </div>

      {/* Point 1.5: Curated Formulations */}
      {analysis.productSuggestions && analysis.productSuggestions.length > 0 && (
        <div className="space-y-8 pt-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400">Section V / Formulations</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
              Curated Protocols / अनुशंसित
            </h2>
            <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">Handpicked herbal synergy for your bio-type</p>
            <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
          </div>
          <div className="max-w-5xl mx-auto">
            <ProductRecommendations products={analysis.productSuggestions} />
          </div>
        </div>
      )}

      {/* Point 1.6: Plan Upgrade Insight */}
      {!isPremium && (
        <div className="space-y-8 pt-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.5em] text-stone-400 font-mono">Section VI / Protocol Escalation</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-[0.9]">
              Future Intelligence / भविष्य
            </h2>
            <p className="text-black font-bold italic text-base uppercase tracking-widest opacity-60">Deep clinical forecasting and seasonal mastery</p>
            <div className="h-1.5 w-32 bg-stone-900 mx-auto rounded-full" />
          </div>
          <PlanUpgradeInsight />
        </div>
      )}

      <AdUnit />
    </div>
  );

  const ProAdditions = () => (
    <div className="space-y-24 pt-12 border-t border-stone-100">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-600 font-mono">Tier II / Pro Analytics Addon</span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-tight">
          Metabolic & Guna Analysis / चयापचय और मनःस्थिति
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] mx-auto rounded-full" />
      </div>

      <AgniAnalysis agni={analysis.agniAnalysis} />
      <MentalEmotionalSection mentalState={analysis.mentalState} />

      <div className="text-center space-y-3 pt-12">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-purple-600 font-mono">Tier II / Prescriptions & Routines</span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-tight">
          Diet & Lifestyle Prescriptions / पोषण एवं जीवन शैली
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] mx-auto rounded-full" />
      </div>

      <div className="space-y-12">
          <DietRoadmap diet={analysis.dietPlan} />
          <DinacharyaRoutine routine={analysis.routine} />
          <HerbsSection herbs={analysis.herbalProtocol} />
          <YogaPranayama data={analysis.yogaPranayama} />
          <TherapySection therapies={analysis.therapies} />
      </div>
    </div>
  );

  const PremiumAdditions = () => (
    <div className="space-y-24 pt-12 border-t border-stone-100">
      <div className="text-center space-y-3">
        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-600 font-mono">Tier III / Premium Diagnostic Intelligence</span>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight uppercase bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] text-transparent bg-clip-text leading-tight">
          Future Forecasting & Transmutations / जीवन परिवर्तन
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#00BFA6] via-[#4A90E2] to-[#7B61FF] mx-auto rounded-full" />
      </div>

      <DynamicPremiumReport data={analysis} featureName={FEATURE_NAMES[profile.type] || 'Health'} />
      <Transformation30Day plan={analysis.plan30Day} isLocked={false} />
      <FuturePredictor prediction={analysis.futurePrediction} isLocked={false} />
      <ProgressTracker progress={analysis.progressTracking} isLocked={false} />
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-stone-900 pb-32">
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
        <BasicReport />
        
        {isPro ? <ProAdditions /> : (
          <LockedSection isLocked={true} tier="pro" title="Pro Insights" onUpgrade={() => navigate(`/paywall/${profileId}`)}>
            <div />
          </LockedSection>
        )}
        
        {isPremium ? <PremiumAdditions /> : (
          <LockedSection isLocked={true} tier="premium" title="Premium Intelligence" onUpgrade={() => navigate(`/paywall/${profileId}`)}>
            <div />
          </LockedSection>
        )}
        
        {isPro && <ActionPlan7Day plan={analysis.plan7Day} />}
        {isPro && <TriggerAnalysis triggers={analysis.triggers} />}
        
        {/* Ultimate Premium 8K PDF Ledger & Certificate gate */}
        <PremiumPDFSection isLocked={!isPremium} onUpgrade={() => navigate(`/paywall/${profileId}`)} />
        
        {/* Disclaimer */}
        <div className="bg-gray-100 p-12 rounded-[4rem] text-center border border-black/5">
            <p className="text-sm text-gray-500 font-medium leading-relaxed italic max-w-2xl mx-auto">
              {analysis.disclaimer || "Ayurzenix results are AI-driven Ayurvedic insights..."}
            </p>
        </div>
      </main>

      <StickyBottomCTA 
        onChat={() => navigate('/chat')}
        onShare={handleShare}
        onDownload={() => alert('Downloading Analysis PDF...')}
        isPremium={isPremium}
      />
    </div>
  );
}
