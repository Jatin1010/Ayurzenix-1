import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Brain, 
  Activity, 
  Zap, 
  Wind,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { saveProfileLocally } from '../lib/localHistory';
import LoadingYogi from '../components/LoadingYogi';

const STEPS = [
  {
    id: 'profile',
    title: 'Biological Core',
    questions: [
      { id: 'age', label: 'Current Age', type: 'number', placeholder: 'Years', icon: <Activity className="w-4 h-4" /> },
      { id: 'gender', label: 'Gender Identity', type: 'select', options: ['Male', 'Female', 'Non-binary', 'Prefer not to say'], icon: <ShieldCheck className="w-4 h-4" /> },
      { id: 'lifestyleType', label: 'Current Lifestyle', type: 'select', options: ['Sedentary', 'Moderately Active', 'Highly Active', 'Extreme Athlete'], icon: <Zap className="w-4 h-4" /> }
    ]
  },
  {
    id: 'dynamics',
    title: 'Stress Dynamics',
    questions: [
      { id: 'stressIntensity', label: 'Stress Intensity (1-100)', type: 'range', min: 0, max: 100, icon: <Activity className="w-4 h-4" /> },
      { id: 'stressFrequency', label: 'Frequency', type: 'select', options: ['Occasional', 'Daily Peaks', 'Perpetual Tightness', 'Burned Out'], icon: <AlertCircle className="w-4 h-4" /> },
      { id: 'workPressure', label: 'Work/Life Pressure (%)', type: 'range', min: 0, max: 100, icon: <Brain className="w-4 h-4" /> },
      { id: 'overthinkingFrequency', label: 'Overthinking Tendency', type: 'select', options: ['Rare', 'Sometimes', 'Frequently', 'Uncontrollable'], icon: <Wind className="w-4 h-4" /> }
    ]
  },
  {
    id: 'nervousSystem',
    title: 'Nervous Response',
    questions: [
      { id: 'racingThoughts', label: 'Racing Thoughts Frequency', type: 'select', options: ['Never', 'Sometimes', 'Always at night', 'Constantly'], icon: <Brain className="w-4 h-4" /> },
      { id: 'panicSensations', label: 'Physical Panic/Tightness (%)', type: 'range', min: 0, max: 100, icon: <AlertCircle className="w-4 h-4" /> },
      { id: 'chestTightness', label: 'Chest Tightness', type: 'select', options: ['None', 'Mild', 'Significant', 'Heavy'], icon: <Activity className="w-4 h-4" /> },
      { id: 'heartbeatAwareness', label: 'Palpitation Awareness', type: 'select', options: ['Never', 'Rarely', 'During stress', 'Frequently'], icon: <Activity className="w-4 h-4" /> }
    ]
  },
  {
    id: 'recovery',
    title: 'Baseline Recovery',
    questions: [
      { id: 'sleepQuality', label: 'Sleep Quality (%)', type: 'range', min: 0, max: 100, icon: <Activity className="w-4 h-4" /> },
      { id: 'morningEnergy', label: 'Morning Energy Level (%)', type: 'range', min: 0, max: 100, icon: <Zap className="w-4 h-4" /> }
    ]
  }
];

export default function StressReliefScanScreen({ userData }: { userData: any }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    stressIntensity: 50,
    workPressure: 50,
    panicSensations: 20,
    sleepQuality: 70,
    morningEnergy: 50
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const isStepValid = () => {
    const questions = STEPS[currentStep].questions;
    return questions.every(q => formData[q.id] !== undefined && formData[q.id] !== '');
  };

  const handleSubmit = async () => {
    if (!userData?.uid || userData.is_guest) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        ...formData,
        type: 'stress_relief',
        status: 'pending',
        createdAt: new Date().toISOString()
      }));
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const docId = await saveProfileLocally({
        ...formData,
        type: 'stress_relief',
        uid: userData.uid,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      navigate(`/analysis-pricing/${docId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingYogi fullScreenSplash message="Decoding Stress Matrix..." />;

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white pb-32 font-sans selection:bg-emerald-100 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

      {/* Header */}
      <header className="px-6 pt-16 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-3 bg-stone-50 rounded-full active:scale-90 transition-all border border-stone-100">
          <ChevronLeft className="w-6 h-6 text-stone-950" />
        </button>
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-1">Neural Mapping</p>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-6 bg-emerald-500' : 'w-1.5 bg-stone-100'}`} />
            ))}
          </div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <div className="px-8 pt-20 max-w-xl mx-auto space-y-12">
        <div className="space-y-4">
          <motion.div 
            key={step.id + "header"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-2"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Phase 0{currentStep + 1}</span>
            <h1 className="text-4xl font-black text-black tracking-tight leading-none italic">{step.title}</h1>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            {step.questions.map((q) => (
              <div key={q.id} className="space-y-5">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-900 border border-stone-100">
                     {q.icon}
                   </div>
                   <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">{q.label}</label>
                </div>

                {q.type === 'select' ? (
                  <div className="grid grid-cols-2 gap-3">
                    {q.options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleChange(q.id, opt)}
                        className={`p-6 rounded-[2rem] text-sm font-black transition-all border-2 text-left leading-tight italic ${
                          formData[q.id] === opt 
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-200' 
                          : 'bg-stone-50 border-transparent text-stone-900 hover:border-stone-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : q.type === 'range' ? (
                  <div className="space-y-6 px-2 pt-4">
                    <input
                      type="range"
                      min={q.min}
                      max={q.max}
                      value={formData[q.id] || 0}
                      onChange={(e) => handleChange(q.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-stone-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-300">
                      <span>{q.min}%</span>
                      <span className="text-emerald-600 text-lg">{formData[q.id]}%</span>
                      <span>{q.max}%</span>
                    </div>
                  </div>
                ) : (
                  <input
                    type={q.type}
                    placeholder={q.placeholder}
                    value={formData[q.id] || ''}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    className="w-full bg-stone-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] p-8 text-lg font-black text-black outline-none transition-all placeholder:text-stone-300 italic"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Navigation Footer */}
      <div className="fixed bottom-0 inset-x-0 p-8 bg-gradient-to-t from-white via-white/95 to-transparent z-40 backdrop-blur-3xl">
        <div className="flex items-center gap-4 max-w-xl mx-auto">
          {currentStep > 0 && (
            <button 
              onClick={prevStep}
              className="px-10 py-6 bg-stone-50 text-stone-900 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] active:scale-95 transition-all border border-stone-100 shadow-sm"
            >
              Back
            </button>
          )}
          <button 
            disabled={!isStepValid()}
            onClick={nextStep}
            className={`flex-1 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.5em] active:scale-[0.97] transition-all flex items-center justify-center gap-4 group ${
              isStepValid() 
              ? 'bg-stone-950 text-white shadow-[0_30px_70px_-15px_rgba(0,0,0,0.3)]' 
              : 'bg-stone-100 text-stone-300'
            }`}
          >
            {currentStep === STEPS.length - 1 ? 'Compute Scan' : 'Progress'}
            <ChevronRight className={`w-5 h-5 transition-transform ${isStepValid() ? 'group-hover:translate-x-1' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
