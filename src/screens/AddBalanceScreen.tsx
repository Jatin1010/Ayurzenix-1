import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Wallet, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Undo2, 
  CheckCircle2, 
  Crown, 
  Sparkles, 
  ChevronRight,
  CreditCard,
  History
} from 'lucide-react';
import axios from 'axios';

declare global {
  interface Window {
    Razorpay: any;
  }
}

import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';
import { useRealtimeWallet } from '../hooks/useRealtimeWallet';

export default function AddBalanceScreen({ userData }: { userData: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { featureId, selectedPlan, requiredAmount, returnRoute } = location.state || { 
    featureId: '', 
    selectedPlan: 'basic', 
    requiredAmount: 0, 
    returnRoute: '/' 
  };

  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(requiredAmount > 49 ? requiredAmount : 49);
  const [error, setError] = useState<string | null>(null);

  const { balance: realtimeBalance, lastUpdateType } = useRealtimeWallet();
  const currentBalance = realtimeBalance ?? (userData?.wallet_balance || 0);

  const rechargeOptions = [
    { amount: 199, bonus: 25, label: 'Basic Pack' },
    { amount: 499, bonus: 100, label: 'Standard Pack', badge: 'Popular' },
    { amount: 999, bonus: 250, label: 'Pro Pack', badge: 'Best Value' },
    { amount: 2499, bonus: 750, label: 'Elite Pack', badge: 'Maximum Value' }
  ];

  const handleRazorpayPayment = async (amountToPay: number) => {
    if (!auth.currentUser) {
      navigate('/auth');
      return;
    }

    setLoading(true);
    setError(null);

    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      setError("Failed to load payment gateway. Please check your connection.");
      setLoading(false);
      return;
    }

    const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      setError("Payment configuration missing. Please ensure RAZORPAY_KEY_ID is set.");
      setLoading(false);
      return;
    }

    try {
      const bonus = rechargeOptions.find(o => o.amount === amountToPay)?.bonus || 0;
      
      // 1. Create Order
      const { data: order } = await axios.post('/api/razorpay/order', {
        amount: amountToPay,
        userId: auth.currentUser!.uid,
        receipt: `recharge_${Date.now()}`,
        bonus
      });

      const options = getRazorpayConfig(
        order,
        userData,
        async (response: any) => {
          try {
            setLoading(true);
            // 2. Verify Payment & Credit User on Backend
            const { data: verification } = await axios.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: auth.currentUser!.uid,
              amount: amountToPay,
              bonus: rechargeOptions.find(o => o.amount === amountToPay)?.bonus || 0
            });

            if (verification.status === 'success') {
              console.log(`Payment verified. Credited: ₹${verification.credited}`);
              
              // 3. Auto Resume Flow
              if (returnRoute && featureId) {
                navigate(returnRoute, { 
                  state: { 
                    autoAnalyze: true, 
                    featureId, 
                    selectedPlan 
                  },
                  replace: true 
                });
              } else {
                navigate('/wallet', { replace: true });
              }
            } else {
              setError('Payment verification failed on server.');
            }
          } catch (err: any) {
            console.error('Verification Error:', err);
            const errorMsg = err.response?.data?.error || err.message || 'Something went wrong during verification.';
            setError(`Verification Error: ${errorMsg}`);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false)
      );

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to initiate payment.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FCF9] pb-24 selection:bg-ayur-neon/30">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm border-b border-black/5 flex items-center justify-between sticky top-0 z-50">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Add Balance</h1>
        <button 
          onClick={() => navigate('/wallet')}
          className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 active:scale-95 transition-all"
        >
           <History className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="px-6 py-8 space-y-8">
        {/* Balance Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 rounded-[2rem] p-6 text-center space-y-2 shadow-sm">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Balance</p>
             <motion.p 
                key={currentBalance}
                animate={{ 
                  scale: lastUpdateType === 'increase' ? [1, 1.2, 1] : 1,
                  color: lastUpdateType === 'increase' ? '#10B981' : '#111827'
                }}
                className="text-2xl font-black tracking-tighter"
             >
                ₹{currentBalance}
             </motion.p>
          </div>
          <div className="bg-ayur-neon/5 border border-ayur-neon/20 rounded-[2rem] p-6 text-center space-y-2 shadow-sm">
             <p className="text-[10px] font-black text-ayur-neon uppercase tracking-widest">Required Amount</p>
             <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{requiredAmount}</p>
          </div>
        </div>

        {/* Message */}
        <div className="bg-[#0B1F1A] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-neon/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-ayur-neon">
                 <Zap className="w-6 h-6 fill-ayur-neon" />
              </div>
              <div>
                 <h2 className="text-lg font-black uppercase tracking-tight">Access Locked</h2>
                 <p className="text-[9px] font-black text-white/50 uppercase tracking-widest">Recharge to unlock AI Analysis</p>
              </div>
           </div>
        </div>

        {/* Recharge Options */}
        <div className="space-y-4">
           <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] px-2 text-center">Select Recharge Multiplier</h3>
           <div className="grid grid-cols-1 gap-4">
              {rechargeOptions.map((opt) => (
                <button
                  key={opt.amount}
                  onClick={() => setSelectedAmount(opt.amount)}
                  className={`relative p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group active:scale-[0.98] ${
                    selectedAmount === opt.amount 
                    ? 'bg-white border-ayur-neon shadow-2xl shadow-ayur-neon/10' 
                    : 'bg-white border-black/5 hover:border-ayur-neon/30'
                  }`}
                >
                  {opt.badge && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-ayur-gold rounded-full shadow-lg">
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">{opt.badge}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col items-start gap-1">
                     <p className={`text-xs font-black uppercase tracking-widest ${selectedAmount === opt.amount ? 'text-ayur-neon' : 'text-gray-400'}`}>
                        {opt.label}
                     </p>
                     <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-gray-900 tracking-tighter">₹{opt.amount}</span>
                        {opt.bonus > 0 && (
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                             +₹{opt.bonus} Bonus
                          </span>
                        )}
                     </div>
                  </div>

                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedAmount === opt.amount 
                    ? 'border-ayur-neon bg-ayur-neon text-white' 
                    : 'border-gray-100 bg-gray-50 text-transparent'
                  }`}>
                     <CheckCircle2 className="w-5 h-5" />
                  </div>
                </button>
              ))}
           </div>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 py-4">
           {[
             { icon: <ShieldCheck className="w-4 h-4" />, label: 'Secure' },
             { icon: <Clock className="w-4 h-4" />, label: 'Instant' },
             { icon: <Undo2 className="w-4 h-4" />, label: 'Refunds' }
           ].map((t, i) => (
             <div key={i} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white border border-black/5 rounded-full flex items-center justify-center text-gray-400 shadow-sm">{t.icon}</div>
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{t.label}</span>
             </div>
           ))}
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
            <p className="text-xs font-bold text-rose-600">{error}</p>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-black/5 z-40">
        <div className="max-w-md mx-auto space-y-4">
           <button
             onClick={() => handleRazorpayPayment(selectedAmount)}
             disabled={loading}
             className="glow-button-green w-full py-6 rounded-[2rem] text-white font-black text-xs uppercase tracking-[0.4em] shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
           >
             {loading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
             ) : (
               <>Proceed to Pay <CreditCard className="w-5 h-5" /></>
             )}
           </button>
           <button 
             onClick={() => navigate('/pricing')}
             className="w-full py-4 rounded-xl text-gray-500 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
           >
              <Crown className="w-3 h-3 text-ayur-gold" /> View Premium Plans <ChevronRight className="w-3 h-3" />
           </button>
        </div>
      </div>
    </div>
  );
}
