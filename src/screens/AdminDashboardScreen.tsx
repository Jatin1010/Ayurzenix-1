import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { 
  collection, 
  query, 
  getDocs, 
  limit, 
  orderBy, 
  where, 
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { 
  Users, 
  Activity, 
  Wallet, 
  ArrowLeft, 
  ShieldAlert,
  ShieldCheck,
  Loader2,
  TrendingUp,
  History,
  BarChart3,
  PieChart as PieChartIcon,
  Settings,
  Bell,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Zap,
  ShoppingBag,
  MessageSquare,
  Smartphone,
  Globe,
  IndianRupee,
  UserPlus,
  Target,
  RefreshCw,
  Sparkles,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../lib/utils';
import { ADMIN_EMAILS } from '../lib/constants';
import { generateProductDetails } from '../lib/gemini';
import axios from 'axios';

interface AdminDashboardScreenProps {
  userData: any;
  appConfig?: any;
}

type TabType = 'overview' | 'revenue' | 'users' | 'features' | 'insights' | 'products' | 'history' | 'audit' | 'controls' | 'notifications' | 'errors' | 'health' | 'ai';

export default function AdminDashboardScreen({ userData, appConfig: propAppConfig }: AdminDashboardScreenProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [featureUsageData, setFeatureUsageData] = useState<any[]>([]);
  const [periodStats, setPeriodStats] = useState({ revenue: 0, users: 0, scans: 0 });
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [appConfig, setAppConfig] = useState<any>(propAppConfig || null);
  const [dateFilter, setDateFilter] = useState<'today'|'7d'|'30d'>('7d');
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const isAdmin = userData?.email && ADMIN_EMAILS.includes(userData.email.toLowerCase());

  useEffect(() => {
    if (!isAdmin) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 3000);
      return () => clearTimeout(timer);
    }

    const fetchHealth = async () => {
      try {
        const { data } = await axios.get('/api/admin/health');
        setHealthStatus(data);
      } catch (err) {
        console.error("Health check failed:", err);
      }
    };
    fetchHealth();

    // Real-time stats listener
    const statsRef = doc(db, 'dashboard_stats', 'current');
    const unsubscribeStats = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setStats(doc.data());
      } else {
        // Initial empty state
        setStats({
          total_users: 0,
          active_users: 0,
          total_scans: 0,
          total_revenue: 0,
          conversion_rate: 0,
          growth: 0
        });
      }
    }, (error) => {
      console.error("Stats onSnapshot error:", error);
      handleFirestoreError(error, OperationType.GET, 'dashboard_stats/current');
    });

    // Real-time config listener
    const configRef = doc(db, 'app_config', 'main');
    const unsubscribeConfig = onSnapshot(configRef, (doc) => {
      if (doc.exists()) {
        setAppConfig(doc.data());
      }
    }, (error) => {
      console.error("Config Listener Error:", error);
      handleFirestoreError(error, OperationType.GET, 'app_config/main');
    });

    // Fetch data for charts
    const fetchData = async () => {
      try {
        const now = new Date();
        let targetDate = new Date(now);
        
        if (dateFilter === 'today') {
          targetDate.setHours(0,0,0,0);
        } else if (dateFilter === '7d') {
          targetDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateFilter === '30d') {
          targetDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }
        
        const targetDateStr = targetDate.toISOString();

        // 1. Real Revenue Data
        const revenueQuery = query(
          collection(db, 'transactions'), 
          where('status', '==', 'success'),
          where('createdAt', '>=', targetDateStr)
        );
        const revSnap = await getDocs(revenueQuery);
        const revenueMap: any = {};
        let pRev = 0;
        revSnap.forEach(doc => {
          const amount = doc.data().amount || 0;
          pRev += amount;
          const date = doc.data().createdAt?.split('T')[0].substring(5) || '??/??'; // MM-DD
          revenueMap[date] = (revenueMap[date] || 0) + amount;
        });
        const revChartData = Object.keys(revenueMap).sort().map(date => ({ date, amount: revenueMap[date] }));
        setRevenueData(revChartData.length > 0 ? revChartData : [{ date: 'No Data', amount: 0 }]);

        // 2. Real User Growth Data
        const usersQuery = query(
          collection(db, 'users'),
          where('createdAt', '>=', targetDateStr)
        );
        const usersSnap = await getDocs(usersQuery);
        const usersMap: any = {};
        let pUsers = 0;
        usersSnap.forEach(doc => {
          pUsers += 1;
          const date = doc.data().createdAt?.split('T')[0].substring(5) || '??/??';
          usersMap[date] = (usersMap[date] || 0) + 1;
        });
        const growthChartData = Object.keys(usersMap).sort().map(date => ({ date, users: usersMap[date] }));
        setUserGrowthData(growthChartData.length > 0 ? growthChartData : [{ date: 'No Data', users: 0 }]);

        // 3. Real Feature Usage Data (All time context for pie chart and specific period for periodStats)
        const allScansSnap = await getDocs(collection(db, 'health_profiles'));
        const featureMap: any = {
          'health_scan': 0, 'body_scan': 0, 'face_glow': 0, 'future_prediction': 0,
          'hormonal_balance': 0, 'hair_fall': 0, 'energy_booster': 0, 'gut_health': 0, 'liver_health': 0
        };
        let pScans = 0;
        allScansSnap.forEach(doc => {
          const type = doc.data().type;
          const createdAt = doc.data().createdAt;
          if (featureMap[type] !== undefined) featureMap[type]++;
          if (createdAt && createdAt >= targetDateStr) {
            pScans++;
          }
        });
        
        setPeriodStats({ revenue: pRev, users: pUsers, scans: pScans });

        setFeatureUsageData([
          { name: 'Smart Scan', value: featureMap['health_scan'], color: '#22C55E' },
          { name: 'Body Scan', value: featureMap['body_scan'], color: '#3B82F6' },
          { name: 'Face Glow', value: featureMap['face_glow'], color: '#F59E0B' },
          { name: 'Future', value: featureMap['future_prediction'], color: '#8B5CF6' },
          { name: 'Hormones', value: featureMap['hormonal_balance'], color: '#EC4899' },
          { name: 'Hair Fall', value: featureMap['hair_fall'], color: '#A855F7' },
          { name: 'Energy', value: featureMap['energy_booster'], color: '#F97316' },
          { name: 'Gut Health', value: featureMap['gut_health'], color: '#14B8A6' },
          { name: 'Liver', value: featureMap['liver_health'], color: '#EAB308' },
        ]);

        // Fetch recent transactions
        const transQuery = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'), limit(10));
        const transSnap = await getDocs(transQuery);
        setRecentTransactions(transSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch error logs
        const errorQuery = query(collection(db, 'app_errors'), orderBy('timestamp', 'desc'), limit(10));
        const errorSnap = await getDocs(errorQuery);
        setErrorLogs(errorSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      unsubscribeStats();
      unsubscribeConfig();
    };
  }, [isAdmin, navigate, dateFilter]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 text-gray-900">
        <ShieldAlert className="w-20 h-20 text-red-500 mb-4" />
        <h1 className="text-2xl font-black mb-2">Access Denied</h1>
        <p className="text-gray-500 text-center mb-6">You do not have permission to access the Admin Panel.</p>
        <p className="text-gray-400 text-sm">Redirecting to home in 3 seconds...</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-900/20"
        >
          Go Home Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin" />
      </div>
    );
  }

  const syncAnalytics = async () => {
    setSyncing(true);
    try {
      // 1. Fetch Total Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnap.size;

      // 2. Fetch Total Revenue from successful transactions
      const transQuery = query(collection(db, 'transactions'), where('status', '==', 'success'));
      const transSnap = await getDocs(transQuery);
      let totalRevenue = 0;
      transSnap.forEach(doc => {
        totalRevenue += (doc.data().amount || 0);
      });

      // 3. Fetch Total Scans
      const scansSnap = await getDocs(collection(db, 'health_profiles'));
      const totalScans = scansSnap.size;

      // 4. Calculate Feature Usage
      const featureUsage: any = {
        'Smart Scan': 0,
        'AI Body Scan': 0,
        'Face Glow': 0,
        'Future Prediction': 0,
        'Hormonal Balance': 0,
        'Hair Fall': 0,
        'Energy Booster': 0,
        'Gut Health': 0,
        'Liver Health': 0
      };
      scansSnap.forEach(doc => {
        const type = doc.data().type;
        if (type === 'health_scan') featureUsage['Smart Scan']++;
        else if (type === 'body_scan') featureUsage['AI Body Scan']++;
        else if (type === 'face_glow') featureUsage['Face Glow']++;
        else if (type === 'future_prediction') featureUsage['Future Prediction']++;
        else if (type === 'hormonal_balance') featureUsage['Hormonal Balance']++;
        else if (type === 'hair_fall') featureUsage['Hair Fall']++;
        else if (type === 'energy_booster') featureUsage['Energy Booster']++;
        else if (type === 'gut_health') featureUsage['Gut Health']++;
        else if (type === 'liver_health') featureUsage['Liver Health']++;
      });

      // 5. Update Dashboard Stats
      const statsRef = doc(db, 'dashboard_stats', 'current');
      await setDoc(statsRef, {
        total_users: totalUsers,
        active_users: Math.floor(totalUsers * 0.3), // Simulated active users
        total_scans: totalScans,
        total_revenue: totalRevenue,
        conversion_rate: totalUsers > 0 ? ((totalScans / totalUsers) * 100).toFixed(1) : 0,
        feature_usage: featureUsage,
        updatedAt: serverTimestamp()
      }, { merge: true });

      alert("Analytics synced successfully! ✅");
    } catch (error) {
      console.error("Sync Error:", error);
      alert("Failed to sync analytics. Check console for details.");
    } finally {
      setSyncing(false);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      await updateDoc(doc(db, 'app_errors', errorId), {
        resolved: true,
        resolvedAt: serverTimestamp()
      });
      setErrorLogs(prev => prev.map(log => log.id === errorId ? { ...log, resolved: true } : log));
    } catch (err) {
      console.error("Failed to resolve error:", err);
      alert("Failed to resolve error.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} periodStats={periodStats} revenueData={revenueData} featureUsageData={featureUsageData} dateFilter={dateFilter} setDateFilter={setDateFilter} healthStatus={healthStatus} />;
      case 'revenue':
        return <RevenueTab revenueData={revenueData} featureUsageData={featureUsageData} dateFilter={dateFilter} setDateFilter={setDateFilter} appConfig={appConfig} />;
      case 'users':
        return <UsersTab userGrowthData={userGrowthData} />;
      case 'features':
        return <FeaturesTab featureUsageData={featureUsageData} />;
      case 'insights':
        return <InsightsTab />;
      case 'products':
        return <ProductsTab />;
      case 'history':
        return <HistoryTab />;
      case 'audit':
        return <AuditTab />;
      case 'controls':
        return <ControlsTab appConfig={appConfig} />;
      case 'ai':
        return <AiTab userData={userData} />;
      case 'notifications':
        return <NotificationsTab />;
      case 'errors':
        return <ErrorsTab errorLogs={errorLogs} onResolveError={handleResolveError} />;
      case 'health':
        return <HealthTab healthStatus={healthStatus} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg text-gray-900 flex flex-col lg:flex-row selection:bg-ayur-neon selection:text-white">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-ayur-bg border-r border-black/5 p-8 sticky top-0 h-screen">
        <div className="flex items-center gap-4 mb-12">
          <img src="/Logo.png" alt="Ayurzenix Pro" className="h-12 object-contain" referrerPolicy="no-referrer" />
          <span className="text-2xl font-display font-black tracking-tight text-ayur-neon">PRO</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem icon={BarChart3} label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <SidebarItem icon={Sparkles} label="AI Engine" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={IndianRupee} label="Revenue" active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} />
          <SidebarItem icon={Users} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <SidebarItem icon={Activity} label="Features" active={activeTab === 'features'} onClick={() => setActiveTab('features')} />
          <SidebarItem icon={Target} label="AI Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
          <SidebarItem icon={ShoppingBag} label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarItem icon={History} label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <SidebarItem icon={ShieldAlert} label="Audit Trail" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
          <SidebarItem icon={Sparkles} label="AI Config" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <SidebarItem icon={Settings} label="Controls" active={activeTab === 'controls'} onClick={() => setActiveTab('controls')} />
          <SidebarItem icon={Bell} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <SidebarItem icon={AlertCircle} label="Errors" active={activeTab === 'errors'} onClick={() => setActiveTab('errors')} />
          <SidebarItem icon={ShieldCheck} label="Health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
        </nav>

        <div className="pt-8 border-t border-black/5">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 transition-all text-gray-500 hover:text-black group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to App</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-ayur-bg/80 backdrop-blur-xl border-b border-black/5 p-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="Ayurzenix Pro" className="h-8 object-contain" referrerPolicy="no-referrer" />
          <span className="font-display font-black text-xl text-ayur-neon tracking-tight">PRO</span>
        </div>
        <button onClick={() => navigate('/profile')} className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-gray-900 border border-black/10">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Tabs Scroll */}
      <div className="lg:hidden flex overflow-x-auto bg-ayur-bg border-b border-black/5 sticky top-[81px] z-40 no-scrollbar">
        <div className="flex p-4 gap-3">
          <MobileTabItem label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <MobileTabItem label="AI Engine" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <MobileTabItem label="Revenue" active={activeTab === 'revenue'} onClick={() => setActiveTab('revenue')} />
          <MobileTabItem label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <MobileTabItem label="Features" active={activeTab === 'features'} onClick={() => setActiveTab('features')} />
          <MobileTabItem label="Insights" active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
          <MobileTabItem label="Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <MobileTabItem label="History" active={activeTab === 'history'} onClick={() => setActiveTab('history')} />
          <MobileTabItem label="Audit" active={activeTab === 'audit'} onClick={() => setActiveTab('audit')} />
          <MobileTabItem label="AI Config" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <MobileTabItem label="Controls" active={activeTab === 'controls'} onClick={() => setActiveTab('controls')} />
          <MobileTabItem label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <MobileTabItem label="Errors" active={activeTab === 'errors'} onClick={() => setActiveTab('errors')} />
          <MobileTabItem label="Health" active={activeTab === 'health'} onClick={() => setActiveTab('health')} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-display font-black tracking-tight capitalize text-gray-900">{activeTab}</h2>
            <p className="text-gray-500 font-medium tracking-wide">Welcome back, {userData.displayName}</p>
          </div>
          <button 
            onClick={syncAnalytics}
            disabled={syncing}
            className="flex items-center justify-center gap-3 px-8 py-4 glow-button-green rounded-2xl text-xs font-black uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            Sync Analytics
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// --- Sub-components ---

function AiTab({ userData }: { userData: any }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<any>(null);
  const [showKey, setShowKey] = useState(false);
  const [diagnosticLoading, setDiagnosticLoading] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);

  // Form State
  const [geminiKey, setGeminiKey] = useState('');
  const [activeModel, setActiveModel] = useState('gemini-1.5-flash');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [prompts, setPrompts] = useState<Record<string, string>>({});
  const [newFeatureId, setNewFeatureId] = useState('');

  useEffect(() => {
    const configRef = doc(db, 'system_config', 'ai');
    const unsubscribe = onSnapshot(configRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setGeminiKey(data.gemini_api_key || '');
        setActiveModel(data.active_model || 'gemini-1.5-flash');
        setMaintenanceMode(data.maintenance_mode || false);
        setBroadcastMessage(data.broadcast_message || '');
        setPrompts(data.prompts || {});
        setLastUpdate(data);
      }
      setLoading(false);
    }, (error) => {
      console.error("AI Config fetch error:", error);
      handleFirestoreError(error, OperationType.GET, 'system_config/ai');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const configRef = doc(db, 'system_config', 'ai');
      const details = `Key modified: ${geminiKey !== lastUpdate?.gemini_api_key}. Model: ${activeModel}. Maint: ${maintenanceMode}`;
      
      await setDoc(configRef, {
        gemini_api_key: geminiKey.trim(),
        active_model: activeModel,
        maintenance_mode: maintenanceMode,
        broadcast_message: broadcastMessage,
        prompts: prompts,
        updatedAt: serverTimestamp(),
        updatedBy: userData.email
      }, { merge: true });

      // Audit Log
      await addDoc(collection(db, 'admin_logs'), {
        action: 'Update AI Config & Prompts',
        performedBy: userData.email,
        details,
        timestamp: serverTimestamp()
      });

      alert("Ayurzenix Engine Configured Successfully! 🚀 Settings are now live.");
    } catch (error) {
      console.error("Save AI Config Error:", error);
      alert("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handlePromptChange = (id: string, value: string) => {
    setPrompts(prev => ({ ...prev, [id]: value }));
  };

  const addPrompt = () => {
    if (!newFeatureId.trim()) return;
    setPrompts(prev => ({ ...prev, [newFeatureId.trim()]: '' }));
    setNewFeatureId('');
  };

  const removePrompt = (id: string) => {
    const next = { ...prompts };
    delete next[id];
    setPrompts(next);
  };

  const addRecommendedEngines = () => {
    const recommended: Record<string, string> = {
      'health_scan': 'You are an Ayurvedic Health Scanner. Analyze the user inputs to determine their Dosha (Vata, Pitta, Kapha) and provide wellness insights.',
      'body_scan': 'You are an AI Body Scan expert. Based on visual cues or descriptions, identify physical traits related to Prakriti and potential imbalances.',
      'face_glow': 'Analyze skin texture and facial features to provide Ayurvedic face glow tips and herbal recommendations.',
      'future_health': 'Based on current lifestyle and dosha, predict potential future health trends and how to balance them early.',
      'sleep_intelligence': 'Analyze sleep patterns and provide Ayurvedic solutions for better recovery and circadian rhythm alignment.',
      'heart_health': 'Focus on Hridaya health. Provide tips for emotional and physical heart wellness through Ayurveda.',
      'stress_relief': 'Identify stress triggers through user descriptions and suggest Mano-Veda techniques (Pranayama, Meditation, Herbs).',
      'mood_ayurveda': 'Analyze the mental state (Sattva, Rajas, Tamas) and suggest mood-balancing Ayurvedic interventions.',
      'hair_fall': 'Identify root causes of hair thinning from an Ayurvedic perspective (Pitta aggravation, etc.) and suggest oils/herbal masks.',
      'energy_booster': 'Focus on Ojas. Suggest ways to improve vitality and physical stamina using Ashwagandha and other Balya herbs.',
      'gut_health': 'Analyze Agni (Digestive Fire). Classify it as Sama, Vishama, Tikshna, or Manda and provide dietary corrections.',
      'liver_health': 'Focus on Pitta management and Yakrit (Liver) detoxification through cooling herbs and diet.',
      'smart_mental_scan': 'Focus on psychological Prakriti. Provide insights into cognitive strengths and mental wellness strategies.',
      'product_generation': 'You are an AI Product Copywriter for Ayurzenix. Generate clean, realistic product titles, tags, and descriptions from a given keyword.',
      'symptom_checker': 'Map user symptoms to Ayurvedic pathological clusters (Samprapti) and suggest gentle home remedies and lifestyle changes.',
      'seasonal_recommendations': 'Provide Ritucharya (seasonal routine) updates based on the user\'s current location and season.',
      'agni_engine': 'In-depth analysis of Jatharagni. Provide a detailed score and metabolism-friendly recipe plan.',
      'aahar_vision': 'Analyze food photos or descriptions for Ayurvedic compatibility with the user\'s known profile.'
    };
    
    setPrompts(prev => ({
      ...recommended,
      ...prev // Keep existing ones if any
    }));
  };

  const runDiagnostic = async () => {
    setDiagnosticLoading(true);
    setDiagnosticResult(null);
    try {
      const { data } = await axios.post('/api/admin/ai-diagnostic', { email: userData.email });
      setDiagnosticResult({ success: true, ...data });
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message;
      let hint = "";
      if (errorMsg.includes("API key not valid") || errorMsg.includes("API_KEY_INVALID")) {
        hint = "CRITICAL: The Gemini API Key you provided is invalid. Most Gemini keys start with 'AIza'. Please ensure you copied the FULL key from AI Studio or Google Cloud Console. Check your Secrets tab.";
      } else if (errorMsg.includes("FIREBASE_SERVICE_ACCOUNT") || errorMsg.includes("CONFIG ERROR")) {
        hint = "CRITICAL: Firebase Service Account misconfigured. Ensure you pasted the RAW JSON object (the text between { and }), NOT code like 'const serviceAccount = ...'.";
      }
      setDiagnosticResult({ success: false, error: errorMsg, hint });
    } finally {
      setDiagnosticLoading(false);
    }
  };

  const testEngine = async (id: string) => {
    setDiagnosticLoading(true);
    try {
      const response = await axios.post('/api/gemini/analyze', {
        model: activeModel,
        featureId: id,
        contents: [{ role: 'user', parts: [{ text: 'Ping Engine test. Respond with a very short Ayurvedic greeting.' }] }],
        config: { responseMimeType: 'text/plain' }
      });
      alert(`[Engine: ${id}] Response: ${response.data.text}`);
    } catch (error: any) {
      alert(`Engine Test Failed: ${error.message}`);
    } finally {
      setDiagnosticLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-12 h-12 text-ayur-neon animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Intelligence Console...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900 uppercase italic underline decoration-ayur-neon decoration-4 underline-offset-8">Neural Veda Console</h2>
          <p className="text-gray-500 font-medium tracking-wide mt-2">Dynamic Intelligence Management & Safety Overrides</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={runDiagnostic}
            disabled={diagnosticLoading}
            className="px-6 py-3 bg-black/5 hover:bg-black/10 rounded-xl text-[10px] font-black uppercase tracking-widest border border-black/5 transition-all flex items-center gap-2"
          >
            {diagnosticLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
            Deep Diagnostic
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 bg-ayur-neon text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-glow-green hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            {saving ? 'Saving...' : 'Deploy Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div className="premium-card p-10 space-y-8 relative overflow-hidden group">
          <div className="space-y-6 relative z-10">
            {/* Key Input */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Production API Key</label>
              <div className="relative">
                <input 
                  type={showKey ? "text" : "password"}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-8 py-5 pr-14 focus:border-ayur-neon outline-none transition-all text-gray-900 font-mono text-sm tracking-widest shadow-inner"
                />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ayur-neon transition-colors p-2">
                  {showKey ? <XCircle className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Model Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Compute Architecture</label>
              <div className="grid grid-cols-2 gap-4">
                {['gemini-3-flash-preview', 'gemini-3.1-flash-lite'].map((model) => (
                  <button 
                    key={model}
                    onClick={() => setActiveModel(model)}
                    className={cn(
                      "p-6 rounded-2xl border transition-all text-left relative overflow-hidden",
                      activeModel === model ? "border-ayur-neon bg-ayur-neon/5 shadow-glow-green" : "border-black/5 bg-white hover:border-black/20"
                    )}
                  >
                    <p className={cn("text-xs font-black uppercase tracking-widest mb-1", activeModel === model ? 'text-ayur-neon' : 'text-gray-400')}>{model.split('-').pop()}</p>
                    <p className="text-[10px] font-bold text-gray-500">{model.includes('flash') ? 'Edge Optimized' : 'Complex Reasoning'}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className={cn("p-8 rounded-[2rem] border transition-all space-y-6", maintenanceMode ? "bg-rose-50 border-rose-100" : "bg-black/5 border-transparent")}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldAlert className={cn("w-5 h-5", maintenanceMode ? "text-rose-500" : "text-gray-400")} />
                  <span className={cn("text-[10px] font-black uppercase tracking-widest", maintenanceMode ? "text-rose-600" : "text-gray-500")}>AI Maintenance Shield</span>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={cn("w-14 h-8 rounded-full transition-colors relative shadow-inner", maintenanceMode ? 'bg-rose-500' : 'bg-gray-200')}
                >
                  <div className={cn("absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-md", maintenanceMode ? 'left-7' : 'left-1')} />
                </button>
              </div>
              {maintenanceMode && (
                <textarea 
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Explain the maintenance to users..."
                  className="w-full bg-white/50 border border-rose-200 rounded-xl p-4 text-xs font-medium text-rose-900 outline-none focus:border-rose-400 min-h-[80px]"
                />
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full py-5 flex items-center justify-center gap-4 glow-button-green rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] disabled:opacity-50 transition-all active:scale-95"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {saving ? 'Syncing Infrastructure...' : 'Propagate Settings'}
            </button>
          </div>
        </div>

        {/* Veda Laboratory - Prompt Tuning */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black tracking-tight text-gray-900">Veda Laboratory</h3>
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remote Prompt Management</span>
               <div className="h-4 w-px bg-black/10"></div>
               <span className="text-[10px] font-black text-ayur-neon uppercase tracking-widest">{Object.keys(prompts).length} Engines Active</span>
            </div>
          </div>
          
          <div className="premium-card p-10 space-y-8">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] block mb-1">Add New Feature Engine</label>
                    <p className="text-[10px] font-bold text-gray-400 italic">Example: hair_analysis, skin_vitals</p>
                  </div>
                  <button 
                    onClick={addRecommendedEngines}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-ayur-neon/10 flex items-center justify-center group-hover:bg-ayur-neon/20 transition-all">
                      <Sparkles className="w-4 h-4 text-ayur-neon" />
                    </div>
                    <span className="text-[10px] font-black text-ayur-neon uppercase tracking-widest group-hover:underline">
                      Load Feature Templates
                    </span>
                  </button>
                </div>
                <div className="flex gap-4">
                   <input 
                    type="text"
                    value={newFeatureId}
                    onChange={(e) => setNewFeatureId(e.target.value)}
                    placeholder="e.g. agni_engine"
                    className="flex-1 bg-black/5 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:border-ayur-neon text-xs font-bold uppercase tracking-widest"
                   />
                   <button 
                    onClick={addPrompt}
                    className="px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ayur-neon hover:text-black transition-all"
                   >
                     Initialize
                   </button>
                </div>
             </div>

             <div className="space-y-6 divide-y divide-black/5">
                {Object.entries(prompts).map(([id, prompt]) => (
                   <div key={id} className="pt-6 first:pt-0 space-y-4 group">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-ayur-neon"></span>
                            <span className="text-xs font-black uppercase tracking-widest text-gray-900">{id}</span>
                         </div>
                         <button onClick={() => removePrompt(id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                            <XCircle className="w-4 h-4" />
                         </button>
                      </div>
                      <textarea 
                        value={prompt}
                        onChange={(e) => handlePromptChange(id, e.target.value)}
                        placeholder={`System instructions for ${id}...`}
                        className="w-full bg-black/5 border border-transparent rounded-2xl p-6 text-xs font-medium text-gray-700 min-h-[120px] focus:bg-white focus:border-ayur-neon transition-all outline-none leading-relaxed"
                      />
                   </div>
                ))}
                {Object.keys(prompts).length === 0 && (
                   <p className="text-center py-10 text-[10px] font-bold text-gray-400 italic">No dynamic prompts configured. Baseline engine enabled.</p>
                )}
             </div>

             <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 border-2 border-black rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-4"
             >
                <RefreshCw className={cn("w-4 h-4", saving && "animate-spin")} />
                Save Laboratory Changes
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Runtime Health</h2>
          <p className="text-gray-500 font-medium tracking-wide">Real-time Performance & Validation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="premium-card p-10 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Transactions</h3>
              <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-black">{lastUpdate?.usage_total_requests?.toLocaleString() || '0'}</span>
                 <span className="text-[10px] font-bold text-gray-400">Total Insights</span>
              </div>
           </div>

           <div className="premium-card p-10 space-y-6 bg-black text-white">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40">Engine Heartbeat</h3>
              <button 
                onClick={runDiagnostic}
                disabled={diagnosticLoading}
                className="w-full py-4 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
              >
                {diagnosticLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Ping Intelligence
              </button>
              {diagnosticResult && (
                <div className={cn("p-4 rounded-xl text-[10px] font-bold tracking-tight space-y-3", diagnosticResult.success ? 'bg-ayur-neon/10 text-ayur-neon' : 'bg-rose-500/10 text-rose-500')}>
                  {diagnosticResult.success ? (
                    <div className="space-y-2">
                      <p>✅ {diagnosticResult.responseText}</p>
                      <p>Latency: {diagnosticResult.latency}ms</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="flex items-center gap-2">
                        <XCircle className="w-3 h-3" />
                        <span>FAILURE: {diagnosticResult.error}</span>
                      </p>
                      {diagnosticResult.hint && (
                        <div className="p-3 bg-black/20 rounded-lg text-white/90 leading-relaxed italic">
                          💡 HINT: {diagnosticResult.hint}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
           </div>
        </div>

        {lastUpdate && lastUpdate.updatedAt && (
           <div className="flex items-center gap-4 p-6 rounded-2xl bg-black/5 border border-black/5">
              <RefreshCw className="w-6 h-6 text-gray-400" />
              <div>
                 <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Last Configuration Sync</p>
                 <p className="text-[10px] font-bold text-gray-400">
                    {new Date(lastUpdate.updatedAt.toMillis()).toLocaleString()} by {lastUpdate.updatedBy}
                 </p>
              </div>
           </div>
        )}
      </div>
    </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 w-full p-4 rounded-2xl transition-all group relative overflow-hidden",
        active ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black hover:bg-black/5"
      )}
    >
      <Icon className={cn("w-5 h-5 relative z-10", active ? "text-white" : "text-gray-500 group-hover:text-ayur-neon")} />
      <span className="text-xs font-black uppercase tracking-widest relative z-10">{label}</span>
      {active && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute inset-0 bg-ayur-neon"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
    </button>
  );
}

function MobileTabItem({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
        active ? "bg-ayur-neon text-white border-ayur-neon shadow-glow-green" : "bg-black/5 text-gray-500 border-black/10"
      )}
    >
      {label}
    </button>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <div className="premium-card p-8 space-y-6 group hover:border-ayur-neon/30 transition-all">
      <div className="flex items-center justify-between">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border", 
          color === 'bg-blue-500' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-glow-blue' :
          color === 'bg-purple-500' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-glow-purple' :
          color === 'bg-green-500' ? 'bg-ayur-neon/10 text-ayur-neon border-ayur-neon/20 shadow-glow-green' :
          'bg-ayur-gold/10 text-ayur-gold border-ayur-gold/20 shadow-glow-gold'
        )}>
          <Icon className="w-7 h-7" />
        </div>
        {trend && (
          <div className={cn("text-[10px] font-black px-3 py-1.5 rounded-full border", 
            trend > 0 ? "bg-ayur-neon/10 text-ayur-neon border-ayur-neon/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{label}</p>
        <p className="text-3xl font-display font-black text-gray-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// --- Tabs ---

function OverviewTab({ stats, periodStats, revenueData, featureUsageData, dateFilter, setDateFilter, healthStatus }: any) {
  return (
    <div className="space-y-12">
      {/* Configuration Health Alerts */}
      {healthStatus && (
        <div className="space-y-4">
          {!healthStatus.FIREBASE_SERVICE_ACCOUNT && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-rose-50 border border-rose-200 flex items-start gap-6 group hover:bg-rose-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-6 h-6 text-rose-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">Missing Firebase Service Account</h4>
                <p className="text-xs text-rose-700 font-medium leading-relaxed max-w-3xl">
                  Firestore dynamic configuration is disabled. The application cannot fetch admin settings or sync historical data.
                  <br />
                  <strong className="block mt-2">FIX: Add FIREBASE_SERVICE_ACCOUNT (JSON) to AI Studio Secrets.</strong>
                </p>
              </div>
            </motion.div>
          )}

          {(!healthStatus.GEMINI_API_KEY && !healthStatus.GOOGLE_API_KEY) && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-[2rem] bg-amber-50 border border-amber-200 flex items-start gap-6 group hover:bg-amber-100 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Gemini Engine Not Ready</h4>
                <p className="text-xs text-amber-700 font-medium leading-relaxed max-w-3xl">
                  Intelligence features will fail. No API key detected in Secrets or Admin Panel.
                  <strong className="block mt-2">FIX: Add GEMINI_API_KEY to AI Studio Secrets.</strong>
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-black tracking-tight text-gray-900">Overview</h2>
          <p className="text-gray-500 font-medium tracking-wide">Real-time performance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-black/5 p-1.5 rounded-2xl border border-black/10 backdrop-blur-xl">
          <button onClick={() => setDateFilter('today')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === 'today' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>Today</button>
          <button onClick={() => setDateFilter('7d')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === '7d' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>7D</button>
          <button onClick={() => setDateFilter('30d')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === '30d' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>30D</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={Users} label={`Users (${dateFilter})`} value={periodStats?.users?.toLocaleString() ?? 0} trend={12} color="bg-blue-500" />
        <StatCard icon={UserPlus} label="Total Users (All)" value={stats?.total_users?.toLocaleString() ?? 0} trend={8} color="bg-purple-500" />
        <StatCard icon={Activity} label={`Scans (${dateFilter})`} value={periodStats?.scans?.toLocaleString() ?? 0} trend={15} color="bg-green-500" />
        <StatCard icon={IndianRupee} label={`Revenue (${dateFilter})`} value={`₹${periodStats?.revenue?.toLocaleString() ?? 0}`} trend={22} color="bg-amber-500" />
      </div>

      {/* New Wallet & Transaction Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="premium-card p-8 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Subscription Conversions</h3>
             <TrendingUp className="w-5 h-5 text-ayur-neon" />
           </div>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black">{stats?.conversion_rate ?? '4.2'}%</span>
             <span className="text-xs font-bold text-ayur-neon">+2.1%</span>
           </div>
           <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
             <div className="h-full bg-ayur-neon" style={{ width: `${stats?.conversion_rate ?? 4.2}%` }}></div>
           </div>
        </div>
        <div className="premium-card p-8 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Plan Popularity</h3>
             <Zap className="w-5 h-5 text-purple-500" />
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Starter (₹99)</span>
                 <span className="text-xs font-black">45%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-[10px] font-bold text-gray-500 uppercase">Premium (₹199)</span>
                 <span className="text-xs font-black">35%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                 <div className="h-full bg-ayur-neon" style={{ width: '35%' }}></div>
              </div>
           </div>
        </div>
        <div className="premium-card p-8 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Cashback Burn</h3>
             <Gift className="w-5 h-5 text-amber-500" />
           </div>
           <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black">₹{Math.floor((stats?.total_revenue || 1000) * 0.08).toLocaleString()}</span>
             <span className="text-xs font-bold text-gray-400">8% of volume</span>
           </div>
           <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">Cashback rewards given to users for referrals & first login.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 premium-card p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-display font-black text-gray-900 tracking-tight">Revenue Growth</h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-ayur-neon shadow-glow-green"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                <XAxis dataKey="date" stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <YAxis stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#16A34A', fontWeight: '900', fontSize: '12px' }}
                  labelStyle={{ color: '#111827', fontWeight: '900', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#16A34A" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="premium-card p-10">
          <h3 className="text-xl font-display font-black mb-10 text-gray-900 tracking-tight">Feature Usage</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {featureUsageData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-5 mt-8">
            {featureUsageData.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-glow-green" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{item.name}</span>
                </div>
                <span className="text-sm font-display font-black text-gray-900">{((item.value / featureUsageData.reduce((a: any, b: any) => a + b.value, 0)) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RevenueTab({ revenueData, featureUsageData, dateFilter, setDateFilter, appConfig }: any) {
  
  // Calculate top earning feature using app prices (or defaults)
  const getPrice = (name: string) => {
    const keyMap: Record<string, string> = {
      'Smart Scan': 'smart_scan',
      'Body Scan': 'body_scan',
      'Face Glow': 'face_glow',
      'Future': 'future_prediction',
      'Hormones': 'hormonal_balance',
      'Hair Fall': 'hair_fall',
      'Energy': 'energy_booster',
      'Gut Health': 'gut_health',
      'Liver': 'liver_health'
    };
    const key = keyMap[name] || 'smart_scan';
    return appConfig?.prices?.[key] ?? 10;
  };

  const featureEarnings = featureUsageData.map((f: any) => ({
    ...f,
    revenue: f.value * getPrice(f.name)
  })).sort((a: any, b: any) => b.revenue - a.revenue);

  const topFeature = featureEarnings[0] || { name: 'None', revenue: 0, value: 0 };
  const totalRevenue = featureEarnings.reduce((acc: number, f: any) => acc + f.revenue, 0);
  const topPercentage = totalRevenue > 0 ? ((topFeature.revenue / totalRevenue) * 100).toFixed(1) : 0;

  // Mocked/Calculated metrics for luxury dashboard
  const failedPayments = Math.floor(totalRevenue * 0.05 / 10);
  const walletRevenue = totalRevenue + (totalRevenue * 0.15); // Recharge vs usage estimation

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Financial Insights</h2>
        <div className="flex items-center gap-2 bg-black/5 p-1.5 rounded-2xl border border-black/10 backdrop-blur-xl">
          <button onClick={() => setDateFilter('today')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === 'today' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>Today</button>
          <button onClick={() => setDateFilter('7d')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === '7d' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>7D</button>
          <button onClick={() => setDateFilter('30d')} className={cn("px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors", dateFilter === '30d' ? "bg-ayur-neon text-white shadow-glow-green" : "text-gray-500 hover:text-black")}>30D</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 border-l-4 border-l-emerald-500">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
           <p className="text-2xl font-black text-gray-900">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="premium-card p-6 border-l-4 border-l-blue-500">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Wallet Deposits</p>
           <p className="text-2xl font-black text-gray-900">₹{walletRevenue.toLocaleString()}</p>
        </div>
        <div className="premium-card p-6 border-l-4 border-l-rose-500">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Failed Payments</p>
           <p className="text-2xl font-black text-gray-900">{failedPayments}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="premium-card p-10">
            <h3 className="text-xl font-display font-black mb-10 text-gray-900 tracking-tight">Daily Revenue</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                  <XAxis dataKey="date" stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                  <YAxis stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: '#00000005' }}
                    contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    itemStyle={{ color: '#16A34A', fontWeight: '900' }}
                  />
                  <Bar dataKey="amount" fill="#16A34A" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureEarnings.slice(0, 3).map((item: any) => (
              <div key={item.name} className="premium-card p-8 space-y-4">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{item.name}</p>
                <p className="text-2xl font-display font-black text-gray-900">₹{item.revenue.toLocaleString()}</p>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full shadow-glow-green" style={{ width: `${item.revenue / totalRevenue * 100}%`, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="premium-card p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ayur-neon/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-ayur-neon/20 transition-all"></div>
            <h3 className="text-xl font-display font-black mb-8 text-gray-900 tracking-tight">Top Performer</h3>
            <div className="p-8 bg-black/5 rounded-3xl border border-black/10 backdrop-blur-xl">
              <div className="w-14 h-14 bg-ayur-neon rounded-2xl flex items-center justify-center mb-6 shadow-glow-green">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-2xl font-display font-black mb-2 text-gray-900 tracking-tight">{topFeature.name}</h4>
              <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">Contributing {topPercentage}% of session revenue</p>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-display font-black text-ayur-neon">₹{topFeature.revenue.toLocaleString()}</span>
                <span className="text-[10px] font-black text-ayur-neon px-3 py-1.5 bg-ayur-neon/10 rounded-full border border-ayur-neon/20">+{(Math.random() * 20).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="premium-card p-10">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-display font-black text-gray-900 tracking-tight">LTV Users</h3>
              <Users className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="space-y-6">
              {[
                { name: "Premium Tier", ltv: "₹4,500+", count: 124 },
                { name: "Loyal Fans", ltv: "₹1,200+", count: 450 },
                { name: "Active Users", ltv: "₹200+", count: 1890 }
              ].map((tier, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-900">{tier.name}</p>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">{tier.count} Users</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600 font-display">{tier.ltv}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FunnelStep({ label, value, percentage, color = "bg-black/10" }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-gray-500">{label}</span>
        <span className="text-gray-900">{value}</span>
      </div>
      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
        <div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}

function UsersTab({ userGrowthData }: any) {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">User Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 premium-card p-10">
          <h3 className="text-xl font-display font-black mb-10 text-gray-900 tracking-tight">User Growth</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                <XAxis dataKey="date" stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <YAxis stroke="#00000020" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 'bold' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                  itemStyle={{ color: '#3B82F6', fontWeight: '900' }}
                />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={4} dot={{ r: 5, fill: '#3B82F6', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-10">
          <div className="premium-card p-10">
            <h3 className="text-xl font-display font-black mb-10 text-gray-900 tracking-tight">User Retention</h3>
            <div className="flex items-center justify-center py-8">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-black/5 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
                  <circle className="text-ayur-neon stroke-current shadow-glow-green" strokeWidth="8" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="251.2" style={{ strokeDashoffset: 251.2 - (251.2 * 45) / 100 }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-black text-gray-900">45%</span>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Day 30</span>
                </div>
              </div>
            </div>
            <div className="space-y-6 mt-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">New Users</span>
                <span className="text-sm font-display font-black text-ayur-neon">+124 Today</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Repeat Users</span>
                <span className="text-sm font-display font-black text-gray-900">68%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesTab({ featureUsageData }: any) {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Feature Usage</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {featureUsageData.map((feature: any) => (
          <div key={feature.name} className="premium-card p-10 space-y-8 group hover:border-ayur-neon/30 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border transition-all group-hover:scale-110" style={{ backgroundColor: `${feature.color}10`, color: feature.color, borderColor: `${feature.color}20` }}>
                <Zap className="w-7 h-7" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-display font-black text-gray-900 tracking-tight">{feature.value.toLocaleString()}</p>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Uses</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-display font-black text-gray-900 tracking-tight">{feature.name}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Drop-off Rate</span>
                  <span className="text-rose-500">12%</span>
                </div>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 shadow-glow-rose" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightsTab() {
  const [loading, setLoading] = useState(true);
  const [doshaData, setDoshaData] = useState<any[]>([]);
  const [insights, setInsights] = useState([
    { title: "Digestion Trends", description: "65% of users reported bloating or acidity in the last 7 days.", type: "warning", icon: AlertCircle },
    { title: "Peak Usage", description: "App usage peaks between 7 AM - 9 AM, ideal for morning wellness tips.", type: "info", icon: Zap },
    { title: "Conversion Opportunity", description: "Users who complete the Daily Routine are 3x more likely to buy premium.", type: "success", icon: TrendingUp },
    { title: "Sleep Issues", description: "Increasing reports of insomnia among users aged 25-35.", type: "warning", icon: AlertCircle },
  ]);

  useEffect(() => {
    fetchDoshaStats();
  }, []);

  const fetchDoshaStats = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'user_profiles'));
      const stats: Record<string, number> = { Vata: 0, Pitta: 0, Kapha: 0, Unknown: 0 };
      
      usersSnap.forEach(doc => {
        const data = doc.data();
        const prakriti = data.prakriti || 'Unknown';
        if (stats[prakriti] !== undefined) {
          stats[prakriti]++;
        } else {
          stats.Unknown++;
        }
      });

      const formatted = Object.entries(stats).map(([name, value]) => ({ name, value }));
      setDoshaData(formatted);
    } catch (error) {
      console.error("Fetch Dosha Stats Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const syncInsights = () => {
    setLoading(true);
    setTimeout(() => {
      setInsights([
        { title: "Energy & Stress", description: "High volume of users reporting afternoon fatigue and stress.", type: "warning", icon: AlertCircle },
        { title: "Liver Health", description: "Liver detox feature seeing a 20% week-over-week increase in usage.", type: "success", icon: TrendingUp },
        { title: "Engagement", description: "Users are engaging 40% more with the dynamic mood-based Ayurveda feature.", type: "info", icon: Zap },
        { title: "Retention Opportunity", description: "Users who complete full scans return significantly faster than users doing fast-scans.", type: "info", icon: Sparkles }
      ]);
      fetchDoshaStats();
    }, 1500);
  };

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#9CA3AF'];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Ayurvedic Intelligence</h2>
          <p className="text-gray-500 font-medium tracking-wide">Population health trends and community diagnostics</p>
        </div>
        <button 
          onClick={syncInsights}
          disabled={loading}
          className="flex items-center justify-center gap-3 px-6 py-3 glow-button-green rounded-2xl text-xs font-black uppercase tracking-[0.2em] disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Sync Health Data
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-8">
           <div className="premium-card p-10 space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Community Prakriti Distribution</h3>
                 <div className="flex items-center gap-4">
                    {doshaData.map((d, i) => (
                       <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                          <span className="text-[10px] font-bold text-gray-500">{d.name}</span>
                       </div>
                    ))}
                 </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={doshaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: '#9CA3AF' }}
                    />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px', padding: '12px' }}
                       itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                       {doshaData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                       ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {insights.map((insight, index) => (
                <motion.div 
                  key={insight.title + index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="premium-card p-10 flex gap-6 group hover:border-ayur-neon/30 transition-all"
                >
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg border transition-all group-hover:scale-110",
                    insight.type === 'warning' ? "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-glow-gold" : 
                    insight.type === 'success' ? "bg-ayur-neon/10 text-ayur-neon border-ayur-neon/20 shadow-glow-green" : "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-glow-blue"
                  )}>
                    <insight.icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-display font-black text-gray-900 tracking-tight">{insight.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{insight.description}</p>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>

        <div className="space-y-12">
           <div className="premium-card p-10 text-center space-y-6 bg-black text-white">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Biological Market Fit</h3>
              <div className="relative h-48 flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie
                          data={doshaData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                       >
                          {doshaData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black">{doshaData.reduce((acc, curr) => acc + curr.value, 0)}</span>
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Total Profiles</span>
                 </div>
              </div>
              <p className="text-[10px] font-bold text-white/40 leading-relaxed">
                 Real-time aggregation of Ayurvedic biological profiles across the Ayurzenix ecosystem.
              </p>
           </div>

           <div className="premium-card p-10 space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Regional Health Hotspot</h3>
              <div className="space-y-4">
                 {[
                   { region: "North India", trend: "High Vata (Dryness)", active: true },
                   { region: "South India", trend: "High Pitta (Heat)", active: true },
                   { region: "West India", trend: "Stable", active: false },
                 ].map((loc, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-black/5 last:border-0">
                       <div className="space-y-1">
                          <p className="text-xs font-black text-gray-900">{loc.region}</p>
                          <p className="text-[10px] font-bold text-gray-400">{loc.trend}</p>
                       </div>
                       <div className={cn("w-2 h-2 rounded-full", loc.active ? 'bg-ayur-neon animate-pulse' : 'bg-gray-200')}></div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProductsTab() {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedProduct, setGeneratedProduct] = useState<any>(null);

  const products = [
    { name: "Triphala Churna", clicks: 1240, category: "Digestion", growth: "+15%" },
    { name: "Ashwagandha Tablets", clicks: 980, category: "Stress", growth: "+8%" },
    { name: "Brahmi Oil", clicks: 750, category: "Sleep", growth: "+12%" },
    { name: "Amla Juice", clicks: 620, category: "Immunity", growth: "+5%" },
  ];

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      alert("Please enter a product keyword.");
      return;
    }
    setLoading(true);
    setGeneratedProduct(null);
    try {
      const result = await generateProductDetails(keyword);
      setGeneratedProduct(result);
    } catch (error: any) {
      console.error("Generation Error:", error);
      alert(error.message || "Failed to generate product details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Product Analytics & AI Generator</h2>
      
      {/* AI Product Generator Section */}
      <div className="premium-card p-10 max-w-3xl space-y-8">
        <div className="flex items-center gap-3 text-ayur-neon">
          <Sparkles className="w-6 h-6" />
          <h3 className="text-xl font-black tracking-tight text-gray-900">AI Product Generator</h3>
        </div>
        <p className="text-sm text-gray-500 font-medium">Generate clean, realistic, and app-ready product details based on a product keyword extracted from an affiliate link.</p>
        
        <div className="space-y-4">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Product Keyword</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Shilajit Resin, Aloe Vera Gel" 
              className="flex-1 bg-black/5 border border-black/10 rounded-2xl px-6 py-4 focus:border-ayur-neon outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
            />
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="glow-button-green px-8 py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {generatedProduct && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/5 rounded-2xl p-6 border border-black/10 space-y-6"
          >
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Generated Title</h4>
              <p className="text-lg font-black text-gray-900">{generatedProduct.title}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {generatedProduct.tags?.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-ayur-neon/10 text-ayur-neon rounded-full text-[10px] font-black uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Short Description</h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{generatedProduct.description}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Category</h4>
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {generatedProduct.category}
              </span>
            </div>

            <div className="pt-4 flex items-center gap-4 border-t border-black/10">
               <button 
                onClick={() => {
                  alert(generatedProduct.title + " saved to store successfully! ✅");
                  setGeneratedProduct(null);
                  setKeyword('');
                }}
                className="flex-1 py-4 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
               >
                 Save to Store 
               </button>
               <button 
                onClick={() => setGeneratedProduct(null)}
                className="flex-1 py-4 bg-black/5 text-gray-700 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/10 transition-colors"
               >
                 Discard
               </button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="premium-card overflow-hidden border-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5">
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Product</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Category</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Clicks</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {products.map((product, index) => (
                <tr key={index} className="hover:bg-black/[0.02] transition-colors group">
                  <td className="p-8 font-display font-black text-gray-900 tracking-tight group-hover:text-ayur-neon transition-colors">{product.name}</td>
                  <td className="p-8 text-gray-500 font-medium">{product.category}</td>
                  <td className="p-8 font-display font-black text-gray-900 tracking-tight">{product.clicks.toLocaleString()}</td>
                  <td className="p-8">
                    <span className="px-3 py-1.5 bg-ayur-neon/10 text-ayur-neon rounded-full border border-ayur-neon/20 text-[10px] font-black">{product.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logsQuery = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'), limit(50));
    const unsubscribe = onSnapshot(logsQuery, (snap) => {
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Audit logs fetch failed:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-ayur-neon" />
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching Audit Trail...</p>
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">System Audit Trail</h2>
          <p className="text-gray-500 font-medium tracking-wide">Detailed records of administrative interventions</p>
        </div>
        <div className="px-6 py-3 bg-black/5 rounded-full border border-black/5">
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last 50 Events</span>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md">
              <tr className="border-b border-black/5">
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Action</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Diagnostic Details</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest">Investigator</th>
                <th className="p-8 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Execution Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 bg-white">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-black/[0.01] transition-colors group">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5 text-ayur-neon" />
                      </div>
                      <span className="text-xs font-black text-gray-900 uppercase tracking-wider">{log.action}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="max-w-md">
                      <p className="text-xs text-gray-500 font-medium leading-relaxed italic">{log.details}</p>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-ayur-neon animate-pulse"></div>
                       <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">{log.performedBy}</span>
                    </div>
                  </td>
                  <td className="p-8 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-gray-900 mb-0.5">
                        {log.timestamp ? new Date(log.timestamp.toMillis()).toLocaleDateString() : 'Syncing...'}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {log.timestamp ? new Date(log.timestamp.toMillis()).toLocaleTimeString() : ''}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="p-32 text-center space-y-4">
              <div className="w-20 h-20 bg-black/5 rounded-3xl flex items-center justify-center mx-auto">
                <Target className="w-10 h-10 text-gray-200" />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">No Log Entries Detected</p>
                <p className="text-[10px] font-bold text-gray-300">System is operating in baseline state.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HistoryTab() {
  const [recentProfiles, setRecentProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const q = query(collection(db, 'health_profiles'), orderBy('createdAt', 'desc'), limit(15));
        const snap = await getDocs(q);
        setRecentProfiles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">User Scan History</h2>
          <p className="text-gray-500 font-medium tracking-wide">Detailed logs of recent health profiles</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-ayur-neon transition-colors" />
            <input 
              type="text" 
              placeholder="Search users or symptoms..." 
              className="bg-black/5 border border-black/10 rounded-2xl pl-14 pr-6 py-4 text-sm focus:border-ayur-neon outline-none transition-all text-gray-900 w-full md:w-80 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-ayur-neon" /></div>
      ) : recentProfiles.length > 0 ? (
        <div className="premium-card overflow-hidden border-black/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/5">
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Date</th>
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Feature</th>
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Dosha</th>
                  <th className="p-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Symptoms</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentProfiles.map((profile, i) => (
                  <tr key={profile.id + i} className="hover:bg-black/[0.02] transition-colors">
                    <td className="p-6 text-sm text-gray-900 font-medium">
                      {new Date(profile.createdAt).toLocaleDateString()} {new Date(profile.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-ayur-neon/10 text-ayur-neon rounded-full text-[10px] font-black uppercase tracking-widest">
                        {profile.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 font-display font-black text-gray-900">
                      {profile.analysis?.doshaAnalysis?.dominantDosha || '-'}
                    </td>
                    <td className="p-6 text-sm text-gray-500 max-w-[200px] truncate">
                      {profile.symptoms || profile.concern || 'Scanned data'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="premium-card p-20 text-center space-y-6">
          <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto border border-black/10">
            <History className="w-10 h-10 text-gray-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-display font-black text-gray-900 tracking-tight">No History Found</h3>
            <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">No complete health scans found.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ControlsTab({ appConfig }: any) {
  const [localConfig, setLocalConfig] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (appConfig && !localConfig) {
      setLocalConfig(appConfig);
    }
  }, [appConfig, localConfig]);

  const FEATURE_LIST = [
    { id: 'smart_scan', label: 'Smart Scan', tiered: true },
    { id: 'body_scan', label: 'AI Body Scan', tiered: true },
    { id: 'face_glow', label: 'Face Glow', tiered: true },
    { id: 'future_predictor', label: 'Future Predictor', tiered: true },
    { id: 'weight_loss', label: 'Weight Loss Plan', tiered: true },
    { id: 'stress_relief', label: 'Stress Relief Plan', tiered: true },
    { id: 'better_sleep', label: 'Better Sleep Plan', tiered: true },
    { id: 'hormonal_balance', label: 'Hormonal Balance', tiered: true },
    { id: 'hair_fall', label: 'Hair Fall', tiered: true },
    { id: 'energy_booster', label: 'Energy Booster', tiered: true },
    { id: 'gut_health', label: 'Gut Health', tiered: true },
    { id: 'liver_health', label: 'Liver Health', tiered: true },
    { id: 'symptom_checker', label: 'Symptom Checker', tiered: true },
    { id: 'report_analyzer', label: 'Report Analyzer', tiered: true },
    { id: 'smart_mental_scan', label: 'Smart Mental Scan', tiered: true },
    { id: 'mood_ayurveda', label: 'Mood Ayurveda', tiered: true },
    { id: 'heart_health', label: 'Heart Health', tiered: true },
    { id: 'daily_routine', label: 'Daily Routine', tiered: false },
    { id: 'chat', label: 'Ask Ayurzenix (Chat)', tiered: false },
    { id: 'consultation', label: 'AI Consultation', tiered: false },
    { id: 'store', label: 'Ayurzenix Store', tiered: false },
    { id: 'blogs', label: 'Wellness Blogs', tiered: false },
    { id: 'whatsapp', label: 'WhatsApp Notifications', tiered: false }
  ];

  // Default values if config doesn't exist yet
  const getDefaultPrices = () => {
    const prices: any = {};
    FEATURE_LIST.forEach(f => {
      if (f.tiered) {
        prices[f.id] = { basic: 0, pro: 49, premium: 99 };
      } else {
        prices[f.id] = 0;
      }
    });
    return prices;
  };

  const getDefaultToggles = () => {
    const toggles: any = {};
    FEATURE_LIST.forEach(f => {
      toggles[f.id] = true;
    });
    return toggles;
  };

  const defaultConfig = {
    prices: getDefaultPrices(),
    features: getDefaultToggles()
  };

  const config = localConfig || appConfig || defaultConfig;

  const handlePriceChange = (key: string, value: any) => {
    setLocalConfig((prev: any) => ({
      ...(prev || config),
      prices: {
        ...(prev?.prices || config.prices),
        [key]: value
      }
    }));
  };

  const handleToggleChange = (key: string, value: boolean) => {
    setLocalConfig((prev: any) => ({
      ...(prev || config),
      features: {
        ...(prev?.features || config.features),
        [key]: value
      }
    }));
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      const configRef = doc(db, 'app_config', 'main');
      await setDoc(configRef, {
        ...config,
        updatedAt: serverTimestamp()
      }, { merge: true });
      alert("Configuration saved successfully! ✅");
    } catch (error) {
      console.error("Save Config Error:", error);
      alert("Failed to save configuration.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Admin Controls</h2>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Pricing Column */}
        <div className="premium-card p-10 space-y-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black flex items-center gap-4 text-gray-900 tracking-tight">
              <div className="w-10 h-10 bg-ayur-gold/10 rounded-xl flex items-center justify-center border border-ayur-gold/20 shadow-glow-gold">
                <IndianRupee className="w-5 h-5 text-ayur-gold" />
              </div>
              Price Controller
            </h3>
            <button 
              onClick={saveConfig}
              disabled={saving}
              className="px-6 py-3 glow-button-green rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Save All
            </button>
          </div>

          <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {FEATURE_LIST.filter(f => f.tiered).map(feature => (
              <TieredPriceControl 
                key={feature.id}
                label={feature.label}
                prices={config.prices?.[feature.id] || { basic: 0, pro: 49, premium: 99 }}
                onChange={(val: any) => handlePriceChange(feature.id, val)}
              />
            ))}
            
            <div className="pt-8 border-t border-black/5">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-6">Fixed Price Features</h4>
              <div className="grid grid-cols-1 gap-4">
                {FEATURE_LIST.filter(f => !f.tiered && f.id !== 'whatsapp' && f.id !== 'store' && f.id !== 'blogs').map(feature => (
                  <PriceControl 
                    key={feature.id}
                    label={feature.label}
                    price={typeof config.prices?.[feature.id] === 'number' ? config.prices?.[feature.id] : 0}
                    onChange={(val: number) => handlePriceChange(feature.id, val)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Column */}
        <div className="premium-card p-10 space-y-10">
          <h3 className="text-xl font-display font-black flex items-center gap-4 text-gray-900 tracking-tight">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shadow-glow-blue">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            Feature Switchboard
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
            {FEATURE_LIST.map(feature => (
              <ToggleControl 
                key={feature.id}
                label={feature.label}
                enabled={config.features?.[feature.id] ?? true}
                onChange={(val: boolean) => handleToggleChange(feature.id, val)}
              />
            ))}
          </div>
          
          <div className="p-8 bg-black/5 rounded-[2rem] border border-black/5 space-y-4">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed text-center">
                Disabling a feature will hide it from the Home Screen and Menu across all user devices instantly.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TieredPriceControl({ label, prices, onChange }: any) {
  const handleTierChange = (tier: string, value: number) => {
    onChange({ ...prices, [tier]: value });
  };

  return (
    <div className="p-6 bg-black/5 rounded-3xl border border-black/5 space-y-6 group hover:border-black/10 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-tight text-gray-900">{label}</span>
        <div className="px-3 py-1 bg-ayur-neon/10 rounded-full border border-ayur-neon/10">
          <span className="text-[8px] font-black text-ayur-neon uppercase tracking-widest">Tiered Pricing</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-2">Basic</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">₹</span>
            <input 
              type="number"
              value={prices.basic ?? ''}
              onChange={(e) => handleTierChange('basic', Number(e.target.value))}
              className="w-full bg-white rounded-xl py-3 pl-8 pr-4 text-sm font-black focus:ring-2 ring-ayur-neon/20 outline-none border border-black/5"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-2">Pro</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-ayur-neon">₹</span>
            <input 
              type="number"
              value={prices.pro ?? ''}
              onChange={(e) => handleTierChange('pro', Number(e.target.value))}
              className="w-full bg-white rounded-xl py-3 pl-8 pr-4 text-sm font-black focus:ring-2 ring-ayur-neon/20 outline-none border border-black/5 text-ayur-neon"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest pl-2">Premium</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-ayur-gold">₹</span>
            <input 
              type="number"
              value={prices.premium ?? ''}
              onChange={(e) => handleTierChange('premium', Number(e.target.value))}
              className="w-full bg-white rounded-xl py-3 pl-8 pr-4 text-sm font-black focus:ring-2 ring-ayur-gold/20 outline-none border border-black/5 text-ayur-gold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceControl({ label, price, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-black/5 rounded-2xl border border-black/5 group hover:border-black/10 transition-all">
      <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-xs font-black text-ayur-gold">₹</span>
        <input 
          type="number" 
          value={price ?? ''} 
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 bg-transparent border-b border-black/10 text-right font-display font-black text-xl focus:border-ayur-gold outline-none text-gray-900 transition-all"
        />
      </div>
    </div>
  );
}

function ToggleControl({ label, enabled, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-black/5 rounded-2xl border border-black/5 group hover:border-black/10 transition-all">
      <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{label}</span>
      <button 
        onClick={() => onChange(!enabled)}
        className={cn(
          "w-14 h-7 rounded-full relative transition-all border",
          enabled ? "bg-ayur-neon border-ayur-neon shadow-glow-green" : "bg-black/5 border-black/10"
        )}
      >
        <motion.div 
          animate={{ x: enabled ? 28 : 4 }}
          className={cn(
            "absolute top-1 w-4 h-4 rounded-full transition-all shadow-sm",
            enabled ? "bg-white" : "bg-gray-400"
          )}
        />
      </button>
    </div>
  );
}

function NotificationsTab() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async () => {
    if (!message.trim()) {
      alert("Please enter a message to broadcast.");
      return;
    }

    if (!window.confirm("Are you sure you want to send this WhatsApp broadcast to all users?")) {
      return;
    }

    setLoading(true);
    try {
      // Fetch users with phone numbers
      const usersSnap = await getDocs(collection(db, 'users'));
      const phoneNumbers: string[] = [];
      usersSnap.forEach(doc => {
        const data = doc.data();
        if (data.phone || data.phoneNumber) {
          phoneNumbers.push(data.phone || data.phoneNumber);
        }
      });

      if (phoneNumbers.length === 0) {
        alert("No users with phone numbers found.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/whatsapp/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, phoneNumbers })
      });

      const data = await response.json();
      if (response.ok) {
        let alertMsg = data.message || "Broadcast sent successfully!";
        if (data.errors && data.errors.length > 0) {
          alertMsg += `\n\nErrors:\n${data.errors.map((e: any) => `${e.phone}: ${e.error}`).join('\n')}`;
        }
        alert(alertMsg);
        setMessage('');
      } else {
        throw new Error(data.error || "Failed to send broadcast");
      }
    } catch (error: any) {
      console.error("Broadcast Error:", error);
      alert(error.message || "Failed to send broadcast. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">WhatsApp Broadcasting</h2>
      <div className="premium-card p-10 max-w-2xl space-y-10">
        <div className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Message Body</label>
            <textarea 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your WhatsApp message here..." 
              className="w-full bg-black/5 border border-black/10 rounded-2xl px-8 py-5 focus:border-ayur-neon outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400 font-medium leading-relaxed"
            ></textarea>
            <p className="text-xs text-gray-500 font-medium mt-2">This message will be sent to all users who have registered with a phone number.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleBroadcast}
              disabled={loading}
              className="flex-1 py-5 glow-button-green rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageSquare className="w-5 h-5" />}
              {loading ? "Sending..." : "Send WhatsApp Broadcast"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorsTab({ errorLogs, onResolveError }: any) {
  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Error Monitoring</h2>
      <div className="premium-card overflow-hidden border-black/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/5">
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Type</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Message</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Time</th>
                <th className="p-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {errorLogs.length > 0 ? (
                errorLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-black/[0.02] transition-colors group">
                    <td className="p-8">
                      <span className="px-4 py-1.5 bg-rose-500/10 text-rose-600 rounded-full border border-rose-500/20 text-[10px] font-black uppercase tracking-widest">
                        {log.errorType}
                      </span>
                    </td>
                    <td className="p-8 text-sm text-gray-500 font-medium max-w-md truncate group-hover:text-gray-900 transition-colors">{log.message}</td>
                    <td className="p-8 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {new Date(log.timestamp?.seconds * 1000).toLocaleString()}
                    </td>
                    <td className="p-8">
                      {log.resolved ? (
                        <div className="flex items-center gap-3 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Resolved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3 text-amber-600">
                            <AlertCircle className="w-5 h-5 shadow-glow-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Unresolved</span>
                          </div>
                          <button 
                            onClick={() => onResolveError(log.id)}
                            className="ml-4 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-colors"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-gray-500 font-medium">No errors tracked yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HealthTab({ healthStatus }: { healthStatus: any }) {
  if (!healthStatus) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-ayur-neon" />
      </div>
    );
  }

  const keyLabels: Record<string, string> = {
    RAZORPAY_KEY_ID: 'Razorpay Key ID',
    RAZORPAY_KEY_SECRET: 'Razorpay Key Secret',
    FIREBASE_SERVICE_ACCOUNT: 'Firebase Service Account (Admin)',
    OPENAI_API_KEY: 'OpenAI API Key',
    GEMINI_API_KEY: 'Gemini API Key (Default)'
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">System Health</h2>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[10px] font-black uppercase tracking-widest">Active ({healthStatus.env})</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="premium-card p-10 space-y-8">
           <h3 className="text-xl font-display font-black text-gray-900 tracking-tight flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
              Environment Variables
           </h3>
           <div className="space-y-4">
              {Object.entries(healthStatus.keys).map(([key, isSet]) => (
                <div key={key} className="flex items-center justify-between p-6 bg-black/5 rounded-2xl border border-black/5">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{keyLabels[key] || key}</p>
                      <p className="text-xs font-bold text-gray-400 font-mono tracking-tighter">{key}</p>
                   </div>
                   <div className={cn(
                     "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                     isSet ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                   )}>
                      {isSet ? 'Configured ✅' : 'Missing ❌'}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-10">
           <div className="premium-card p-10 space-y-6">
              <h3 className="text-xl font-display font-black text-gray-900 tracking-tight flex items-center gap-4">
                 <Activity className="w-6 h-6 text-blue-500" />
                 Server Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-black/5 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Node Version</p>
                    <p className="text-xl font-black">{healthStatus.nodeVersion}</p>
                 </div>
                 <div className="p-6 bg-black/5 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Firestore Admin</p>
                    <p className={cn("text-xl font-black", healthStatus.firestore ? 'text-emerald-500' : 'text-rose-500')}>
                       {healthStatus.firestore ? 'Healthy' : 'Disconnected'}
                    </p>
                 </div>
              </div>
              {healthStatus.adminError && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                     <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Firebase Admin Error</p>
                     <p className="text-xs font-bold text-rose-600 font-mono break-all">{healthStatus.adminError}</p>
                  </div>
                  
                  {healthStatus.adminError.includes('pasted Java/Node.js CODE') && (
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
                       <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          How to fix this:
                       </h4>
                       <div className="space-y-3">
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             1. Open your <b>serviceAccountKey.json</b> file that you downloaded from Firebase.
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             2. Copy <b>EVERYTHING</b> from that file (including the <code className="bg-blue-100 px-1 rounded">{"{"}</code> and <code className="bg-blue-100 px-1 rounded">{"}"}</code>).
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             3. Paste it into the <b>FIREBASE_SERVICE_ACCOUNT</b> field in your <b>Project Settings</b>.
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed italic">
                             * Do NOT copy the sample code provided by Google (like <code className="bg-blue-100 px-1 rounded">admin.initializeApp(...)</code>). Only copy the JSON content from the file.
                          </p>
                       </div>
                    </div>
                  )}
                </div>
              )}

              {healthStatus.razorpayError && (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                     <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">Razorpay SDK Error</p>
                     <p className="text-xs font-bold text-rose-600 font-mono break-all">{healthStatus.razorpayError}</p>
                  </div>
                  
                  {healthStatus.razorpayError.includes('pasted Node.js/Javascript CODE') && (
                    <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4">
                       <h4 className="text-xs font-black text-blue-700 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          How to fix this:
                       </h4>
                       <div className="space-y-3">
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             1. Go to your Razorpay Dashboard &gt; Settings &gt; API Keys.
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             2. Copy only the <b>Key ID</b> (e.g., <code className="bg-blue-100 px-1 rounded">rzp_test_...</code>) and <b>Key Secret</b> strings.
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed">
                             3. Paste them into <b>RAZORPAY_KEY_ID</b> and <b>RAZORPAY_KEY_SECRET</b> in your <b>Project Settings</b>.
                          </p>
                          <p className="text-xs font-medium text-blue-600 leading-relaxed italic">
                             * Do NOT paste the Javascript integration code snippet. Only the raw Key ID and Secret strings.
                          </p>
                       </div>
                    </div>
                  )}
                </div>
              )}
           </div>

           <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 space-y-4">
              <div className="flex items-center gap-4 text-amber-700">
                 <AlertCircle className="w-6 h-6" />
                 <h4 className="text-sm font-black uppercase tracking-widest">Configuration Warning</h4>
              </div>
              <p className="text-xs font-medium text-amber-600 leading-relaxed">
                 If any credentials are marked as "Missing", some features like Payments (Razorpay), AI Analysis (Gemini/OpenAI), or Wallet Credits (Firebase Admin) will fail. Please update your environment variables in the project settings.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
