import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Zap, 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Lock, 
  Wallet,
  Plus,
  ShieldCheck,
  Brain,
  ShieldAlert,
  Dna,
  Activity,
  Target
} from 'lucide-react';
import { doc, updateDoc, increment, collection, serverTimestamp, setDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import axios from 'axios';
import { cn } from '../lib/utils';
import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';
import LoadingYogi from '../components/LoadingYogi';
import { useRealtimeWallet } from '../hooks/useRealtimeWallet';

interface AnalysisPlanSelectionScreenProps {
  userData: any;
  setUserData?: (data: any) => void;
}

export const PLANS = [
  {
    id: 'basic',
    name: 'BASIC',
    title: 'Free Insight',
    price: 0,
    description: 'Quick Ayurvedic scan for essential metabolic awareness.',
    icon: <Sparkles className="w-8 h-8" />,
    color: '#00BFA6',
    benefits: [
      'Health Index Score',
      'Dominant Dosha Imbalance',
      'Basic Wellness Summary',
      'Limited Lifestyle Recommendations'
    ],
    locked: [
      'Root Cause Analysis',
      'Food & Routine Protocol',
      '7-Day Plan',
      '30-Day Evolution'
    ],
    cta: 'Select Basic'
  },
  {
    id: 'pro',
    name: 'PRO',
    title: 'Deep Intelligence',
    price: 49,
    description: 'Comprehensive biological mapping with actionable healing protocols.',
    icon: <Zap className="w-8 h-8" />,
    color: '#A259FF',
    badge: 'RECOMMENDED',
    benefits: [
      'Everything in Basic',
      'Deep Root Cause Analysis',
      'Bio-Optimal Food Guidance',
      'Personalized Recovery Routines',
      '7-Day Healing Protocol'
    ],
    locked: [
      '30-Day Evolution Blueprint',
      'Future Health Prediction',
      'Premium PDF Ledger'
    ],
    cta: 'Select Pro'
  },
  {
    id: 'premium',
    name: 'PREMIUM',
    title: 'Transformation Protocol',
    price: 99,
    description: 'The ultimate depth of clinical & spiritual wellness intelligence.',
    icon: <Crown className="w-8 h-8 text-[#FFB400]" />,
    color: '#006BDF',
    benefits: [
      'Everything in Pro',
      'Full Recovery Roadmap',
      '30-Day Evolution Blueprint',
      'Future Health Predictor',
      'Long-Term Transformation System',
      'Premium PDF Ledger Download'
    ],
    cta: 'Start Transformation'
  }
];

export default function AnalysisPlanSelectionScreen({ userData, setUserData }: AnalysisPlanSelectionScreenProps) {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const { balance: realtimeBalance, lastUpdateType } = useRealtimeWallet();
  const balance = realtimeBalance ?? (userData?.wallet_balance || 0);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) return;
      const p = await getProfileLocally(profileId);
      if (!p) {
        navigate('/history');
        return;
      }
      setProfile(p);
      setLoading(false);
    };
    fetchProfile();
  }, [profileId]);

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    if (!profileId || !userData?.uid || processing) return;

    if (userData.uid === 'guest') {
      alert("Please sign in to unlock deep intelligence analysis.");
      navigate('/auth');
      return;
    }

    setProcessing(true);

    try {
      const email = userData?.email?.toLowerCase();
      const isDeveloper = email === 'help@ayurzenix.in' || email === 'ayurzenix@gmail.com';
      const isAdmin = userData?.is_admin || isDeveloper;
      
      // If basic or developer/admin, unlock instantly
      if (plan.price === 0 || isAdmin) {
        await finalizeUnlock(plan);
        return;
      }

      // Check Wallet
      if ((userData.free_results_count || 0) > 0) {
        const userRef = doc(db, 'users', userData.uid);
        await updateDoc(userRef, { free_results_count: increment(-1) });
        await finalizeUnlock(plan);
        return;
      }

      const balance = Number(userData.wallet_balance || 0);

      if (balance >= plan.price) {
        try {
          // Securely deduct from wallet via API
          const response = await axios.post('/api/wallet/unlock', {
            userId: userData.uid,
            planId: plan.id,
            amount: plan.price,
            featureName: profile?.type || 'Intelligence Analysis',
            profileId: profileId
          });
          
          if (response.data.success) {
            // Update local state if provided
            if (setUserData) {
              setUserData((prev: any) => ({
                ...prev,
                wallet_balance: response.data.balance || (balance - plan.price)
              }));
            }
            await finalizeUnlock(plan);
          } else {
            throw new Error(response.data.error || "Unlock failed");
          }
        } catch (apiError: any) {
          const msg = apiError.response?.data?.error || apiError.message;
          if (msg.includes('Insufficient wallet balance')) {
            // If API says insufficient but frontend thought we had enough, 
            // the state might be out of sync. Re-trigger payment flow.
            await handleRazorpayPayment(plan);
          } else {
            throw apiError;
          }
        }
        return;
      }

      // If not enough balance, initiate recharge + unlock flow
      await handleRazorpayPayment(plan);

    } catch (error: any) {
      console.error("Unlock Error Object:", error);
      const serverError = error.response?.data?.error;
      const errorMessage = serverError || error.message || "Failed to unlock report";
      
      if (errorMessage.includes("Insufficient wallet balance")) {
        // Specific UI for low balance
        if (confirm("Insufficient balance in your Veda Wallet. Would you like to recharge and unlock this report now?")) {
           await handleRazorpayPayment(plan);
        } else {
           setProcessing(false);
        }
      } else {
        alert("Unlock Error: " + errorMessage);
        setProcessing(false);
      }
    }
  };

  const handleRazorpayPayment = async (plan: typeof PLANS[0]) => {
    try {
      setProcessing(true);
      
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load payment gateway.");
        setProcessing(false);
        return;
      }

      const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert("Payment configuration missing. Please ensure RAZORPAY_KEY_ID is set in settings.");
        setProcessing(false);
        return;
      }

      const { data: order } = await axios.post('/api/razorpay/order', { 
        amount: plan.price, 
        userId: userData.uid,
        receipt: `unlock_${profileId}_${Date.now()}`,
        notes: {
          isUnlock: 'true',
          reportTitle: plan.title,
          userId: userData.uid,
          profileId: profileId || ''
        }
      });
      
      const options = getRazorpayConfig(
        order,
        userData,
        async (response: any) => {
          try {
            setProcessing(true);
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
              alert("Verification failed on server.");
              setProcessing(false);
            }
          } catch (e: any) {
            console.error(e);
            alert("Payment verification error: " + (e.response?.data?.error || e.message));
            setProcessing(false);
          }
        },
        () => setProcessing(false)
      );
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert("Failed to initiate payment: " + (error.response?.data?.error || error.message));
      setProcessing(false);
    }
  };

  const finalizeUnlock = async (plan: typeof PLANS[0]) => {
    if (!profileId) return;
    
    // Updates local storage as the primary source of truth for immediate navigation
    // NOTE: NOT setting isPaid: true here anymore, it will be set after payment on the result screen
    await updateProfileLocally(profileId, { planId: plan.id });
    
    // Sync to Firestore if logged in - non-blocking
    if (userData?.uid && userData.uid !== 'guest') {
      try {
        const profileRef = doc(db, 'health_profiles', profileId);
        await updateDoc(profileRef, { planId: plan.id });
      } catch (e) {
        console.error("Non-critical: Failed to sync plan selection to Firestore:", e);
      }
    }
    
    // Immediate navigation to result screen, result screen will handle payment
    const targetPath = profile?.type === 'sleep_intelligence' ? `/sleep-intelligence/result/${profileId}` :
                       profile?.type === 'stress_relief' ? `/stress-relief/result/${profileId}` :
                       profile?.type === 'agni_engine' ? `/agni-engine/result/${profileId}` :
                       profile?.type === 'heart_health' ? `/heart-health-result/${profileId}` :
                       profile?.type === 'face_glow' ? `/face-glow/result/${profileId}` :
                       profile?.type === 'smart_mental_scan' ? `/smart-mental-scan/result/${profileId}` :
                       `/result/${profileId}`;
                       
    navigate(targetPath, { replace: true });
  };

  if (loading || processing) return <LoadingYogi />;

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#A259FF]/10 pb-20">
      {/* Cinematic Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-8 flex items-center justify-between sticky top-0 bg-white/70 backdrop-blur-3xl z-50 border-b border-black/5"
      >
        <button onClick={() => navigate(-1)} className="w-12 h-12 rounded-2xl bg-white shadow-premium flex items-center justify-center text-black active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Select Analysis Depth</p>
          <h1 className="text-xl font-black text-black uppercase tracking-tighter">Your Health Ledger</h1>
        </div>
        <div className="w-12 h-12 flex items-center justify-center">
           <Dna className="w-6 h-6 text-[#A259FF]" />
        </div>
      </motion.header>

      <main className="px-6 py-12 max-w-7xl mx-auto space-y-12">
        {/* Wallet Balance Header */}
        <div className="flex justify-center -mt-6 mb-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/wallet')}
            className="flex items-center gap-3 px-6 py-3 bg-white border border-black/5 shadow-premium rounded-2xl cursor-pointer hover:border-[#A259FF]/20 group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A259FF]/10 flex items-center justify-center text-[#A259FF] group-hover:bg-[#A259FF]/20 transition-all">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Veda Wallet</p>
              <motion.p 
                key={balance}
                animate={{ 
                  scale: lastUpdateType === 'increase' ? [1, 1.2, 1] : 1,
                  color: lastUpdateType === 'increase' ? '#10B981' : '#000000'
                }}
                className="text-sm font-black"
              >
                ₹{balance.toLocaleString('en-IN')}
              </motion.p>
            </div>
            <div className="ml-4 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#A259FF]/10 group-hover:text-[#A259FF] transition-all">
              <Plus className="w-4 h-4" />
            </div>
          </motion.div>
        </div>

        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ayur-purple/10 text-ayur-purple rounded-full text-xs font-black uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3" />
            Analysis Complete
          </motion.div>
          <h1 className="text-4xl font-black text-black tracking-tight leading-none">
            Choose Your Depth <br />of Intelligence.
          </h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">
            Your body signals have been decoded. Decide how deep you want to explore your wellness patterns and bio-signals.
          </p>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative group rounded-[3rem] p-10 flex flex-col h-full bg-white transition-all duration-500",
                plan.id === 'pro' 
                  ? "border-2 border-[#A259FF] shadow-[0_40px_100px_-20px_rgba(162,89,255,0.15)] ring-8 ring-[#A259FF]/5" 
                  : "border border-black/10 shadow-premium"
              )}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 p-3 px-8 bg-[#A259FF] rounded-bl-[2rem]">
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">{plan.badge}</span>
                </div>
              )}

              <div className="space-y-6 mb-10">
                <div className="space-y-4">
                  <div className={cn(
                    "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500",
                  )} style={{ backgroundColor: plan.color }}>
                    {plan.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">{plan.name}</p>
                    <h3 className="text-2xl font-black text-black uppercase tracking-tight">{plan.title}</h3>
                  </div>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-black">₹{plan.price}</span>
                  <span className="text-xs font-black text-gray-300 uppercase tracking-widest">/ Report</span>
                </div>

                <p className="text-sm font-bold text-gray-500 leading-relaxed italic">{plan.description}</p>
              </div>

              <div className="flex-1 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                     <Target className="w-4 h-4 text-[#A259FF]" />
                     <p className="text-[11px] font-black text-black uppercase tracking-widest">Protocol Intelligence</p>
                  </div>
                  <div className="space-y-3">
                    {plan.benefits.map((benefit, j) => (
                      <div key={j} className="flex items-start gap-4">
                        <div className="mt-0.5 w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <span className="text-sm font-bold text-gray-800 leading-tight">{benefit}</span>
                      </div>
                    ))}
                    {(plan.locked || []).map((locked, j) => (
                      <div key={j} className="flex items-start gap-4 opacity-30">
                        <div className="mt-0.5 w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Lock className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 leading-tight">{locked}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectPlan(plan)}
                className={cn(
                  "w-full py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] mt-10 shadow-2xl transition-all flex items-center justify-center gap-3",
                  plan.id === 'premium' ? "bg-black text-white" : plan.id === 'pro' ? "bg-[#A259FF] text-white" : "bg-stone-50 text-black border border-black/5 hover:bg-black hover:text-white"
                )}
              >
                {plan.cta} <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Security & Trust */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-black/5">
           {[
             { icon: <ShieldCheck className="text-emerald-500" />, t: "Secure Checkout", d: "Encrypted Transactions" },
             { icon: <Wallet className="text-[#006BDF]" />, t: "Wallet Integration", d: "Instant Balance Use" },
             { icon: <Brain className="text-[#A259FF]" />, t: "Neural Processing", d: "High-Priority GPU Energy" }
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-black/5">
               <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner">
                 {item.icon}
               </div>
               <div>
                 <p className="text-[10px] font-black text-black uppercase tracking-widest leading-none mb-1">{item.t}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.d}</p>
               </div>
             </div>
           ))}
        </div>
      </main>
    </div>
  );
}
