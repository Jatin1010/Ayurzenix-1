import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './lib/firebase';
import { handleFirestoreError, OperationType } from './lib/firestore-errors';
import { doc, getDoc, setDoc, updateDoc, collection, serverTimestamp, onSnapshot, query, where, getDocs, limit } from 'firebase/firestore';
// ---- Synchronous Imports for Initial Core screens (minimal) ----
import Layout from './components/Layout';
import { AdProvider } from './components/AdManager';
import { useLanguage } from './contexts/LanguageContext';
import LanguagePopup from './components/LanguagePopup';
import WalletSyncFeedback from './components/WalletSyncFeedback';
import { ADMIN_EMAILS } from './lib/constants';
import { FEATURE_PRICES } from './constants/pricing';

// ---- Lazy-loaded Screens & Wrappers for Performance / Code Splitting ----
const MoodAyurvedaLandingScreen = lazy(() => import('./screens/MoodAyurvedaLandingScreen'));
const SymptomCheckerLandingScreen = lazy(() => import('./screens/SymptomCheckerLandingScreen'));
const ReportAnalyzerLandingScreen = lazy(() => import('./screens/ReportAnalyzerLandingScreen'));
const SmartScanLandingScreen = lazy(() => import('./screens/SmartScanLandingScreen'));
const BodyScanLandingScreen = lazy(() => import('./screens/BodyScanLandingScreen'));
const FuturePredictorLandingScreen = lazy(() => import('./screens/FuturePredictorLandingScreen'));
const DailyRoutineLandingScreen = lazy(() => import('./screens/DailyRoutineLandingScreen'));
const FaceGlowLandingScreen = lazy(() => import('./screens/FaceGlowLandingScreen'));
const WeightLossLandingScreen = lazy(() => import('./screens/WeightLossLandingScreen'));
const DigitalAyurvedaBlogScreen = lazy(() => import('./screens/DigitalAyurvedaBlogScreen'));
const HeartHealthBlogScreen = lazy(() => import('./screens/HeartHealthBlogScreen'));
const AaharScannerLandingScreen = lazy(() => import('./screens/AaharScannerLandingScreen'));

const FeatureLandingWrapper = lazy(() => import('./components/FunnelWrappers').then(m => ({ default: m.FeatureLandingWrapper })));
const PaywallWrapper = lazy(() => import('./components/FunnelWrappers').then(m => ({ default: m.PaywallWrapper })));

const ReportAnalyzerScreen = lazy(() => import('./screens/ReportAnalyzerScreen'));
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const AuthScreen = lazy(() => import('./screens/AuthScreen'));
const OnboardingScreen = lazy(() => import('./screens/OnboardingScreen'));
const HealthScanScreen = lazy(() => import('./screens/HealthScanScreen'));
const BodyScanScreen = lazy(() => import('./screens/BodyScanScreen'));
const ResultScreen = lazy(() => import('./screens/ResultScreen'));
const HistoryScreen = lazy(() => import('./screens/HistoryScreen'));
const ChatScreen = lazy(() => import('./screens/ChatScreen'));
const ConsultationScreen = lazy(() => import('./screens/ConsultationScreen'));
const DailyRoutineScreen = lazy(() => import('./screens/DailyRoutineScreen'));
const FaceGlowScreen = lazy(() => import('./screens/FaceGlowScreen'));
const FaceGlowResultScreen = lazy(() => import('./screens/FaceGlowResultScreen'));
const FuturePredictorScreen = lazy(() => import('./screens/FuturePredictorScreen'));
const MoodAyurvedaScreen = lazy(() => import('./screens/MoodAyurvedaScreen'));
const StoreScreen = lazy(() => import('./screens/StoreScreen'));
const GoalWellnessScreen = lazy(() => import('./screens/GoalWellnessScreen'));
const HormonalBalanceScreen = lazy(() => import('./screens/HormonalBalanceScreen'));
const HormonalBalanceLandingScreen = lazy(() => import('./screens/HormonalBalanceLandingScreen'));
const HairFallAnalyzerScreen = lazy(() => import('./screens/HairFallAnalyzerScreen'));
const HairFallLandingScreen = lazy(() => import('./screens/HairFallLandingScreen'));
const EnergyBoosterScreen = lazy(() => import('./screens/EnergyBoosterScreen'));
const EnergyLandingScreen = lazy(() => import('./screens/EnergyLandingScreen'));
const GutLandingScreen = lazy(() => import('./screens/GutLandingScreen'));
const LiverLandingScreen = lazy(() => import('./screens/LiverLandingScreen'));
const StressReliefLandingScreen = lazy(() => import('./screens/StressReliefLandingScreen'));
const StressReliefScanScreen = lazy(() => import('./screens/StressReliefScanScreen'));
const StressReliefResultScreen = lazy(() => import('./screens/StressReliefResultScreen'));
const GutHealthAnalyzerScreen = lazy(() => import('./screens/GutHealthAnalyzerScreen'));
const AgniEngineScreen = lazy(() => import('./screens/AgniEngineScreen'));
const AgniEngineResultScreen = lazy(() => import('./screens/AgniEngineResultScreen'));
const LiverHealthScreen = lazy(() => import('./screens/LiverHealthScreen'));
const AdminDashboardScreen = lazy(() => import('./screens/AdminDashboardScreen'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./screens/admin/Dashboard'));
const AdminUsers = lazy(() => import('./screens/admin/Users'));
const AdminAIControl = lazy(() => import('./screens/admin/AIControl'));
const AdminRevenue = lazy(() => import('./screens/admin/Revenue'));
const AdminSettings = lazy(() => import('./screens/SettingsScreen')); // Reuse existing or point to new if needed
const PrivacyPolicy = lazy(() => import('./screens/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./screens/TermsOfService'));
const ShippingPolicy = lazy(() => import('./screens/ShippingPolicy'));
const PricingScreen = lazy(() => import('./screens/PricingScreen'));
const HelpSupport = lazy(() => import('./screens/HelpSupport'));
const AboutScreen = lazy(() => import('./screens/AboutScreen'));
const ReferralScreen = lazy(() => import('./screens/ReferralScreen'));
const BlogListScreen = lazy(() => import('./screens/BlogListScreen'));
const BlogPostScreen = lazy(() => import('./screens/BlogPostScreen'));
const SymptomCheckerScreen = lazy(() => import('./screens/SymptomCheckerScreen'));
const AddBalanceScreen = lazy(() => import('./screens/AddBalanceScreen'));
const HeartHealthScreen = lazy(() => import('./screens/HeartHealthScreen'));
const HeartHealthLandingScreen = lazy(() => import('./screens/HeartHealthLandingScreen'));
const HeartHealthResultScreen = lazy(() => import('./screens/HeartHealthResultScreen'));
const SmartMentalScanLandingScreen = lazy(() => import('./screens/SmartMentalScanLandingScreen'));
const SmartMentalScanScreen = lazy(() => import('./screens/SmartMentalScanScreen'));
const SmartMentalScanResultScreen = lazy(() => import('./screens/SmartMentalScanResultScreen'));
const AnalysisPlanSelectionScreen = lazy(() => import('./screens/AnalysisPlanSelectionScreen'));
const IntelligenceScreen = lazy(() => import('./screens/IntelligenceScreen'));
const SleepIntelligenceLandingScreen = lazy(() => import('./screens/SleepIntelligenceLandingScreen'));
const SleepIntelligenceScreen = lazy(() => import('./screens/SleepIntelligenceScreen'));
const SleepIntelligenceResultScreen = lazy(() => import('./screens/SleepIntelligenceResultScreen'));
const AaharScannerScreen = lazy(() => import('./screens/AaharScannerScreen'));
const SoundscapesScreen = lazy(() => import('./screens/SoundscapesScreen'));
const DoshaTestScreen = lazy(() => import('./screens/DoshaTestScreen'));
const BMICalculatorScreen = lazy(() => import('./screens/BMICalculatorScreen'));

const AccountScreen = lazy(() => import('./screens/AccountScreen'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { language, isLanguageSet } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [appConfig, setAppConfig] = useState<any>(null);

  useEffect(() => {
    // Real-time config listener
    const configRef = doc(db, 'app_config', 'main');

    const unsubscribeConfig = onSnapshot(configRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setAppConfig({
          ...data,
          prices: { ...FEATURE_PRICES, ...(data.prices || {}) }
        });
      }
    }, (error) => {
      console.error("app_config onSnapshot error:", error);
      handleFirestoreError(error, OperationType.GET, 'app_config/main');
    });

    return () => unsubscribeConfig();
  }, []);

  useEffect(() => {
    // Check if onboarding has been seen
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    let unsubscribeUser: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        // Setup real-time listener for user data
        unsubscribeUser = onSnapshot(userRef, async (userSnap) => {
          const email = firebaseUser.email?.toLowerCase();
          const isAdmin = !!(email && ADMIN_EMAILS.includes(email));

          try {
            if (!userSnap.exists()) {
              const pendingRefCode = localStorage.getItem('pendingReferralCode');
              let referredBy = null;

              if (pendingRefCode) {
                try {
                  const refQuery = query(
                    collection(db, 'users'),
                    where('referralCode', '==', pendingRefCode),
                    limit(1)
                  );
                  const refSnap = await getDocs(refQuery);
                  if (!refSnap.empty) {
                    referredBy = refSnap.docs[0].id;
                  }
                  localStorage.removeItem('pendingReferralCode');
                } catch (e) {
                  console.error("Referral resolution error:", e);
                }
              }

              const providerId = firebaseUser.providerData[0]?.providerId || 'password';
              const loginType = providerId === 'google.com' ? 'google' : (providerId === 'phone' ? 'phone' : 'email');

              const newUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                phone: firebaseUser.phoneNumber || '',
                loginType: loginType,
                displayName: firebaseUser.displayName || 'User',
                photoURL: firebaseUser.photoURL || '',
                language: language,
                darkMode: false,
                notifications_tips: true,
                notifications_reminders: true,
                age: null,
                gender: '',
                dosha: '',
                lifestyle: '',
                free_results_count: referredBy ? 3 : 2, // Referred users get a free basic report extra
                plan: 'free',
                reports: [],
                is_admin: isAdmin,
                referredBy: referredBy,
                wallet_balance: isAdmin ? 1000 : 0,
                total_saved: 0,
                wellness_score: 50, // Initial average score
                total_reports: 0,
                createdAt: serverTimestamp(),
              };
              await setDoc(userRef, newUser);
              setUserData(newUser);
            } else {
              const data = userSnap.data();
              
              // Ensure is_admin is set correctly in DB if it's missing or false for admin email
              if (isAdmin || email === 'help@ayurzenix.in') {
                const updates: any = {};
                if (!data.is_admin) updates.is_admin = true;
                if (!data.email && email) updates.email = email;
                
                // Give admins a testing balance if they have 0
                if ((data.wallet_balance || 0) < 500) {
                  updates.wallet_balance = 1000;
                }

                if (Object.keys(updates).length > 0) {
                  try {
                    await updateDoc(userRef, updates);
                    Object.assign(data, updates);
                  } catch (err) {
                    handleFirestoreError(err, OperationType.UPDATE, `users/${userRef.id}`);
                  }
                }
              }

              setUserData(data);
            }
          } catch (err) {
            console.error("Error processing user data:", err);
            handleFirestoreError(err, OperationType.WRITE, `users/${userRef.id}`);
          }
          setLoading(false);
        }, (error) => {
          console.error("User data listener error:", error);
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });
      } else {
        // Clear listener if user logs out
        if (unsubscribeUser) unsubscribeUser();
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUser();
    };
  }, []);

  // Guest user data structure
  const guestData = {
    uid: 'guest',
    displayName: 'Guest User',
    language: language,
    wallet_balance: 0,
    is_guest: true
  };

  const currentData = userData || guestData;

  useEffect(() => {
    if (currentData.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentData.darkMode]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
        <p className="mt-4 text-slate-400 font-medium animate-pulse uppercase tracking-widest text-[10px]">Initializing Veda Engine...</p>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <AdProvider>
      <LanguagePopup />
      <WalletSyncFeedback />
      <Router>
        <ScrollToTop />
        <Suspense fallback={
          <div className="h-screen w-full flex flex-col items-center justify-center bg-ayur-bg z-50 fixed inset-0">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
          </div>
        }>
          <Routes>
            <Route path="/auth" element={!user ? <AuthScreen /> : <Navigate to="/" />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<Navigate to="/privacy" />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<Navigate to="/terms" />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/shipping-delivery" element={<Navigate to="/shipping" />} />
            <Route path="/pricing" element={<PricingScreen appConfig={appConfig} userData={currentData} />} />
            <Route path="/f/:featureId" element={<FeatureLandingWrapper userData={currentData} />} />
            <Route path="/paywall/:featureId" element={<PaywallWrapper userData={currentData} />} />
            <Route path="/wallet" element={user ? <AccountScreen userData={currentData} appConfig={appConfig} /> : <Navigate to="/auth" />} />
            <Route path="/wallet/add-balance" element={user ? <AddBalanceScreen userData={currentData} /> : <Navigate to="/auth" />} />
            <Route element={<Layout userData={currentData} />}>
              <Route path="/" element={<HomeScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/health-scan" element={<HealthScanScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/smart-scan-landing" element={<SmartScanLandingScreen appConfig={appConfig} />} />
              <Route path="/report-analyzer-landing" element={<ReportAnalyzerLandingScreen appConfig={appConfig} />} />
              <Route path="/symptom-checker-landing" element={<SymptomCheckerLandingScreen appConfig={appConfig} />} />
              <Route path="/mood-ayurveda-landing" element={<MoodAyurvedaLandingScreen appConfig={appConfig} />} />
              <Route path="/body-scan-landing" element={<BodyScanLandingScreen appConfig={appConfig} />} />
              <Route path="/future-predictor-landing" element={<FuturePredictorLandingScreen appConfig={appConfig} />} />
              <Route path="/report-analyzer" element={<ReportAnalyzerScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/symptom-checker" element={<SymptomCheckerScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/heart-health" element={<HeartHealthScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/heart-health-landing" element={<HeartHealthLandingScreen appConfig={appConfig} />} />
              <Route path="/heart-health-result/:profileId" element={<HeartHealthResultScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/aahar-scanner-landing" element={<AaharScannerLandingScreen />} />
              <Route path="/aahar-scanner" element={<AaharScannerScreen userData={currentData} />} />
              <Route path="/body-scan" element={<BodyScanScreen userData={currentData} appConfig={appConfig} />} />
            <Route path="/history" element={<HistoryScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/chat" element={<ChatScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/consultation" element={<ConsultationScreen appConfig={appConfig} />} />
              <Route path="/daily-routine" element={<DailyRoutineScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/daily-routine-landing" element={<DailyRoutineLandingScreen appConfig={appConfig} />} />
              <Route path="/face-glow" element={<FaceGlowScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/face-glow-landing" element={<FaceGlowLandingScreen appConfig={appConfig} />} />
              <Route path="/weight-loss-landing" element={<WeightLossLandingScreen appConfig={appConfig} />} />
              <Route path="/blog/digital-ayurveda-platform" element={<DigitalAyurvedaBlogScreen appConfig={appConfig} />} />
              <Route path="/blog/heart-health-rising-india" element={<HeartHealthBlogScreen appConfig={appConfig} />} />
              <Route path="/face-glow/result/:profileId" element={<FaceGlowResultScreen userData={currentData} setUserData={setUserData} appConfig={appConfig} />} />
              <Route path="/future-predictor" element={<FuturePredictorScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/hormonal-balance" element={<HormonalBalanceScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/hormonal-balance-landing" element={<HormonalBalanceLandingScreen appConfig={appConfig} />} />
              <Route path="/hair-fall" element={<HairFallAnalyzerScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/hair-fall-landing" element={<HairFallLandingScreen appConfig={appConfig} />} />
              <Route path="/energy-booster" element={<EnergyBoosterScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/energy-landing" element={<EnergyLandingScreen appConfig={appConfig} />} />
              <Route path="/gut-landing" element={<GutLandingScreen appConfig={appConfig} />} />
              <Route path="/liver-landing" element={<LiverLandingScreen appConfig={appConfig} />} />
              <Route path="/liver-health" element={<LiverHealthScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/gut-health" element={<GutHealthAnalyzerScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/agni-engine-scan" element={<AgniEngineScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/agni-engine/result/:profileId" element={<AgniEngineResultScreen userData={currentData} />} />
              <Route path="/mood-ayurveda" element={<MoodAyurvedaScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/smart-mental-landing" element={<SmartMentalScanLandingScreen appConfig={appConfig} />} />
              <Route path="/smart-mental-scan" element={<SmartMentalScanScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/smart-mental-scan/result/:profileId" element={<SmartMentalScanResultScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/better-sleep-landing" element={<SleepIntelligenceLandingScreen appConfig={appConfig} />} />
              <Route path="/sleep-intelligence-scan" element={<SleepIntelligenceScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/sleep-intelligence/result/:profileId" element={<SleepIntelligenceResultScreen userData={currentData} />} />
              <Route path="/stress-relief-landing" element={<StressReliefLandingScreen />} />
              <Route path="/stress-relief-scan" element={<StressReliefScanScreen userData={currentData} />} />
              <Route path="/stress-relief/result/:profileId" element={<StressReliefResultScreen userData={currentData} />} />
              <Route path="/goal/:goalId" element={<GoalWellnessScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/store" element={<StoreScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/result/:profileId" element={<ResultScreen userData={currentData} appConfig={appConfig} setUserData={setUserData} />} />
              <Route path="/analysis-pricing/:profileId" element={<AnalysisPlanSelectionScreen userData={currentData} setUserData={setUserData} />} />
              <Route path="/profile" element={<AccountScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/referral" element={<ReferralScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/admin-old" element={user && currentData.is_admin ? <AdminDashboardScreen userData={currentData} appConfig={appConfig} /> : <Navigate to="/" />} />
              
              {/* New Pro Admin System */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="ai-control" element={<AdminAIControl />} />
                <Route path="revenue" element={<AdminRevenue />} />
                <Route path="marketing" element={<div className="p-20 text-center"><p className="text-zinc-500 font-bold uppercase tracking-widest">Marketing Engine v2.0 Coming Soon</p></div>} />
                <Route path="settings" element={<AdminSettings userData={currentData} />} />
              </Route>
              
              <Route path="/blog" element={<BlogListScreen />} />
              <Route path="/blog/:id" element={<BlogPostScreen />} />
              <Route path="/help" element={<HelpSupport />} />
              <Route path="/intelligence" element={<IntelligenceScreen />} />
              <Route path="/soundscapes" element={<SoundscapesScreen userData={currentData} />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/settings" element={<AccountScreen userData={currentData} appConfig={appConfig} />} />
              <Route path="/dosha-test" element={<DoshaTestScreen />} />
              <Route path="/bmi-calculator" element={<BMICalculatorScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </AdProvider>
  );
}
