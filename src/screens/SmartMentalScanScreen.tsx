import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  Brain, 
  Sparkles, 
  ChevronRight,
  Zap,
  Moon,
  Wind,
  Shield,
  Activity,
  User,
  Heart,
  Droplets,
  Sun,
  Camera,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { saveProfileLocally } from '../lib/localHistory';
import { analyzeMentalIntelligence } from '../services/geminiService';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

interface SmartMentalScanScreenProps {
  userData: any;
  appConfig?: any;
}

const STEPS = [
  { id: 'start', title: 'Intelligence Analyzer' },
  { id: 'profile', title: 'Bio-Dynamics' },
  { id: 'stress', title: 'Stress Matrix' },
  { id: 'anxiety', title: 'Nervous System' },
  { id: 'recovery', title: 'Regeneration' },
  { id: 'emotional', title: 'Emotional Grid' },
  { id: 'gunas', title: 'Consciousness' },
  { id: 'lifestyle', title: 'Digital Toxins' },
  { id: 'scan', title: 'AI Neural Scan' }
];

export default function SmartMentalScanScreen({ userData, appConfig }: SmartMentalScanScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [stepIndex, setStepIndex] = useState(0);
  const [inputs, setInputs] = useState({
    // Step 1: Basic Profile
    age: '',
    gender: '',
    occupation: '',
    workStyle: '', 
    relationshipStatus: '',
    lifestyleType: '', 
    activityLevel: 50,

    // Step 2: Stress Pattern
    stressFrequency: '', 
    stressIntensity: 50,
    stressTriggers: '',
    workPressure: 50,
    overthinkingFrequency: 50,
    emotionalOverwhelm: 50,
    mentalFatigue: 50,
    inabilityToRelax: 50,

    // Step 3: Anxiety & Nervous System
    racingThoughts: 50,
    panicSensations: 50,
    chestTightness: 50,
    heartbeatAwareness: false,
    socialAnxiety: 50,
    fearPatterns: '',
    futureWorrying: 50,
    mentalRestlessness: 50,

    // Step 4: Sleep & Recovery
    sleepQuality: 50,
    sleepTiming: '',
    insomnia: false,
    midnightWaking: false,
    nightmares: false,
    morningEnergy: 50,
    screenExposureBeforeSleep: 50,

    // Step 5: Emotional & Behavioral
    moodSwings: 50,
    emotionalSensitivity: 50,
    irritability: 50,
    angerFrequency: 50,
    loneliness: 50,
    emotionalSuppression: 50,
    emotionalEating: false,
    motivationLevels: 50,

    // Step 6: Sattva / Rajas / Tamas
    calmnessLevel: 50,
    aggression: 50,
    mentalClarity: 50,
    spiritualConnection: 50,
    distractionTendency: 50,
    mindfulnessHabits: '',

    // Step 7: Lifestyle & Digital
    socialMediaUsage: 50,
    screenTime: '',
    caffeineIntake: 50,
    workHours: '',
    financialStress: 50,
    sunlightExposure: 50,
    breathingPracticeFrequency: '',

    // Step 8: AI Scan
    selfieImage: null as string | null,
    voiceSample: null as string | null,
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);
  const processingStages = [
    "Mapping Nervous System Signals...",
    "Decoding Emotional Energy Particles...",
    "Analyzing Stress Pattern Matrices...",
    "Balancing Sattva, Rajas, and Tamas...",
    "Calculating Cortisol Impact Variance...",
    "Generating Mental Resilience Profile...",
    "Finalizing Intelligence Report..."
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stepIndex]);

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setProcessingStage(prev => (prev < processingStages.length - 1 ? prev + 1 : prev));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  const handleNext = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      await finalizeAnalysis();
    }
  };

  const finalizeAnalysis = async () => {
    setAnalyzing(true);
    try {
      // API Analysis
      const analysis = await analyzeMentalIntelligence(inputs, userData?.language || 'English');
      
      const profileId = await saveProfileLocally({
        uid: userData.uid,
        type: 'smart_mental_scan',
        inputs,
        analysis,
        planId: 'pro',
        price: 0,
        isPaid: false
      });

      // Sync to Firestore
      if (userData?.uid && !userData.is_guest) {
        const profileRef = doc(db, 'health_profiles', profileId);
        try {
          await setDoc(profileRef, {
            id: profileId,
            uid: userData.uid,
            type: 'smart_mental_scan',
            inputs,
            analysis,
            planId: 'pro',
            price: 0,
            isPaid: false,
            createdAt: Date.now()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, profileRef.path);
        }
      }

      navigate(`/smart-mental-scan/result/${profileId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (STEPS[stepIndex].id) {
      case 'start':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center space-y-12 py-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 rounded-full blur-[80px] opacity-20 animate-pulse" />
              <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center relative z-10">
                <Brain className="w-16 h-16 text-purple-600" />
              </div>
            </div>
            <div className="space-y-6 max-w-sm px-6">
              <h1 className="text-4xl font-black tracking-tight text-black leading-tight">
                Decode Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-teal-500">Emotional Intelligence</span>
              </h1>
              <p className="text-stone-500 font-medium text-lg leading-relaxed">
                Ayurzenix AI analyzes your stress patterns, emotional energy, nervous system signals, and Ayurvedic mind-body balance.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full px-6">
              {[
                { icon: <Activity className="w-4 h-4" />, label: 'Stress Patterns' },
                { icon: <Shield className="w-4 h-4" />, label: 'Mental Resilience' },
                { icon: <Moon className="w-4 h-4" />, label: 'Sleep Quality' },
                { icon: <Droplets className="w-4 h-4" />, label: 'Guna Balance' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100/50 shadow-sm gpu-accelerated transition-transform active:scale-[0.98]">
                  <div className="p-2 bg-white rounded-xl shadow-sm text-purple-600">{item.icon}</div>
                  <span className="text-xs font-black text-stone-700 uppercase tracking-widest">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'profile':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Foundation</h2>
              <p className="text-stone-500 font-medium">Tell us about your lifestyle rhythms.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Biological Age & Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="number"
                    placeholder="Age"
                    value={inputs.age}
                    onChange={(e) => setInputs(i => ({ ...i, age: e.target.value }))}
                    className="p-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold focus:border-purple-500 focus:bg-white outline-none transition-all"
                  />
                  <select 
                    value={inputs.gender}
                    onChange={(e) => setInputs(i => ({ ...i, gender: e.target.value }))}
                    className="p-4 bg-stone-50 border border-stone-100 rounded-2xl font-bold focus:border-purple-500 focus:bg-white outline-none transition-all"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Occupation & Work Dynamics</label>
                <div className="grid grid-cols-2 gap-4">
                   {['Remote', 'Office', 'Field', 'Academic'].map(type => (
                     <button
                       key={type}
                       onClick={() => setInputs(i => ({ ...i, workStyle: type }))}
                       className={cn(
                         "p-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest",
                         inputs.workStyle === type
                           ? "border-purple-600 bg-purple-50 text-purple-900"
                           : "border-stone-50 bg-stone-50 text-stone-500 hover:border-stone-200"
                       )}
                     >
                       {type}
                     </button>
                   ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'stress':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Stress Patterns</h2>
              <p className="text-stone-500 font-medium">Decode the intensity of current pressure.</p>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Stress Intensity</label>
                   <span className="text-lg font-black text-amber-600">{inputs.stressIntensity}%</span>
                </div>
                <input 
                  type="range"
                  value={inputs.stressIntensity}
                  onChange={(e) => setInputs(i => ({ ...i, stressIntensity: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-6 bg-stone-50 p-6 rounded-[2rem] border border-stone-100">
                    {[
                      { key: 'overthinkingFrequency', label: 'Overthinking' },
                      { key: 'mentalFatigue', label: 'Mental Fatigue' },
                      { key: 'inabilityToRelax', label: 'Restlessness' }
                    ].map((item) => (
                      <div key={item.key} className="space-y-3">
                         <div className="flex justify-between text-[10px] font-black uppercase text-stone-400">
                           <span>{item.label}</span>
                           <span>{(inputs as any)[item.key]}%</span>
                         </div>
                         <input 
                           type="range" 
                           value={(inputs as any)[item.key]}
                           onChange={(e) => setInputs(i => ({ ...i, [item.key]: parseInt(e.target.value) }))}
                           className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-amber-500"
                         />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        );

      case 'anxiety':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                <Wind className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Nervous System</h2>
              <p className="text-stone-500 font-medium">Monitoring autonomic responses.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {[
                 { key: 'racingThoughts', label: 'Racing Thoughts' },
                 { key: 'panicSensations', label: 'Panic State' },
                 { key: 'chestTightness', label: 'Chest Tightness' },
                 { key: 'futureWorrying', label: 'Future Phobia' }
               ].map((item) => (
                 <div key={item.key} className="p-6 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-sm gpu-accelerated space-y-4">
                    <div className="flex justify-between items-end">
                       <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-tight">{item.label}</label>
                       <span className="text-xs font-black text-emerald-600">{(inputs as any)[item.key]}%</span>
                    </div>
                    <input 
                      type="range"
                      value={(inputs as any)[item.key]}
                      onChange={(e) => setInputs(i => ({ ...i, [item.key]: parseInt(e.target.value) }))}
                      className="w-full h-1.5 bg-white rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                 </div>
               ))}
            </div>
          </div>
        );

      case 'recovery':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Moon className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Sleep & Vitality</h2>
              <p className="text-stone-500 font-medium">Assessing recovery and circadian rest.</p>
            </div>

            <div className="space-y-8">
               <div className="p-10 bg-stone-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 gpu-accelerated">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-[100px] opacity-20" />
                  <div className="relative z-10 space-y-6 text-center">
                     <p className="text-[11px] font-black text-blue-300 uppercase tracking-[0.2em]">Sleep Quality Score</p>
                     <div className="text-6xl font-black">{inputs.sleepQuality}%</div>
                     <input 
                       type="range"
                       value={inputs.sleepQuality}
                       onChange={(e) => setInputs(i => ({ ...i, sleepQuality: parseInt(e.target.value) }))}
                       className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'insomnia', icon: <Moon className="w-4 h-4" />, label: 'Insomnia' },
                    { key: 'midnightWaking', icon: <Activity className="w-4 h-4" />, label: 'Night Waking' }
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setInputs(i => ({ ...i, [item.key]: !(i as any)[item.key] }))}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all text-left space-y-4",
                        (inputs as any)[item.key] ? "border-blue-600 bg-blue-50 text-blue-900" : "border-stone-50 bg-stone-50 text-stone-500"
                      )}
                    >
                      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", (inputs as any)[item.key] ? "bg-blue-600 text-white" : "bg-white")}>
                        {item.icon}
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest leading-snug">{item.label}</p>
                    </button>
                  ))}
               </div>
            </div>
          </div>
        );

      case 'emotional':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="space-y-2">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Emotional Grid</h2>
              <p className="text-stone-500 font-medium">Tracking sensitivity and stability markers.</p>
            </div>

            <div className="space-y-8">
               {[
                 { key: 'moodSwings', label: 'Mood Volatility', icon: <Activity className="w-4 h-4 text-red-400" /> },
                 { key: 'emotionalSensitivity', label: 'Empathetic Strain', icon: <Heart className="w-4 h-4 text-pink-400" /> }
               ].map((item) => (
                 <div key={item.key} className="space-y-4 p-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-stone-50 rounded-xl">{item.icon}</div>
                          <h3 className="text-xs font-black uppercase tracking-widest text-stone-900">{item.label}</h3>
                       </div>
                       <span className="text-lg font-black text-stone-950">{(inputs as any)[item.key]}%</span>
                    </div>
                    <input 
                      type="range"
                      value={(inputs as any)[item.key]}
                      onChange={(e) => setInputs(i => ({ ...i, [item.key]: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-stone-900"
                    />
                 </div>
               ))}
            </div>
          </div>
        );

      case 'gunas':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="space-y-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Consciousness</h2>
              <p className="text-stone-500 font-medium">Mapping Guna (Sattva, Rajas, Tamas) states.</p>
            </div>

            <div className="space-y-6">
                <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
                   <div className="relative z-10 space-y-6">
                      <div className="space-y-2 text-center">
                         <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Primary Mental Clarity</p>
                         <h3 className="text-6xl font-black">{inputs.calmnessLevel}%</h3>
                      </div>
                      <input 
                        type="range"
                        value={inputs.calmnessLevel}
                        onChange={(e) => setInputs(i => ({ ...i, calmnessLevel: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer accent-white"
                      />
                   </div>
                </div>
            </div>
          </div>
        );

      case 'lifestyle':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="space-y-2">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
                <Sun className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-black">Digital Toxins</h2>
              <p className="text-stone-500 font-medium">Identifying external stress amplifiers.</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3 bg-white p-6 rounded-[2rem] border border-stone-100">
                   <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-900">Social Media Intensity</label>
                      <span className="text-xs font-black text-stone-600">{inputs.socialMediaUsage}%</span>
                   </div>
                   <input 
                      type="range"
                      value={inputs.socialMediaUsage}
                      onChange={(e) => setInputs(i => ({ ...i, socialMediaUsage: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-stone-50 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                </div>
            </div>
          </div>
        );

      case 'scan':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 py-6">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-[2rem] mx-auto flex items-center justify-center text-white shadow-xl shadow-purple-200">
                <Camera className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-black">AI Neural Scan</h2>
              <p className="text-stone-500 font-medium px-6 leading-relaxed">
                Provide a face scan for micro-expression stress detection.
              </p>
            </div>

            <div className="space-y-6">
               <button className="w-full p-8 bg-stone-900 rounded-[2.5rem] border-2 border-stone-800 flex flex-col items-center gap-4 hover:border-purple-500 transition-all">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                     <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                     <p className="text-sm font-black text-white uppercase tracking-widest">Capture Intelligence</p>
                     <p className="text-[10px] font-medium text-stone-400 mt-1">Experimental Stress Mapping</p>
                  </div>
               </button>
            </div>

            <div className="p-6 bg-purple-50 rounded-[2rem] border border-purple-100 flex gap-4">
               <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
               <p className="text-xs font-bold text-purple-700 leading-relaxed">
                 AI analysis of facial micro-vasculature markers can indicate elevated cortisol patterns.
               </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (analyzing) {
    return (
       <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
         
         <div className="relative z-10 space-y-12 w-full max-w-sm">
            <div className="relative mx-auto w-32 h-32">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 border-2 border-white/5 border-t-purple-500 rounded-full" 
               />
               <Brain className="w-12 h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="space-y-4">
               <h2 className="text-2xl font-black text-white tracking-tight uppercase">AI Deep Analysis</h2>
               <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(processingStage + 1) * (100 / processingStages.length)}%` }}
                    className="h-full bg-gradient-to-r from-purple-600 to-teal-500"
                  />
               </div>
               <p className="text-purple-300 font-bold text-xs tracking-wide">
                 {processingStages[processingStage]}
               </p>
            </div>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32 gpu-accelerated">
       <div className="px-6 pt-12 pb-6 sticky top-0 bg-white/90 backdrop-blur-2xl z-30 flex items-center justify-between border-b border-black/5">
        <button 
          onClick={() => stepIndex > 0 ? setStepIndex(stepIndex - 1) : navigate(-1)} 
          className="p-2 hover:bg-stone-100 rounded-full"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black uppercase tracking-widest text-stone-900">
            {STEPS[stepIndex].title}
          </h1>
          <div className="flex gap-1 mt-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className={cn("h-1 rounded-full transition-all", i === stepIndex ? "w-4 bg-purple-600" : "w-1 bg-stone-200")} />
            ))}
          </div>
        </div>
        <div className="w-10" />
      </div>

      <div className="px-6 mt-8">
        {renderStep()}
      </div>

      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40 backdrop-blur-sm">
        <button 
          onClick={handleNext}
          className={cn(
            "w-full py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl",
            stepIndex === 0 ? "bg-stone-900 text-white shadow-stone-200" : "bg-purple-600 text-white shadow-purple-200"
          )}
        >
          {stepIndex === 0 ? 'Initialize Analysis' : stepIndex === STEPS.length - 1 ? 'Generate Intelligence' : 'Continue Workflow'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
