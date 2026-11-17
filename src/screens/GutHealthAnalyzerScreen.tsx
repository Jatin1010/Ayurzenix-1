import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronRight, 
  Zap, 
  Flame, 
  Activity, 
  Wind, 
  Droplets, 
  Brain, 
  Lock, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Camera,
  Utensils,
  Database,
  BarChart3,
  Clock,
  Navigation,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { saveProfileLocally } from '../lib/localHistory';
import { getFeaturePricing } from '../lib/pricing';
import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

// --- Types ---

interface Step {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  fields: string[];
}

interface GutHealthAnalyzerScreenProps {
  userData: any;
  appConfig?: any;
}

// --- Internal Components ---

const GlassCard = ({ children, className = "" }: any) => (
  <div className={`backdrop-blur-3xl bg-white/90 border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ current, total }: { current: number, total: number }) => (
  <div className="w-full h-1.5 bg-slate-100/50 rounded-full overflow-hidden mb-12">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${(current / total) * 100}%` }}
      className="h-full bg-gradient-to-r from-[#A259FF] via-[#00BFA6] to-[#006BDF]"
    />
  </div>
);

const OptionCard = ({ icon: Icon, title, isSelected, onClick, color = "#A259FF" }: any) => (
  <motion.button
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`w-full p-6 rounded-[2.5rem] border-2 transition-all flex items-center gap-5 text-left relative overflow-hidden group ${
      isSelected 
        ? `bg-white border-current shadow-2xl shadow-slate-200/50` 
        : "bg-white/40 border-transparent hover:border-slate-200"
    }`}
    style={{ color: isSelected ? color : undefined }}
  >
    {isSelected && (
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundColor: color }} />
    )}
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isSelected ? '' : 'bg-slate-50'}`} 
         style={{ backgroundColor: isSelected ? `${color}15` : undefined, color: isSelected ? color : '#94A3B8' }}>
      <Icon className="w-7 h-7" />
    </div>
    <div className="flex flex-col">
        <span className={`text-sm font-black uppercase tracking-widest ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
        {title}
        </span>
        {isSelected && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Active Matrix Selective</span>}
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
            className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-current"
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

const STEPS: Step[] = [
  { id: 0, title: "Biological Profile", subtitle: "Establishing your baseline physical metrics.", category: "Core Identity", fields: ['age', 'weight'] },
  { id: 1, title: "Digestive Patterns", subtitle: "Mapping your gut rhythms & current disturbances.", category: "Gut Mapping", fields: ['pattern', 'bloating', 'acidity'] },
  { id: 2, title: "Metabolic Agni", subtitle: "Evaluating your internal digestive fire strength.", category: "Agni Analysis", fields: ['appetite', 'mealTiming'] },
  { id: 3, title: "Neural Gastric Link", subtitle: "The connection between your mind and gut.", category: "Mental Sync", fields: ['stress', 'triggers'] }
];

// --- Main Application ---

export default function GutHealthAnalyzerScreen({ userData, appConfig }: GutHealthAnalyzerScreenProps) {
  const navigate = useNavigate();
  const pricing = getFeaturePricing('gut-health', appConfig);

  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Advanced Form State
  const [inputs, setInputs] = useState<any>({
    // Step 0: Profile
    age: 28,
    weight: 70,
    activity: 'moderate',
    // Step 1: Pattern
    pattern: 'vata',
    bloating: 30,
    acidity: 15,
    // Step 2: Agni
    appetite: 'consistent / stable',
    mealTiming: 'regular',
    // Step 3: Mind
    stress: 45,
    triggers: [] as string[]
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
            type: 'gut_health',
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
            type: 'gut_health',
            inputs,
            planId: 'basic',
            price: 0,
            isPaid: false,
          });
          navigate(`/analysis-pricing/${docRefId}`);
        } catch (err) {
          console.error(err);
          setError("Failed to save metrics. Try again.");
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

  const step = STEPS[currentStep] || STEPS[0];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#A259FF]/10 selection:text-[#A259FF]">
      
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 bg-red-500 text-white text-xs font-bold rounded-full shadow-xl">
          {error}
        </div>
      )}

      {/* Futuristic Background Blur */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#A259FF]/5 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-[#00BFA6]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-[#FF6B6B]/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <nav className="sticky top-0 z-[100] px-6 py-5 flex justify-between items-center bg-white/80 backdrop-blur-3xl border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-5">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all text-slate-400 hover:text-black"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Gut <span className="text-[#00BFA6] italic">Intelligence</span>
            </h1>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Protocol v4.28</span>
          </div>
        </div>
        <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 88}`} alt="AI User" />
                </div>
            ))}
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 pt-10 pb-32 relative z-10">
        
        {/* Step Visualization */}
        <div className="space-y-6 mb-16">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A259FF]">
                    {step.category}
                </span>
                <h3 className="text-sm font-bold text-slate-400">Biological Synchronization</h3>
            </div>
            <div className="text-right">
                <span className="text-2xl font-black text-slate-900">0{currentStep + 1}</span>
                <span className="text-sm font-bold text-slate-300 ml-1">/ 0{STEPS.length}</span>
            </div>
          </div>
          <ProgressBar current={currentStep + 1} total={STEPS.length} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-14"
          >
            {/* Cinematic Header */}
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-slate-900 leading-[0.95] tracking-tighter uppercase italic">
                {step.title.split(' ')[0]} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400 not-italic">
                    {step.title.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-sm">
                {step.subtitle}
              </p>
            </div>

            {/* Specialized Input Sections */}
            <div className="min-h-[400px] relative z-20">
              {currentStep === 0 && (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <GlassCard className="rounded-[2.5rem] p-8 space-y-4">
                            <div className="flex justify-between items-start">
                                <Clock className="w-8 h-8 text-[#A259FF]" />
                                <span className="text-base font-black tabular-nums">{inputs.age}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chronological Age</span>
                            <input 
                                type="range" min="12" max="100" value={inputs.age}
                                onChange={(e) => setInputs({...inputs, age: parseInt(e.target.value)})}
                                className="w-full accent-[#A259FF] mt-2 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer"
                            />
                        </GlassCard>
                        <GlassCard className="rounded-[2.5rem] p-8 space-y-4">
                            <div className="flex justify-between items-start">
                                <Activity className="w-8 h-8 text-[#00BFA6]" />
                                <span className="text-base font-black tabular-nums">{inputs.weight}kg</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mass Vector</span>
                            <input 
                                type="range" min="30" max="200" value={inputs.weight}
                                onChange={(e) => setInputs({...inputs, weight: parseInt(e.target.value)})}
                                className="w-full accent-[#00BFA6] mt-2 h-1 bg-slate-100 rounded-full appearance-none cursor-pointer"
                            />
                        </GlassCard>
                    </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <OptionCard 
                            icon={Wind} title="Vata Pulse (Gassy)" 
                            isSelected={inputs.pattern === 'vata'}
                            onClick={() => setInputs({...inputs, pattern: 'vata'})}
                            color="#006BDF"
                        />
                        <OptionCard 
                            icon={Flame} title="Pitta Glow (Acidic)" 
                            isSelected={inputs.pattern === 'pitta'}
                            onClick={() => setInputs({...inputs, pattern: 'pitta'})}
                            color="#FF6B6B"
                        />
                        <OptionCard 
                            icon={Droplets} title="Kapha Wave (Heavy)" 
                            isSelected={inputs.pattern === 'kapha'}
                            onClick={() => setInputs({...inputs, pattern: 'kapha'})}
                            color="#00BFA6"
                        />
                    </div>
                    <GlassCard className="rounded-[3rem] p-10 space-y-2">
                        <SeveritySlider 
                            label="Post-Prandial Bloating" 
                            value={inputs.bloating} 
                            onChange={(v: number) => setInputs({...inputs, bloating: v})}
                            minLabel="Clear State" maxLabel="Severe Distension" color="#006BDF"
                        />
                        <div className="h-px bg-slate-100 w-full" />
                        <SeveritySlider 
                            label="Heat Markers (Acidity)" 
                            value={inputs.acidity} 
                            onChange={(v: number) => setInputs({...inputs, acidity: v})}
                            minLabel="Neutral" maxLabel="Burning Sensation" color="#FF6B6B"
                        />
                    </GlassCard>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">Appetite Rhythm Matrix</p>
                    <div className="grid grid-cols-1 gap-4">
                        {['Forceful & Fast', 'Weak & Sluggish', 'Variable / Unstable', 'Consistent / Stable'].map(t => (
                            <button 
                                key={t}
                                onClick={() => setInputs({...inputs, appetite: t.toLowerCase()})}
                                className={`p-7 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group overflow-hidden relative ${
                                    inputs.appetite === t.toLowerCase()
                                    ? "bg-white border-[#FFB400] text-[#FFB400] shadow-2xl shadow-amber-200/50"
                                    : "bg-white/40 border-transparent text-slate-500 hover:border-slate-200"
                                }`}
                            >
                                <span className={`text-sm font-black uppercase tracking-widest ${inputs.appetite === t.toLowerCase() ? 'text-slate-900' : ''}`}>{t}</span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${inputs.appetite === t.toLowerCase() ? 'bg-amber-50 text-[#FFB400]' : 'bg-slate-50 text-slate-300'}`}>
                                    <Flame className="w-5 h-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-12">
                    <GlassCard className="rounded-[3rem] p-12 space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#A259FF]/5 rounded-full blur-3xl" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#A259FF]/10 flex items-center justify-center text-[#A259FF]">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest">Digital-Mental Overload</h4>
                            </div>
                            <SeveritySlider 
                                label="Current Neural Tension" 
                                value={inputs.stress} 
                                onChange={(v: number) => setInputs({...inputs, stress: v})}
                                minLabel="Sattvic (Calm)" maxLabel="Rajasic (Restless)" color="#A259FF"
                            />
                        </div>
                    </GlassCard>

                    <div className="space-y-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4">Metabolic Reactive Triggers</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {["Dairy Flux", "Gluten Spark", "Caffeine Spike", "Night Snacking", "Sugar Rush", "None Detect"].map(trigger => (
                                <button 
                                    key={trigger}
                                    onClick={() => {
                                        const exists = inputs.triggers.includes(trigger);
                                        setInputs({
                                            ...inputs, 
                                            triggers: exists ? inputs.triggers.filter((x: string) => x !== trigger) : [...inputs.triggers, trigger]
                                        });
                                    }}
                                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-3 group relative overflow-hidden ${
                                        inputs.triggers.includes(trigger)
                                        ? "bg-white border-[#00BFA6] text-[#00BFA6] shadow-xl"
                                        : "bg-white/40 border-transparent text-slate-400 hover:border-slate-100"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${inputs.triggers.includes(trigger) ? 'bg-[#00BFA6]/10' : 'bg-slate-50'}`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${inputs.triggers.includes(trigger) ? 'text-slate-900' : ''}`}>{trigger}</span>
                                    {inputs.triggers.includes(trigger) && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-2 h-2 rounded-full bg-[#00BFA6]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
              )}
            </div>

            {/* Bottom Nav Actions */}
            <div className="pt-10 space-y-6">
                <button 
                    onClick={handleNext}
                    className="w-full py-7 rounded-[2.5rem] bg-[#111827] text-white font-black uppercase text-xs tracking-[0.4em] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{currentStep < STEPS.length - 1 ? "Advance Phase" : "Initialize AI Analysis"}</span>
                    <Navigation className="w-5 h-5 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                </button>
                {currentStep === 0 && (
                     <div className="flex items-center justify-center gap-3 text-slate-400">
                        <ShieldCheck className="w-4 h-4 text-[#00BFA6]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Bio-Data</span>
                    </div>
                )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <div className="mt-24 border-t border-slate-100 pt-16">
            <SEOContentSection content={FEATURE_SEO_CONTENT['gut-health']} />
        </div>
      </main>

      {/* Floating Insight Dock */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-sm pointer-events-none">
         <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="backdrop-blur-2xl bg-white/60 border border-white p-5 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] flex items-center gap-5 pointer-events-auto"
         >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#A259FF] to-[#006BDF] flex items-center justify-center text-white shadow-xl shadow-[#A259FF]/20">
                <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-black text-[#A259FF] uppercase tracking-widest">AI Intelligence Node</span>
                <p className="text-[9px] font-bold text-slate-500 leading-tight">Your analysis quality increases as you fill more metrics.</p>
            </div>
         </motion.div>
      </div>
    </div>
  );
}

// --- Status Views ---

const ProcessingView = () => (
  <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
     {/* Background Aura */}
     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(162,89,255,0.05)_0%,_transparent_70%)]" />
     
     <div className="relative z-10 space-y-16">
        <div className="relative group">
            <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-56 h-56 border border-slate-100 rounded-[3rem] relative"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#A259FF] rounded-full shadow-[0_0_20px_rgba(162,89,255,0.8)]" />
            </motion.div>
            <motion.div 
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-8 border border-emerald-100 rounded-[2rem]"
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-[#00BFA6] rounded-full shadow-[0_0_20px_rgba(0,191,166,0.8)]" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A259FF]/10 to-[#00BFA6]/10 animate-pulse" />
                    <Database className="w-10 h-10 text-slate-900 relative z-10" />
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tight">Syncing Bio-Flux</h2>
            <div className="space-y-4">
                {[
                    { t: "Correlating Samhita v4.28...", c: "text-[#A259FF]" },
                    { t: "Mapping Microbiome Markers...", c: "text-[#00BFA6]" },
                    { t: "Predicting Agni Stability Index...", c: "text-[#FFB400]" },
                    { t: "Generating Neural Recovery Paths...", c: "text-[#006BDF]" }
                ].map((log, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.75 }}
                        className={`text-xs font-black uppercase tracking-[0.3em] ${log.c}`}
                    >
                        {log.t}
                    </motion.div>
                ))}
            </div>
        </div>
     </div>

     {/* Bottom Tech Grid decoration */}
     <div className="absolute bottom-0 inset-x-0 h-64 opacity-[0.03] pointer-events-none">
        <div className="grid grid-cols-12 h-full gap-4 px-10">
            {[...Array(24)].map((_, i) => (
                <div key={i} className="h-full w-px bg-slate-900" />
            ))}
        </div>
     </div>
  </div>
);
