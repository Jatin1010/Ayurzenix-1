import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  TrendingUp, 
  AlertCircle, 
  Loader2, 
  ChevronLeft, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  CheckCircle2,
  Share2,
  Mail,
  Utensils,
  Brain,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeFutureHealth } from '../lib/gemini';
import LoadingYogi from '../components/LoadingYogi';
import { cn } from '../lib/utils';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

interface FuturePredictorScreenProps {
  userData: any;
  appConfig?: any;
}

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function FuturePredictorScreen({ userData, appConfig }: FuturePredictorScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('future-predictor', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [step, setStep] = useState(0); // 0: Intro, 1-5: Inputs, 6: Result
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  // User Inputs
  const [inputs, setInputs] = useState({
    dailyRoutine: 'Regular',
    dietHabits: 'Healthy & home food',
    sleep: 'Good',
    stressLevel: 'Medium',
    energyLevel: 'Medium',
    symptoms: [] as string[],
    otherSymptom: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'future-predictor') {
       // Auto-resume disabled
    }
  }, [location.state]);

  const SYMPTOMS_OPTIONS = [
    "Acidity",
    "Fatigue",
    "Headache",
    "Skin issues",
    "Weak digestion",
    "Stress"
  ];

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const toggleSymptom = (symptom: string) => {
    setInputs(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const startPrediction = async () => {
    if (userData?.is_guest || !userData?.uid) {
        sessionStorage.setItem('pendingAnalysis', JSON.stringify({
          type: 'future_prediction',
          inputs: inputs,
          planId: 'basic',
          price: 0,
          isPaid: false, 
        }));
        navigate('/auth');
        return;
    }
    setAnalyzing(true);
    try {
      const profileId = await saveProfileLocally({
        uid: userData!.uid,
        type: 'future_prediction',
        inputs: inputs,
        planId: 'basic',
        price: 0,
        isPaid: false, 
      });
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save metrics. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleShare = async () => {
    if (!prediction) return;

    const shareText = `🌿 *Ayurzenix Future Health Report* 🌿\n\n` +
      `*Outlook:* ${prediction.outlook}\n\n` +
      `*Risk Level:* ${prediction.riskLevel}\n\n` +
      `*Ayurvedic Insight:* ${prediction.ayurvedicInsight}\n\n` +
      `*Key Warnings:*\n${prediction.keyWarnings.map((w: string) => `• ${w}`).join('\n')}\n\n` +
      `*Recommended Actions:*\n${prediction.recommendedActions.map((a: string) => `• ${a}`).join('\n')}\n\n` +
      `*Dietary Tips:*\nTo Eat: ${prediction.dietaryRecommendations.toEat.join(', ')}\nTo Avoid: ${prediction.dietaryRecommendations.toAvoid.join(', ')}\n\n` +
      (prediction.mentalWellness ? `*Mental Wellness:* ${prediction.mentalWellness}\n\n` : '') +
      `Get your personalized Ayurvedic report at: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ayurzenix Health Report',
          text: shareText,
          url: window.location.origin,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert("Report copied to clipboard!");
    }
  };

  const shareOnWhatsApp = () => {
    if (!prediction) return;
    const shareText = encodeURIComponent(
      `🌿 *Ayurzenix Future Health Report* 🌿\n\n` +
      `*Outlook:* ${prediction.outlook}\n\n` +
      `*Risk Level:* ${prediction.riskLevel}\n\n` +
      `*Ayurvedic Insight:* ${prediction.ayurvedicInsight}\n\n` +
      `*Key Warnings:*\n${prediction.keyWarnings.map((w: string) => `• ${w}`).join('\n')}\n\n` +
      `*Recommended Actions:*\n${prediction.recommendedActions.map((a: string) => `• ${a}`).join('\n')}\n\n` +
      `*Dietary Tips:*\nTo Eat: ${prediction.dietaryRecommendations.toEat.join(', ')}\nTo Avoid: ${prediction.dietaryRecommendations.toAvoid.join(', ')}\n\n` +
      (prediction.mentalWellness ? `*Mental Wellness:* ${prediction.mentalWellness}\n\n` : '') +
      `Get yours at: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const shareOnGmail = () => {
    if (!prediction) return;
    const subject = encodeURIComponent("My Ayurzenix Future Health Report");
    const body = encodeURIComponent(
      `Ayurzenix Future Health Report\n\n` +
      `Outlook: ${prediction.outlook}\n\n` +
      `Risk Level: ${prediction.riskLevel}\n\n` +
      `Ayurvedic Insight: ${prediction.ayurvedicInsight}\n\n` +
      `Key Warnings:\n${prediction.keyWarnings.map((w: string) => `• ${w}`).join('\n')}\n\n` +
      `Recommended Actions:\n${prediction.recommendedActions.map((a: string) => `• ${a}`).join('\n')}\n\n` +
      `Dietary Tips:\nTo Eat: ${prediction.dietaryRecommendations.toEat.join(', ')}\nTo Avoid: ${prediction.dietaryRecommendations.toAvoid.join(', ')}\n\n` +
      (prediction.mentalWellness ? `Mental Wellness: ${prediction.mentalWellness}\n\n` : '') +
      `Get yours at: ${window.location.origin}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Banner Section */}
            <div className="premium-card overflow-hidden group -mx-6 rounded-none sm:rounded-3xl">
              <div className="relative h-64">
                <img 
                  src="/future_health.png" 
                  alt="Future health predictor banner" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20 text-white mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-ayur-neon" />
                    AI Health Foresight
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Predict Your Tomorrow</h2>
                  <p className="text-xs text-white/70 font-medium tracking-wide">Advanced AI-Powered Ayurvedic Trajectory Analysis</p>
                </div>
              </div>
            </div>

            <div className="px-6 space-y-8">
              <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm border border-black/5 opacity-90">
                <img src="/futurehealthpredictor.png" alt="AI Future health predictor content" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: <ShieldAlert className="text-rose-500" />, text: "Risk identification for next 30 days" },
                  { icon: <Calendar className="text-ayur-gold" />, text: "Weekly wellness focus points" },
                  { icon: <Sparkles className="text-ayur-neon" />, text: "Personalized Ayurvedic remedies" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-5 bg-white rounded-3xl p-5 border-b-4 border-r-4 border-gray-200 shadow-sm hover:border-gray-300 transition-all">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-gray-200">
                      {item.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">{item.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="w-full py-6 rounded-[2.5rem] bg-gradient-to-b from-ayur-neon to-green-500 text-black font-black text-sm uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(57,255,20,0.4)] border-b-[6px] border-green-700 active:border-b-2 active:translate-y-1 transition-all flex flex-col items-center justify-center gap-1.5"
              >
                <span>Start Analysis</span>
                <span className="text-[9px] font-black opacity-60 italic tracking-widest">
                  Starting From: ₹{pricing.plans[0].price}
                </span>
              </button>
            </div>
          </motion.div>
        );

      case 1: // Daily Routine
        return (
          <StepContainer 
            title="Daily Routine" 
            question={userData.language === 'hi' ? "आपका daily routine कैसा है?" : "How is your daily routine?"}
            onNext={nextStep}
            onBack={prevStep}
          >
            <div className="space-y-3">
              {['Regular', 'Irregular', 'Very disturbed'].map(opt => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  active={inputs.dailyRoutine === opt} 
                  onClick={() => setInputs({...inputs, dailyRoutine: opt})} 
                />
              ))}
            </div>
          </StepContainer>
        );

      case 2: // Diet Habits
        return (
          <StepContainer 
            title="Diet Habits" 
            question={userData.language === 'hi' ? "आपका खाना कैसा है?" : "How is your diet?"}
            onNext={nextStep}
            onBack={prevStep}
          >
            <div className="space-y-3">
              {['Healthy & home food', 'Mixed', 'Mostly outside/junk'].map(opt => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  active={inputs.dietHabits === opt} 
                  onClick={() => setInputs({...inputs, dietHabits: opt})} 
                />
              ))}
            </div>
          </StepContainer>
        );

      case 3: // Sleep
        return (
          <StepContainer 
            title="Sleep Quality" 
            question={userData.language === 'hi' ? "आपकी नींद कैसी है?" : "How is your sleep?"}
            onNext={nextStep}
            onBack={prevStep}
          >
            <div className="space-y-3">
              {['Good', 'Average', 'Poor'].map(opt => (
                <OptionButton 
                  key={opt} 
                  label={opt} 
                  active={inputs.sleep === opt} 
                  onClick={() => setInputs({...inputs, sleep: opt})} 
                />
              ))}
            </div>
          </StepContainer>
        );

      case 4: // Stress & Energy
        return (
          <StepContainer 
            title="Stress & Energy" 
            question={userData.language === 'hi' ? "आपका तनाव और ऊर्जा स्तर?" : "Your stress and energy levels?"}
            onNext={nextStep}
            onBack={prevStep}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Stress Level</p>
                <div className="flex gap-3">
                  {['Low', 'Medium', 'High'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInputs({...inputs, stressLevel: opt})}
                      className={cn(
                        "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                        inputs.stressLevel === opt 
                          ? "bg-gradient-to-b from-rose-400 to-rose-600 text-white border-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.4)]" 
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Energy Level</p>
                <div className="flex gap-3">
                  {['High', 'Medium', 'Low'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInputs({...inputs, energyLevel: opt})}
                      className={cn(
                        "flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                        inputs.energyLevel === opt 
                          ? "bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
                          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </StepContainer>
        );

      case 5: // Symptoms
        return (
          <StepContainer 
            title="Current Symptoms" 
            question={userData.language === 'hi' ? "क्या आपको इनमें से कोई समस्या है?" : "Do you have any of these issues?"}
            onNext={startPrediction}
            onBack={prevStep}
            nextLabel="Predict My Health"
            loading={analyzing}
          >
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3">
                {SYMPTOMS_OPTIONS.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                      inputs.symptoms.includes(symptom)
                        ? "bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Other Issues</label>
                <textarea
                  value={inputs.otherSymptom}
                  onChange={(e) => setInputs({...inputs, otherSymptom: e.target.value})}
                  placeholder="Describe any other issues..."
                  className="w-full bg-white border-2 border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl p-5 text-[10px] font-black uppercase tracking-[0.2em] outline-none resize-none text-gray-900 placeholder:text-gray-400 transition-all"
                  rows={3}
                />
              </div>
            </div>
          </StepContainer>
        );

      case 6: // Result
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Outlook Card */}
            <div className={cn(
              "p-10 rounded-[2.5rem] text-black shadow-2xl relative overflow-hidden group",
              prediction.riskLevel === 'High' ? 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-glow-rose' :
              prediction.riskLevel === 'Medium' ? 'bg-gradient-to-br from-ayur-gold to-amber-600 shadow-glow-gold' :
              'bg-gradient-to-br from-ayur-neon to-emerald-600 shadow-glow-green'
            )}>
              <div className="absolute -right-8 -top-8 opacity-20 group-hover:scale-110 transition-transform duration-1000">
                <TrendingUp className="w-48 h-48 rotate-12" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-black/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-black/5">
                    Risk Level: {prediction.riskLevel}
                  </div>
                  <Sparkles className="w-6 h-6 opacity-30" />
                </div>
                <h2 className="text-3xl font-display font-black leading-tight tracking-tight">{prediction.outlook}</h2>
              </div>
            </div>

            {/* Ayurvedic Insight */}
            {prediction.ayurvedicInsight && (
              <div className="premium-card p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Brain className="w-24 h-24" />
                </div>
                <h4 className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em] flex items-center gap-3">
                  <Sparkles className="w-4 h-4" />
                  Ayurvedic Insight
                </h4>
                <div className="space-y-5 relative z-10">
                  {prediction.ayurvedicInsight.split('\n').map((para: string, i: number) => (
                    <p key={i} className="text-sm text-gray-500 font-medium leading-relaxed opacity-90">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-xl font-display font-black text-gray-900 tracking-tight px-2">30-Day Detailed Timeline</h3>
              <div className="space-y-6">
                {prediction.predictions.map((p: any, i: number) => (
                  <div key={i} className="premium-card p-8 space-y-6 group hover:border-ayur-neon/30 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em]">{p.period}</span>
                      <div className="w-2.5 h-2.5 bg-ayur-neon rounded-full shadow-glow-green" />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">{p.focus}</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            <span className="font-black text-rose-500 uppercase tracking-widest mr-2">Risk:</span> {p.risk}
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Info className="w-4 h-4 text-ayur-gold shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            <span className="font-black text-ayur-gold uppercase tracking-widest mr-2">Cause:</span> {p.cause}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-ayur-neon/5 p-5 rounded-2xl border border-ayur-neon/10">
                      <p className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em] mb-2">Recommended Remedy</p>
                      <p className="text-xs text-ayur-neon font-bold leading-relaxed opacity-90">{p.remedy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dietary Recommendations */}
            {prediction.dietaryRecommendations && (
              <div className="premium-card p-8 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Utensils className="w-24 h-24" />
                </div>
                <div className="flex items-center gap-3 relative z-10">
                  <Utensils className="w-6 h-6 text-ayur-gold" />
                  <h3 className="text-xl font-display font-black text-gray-900 tracking-tight">Dietary Guidance</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-8 relative z-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em] px-2">To Eat</p>
                    <div className="grid grid-cols-1 gap-3">
                      {prediction.dietaryRecommendations.toEat.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-black/5 p-4 rounded-2xl border border-black/5">
                          <div className="w-2 h-2 bg-ayur-neon rounded-full shadow-glow-green" />
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] px-2">To Avoid</p>
                    <div className="grid grid-cols-1 gap-3">
                      {prediction.dietaryRecommendations.toAvoid.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-4 bg-black/5 p-4 rounded-2xl border border-black/5">
                          <div className="w-2 h-2 bg-rose-500 rounded-full shadow-glow-rose" />
                          <span className="text-xs font-black uppercase tracking-widest text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {prediction.dietaryRecommendations.specialHerbs && (
                  <div className="pt-8 border-t border-white/5 relative z-10">
                    <p className="text-[10px] font-black text-ayur-gold uppercase tracking-[0.3em] mb-4 px-2">Special Herbs</p>
                    <div className="flex flex-wrap gap-3">
                      {prediction.dietaryRecommendations.specialHerbs.map((herb: string, i: number) => (
                        <span key={i} className="px-5 py-2 bg-ayur-gold/10 rounded-full text-[10px] font-black text-ayur-gold border border-ayur-gold/20 uppercase tracking-widest">
                          {herb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mental Wellness */}
            {prediction.mentalWellness && (
              <div className="premium-card p-8 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Brain className="w-24 h-24" />
                </div>
                <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Brain className="w-4 h-4" />
                  Mental Wellness
                </h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed opacity-90 relative z-10">
                  {prediction.mentalWellness}
                </p>
              </div>
            )}

            {/* Warnings & Actions */}
            <div className="grid grid-cols-1 gap-6">
              <div className="premium-card p-8 space-y-6 border-rose-500/10">
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] flex items-center gap-3">
                  <ShieldAlert className="w-4 h-4" />
                  Key Warnings
                </h4>
                <ul className="space-y-4">
                  {prediction.keyWarnings.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-xs text-gray-500 font-bold leading-relaxed">
                      <div className="w-2 h-2 bg-rose-500 rounded-full mt-1.5 shrink-0 shadow-glow-rose" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="premium-card p-8 space-y-6 border-ayur-neon/10">
                <h4 className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em] flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Recommended Actions
                </h4>
                <ul className="space-y-4">
                  {prediction.recommendedActions.map((a: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-xs text-gray-500 font-bold leading-relaxed">
                      <div className="w-2 h-2 bg-ayur-neon rounded-full mt-1.5 shrink-0 shadow-glow-green" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Share Section */}
            <div className="premium-card p-10 space-y-8 text-center">
              <div className="space-y-3">
                <h3 className="text-2xl font-display font-black text-gray-900 tracking-tight">Share Your Report</h3>
                <p className="text-xs text-gray-500 font-black uppercase tracking-widest opacity-60">Help your friends and family stay healthy too!</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                <button 
                  onClick={shareOnWhatsApp}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-green-500/10 rounded-[1.5rem] flex items-center justify-center text-green-500 border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-all duration-500 shadow-glow-green">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396 0 12.032c0 2.123.554 4.197 1.608 6.022L0 24l6.117-1.605a11.803 11.803 0 005.925 1.573h.005c6.631 0 12.026-5.396 12.029-12.032.001-3.218-1.251-6.243-3.522-8.514z"/>
                    </svg>
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">WhatsApp</span>
                </button>

                <button 
                  onClick={shareOnGmail}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-rose-500/10 rounded-[1.5rem] flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-glow-rose">
                    <Mail className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Gmail</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="flex flex-col items-center gap-4 group"
                >
                  <div className="w-16 h-16 bg-blue-500/10 rounded-[1.5rem] flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-glow-blue">
                    <Share2 className="w-8 h-8" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-900 transition-colors">Share</span>
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                setPrediction(null);
                setStep(0);
              }}
              className="w-full py-6 rounded-[2.5rem] bg-black/5 border border-black/10 font-black text-xs uppercase tracking-[0.3em] text-gray-500 hover:bg-black/10 hover:text-gray-900 transition-all active:scale-95"
            >
              Get New Prediction
            </button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-24 selection:bg-ayur-neon selection:text-white">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 bg-ayur-bg/80 backdrop-blur-xl z-50 border-b border-black/5">
        <button onClick={() => step > 0 && step < 6 ? prevStep() : navigate(-1)} className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-gray-900 active:scale-90 transition-all border border-black/10 hover:bg-black/10">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-display font-black text-gray-900 tracking-tight">Health Predictor</h1>
        <div className="w-12" />
      </div>

      <div className="px-6 space-y-8 pt-8">
        {/* Progress Bar */}
        {step > 0 && step < 6 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
              <span>Step {step} of 5</span>
              <span className="text-ayur-neon">{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
                className="h-full bg-gradient-to-r from-ayur-neon to-emerald-500 shadow-glow-green"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] flex items-start gap-4"
            >
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-500">Action Required</p>
                <p className="text-xs text-rose-400 font-medium leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Safety Disclaimer */}
        <div className="premium-card p-8 border-white/5">
          <div className="flex items-center gap-3 mb-3">
            <Info className="w-4 h-4 text-ayur-neon" />
            <span className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em]">Medical Disclaimer</span>
          </div>
          <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest opacity-60">
            Future health predictions are based on AI analysis of your current data and Ayurvedic principles. They are not medical diagnoses. Always consult a doctor for health concerns.
          </p>
        </div>

        {/* Partition / Divider */}
        <div className="w-full flex flex-col items-center justify-center py-12 opacity-60">
          <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent mb-4" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Discover More</span>
        </div>

        {/* Feature Blog Content */}
        <div className="mt-12">
          {!prediction && <SEOContentSection content={FEATURE_SEO_CONTENT['future-predictor']} />}
        </div>
      </div>

      {analyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ayur-bg px-6 text-center">
          <LoadingYogi />
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function StepContainer({ title, question, children, onNext, onBack, nextLabel = "Next Step", loading = false }: any) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em] px-2">{title}</h3>
        <h2 className="text-3xl font-display font-black text-gray-900 tracking-tight leading-tight">{question}</h2>
      </div>

      <div className="bg-white rounded-3xl p-8 border-b-4 border-r-4 border-gray-200 shadow-sm">
        {children}
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 py-5 rounded-2xl bg-white text-gray-500 font-black text-xs uppercase tracking-[0.2em] active:translate-y-0.5 active:border-b-2 transition-all border-x-2 border-t-2 border-b-[4px] border-gray-200 hover:border-gray-300 shadow-sm"
        >
          Back
        </button>
        <button
          disabled={loading}
          onClick={onNext}
          className={cn(
            "flex-[2] py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-sm active:translate-y-0.5 active:border-b-2 transition-all flex items-center justify-center gap-3 border-x-2 border-t-2 border-b-[4px]",
            loading ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
          )}
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : nextLabel}
        </button>
      </div>
    </div>
  );
}

function OptionButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-6 rounded-2xl text-left transition-all border-x-2 border-t-2 border-b-[4px] flex items-center justify-between group relative overflow-hidden active:border-b-2 active:translate-y-0.5 shadow-sm",
        active 
          ? "bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]" 
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
      )}
    >
      <span className={cn(
        "text-sm font-black uppercase tracking-widest relative z-10",
        active ? "text-black" : "text-gray-500"
      )}>
        {label}
      </span>
      <div className={cn(
        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all relative z-10",
        active ? "border-black bg-black" : "border-gray-200"
      )}>
        {active && <div className="w-2.5 h-2.5 bg-ayur-neon rounded-full" />}
      </div>
    </button>
  );
}
