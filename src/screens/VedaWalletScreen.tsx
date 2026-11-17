import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Plus, 
  Sparkles, 
  History, 
  Gift, 
  Users, 
  Crown, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Zap,
  Activity,
  Heart,
  Droplets,
  Star,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Search,
  Bell,
  MoreVertical,
  Loader2,
  X,
  CreditCard as CreditCardIcon,
  CheckCircle2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { 
  doc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  addDoc, 
  serverTimestamp, 
  increment,
  limit
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { onAuthStateChanged } from 'firebase/auth';
import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';
import { useRealtimeWallet, Transaction } from '../hooks/useRealtimeWallet';

// --- Types ---
interface Report {
  id: string;
  title: string;
  category: string;
  price: number;
  score: number;
  icon: any;
  color: string;
  preview: string;
  techSpecs: string[];
}

interface DocTransaction {
  id: string;
  type: 'recharge' | 'payment' | 'deduction' | 'subscription' | 'reward' | 'credit' | 'debit';
  title?: string;
  description?: string;
  amount: number;
  date: any;
  status: 'completed' | 'pending' | 'success';
}

// --- Components ---

const AddBalanceModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean, onClose: () => void, onAdd: (amount: number) => void }) => {
  const [amount, setAmount] = useState(500);
  const [isProcessing, setIsProcessing] = useState(false);

  const amounts = [500, 1000, 2500, 5000, 10000];

  const handleAdd = async () => {
    setIsProcessing(true);
    await onAdd(amount);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[3rem] w-full max-w-md overflow-hidden relative z-10 shadow-2xl"
      >
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Add Credits</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Amount</p>
            <div className="grid grid-cols-2 gap-3">
              {amounts.map(amt => (
                <button 
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-4 rounded-2xl border-2 transition-all font-black text-lg ${
                    amount === amt 
                      ? "border-[#A259FF] bg-[#A259FF]/5 text-[#A259FF]" 
                      : "border-slate-100 hover:border-slate-200 text-slate-400"
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold">₹</span>
              </div>
              <input 
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Custom Amount"
                className="w-full pl-8 pr-4 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#A259FF] font-black text-xl transition-all"
              />
            </div>
          </div>

          <button 
            disabled={isProcessing || amount <= 0}
            onClick={handleAdd}
            className="w-full py-6 rounded-3xl bg-[#111827] text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:active:scale-100"
          >
            {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
            {isProcessing ? "Processing..." : `Recharge ₹${amount}`}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const GlassCard = ({ children, className = "" }: any) => (
  <div className={`backdrop-blur-2xl bg-white/60 border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.04)] ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, actionLabel }: any) => (
  <div className="flex justify-between items-end mb-8 px-2">
    <div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
      {subtitle && <p className="text-slate-400 text-sm font-medium">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button className="text-xs font-black uppercase tracking-widest text-[#A259FF] flex items-center gap-1 hover:gap-2 transition-all">
        {actionLabel} <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

// --- Main Screen ---

export default function VedaWalletScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [user, setUser] = useState<any>(null);
  
  const { 
    balance: realtimeBalance, 
    transactions: realtimeTransactions, 
    loading: walletLoading,
    lastUpdateType
  } = useRealtimeWallet();

  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Wallet Card 3D Animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  // Derived state or fallback
  const balance = realtimeBalance ?? 0;
  const transactions = realtimeTransactions;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setIsLoading(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!walletLoading) {
      setIsLoading(false);
    }
  }, [walletLoading]);

  const handleAddCredits = async (amount: number) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      setIsLoading(true);
      
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Failed to load payment gateway.");
        setIsLoading(false);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        alert("Payment configuration missing. Please ensure RAZORPAY_KEY_ID is set in settings.");
        setIsLoading(false);
        return;
      }

      // 1. Get bonus info based on amount (client side for UI, server will re-verify)
      let bonus = 0;
      if (amount >= 2499) bonus = 750;
      else if (amount >= 999) bonus = 250;
      else if (amount >= 499) bonus = 100;
      else if (amount >= 199) bonus = 25;

      // 2. Create Razorpay Order
      const { data: order } = await axios.post('/api/razorpay/order', {
        amount,
        userId: user.uid,
        receipt: `recharge_${Date.now()}`,
        bonus
      });

      const options = getRazorpayConfig(
        order,
        { ...user, uid: user.uid }, // Ensure uid is present
        async (response: any) => {
          try {
            setIsLoading(true);
            const { data: verifyData } = await axios.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: user.uid,
              amount: amount,
              bonus: bonus
            });

            if (verifyData.status === 'success') {
              setIsAddModalOpen(false);
              // Balance will update automatically via Firestore snapshot listener
            } else {
              alert("Payment verification failed on server.");
            }
          } catch (e: any) {
            console.error(e);
            alert("Verification error: " + (e.response?.data?.error || e.message));
          } finally {
            setIsLoading(false);
          }
        },
        () => setIsLoading(false)
      );

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment Error:', error);
      alert("Failed to initiate payment: " + (error.response?.data?.error || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseMove = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const reports: Report[] = [
    { 
        id: '1', 
        title: 'Future Health Predictor', 
        category: 'AI Analytics', 
        price: 2499, 
        score: 85, 
        icon: Zap, 
        color: '#FFB400', 
        preview: "Predict disease patterns 5 years ahead.",
        techSpecs: ["Correlation Modeling", "400+ Bio-markers", "Probabilistic ML"]
    },
    { 
        id: '2', 
        title: 'Smart Gut Scan', 
        category: 'Biometrics', 
        price: 1499, 
        score: 92, 
        icon: Activity, 
        color: '#00BFA6', 
        preview: "Microbiome analysis using AI visual mapping.",
        techSpecs: ["Vision Mapping", "Microbial Clustering", "Agni Efficiency"]
    },
    { 
        id: '3', 
        title: 'Mental Bio-Rhythm', 
        category: 'Emotional', 
        price: 999, 
        score: 78, 
        icon: Heart, 
        color: '#A259FF', 
        preview: "Decode your emotional energy waves.",
        techSpecs: ["Sentiment Flux", "Circadian Sync", "Ojas Indexing"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#A259FF]/10 selection:text-[#A259FF]">
      
      <AnimatePresence>
        {isAddModalOpen && (
          <AddBalanceModal 
            isOpen={isAddModalOpen} 
            onClose={() => setIsAddModalOpen(false)} 
            onAdd={handleAddCredits} 
          />
        )}
      </AnimatePresence>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-[#A259FF]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-[#00BFA6]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-[#FF6B6B]/5 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-[100] px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-2xl border-b border-white/40 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/50 hover:bg-slate-200 transition-all text-slate-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-[#111827] tracking-tight flex items-center gap-2">
              Veda <span className="text-[#A259FF] italic">Wallet</span>
            </h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biological Assets</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#A259FF]">Verified Account</span>
              <span className="text-[10px] font-bold text-slate-900">{user.email}</span>
            </div>
          )}
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100/50 hover:bg-slate-200 transition-all">
            <Bell className="w-5 h-5 text-slate-600" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A259FF] to-[#006BDF] flex items-center justify-center text-white overflow-hidden shadow-lg shadow-[#A259FF]/20">
            <img src={user?.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Ayurzenix"} alt="User" />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-16 pb-32">
        
        {/* 1. Hero Wallet Card */}
        <section 
          className="perspective-[1000px] flex justify-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{ rotateX, rotateY }}
            className="w-full max-w-lg aspect-[1.6/1] relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#A259FF]/20 via-[#006BDF]/20 to-[#00BFA6]/20 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-100 transition duration-500" />
            
            <GlassCard className="relative h-full rounded-[2.5rem] p-10 flex flex-col justify-between overflow-hidden">
               {/* Decorative Gradient Overlays */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#A259FF]/10 rounded-full blur-3xl -mr-20 -mt-20" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00BFA6]/10 rounded-full blur-3xl -ml-20 -mb-20" />

               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#A259FF] flex items-center justify-center text-white shadow-lg shadow-[#A259FF]/30">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Ayurzenix Veda Card</span>
                    </div>
                    <p className="text-xs font-bold text-[#4B5563]">ID: {user?.uid ? `AZ-${user.uid.slice(0, 8).toUpperCase()}` : 'ID: AZ-VEDA-9981'}</p>
                  </div>
                  <div className="px-4 py-1.5 rounded-full bg-[#A259FF]/10 text-[#A259FF] text-[10px] font-black uppercase tracking-widest border border-[#A259FF]/20 backdrop-blur-md">
                    {balance > 10000 ? 'Pro Life Member' : 'Active Member'}
                  </div>
               </div>

               <div className="space-y-1 relative z-10">
                  <span className="text-xs font-black uppercase tracking-widest text-[#A259FF]/80">Current Veda Balance</span>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: lastUpdateType === 'increase' ? [1, 1.05, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    key={balance}
                    className={`text-5xl md:text-6xl font-black tracking-tighter transition-colors duration-500 ${lastUpdateType === 'increase' ? 'text-emerald-500' : 'text-[#111827]'}`}
                  >
                    ₹{balance.toLocaleString('en-IN')}<span className="text-2xl text-slate-300 ml-1">.00</span>
                  </motion.div>
               </div>

               <div className="flex justify-between items-end relative z-10">
                  <div className="flex gap-10">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">AyurCoins</p>
                       <p className="text-xl font-black text-slate-700">{(balance * 2.5).toFixed(0)}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Health Index</p>
                       <p className="text-xl font-black text-[#00BFA6]">92%</p>
                    </div>
                  </div>
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${i * 123}`} alt="Bot" />
                       </div>
                     ))}
                  </div>
               </div>
            </GlassCard>

            {/* Float Action Buttons overlay */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4 w-full justify-center px-6">
               <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex-1 max-w-[160px] py-4 rounded-2xl bg-[#111827] text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
               >
                  Add Credits
               </button>
               <button className="flex-1 max-w-[160px] py-4 rounded-2xl bg-[#A259FF] text-white text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#A259FF]/20 active:scale-95 flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" /> Upgrade
               </button>
            </div>
          </motion.div>
        </section>

        {/* 2. Quick Actions */}
        <section className="grid grid-cols-3 md:grid-cols-6 gap-4">
           {[
             { icon: Plus, label: "Add", color: "bg-[#00BFA6]/10 text-[#00BFA6]" },
             { icon: Sparkles, label: "Unlock", color: "bg-[#A259FF]/10 text-[#A259FF]" },
             { icon: History, label: "History", color: "bg-[#006BDF]/10 text-[#006BDF]" },
             { icon: Gift, label: "Rewards", color: "bg-[#FF6B6B]/10 text-[#FF6B6B]" },
             { icon: Crown, label: "Elite", color: "bg-[#FFB400]/10 text-[#FFB400]" },
             { icon: Users, label: "Refer", color: "bg-slate-100 text-slate-600" }
           ].map((action, i) => (
             <motion.button 
               key={i}
               whileHover={{ y: -4 }}
               whileTap={{ scale: 0.95 }}
               className="flex flex-col items-center gap-3 p-4 rounded-3xl transition-all"
             >
                <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center shadow-sm border border-white/50 backdrop-blur-xl`}>
                   <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{action.label}</span>
             </motion.button>
           ))}
        </section>

        {/* 3. AI Report Store */}
        <section>
          <SectionHeader 
            title="Premium AI Intelligence" 
            subtitle="Unlock deep diagnostic biological mappings"
            actionLabel="View All"
          />
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar -mx-6 px-6">
            {reports.map((report) => (
              <motion.div 
                key={report.id}
                whileHover={{ y: -8 }}
                className="min-w-[280px] snap-center"
              >
                <GlassCard className="rounded-[2.5rem] p-8 space-y-6 h-full flex flex-col justify-between group">
                   <div className="space-y-4">
                      <div className="flex justify-between items-start">
                         <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 text-[#A259FF] group-hover:scale-110 transition-transform duration-500" style={{ color: report.color }}>
                            <report.icon className="w-7 h-7" />
                         </div>
                         <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#A259FF]/5 text-[#A259FF] text-[10px] font-black uppercase tracking-widest border border-[#A259FF]/10">
                           <Zap className="w-3 h-3" /> AI Powered
                         </div>
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{report.title}</h4>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{report.category}</p>
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                        {report.preview}
                      </p>
                      
                      {/* Technical Specs Tags */}
                      <div className="flex flex-wrap gap-2 pt-2">
                         {report.techSpecs.map((spec, idx) => (
                            <span key={idx} className="text-[7px] font-black uppercase px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-slate-600 transition-colors">
                               {spec}
                            </span>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6 pt-6 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Unlock Price</span>
                            <span className="text-lg font-black text-slate-800">₹{report.price}</span>
                         </div>
                         <div className="text-right">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Clinical Score</span>
                            <div className="flex items-center gap-1 text-teal-600 font-black">
                               <Activity className="w-3 h-3" /> {report.score}%
                            </div>
                         </div>
                      </div>
                      <button className="w-full py-4 rounded-2xl bg-[#A259FF] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#A259FF]/20 active:scale-95 transition-all">
                        Unlock Now
                      </button>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Wellness Rewards & Gamification */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <GlassCard className="rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic">Wellness Streak</h3>
                    <p className="text-sm font-bold text-slate-400">Consistent bio-alignment</p>
                 </div>
                 <div className="w-16 h-16 rounded-full border-4 border-amber-100 flex items-center justify-center p-2 relative">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      className="absolute inset-0 border-t-4 border-amber-500 rounded-full" 
                    />
                    <Zap className="w-6 h-6 text-amber-500" />
                 </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                 {[...Array(7)].map((_, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${i < 4 ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-slate-100 text-slate-300'}`}>
                         {i < 4 ? <CheckIcon className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">D{i+1}</span>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between items-center p-6 bg-slate-50/50 rounded-3xl border border-white">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-600">
                       <Gift className="w-5 h-5" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-slate-400">Xp Reward Earned</p>
                       <p className="text-sm font-black text-slate-800">+250 AyurCoins</p>
                    </div>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
           </GlassCard>

           <GlassCard className="rounded-[2.5rem] p-10 space-y-8 bg-gradient-to-br from-[#A259FF]/5 to-white overflow-hidden relative border-white">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#A259FF]/5 rounded-full blur-3xl" />
              <div className="space-y-2">
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#A259FF]/10 text-[#A259FF] text-[9px] font-black uppercase tracking-widest w-fit">
                    Level Up
                 </div>
                 <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Master <span className="text-[#A259FF]">Sattvic</span> Status</h3>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <span>Progress to Level 12</span>
                    <span>84%</span>
                 </div>
                 <div className="h-4 w-full bg-white rounded-full overflow-hidden p-1 shadow-inner border border-[#A259FF]/10">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "84%" }}
                      className="h-full bg-gradient-to-r from-[#A259FF] to-[#006BDF] rounded-full flex items-center justify-end px-2"
                    >
                       <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </motion.div>
                 </div>
              </div>

              <div className="flex gap-3">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex-1 p-4 rounded-2xl bg-white border border-[#A259FF]/5 shadow-sm flex flex-col items-center gap-2 group hover:border-[#A259FF]/20 transition-all">
                      <Star className={`w-5 h-5 ${i === 1 ? 'text-[#FFB400]' : 'text-slate-200 group-hover:text-[#FFB400]/40'}`} />
                      <span className="text-[9px] font-black text-slate-400 uppercase">Badge {i}</span>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </section>

        {/* 5. Transaction History */}
        <section>
          <SectionHeader 
            title="Intelligence Log" 
            subtitle="Tracking your biological transactions"
            actionLabel="Export PDF"
          />
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-[#A259FF] animate-spin" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing with Node...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                <History className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                <p className="text-sm font-bold text-slate-400">No transactions recorded yet.</p>
              </div>
            ) : transactions.map((tx) => (
              <motion.div 
                key={tx.id}
                whileHover={{ x: 10 }}
                className="group"
              >
                <GlassCard className="rounded-3xl p-6 flex justify-between items-center group-hover:border-[#A259FF]/20 transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${
                        tx.amount > 0 
                          ? 'bg-[#00BFA6]/5 text-[#00BFA6] border-[#00BFA6]/10' 
                          : 'bg-[#A259FF]/5 text-[#A259FF] border-[#A259FF]/10'
                      }`}>
                         {tx.amount > 0 ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                         <h4 className="font-black text-[#111827] text-lg">{tx.description || tx.title}</h4>
                         <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tx.dateStr}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                              tx.status === 'success' || tx.status === 'completed' ? 'text-[#00BFA6]' : 'text-[#FFB400]'
                            }`}>{tx.status}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-xl font-black ${tx.amount > 0 ? 'text-[#00BFA6]' : 'text-[#111827]'}`}>
                         {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF]">Credits</p>
                   </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 6. Refer & Earn */}
        <section className="relative">
           <div className="absolute inset-x-0 -top-20 -bottom-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[100px] rounded-full" />
           </div>
           
           <GlassCard className="rounded-[3rem] p-12 overflow-hidden relative group border-white">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#A259FF]/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                 <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#A259FF]/10 text-[#A259FF] text-[10px] font-black uppercase tracking-widest">
                       <Users className="w-4 h-4" /> Community Growth
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight tracking-tight">
                       Invite Friends. <br/>
                       <span className="text-[#A259FF] italic">Earn Wellness.</span>
                    </h3>
                    <p className="text-lg font-medium text-slate-500 leading-relaxed">
                       Spread the wisdom of AI-powered Ayurveda. Get 500 Veda Credits for every referral who completes their first bio-scan.
                    </p>
                    <div className="space-y-4">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Referral Code</p>
                       <div className="flex gap-2">
                          <div className="flex-grow p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xl font-black text-slate-800 uppercase tracking-widest flex items-center justify-between">
                             VEDA-LIFE-99
                             <button className="text-[#A259FF] hover:scale-110 transition-transform">
                                <CopyIcon className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       {[
                         { label: "Total Earned", val: "₹4,500", color: "text-[#006BDF]", icon: Wallet },
                         { label: "Friends Joined", val: "12", color: "text-[#00BFA6]", icon: Users },
                         { label: "Reports Unlocked", val: "06", color: "text-[#A259FF]", icon: Sparkles },
                         { label: "Wellness Multiplier", val: "2.5x", color: "text-[#FFB400]", icon: Zap }
                       ].map((stat, i) => (
                         <div key={i} className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col gap-2">
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-800">{stat.val}</p>
                         </div>
                       ))}
                    </div>
                    <button className="w-full py-6 rounded-2xl bg-[#A259FF] text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-[#A259FF]/20 hover:scale-[1.02] transition-all active:scale-95">
                       Invite Friends Now
                    </button>
                 </div>
              </div>
           </GlassCard>
        </section>

      </main>

      {/* Floating Bottom Nav for Wallet Actions */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] w-[90%] max-w-sm">
         <GlassCard className="rounded-full px-4 py-4 flex items-center justify-between shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border-white">
            <button className="flex-1 flex flex-col items-center gap-1 group">
               <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#A259FF] group-hover:bg-[#A259FF]/5 transition-all">
                  <CreditCard className="w-6 h-6" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF]">Cards</span>
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="w-16 h-16 -mt-12 rounded-full bg-[#A259FF] text-white shadow-2xl shadow-[#A259FF]/40 flex items-center justify-center animate-bounce-slow"
            >
               <Plus className="w-8 h-8" />
            </button>
            <button className="flex-1 flex flex-col items-center gap-1 group">
               <div className="w-12 h-12 rounded-full flex items-center justify-center text-[#A259FF] group-hover:bg-[#A259FF]/5 transition-all">
                  <Activity className="w-6 h-6" />
               </div>
               <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF]">Activity</span>
            </button>
         </GlassCard>
      </div>

    </div>
  );
}

const CheckIcon = ({ className, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="4" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CopyIcon = ({ className, ...props }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className} 
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
