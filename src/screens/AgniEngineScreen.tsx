import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Zap, 
  Activity, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Navigation,
  ShieldCheck,
  Thermometer,
  Clock,
  Wind,
  Droplets,
  HeartPulse
} from 'lucide-react';
import { saveProfileLocally } from '../lib/localHistory';
import { getFeaturePricing } from '../lib/pricing';

// --- Internal Components ---

const GlassCard = ({ children, className = "" }: any) => (
  <div className={`backdrop-blur-3xl bg-white/90 border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
  <div className="w-full h-1.5 bg-orange-100/50 rounded-full overflow-hidden mb-12">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-amber-500"
    />
  </div>
);

const OptionCard = ({ icon: Icon, title, isSelected, onClick, color = "#F97316" }: any) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 text-left relative overflow-hidden group ${
      isSelected 
        ? `bg-white border-current shadow-2xl shadow-orange-200/50` 
        : "bg-white/40 border-transparent hover:border-orange-200"
    }`}
    style={{ color: isSelected ? color : undefined }}
  >
    {isSelected && (
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: color }} />
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? '' : 'bg-orange-50'}`} 
         style={{ backgroundColor: isSelected ? `${color}15` : undefined, color: isSelected ? color : '#F97316' }}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex flex-col">
        <span className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
        {title}
        </span>
        {isSelected && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Agni Marker Selective</span>}
    </div>
    {isSelected && (
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="ml-auto w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: color }}
        >
            <CheckCircle2 className="w-4 h-4 text-white" />
        </motion.div>
    )}
  </motion.button>
);

const SeveritySlider = ({ label, value, onChange, minLabel, maxLabel, color }: any) => (
  <div className="space-y-5 py-6">
    <div className="flex justify-between items-end">
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">{label}</span>
      </div>
      <span className="text-xl font-black tabular-nums" style={{ color: color }}>{value}%</span>
    </div>
    <div className="relative h-6 flex items-center">
        <input 
            type="range" 
            min="0" 
            max="100" 
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-orange-100 rounded-full appearance-none cursor-pointer accent-current"
            style={{ color: color }}
        />
    </div>
    <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
      <span>{minLabel}</span>
      <span>{maxLabel}</span>
    </div>
  </div>
);

// --- Constants ---

const STEPS = [
  { 
    id: 0, 
    title: "Thermal Mapping", 
    subtitle: "Initializing baseline metabolic heat indicators.", 
    category: "Agni Pulse", 
    fields: ['hungerPulse', 'heatMarkers'] 
  },
  { 
    id: 1, 
    title: "Digestive Kinetic", 
    subtitle: "Analyzing food transformation velocity.", 
    category: "Transformation", 
    fields: ['digestiveLoad', 'speed'] 
  },
  { 
    id: 2, 
    title: "Residual Analytics", 
    subtitle: "Detecting metabolic sludge (Ama) markers.", 
    category: "Toxin Load", 
    fields: ['elimination', 'heaviness'] 
  },
  { 
    id: 3, 
    title: "Energy Matrix", 
    subtitle: "Mapping vitality extraction from nutrition.", 
    category: "Prana Sync", 
    fields: ['mentalAgni', 'postMealEnergy'] 
  }
];

export default function AgniEngineScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<any>({
    hungerPulse: 'samagni',
    heatMarkers: 20,
    digestiveLoad: 'moderate',
    speed: 50,
    elimination: 'regular',
    heaviness: 30,
    mentalAgni: 40,
    postMealEnergy: 'balanced'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      if (!userData?.uid || userData?.is_guest) {
        sessionStorage.setItem('pendingAnalysis', JSON.stringify({
            type: 'agni_engine',
            inputs,
            planId: 'basic',
            price: 0,
            isPaid: false
        }));
        navigate('/auth');
        return;
      }
      setIsProcessing(true);
      setTimeout(async () => {
        try {
          const docRefId = await saveProfileLocally({
            uid: userData.uid,
            type: 'agni_engine',
            inputs,
            planId: 'basic',
            price: 0,
            isPaid: false,
          });
          navigate(`/analysis-pricing/${docRefId}`);
        } catch (err) {
          console.error(err);
          setError("Engine synchronization failed. Retrying...");
        } finally {
          setIsProcessing(false);
        }
      }, 4000);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate(-1);
    }
  };

  if (isProcessing) return <ProcessingView />;

  const step = STEPS[currentStep];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-ayur-neon/20 selection:text-black overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-ayur-neon/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-ayur-teal/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#FFFFFF_100%)] opacity-80" />
      </div>

      <nav className="sticky top-0 z-[100] px-6 py-5 flex justify-between items-center bg-white/40 backdrop-blur-3xl border-b border-black/5">
        <div className="flex items-center gap-5">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-stone-100 border border-stone-200 hover:bg-stone-200 transition-all text-stone-400 hover:text-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-black tracking-tighter flex items-center gap-2">
              Agni <span className="text-ayur-neon italic mix-blend-difference">Engine</span>
            </h1>
            <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em]">Metabolic Fire Master v1.0</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-1.5 rounded-full bg-ayur-neon/10 border border-ayur-neon/20 text-[10px] font-black uppercase tracking-widest text-black">
               Core Core-6 Engine
            </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 pt-10 pb-32 relative z-10">
        
        <div className="space-y-6 mb-16 px-4">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ayur-neon bg-black px-2 py-0.5 rounded-sm">
                    {step.category}
                </span>
                <h3 className="text-sm font-bold text-black/40">Engine Thermal Analysis</h3>
            </div>
            <div className="text-right">
                <span className="text-2xl font-black text-black">0{currentStep + 1}</span>
                <span className="text-sm font-bold text-black/30 ml-1">/ 0{STEPS.length}</span>
            </div>
          </div>
          <ProgressBar current={currentStep + 1} total={STEPS.length} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-14"
          >
            <div className="space-y-4 px-4">
              <h2 className="text-5xl font-black text-black leading-[0.9] tracking-tighter uppercase italic">
                {step.title}
              </h2>
              <p className="text-xl font-medium text-black/50 leading-relaxed max-w-sm">
                {step.subtitle}
              </p>
            </div>

            <div className="min-h-[400px] relative z-20 space-y-6">
              {currentStep === 0 && (
                <div className="space-y-6">
                    <OptionCard 
                        icon={Flame} title="Tikshna (Intense Heat)" 
                        isSelected={inputs.hungerPulse === 'tikshnagni'}
                        onClick={() => setInputs({...inputs, hungerPulse: 'tikshnagni'})}
                        color="#EF4444"
                    />
                    <OptionCard 
                        icon={Wind} title="Vishama (Irregular Surge)" 
                        isSelected={inputs.hungerPulse === 'vishamagni'}
                        onClick={() => setInputs({...inputs, hungerPulse: 'vishamagni'})}
                        color="#3B82F6"
                    />
                    <OptionCard 
                        icon={Droplets} title="Manda (Slow Smolder)" 
                        isSelected={inputs.hungerPulse === 'mandagni'}
                        onClick={() => setInputs({...inputs, hungerPulse: 'mandagni'})}
                        color="#10B981"
                    />
                    <OptionCard 
                        icon={Zap} title="Sama (Balanced Flame)" 
                        isSelected={inputs.hungerPulse === 'samagni'}
                        onClick={() => setInputs({...inputs, hungerPulse: 'samagni'})}
                        color="#F59E0B"
                    />
                    <div className="px-4">
                      <SeveritySlider 
                          label="Acidity & Heat Sensitivity" 
                          value={inputs.heatMarkers} 
                          onChange={(v: number) => setInputs({...inputs, heatMarkers: v})}
                          minLabel="Cool" maxLabel="Burning" color="#F97316"
                      />
                    </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-8 px-4">
                    <div className="grid grid-cols-1 gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-2">Digestive Load Level</p>
                        {['light', 'moderate', 'heavy', 'sluggish'].map(load => (
                            <button 
                                key={load}
                                onClick={() => setInputs({...inputs, digestiveLoad: load})}
                                className={`p-8 rounded-[2.5rem] border transition-all text-left group overflow-hidden relative ${
                                    inputs.digestiveLoad === load
                                    ? "bg-white border-orange-500 text-black shadow-2xl shadow-orange-500/20"
                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                }`}
                            >
                                <span className="text-sm font-black uppercase tracking-widest">{load} Detection</span>
                            </button>
                        ))}
                    </div>
                    <SeveritySlider 
                        label="Food Transformation Velocity" 
                        value={inputs.speed} 
                        onChange={(v: number) => setInputs({...inputs, speed: v})}
                        minLabel="Stalled" maxLabel="Hyper-Speed" color="#F97316"
                    />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                    <OptionCard 
                        icon={Thermometer} title="Morning Tongue Coating" 
                        isSelected={inputs.elimination === 'coated'}
                        onClick={() => setInputs({...inputs, elimination: 'coated'})}
                        color="#F97316"
                    />
                    <OptionCard 
                        icon={HeartPulse} title="Post-Meal Heaviness" 
                        isSelected={inputs.heaviness > 60}
                        onClick={() => setInputs({...inputs, heaviness: 80})}
                        color="#F97316"
                    />
                    <div className="px-4">
                      <SeveritySlider 
                          label="Detected Toxicity (Ama)" 
                          value={inputs.heaviness} 
                          onChange={(v: number) => setInputs({...inputs, heaviness: v})}
                          minLabel="Clean" maxLabel="Congested" color="#F97316"
                      />
                    </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10 px-4">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Mental Focus & Gut Sync</p>
                        <SeveritySlider 
                            label="Cognitive Burnout Level" 
                            value={inputs.mentalAgni} 
                            onChange={(v: number) => setInputs({...inputs, mentalAgni: v})}
                            minLabel="Sharp" maxLabel="Foggy" color="#F97316"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Post-Meal Energy Output</p>
                        {['Lethargic', 'Balanced', 'High Energy', 'Anxious'].map(energy => (
                            <button 
                                key={energy}
                                onClick={() => setInputs({...inputs, postMealEnergy: energy.toLowerCase()})}
                                className={`p-8 rounded-[2.5rem] border transition-all text-left group overflow-hidden relative ${
                                    inputs.postMealEnergy === energy.toLowerCase()
                                    ? "bg-white border-orange-500 text-black shadow-2xl shadow-orange-500/20"
                                    : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                                }`}
                            >
                                <span className="text-sm font-black uppercase tracking-widest">{energy} state</span>
                            </button>
                        ))}
                    </div>
                </div>
              )}
            </div>

            <div className="pt-10 space-y-6 px-4">
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    className="w-full py-7 rounded-[2.5rem] bg-ayur-neon text-black font-black uppercase text-xs tracking-[0.4em] shadow-[0_32px_64px_-16px_rgba(204,255,0,0.3)] hover:brightness-110 active:brightness-90 transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
                >
                    <span className="relative z-10">{currentStep < STEPS.length - 1 ? "Synchronize Engine" : "Ignite AI Analysis"}</span>
                    <Navigation className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                </motion.button>
                <div className="flex items-center justify-center gap-3 text-black/30">
                    <ShieldCheck className="w-4 h-4 text-ayur-neon" />
                    <span className="text-[10px] font-bold uppercase tracking-widest italic">Core-6 Engine Protocol Active</span>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

const ProcessingView = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
     <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(204,255,0,0.1)_0%,_transparent_70%)]" />
     
     <div className="relative z-10 space-y-20">
        <div className="relative">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
               className="w-64 h-64 border-4 border-stone-100 rounded-full relative"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-ayur-neon rounded-full shadow-[0_0_30px_#CCFF00]" />
            </motion.div>
            <motion.div 
               animate={{ rotate: -360 }}
               transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
               className="absolute inset-8 border-4 border-stone-100 rounded-full"
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-ayur-teal rounded-full shadow-[0_0_20px_#14B8A6]" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="w-24 h-24 bg-ayur-neon rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.5)]"
                >
                    <Flame className="w-12 h-12 text-black fill-black" />
                </motion.div>
            </div>
        </div>

        <div className="space-y-8">
            <h2 className="text-4xl font-black text-black italic tracking-tighter uppercase">Igniting Agni Engine</h2>
            <div className="space-y-4">
                {[
                    "Kindling metabolic fire...",
                    "Analyzing Samhita v1.0 parameters...",
                    "Measuring Ama toxicity load...",
                    "Generating Transformation Roadmap..."
                ].map((log, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.75 }}
                        className="text-[10px] font-black uppercase tracking-[0.5em] text-ayur-neon"
                    >
                        {log}
                    </motion.div>
                ))}
            </div>
        </div>
     </div>
  </div>
);
