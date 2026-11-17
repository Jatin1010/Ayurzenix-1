import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { auth, googleProvider, RecaptchaVerifier } from '../lib/firebase';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Loader2, Mail, Lock, Chrome, Phone, Smartphone, Leaf, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import OtpInput from '../components/OtpInput';
import { cn } from '../lib/utils';

export default function AuthScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || "/";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('pendingReferralCode', refCode);
      console.log('Captured referral code:', refCode);
    }
  }, [location]);

  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [popupError, setPopupError] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpString, setOtpString] = useState('');
  const [timer, setTimer] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    // Check if we are running in an iframe
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);
  }, []);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (authMethod === 'phone' && !window.recaptchaVerifier) {
      const initRecaptcha = () => {
        const container = document.getElementById('recaptcha-container');
        if (container) {
          // Clean up any existing children just in case
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          try {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              'size': 'invisible',
              'callback': () => {
                console.log('reCAPTCHA verified');
              },
              'expired-callback': () => {
                console.log('reCAPTCHA expired');
                if (window.recaptchaVerifier) {
                   window.recaptchaVerifier.clear();
                   window.recaptchaVerifier = null;
                }
              }
            });
          } catch (error) {
            console.error("reCAPTCHA initialization error:", error);
          }
        }
      };
      // Small delay to ensure DOM is ready
      const timeout = setTimeout(initRecaptcha, 150);
      return () => clearTimeout(timeout);
    }
    
    // Cleanup if switching away from phone
    return () => {
      if (authMethod !== 'phone' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {
          console.error("reCAPTCHA cleanup error:", e);
        }
      }
    };
  }, [authMethod]);

  const executeRecaptcha = async (action: string = 'LOGIN'): Promise<boolean> => {
    try {
      const token = await new Promise<string | null>((resolve) => {
        if (typeof window.grecaptcha === 'undefined' || !window.grecaptcha.enterprise) {
          console.warn('reCAPTCHA Enterprise not loaded');
          resolve(null);
          return;
        }

        window.grecaptcha.enterprise.ready(async () => {
          try {
            const t = await window.grecaptcha.enterprise.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action });
            resolve(t);
          } catch (error) {
            console.error('reCAPTCHA Execution Error:', error);
            resolve(null);
          }
        });
      });

      if (!token) return true; // Fallback if reCAPTCHA failed to execute

      const response = await fetch('/api/recaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action })
      });

      if (!response.ok) {
        console.error('reCAPTCHA verification endpoint returned error');
        return true; // Fallback
      }

      const result = await response.json();
      return result.success || result.skipped;
    } catch (e) {
      console.error('reCAPTCHA Helper Error:', e);
      return true; // Fallback
    }
  };

  const syncUserWithBackend = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const idToken = await user.getIdToken();
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idToken,
          language: localStorage.getItem('language') || 'en'
        }),
      });
      
      if (!response.ok) {
        console.error("Backend sync failed:", await response.text());
      } else {
        console.log("User record synced successfully");
      }
    } catch (e) {
      console.error("Auth Sync Helper Error:", e);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setNetworkError(false);
      setPopupError(false);
      try {
        const credential = GoogleAuthProvider.credential(tokenResponse.access_token);
        await signInWithCredential(auth, credential);
        
        // Sync with backend
        await syncUserWithBackend();
        
        const pendingJson = sessionStorage.getItem('pendingAnalysis');
        if (pendingJson && auth.currentUser) {
          try {
            const { saveProfileLocally } = await import('../lib/localHistory');
            const pendingData = JSON.parse(pendingJson);
            pendingData.uid = auth.currentUser.uid;
            const docId = await saveProfileLocally(pendingData);
            sessionStorage.removeItem('pendingAnalysis');
            navigate(`/analysis-pricing/${docId}`, { replace: true });
            return;
          } catch (e) {
            console.error("Pending analysis save error:", e);
          }
        }
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error("Google Login Success Handler Error:", error);
        alert(error.message || "Failed to finalize Google Login with Firebase.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth Error:", error);
      setPopupError(true);
      setLoading(false);
    }
  });

  const handleFirebasePopupLogin = async () => {
    setLoading(true);
    setNetworkError(false);
    setPopupError(false);
    try {
      const passed = await executeRecaptcha('GOOGLE_LOGIN');
      if (!passed) {
        console.warn("reCAPTCHA failed, but proceeding as fallback...");
      }
      await signInWithPopup(auth, googleProvider);
      const pendingJson = sessionStorage.getItem('pendingAnalysis');
      if (pendingJson && auth.currentUser) {
        try {
          const { saveProfileLocally } = await import('../lib/localHistory');
          const pendingData = JSON.parse(pendingJson);
          pendingData.uid = auth.currentUser.uid;
          const docId = await saveProfileLocally(pendingData);
          sessionStorage.removeItem('pendingAnalysis');
          navigate(`/analysis-pricing/${docId}`, { replace: true });
          return;
        } catch (e) {
          console.error("Pending analysis save error:", e);
        }
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Google Login Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setPopupError(true);
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Ignore
      } else if (error.code === 'auth/network-request-failed') {
        setNetworkError(true);
      } else if (error.code === 'auth/operation-not-allowed') {
        alert("Google Login is not enabled in Firebase Console. Please enable 'Google' under Auth -> Sign-in method.");
      } else {
        alert(error.message || "Failed to login with Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    navigate('/');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNetworkError(false);
    try {
      const passed = await executeRecaptcha(isLogin ? 'LOGIN' : 'SIGNUP');
      if (!passed) {
        console.warn("reCAPTCHA check failed, but proceeding as fallback...");
      }
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Sync with backend
      await syncUserWithBackend();

      const pendingJson = sessionStorage.getItem('pendingAnalysis');
      if (pendingJson && auth.currentUser) {
        try {
          const { saveProfileLocally } = await import('../lib/localHistory');
          const pendingData = JSON.parse(pendingJson);
          pendingData.uid = auth.currentUser.uid;
          const docId = await saveProfileLocally(pendingData);
          sessionStorage.removeItem('pendingAnalysis');
          navigate(`/analysis-pricing/${docId}`, { replace: true });
          return;
        } catch (e) {
          console.error("Pending analysis save error:", e);
        }
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Email Auth Error:", error);
      if (error.code === 'auth/invalid-credential') {
        alert("Invalid email or password.");
      } else if (error.code === 'auth/user-not-found') {
        alert("No account found with this email.");
        setIsLogin(false);
      } else if (error.code === 'auth/wrong-password') {
        alert("Incorrect password.");
      } else if (error.code === 'auth/email-already-in-use') {
        alert("An account already exists with this email.");
        setIsLogin(true);
      } else if (error.code === 'auth/network-request-failed') {
        setNetworkError(true);
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Clean the phone number: remove all non-digits except '+'
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    if (!cleaned) {
      alert("Please enter a valid phone number");
      return;
    }

    // Basic length validation
    if (cleaned.startsWith('+')) {
      if (cleaned.length < 10) {
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
    setNetworkError(false);
    try {
      // 1. Try reCAPTCHA Enterprise (Internal validation)
      const passed = await executeRecaptcha('SEND_OTP');
      if (!passed) {
        console.warn('reCAPTCHA Enterprise check failed, but proceeding with standard reCAPTCHA...');
      }
      
      // 2. Ensure container exists and is fresh
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        throw new Error("Recaptcha container not found in DOM");
      }

      // 3. Robust RecaptchaVerifier initialization
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': isInIframe ? 'normal' : 'invisible', // In iframes, normal often works better for verification
        'callback': () => {
          console.log('reCAPTCHA verified');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
        }
      });
      
      const appVerifier = window.recaptchaVerifier;
      const formattedPhone = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
      
      console.log('Sending OTP to:', formattedPhone);
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
      window.confirmationResult = result;
      setTimer(60);
    } catch (error: any) {
      console.error("Phone Auth Error Detail:", error);
      
      // Specific domain/quota errors
      const isCaptchaError = error.code === 'auth/captcha-check-failed' || error.message?.toLowerCase().includes('hostname match not found') || error.message?.toLowerCase().includes('domain');
      const isQuotaError = error.code === 'auth/too-many-requests' || error.code === 'auth/billing-not-enabled' || error.code === 'auth/quota-exceeded';
      
      if (isCaptchaError) {
        setNetworkError(true);
        alert("Domain Verification Failed: This often happens if the current domain is not added to your Firebase 'Authorized Domains'. Please check Firebase Console -> Auth -> Settings.");
      } else if (isQuotaError) {
        alert("SMS Quota Exceeded: Firebase free tier allows 10 SMS/day. Please use '9876543210' with OTP '123456' if whitelisted for testing.");
      } else if (error.code === 'auth/invalid-phone-number') {
        alert("Invalid phone number format. Use +91 XXXXXXXXXX.");
      } else {
        alert(`OTP Error: ${error.message || "Failed to send code"}`);
      }
      
      // Clean up on error to allow retry
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        } catch (e) {}
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!confirmationResult) return;
    if (otpString.length !== 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otpString);
      const user = result.user;

      // 1. Log to the specific phone auth endpoint as requested
      fetch('/api/auth/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phoneNumber,
          uid: user.uid,
          loginType: "phone"
        })
      }).catch(e => console.error("Phone auth logging failed:", e));

      // 2. Perform the full secure sync with backend
      await syncUserWithBackend();

      const pendingJson = sessionStorage.getItem('pendingAnalysis');
      if (pendingJson && auth.currentUser) {
        try {
          const { saveProfileLocally } = await import('../lib/localHistory');
          const pendingData = JSON.parse(pendingJson);
          pendingData.uid = auth.currentUser.uid;
          const docId = await saveProfileLocally(pendingData);
          sessionStorage.removeItem('pendingAnalysis');
          navigate(`/analysis-pricing/${docId}`, { replace: true });
          return;
        } catch (e) {
          console.error("Pending analysis save error:", e);
        }
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-900">
      {/* High-Resolution Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] rounded-full bg-emerald-200/40 blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full bg-teal-100/50 blur-[100px] mix-blend-multiply" />
        <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] sm:w-[60vw] sm:h-[60vw] rounded-full bg-green-100/50 blur-[120px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto p-6 sm:p-12">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 p-3 bg-white/70 backdrop-blur-xl rounded-2xl text-gray-600 hover:text-emerald-600 transition-all border border-white/80 shadow-sm active:scale-90 z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {(networkError || (isInIframe && authMethod === 'phone')) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full mb-8 border p-6 rounded-[2rem] text-center space-y-4 shadow-xl",
              networkError ? "bg-rose-50 border-rose-100 shadow-rose-900/5" : "bg-amber-50 border-amber-100 shadow-amber-900/5"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mx-auto",
              networkError ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
            )}>
              <Smartphone className={cn("w-6 h-6", networkError ? "rotate-12" : "")} />
            </div>
            <div className="space-y-1">
              <h3 className={cn(
                "text-sm font-black uppercase tracking-tight",
                networkError ? "text-rose-900" : "text-amber-900"
              )}>
                {networkError ? "Connectivity Issue" : "Iframe Restriction Detected"}
              </h3>
              <p className={cn(
                "text-[10px] font-bold leading-relaxed uppercase tracking-widest",
                networkError ? "text-rose-600/80" : "text-amber-600/80"
              )}>
                {networkError 
                  ? "Firebase is being blocked by your environment or an adblocker." 
                  : "OTP login often fails inside the AI Studio preview. Please open in a new tab for a smooth experience."}
              </p>
            </div>
            <div className="pt-2">
              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className={cn(
                  "w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg active:scale-95 transition-all text-white",
                  networkError ? "bg-rose-600 shadow-rose-600/20" : "bg-amber-600 shadow-amber-600/20"
                )}
              >
                Open in New Tab to Fix
              </button>
            </div>
          </motion.div>
        )}

        {popupError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full mb-8 bg-amber-50 border border-amber-100 p-6 rounded-[2rem] text-center space-y-4 shadow-xl shadow-amber-900/5"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
              <Chrome className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-amber-900 uppercase tracking-tight">Popup Blocked or Closed</h3>
              <p className="text-[10px] font-bold text-amber-600/80 leading-relaxed uppercase tracking-widest">
                The login window was closed. Please allow popups and keep the window open.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => handleGoogleLogin()}
                className="flex-1 bg-amber-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-amber-600/20 active:scale-95 transition-all"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.open(window.location.href, '_blank')}
                className="flex-1 bg-white border border-amber-200 text-amber-900 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
              >
                Open in New Tab
              </button>
            </div>
          </motion.div>
        )}

          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10 w-full"
          >
            <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-900/10 relative overflow-hidden group border border-emerald-50/50">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-transparent opacity-50"></div>
              <img src="/Logo.png" alt="Ayurzenix Logo" className="w-[75%] h-[75%] object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-display text-black-shiny mb-2">Ayurzenix</h1>
            <p className="text-emerald-600 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.4em] opacity-80">India's AI Ayurveda Engine</p>
          </motion.div>

          <div className="w-full bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 space-y-8 relative overflow-hidden">
            
            {/* Auth Method Toggle - Minimalist */}
            <div className="flex bg-gray-50 p-1 rounded-xl">
              <button 
                onClick={() => { setAuthMethod('email'); }}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
                  authMethod === 'email' ? "bg-white text-black shadow-sm" : "text-gray-400"
                )}
              >
                Email
              </button>
              <button 
                onClick={() => { setAuthMethod('phone'); }}
                className={cn(
                  "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg",
                  authMethod === 'phone' ? "bg-white text-black shadow-sm" : "text-gray-400"
                )}
              >
                Phone
              </button>
            </div>

          <AnimatePresence mode="wait">
            {authMethod === 'email' ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleEmailAuth} 
                className="space-y-4"
              >
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium"
                  placeholder="Email Address"
                />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium"
                  placeholder="Password"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="phone-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {!confirmationResult ? (
                  <form onSubmit={handleSendOtp} className="space-y-4">
                    <input
                      required
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:border-black focus:ring-0 outline-none transition-all text-sm font-medium"
                      placeholder="Phone Number (+91...)"
                    />
                    <button
                      disabled={loading}
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Code'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                      Enter the 6-digit code sent to<br/>
                      <span className="text-black font-black">{phoneNumber}</span>
                    </p>
                    <OtpInput 
                      length={6} 
                      onComplete={(otp) => {
                        setOtpString(otp);
                      }} 
                      disabled={loading}
                    />
                    <button
                      disabled={loading || otpString.length !== 6}
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-3 bg-white text-[9px] font-bold text-gray-400 uppercase tracking-widest">Or</span>
          </div>

          <div className="flex flex-col items-center gap-3 w-full">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (!credentialResponse.credential) return;
                setLoading(true);
                try {
                  const credential = GoogleAuthProvider.credential(credentialResponse.credential);
                  await signInWithCredential(auth, credential);
                  await syncUserWithBackend();
                  navigate(from, { replace: true });
                } catch (error: any) {
                  alert("Google login failed.");
                } finally {
                  setLoading(false);
                }
              }}
              onError={() => setPopupError(true)}
              useOneTap={false}
              theme="outline"
              size="large"
              width="384"
              shape="pill"
            />
            <button
              onClick={handleContinueAsGuest}
              disabled={loading}
              className="w-full bg-transparent border-none text-[10px] uppercase tracking-widest text-gray-400 font-bold hover:text-black transition-all pt-2"
            >
              Continue as Guest
            </button>
          </div>

          {authMethod === 'email' && (
            <p className="text-center text-[11px] font-bold text-gray-500 pt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-600 ml-1 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          )}

        </div>

        <div className="mt-8 flex flex-col items-center gap-4 z-10 w-full px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
            <NavLink to="/about" className="hover:text-emerald-600 transition-colors">About</NavLink>
            <NavLink to="/privacy" className="hover:text-emerald-600 transition-colors underline decoration-emerald-100 decoration-2 underline-offset-4">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</NavLink>
            <NavLink to="/shipping" className="hover:text-emerald-600 transition-colors">Shipping</NavLink>
          </div>
          <p className="text-[10px] text-gray-400/60 font-bold uppercase tracking-widest text-center mt-4">
            © {new Date().getFullYear()} IQ AI LABS
          </p>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    recaptchaVerifier: any;
    grecaptcha: {
      enterprise: {
        ready: (callback: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}
