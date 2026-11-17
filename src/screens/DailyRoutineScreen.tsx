import LanguageToggle from '../components/LanguageToggle';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Target, 
  ClipboardList, 
  Sparkles, 
  ChevronRight,
  Loader2,
  Zap,
  Sun,
  Wind,
  Moon
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import LoadingYogi from '../components/LoadingYogi';
import { callGeminiServer } from '../lib/gemini';

const MODELS = {
  BASIC: 'gemini-3-flash-preview',
  COMPLEX: 'gemini-3-flash-preview'
};

const withRetry = async <T,>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === "RESOURCE_EXHAUSTED" || error?.code === 429)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';

interface DailyRoutineScreenProps {
  userData: any;
  appConfig?: any;
}

interface QuizQuestion {
  question: string;
  isAnswered: boolean;
  answer: boolean | null;
}

interface HealthTarget {
  target: string;
  isCompleted: boolean;
}

interface ActionableHabit {
  habit: string;
  isCompleted: boolean;
}

interface RoutineData {
  quiz: QuizQuestion[];
  targets: HealthTarget[];
  tasks: ActionableHabit[];
  yoga_asana?: string;
  drink?: string;
}

import { getFeaturePricing } from '../lib/pricing';

export default function DailyRoutineScreen({ userData, appConfig }: DailyRoutineScreenProps) {
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [loading, setLoading] = useState(true);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showAssessment, setShowAssessment] = useState(true);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState({
    wakeUpTime: '06:00',
    energyLevel: 'Medium',
    mainConcern: 'General Wellness',
    mood: 'Neutral'
  });
  const [natureData, setNatureData] = useState<{ sunrise: string; sunset: string; brahmaMuhurta: string; sandhyaKal: string } | null>(null);
  const [showCustomTaskInput, setShowCustomTaskInput] = useState(false);
  const [customTask, setCustomTask] = useState('');
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    fetchNatureSync();
  }, []);

  const fetchNatureSync = async () => {
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const resp = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
        const { sunrise, sunset } = resp.data.results;
        
        const sunriseDate = new Date(sunrise);
        const sunsetDate = new Date(sunset);
        
        // Brahma Muhurta is approx 96 mins (1.6 hours) before sunrise
        const brahmaDate = new Date(sunriseDate.getTime() - 96 * 60 * 1000);
        // Sandhyakal is approx 48 mins aroud sunset
        const sandhyaDate = new Date(sunsetDate.getTime() - 24 * 60 * 1000);

        setNatureData({
          sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          brahmaMuhurta: brahmaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sandhyaKal: sandhyaDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
    } catch (error) {
      console.error("Nature sync failed:", error);
    }
  };

  const dailyRoutineCost = appConfig?.prices?.daily_routine ?? 0;

  useEffect(() => {
    // Check if user has enough balance to access Daily Routine (if it costs money)
    const isDeveloper = userData?.email === 'Help@ayurzenix.in';
    const isGuest = userData?.is_guest;
    const isPremium = userData?.is_premium;
    const reportsUsed = userData?.subscription?.reportsUsed || 0;
    const planId = userData?.subscription?.planId;
    const limit = planId === 'elite' ? Infinity : (planId === 'premium' ? 5 : (planId === 'starter' ? 3 : 0));
    const hasReportsLeft = isPremium && reportsUsed < limit;
    
    if (dailyRoutineCost > 0 && !isDeveloper && !isGuest && !hasReportsLeft && (userData.free_results_count || 0) <= 0 && (userData.wallet_balance || 0) < dailyRoutineCost) {
      navigate('/wallet', { state: { message: `Insufficient balance for Daily Routine. Please recharge ₹${dailyRoutineCost}.` } });
    }
  }, [userData, navigate, dailyRoutineCost]);

  const today = new Date().toISOString().split('T')[0];
  const bodyScanPricing = getFeaturePricing('body-scan', appConfig);

  useEffect(() => {
    if (userData?.uid) {
      loadDailyRoutine();
    }
  }, [userData?.uid]);

  const loadDailyRoutine = async () => {
    setLoading(true);
    
    if (userData.is_guest) {
      const savedRoutine = localStorage.getItem(`guest_routine_${today}`);
      if (savedRoutine) {
        const data = JSON.parse(savedRoutine);
        setRoutine({
          quiz: data.quiz || [],
          targets: data.targets || [],
          tasks: data.tasks || []
        });
        setProgress(data.progress || 0);
        setStreak(data.streak || 0);
        setShowAssessment(false);
        setLoading(false);
      } else {
        setLoading(false);
      }
      return;
    }

    const routineRef = doc(db, 'users', userData.uid, 'daily_routines', today);
    try {
      const routineSnap = await getDoc(routineRef);

      if (routineSnap.exists()) {
        const data = routineSnap.data();
        setRoutine({
          quiz: data.quiz || [],
          targets: data.targets || [],
          tasks: data.tasks || []
        });
        setProgress(data.progress || 0);
        setStreak(data.streak || 0);
        setShowAssessment(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, routineRef.path);
      setLoading(false);
    }
  };

  const generateAndSaveRoutine = async () => {
    setLoading(true);
    try {
      let currentStreak = 0;

      if (!userData.is_guest) {
        const routinesColRef = collection(db, 'users', userData.uid, 'daily_routines');
        // Calculate streak
        const lastRoutineQuery = query(
          routinesColRef,
          orderBy('date', 'desc'),
          limit(1)
        );
        let lastRoutineSnap;
        try {
          lastRoutineSnap = await getDocs(lastRoutineQuery);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, 'users/daily_routines');
          return; // Exit if we can't get history for streak
        }
        
        if (lastRoutineSnap && !lastRoutineSnap.empty) {
          const lastData = lastRoutineSnap.docs[0].data();
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          
          if (lastData.date === yesterday.toISOString().split('T')[0]) {
            currentStreak = lastData.isCompleted ? lastData.streak : 0;
          } else if (lastData.date === today) {
            currentStreak = lastData.streak;
          }
        }
      }

      const prompt = `Generate a personalized Ayurvedic daily routine for today. 
      User Context:
      - Wake up time: ${assessmentData.wakeUpTime}
      - Current Energy: ${assessmentData.energyLevel}
      - Main Concern: ${assessmentData.mainConcern}
      - Mood: ${assessmentData.mood}

      Daily Routine Concept:
      1. Dinacharya (Vedic Daily Routine)
      2. Ritucharya (Seasonal Routine)
      3. Personalization based on mood and energy.

      Output ONLY a JSON object with:
      - yoga_asana: A recommended posture for today.
      - drink: A herbal drink recommendation.
      - quiz: 3 simple yes/no questions for mental check.
      - targets: 3 specific wellness goals.
      - tasks: 3 actionable rituals.

      Use easy language (mix of Simple English & Hinglish terms if helpful).`;

      const result = await withRetry(() => callGeminiServer(MODELS.BASIC, 
        [{ role: 'user', parts: [{ text: prompt }] }],
        {
          responseMimeType: "application/json",
        }
      ));

      const data = JSON.parse(result.text || '{}');
      
      const newRoutine: RoutineData = {
        quiz: (data.quiz || []).map((q: string) => ({ question: q, isAnswered: false, answer: null })),
        targets: (data.targets || []).map((t: string) => ({ target: t, isCompleted: false })),
        tasks: (data.tasks || []).map((h: string) => ({ habit: h, isCompleted: false })),
        yoga_asana: data.yoga_asana,
        drink: data.drink
      };

      if (userData.is_guest) {
        const guestData = {
          ...newRoutine,
          date: today,
          progress: 0,
          streak: currentStreak,
          isCompleted: false
        };
        localStorage.setItem(`guest_routine_${today}`, JSON.stringify(guestData));
      } else {
        const routineRef = doc(db, 'users', userData.uid, 'daily_routines', today);
        try {
          await setDoc(routineRef, {
            uid: userData.uid,
            date: today,
            ...newRoutine,
            progress: 0,
            streak: currentStreak,
            isCompleted: false,
            createdAt: serverTimestamp()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, routineRef.path);
        }
      }

      setRoutine(newRoutine);
      setProgress(0);
      setStreak(currentStreak);
    } catch (error) {
      console.error("Error generating routine:", error);
      alert("Failed to generate routine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (updatedRoutine: RoutineData) => {
    if (isSaving) return;
    setIsSaving(true);
    
    const total = updatedRoutine.quiz.length + updatedRoutine.targets.length + updatedRoutine.tasks.length;
    const completed = 
      updatedRoutine.quiz.filter(q => q.isAnswered).length +
      updatedRoutine.targets.filter(t => t.isCompleted).length +
      updatedRoutine.tasks.filter(h => h.isCompleted).length;
    
    const newProgress = Math.round((completed / total) * 100);
    const isCompleted = newProgress === 100;
    
    // Update streak if just completed 100%
    let finalStreak = streak;
    if (isCompleted && progress < 100) {
      finalStreak += 1;
      setStreak(finalStreak);
    }

    if (userData.is_guest) {
      const guestData = {
        ...updatedRoutine,
        date: today,
        progress: newProgress,
        streak: finalStreak,
        isCompleted
      };
      localStorage.setItem(`guest_routine_${today}`, JSON.stringify(guestData));
      setProgress(newProgress);
      setIsSaving(false);
      return;
    }

    const routineRef = doc(db, 'users', userData.uid, 'daily_routines', today);
    try {
      await updateDoc(routineRef, {
        ...updatedRoutine,
        progress: newProgress,
        isCompleted,
        streak: finalStreak
      });
      setProgress(newProgress);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, routineRef.path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuizAnswer = (index: number, answer: boolean) => {
    if (!routine) return;
    const newRoutine = { ...routine };
    newRoutine.quiz[index].isAnswered = true;
    newRoutine.quiz[index].answer = answer;
    setRoutine(newRoutine);
    saveProgress(newRoutine);
  };

  const toggleTarget = (index: number) => {
    if (!routine) return;
    const newRoutine = { ...routine };
    newRoutine.targets[index].isCompleted = !newRoutine.targets[index].isCompleted;
    setRoutine(newRoutine);
    saveProgress(newRoutine);
  };

  const toggleTask = (index: number) => {
    if (!routine) return;
    const newRoutine = { ...routine };
    newRoutine.tasks[index].isCompleted = !newRoutine.tasks[index].isCompleted;
    setRoutine(newRoutine);
    saveProgress(newRoutine);
  };

  const addCustomTarget = () => {
    if (!customTask.trim() || !routine) return;
    const newRoutine = { ...routine };
    newRoutine.targets.push({ target: customTask.trim(), isCompleted: false });
    setRoutine(newRoutine);
    setCustomTask('');
    setShowCustomTaskInput(false);
    saveProgress(newRoutine);
  };

  const handleBodyScanAccess = () => {
    navigate('/body-scan');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-6 text-center">
        <LoadingYogi />
        <p className="mt-8 text-lg font-black text-gray-900 tracking-tight">Vedic clock is syncing...</p>
      </div>
    );
  }

  // Assessment UI
  if (showAssessment) {
    const questions = [
      {
        id: 'mood',
        title: 'How are you feeling today?',
        subtitle: 'Aaj aapka mood kaisa hai?',
        options: [
          { label: 'Energetic', icon: '⚡', color: 'border-yellow-200 bg-yellow-50/30' },
          { label: 'Calm', icon: '🧘', color: 'border-blue-200 bg-blue-50/30' },
          { label: 'Tired', icon: '😴', color: 'border-stone-200 bg-stone-50/30' },
          { label: 'Stressed', icon: '🤯', color: 'border-rose-200 bg-rose-50/30' }
        ]
      },
      {
        id: 'energy',
        title: 'Energy Level check',
        subtitle: 'Sharir me kitni takat mehsoos ho rahi hai?',
        options: [
          { label: 'High', icon: '🔥', color: 'border-orange-200 bg-orange-50/30' },
          { label: 'Medium', icon: '🔋', color: 'border-emerald-200 bg-emerald-50/30' },
          { label: 'Low', icon: '🪫', color: 'border-red-200 bg-red-50/30' }
        ]
      },
      {
        id: 'concern',
        title: 'What to focus on today?',
        subtitle: 'Aaj kis chiz pe dhyan dena hai?',
        options: [
          { label: 'Digestion', icon: '🥗', color: 'border-green-200 bg-green-50/30' },
          { label: 'Sleep', icon: '💤', color: 'border-indigo-200 bg-indigo-50/30' },
          { label: 'Stress', icon: '🌊', color: 'border-sky-200 bg-sky-50/30' },
          { label: 'Productivity', icon: '🎯', color: 'border-violet-200 bg-violet-50/30' }
        ]
      }
    ];

    const currentQ = questions[assessmentStep];

    return (
      <div className="min-h-screen bg-white pb-32">
        <div className="px-6 pt-14 pb-8 sticky top-0 z-20 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate(-1)}
              className="w-12 h-12 luxury-glass-button flex items-center justify-center text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="space-y-1">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Daily Setup</h1>
              <div className="flex gap-1">
                {[0, 1, 2].map(s => (
                  <div key={s} className={cn("h-1 rounded-full transition-all duration-500", s === assessmentStep ? "w-8 bg-emerald-500" : "w-4 bg-gray-100")} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 mt-12 space-y-12">
          <motion.div
            key={assessmentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-tight">{currentQ.title}</h2>
              <p className="text-lg font-bold text-gray-400">{currentQ.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {currentQ.options.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => {
                    if (currentQ.id === 'mood') setAssessmentData(prev => ({ ...prev, mood: opt.label }));
                    if (currentQ.id === 'energy') setAssessmentData(prev => ({ ...prev, energyLevel: opt.label }));
                    if (currentQ.id === 'concern') setAssessmentData(prev => ({ ...prev, mainConcern: opt.label }));
                    
                    if (assessmentStep < 2) {
                      setAssessmentStep(assessmentStep + 1);
                    } else {
                      generateAndSaveRoutine();
                      setShowAssessment(false);
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between p-8 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] text-left",
                    opt.color
                  )}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-4xl">{opt.icon}</span>
                    <span className="text-2xl font-black text-gray-900">{opt.label}</span>
                  </div>
                  <ChevronRight className="w-8 h-8 text-gray-300" />
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 selection:bg-emerald-100">
      {/* Header */}
      <div className="px-6 pt-14 pb-8 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 luxury-glass-button flex items-center justify-center text-gray-900"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Today's Flow</h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{today}</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
             <LanguageToggle />
             <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                <span className="text-xl">🔥</span>
                <span className="text-sm font-black text-emerald-700">{streak} Day Streak</span>
             </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-12 pt-8">
        {/* Progress Visualization */}
        <div className="relative p-10 luxury-glass overflow-hidden shadow-luxury">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl -ml-16 -mb-16" />
          
          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="url(#emerald-gradient)"
                  strokeWidth="12"
                  strokeDasharray={440}
                  initial={{ strokeDashoffset: 440 }}
                  animate={{ strokeDashoffset: 440 - (440 * progress) / 100 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-gray-900">{progress}%</span>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Done</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Your Healing Journey</h3>
              <p className="text-sm font-bold text-gray-500">
                {progress === 100 ? "Amazing! Clean slate." : "Aligning your Doshas, one task at a time."}
              </p>
            </div>
          </div>
        </div>

        {/* Vedic Insights (Yoga & Drink) */}
        {(routine?.yoga_asana || routine?.drink) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routine.yoga_asana && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-[2.5rem] border border-purple-100 flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-purple-600 shadow-sm">
                  <Wind className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Yoga of the Day</p>
                  <h4 className="text-xl font-black text-purple-900 leading-tight">{routine.yoga_asana}</h4>
                </div>
              </motion.div>
            )}
            {routine.drink && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-[2.5rem] border border-orange-100 flex items-center gap-6"
              >
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-600 shadow-sm">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Herbal Sip</p>
                  <h4 className="text-xl font-black text-orange-900 leading-tight">{routine.drink}</h4>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Nature Sync Section (Vedic Clock Style) */}
        {natureData && (
          <div className="grid grid-cols-2 gap-4">
             {[
               { label: 'Brahma Muhurta', time: natureData.brahmaMuhurta, icon: Sparkles, color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
               { label: 'Sunrise', time: natureData.sunrise, icon: Sun, color: 'bg-orange-50 border-orange-100 text-orange-600' },
               { label: 'Sandhya Kal', time: natureData.sandhyaKal, icon: Wind, color: 'bg-sky-50 border-sky-100 text-sky-600' },
               { label: 'Sunset', time: natureData.sunset, icon: Moon, color: 'bg-blue-50 border-blue-100 text-blue-600' },
             ].map((item, i) => (
               <div key={i} className={cn("p-6 rounded-[2rem] border-2 space-y-3", item.color)}>
                 <div className="flex items-center justify-between">
                    <item.icon className="w-6 h-6" />
                    <span className="text-sm font-black tracking-tight">{item.time}</span>
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-widest leading-none">{item.label}</p>
               </div>
             ))}
          </div>
        )}

        <div className="space-y-12">
          {/* Quiz Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Daily Awareness</h3>
            </div>
            <div className="space-y-6">
              {routine?.quiz.map((q, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="luxury-glass p-8 space-y-6 border border-gray-100"
                >
                  <p className="text-xl font-black text-gray-900 leading-snug tracking-tight">{q.question}</p>
                  <div className="flex gap-4">
                    <button
                      disabled={q.isAnswered}
                      onClick={() => handleQuizAnswer(i, true)}
                      className={cn(
                        "flex-1 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95",
                        q.isAnswered && q.answer === true 
                          ? 'bg-emerald-500 text-white shadow-glow-green' 
                          : q.isAnswered 
                            ? 'bg-gray-100 text-gray-400 opacity-50' 
                            : 'bg-white border-2 border-gray-100 text-gray-500 hover:bg-emerald-50'
                      )}
                    >
                      Yes
                    </button>
                    <button
                      disabled={q.isAnswered}
                      onClick={() => handleQuizAnswer(i, false)}
                      className={cn(
                        "flex-1 py-4 rounded-3xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95",
                        q.isAnswered && q.answer === false 
                          ? 'bg-rose-500 text-white shadow-glow-red' 
                          : q.isAnswered 
                            ? 'bg-gray-100 text-gray-400 opacity-50' 
                            : 'bg-white border-2 border-gray-100 text-gray-500 hover:bg-rose-50'
                      )}
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Targets Section */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-8"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Main Targets</h3>
              </div>
              <button 
                onClick={() => setShowCustomTaskInput(true)}
                className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Zap className="w-5 h-5" />
              </button>
            </div>

            <AnimatePresence>
              {showCustomTaskInput && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50/50 p-6 rounded-[2rem] border-2 border-dashed border-blue-200"
                >
                  <input 
                    autoFocus
                    value={customTask}
                    onChange={(e) => setCustomTask(e.target.value)}
                    placeholder="E.g., 20 mins light stretching..."
                    className="w-full bg-white px-6 py-4 rounded-2xl border border-blue-100 outline-none focus:ring-2 focus:ring-blue-400 mb-4 font-bold text-gray-700"
                  />
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowCustomTaskInput(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={addCustomTarget}
                      className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-200"
                    >
                      Add Target
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              {routine?.targets.map((t, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  onClick={() => toggleTarget(i)}
                  className={cn(
                    "w-full flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all active:scale-[0.98] text-left",
                    t.isCompleted 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-white border-gray-50 hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white",
                    t.isCompleted ? 'text-emerald-500 shadow-inner' : 'text-gray-200 border border-gray-100'
                  )}>
                    {t.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className={cn(
                      "text-xl font-black tracking-tight block",
                      t.isCompleted ? 'text-emerald-900 font-black' : 'text-gray-900 font-bold'
                    )}>
                      {t.target}
                    </span>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Goal {i + 1}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Reflection Section */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="space-y-6"
          >
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100">
                <Wind className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Today's Reflection</h3>
            </div>
            <div className="luxury-glass p-8 space-y-4">
              <textarea 
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="How did you feel overall today? Notes for your journey..."
                className="w-full min-h-[120px] bg-gray-50/50 rounded-2xl p-6 text-sm font-medium border border-transparent focus:border-amber-200 focus:bg-white outline-none transition-all resize-none"
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-right">Self Awareness is Healing</p>
            </div>
          </motion.div>

          {/* Tasks Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 px-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Ritual Habits</h3>
            </div>
            <div className="space-y-4">
              {routine?.tasks.map((h, i) => (
                <button
                  key={i}
                  onClick={() => toggleTask(i)}
                  className={cn(
                    "w-full flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all active:scale-[0.98] text-left",
                    h.isCompleted 
                      ? "bg-indigo-50/50 border-indigo-200" 
                      : "bg-white border-gray-50 hover:border-gray-200"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-white",
                    h.isCompleted ? 'text-indigo-500 shadow-inner' : 'text-gray-200 border border-gray-100'
                  )}>
                    {h.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className={cn(
                      "text-xl font-black tracking-tight block",
                      h.isCompleted ? 'text-indigo-900 font-black' : 'text-gray-900 font-bold'
                    )}>
                      {h.habit}
                    </span>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Ritual {i + 1}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 luxury-glass-dark relative overflow-hidden group rounded-[3.5rem] bg-stone-950 shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:scale-110 transition-transform duration-1000">
                <Sparkles className="w-40 h-40 rotate-12 text-white" />
              </div>

              <div className="relative z-10 space-y-10">
                <div className="flex flex-col gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-3xl font-black tracking-tight leading-tight text-white">
                      Unlock Your Full Potential
                    </h4>
                    <p className="text-base font-bold leading-relaxed text-white/60">
                      Ready for a deeper dive? Get a professional AI Body Scan to analyze your physical markers and dosha balance.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleBodyScanAccess}
                  className="w-full py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 transition-all active:scale-95 bg-emerald-500 text-white shadow-glow-green"
                >
                  Launch AI Body Scan
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <FeatureBlog featureId="daily-routine" />
        </div>
      </div>
    </div>
  );
}
