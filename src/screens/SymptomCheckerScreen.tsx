import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveProfileLocally } from '../lib/localHistory';
import { StepTitle, SmartChip, WellnessSlider } from '../components/analyzer/AnalyzerUI';
import { CinematicProcessing } from '../components/analyzer/CinematicProcessing';

const SYMPTOMS_LIST = [
  { id: 'bloating', label: 'Bloating', icon: '💨' },
  { id: 'gas', label: 'Gas/Acidity', icon: '🔥' },
  { id: 'constipation', label: 'Constipation', icon: '🧊' },
  { id: 'weakness', label: 'Weakness', icon: '🪫' },
  { id: 'headache', label: 'Headache', icon: '🧠' },
  { id: 'joint_pain', label: 'Joint Pain', icon: '🦴' },
  { id: 'hair_fall', label: 'Hair Fall', icon: '💇' },
  { id: 'skin_issues', label: 'Skin Issues', icon: '✨' },
  { id: 'anxiety', label: 'Anxiety', icon: '🌪️' },
  { id: 'insomnia', label: 'Insomnia', icon: '🌙' }
];

const STEPS = [
  { id: 'welcome', title: 'Hello', isWelcome: true },
  { id: 'symptoms', title: 'Signals' },
  { id: 'details', title: 'Details' },
  { id: 'energy', title: 'Vitality' }
];

export default function SymptomCheckerScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showProcessing, setShowProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    symptoms: [] as { id: string, severity: 'mild' | 'moderate' | 'severe' }[],
    duration: '1-3 days',
    intensity: 50,
    stressLevel: 40,
    digestionType: 'slow'
  });

  const [aiHint, setAiHint] = useState<string | null>(null);

  useEffect(() => {
    if (formData.symptoms.length > 0) {
      const hasSevere = formData.symptoms.some(s => s.severity === 'severe');
      const symptomIds = formData.symptoms.map(s => s.id);
      
      if (hasSevere) {
        setAiHint("High-severity signals detected. AI is prioritizing acute symptom relief protocols.");
      } else if (symptomIds.includes('bloating') && formData.stressLevel > 60) {
        setAiHint("High stress may be aggravating your digestion signals.");
      } else if (symptomIds.includes('hair_fall')) {
        setAiHint("Hair health is often linked to nutrition absorption.");
      } else if (formData.symptoms.length > 3) {
        setAiHint("Multiple signals suggest a systemic Dosha imbalance.");
      } else {
        setAiHint("Let me map these signals to your body type.");
      }
    } else {
      setAiHint(null);
    }
  }, [formData.symptoms, formData.stressLevel]);

  const handleSymptomToggle = (id: string) => {
    setFormData(prev => {
      const exists = prev.symptoms.find(s => s.id === id);
      if (exists) {
        return {
          ...prev,
          symptoms: prev.symptoms.filter(s => s.id !== id)
        };
      } else {
        return {
          ...prev,
          symptoms: [...prev.symptoms, { id, severity: 'mild' }]
        };
      }
    });
  };

  const updateSeverity = (id: string, severity: 'mild' | 'moderate' | 'severe') => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(s => s.id === id ? { ...s, severity } : s)
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate(-1);
  };

  const handleFinalSubmit = async () => {
    if (!userData?.uid || userData?.is_guest) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'symptom_checker',
        symptoms: formData.symptoms,
        inputs: formData,
        planId: 'basic',
        price: 0,
        isPaid: false
      }));
      navigate('/auth', { state: { from: '/symptom-checker' } });
      return;
    }

    if (formData.symptoms.length === 0) {
      setError('Please select at least one symptom.');
      return;
    }

    setShowProcessing(true);
  };

  const onProcessingComplete = async () => {
    try {
      const profileId = await saveProfileLocally({
        uid: userData.uid,
        type: 'symptom_checker',
        symptoms: formData.symptoms,
        inputs: formData,
        planId: 'basic',
        price: 0,
        isPaid: false
      });
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setShowProcessing(false);
    }
  };

  if (showProcessing) return <CinematicProcessing onComplete={onProcessingComplete} />;

  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      {/* Header */}
      <header className="px-6 py-5 flex items-center justify-between sticky top-0 bg-ayur-bg/80 backdrop-blur-xl z-50">
        <button onClick={handleBack} className="p-2 bg-white rounded-xl shadow-sm border border-black/5">
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'w-6 bg-black' : 'w-2 bg-black/10'}`} 
            />
          ))}
        </div>
        <div className="w-10" />
      </header>

      <main className="px-6 py-8 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Step 1: Welcome */}
            {currentStep === 0 && (
              <div className="space-y-8">
                <div className="w-16 h-16 bg-white rounded-[1.5rem] shadow-premium flex items-center justify-center text-ayur-purple mb-6 border border-black/5">
                  <Sparkles className="w-8 h-8 fill-current" />
                </div>
                <StepTitle subtitle="Your body communicates through signals. Let's decode them.">
                  Tell Ayurzenix how your body feels.
                </StepTitle>
                <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] p-6 border border-black/5 space-y-4">
                  <p className="text-gray-600 font-medium leading-relaxed">
                    This AI-powered analysis will decode underlying patterns beyond surface symptoms.
                  </p>
                  <div className="flex items-center gap-3 text-ayur-teal bg-ayur-teal/5 p-4 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="text-sm font-bold">Takes only 2 minutes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Symptoms Selection */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <StepTitle subtitle="Select all that apply to you lately.">
                  What signals are you noticing?
                </StepTitle>
                
                <div className="space-y-4">
                  {SYMPTOMS_LIST.map(sym => {
                    const selectedSymptom = formData.symptoms.find(s => s.id === sym.id);
                    const isSelected = !!selectedSymptom;

                    return (
                      <div key={sym.id} className="space-y-3">
                        <SmartChip 
                          label={sym.label}
                          icon={sym.icon}
                          selected={isSelected}
                          onClick={() => handleSymptomToggle(sym.id)}
                        />
                        
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-black/5 flex items-center justify-between gap-4">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Severity</span>
                                <div className="flex gap-1">
                                  {(['mild', 'moderate', 'severe'] as const).map(sev => (
                                    <button
                                      key={sev}
                                      onClick={() => updateSeverity(sym.id, sev)}
                                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                        selectedSymptom.severity === sev
                                          ? 'bg-black text-white shadow-lg'
                                          : 'bg-white text-gray-400 border border-black/5 hover:border-black/10'
                                      }`}
                                    >
                                      {sev}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {currentStep === 2 && (
              <div className="space-y-12">
                <StepTitle subtitle="Understanding the context helps the AI decode root causes.">
                  Tell us more about these signals.
                </StepTitle>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">How long has this been happening?</p>
                    <div className="flex flex-wrap gap-2">
                      {['Just started', '1-3 days', '1-2 weeks', 'Long term'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFormData({...formData, duration: opt})}
                          className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all border ${
                            formData.duration === opt 
                              ? 'bg-black text-white border-black shadow-lg' 
                              : 'bg-white text-gray-600 border-black/5 hover:border-black/20'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Vitality */}
            {currentStep === 3 && (
              <div className="space-y-12">
                <StepTitle subtitle="Digestion and stress are the pillars of Ayurvedic health.">
                  Let's check your base vitality.
                </StepTitle>

                <div className="space-y-10">
                  <WellnessSlider 
                    label="Stress Index"
                    value={formData.stressLevel}
                    onChange={(v) => setFormData({...formData, stressLevel: v})}
                    minLabel="Calm"
                    maxLabel="High Stress"
                  />

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">How is your digestion?</p>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'slow', label: 'Slow & Heavy', desc: 'Feeling full long after meals' },
                        { id: 'regular', label: 'Healthy & Regular', desc: 'Daily cycles feel good' },
                        { id: 'unpredictable', label: 'Irregular', desc: 'Bloating or gas occasionally' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({...formData, digestionType: opt.id})}
                          className={`p-5 rounded-2xl text-left transition-all border ${
                            formData.digestionType === opt.id 
                              ? 'bg-black border-black shadow-xl ring-4 ring-black/5' 
                              : 'bg-white border-black/5 hover:border-black/10'
                          }`}
                        >
                          <p className={`font-black ${formData.digestionType === opt.id ? 'text-white' : 'text-black'}`}>{opt.label}</p>
                          <p className={`text-xs mt-1 ${formData.digestionType === opt.id ? 'text-white/60' : 'text-gray-400'}`}>{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* AI Hint Bar */}
        <AnimatePresence>
          {aiHint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-12 bg-ayur-purple/10 border border-ayur-purple/10 p-4 rounded-2xl flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-ayur-purple shrink-0 shadow-sm">
                <Brain className="w-4 h-4" />
              </div>
              <p className="text-xs text-ayur-purple font-medium leading-relaxed pt-1">
                <span className="font-black block uppercase tracking-wider text-[8px] mb-0.5 opacity-60">AI Observation</span>
                {aiHint}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ayur-bg via-ayur-bg to-transparent">
        <div className="max-w-xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={currentStep === 1 && formData.symptoms.length === 0}
            className="w-full bg-black text-white h-16 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl disabled:opacity-30 transition-all text-xs uppercase tracking-[0.2em]"
          >
            {currentStep === STEPS.length - 1 ? 'Analyze My Body' : 'Next Step'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </footer>

      {error && (
        <div className="fixed bottom-24 left-6 right-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-3 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-xs font-bold">{error}</p>
        </div>
      )}
    </div>
  );
}
