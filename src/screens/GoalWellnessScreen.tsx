import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Loader2, 
  Target, 
  Brain, 
  Moon, 
  ChevronRight,
  Activity,
  ArrowLeft,
  Sparkles,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import LoadingYogi from '../components/LoadingYogi';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

interface GoalWellnessScreenProps {
  userData: any;
  appConfig?: any;
}

const GOALS = {
  'weight-loss': {
    title: 'Weight Loss Plan',
    icon: <Target className="w-6 h-6" />,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    questions: [
      { id: 'currentWeight', label: 'Current Weight (kg)', type: 'number' },
      { id: 'targetWeight', label: 'Target Weight (kg)', type: 'number' },
      { id: 'dietType', label: 'Diet Type', type: 'select', options: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed'] },
      { id: 'activityLevel', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
      { id: 'biggestChallenge', label: 'Biggest Challenge', type: 'text', placeholder: 'e.g., Cravings, Lack of time, Slow metabolism' }
    ]
  },
  'stress-relief': {
    title: 'Stress Relief Plan',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    questions: [
      { id: 'stressLevel', label: 'Current Stress Level (1-10)', type: 'number' },
      { id: 'primaryCause', label: 'Primary Cause of Stress', type: 'text', placeholder: 'e.g., Work, Relationships, Finances' },
      { id: 'physicalSymptoms', label: 'Physical Symptoms', type: 'text', placeholder: 'e.g., Headaches, Muscle tension, Fatigue' },
      { id: 'copingMechanism', label: 'Current Coping Mechanism', type: 'text', placeholder: 'e.g., Meditation, Exercise, Eating' }
    ]
  },
  'better-sleep': {
    title: 'Better Sleep Plan',
    icon: <Moon className="w-6 h-6" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    questions: [
      { id: 'sleepHours', label: 'Average Sleep Hours', type: 'number' },
      { id: 'sleepQuality', label: 'Sleep Quality', type: 'select', options: ['Poor', 'Fair', 'Good', 'Excellent'] },
      { id: 'troubleFallingAsleep', label: 'Trouble Falling Asleep?', type: 'select', options: ['Yes', 'No', 'Sometimes'] },
      { id: 'wakingUpAtNight', label: 'Waking Up During Night?', type: 'select', options: ['Never', '1-2 times', '3+ times'] },
      { id: 'screenTimeBeforeBed', label: 'Screen Time Before Bed (hours)', type: 'number' }
    ]
  }
};

export default function GoalWellnessScreen({ userData, appConfig }: GoalWellnessScreenProps) {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { startAnalysis } = useAccessGuard();
  
  const pricing = getFeaturePricing(goalId || 'better-sleep', appConfig);
  const goalConfig = GOALS[goalId as keyof typeof GOALS];
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showPricing, setShowPricing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (isSleepGoal) {
      navigate('/better-sleep-landing', { replace: true });
      return;
    }

    if (isStressGoal) {
      navigate('/stress-relief-landing', { replace: true });
      return;
    }

    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === goalId) {
      // Auto-resume disabled due to schema change
    }
  }, [location.state, goalId]);

  if (!userData || !goalConfig) return null;

  const isSleepGoal = goalId === 'better-sleep';
  const isStressGoal = goalId === 'stress-relief';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const profileData = {
      ...formData,
      type: 'goal_wellness',
      goalId,
      goalTitle: goalConfig.title,
      planId: 'basic',
      price: 0,
      isPaid: false,
    };

    if (userData?.is_guest || !userData?.uid) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify(profileData));
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      (profileData as any).uid = userData.uid;
      const docId = await saveProfileLocally(profileData as any);
      navigate(`/analysis-pricing/${docId}`);
    } catch (error) {
      console.error("Error submitting profile:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id: string, value: any) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Sleep Goal Specific Landing Page
  if (isSleepGoal && !showForm) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-32">
        
        {/* Dynamic Hero Section */}
        <div className="relative h-[85vh] lg:h-[90vh] w-full overflow-hidden">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=1200"
            alt="Deep Restorative Sleep"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* No overlay shadow as per request */}
          
          {/* Accent Glows - Strictly background */}
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-[#A259FF]/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-[#00BFA6]/10 blur-[120px] rounded-full -z-10" />

          <button onClick={() => navigate(-1)} className="absolute top-8 left-6 w-12 h-12 bg-white/60 backdrop-blur-xl rounded-full flex items-center justify-center border border-gray-200 z-50 text-gray-800 shadow-sm active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-32 px-6 text-center z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6 max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A259FF]/10 border border-[#A259FF]/20 text-[#A259FF] text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                <Sparkles className="w-4 h-4 fill-[#A259FF]" />
                Vedic Sleep Science
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#0F172A] leading-[1.1] tracking-tighter">
                😴 Why You’re Not <br/>
                <span style={{ color: '#006BDF' }}>Sleeping Well</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 font-medium max-w-xl mx-auto tracking-wide">
                Your sleep problem has a hidden cause. <br/>
                <span className="text-[#FFB400] font-bold">Let's uncover the root of your restlessness.</span>
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mt-8 px-12 py-5 rounded-full bg-[#FF6B6B] text-white font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(255,107,107,0.4)] border border-[#FF6B6B] hover:brightness-110 transition-all flex items-center gap-3 mx-auto"
              >
                Find Out <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="px-6 -mt-20 relative z-30 pb-16">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Search className="w-6 h-6" />, title: "Discover real reason", desc: "Identify the root Ayurvedic imbalance causing your insomnia.", color: '#A259FF' },
              { icon: <Activity className="w-6 h-6" />, title: "Fix sleep pattern", desc: "Align your circadian rhythm with personalized routines.", color: '#006BDF' },
              { icon: <Moon className="w-6 h-6" />, title: "Natural reset plan", desc: "Ancient remedies to calm your mind and body instantly.", color: '#00BFA6' }
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="p-8 rounded-[3rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all group"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-transform"
                  style={{ backgroundColor: `${benefit.color}15`, border: `1px solid ${benefit.color}30` }}
                >
                  <span className="text-2xl" style={{ color: benefit.color }}>✔</span>
                </div>
                <h3 className="text-xl font-black text-[#0F172A] mb-3">{benefit.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-lg">
             <SEOContentSection content={FEATURE_SEO_CONTENT['better-sleep']} />
          </div>
        </div>

        {/* Sticky Bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent pt-16">
          <div className="max-w-lg mx-auto">
            <motion.button
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="w-full py-6 rounded-full bg-[#FF6B6B] text-white font-black text-sm uppercase tracking-[0.3em] shadow-[0_20px_60px_rgba(255,107,107,0.5)] border border-[#FF6B6B] flex items-center justify-center gap-3"
            >
              Analyze Now <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      <div className="relative w-full">
        <img 
          src={goalId === 'weight-loss' ? '/weightloss.png' : `https://picsum.photos/seed/${goalId || 'wellness'}/800/400`}
          alt={goalConfig.title}
          className="w-full h-auto object-cover" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayur-bg via-transparent to-transparent pointer-events-none" />
        <button onClick={() => isSleepGoal ? setShowForm(false) : navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20">
        <div className="mb-8 mt-2 max-w-2xl mx-auto">
          <div className={`flex items-center gap-3 ${goalConfig.color} mb-2`}>
            {goalConfig.icon}
            <h2 className="text-2xl font-black tracking-tight text-gray-900 flex gap-2">
              {goalConfig.title.split(' ')[0]} <span className={goalConfig.color}>{goalConfig.title.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">Personalized AI Ayurvedic Plan</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {goalConfig.questions.map((q) => (
            <div key={q.id} className="space-y-3">
              <label className="text-xs font-black text-gray-800 uppercase tracking-widest pl-2">{q.label}</label>
              {q.type === 'select' ? (
                <div className="relative">
                  <select
                    required
                    value={formData[q.id] || ''}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white shadow-sm focus:border-ayur-neon focus:ring-4 focus:ring-ayur-neon/10 outline-none transition-all text-gray-900 font-bold text-sm appearance-none"
                  >
                    <option value="" disabled>Select an option</option>
                    {q.options?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              ) : q.type === 'number' ? (
                <input
                  required
                  type="number"
                  value={formData[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white shadow-sm focus:border-ayur-neon focus:ring-4 focus:ring-ayur-neon/10 outline-none transition-all text-gray-900 font-bold text-sm"
                  placeholder="0"
                />
              ) : (
                <input
                  required
                  type="text"
                  value={formData[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-white shadow-sm focus:border-ayur-neon focus:ring-4 focus:ring-ayur-neon/10 outline-none transition-all text-gray-900 font-bold text-sm"
                  placeholder={q.placeholder}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-[1.5rem] bg-gradient-to-b ${isSleepGoal ? 'from-[#FF6B6B] to-[#FF4B4B] shadow-[0_10px_20px_rgba(255,107,107,0.3)] border-[#D64545]' : 'from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.4)] border-blue-800'} text-white font-black text-xs uppercase tracking-[0.2em] border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Plan (From ₹{pricing.plans[0].price})
              </>
            )}
          </button>
        </form>
        
        <div className="max-w-2xl mx-auto mt-8">
           <SEOContentSection content={FEATURE_SEO_CONTENT[goalId as keyof typeof FEATURE_SEO_CONTENT] || FEATURE_SEO_CONTENT['weight-loss']} />
        </div>
      </div>
    </div>
  );
}
