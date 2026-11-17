import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { generateProductSketch, analyzeFaceGlow } from '../lib/gemini';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import PremiumPaywall from '../components/PremiumPaywall';
import StandardHero from '../components/report/StandardHero';
import StandardMetricGrid from '../components/report/StandardMetricGrid';
import ResultCard from '../components/report/ResultCard';
import DynamicPremiumReport from '../components/report/DynamicPremiumReport';
import { getFeaturePricing, Plan } from '../lib/pricing';
import axios from 'axios';
import { 
  Loader2, 
  Share2, 
  ShoppingCart, 
  CheckCircle2, 
  Sparkles, 
  Wand2, 
  ChevronLeft, 
  Droplets, 
  Info, 
  ArrowRight,
  Download,
  Check,
  Brain,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import LoadingYogi from '../components/LoadingYogi';
import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';

interface FaceGlowResultScreenProps {
  userData: any;
  appConfig?: any;
  setUserData?: (data: any) => void;
}

export default function FaceGlowResultScreen({ userData, appConfig, setUserData }: FaceGlowResultScreenProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingSketch, setGeneratingSketch] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const pricing = getFeaturePricing('face-glow', appConfig);

  const fetchAnalysis = async (lang?: string) => {
    if (!profileId) return;
    setLoading(true);
    try {
      const data = await getProfileLocally(profileId);
      if (data) {
        setProfile(data);
        setIsUnlocked(!!data.isPaid || userData?.is_premium);
        
        const targetLang = lang || userData.language || 'hi';

        // If we have an analysis and it's NOT a language change, use it
        if (data.analysis && !lang) {
          setAnalysis(data.analysis);
          setLoading(false);
        } else {
          try {
             const result = await analyzeFaceGlow(data.image, data.inputs, targetLang, data.planId || 'basic');
             setAnalysis(result);
             
             // Save it back to prevent regeneration
             const updates = { 
               analysis: result,
               analysisLang: targetLang,
               analysisPlanId: data.planId || 'basic'
             };
             try {
                await updateProfileLocally(profileId, updates);
                
                // Firestore sync
                if (userData?.uid && !userData.is_guest) {
                  const profileRef = doc(db, 'health_profiles', profileId);
                  await updateDoc(profileRef, updates);
                }
             } catch(e) { console.error("Failed to save FaceGlow result"); }
          } catch(e) {
             console.error("AI Generation Error", e);
             setAnalysis(data.analysis || null); 
          }
          setLoading(false);
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Error fetching analysis:", err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, [profileId, userData?.uid]);

  const handleLanguageChange = async (newLang: string) => {
    if (newLang === userData.language || isChangingLanguage) return;
    
    setIsChangingLanguage(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { language: newLang });
      if (setUserData) {
        setUserData({ ...userData, language: newLang });
      }
      // Re-fetch analysis (ideally we'd re-generate here if we had the logic)
      await fetchAnalysis(newLang);
    } catch (error) {
      console.error("Error changing language:", error);
    } finally {
      setIsChangingLanguage(false);
    }
  };

  const finalizeUnlock = async (plan: Plan) => {
    if (!profileId) return;
    await updateProfileLocally(profileId, { isPaid: true, planId: plan.id });
    setIsUnlocked(true);
  };

  const handlePayment = async (plan: Plan) => {
    if (!userData || !userData.uid || userData.uid === 'guest') {
      navigate('/auth');
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const isDeveloper = userData?.email?.toLowerCase() === 'help@ayurzenix.in';
      if (isDeveloper) {
          await finalizeUnlock(plan);
          return;
      }
      
      const cost = plan.price;

      // 1. Check Wallet/Credits
      if ((userData.free_results_count || 0) > 0) {
        const userRef = doc(db, 'users', userData.uid);
        try {
          await updateDoc(userRef, { free_results_count: increment(-1) });
          await finalizeUnlock(plan);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${userData.uid}`);
        }
        return;
      }

      if ((userData.wallet_balance || 0) >= cost) {
        const userRef = doc(db, 'users', userData.uid);
        try {
          await updateDoc(userRef, { wallet_balance: increment(-cost) });
          await addDoc(collection(db, 'transactions'), {
            uid: userData.uid, amount: cost, type: 'debit', status: 'success', 
            description: `Unlock: Face Glow Analysis (${plan.title})`,
            provider: 'wallet', createdAt: serverTimestamp()
          });
          await finalizeUnlock(plan);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, 'users/transactions');
        }
        return;
      }

      // 2. Razorpay Payment
      const { data: order } = await axios.post('/api/razorpay/order', { 
        amount: cost, 
        userId: userData.uid,
        receipt: `unlock_face_${profileId}_${Date.now()}`,
        notes: {
          isUnlock: 'true',
          reportTitle: plan.title,
          userId: userData.uid
        }
      });
      
      const options = getRazorpayConfig(
        order,
        userData,
        async (response: any) => {
          try {
            setIsLoading(true);
            const { data: verifyData } = await axios.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userData.uid,
              amount: plan.price,
              isUnlock: true,
              reportTitle: plan.title
            });
            if (verifyData.status === 'success') {
              await finalizeUnlock(plan);
            } else {
              alert("Verification failed.");
            }
          } catch (e) {
            console.error(e);
            alert("Payment error.");
          } finally {
            setIsLoading(false);
          }
        },
        () => setIsLoading(false)
      );
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Add auto-unlock effect
  useEffect(() => {
    const attemptAutoUnlock = async () => {
      if (!isUnlocked && profile && userData?.uid && userData.uid !== 'guest' && !loading && analysis) {
        const targetPlanId = profile.planId || 'pro';
        const targetPlan = pricing.plans.find(p => p.id === targetPlanId) || pricing.plans[1] || pricing.plans[0];
        
        if (targetPlan.price === 0) {
           await finalizeUnlock(targetPlan);
        } else if ((userData.free_results_count || 0) > 0 || (userData.wallet_balance || 0) >= targetPlan.price) {
           setTimeout(() => {
              handlePayment(targetPlan);
           }, 1000);
        }
      }
    };

    attemptAutoUnlock();
  }, [isUnlocked, profile, userData, !!analysis]);

  const handleGenerateSketch = async (productName: string, index: number) => {
    if (generatingSketch) return;
    setGeneratingSketch(productName);
    try {
      const sketch = await generateProductSketch(productName);
      if (sketch && profileId) {
        const updatedProducts = [...analysis.recommendedProducts];
        updatedProducts[index] = { ...updatedProducts[index], sketchImage: sketch };
        await updateProfileLocally(profileId, { analysis: { ...analysis, recommendedProducts: updatedProducts } });
        setAnalysis({ ...analysis, recommendedProducts: updatedProducts });
      }
    } catch (err) {
      console.error("Error generating sketch:", err);
    } finally {
      setGeneratingSketch(null);
    }
  };

  const handleShare = async () => {
    if (!shareCardRef.current) return;
    setSharing(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      const image = canvas.toDataURL('image/png');
      const blob = await (await fetch(image)).blob();
      const file = new File([blob], 'my-glow-score.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'My Ayurzenix Glow Score',
          text: `I just analyzed my skin glow with Ayurzenix AI! My score is ${analysis.glowScore}/100 ✨`,
          files: [file]
        });
      } else {
        const link = document.createElement('a');
        link.href = image;
        link.download = 'my-glow-score.png';
        link.click();
      }
    } catch (err) {
      console.error("Share Error:", err);
    } finally {
      setSharing(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ayur-bg px-6 text-center">
        <LoadingYogi />
      </div>
    );
  }

  if (!analysis) return null;

  if (!isUnlocked) {
    return (
    <div className="min-h-screen bg-[#F8FFFC] flex flex-col items-center justify-center p-6 space-y-12 font-sans">
        <div className="text-center space-y-4 px-4">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ayur-neon/10 rounded-full text-ayur-neon text-xs font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            Analysis Computed
          </motion.div>
          <h3 className="text-3xl font-black text-gray-900 leading-tight">
            Your Glow Score is Ready.
          </h3>
          <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-xs mx-auto">
            Choose a plan to reveal your dermal intelligence and personalized Ayurvedic skincare roadmap.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          {pricing?.plans?.map((plan: any) => (
            <button
              key={plan.id}
              onClick={() => handlePayment(plan)}
              className={`w-full p-6 rounded-[2rem] border flex items-center justify-between transition-all group hover:scale-[1.02] ${
                plan.badge || plan.id === 'pro' ? 'bg-ayur-neon border-ayur-neon text-white shadow-xl shadow-green-100' : 'bg-white border-black/5 text-gray-900 shadow-sm'
              }`}
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                   <p className={`text-base font-black ${plan.badge || plan.id === 'pro' ? 'text-white' : 'text-gray-900'}`}>{plan.id.toUpperCase()}</p>
                   {plan.badge && <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">{plan.badge}</span>}
                </div>
                <p className={`text-[10px] font-bold ${plan.badge || plan.id === 'pro' ? 'text-white/70' : 'text-gray-400'}`}>{plan.price === 0 ? 'Basic Insight' : 'Full Protocol'}</p>
              </div>
              <div className="flex items-center gap-3">
                 <p className={`text-xl font-black ${plan.badge || plan.id === 'pro' ? 'text-white' : 'text-gray-900'}`}>₹{plan.price}</p>
                 <ArrowRight className={`w-4 h-4 ${plan.badge || plan.id === 'pro' ? 'text-white' : 'text-gray-300'}`} />
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="text-stone-400 text-xs font-black uppercase tracking-widest border-b border-stone-200 pb-1"
        >
          Go Back
        </button>
      </div>
    );
  }

  const reportPlanId = profile?.planId || 'basic';
  const isBasic = reportPlanId === 'basic';
  const isPro = reportPlanId === 'pro';
  const isPremium = reportPlanId === 'premium';

  return (
    <div className="min-h-screen bg-[#F8FFFC] pb-24 selection:bg-emerald-100 font-sans text-black">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-black/5">
        <button onClick={() => navigate(-1)} className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-gray-900 active:scale-90 transition-all border border-black/10 hover:bg-black/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
           <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-ayur-neon">Dermal Intelligence</h1>
           <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mt-0.5">Scan Decoded</p>
        </div>

        <button onClick={handleShare} className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-ayur-neon active:scale-90 transition-all border border-black/10 hover:bg-black/10">
          {sharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
        </button>
      </div>

      <div className="px-6 space-y-8 pt-8">
        {/* MANDATORY REPORT HEADER */}
        <section className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-sm font-black text-emerald-600 uppercase tracking-[0.3em]">Face Glow Analysis Report</h1>
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
              </div>
              <div className="flex gap-4">
                  <div className="px-4 py-2 bg-stone-100 rounded-full">
                      <span className="text-[10px] font-black text-stone-700 uppercase">{analysis?.conditionName || 'Skin Glow Assessment'}</span>
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
                        <p><strong>Wellness Score:</strong> {analysis?.glowScore || 78}/100</p>
                        <p><strong>Dominant Dosha:</strong> {analysis?.doshaHeader?.dominant || 'N/A'}</p>
                        <p><strong>Root Cause:</strong> {analysis?.rootCause || 'Based on your signals, we see temporary imbalances.'}</p> 
                        <p><strong>Key Insight:</strong> {analysis?.deepInsight ? analysis.deepInsight.substring(0, 150) + "..." : "Understanding your skin's subtle signals is the first step to balance."}</p>
                        <p><strong>Home Remedy:</strong> {analysis?.homeRemedies?.[0]?.name || "Consult your practitioner for personalized herbal support."}</p>
                        <p><strong>Lifestyle Tip:</strong> {analysis?.routine?.lifestyleTips?.[0] || "Maintain regular cleansing rituals for glow stability."}</p>
                    </div>
                </div>
            )}
        </section>

        <StandardHero 
          score={analysis?.glowScore || 0}
          title={isPremium ? "Full Skin Genesis Decoded." : isPro ? "Advanced Dermal Map." : "Core Glow Index."}
          subtitle="Dermal Intelligence"
          label="Dermal Glow Index"
          color="text-ayur-teal"
          accentColor="bg-ayur-teal/10"
          onShare={handleShare}
        />

        {/* Dynamic Universal Premium Report Section */}
        {isPremium && (
          <DynamicPremiumReport data={analysis} featureName="Face Glow" />
        )}

        {/* AI Observations - BASIC+ */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Brain className="w-5 h-5 text-ayur-neon" />
            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">AI Observations</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {(analysis.observations || []).slice(0, isBasic ? 2 : undefined).map((obs: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] p-5 flex items-start gap-4 hover:border-teal-500/20 transition-all"
              >
                <div className="w-10 h-10 bg-ayur-neon/10 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-ayur-neon" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">{obs.title}</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed">{obs.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Logic Citation - PRO+ */}
        {(isPro || isPremium) && analysis.detailedReasoning && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 text-ayur-neon">
              <Sparkles className="w-40 h-40" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 bg-ayur-neon rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-xl font-black uppercase tracking-tighter">Biological Logic Citation</h4>
              </div>
              <p className="text-lg font-medium text-gray-300 leading-relaxed border-l-2 border-ayur-neon pl-6 italic">
                "{analysis.detailedReasoning}"
              </p>
            </div>
          </motion.div>
        )}

        {/* Routine & Diet - PRO+ */}
        {(isPro || isPremium) && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 px-2">
              <Target className="w-5 h-5 text-ayur-neon" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Skincare Routine</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Morning Routine */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] p-8 space-y-4 hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Morning Routine</h4>
                </div>
                <ul className="space-y-3">
                  {(analysis.suggestions.skincare?.morning || []).map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-3 text-xs text-gray-600 font-bold leading-relaxed">
                      <Check className="w-4 h-4 text-ayur-neon shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Night Routine */}
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] p-8 space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Night Routine</h4>
                </div>
                <ul className="space-y-3">
                  {(analysis.suggestions.skincare?.night || []).map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-3 text-xs text-gray-600 font-bold leading-relaxed">
                      <Check className="w-4 h-4 text-ayur-neon shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Possible Causes - PREMIUM */}
        {isPremium && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Info className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Personalized Causes</h3>
            </div>
            <div className="bg-amber-50 rounded-[2.5rem] border border-amber-100 p-8 space-y-6">
              {(analysis.possibleCauses || []).map((cause: any, i: number) => (
                <div key={i} className="space-y-2">
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {cause.title}
                  </h4>
                  <p className="text-xs text-amber-700 font-bold leading-relaxed">{cause.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Recommended Products */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Glow Boosters</h3>
            <span className="text-[10px] font-black text-ayur-neon uppercase tracking-widest">Premium Selection</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis.recommendedProducts.map((product: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-black/[0.03] overflow-hidden group hover:border-[#CCFF00]/20 transition-all flex flex-col"
              >
                <div className="relative aspect-square bg-black/5 overflow-hidden p-6">
                  <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner bg-white relative">
                    <AnimatePresence mode="wait">
                      {product.sketchImage ? (
                        <motion.img 
                          key="sketch"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          src={product.sketchImage} 
                          alt={product.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <motion.img 
                          key="placeholder"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          src={`https://loremflickr.com/400/400/ayurveda,skincare,herb,${encodeURIComponent(product.imageSearchTerm || product.name)}?lock=${i}`} 
                          alt={product.name}
                          className="w-full h-full object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </AnimatePresence>

                    {generatingSketch === product.name && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                        <Loader2 className="w-8 h-8 text-ayur-neon animate-spin mb-2" />
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Generating AI Sketch...</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute top-8 left-8">
                    <span className="bg-ayur-neon text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg shadow-green-100 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  
                  {!product.sketchImage && !generatingSketch && (
                    <button 
                      onClick={() => handleGenerateSketch(product.name, i)}
                      className="absolute bottom-8 right-8 bg-white text-ayur-neon p-3 rounded-2xl shadow-xl border border-green-50 hover:bg-green-50 transition-colors group/btn"
                    >
                      <Wand2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  )}
                </div>
                
                <div className="p-6 pt-2 space-y-4 flex-1 flex flex-col">
                  <div className="space-y-1">
                    <h5 className="text-lg font-black text-gray-900 leading-tight group-hover:text-ayur-neon transition-colors uppercase">
                      {product.name}
                    </h5>
                    <p className="text-xs text-gray-500 line-clamp-2 font-bold leading-relaxed">
                      {product.benefit}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-black/5">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price</p>
                      <p className="text-xl font-black text-gray-900">{product.price || '₹499'}</p>
                    </div>
                    <a 
                      href={`https://www.amazon.in/s?k=${encodeURIComponent(product.name)}&tag=goldify00-21`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-ayur-neon text-white px-6 py-3 rounded-2xl text-xs font-black shadow-lg shadow-green-100 hover:shadow-green-200 transition-all active:scale-95"
                    >
                      BUY NOW
                      <ShoppingCart className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-black/5 p-6 rounded-[2rem] border border-black/5">
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed text-center uppercase tracking-widest">
            Disclaimer: This AI analysis is for wellness guidance only and does not constitute medical advice. Consult a dermatologist for persistent skin conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
