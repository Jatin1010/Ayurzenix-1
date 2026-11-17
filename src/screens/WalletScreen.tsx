import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';
import { WalletHeader } from '../components/wallet/WalletHeader';
import { WalletBalance } from '../components/wallet/WalletBalance';
import { WalletActions } from '../components/wallet/WalletActions';
import { 
  ArrowLeft, 
  Wallet, 
  Plus, 
  History, 
  ChevronRight, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  Bell,
  HelpCircle,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Zap,
  TrendingUp,
  ShieldCheck,
  Search,
  Filter,
  Share2,
  CreditCard as CardIcon,
  Smartphone,
  Globe,
  Star,
  Lock,
  ArrowRightLeft,
  Tag,
  Users,
  Repeat,
  Menu,
  Eye,
  Info,
  ChevronDown,
  Calendar,
  X,
  CreditCard as Card,
  Smartphone as UpiIcon,
  Globe as NetBankIcon,
  Briefcase as WalletIcon,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { auth, db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import LoadingYogi from '../components/LoadingYogi';
import axios from 'axios';
import { 
  doc, 
  updateDoc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs,
  increment
} from 'firebase/firestore';

interface WalletScreenProps {
  userData: any;
}

type ViewState = 'main' | 'history' | 'add-money' | 'payment-methods';

const COLORS = {
  primary: '#1ABC9C',
  premium: '#D4AF37',
  dark: '#0B2D26',
  text: '#051024',
  bg: '#F5FAF9',
  card: '#FFFFFF',
  credit: '#1ABC9C',
  debit: '#E74C3C',
  pending: '#F39C12'
};

export default function WalletScreen({ userData }: WalletScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>('main');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [addAmount, setAddAmount] = useState('99');
  const [message, setMessage] = useState<string | null>(location.state?.message || null);
  const [pendingPlan, setPendingPlan] = useState<any>(location.state?.plan || null);

  useEffect(() => {
    if (pendingPlan) {
      setAddAmount(pendingPlan.price.toString());
      setView('add-money');
    }
  }, [pendingPlan]);

  useEffect(() => {
    if (userData?.uid) {
      fetchTransactions();
    }
  }, [userData?.uid]);

  const fetchTransactions = async () => {
    try {
      const q = query(
        collection(db, 'transactions'),
        where('uid', '==', userData.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      handleFirestoreError(error, OperationType.GET, 'transactions');
    }
  };

  const handleRecharge = async (amount: number) => {
    if (amount < 1) {
      setMessage("Please enter a valid amount.");
      return;
    }
    
    setLoading(true);
    try {
      if (!(import.meta as any).env.VITE_RAZORPAY_KEY_ID) {
        setMessage("Razorpay Key ID is missing. Please set VITE_RAZORPAY_KEY_ID in settings.");
        setLoading(false);
        return;
      }

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        setMessage("Failed to load payment gateway. Check your internet.");
        setLoading(false);
        return;
      }

      // 1. Create order on backend
      let bonus = 0;
      if (amount === 49) bonus = 5;
      else if (amount === 99) bonus = 15;
      else if (amount === 199) bonus = 40;
      else if (amount === 499) bonus = 120;

      const { data: order } = await axios.post('/api/razorpay/order', {
        amount,
        userId: userData.uid,
        receipt: `rcpt_${Date.now()}`,
        bonus
      });

      const options = getRazorpayConfig(
        order,
        userData,
        async function (response: any) {
          try {
            setLoading(true);
            // 2. Verify payment on backend (Backend also updates Firestore balance/transactions)
            const { data: verifyData } = await axios.post('/api/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId: userData.uid,
              amount: amount,
              bonus: bonus,
              // If it's a subscription, we might want to handle it differently on backend later
              // For now, let's keep it consistent
              planId: pendingPlan?.id
            });

            if (verifyData.status === 'success') {
              const successMsg = pendingPlan 
                ? `Welcome to ${pendingPlan.title}! Your subscription is now active.`
                : `Success! ₹${amount} added successfully.`;
              
              setMessage(successMsg);
              
              if (pendingPlan) {
                setPendingPlan(null);
              }
              
              fetchTransactions();
              
              // Redirect to home after 1.5 seconds if it was a subscription/plan
              setTimeout(() => {
                navigate('/');
              }, 1500);
            } else {
              setMessage("Payment verification failed.");
            }
          } catch (error: any) {
            console.error("Verification error:", error);
            const errorMessage = error.response?.data?.error || error.message || "Failed to verify payment. Please contact support.";
            setMessage(`Verification Error: ${errorMessage}`);
          } finally {
            setLoading(false);
          }
        },
        () => setLoading(false)
      );

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Recharge error:", error);
      setMessage(error.response?.data?.error || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  const renderHeader = (title: string, onBack?: () => void, rightIcon?: React.ReactNode) => (
    <div className="px-6 pt-14 pb-6 bg-white sticky top-0 z-40 border-b border-gray-50 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onBack && (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center text-gray-900 active:scale-90 transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold tracking-tight text-gray-900">{title}</h1>
      </div>
      {rightIcon && <div className="flex items-center gap-3">{rightIcon}</div>}
    </div>
  );

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'Credits') return tx.type === 'credit';
    if (activeFilter === 'Debits') return tx.type === 'debit';
    return true;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  const totalSpent = transactions
    .filter(tx => tx.type === 'debit')
    .reduce((acc, tx) => acc + Number(tx.amount || 0), 0);
  
  const totalReports = transactions
    .filter(tx => tx.type === 'debit' && (tx.description?.toLowerCase().includes('report') || tx.description?.toLowerCase().includes('analysis')))
    .length;

  const MainView = () => (
    <div className="min-h-screen pb-48 overflow-x-hidden relative">
      {/* Elite Depth Background System */}
      <div className="absolute inset-x-0 top-0 h-[800px] pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-[-10%] right-[-10%] w-[120%] h-full bg-emerald-300/30 blur-[180px] rounded-full"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            opacity: [0.15, 0.2, 0.15]
          }}
          transition={{ duration: 30, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 left-[-20%] w-full h-[120%] bg-ayur-teal/20 blur-[150px] rounded-full"
        />
      </div>

      {/* 8K Premium Banking Header */}
      <WalletHeader />

      {/* Floating Liquidity Display - The Core Hero */}
      <WalletBalance balance={userData?.wallet_balance || 0} onAddBalance={() => setView('add-money')} />

      {/* Action Hub - Grid */}
      <WalletActions 
        onAddBalance={() => setView('add-money')} 
        onHistory={() => setView('history')} 
        onRefer={() => navigate('/referral')} 
        onOffers={() => {}} 
      />

      {/* Data Insight Matrix */}
      <div className="px-4 sm:px-8 mt-16 sm:mt-20 space-y-10 sm:space-y-12">
        <div className="space-y-6 sm:space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 sm:space-y-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-ayur-teal animate-ping" />
                <h3 className="text-xl sm:text-2xl font-[1000] text-black tracking-tightest uppercase">Wealth DNA</h3>
              </div>
              <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] pl-4 sm:pl-5">Analytical Breakdown</p>
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 sm:gap-3 bg-white/40 backdrop-blur-3xl border border-white/60 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-xl text-[9px] sm:text-[10px] font-black text-black uppercase tracking-widest"
            >
              Quarterly <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] bg-black text-white overflow-hidden group shadow-2xl border border-white/5"
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-ayur-teal/10 blur-[40px] sm:blur-[60px] -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 transition-all group-hover:scale-125" />
              <div className="relative z-10 space-y-8 sm:space-y-12">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-ayur-teal">
                  <ArrowUpRight className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-[8px] sm:text-[10px] font-black text-white/40 uppercase tracking-[0.3em] sm:tracking-[0.4em] leading-none">Outflow</p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-[1000] tracking-tightest leading-none">
                    <span className="text-xl sm:text-2xl font-light opacity-30 mr-1 sm:mr-2">₹</span>
                    {totalSpent.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="relative p-6 sm:p-10 rounded-[2rem] sm:rounded-[3.5rem] bg-white border border-white/60 overflow-hidden group shadow-premium"
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gray-50 blur-[40px] sm:blur-[60px] -mr-12 sm:-mr-16 -mt-12 sm:-mt-16 transition-all" />
              <div className="relative z-10 space-y-8 sm:space-y-12">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-black">
                  <Sparkles className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] leading-none">Insights</p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-[1000] text-black tracking-tightest leading-none">
                    {totalReports.toString().padStart(2, '0')}
                    <span className="text-sm font-black text-ayur-teal/40 ml-1 uppercase">Stats</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Neural Transaction Logic */}
        <div className="space-y-8 sm:space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-[1000] text-black tracking-tightest uppercase">Recent Flow</h3>
            <button 
              onClick={() => setView('history')}
              className="text-[9px] sm:text-[11px] font-black text-ayur-teal uppercase tracking-[0.3em] sm:tracking-[0.4em] flex items-center gap-2 group"
            >
              Log <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-all" />
            </button>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {transactions.length === 0 ? (
              <div className="py-20 sm:py-24 bg-white/40 backdrop-blur-xl rounded-[2.5rem] sm:rounded-[4rem] border border-white/60 border-dashed text-center space-y-4 sm:space-y-6">
                <div className="w-20 h-20 rounded-full bg-white shadow-premium mx-auto flex items-center justify-center text-gray-200">
                  <History className="w-10 h-10" />
                </div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em] leading-none">No Energy Flow Detected</p>
              </div>
            ) : (
              transactions.slice(0, 4).map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.9)" }}
                  className="p-6 sm:p-10 bg-white/60 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3.5rem] border border-white/60 flex items-center justify-between transition-all group shadow-premium hover:shadow-2xl"
                >
                  <div className="flex items-center gap-6 sm:gap-8">
                    <div className={cn(
                      "w-16 h-16 rounded-[2rem] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:rotate-12",
                      item.type === 'credit' ? "bg-ayur-teal text-white" : "bg-black text-white"
                    )}>
                      {item.type === 'credit' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl sm:text-2xl font-black text-black tracking-tight leading-none group-hover:text-ayur-teal transition-colors">
                        {item.description || 'Quantum Sync'}
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="px-3 py-1 rounded-lg bg-black/5 text-[9px] font-black uppercase text-black/40 tracking-widest leading-none">{item.method || 'Internal'}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                        <span className="text-[10px] font-bold text-gray-400 capitalize">{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0">
                    <p className={`text-3xl font-black tracking-tighter leading-none ${item.type === 'credit' ? 'text-ayur-teal' : 'text-black'}`}>
                      {item.type === 'credit' ? '+' : '-'}₹{Number(item.amount).toLocaleString('en-IN')}
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-2 h-2 rounded-full bg-ayur-teal animate-pulse" />
                      <p className="text-[10px] font-black text-black/20 uppercase tracking-widest leading-none">Verified</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const AddMoneyView = () => (
    <div className="min-h-screen pb-48 overflow-x-hidden flex flex-col bg-transparent relative">
       {/* Background Depth */}
       <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 via-white to-stone-50 -z-10" />
       
       {/* High-End Header */}
       <div className="pt-20 px-8 flex items-center justify-between mb-16">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('main')}
            className="w-14 h-14 rounded-2xl bg-white shadow-premium flex items-center justify-center text-black border border-black/5"
          >
             <ArrowLeft className="w-8 h-8" />
          </motion.button>
          <div className="text-center">
             <p className="text-[12px] font-black text-black/30 uppercase tracking-[0.5em] leading-none mb-2">Vault Infusion</p>
             <h2 className="text-2xl font-black text-black uppercase tracking-tightest">Secure Recharge</h2>
          </div>
          <div className="w-14" />
       </div>

       {/* Interactive Amount Selector */}
       <div className="px-10 flex-1 space-y-16">
          <div className="space-y-10 text-center">
             <div className="relative inline-block group">
                <div className="absolute -inset-20 bg-ayur-teal/10 blur-[80px] opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-4">
                   <span className="text-4xl font-light text-black/20">₹</span>
                   <input 
                     type="number" 
                     value={addAmount}
                     onChange={(e) => setAddAmount(e.target.value)}
                     className="text-[140px] font-black text-black tracking-tighter w-full text-center focus:outline-none border-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none py-4 leading-none"
                     placeholder="0"
                     autoFocus
                   />
                </div>
             </div>

             <div className="flex justify-center gap-4 flex-wrap">
                {['99', '199', '499', '999'].map(amt => (
                  <motion.button 
                    key={amt} 
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAddAmount(amt)}
                    className={`px-10 py-5 rounded-[2.5rem] text-xs font-black uppercase tracking-widest border transition-all duration-500 ${
                      addAmount === amt 
                        ? 'bg-black text-white border-black shadow-[0_20px_40px_rgba(0,0,0,0.2)]' 
                        : 'bg-white text-gray-400 border-black/5 shadow-premium hover:border-black/10'
                    }`}
                  >
                    ₹{amt}
                  </motion.button>
                ))}
             </div>
          </div>

          <div className="space-y-12">
             <div className="flex items-center justify-between">
                <div className="h-px bg-black/5 flex-1" />
                <h3 className="text-[10px] font-black text-black/30 uppercase tracking-[0.5em] px-8">Elite Options</h3>
                <div className="h-px bg-black/5 flex-1" />
             </div>

             <div className="grid grid-cols-1 gap-6">
                {[
                  { amount: 199, bonus: 40, tag: 'Popular', icon: <Zap className="w-5 h-5" />, desc: '3 Pro Health Reports' },
                  { amount: 499, bonus: 120, tag: 'Best Value', icon: <Sparkles className="w-5 h-5" />, desc: 'Full Analysis + Consultation' }
                ].map((item, i) => (
                  <motion.button 
                    key={i}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAddAmount(item.amount.toString())}
                    className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 flex items-center justify-between text-left overflow-hidden ${
                      addAmount === item.amount.toString()
                        ? 'bg-gradient-to-br from-stone-900 via-black to-emerald-950 border-black shadow-2xl text-white'
                        : 'bg-white border-black/5 shadow-premium text-black hover:border-black/20'
                    }`}
                  >
                     {addAmount === item.amount.toString() && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-ayur-teal/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" 
                        />
                     )}
                     <div className="space-y-3 relative z-10">
                        <div className="flex items-center gap-3">
                           <span className="text-3xl font-black">₹{item.amount}</span>
                           <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest ${
                             addAmount === item.amount.toString() 
                               ? 'bg-ayur-teal text-black' 
                               : 'bg-emerald-50 text-ayur-teal'
                           }`}>+ ₹{item.bonus} Bonus</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="p-1 rounded bg-ayur-teal/20 text-ayur-teal">
                              {item.icon}
                           </div>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${
                             addAmount === item.amount.toString() ? 'text-white/40' : 'text-gray-400'
                           }`}>{item.desc}</p>
                        </div>
                     </div>
                     <div className={`w-14 h-14 rounded-3xl flex items-center justify-center border transition-all ${
                       addAmount === item.amount.toString() ? 'bg-white/10 border-white/20 text-white' : 'bg-stone-50 border-black/5 text-black'
                     }`}>
                        <ArrowDownLeft className="w-7 h-7" />
                     </div>
                  </motion.button>
                ))}
             </div>
          </div>
       </div>

       {/* Checkout Footer */}
       <div className="fixed bottom-12 left-8 right-8 z-50">
          <motion.button 
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            onClick={() => handleRecharge(Number(addAmount))}
            className="w-full bg-black p-10 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] flex items-center justify-between group overflow-hidden border border-white/10"
          >
             <div className="absolute inset-0 bg-gradient-to-r from-ayur-teal/0 via-white/5 to-ayur-teal/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
             <div className="flex flex-col items-start space-y-1 relative z-10">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em]">{loading ? 'Processing' : 'Next Step'}</p>
                <p className="text-2xl font-black text-white leading-none">Confirm Infusion</p>
             </div>
             <div className="flex items-center gap-6 relative z-10">
                {loading ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <>
                    <h2 className="text-4xl font-black text-white tracking-tightest">₹{addAmount}</h2>
                    <div className="w-16 h-16 bg-white text-black rounded-[1.8rem] flex items-center justify-center shadow-2xl group-hover:bg-ayur-teal group-hover:text-white transition-all duration-500">
                       <Plus className="w-8 h-8 group-hover:rotate-180 transition-transform duration-700" />
                    </div>
                  </>
                )}
             </div>
          </motion.button>
       </div>
    </div>
  );

  const HistoryView = () => (
    <div className="min-h-screen pb-48 flex flex-col bg-transparent relative">
       {/* Background */}
       <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-emerald-50/20 -z-10" />

       {/* Glass Sticky Header */}
       <div className="pt-20 px-8 flex items-center justify-between sticky top-0 backdrop-blur-3xl z-50 pb-8 bg-white/40 border-b border-black/5">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setView('main')}
            className="w-14 h-14 rounded-[1.7rem] bg-white shadow-premium flex items-center justify-center text-black border border-black/5"
          >
             <ArrowLeft className="w-8 h-8" />
          </motion.button>
          <div className="text-center">
             <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.5em] leading-none mb-2">Vault Audit</p>
             <h2 className="text-xl font-black text-black uppercase tracking-tightest">Wealth Statement</h2>
          </div>
          <motion.button 
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-[1.7rem] bg-white shadow-premium flex items-center justify-center text-black border border-black/5"
          >
             <Filter className="w-6 h-6" />
          </motion.button>
       </div>

       <div className="px-8 space-y-12 mt-10">
          {/* Summary Intelligence */}
          <div className="bg-gradient-to-br from-stone-900 to-black p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
              <motion.div 
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 right-0 w-64 h-64 bg-ayur-teal/10 blur-[80px] -mr-32 -mt-32" 
              />
              <div className="relative z-10 flex items-center justify-between">
                 <div className="space-y-3">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Current Liquidity</p>
                    <h3 className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">
                      <span className="text-xl font-light opacity-20 mr-2 uppercase">₹</span>
                      {userData?.wallet_balance?.toLocaleString('en-IN') || "0"}
                    </h3>
                 </div>
                 <div className="w-16 h-16 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-8 h-8 text-ayur-teal" />
                 </div>
              </div>
          </div>

          {/* Filter Matrix */}
          <div className="flex items-center p-2 bg-white rounded-[2.5rem] border border-black/5 shadow-premium">
             {['All', 'Credits', 'Debits'].map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`flex-1 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                    activeFilter === f 
                      ? 'bg-black text-white shadow-2xl scale-[1.02]' 
                      : 'text-gray-400 hover:text-black'
                  }`}
                >
                  {f}
                </button>
             ))}
          </div>

          {/* Neural Transaction Flow */}
          <div className="space-y-6">
             {filteredTransactions.length === 0 ? (
                <div className="py-32 text-center space-y-8 bg-white/40 rounded-[4rem] border border-dashed border-black/5 backdrop-blur-md">
                   <div className="w-24 h-24 rounded-full bg-stone-50 flex items-center justify-center text-gray-200 mx-auto shadow-inner">
                      <History className="w-10 h-10" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-black text-black/20 uppercase tracking-[0.5em]">Quiet Cycles</p>
                      <p className="text-[9px] font-bold text-gray-300">No activity logged in current cycle</p>
                   </div>
                </div>
             ) : (
                filteredTransactions.map((tx, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group bg-white p-8 rounded-[3.5rem] border border-black/5 shadow-premium flex items-center justify-between hover:shadow-2xl hover:scale-[1.01] transition-all duration-500"
                  >
                     <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:rotate-12 ${
                          tx.type === 'credit' ? 'bg-ayur-teal/10 text-ayur-teal' : 'bg-stone-50 text-gray-300 group-hover:bg-black group-hover:text-white'
                        }`}>
                           {tx.type === 'credit' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                        </div>
                        <div className="space-y-2">
                           <p className="text-lg font-black text-black tracking-tight leading-none group-hover:text-ayur-teal transition-colors">{tx.description || 'System Flow'}</p>
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-black/20 uppercase tracking-widest">{tx.method || 'Ledger'}</span>
                              <div className="w-1 h-1 rounded-full bg-gray-100" />
                              <span className="text-[10px] font-bold text-gray-400 capitalize">{formatDate(tx.createdAt)}</span>
                           </div>
                        </div>
                     </div>
                     <div className="text-right space-y-2">
                        <p className={`text-2xl font-black tracking-tighter leading-none ${tx.type === 'credit' ? 'text-ayur-teal' : 'text-black'}`}>
                           {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-ayur-teal/40" />
                           <span className="text-[9px] font-black text-black/10 uppercase tracking-widest">Logged</span>
                        </div>
                     </div>
                  </motion.div>
                ))
             )}
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 selection:bg-ayur-neon selection:text-white relative font-sans">
      {/* Global 8K Cinematic Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-100 via-stone-50 to-white -z-10" />
      
      <AnimatePresence mode="wait">
        <motion.div 
           key={view}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {view === 'main' && <MainView />}
          {view === 'history' && <HistoryView />}
          {view === 'add-money' && <AddMoneyView />}
        </motion.div>
      </AnimatePresence>

      {/* Persistent Messaging */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-32 left-6 right-6 z-[60]"
          >
            <div className={`p-6 rounded-[2.5rem] shadow-2xl flex items-center justify-between gap-4 border backdrop-blur-xl ${
              message.toLowerCase().includes('success') 
                ? 'bg-ayur-green text-white border-white/20' 
                : 'bg-red-500 text-white border-white/20'
            }`}>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                    {message.toLowerCase().includes('success') ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                 </div>
                 <div className="space-y-0.5">
                    <p className="text-sm font-black tracking-tight">{message}</p>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Transaction Update</p>
                 </div>
              </div>
              <button 
                onClick={() => setMessage(null)}
                className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl hover:bg-white/20 transition-all border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Botttom Navigation Context */}
      {view === 'main' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-2xl border-t border-gray-100 flex items-center justify-between z-50 rounded-t-[3.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.03)]">
           <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1.5 grayscale opacity-30 px-3 py-2"><motion.div whileTap={{ scale: 0.8 }}><Menu className="w-6 h-6" /></motion.div><span className="text-[9px] font-black uppercase tracking-[0.15em]">Home</span></button>
           <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1.5 grayscale opacity-30 px-3 py-2"><motion.div whileTap={{ scale: 0.8 }}><Calendar className="w-6 h-6" /></motion.div><span className="text-[9px] font-black uppercase tracking-[0.15em]">Reports</span></button>
           <button className="flex flex-col items-center gap-1.5 px-8 py-3 bg-ayur-green text-white rounded-2xl shadow-2xl shadow-ayur-green/30 scale-105 transform -translate-y-1"><motion.div whileTap={{ scale: 0.8 }}><Wallet className="w-6 h-6" /></motion.div><span className="text-[9px] font-black uppercase tracking-[0.15em]">Wallet</span></button>
           <button onClick={() => navigate('/store')} className="flex flex-col items-center gap-1.5 grayscale opacity-30 px-3 py-2"><motion.div whileTap={{ scale: 0.8 }}><Tag className="w-6 h-6" /></motion.div><span className="text-[9px] font-black uppercase tracking-[0.15em]">Store</span></button>
           <button onClick={() => navigate('/settings')} className="flex flex-col items-center gap-1.5 grayscale opacity-30 px-3 py-2"><motion.div whileTap={{ scale: 0.8 }}><Users className="w-6 h-6" /></motion.div><span className="text-[9px] font-black uppercase tracking-[0.15em]">Profile</span></button>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-8 text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
             <LoadingYogi />
          </motion.div>
          <div className="mt-10 space-y-3">
             <p className="text-2xl font-black tracking-tight text-gray-900">AyurPay Secure Gateway</p>
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.5em] animate-pulse">Contacting Banking Servers...</p>
          </div>
          <div className="absolute bottom-12 flex items-center gap-4 opacity-30 text-[10px] font-black uppercase tracking-widest grayscale">
             <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Razorpay</div>
             <div className="flex items-center gap-1.5"><Lock className="w-4 h-4" /> 256-bit AES</div>
          </div>
        </div>
      )}
    </div>
  );
}
