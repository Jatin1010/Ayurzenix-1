import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Moon, 
  Sparkles, 
  Brain, 
  Clock, 
  Zap, 
  AlertCircle,
  Heart,
  Droplets,
  Activity,
  User,
  Coffee,
  Sun,
  Camera,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import LoadingYogi from '../components/LoadingYogi';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProfileLocally } from '../lib/localHistory';

const STEPS = [
  'Foundation',
  'Architecture',
  'Neural Balance',
  'Circadian Pulse',
  'Dream Space',
  'Emotional Load',
  'Vedic Blueprint',
  'Neural Scan'
];

export default function SleepIntelligenceScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputs, setInputs] = useState({
    // Step 1: Basic
    age: '',
    gender: '',
    occupation: '',
    lifestyleType: 'Active',
    
    // Step 2: Architecture
    sleepDuration: 7,
    sleepQuality: 70,
    difficultyFallingAsleep: 'Sometimes',
    wakingFrequency: '1-2 times',
    morningTiredness: 50,
    
    // Step 3: Neural Balance
    racingThoughts: 60,
    nightAnxiety: 30,
    mentalRestlessness: 50,
    relaxationAbility: 40,
    
    // Step 4: Circadian Pulse
    bedtimeConsistency: 70,
    lateNightScreens: 80,
    sunlightExposure: 40,
    caffeineTiming: 'Afternoon',
    lateEating: 'Frequently',
    
    // Step 5: Dream Space
    vividDreams: 40,
    nightmares: 20,
    refreshedFeeling: 50,
    mentalClarity: 60,
    
    // Step 6: Emotional Load
    stressLevel: 70,
    burnoutRisk: 40,
    emotionalSensitivity: 50,
    
    // Step 7: Vedic Blueprint
    vataDisturbance: 60,
    pittaHeat: 30,
    kaphaSluggishness: 40,
    meditationFrequency: 'Rarely',
    
    // Step 8: Scan
    hasFaceScan: false,
    hasWatchScan: false
  });

  const handleNext = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
      window.scrollTo(0, 0);
    } else {
      generateIntelligence();
    }
  };

  const generateIntelligence = async () => {
    if (!userData?.uid || userData?.is_guest) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        ...inputs,
        type: 'sleep_intelligence',
        planId: 'basic',
        isPaid: false,
        price: 0
      }));
      navigate('/auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      const profileData = {
        ...inputs,
        type: 'sleep_intelligence',
        uid: userData.uid,
        planId: 'basic',
        isPaid: false,
        createdAt: new Date().toISOString()
      };

      const docId = await saveProfileLocally(profileData);
      
      // Artificial delay for cinematic effect
      setTimeout(() => {
        navigate(`/analysis-pricing/${docId}`);
      }, 4000);
      
    } catch (error) {
      console.error("Analysis generation error:", error);
      setIsProcessing(false);
    }
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Foundation</h2>
              <p className="text-stone-400 text-sm font-medium italic">Mapping your biological baseline.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4">Age</label>
                <input 
                  type="number"
                  placeholder="25"
                  value={inputs.age}
                  onChange={(e) => setInputs({...inputs, age: e.target.value})}
                  className="w-full bg-stone-50 border-stone-100 rounded-[2rem] p-6 text-xl font-black outline-none focus:ring-4 focus:ring-purple-100 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInputs({...inputs, gender: opt})}
                      className={cn(
                        "flex-1 p-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border",
                        inputs.gender === opt ? "bg-stone-900 text-white border-stone-900 shadow-xl" : "bg-white text-stone-400 border-stone-100 hover:bg-stone-50"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4">Lifestyle Pattern</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Sedentary', 'Active', 'Strenuous', 'Athlete'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setInputs({...inputs, lifestyleType: opt})}
                      className={cn(
                        "p-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border h-24 flex flex-col items-center justify-center gap-2",
                        inputs.lifestyleType === opt ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-100" : "bg-white text-stone-400 border-stone-100"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Architecture</h2>
              <p className="text-stone-400 text-sm font-medium italic">Analyzing the structural integrity of your rest.</p>
            </div>

            <div className="space-y-10">
               <div className="p-8 bg-stone-50 rounded-[3rem] border border-stone-100 space-y-6">
                 <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Sleep Duration</label>
                    <span className="text-2xl font-black text-purple-600">{inputs.sleepDuration} <span className="text-xs uppercase">Hrs</span></span>
                 </div>
                 <input 
                   type="range" min="3" max="12" step="0.5"
                   value={inputs.sleepDuration}
                   onChange={(e) => setInputs({...inputs, sleepDuration: parseFloat(e.target.value)})}
                   className="w-full accent-purple-600 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer"
                 />
               </div>

               <div className="p-8 bg-stone-900 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full blur-[100px] opacity-20" />
                  <div className="relative z-10 space-y-6 text-center">
                     <p className="text-[11px] font-black text-purple-300 uppercase tracking-[0.3em]">Sleep Quality IQ</p>
                     <div className="text-6xl font-black italic">{inputs.sleepQuality}%</div>
                     <input 
                       type="range" min="0" max="100"
                       value={inputs.sleepQuality}
                       onChange={(e) => setInputs({...inputs, sleepQuality: parseInt(e.target.value)})}
                       className="w-full accent-purple-400 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4">Morning State</label>
                 <div className="grid grid-cols-1 gap-3">
                   {['Exhausted', 'Slightly Groggy', 'Balanced', 'Deeply Restored'].map(opt => (
                     <button
                       key={opt}
                       onClick={() => setInputs({...inputs, difficultyFallingAsleep: opt})}
                       className={cn(
                         "p-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all border text-left flex justify-between items-center group",
                         inputs.difficultyFallingAsleep === opt ? "bg-purple-50 border-purple-200 text-purple-700 shadow-sm" : "bg-white border-stone-100 text-stone-400"
                       )}
                     >
                       {opt}
                       <div className={cn("w-2 h-2 rounded-full transition-all", inputs.difficultyFallingAsleep === opt ? "bg-purple-600 scale-125" : "bg-stone-100 group-hover:bg-stone-200")} />
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Neural Balance</h2>
              <p className="text-stone-400 text-sm font-medium italic">Measuring mental static and sympathetic arousal.</p>
            </div>

            <div className="space-y-8">
              {[
                { key: 'racingThoughts', label: 'Mid-night Racing Thoughts' },
                { key: 'nightAnxiety', label: 'Night-time Body Anxiety' },
                { key: 'mentalRestlessness', label: 'Cognitive Inability to Unplug' }
              ].map(item => (
                <div key={item.key} className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-tight">{item.label}</label>
                    <span className="text-xs font-black text-purple-600">{(inputs as any)[item.key]}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100"
                    value={(inputs as any)[item.key]}
                    onChange={(e) => setInputs({...inputs, [item.key]: parseInt(e.target.value)})}
                    className="w-full accent-purple-600 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Circadian Pulse</h2>
              <p className="text-stone-400 text-sm font-medium italic">Alignment with the solar and biological clock.</p>
            </div>

            <div className="space-y-10">
               <div className="p-8 bg-stone-950 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-[120px] opacity-10" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3 text-amber-400">
                      <Sun className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sun Exposure</span>
                    </div>
                    <div className="text-5xl font-black">{inputs.sunlightExposure}%</div>
                    <input 
                       type="range" min="0" max="100"
                       value={inputs.sunlightExposure}
                       onChange={(e) => setInputs({...inputs, sunlightExposure: parseInt(e.target.value)})}
                       className="w-full accent-amber-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-4">Caffeine Habit</label>
                 <div className="grid grid-cols-2 gap-3">
                   {['None', 'Morning', 'Afternoon', 'Late Night'].map(opt => (
                     <button
                       key={opt}
                       onClick={() => setInputs({...inputs, caffeineTiming: opt})}
                       className={cn(
                         "p-6 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border flex flex-col items-center gap-3",
                         inputs.caffeineTiming === opt ? "bg-stone-900 text-white border-stone-900 shadow-lg" : "bg-white text-stone-400 border-stone-100"
                       )}
                     >
                        <Coffee className={cn("w-5 h-5", inputs.caffeineTiming === opt ? "text-amber-400" : "text-stone-200")} />
                        {opt}
                     </button>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Dream Space</h2>
              <p className="text-stone-400 text-sm font-medium italic">Analyzing subconscious activity and REM quality.</p>
            </div>

            <div className="space-y-8">
              {[
                { key: 'vividDreams', label: 'Frequency of Vivid Recall' },
                { key: 'nightmares', label: 'Presence of Night Terrors' },
                { key: 'refreshedFeeling', label: 'Post-Dream Morning Vitality' }
              ].map(item => (
                <div key={item.key} className="p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-tight">{item.label}</label>
                    <span className="text-xs font-black text-purple-600">{(inputs as any)[item.key]}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100"
                    value={(inputs as any)[item.key]}
                    onChange={(e) => setInputs({...inputs, [item.key]: parseInt(e.target.value)})}
                    className="w-full accent-purple-600 h-1 bg-stone-200 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-12">
             <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Emotional Load</h2>
              <p className="text-stone-400 text-sm font-medium italic">Impact of psycho-emotional pressure on Nidra.</p>
            </div>

            <div className="space-y-6">
               <div className="p-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-rose-100 uppercase tracking-[0.3em]">Burnout Risk Index</p>
                      <AlertCircle className="w-5 h-5 text-rose-200" />
                    </div>
                    <div className="text-6xl font-black tracking-tighter">{inputs.burnoutRisk}%</div>
                    <input 
                       type="range" min="0" max="100"
                       value={inputs.burnoutRisk}
                       onChange={(e) => setInputs({...inputs, burnoutRisk: parseInt(e.target.value)})}
                       className="w-full accent-white h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                     />
                  </div>
               </div>

               <div className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Daily Stress Baseline</label>
                    <span className="text-xl font-black text-rose-600">{inputs.stressLevel}%</span>
                  </div>
                  <input 
                     type="range" min="0" max="100"
                     value={inputs.stressLevel}
                     onChange={(e) => setInputs({...inputs, stressLevel: parseInt(e.target.value)})}
                     className="w-full accent-rose-500 h-1 bg-stone-100 rounded-full appearance-none cursor-pointer"
                   />
               </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-black">Vedic Blueprint</h2>
              <p className="text-stone-400 text-sm font-medium italic">Mapping the doshic architecture of your internal peace.</p>
            </div>

            <div className="space-y-8">
              {[
                { key: 'vataDisturbance', label: 'Vata (Cold/Air/Racing)', color: 'blue' },
                { key: 'pittaHeat', label: 'Pitta (Heat/Sharp/Anger)', color: 'rose' },
                { key: 'kaphaSluggishness', label: 'Kapha (Heavy/Dull/Sluggish)', color: 'emerald' }
              ].map(item => (
                <div key={item.key} className="p-8 bg-white border border-stone-100 rounded-[2.5rem] shadow-sm space-y-4">
                   <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">{item.label}</label>
                    <span className={`text-xs font-black text-${item.color}-600`}>{(inputs as any)[item.key]}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100"
                    value={(inputs as any)[item.key]}
                    onChange={(e) => setInputs({...inputs, [item.key]: parseInt(e.target.value)})}
                    className={`w-full accent-${item.color}-600 h-1 bg-stone-100 rounded-full appearance-none cursor-pointer`}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-4xl font-black text-black tracking-tighter">AI Neural Sync</h2>
              <p className="text-stone-400 text-sm font-medium italic">Finalize your intelligence report with optional biometric scans.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
               {[
                 { icon: <Camera className="w-6 h-6" />, label: 'Face Fatigue Analysis', sub: 'Detected via neural vision', key: 'hasFaceScan' },
                 { icon: <Activity className="w-6 h-6" />, label: 'Wearable Intelligence', sub: 'Sync sleep screenshot', key: 'hasWatchScan' }
               ].map(item => (
                 <button
                   key={item.key}
                   onClick={() => setInputs({...inputs, [item.key]: !((inputs as any)[item.key])})}
                   className={cn(
                     "p-8 rounded-[2.5rem] border transition-all text-left flex items-start gap-6 relative overflow-hidden group",
                     (inputs as any)[item.key] ? "bg-purple-600 text-white border-purple-600 shadow-2xl shadow-purple-200" : "bg-stone-50 text-stone-400 border-stone-100"
                   )}
                 >
                    <div className={cn("p-4 rounded-2xl", (inputs as any)[item.key] ? "bg-white/20" : "bg-white shadow-sm")}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-black text-base uppercase tracking-tight">{item.label}</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-widest mt-1", (inputs as any)[item.key] ? "text-purple-200" : "text-stone-400")}>{item.sub}</p>
                    </div>
                    {/* Simulated Checkmark */}
                    {(inputs as any)[item.key] && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full flex items-center justify-center text-purple-600"
                      >
                         <Star className="w-3 h-3 fill-purple-600" />
                      </motion.div>
                    )}
                 </button>
               ))}
            </div>
            
            <p className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-[0.2em] px-8">
               Scans improve accuracy by up to 40% using our neural vision training.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isProcessing) {
    return <LoadingYogi fullScreenSplash message="Synthesizing Neuro-Circadian Resonance..." />;
  }

  return (
    <div className="min-h-screen bg-white pb-32 gpu-accelerated relative overflow-hidden">
       {/* Background Neural Glows */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[120px] -z-10 animate-pulse" />
       <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />

       <header className="px-6 pt-16 pb-8 sticky top-0 bg-white/50 backdrop-blur-3xl z-30 flex items-center justify-between border-b border-black/[0.03]">
        <button 
          onClick={() => stepIndex > 0 ? setStepIndex(stepIndex - 1) : navigate(-1)} 
          className="p-3 hover:bg-stone-50 rounded-full transition-all active:scale-90 border border-transparent active:border-stone-100"
        >
          <ChevronLeft className="w-6 h-6 text-stone-950" />
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400 mb-2">Neural Resonance Map</span>
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 transition-all duration-500 rounded-full",
                    i === stepIndex ? "w-8 bg-purple-600 shadow-[0_0_10px_rgba(162,89,255,0.4)]" : i < stepIndex ? "w-2 bg-stone-950" : "w-1.5 bg-stone-100"
                  )} 
                />
              ))}
            </div>
        </div>
        <div className="w-12" />
      </header>

      <main className="max-w-xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Action Button moved inline */}
        <div className="mt-16 space-y-6">
          <button 
            onClick={handleNext}
            className={cn(
              "w-full py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all active:scale-[0.97] shadow-2xl relative overflow-hidden group",
              stepIndex === 0 
                ? "bg-stone-950 text-white shadow-stone-200" 
                : "bg-purple-600 text-white shadow-purple-200"
            )}
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">
              {stepIndex === 0 ? 'Initialize Analysis' : stepIndex === STEPS.length - 1 ? 'Generate Intelligence' : 'Continue Sequence'}
            </span>
            <ChevronLeft className="w-4 h-4 rotate-180 opacity-50 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
            Safety encrypted. neural processing in 512-bit.
          </p>
        </div>
      </main>
    </div>
  );
}
