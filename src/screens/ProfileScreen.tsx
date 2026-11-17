import { auth, db, RecaptchaVerifier } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { signOut, linkWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { 
  LogOut, 
  Globe, 
  Shield, 
  HelpCircle, 
  Info,
  ChevronRight, 
  User as UserIcon, 
  Phone, 
  Smartphone, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  MessageSquare, 
  Bell,
  ShieldCheck,
  Truck,
  Tag,
  Wrench,
  Save,
  Leaf,
  Activity,
  UserCircle,
  Sparkles,
  Crown,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import OtpInput from '../components/OtpInput';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { LANGUAGES, LanguageCode } from '../lib/translations';
import { ADMIN_EMAILS } from '../lib/constants';

interface ProfileScreenProps {
  userData: any;
  appConfig?: any;
}

export default function ProfileScreen({ userData, appConfig }: ProfileScreenProps) {
  const { language: currentLang, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showVerifyPhone, setShowVerifyPhone] = useState(false);
  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpString, setOtpString] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [timer, setTimer] = useState(0);
  const recaptchaRef = useRef<any>(null);

  // Form states
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [age, setAge] = useState(userData?.age || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [dosha, setDosha] = useState(userData?.dosha || '');
  const [lifestyle, setLifestyle] = useState(userData?.lifestyle || '');

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

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        } catch (e) {
          console.error("reCAPTCHA cleanup error:", e);
        }
      }
    };
  }, []);

  if (!userData) return null;

  const isAdmin = userData.email && ADMIN_EMAILS.includes(userData.email.toLowerCase());

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleLanguageChange = async (code: LanguageCode) => {
    setLanguage(code);
    if (userData?.uid) {
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, { language: code });
    }
    setIsLanguageExpanded(false);
  };

  const toggleNotifications = async (type: 'app' | 'whatsapp') => {
    const field = type === 'app' ? 'notifications_enabled' : 'whatsapp_enabled';
    const userRef = doc(db, 'users', userData.uid);
    await updateDoc(userRef, { [field]: !userData[field] });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    // Clean the phone number: remove all non-digits except '+'
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleaned) {
      alert("Please enter a valid phone number");
      return;
    }

    // Basic length validation
    if (cleaned.startsWith('+')) {
      if (cleaned.length < 10) { // Minimum length for international numbers (e.g. +919876543210)
        alert("Phone number is too short. Please include country code.");
        return;
      }
    } else {
      if (cleaned.length < 10) {
        alert("Phone number must be at least 10 digits");
        return;
      }
    }
    
    setLoading(true);
    try {
      const container = document.getElementById('recaptcha-container-profile');
      if (!recaptchaRef.current && container) {
        if (!container.hasChildNodes()) {
          recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-profile', {
            'size': 'invisible',
          });
        }
      }
      
      const appVerifier = recaptchaRef.current;
      const formattedPhone = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
      
      console.log('Linking phone number:', formattedPhone);
      // Use linkWithPhoneNumber to associate phone with current user
      const result = await linkWithPhoneNumber(auth.currentUser, formattedPhone, appVerifier);
      setConfirmationResult(result);
      setTimer(60);
    } catch (error: any) {
      console.error("Phone Link Error:", error);
      if (error.code === 'auth/invalid-phone-number') {
        alert("Invalid phone number. Please include country code (e.g. +91)");
      } else if (error.code === 'auth/too-many-requests') {
        alert("Too many requests. Please try again later.");
      } else if (error.code === 'auth/billing-not-enabled') {
        alert("Phone authentication requires billing to be enabled in Firebase Console. Please use Google Login or add test phone numbers in Firebase Console.");
      } else {
        alert(error.message || "Failed to send OTP. Please try again.");
      }
      // Reset recaptcha on error
      if (recaptchaRef.current) {
        try {
          recaptchaRef.current.clear();
          recaptchaRef.current = null;
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!confirmationResult || !auth.currentUser) return;
    
    if (otpString.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }
    
    setLoading(true);
    try {
      await confirmationResult.confirm(otpString);
      
      // Update Firestore with verified phone number
      const userRef = doc(db, 'users', userData.uid);
      await updateDoc(userRef, {
        phone: auth.currentUser.phoneNumber
      });
      
      alert("Phone number verified and linked successfully! ✅");
      setShowVerifyPhone(false);
      setConfirmationResult(null);
      setOtpString('');
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
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
      alert("Profile updated successfully! ✨");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-10 space-y-10 min-h-screen bg-ayur-bg selection:bg-ayur-neon selection:text-white">
      <SEO title="My Profile" noindex={true} />
      <div id="recaptcha-container-profile"></div>

      {/* Subscription Status Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-8 bg-gradient-to-br from-gray-900 to-black text-white space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-ayur-neon/10 rounded-full blur-3xl -mr-24 -mt-24" />
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-ayur-neon" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ayur-neon">Current Subscription</h3>
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tight">
              {userData?.subscription?.planId ? userData.subscription.planId : 'Free Plan'}
            </h4>
          </div>
          <button 
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Upgrade
          </button>
        </div>

        <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Pro Reports Used</p>
            <p className="text-sm font-black">
              {userData?.subscription?.reportsUsed ?? 0} / {userData?.subscription?.planId === 'premium' ? 5 : userData?.subscription?.planId === 'starter' ? 3 : '∞'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Valid Until</p>
            <p className="text-sm font-black">
              {userData?.subscription?.currentPeriodEnd ? new Date(userData.subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Referral Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate('/referral')}
        className="bg-white p-6 rounded-[2rem] border border-black/5 shadow-sm flex items-center justify-between cursor-pointer group hover:border-ayur-neon transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-ayur-neon/10 rounded-2xl flex items-center justify-center text-ayur-neon">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Invite & Earn ₹20</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Share with friends and earn rewards</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-ayur-neon group-hover:text-black transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </motion.div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative group">
            {/* Prana Aura (Halo) */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: 360
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className={cn(
                "absolute -inset-8 rounded-[3.5rem] blur-2xl transition-colors duration-1000",
                (userData.wellness_score || 0) >= 90 
                  ? "bg-gradient-to-tr from-ayur-gold via-yellow-400 to-amber-500" 
                  : "bg-gradient-to-tr from-gray-400 via-gray-300 to-gray-500 opacity-20"
              )}
            />
            
            <div className="absolute -inset-1 bg-gradient-to-r from-ayur-neon to-emerald-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            {userData.photoURL ? (
              <img src={userData.photoURL} alt="Profile" className="relative w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-2xl object-cover z-10" />
            ) : (
              <div className="relative w-32 h-32 bg-black/5 rounded-[2.5rem] flex items-center justify-center text-ayur-neon border-4 border-white shadow-2xl z-10">
                <UserIcon className="w-16 h-16" />
              </div>
            )}
            
            {/* Aura Score Badge */}
            <div className="absolute -bottom-3 -right-3 px-3 py-1.5 bg-black text-white rounded-xl flex items-center gap-1.5 shadow-xl border border-white/20 z-20">
              <Activity className={cn(
                "w-3.5 h-3.5",
                (userData.wellness_score || 0) >= 90 ? "text-ayur-gold" : "text-gray-400"
              )} />
              <span className="text-[10px] font-black tracking-widest">{(userData.wellness_score || 0)}%</span>
            </div>
          </div>
          
          <div className="space-y-3 text-center md:text-left pt-4 md:pt-0">
            <h2 className="text-4xl font-display font-black text-gray-900 tracking-tight leading-tight uppercase">{userData.displayName}</h2>
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div className="flex items-center gap-2">
                <p className="text-gray-400 text-sm font-medium tracking-wide">{userData.email}</p>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  (userData.wellness_score || 0) >= 90 ? "bg-ayur-gold animate-pulse" : "bg-gray-300"
                )} title="Prana Status" />
              </div>
              {userData.phone ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-ayur-neon/10 rounded-full text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em] border border-ayur-neon/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {userData.phone}
                </div>
              ) : (
                <button 
                  onClick={() => setShowVerifyPhone(true)}
                  className="text-ayur-neon text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2.5 hover:text-gray-900 transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Verify Phone
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-ayur-gold to-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-105 transition-transform active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              Admin
            </button>
          )}
          <button 
            onClick={handleUpdateProfile}
            disabled={saving}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 glow-button-green rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.profile.save}
          </button>
        </div>
      </div>

      {/* Edit Profile Section */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
          <UserCircle className="w-4 h-4" />
          {t.profile.personalInfo}
        </h3>
        <div className="premium-card p-8 space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Full Name</label>
            <input 
              type="text" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-6 py-5 rounded-2xl border border-black/5 bg-black/5 focus:bg-white focus:border-ayur-neon outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
              placeholder="Your Name"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Age</label>
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-6 py-5 rounded-2xl border border-black/5 bg-black/5 focus:bg-white focus:border-ayur-neon outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                placeholder="Age"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Gender</label>
              <div className="relative">
                <select 
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-6 py-5 rounded-2xl border border-black/5 bg-black/5 focus:bg-white focus:border-ayur-neon outline-none transition-all text-sm font-bold text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-white">Select</option>
                  <option value="male" className="bg-white">Male</option>
                  <option value="female" className="bg-white">Female</option>
                  <option value="other" className="bg-white">Other</option>
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ayurvedic Profile Section */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
          <Leaf className="w-4 h-4" />
          {t.profile.ayurvedicProfile}
        </h3>
        <div className="premium-card p-8 space-y-6">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest px-2 opacity-60">Select your dominant Dosha if known</p>
          <div className="grid grid-cols-3 gap-4">
            {['Vata', 'Pitta', 'Kapha'].map((d) => (
              <button
                key={d}
                onClick={() => setDosha(d)}
                className={cn(
                  "py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border relative overflow-hidden",
                  dosha === d 
                    ? "bg-ayur-neon text-white border-ayur-neon shadow-lg shadow-ayur-neon/20" 
                    : "bg-black/5 text-gray-400 border-black/5 hover:border-ayur-neon/30"
                )}
              >
                <span className="relative z-10">{d}</span>
                {dosha === d && (
                  <motion.div 
                    layoutId="dosha-bg"
                    className="absolute inset-0 bg-ayur-neon"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lifestyle Section */}
      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
          <Activity className="w-4 h-4" />
          {t.profile.lifestyle}
        </h3>
        <div className="premium-card p-8 space-y-4">
          <div className="space-y-4">
            {[
              { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
              { id: 'light', label: 'Lightly Active', desc: '1-3 days/week' },
              { id: 'moderate', label: 'Moderately Active', desc: '3-5 days/week' },
              { id: 'very', label: 'Very Active', desc: '6-7 days/week' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setLifestyle(item.id)}
                className={cn(
                  "w-full p-6 rounded-2xl border text-left transition-all flex items-center justify-between group relative overflow-hidden",
                  lifestyle === item.id 
                    ? "bg-ayur-neon text-white border-ayur-neon shadow-lg shadow-ayur-neon/20" 
                    : "bg-black/5 border-black/5 text-gray-400 hover:border-ayur-neon/30"
                )}
              >
                <div className="relative z-10">
                  <p className={cn(
                    "text-xs font-black uppercase tracking-[0.2em]",
                    lifestyle === item.id ? "text-white" : "text-gray-900"
                  )}>{item.label}</p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mt-1",
                    lifestyle === item.id ? "text-white/80" : "text-gray-400"
                  )}>{item.desc}</p>
                </div>
                {lifestyle === item.id ? (
                  <CheckCircle2 className="w-6 h-6 text-white relative z-10" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-black/5 relative z-10" />
                )}
                {lifestyle === item.id && (
                  <motion.div 
                    layoutId="lifestyle-bg"
                    className="absolute inset-0 bg-ayur-neon"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVerifyPhone && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="premium-card p-8 space-y-8">
              {!confirmationResult ? (
                <form onSubmit={handleSendOtp} className="space-y-8">
                  <div className="space-y-2">
                    <h4 className="text-2xl font-display font-black text-gray-900 tracking-tight uppercase">Verify your phone</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-60">We'll send a 6-digit code to verify your identity.</p>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-ayur-neon" />
                    <input
                      required
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-16 pr-6 py-5 rounded-2xl border border-black/5 bg-black/5 focus:bg-white focus:border-ayur-neon outline-none transition-all text-sm font-bold text-gray-900 placeholder:text-gray-400"
                      placeholder="Phone Number (e.g. +91...)"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex-1 glow-button-green py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-xs active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send OTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowVerifyPhone(false)}
                      className="px-8 py-5 text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-8">
                  <div className="space-y-2 text-center">
                    <h4 className="text-2xl font-display font-black text-gray-900 tracking-tight uppercase">Enter OTP</h4>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-60">Sent to {phoneNumber}</p>
                  </div>
                  <div className="flex justify-center">
                    <OtpInput 
                      length={6} 
                      onComplete={(otp) => {
                        setOtpString(otp);
                      }} 
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-6">
                    <button
                      disabled={loading || otpString.length !== 6}
                      type="submit"
                      className="w-full glow-button-green py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 text-xs disabled:opacity-50 active:scale-95"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Link'}
                    </button>
                    <div className="flex justify-between items-center px-4">
                      {timer > 0 ? (
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Resend in {timer}s</p>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleSendOtp}
                          className="text-ayur-neon text-[10px] font-black uppercase tracking-widest hover:text-gray-900 transition-colors"
                        >
                          Resend OTP
                        </button>
                      )}
                      <button 
                        type="button"
                        onClick={() => { 
                          setConfirmationResult(null); 
                          setOtpString(''); 
                          if (recaptchaRef.current) {
                            recaptchaRef.current.clear();
                            recaptchaRef.current = null;
                          }
                        }}
                        className="text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-gray-900 transition-colors"
                      >
                        Change Number
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">
          {t.profile.notifications}
        </h3>
        
        <div className="premium-card overflow-hidden">
          <div className="flex items-center justify-between p-8 border-b border-black/5">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-sm border border-blue-500/20">
                <Bell className="w-7 h-7" />
              </div>
              <div className="text-left space-y-1">
                <p className="font-black text-gray-900 tracking-tight uppercase">App Notifications</p>
                <p className="text-xs text-gray-400 font-medium">Daily wellness tips & alerts</p>
              </div>
            </div>
            <button 
              onClick={() => toggleNotifications('app')}
              className={`w-14 h-7 rounded-full transition-all relative ${userData.notifications_enabled ? 'bg-ayur-neon shadow-lg shadow-ayur-neon/20' : 'bg-black/5'}`}
            >
              <motion.div 
                animate={{ x: userData.notifications_enabled ? 32 : 4 }}
                className={cn(
                  "absolute top-1 w-5 h-5 rounded-full shadow-md",
                  userData.notifications_enabled ? "bg-white" : "bg-gray-300"
                )}
              />
            </button>
          </div>

          {(appConfig?.features?.whatsapp ?? true) && (
            <div className="flex items-center justify-between p-8">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 shadow-sm border border-green-500/20">
                  <MessageSquare className="w-7 h-7" />
                </div>
                <div className="text-left space-y-1">
                  <p className="font-black text-gray-900 tracking-tight uppercase">WhatsApp Updates</p>
                  <p className="text-xs text-gray-400 font-medium">Personalized health insights</p>
                </div>
              </div>
              <button 
                onClick={() => toggleNotifications('whatsapp')}
                disabled={!userData.phone}
                className={`w-14 h-7 rounded-full transition-all relative ${userData.whatsapp_enabled ? 'bg-ayur-neon shadow-lg shadow-ayur-neon/20' : 'bg-black/5'} ${!userData.phone ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <motion.div 
                  animate={{ x: userData.whatsapp_enabled ? 32 : 4 }}
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full shadow-md",
                    userData.whatsapp_enabled ? "bg-white" : "bg-gray-300"
                  )}
                />
              </button>
            </div>
          )}
        </div>
        {(appConfig?.features?.whatsapp ?? true) && !userData.phone && (
          <p className="text-[10px] text-ayur-gold font-black uppercase tracking-widest px-6">
            ⚠️ Please verify your phone number to enable WhatsApp updates.
          </p>
        )}
      </div>

      <div className="space-y-6">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">
          {t.profile.settings}
        </h3>
        
        <div className="premium-card overflow-hidden">
          <div className="border-b border-black/5">
            <button 
              onClick={() => setIsLanguageExpanded(!isLanguageExpanded)}
              className="w-full flex items-center justify-between p-8 hover:bg-black/5 transition-all group"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-ayur-neon/10 rounded-2xl flex items-center justify-center text-ayur-neon shadow-sm border border-ayur-neon/20">
                  <Globe className="w-7 h-7" />
                </div>
                <div className="text-left space-y-1">
                  <p className="font-black text-gray-900 tracking-tight uppercase">{t.profile.appLanguage}</p>
                  <p className="text-xs text-gray-400 font-medium">
                    {LANGUAGES.find(l => l.code === currentLang)?.nativeName || 'English'}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isLanguageExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-7 h-7 text-gray-300 group-hover:text-ayur-neon transition-all" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isLanguageExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden bg-black/5 px-6 pb-8"
                >
                  <div className="grid grid-cols-2 gap-4">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                          "flex flex-col items-center justify-center p-6 rounded-2xl border transition-all relative overflow-hidden",
                          currentLang === lang.code
                            ? "bg-ayur-neon text-white border-ayur-neon shadow-lg shadow-ayur-neon/20"
                            : "bg-white text-gray-400 border-black/5 hover:border-ayur-neon/30"
                        )}
                      >
                        <span className="text-xs font-black relative z-10">{lang.nativeName}</span>
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest opacity-60 relative z-10",
                          currentLang === lang.code ? "text-white/60" : "text-gray-400"
                        )}>{lang.name}</span>
                        {currentLang === lang.code && (
                          <motion.div 
                            layoutId="lang-bg"
                            className="absolute inset-0 bg-ayur-neon"
                            initial={false}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {[
            { label: 'Privacy Policy', icon: Shield, path: '/privacy' },
            { label: 'Terms of Service', icon: FileText, path: '/terms' },
            { label: 'Shipping Policy', icon: Truck, path: '/shipping' },
            { label: 'Pricing & Services', icon: Tag, path: '/pricing' },
            { label: 'Help & Support', icon: HelpCircle, path: '/help' },
            { label: 'About Ayurzenix', icon: Info, path: '/about' },
          ].map((item, i, arr) => (
            <button 
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between p-8 hover:bg-black/5 transition-all group ${i < arr.length - 1 ? 'border-b border-black/5' : ''}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-black/5 rounded-2xl flex items-center justify-center text-ayur-neon shadow-sm border border-black/5 group-hover:border-ayur-neon/30 transition-all">
                  <item.icon className="w-7 h-7" />
                </div>
                <p className="font-black text-gray-900 tracking-tight uppercase">{item.label}</p>
              </div>
              <ChevronRight className="w-7 h-7 text-gray-300 group-hover:text-ayur-neon group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-4 p-8 text-rose-500 font-black uppercase tracking-[0.3em] bg-rose-500/10 rounded-[2.5rem] hover:bg-rose-500/20 transition-all active:scale-95 border border-rose-500/20 shadow-sm"
        >
          <LogOut className="w-7 h-7" />
          {t.profile.logout}
        </button>
      </div>

      <div className="text-center pt-12 space-y-3">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-60">Ayurzenix v1.0.0</p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] opacity-40">Made with ❤️ for Ayurvedic Wellness</p>
      </div>
    </div>
  );
}
