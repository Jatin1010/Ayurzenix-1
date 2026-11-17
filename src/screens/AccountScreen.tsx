import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User as UserIcon, 
  Wallet, 
  Settings, 
  LogOut, 
  Plus, 
  History, 
  ChevronRight, 
  Smartphone, 
  Globe, 
  Bell, 
  Shield, 
  FileText, 
  Truck, 
  Tag, 
  HelpCircle, 
  Info,
  Activity,
  CheckCircle2,
  Loader2,
  Phone,
  Save,
  Crown,
  Gift,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  CreditCard,
  UserCircle,
  Leaf
} from 'lucide-react';
import { auth, db, RecaptchaVerifier } from '../lib/firebase';
import { signOut, linkWithPhoneNumber, ConfirmationResult, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, onSnapshot, collection, query, where, getDocs, writeBatch, serverTimestamp, increment } from 'firebase/firestore';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, LanguageCode } from '../lib/translations';
import { ADMIN_EMAILS } from '../lib/constants';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';
import OtpInput from '../components/OtpInput';
import { clearLocalHistory } from '../lib/localHistory';
import axios from 'axios';
import { loadRazorpay, getRazorpayConfig } from '../lib/razorpay';
import { useRealtimeWallet } from '../hooks/useRealtimeWallet';

interface AccountScreenProps {
  userData: any;
  appConfig?: any;
}

export default function AccountScreen({ userData, appConfig }: AccountScreenProps) {
  const navigate = useNavigate();
  const { language: currentLang, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'wallet' | 'settings'>('profile');
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpString, setOtpString] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [timer, setTimer] = useState(0);
  const recaptchaRef = useRef<any>(null);

  // Form states (inherited from Profile)
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [age, setAge] = useState(userData?.age || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [dosha, setDosha] = useState(userData?.dosha || '');
  const [lifestyle, setLifestyle] = useState(userData?.lifestyle || '');

  // Wallet Logic
  const { balance, transactions, loading: walletLoading } = useRealtimeWallet();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rechargeLoading, setRechargeLoading] = useState(false);

  // Settings Logic
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '');
      setAge(userData.age || '');
      setGender(userData.gender || '');
      setDosha(userData.dosha || '');
      setLifestyle(userData.lifestyle || '');
    }
  }, [userData]);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  if (!userData) return null;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    if (!userData?.uid) return;
    setSaving(true);
    try {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        displayName,
        age: parseInt(age as string) || null,
        gender,
        dosha,
        lifestyle
      });
      alert("Profile updated! ✨");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotifications = async (field: string, currentValue: boolean) => {
    if (!userData?.uid) return;
    const userRef = doc(db, 'users', userData.uid);
    await updateDoc(userRef, { [field]: !currentValue });
  };

  const handleAddCredits = async (amount: number) => {
    try {
      setRechargeLoading(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) return;

      const { data: order } = await axios.post('/api/razorpay/order', {
        amount,
        userId: userData.uid,
        receipt: `recharge_${Date.now()}`
      });

      const options = getRazorpayConfig(
        order,
        userData,
        async (response: any) => {
          await axios.post('/api/razorpay/verify', {
            ...response,
            userId: userData.uid,
            amount
          });
          setIsAddModalOpen(false);
        },
        () => setRechargeLoading(false)
      );

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      await clearLocalHistory();
      const userRef = doc(db, 'users', userData.uid);
      batch.update(userRef, {
        free_results_count: 2,
        wallet_balance: 0,
      });
      await batch.commit();
      setShowDeleteModal(false);
      alert("Health history cleared.");
    } catch (error) {
      console.error('Delete data error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-40">
      <SEO title="My Account | Ayurzenix" noindex={true} />
      
      {/* 1. Dynamic Unified Header */}
      <div className="bg-white border-b border-black/5 pt-16 pb-10 px-6 sticky top-0 z-30 shadow-sm font-bold">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-ayur-neon to-emerald-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-30 transition duration-1000"></div>
              {userData.photoURL ? (
                <img src={userData.photoURL} alt="Profile" className="relative w-28 h-28 rounded-[2.5rem] border-4 border-white shadow-2xl z-10 object-cover" />
              ) : (
                <div className="relative w-28 h-28 bg-black/5 rounded-[2.5rem] flex items-center justify-center text-ayur-neon border-4 border-white shadow-2xl z-10">
                  <UserIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 px-3 py-1.5 bg-black text-white rounded-xl flex items-center gap-1.5 shadow-xl border border-white/20 z-20">
                <Activity className="w-3 h-3 text-ayur-neon" />
                <span className="text-[10px] font-black tracking-widest">{userData.wellness_score || 50}%</span>
              </div>
            </div>

            <div className="text-center md:text-left flex-1 space-y-2">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">{userData.displayName}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                <div className="px-3 py-1 bg-ayur-neon/10 rounded-full text-[9px] font-black text-ayur-neon uppercase tracking-widest border border-ayur-neon/20">
                  {userData.plan === 'premium' ? 'Pro Member' : 'Free Account'}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <Wallet className="w-3 h-3" />
                  ₹{balance} Credits
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleUpdateProfile}
                disabled={saving}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-gray-900/20 active:scale-95 transition-all flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Profile
              </button>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl overflow-x-auto no-scrollbar">
            {(['profile', 'wallet', 'settings'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeTab === tab 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          {/* PROFILE SECTION */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                  <UserCircle className="w-4 h-4" /> Personal Intelligence
                </h3>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-8 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Display Name</label>
                      <input 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-ayur-neon outline-none font-bold text-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Age</label>
                      <input 
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-ayur-neon outline-none font-bold text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                  <Leaf className="w-4 h-4" /> Biological Mapping
                </h3>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 space-y-6 shadow-sm">
                  <div className="grid grid-cols-3 gap-4">
                    {['Vata', 'Pitta', 'Kapha'].map(d => (
                      <button
                        key={d}
                        onClick={() => setDosha(d)}
                        className={cn(
                          "py-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                          dosha === d ? "bg-gray-900 text-white border-gray-900" : "bg-gray-50 text-gray-400 border-gray-50"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* WALLET SECTION */}
          {activeTab === 'wallet' && (
            <motion.div
              key="wallet-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="bg-[#a259ff] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-neon/10 rounded-full blur-[100px] -mr-20 -mt-20" />
                <div className="space-y-2 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ayur-neon">Current Veda Balance</p>
                  <h2 className="text-5xl font-black tracking-tighter">₹{balance}.00</h2>
                </div>
                <div className="pt-10 flex gap-4 relative z-10">
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 bg-[#dd6b6b] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl"
                  >
                    <Plus className="w-4 h-4" /> Recharge
                  </button>
                  <button 
                    onClick={() => navigate('/referral')}
                    className="flex-1 bg-[#eb3fce] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20 flex items-center justify-center gap-3"
                  >
                    <Gift className="w-4 h-4" /> Rewards
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                  <History className="w-4 h-4" /> Intelligence Log
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map(tx => (
                    <div key={tx.id} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center shadow-sm">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                          {tx.amount > 0 ? <ArrowDownLeft className="w-5 h-5 text-emerald-500" /> : <ArrowUpRight className="w-5 h-5 text-ayur-neon" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-gray-900 uppercase">{tx.description || tx.title}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{tx.dateStr}</p>
                        </div>
                      </div>
                      <p className={cn("font-black text-lg", tx.amount > 0 ? "text-emerald-500" : "text-gray-900")}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </p>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-10 opacity-40">No transactions recorded.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* SETTINGS SECTION */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Preference Control</h3>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-100 shadow-sm">
                  <div className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center"><Bell className="w-6 h-6"/></div>
                      <div className="text-left"><p className="text-sm font-black text-gray-900 uppercase">Notifications</p><p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Daily tips & reminders</p></div>
                    </div>
                    <button 
                      onClick={() => toggleNotifications('notifications_tips', userData.notifications_tips ?? true)}
                      className={cn("w-12 h-6 rounded-full relative transition-all", (userData.notifications_tips ?? true) ? "bg-emerald-500 shadow-lg shadow-emerald-500/20" : "bg-gray-100")}
                    >
                      <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-md", (userData.notifications_tips ?? true) ? "left-7" : "left-1")} />
                    </button>
                  </div>
                  <button onClick={() => setLanguage(currentLang === 'hi' ? 'en' : 'hi')} className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-violet-50 text-violet-500 rounded-2xl flex items-center justify-center"><Globe className="w-6 h-6"/></div>
                      <div className="text-left"><p className="text-sm font-black text-gray-900 uppercase">App Language</p><p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{currentLang === 'hi' ? 'Hindi / हिंदी' : 'English'}</p></div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Corporate Node</h3>
                <div className="bg-white rounded-[2.5rem] border border-gray-100 divide-y divide-gray-100 shadow-sm">
                  {[
                    { label: 'Privacy Protocol', path: '/privacy', icon: Shield },
                    { label: 'Terms of Service', path: '/terms', icon: FileText },
                    { label: 'Help & Support', path: '/help', icon: HelpCircle },
                    { label: 'About Ayurzenix', path: '/about', icon: Info },
                  ].map(item => (
                    <button key={item.path} onClick={() => navigate(item.path)} className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center"><item.icon className="w-6 h-6"/></div>
                        <p className="text-sm font-black text-gray-900 uppercase">{item.label}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full p-8 bg-rose-50 border border-rose-500/10 text-rose-500 rounded-[2.5rem] flex items-center justify-center gap-4 active:scale-[0.98] transition-all font-black uppercase tracking-[0.3em]"
              >
                <LogOut className="w-6 h-6" /> Log out account
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Balance Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-[3rem] w-full max-w-sm p-10 relative z-10 shadow-2xl space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Add Credits</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Boost your veda wallet</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[500, 1000, 2000, 5000].map(amt => (
                  <button key={amt} onClick={() => handleAddCredits(amt)} className="py-4 rounded-xl border border-gray-100 font-black text-lg text-gray-700 hover:border-ayur-neon/30 hover:bg-ayur-neon/5 transition-all active:scale-95">₹{amt}</button>
                ))}
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-full text-gray-400 text-[10px] font-black uppercase tracking-widest pt-4">Secure payments by Razorpay</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
