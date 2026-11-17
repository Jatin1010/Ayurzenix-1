import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle, ShieldAlert } from 'lucide-react';
import { db } from '../lib/firebase';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

interface LiverHealthScreenProps {
  userData: any;
  appConfig?: any;
}

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function LiverHealthScreen({ userData, appConfig }: LiverHealthScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('liver-health', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [inputs, setInputs] = useState({
    primarySymptom: 'Fatigue/Sluggishness',
    dietType: 'Mixed',
    alcoholConsumption: 'None',
    digestionQuality: 'Sluggish'
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'liver-health') {
      // Auto-resume disabled
    }
  }, [location.state]);

  const OPTIONS = {
    primarySymptom: ['Fatigue/Sluggishness', 'Acidity/Heat', 'Skin Issues/Acne', 'Yellowish Skin/Eyes'],
    dietType: ['Spicy & Oily', 'Junk/Processed', 'Healthy/Balanced', 'Mixed'],
    alcoholConsumption: ['None', 'Occasional', 'Frequent', 'Past Habit'],
    digestionQuality: ['Good', 'Acidity/Heartburn', 'Constipation', 'Sluggish/Heavy']
  };

  const handleSubmit = async () => {
    if (userData?.is_guest || !userData?.uid) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'liver_health',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false,
      }));
      navigate('/auth');
      return;
    }
    try {
      const docId = await saveProfileLocally({
        uid: userData.uid,
        type: 'liver_health',
        inputs,
        planId: 'basic',
        price: 0,
        isPaid: false,
      });
      navigate(`/analysis-pricing/${docId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create profile. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      <div className="relative w-full">
        <img 
          src="/liverhealth.png" 
          alt="Liver Health Analyzer" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayur-bg via-transparent to-transparent pointer-events-none"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20">
        <div className="mb-8 mt-2">
          <div className="flex items-center gap-3 text-yellow-500 mb-2">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight text-gray-900 flex gap-2">Liver <span className="text-yellow-500">Health</span></h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">Ayurvedic analysis for detox and vitality.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 font-bold text-sm flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <div className="space-y-8">
          {Object.entries(OPTIONS).map(([key, options]) => (
            <div key={key} className="space-y-4">
              <label className="text-sm font-black text-gray-800 uppercase tracking-widest pl-2">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => setInputs(prev => ({ ...prev, [key]: opt }))}
                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${(inputs as any)[key] === opt ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-black border-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-white text-gray-500 border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} className="w-full mt-12 py-5 rounded-[1.5rem] bg-gradient-to-b from-yellow-400 to-yellow-500 text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,179,8,0.4)] border-x-2 border-t-2 border-b-[4px] border-yellow-700 active:border-b-2 active:translate-y-0.5 transition-all flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-black" /> Analyze Liver
            </div>
            <span className="text-[10px] opacity-70">Starting From: ₹{pricing.plans[0].price}</span>
          </button>
        </div>

        <SEOContentSection content={FEATURE_SEO_CONTENT['liver-health']} />
      </div>
    </div>
  );
}
