import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  AlertCircle,
  User,
  Heart,
  Zap,
  BarChart,
  Scale
} from 'lucide-react';
import { cn } from '../lib/utils';
import { getFeaturePricing } from '../lib/pricing';
import { saveProfileLocally } from '../lib/localHistory';
import { useAccessGuard } from '../hooks/useAccessGuard';

const SYMPTOMS_OPTIONS = [
  "Fatigue", "Bloating", "Acidity", "Anxiety", "Poor Sleep", 
  "Headache", "Weight Gain", "Hair Fall", "Skin Issues", "Other"
];

const DISEASES_OPTIONS = [
  "Diabetes", "High BP", "Thyroid", "PCOS", "Heart Issues", "None", "Other"
];

const FAMILY_HISTORY_OPTIONS = [
  "Heart disease", "Diabetes", "Obesity", "None", "Other"
];

export default function HealthScanScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const navigate = useNavigate();
  const pricing = getFeaturePricing('health-scan', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSteps = 5;

  const [inputs, setInputs] = useState({
    // Step 1: Profile
    name: userData?.displayName || '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    bmi: 0,
    // Step 2: Symptoms
    symptoms: [] as string[],
    otherSymptom: '',
    symptomDetails: {} as Record<string, { severity: string, duration: string }>,
    // Step 3: History
    diseases: [] as string[],
    otherDisease: '',
    medicalHistory: 'No',
    medicalHistoryDetail: '',
    familyHistory: [] as string[],
    otherFamilyHistory: '',
    // Step 4: Lifestyle
    sleepDuration: '7–8',
    activityLevel: 'Moderate',
    stressLevel: 5,
    // Step 5: Diet
    junkFood: 'Weekly',
    waterIntake: '2–3L',
    sugarCravings: 'No'
  });

  const colors = {
    primary: "#059669", // Emerald-600
    accent: "#F59E0B", // Amber-500
    bgLight: "#F9FAFB",
    heading: "#000000",
    card: "rgba(255, 255, 255, 0.9)"
  };

  const SMART_SCAN_BLOG = {
    title: "🧠 Digital Nadi Pariksha: Ancient Wisdom meets AI Intelligence",
    intro: "Ayurveda mein 'Nadi' ke zariye body ke chhupe huye signals ko samjha jata tha. Ayurzenix ussi purani vidya ko advanced AI ke saath jodkar aapki health ka ek digital naksha banata hai. Is scan se hum aapke digestive fire (Agni) aur toxins (Ama) ka level detect karte hain.",
    sections: [
      {
        title: "Kyu zaroori hai ye Scan?",
        points: [
          { head: "Agni Efficiency", text: "Janiye kya aapka pachan (digestion) energy banane ke liye taiyar hai ya nahi.", icon: <Activity className="w-6 h-6" /> },
          { head: "Dosha Balancing", text: "Vata, Pitta aur Kapha ke imbalance ko pehchanein isse pehle ki woh bimari bane.", icon: <Heart className="w-6 h-6" /> }
        ]
      },
      {
        title: "AI Precision Benefits",
        points: [
          { head: "Personalized Roadmap", text: "Har user ke liye unique diet aur lifestyle plan.", icon: <Zap className="w-6 h-6" />, isHighlighted: true },
          { head: "Root Cause Analysis", text: "Sirf symptoms nahi, unki asli wajah (Root Cause) ko target karein.", icon: <BarChart className="w-6 h-6" /> }
        ]
      }
    ]
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showOtherModal, setShowOtherModal] = useState<{ field: string, isOpen: boolean } | null>(null);
  const [tempOtherInput, setTempOtherInput] = useState('');

  const toggleSelection = (field: string, value: string) => {
    if (value === 'Other') {
      setShowOtherModal({ field, isOpen: true });
      setTempOtherInput('');
      return;
    }
    setInputs(prev => {
      const current = (prev as any)[field] as string[];
      const exists = current.includes(value);
      if (exists) {
        return { ...prev, [field]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSymptomDetail = (symptom: string, type: 'severity' | 'duration', value: string) => {
    setInputs(prev => ({
      ...prev,
      symptomDetails: {
        ...prev.symptomDetails,
        [symptom]: {
          ...prev.symptomDetails[symptom],
          [type]: value
        }
      }
    }));
  };

  const handleOtherConfirm = () => {
    if (!tempOtherInput.trim() || !showOtherModal) return;
    const { field } = showOtherModal;
    const finalVal = tempOtherInput.trim();
    
    setInputs(prev => {
      const current = (prev as any)[field] as string[];
      if (!current.includes(finalVal)) {
        return { ...prev, [field]: [...current, finalVal] };
      }
      return prev;
    });
    
    setShowOtherModal(null);
  };

  const validateStep = () => {
    switch(step) {
      case 1:
        if (!inputs.name || !inputs.age || !inputs.height || !inputs.weight) return "Please fill all details";
        break;
      case 2:
        if (inputs.symptoms.length === 0) return "Kam se kam 1 symptom select karein ya 'None' chunein";
        break;
      case 3:
        if (inputs.diseases.length === 0) return "Please select health history";
        break;
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep(prev => Math.min(prev + 1, totalSteps));
  };
  
  const prevStep = () => {
    setError(null);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!userData?.uid) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'health_scan',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false
      }));
      navigate('/auth');
      return;
    }
    setLoading(true);
    try {
      const profileId = await saveProfileLocally({
        uid: userData.uid,
        type: 'health_scan',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false
      });
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err) {
      console.error(err);
      setError("Analysis start nahi ho paya. Dobara koshish karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen pb-32 bg-[#F8FAFC]">
      {/* Premium HUD Header */}
      <div className="sticky top-0 z-50 px-6 py-6 bg-white/70 backdrop-blur-3xl border-b border-black/5 flex items-center justify-between">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={step > 1 ? prevStep : () => navigate('/')} 
          className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600 mb-1">Bio-Sync In Progress</span>
          <div className="flex gap-1.5">
            {[1,2,3,4,5].map(i => (
              <motion.div 
                key={i} 
                animate={{ 
                  width: i === step ? 32 : 8,
                  backgroundColor: i <= step ? '#059669' : '#E2E8F0'
                }}
                className="h-2 rounded-full" 
              />
            ))}
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
           <Activity className="w-5 h-5 animate-pulse" />
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-10"
          >
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tighter text-black leading-tight">
                    Basic Info <br/>
                    <span className="text-emerald-600">(Shuruat Karein)</span>
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">Personalize your analysis with basic details.</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-900/5 space-y-6 border border-white">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Full Name</label>
                    <input 
                      type="text" 
                      value={inputs.name}
                      onChange={(e) => setInputs({...inputs, name: e.target.value})}
                      placeholder="Aapka Poora Naam"
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-5 px-6 outline-none transition-all font-bold text-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Age</label>
                      <input 
                        type="number" 
                        value={inputs.age}
                        onChange={(e) => setInputs({...inputs, age: e.target.value})}
                        placeholder="Umra"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-5 px-6 outline-none transition-all font-bold text-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Gender</label>
                      <select 
                        value={inputs.gender}
                        onChange={(e) => setInputs({...inputs, gender: e.target.value})}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-5 px-6 outline-none transition-all font-bold text-black appearance-none"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Height (cm)</label>
                      <input 
                        type="number" 
                        value={inputs.height}
                        onChange={(e) => setInputs({...inputs, height: e.target.value})}
                        placeholder="Lambai"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-5 px-6 outline-none transition-all font-bold text-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-4">Weight (kg)</label>
                      <input 
                        type="number" 
                        value={inputs.weight}
                        onChange={(e) => setInputs({...inputs, weight: e.target.value})}
                        placeholder="Vazan"
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-2xl py-5 px-6 outline-none transition-all font-bold text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Symptoms */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tighter text-black leading-tight">
                    Body Signals <br/>
                    <span className="text-emerald-600">(Kya Mehsoos ho raha hai?)</span>
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">Select points that describe your current state.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {SYMPTOMS_OPTIONS.map(opt => {
                    const isSelected = inputs.symptoms.includes(opt);
                    return (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        key={opt}
                        onClick={() => toggleSelection('symptoms', opt)}
                        className={cn(
                          "px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border-2",
                          isSelected 
                            ? "bg-black text-white border-black shadow-xl" 
                            : "bg-white text-gray-500 border-gray-100 hover:border-emerald-200"
                        )}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {inputs.symptoms.filter(s => s !== 'Other').map(s => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={s} 
                      className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl space-y-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                           <Activity className="w-5 h-5" />
                        </div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-black">{s}</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Kitna Gehra Hai? (Severity)</p>
                          <div className="grid grid-cols-3 gap-2">
                            {['mild', 'moderate', 'severe'].map(v => (
                              <button
                                key={v}
                                onClick={() => handleSymptomDetail(s, 'severity', v)}
                                className={cn(
                                  "py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest border-2 transition-all",
                                  inputs.symptomDetails[s]?.severity === v 
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                                    : "bg-gray-50 text-gray-400 border-transparent hover:border-emerald-100"
                                )}
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Health History */}
            {step === 3 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tighter text-black leading-tight">
                    Health Archive <br/>
                    <span className="text-emerald-600">(Pichli Bimariyan)</span>
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">Historical data helps AI understand deep-seated patterns.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Known Diseases (Maujooda Bimariyan)</label>
                    <div className="flex flex-wrap gap-2">
                      {DISEASES_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleSelection('diseases', opt)}
                          className={cn(
                            "px-5 py-3 rounded-2xl font-bold text-xs transition-all border-2",
                            inputs.diseases.includes(opt) 
                              ? "bg-black text-white border-black shadow-lg" 
                              : "bg-gray-50 text-gray-500 border-transparent hover:border-emerald-100"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Family History (Khandani bimari?)</label>
                    <div className="flex flex-wrap gap-2">
                      {FAMILY_HISTORY_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => toggleSelection('familyHistory', opt)}
                          className={cn(
                            "px-5 py-3 rounded-2xl font-bold text-xs transition-all border-2",
                            inputs.familyHistory.includes(opt) 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                              : "bg-gray-50 text-gray-500 border-transparent hover:border-emerald-100"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Past Surgeries or Major Issues?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(v => (
                        <button
                          key={v}
                          onClick={() => setInputs({...inputs, medicalHistory: v})}
                          className={cn(
                            "py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all",
                            inputs.medicalHistory === v ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-transparent"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    {inputs.medicalHistory === 'Yes' && (
                      <motion.input 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="text" 
                        value={inputs.medicalHistoryDetail}
                        onChange={(e) => setInputs({...inputs, medicalHistoryDetail: e.target.value})}
                        placeholder="Please describe briefly..."
                        className="w-full bg-gray-50 border-2 border-emerald-100 focus:border-emerald-500 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-bold text-black"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Lifestyle */}
            {step === 4 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tighter text-black leading-tight">
                    Lifestyle Habits <br/>
                    <span className="text-emerald-600">(Zindagi Jeene ka Tarika)</span>
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">Understand your daily patterns.</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Stress Level (Tanav)</label>
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Level</span>
                       <span className="text-3xl font-black text-emerald-600">{inputs.stressLevel}/10</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      value={inputs.stressLevel}
                      onChange={(e) => setInputs({...inputs, stressLevel: parseInt(e.target.value)})}
                      className="w-full h-3 bg-emerald-100 rounded-full appearance-none outline-none cursor-pointer accent-emerald-600"
                    />
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                      <span>Bilkul Relax</span>
                      <span>Adjusting</span>
                      <span>Extreme Burnout</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Activity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Sedentary', 'Moderate', 'Active'].map(v => (
                        <button
                          key={v}
                          onClick={() => setInputs({...inputs, activityLevel: v})}
                          className={cn(
                            "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
                            inputs.activityLevel === v ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-transparent"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Diet */}
            {step === 5 && (
              <div className="space-y-8">
                <div className="space-y-3">
                  <h1 className="text-4xl font-black tracking-tighter text-black leading-tight">
                    Dietary Patterns <br/>
                    <span className="text-emerald-600">(Khane-Peene ki Aadtein)</span>
                  </h1>
                  <p className="text-gray-500 font-medium leading-relaxed">Fueled by nature or habit?</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Junk Food Frequency (Bahri Khana?)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['Rare', 'Weekly', 'Frequent'].map(v => (
                        <button
                          key={v}
                          onClick={() => setInputs({...inputs, junkFood: v})}
                          className={cn(
                            "py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all",
                            inputs.junkFood === v ? "bg-black text-white border-black shadow-lg" : "bg-gray-50 text-gray-400 border-transparent"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Water Intake (Pani kitna?)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['<1L', '1–2L', '2–3L', '3L+'].map(v => (
                        <button
                          key={v}
                          onClick={() => setInputs({...inputs, waterIntake: v})}
                          className={cn(
                            "py-4 rounded-xl font-black text-[10px] uppercase border-2 transition-all",
                            inputs.waterIntake === v ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" : "bg-gray-50 text-gray-400 border-transparent"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 pl-2">Intense Sugar Cravings?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Yes', 'No'].map(v => (
                        <button
                          key={v}
                          onClick={() => setInputs({...inputs, sugarCravings: v})}
                          className={cn(
                            "py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all",
                            inputs.sugarCravings === v ? "bg-black text-white border-black" : "bg-gray-50 text-gray-400 border-transparent"
                          )}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">
               <AlertCircle className="w-6 h-6" />
            </div>
            <p className="font-black uppercase tracking-widest text-[10px]">{error}</p>
          </motion.div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={prevStep}
              className="flex-1 py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 bg-white border-2 border-black/5 text-black hover:bg-black hover:text-white transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
              Piche Jayein
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={step === totalSteps ? handleSubmit : nextStep}
            disabled={loading}
            className="flex-[2] py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-3xl transition-all relative overflow-hidden group"
            style={{ backgroundColor: step === totalSteps ? '#059669' : '#000000', color: '#ffffff' }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (step === totalSteps ? <Sparkles className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />)}
            {step === totalSteps ? 'Final Scan Metrics' : 'Agla Step'}
          </motion.button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
             <div className="h-1 w-12 bg-gray-200 rounded-full" />
             <p className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">Powered by Ayurzenix Core AI engine</p>
        </div>

        {/* Global Stats Footer */}
        <div className="mt-24 bg-white/50 backdrop-blur-xl border border-black/5 rounded-[3rem] p-10 overflow-hidden relative">
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className="w-24 h-24 rounded-full border-8 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center animate-spin-slow">
                 <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <CheckCircle2 className="w-8 h-8" />
                 </div>
              </div>
              <div className="space-y-2 text-center md:text-left">
                 <h4 className="text-2xl font-black tracking-tighter">Your Health is Confidential.</h4>
                 <p className="text-gray-500 text-sm font-medium">Aapka data encrypted hai. Hum sirf personalized reports banane ke liye algorithm use karte hain.</p>
              </div>
           </div>
        </div>

        {/* Blog Styling Improvement */}
        <div className="mt-32 space-y-20 border-t border-gray-100 pt-20">
          <div className="space-y-8">
            <h2 className="text-5xl font-black tracking-tighter text-black leading-[1.1]">
              {SMART_SCAN_BLOG.title}
            </h2>
            <div className="pl-8 border-l-[6px] border-emerald-500">
              <p className="text-xl text-gray-600 leading-relaxed font-bold italic">
                {SMART_SCAN_BLOG.intro}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {SMART_SCAN_BLOG.sections.map((section, idx) => (
              <div key={idx} className="space-y-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl transition-all hover:-translate-y-2">
                <h3 className="text-xs font-black text-emerald-600 uppercase tracking-[0.4em]">{section.title}</h3>
                <div className="space-y-8">
                  {section.points.map((point, pIdx) => (
                    <div key={pIdx} className="flex gap-6">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                        point.isHighlighted ? "bg-emerald-600 text-white shadow-2xl shadow-emerald-500/30" : "bg-gray-50 text-gray-400"
                      )}>
                        {point.icon}
                      </div>
                      <div className="space-y-1">
                        <p className="font-black text-lg text-black tracking-tight">{point.head}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{point.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Premium Other Input Modal */}
    <AnimatePresence>
      {showOtherModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowOtherModal(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-3xl"
          >
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight text-black">Kuch aur batana chahenge?</h3>
                <p className="text-gray-500 text-sm font-medium">Apne symptom ya condition ko detail mein niche likhein.</p>
              </div>
              
              <div className="space-y-4">
                <textarea
                  autoFocus
                  value={tempOtherInput}
                  onChange={(e) => setTempOtherInput(e.target.value)}
                  placeholder="Yahan type karein..."
                  className="w-full h-32 bg-gray-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white rounded-[2rem] p-6 outline-none transition-all font-bold text-black resize-none"
                />
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowOtherModal(null)}
                    className="flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleOtherConfirm}
                    className="flex-[2] py-4 rounded-2xl bg-black text-white font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                  >
                    Add to Scan
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
