import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2, Sparkles, Coffee, Zap, Wind, Heart, Brain, Moon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeMoodAyurveda } from '../lib/gemini';
import LoadingYogi from '../components/LoadingYogi';
import { cn } from '../lib/utils';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

interface MoodAyurvedaScreenProps {
  userData: any;
  appConfig?: any;
}

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function MoodAyurvedaScreen({ userData, appConfig }: MoodAyurvedaScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { startAnalysis } = useAccessGuard();
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [remedy, setRemedy] = useState<any>(null);
  const [showPricing, setShowPricing] = useState(false);
  const pricing = getFeaturePricing('stress-relief', appConfig);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'mood-ayurveda') {
      // Auto-resume disabled
    }
  }, [location.state, pricing.plans]); // Added pricing.plans as dependency to avoid warning

  const moods = [
    { id: 'stressed', emoji: '😰', label: 'Stressed', color: 'bg-rose-50 text-rose-600', icon: <Wind className="w-5 h-5" /> },
    { id: 'angry', emoji: '😡', label: 'Angry', color: 'bg-orange-50 text-orange-600', icon: <Zap className="w-5 h-5" /> },
    { id: 'tired', emoji: '😴', label: 'Tired', color: 'bg-blue-50 text-blue-600', icon: <Moon className="w-5 h-5" /> },
    { id: 'anxious', emoji: '😟', label: 'Anxious', color: 'bg-purple-50 text-purple-600', icon: <Brain className="w-5 h-5" /> },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'bg-green-50 text-green-600', icon: <Heart className="w-5 h-5" /> },
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'bg-amber-50 text-amber-600', icon: <Sparkles className="w-5 h-5" /> }
  ];

  const handleMoodSelect = async (moodId: string) => {
    setSelectedMood(moodId);
    if (!userData || userData.is_guest) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'mood_ayurveda',
        inputs: { mood: moodId },
        planId: 'basic',
        price: 0,
        isPaid: false
      }));
      navigate('/auth');
      return;
    }
    setAnalyzing(true);
    try {
      const docId = await saveProfileLocally({
        uid: userData.uid,
        type: 'mood_ayurveda',
        inputs: { mood: moodId },
        planId: 'basic',
        price: 0,
        isPaid: false
      });
      navigate(`/analysis-pricing/${docId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-gray-900" />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Mood Engine</h1>
        <div className="w-10" />
      </div>

      <div className="space-y-8">
        {!remedy ? (
          <div className="px-6 space-y-8">
            <div className="relative h-64 overflow-hidden -mx-6 mb-8 group shadow-lg">
              <img 
                src="/moodayurveda.png" 
                alt="Mood Engine" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 text-ayur-neon mb-2">
                  <Heart className="w-6 h-6" />
                  <h2 className="text-2xl font-black tracking-tight text-white">Mood <span className="text-ayur-neon">Engine</span></h2>
                </div>
                <p className="text-white/80 text-sm font-medium">Select your current mood for an Ayurvedic remedy.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {moods.map((mood) => (
                <motion.button
                  key={mood.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleMoodSelect(mood.id)}
                  disabled={analyzing}
                  className={`flex flex-col items-center gap-4 p-8 rounded-3xl border-x-2 border-t-2 border-b-[4px] transition-all shadow-sm active:border-b-2 active:translate-y-0.5 ${
                    selectedMood === mood.id 
                      ? 'border-green-700 bg-gradient-to-b from-ayur-neon to-green-500 shadow-[0_0_15px_rgba(57,255,20,0.4)]' 
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className="text-5xl">{mood.emoji}</span>
                  <span className={cn("text-xs font-black uppercase tracking-widest", selectedMood === mood.id ? "text-black" : "text-gray-900")}>{mood.label}</span>
                </motion.button>
              ))}
            </div>

            {analyzing && (
              <div className="fixed inset-0 bg-[#0abeff] z-50 flex flex-col items-center justify-center p-8 text-center">
                <LoadingYogi />
              </div>
            )}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Remedy Hero */}
            <div className="modern-hero group">
          <img 
            src="https://picsum.photos/seed/meditation/800/400" 
            alt="Feature Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040A18] via-[#0B1B3D]/80 to-transparent" />
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 bg-ayur-neon rounded-full blur-[80px] opacity-20" />
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-32 h-32 rotate-12 text-ayur-neon" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800/50 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-700 text-ayur-neon shadow-[0_0_10px_rgba(57,255,20,0.2)]">
                  Mood: {selectedMood}
                </div>
                <h2 className="text-3xl font-black leading-tight text-white">{remedy.remedy}</h2>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Info className="w-4 h-4 text-ayur-neon" />
                  {remedy.doshaImpact}
                </div>
              </div>
            </div>

            {/* Drink & Activity */}
            <div className="grid grid-cols-1 gap-4">
              {remedy.gunaAnalysis && (
                <div className="bg-emerald-50 border-b-4 border-r-4 border-emerald-100 rounded-3xl p-8 flex items-start gap-6 shadow-sm">
                  <div className="w-14 h-14 bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
                    <Brain className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Mental Guna Analysis</p>
                    <p className="text-sm font-bold text-emerald-900 leading-relaxed">{remedy.gunaAnalysis}</p>
                  </div>
                </div>
              )}

              <div className="bg-white border-b-4 border-r-4 border-gray-200 rounded-3xl p-8 flex items-start gap-6 shadow-sm">
                <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                  <Coffee className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Recommended Drink</p>
                  <p className="text-lg font-black text-gray-900 leading-tight">{remedy.drink}</p>
                </div>
              </div>

              <div className="bg-white border-b-4 border-r-4 border-gray-200 rounded-3xl p-8 flex items-start gap-6 shadow-sm">
                <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Recommended Activity</p>
                  <p className="text-lg font-black text-gray-900 leading-tight">{remedy.activity}</p>
                </div>
              </div>
            </div>

            {/* Diet Suggestions */}
            <div className="bg-white border-b-4 border-r-4 border-gray-200 rounded-3xl p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ayur-neon" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Diet for Balance</h3>
              </div>
              <ul className="space-y-4">
                {remedy.diet.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-gray-600 font-bold leading-relaxed">
                    <div className="w-2 h-2 bg-ayur-neon rounded-full mt-1.5 shrink-0 shadow-glow-green" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => setRemedy(null)}
              className="w-full py-5 rounded-2xl border-x-2 border-t-2 border-b-[4px] border-gray-200 bg-white font-black text-sm uppercase tracking-widest text-gray-500 hover:border-gray-300 active:border-b-2 active:translate-y-0.5 transition-all shadow-sm"
            >
              Select Another Mood
            </button>

            {/* Feature Blog Content */}
            <div className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-black/5">
              <SEOContentSection content={FEATURE_SEO_CONTENT['mood-ayurveda']} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
