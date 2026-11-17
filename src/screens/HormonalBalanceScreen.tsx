import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Activity, 
  Sparkles, 
  AlertCircle, 
  ChevronRight, 
  CheckCircle, 
  ShieldCheck, 
  Zap, 
  Leaf,
  Calendar,
  RotateCcw,
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';
import SEOContentSection from '../components/SEOContentSection';

interface HormonalBalanceScreenProps {
  userData: any;
  appConfig?: any;
}

export default function HormonalBalanceScreen({ userData, appConfig }: HormonalBalanceScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('hormonal-balance', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [inputs, setInputs] = useState({
    ageGroup: '21-35',
    cycleRegularity: 'Regular',
    bloodFlow: 'Normal',
    symptoms: [] as { id: string, severity: 'mild' | 'moderate' | 'severe' }[],
    stressLevel: 'Medium',
    digestion: 'Good'
  });
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.state]);

  const OPTIONS = {
    ageGroup: ['Under 20', '21-35', '36-45', '46-55', 'Over 55'],
    cycleRegularity: ['Regular (28-32 days)', 'Irregular', 'Too short (<25)', 'Too long (>35)', 'Absent'],
    bloodFlow: ['Normal', 'Scanty', 'Heavy', 'Clots/Painful'],
    symptoms: ['Mood swings', 'Acne/Breakouts', 'Hair thinning', 'Facial hair growth', 'Unexplained weight gain', 'Low energy/Fatigue', 'Hot flashes', 'Cravings'],
    stressLevel: ['Low', 'Medium', 'High', 'Chronic'],
    digestion: ['Good', 'Bloating/Gas', 'Constipation', 'Acidic/Heartburn']
  };

  const toggleSymptom = (id: string) => {
    setInputs(prev => {
      const exists = prev.symptoms.find(s => s.id === id);
      if (exists) {
        return { ...prev, symptoms: prev.symptoms.filter(x => x.id !== id) };
      } else {
        return { ...prev, symptoms: [...prev.symptoms, { id, severity: 'mild' }] };
      }
    });
  };

  const updateSymptomSeverity = (id: string, severity: 'mild' | 'moderate' | 'severe') => {
    setInputs(prev => ({
      ...prev,
      symptoms: prev.symptoms.map(s => s.id === id ? { ...s, severity } : s)
    }));
  };

  const handleStartAnalysis = async () => {
    if (!userData || userData.is_guest) {
      try {
        sessionStorage.setItem('pending_analysis_data', JSON.stringify({
          type: 'hormonal_balance',
          formData: inputs,
          planId: 'basic',
          price: 0,
          isPaid: false
        }));
      } catch (e) {
        console.warn("Failed to cache form data:", e);
      }
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }
    
    setLoading(true);
    try {
      const docId = await saveProfileLocally({
        uid: userData.uid,
        type: 'hormonal_balance',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false,
      });
      navigate(`/analysis-pricing/${docId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Restore pending data if it exists
    const pending = sessionStorage.getItem('pending_analysis_data');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.type === 'hormonal_balance' && parsed.formData) {
          setInputs(prev => ({ ...prev, ...parsed.formData }));
          setShowForm(true);
          sessionStorage.removeItem('pending_analysis_data');
        }
      } catch (e) {
        console.error("Failed to restore pending data:", e);
      }
    }
  }, []);

  // Form View
  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-32">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" 
          alt="Hormonal Balance" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F7F8FC] via-transparent to-transparent pointer-events-none"></div>
        <button onClick={() => navigate('/hormonal-balance-landing')} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20 -mt-10">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center gap-3 text-[#A259FF] mb-2">
              <Activity className="w-6 h-6" />
              <h2 className="text-2xl font-black tracking-tight text-[#0B0F1A]">Hormonal <span className="text-[#A259FF]">Analysis</span></h2>
            </div>
            <p className="text-[#5B6472] text-sm font-medium">Please answer accurately for the most effective Ayurvedic guidance.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-[#FF6B6B] p-4 rounded-2xl mb-6 font-bold text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
          )}

          <div className="space-y-8">
            {/* Age Group */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B0F1A] pl-1 tracking-tight uppercase">Age Group</label>
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.ageGroup.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInputs(prev => ({ ...prev, ageGroup: opt }))}
                    className={`py-4 px-2 rounded-2xl font-bold text-sm transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${inputs.ageGroup === opt ? 'bg-[#A259FF] text-white border-[#7A36D6] shadow-[0_0_15px_rgba(162,89,255,0.3)]' : 'bg-[#F7F8FC] text-[#5B6472] border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Cycle */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B0F1A] pl-1 tracking-tight uppercase">Cycle Regularity</label>
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.cycleRegularity.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInputs(prev => ({ ...prev, cycleRegularity: opt }))}
                    className={`py-4 px-1 rounded-2xl font-bold text-xs transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${inputs.cycleRegularity === opt ? 'bg-[#A259FF] text-white border-[#7A36D6] shadow-[0_0_15px_rgba(162,89,255,0.3)]' : 'bg-[#F7F8FC] text-[#5B6472] border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Flow */}
            <div className="space-y-3">
              <label className="text-sm font-black text-[#0B0F1A] pl-1 tracking-tight uppercase">Blood Flow</label>
              <div className="grid grid-cols-2 gap-3">
                {OPTIONS.bloodFlow.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setInputs(prev => ({ ...prev, bloodFlow: opt }))}
                    className={`py-4 px-2 rounded-2xl font-bold text-sm transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${inputs.bloodFlow === opt ? 'bg-[#A259FF] text-white border-[#7A36D6] shadow-[0_0_15px_rgba(162,89,255,0.3)]' : 'bg-[#F7F8FC] text-[#5B6472] border-gray-100'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="space-y-4">
              <label className="text-sm font-black text-[#0B0F1A] pl-1 tracking-tight uppercase">Key Symptoms <span className="text-[10px] text-[#5B6472] font-medium lowercase">(Select all that apply)</span></label>
              <div className="space-y-3">
                {OPTIONS.symptoms.map(opt => {
                  const selectedSymptom = inputs.symptoms.find(s => s.id === opt);
                  const isSelected = !!selectedSymptom;

                  return (
                    <div key={opt} className="space-y-2">
                      <button
                        onClick={() => toggleSymptom(opt)}
                        className={`w-full px-5 py-4 rounded-2xl font-bold text-sm text-left transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 flex items-center justify-between ${isSelected ? 'bg-[#00BFA6] text-white border-[#008F7A] shadow-[0_0_10px_rgba(0,191,166,0.3)]' : 'bg-[#F7F8FC] text-[#5B6472] border-gray-100'}`}
                      >
                        {opt}
                        {isSelected && <CheckCircle className="w-4 h-4" />}
                      </button>

                      {isSelected && (
                        <div className="bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest pl-2">Severity</span>
                           <div className="flex gap-1">
                              {(['mild', 'moderate', 'severe'] as const).map(sev => (
                                <button
                                  key={sev}
                                  onClick={() => updateSymptomSeverity(opt, sev)}
                                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                    selectedSymptom.severity === sev
                                      ? 'bg-black text-white shadow-md'
                                      : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
                                  }`}
                                >
                                  {sev}
                                </button>
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartAnalysis} 
              className="w-full mt-10 py-6 rounded-2xl bg-[#FFB400] text-[#0B0F1A] font-black text-sm uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(255,180,0,0.3)] flex items-center justify-center gap-3 transition-all"
            >
              Analyze Profile <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="mt-8">
           <SEOContentSection content={FEATURE_SEO_CONTENT['hormonal-balance']} />
        </div>
      </div>
    </div>
  );
}
