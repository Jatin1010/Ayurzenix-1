import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { 
  Brain, 
  Camera, 
  MessageCircle, 
  Sparkles, 
  Wallet, 
  ChevronRight, 
  ArrowRight,
  Leaf,
  Zap,
  TrendingUp,
  Target,
  CheckCircle2,
  Heart,
  ShoppingBag,
  Bell,
  Moon,
  Flower2,
  Activity,
  Scissors,
  Utensils,
  ShieldAlert,
  FileText,
  Search,
  Download,
  Crown,
  User
} from 'lucide-react';
import { motion } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { doc, getDoc } from 'firebase/firestore';
import { usePermissions } from '../hooks/usePermissions';
import PermissionModal from '../components/PermissionModal';
import DailyTips from '../components/DailyTips';
import MainMenu from '../components/MainMenu';
import { useAds } from '../components/AdManager';
import { useLanguage } from '../contexts/LanguageContext';
import { getFeaturePricing } from '../lib/pricing';

import { Suspense, lazy } from 'react';
import { Hero } from '../components/home/Hero';
import { TipsBanner } from '../components/home/TipsBanner';
import { DosAndDontsBanner } from '../components/home/DosAndDontsBanner';
import { MoodTracker } from '../components/home/MoodTracker';
import { DailyDinacharya } from '../components/home/DailyDinacharya';
import { VedaIntelligenceHUD } from '../components/home/VedaIntelligenceHUD';

import { PlatformFeatures } from '../components/home/PlatformFeatures';

// New Sections
import { DoshaTest } from '../components/home/DoshaTest';
import { SampleReport } from '../components/home/SampleReport';

// Lazy load below-the-fold components
const RitucharyaScanner = lazy(() => import('../components/home/RitucharyaScanner').then(m => ({ default: m.RitucharyaScanner })));
const WearableSync = lazy(() => import('../components/home/WearableSync').then(m => ({ default: m.WearableSync })));
const WomensWellness = lazy(() => import('../components/home/WomensWellness').then(m => ({ default: m.WomensWellness })));
const AIAssistant = lazy(() => import('../components/home/AIAssistant').then(m => ({ default: m.AIAssistant })));
const SocialProof = lazy(() => import('../components/home/SocialProof').then(m => ({ default: m.SocialProof })));
const Methodology = lazy(() => import('../components/home/Methodology').then(m => ({ default: m.Methodology })));
const ContentHub = lazy(() => import('../components/home/ContentHub').then(m => ({ default: m.ContentHub })));
const FinalCTA = lazy(() => import('../components/home/FinalCTA').then(m => ({ default: m.FinalCTA })));
const PricingSection = lazy(() => import('../components/home/PricingSection').then(m => ({ default: m.PricingSection })));
const HomeStoreSpotlight = lazy(() => import('../components/home/StoreSpotlight').then(m => ({ default: m.HomeStoreSpotlight })));
const VedicSoundscapes = lazy(() => import('../components/home/VedicSoundscapes').then(m => ({ default: m.VedicSoundscapes })));

const SectionFallback = () => <div className="w-full h-32 animate-pulse bg-gray-100 rounded-[2.5rem] my-4" />;

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}



import { AdUnit } from '../components/AdUnit';

interface HomeScreenProps {
  userData: any;
  appConfig?: any;
}

export default function HomeScreen({ userData, appConfig }: HomeScreenProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showRewarded } = useAds();
  const { activePermission, isPermanentlyDenied, isDenied, requestPermission, handleAllow, closeModal } = usePermissions();
  const [dailyProgress, setDailyProgress] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [showLimitPopup, setShowLimitPopup] = useState<string | boolean>(false);
  const [freeUsageCount, setFreeUsageCount] = useState<number>(() => {
    const saved = localStorage.getItem('freeUsageCount');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    });

    if (userData?.uid && !userData.is_guest) {
      fetchDailyStats();
      
      // Check for notification permission prompt
      const hasSeenPrompt = localStorage.getItem('hasSeenNotificationPrompt');
      if (!hasSeenPrompt && Notification.permission === 'default') {
        const timer = setTimeout(() => {
          requestPermission('notifications', () => {
            localStorage.setItem('hasSeenNotificationPrompt', 'true');
          });
        }, 3000); // Show after 3 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [userData?.uid, userData?.is_guest, requestPermission]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const fetchDailyStats = async () => {
    const routineRef = doc(db, 'users', userData.uid, 'daily_routines', today);
    try {
      const routineSnap = await getDoc(routineRef);
      if (routineSnap.exists()) {
        const data = routineSnap.data();
        setDailyProgress(data.progress || 0);
        setDailyStreak(data.streak || 0);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, routineRef.path);
    }
  };

  const handleFeatureClick = (path: string) => {
    if (!userData.is_guest) {
      navigate(path);
      return;
    }

    if (freeUsageCount < 2) {
      const newCount = freeUsageCount + 1;
      setFreeUsageCount(newCount);
      localStorage.setItem('freeUsageCount', newCount.toString());
      navigate(path);
    } else {
      setShowLimitPopup(path);
    }
  };

  if (!userData) return null;


  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-8 gpu-accelerated selection:bg-ayur-teal/20">
      <SEO 
        title="AI Ayurveda Analysis & Personalized Wellness"
        description="Experience the future of health with Ayurzenix. Get your AI Ayurveda Analysis, Online Dosha Test, and Ayurvedic BMI Calculator results in 60 seconds."
        keywords="AI Ayurveda Analysis, Dosha Test Online, Ayurvedic BMI Calculator, Ayurzenix, Digital Ayurveda India, Personal Wellness AI"
      />
      
      {/* Dynamic Header */}
      <div className="fixed top-0 left-0 right-0 z-[1000] p-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <MainMenu userData={userData} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-auto cursor-pointer absolute left-1/2 top-4 -translate-x-1/2"
          onClick={() => navigate('/')}
        >
          <img src="/Logo.png" alt="Ayurzenix AI Ayurveda" className="h-12 md:h-16 object-contain" fetchPriority="high" />
        </motion.div>

        <div className="pointer-events-auto">
           {userData.is_guest ? (
             <button 
               onClick={() => navigate('/auth')}
               className="px-5 py-2 rounded-full bg-ayur-neon text-black text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Sign In
             </button>
           ) : (
             <div 
               onClick={() => navigate('/profile')}
               className="flex items-center gap-3 luxury-glass p-1.5 pr-4 cursor-pointer"
             >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-black/10">
                   {userData.photoURL ? (
                     <img src={userData.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <User className="w-full h-full p-2 text-gray-400" />
                   )}
                </div>
                <div className="hidden md:block">
                   <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">
                     {userData.is_premium ? 'Elite' : 'Member'}
                   </p>
                   <p className="text-xs font-bold text-black">{userData.displayName?.split(' ')[0]}</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* 1. Hero Section */}
      <Hero 
        onStart={() => handleFeatureClick('/smart-scan-landing')} 
        onExplore={() => {
          const selector = document.getElementById('dosha-test');
          selector?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }} 
      />

      {/* 2. Dosha Test Section */}
      <motion.div 
        id="dosha-test"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <DoshaTest />
      </motion.div>
 
      {/* 4. Seasonal Harmony Tool (RitucharyaScanner) */}
      <Suspense fallback={<SectionFallback />}>
        <motion.div 
          id="seasonal-harmony"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <RitucharyaScanner />
        </motion.div>
      </Suspense>
 
      {/* 5. Sample Report Preview */}
      <SampleReport />
 
      {/* 6. Unified Platform Features (Categorized Cinematic Cards) */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <PlatformFeatures onSelect={(path) => handleFeatureClick(path)} />
      </motion.div>
      
      {/* Informational Section */}
      <div className="grid md:grid-cols-2 gap-0">
          <TipsBanner />
          <DosAndDontsBanner />
      </div>
 
      <div className="space-y-4 pt-6 overflow-hidden">
        {/* Secondary Dashboard Features */}

        

 
        
 
        <AdUnit className="px-6 py-2" />
 
        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <HomeStoreSpotlight />
          </motion.div>
        </Suspense>
 
        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <VedicSoundscapes />
          </motion.div>
        </Suspense>

        <AdUnit className="px-6 py-2" />

        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SocialProof />
          </motion.div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <PricingSection />
          </motion.div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Methodology />
          </motion.div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ContentHub onViewAll={() => navigate('/blog')} />
          </motion.div>
        </Suspense>

        <Suspense fallback={<SectionFallback />}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <FinalCTA onStart={() => handleFeatureClick('/smart-scan-landing')} />
          </motion.div>
        </Suspense>
      </div>

      {/* PWA Install CTA (Floating) */}
      {!isAppInstalled && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-sm px-6"
        >
          <div className="luxury-glass p-4 flex items-center justify-between gap-4 border-ayur-teal/30">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-ayur-teal" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Add to Home</p>
                <p className="text-sm font-bold text-black">Install Ayurzenix</p>
              </div>
            </div>
            <button 
              onClick={handleInstallClick}
              className="px-4 py-2 bg-ayur-teal text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}

      {/* Bottom Sticky Action Button for Mobile */}
      <div className="md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[1001] w-full px-6">
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={() => handleFeatureClick('/smart-scan-landing')}
           className="w-full bg-ayur-neon text-black rounded-[2rem] py-5 px-8 shadow-[0_20px_50px_rgba(204,255,0,0.3)] flex items-center justify-between group border-2 border-black/5"
         >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-ayur-neon fill-current" />
               </div>
               <span className="text-xs font-black uppercase tracking-widest">Start Free AI Analysis</span>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
         </motion.button>
      </div>

      {/* Footer is handled by Layout.tsx */}

      {showLimitPopup && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[2000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ai-glow-card p-12 w-full max-w-sm text-center space-y-10"
          >
            <div className="w-20 h-20 bg-ayur-neon/10 text-ayur-neon rounded-3xl flex items-center justify-center mx-auto">
              <Zap className="w-10 h-10 fill-current" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-black uppercase tracking-tight">Free Limit Reached</h3>
              <p className="text-gray-500 font-medium">Join Ayurzenix to continue your wellness transformation.</p>
            </div>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="premium-btn btn-ai w-full"
              >
                Sign In to Unlock
              </button>
              <button
                onClick={() => setShowLimitPopup(false)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <PermissionModal
        isOpen={activePermission !== null}
        type={activePermission || 'notifications'}
        isPermanentlyDenied={isPermanentlyDenied}
        isDenied={isDenied}
        onClose={closeModal}
        onAllow={handleAllow}
      />
    </div>
  );
}
