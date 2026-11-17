import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Zap, Sparkles, AlertCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';

interface EnergyBoosterScreenProps {
  userData: any;
  appConfig?: any;
}

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function EnergyBoosterScreen({ userData, appConfig }: EnergyBoosterScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('energy-booster', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [inputs, setInputs] = useState({
    dipTime: 'Afternoon Slump',
    fatigueType: 'Physical Weakness',
    caffeineReliance: '1-2 cups',
    sleepQuality: 'Good',
    workType: 'Sedentary/Desk Job'
  });
  
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'energy-booster') {
      // Auto-resume disabled
    }
  }, [location.state]);

  const OPTIONS = {
    dipTime: ['Morning', 'Afternoon Slump', 'Evening', 'All Day Fatigue'],
    fatigueType: ['Physical Weakness', 'Mental Brain Fog', 'Both'],
    caffeineReliance: ['None', '1-2 cups', '3+ cups', 'Highly Dependent'],
    workType: ['Sedentary/Desk Job', 'Physical Labor', 'High Stress/Mental', 'Mixed']
  };

  const handleSubmit = async () => {
    if (userData?.is_guest || !userData?.uid) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify({
        type: 'energy_booster',
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
        type: 'energy_booster',
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
          src="/energy-booster.png" 
          alt="Energy Booster Background" 
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ayur-bg via-transparent to-transparent pointer-events-none"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20">
        <div className="mb-8 mt-2">
          <div className="flex items-center gap-3 text-orange-500 mb-2">
            <Zap className="w-6 h-6" />
            <h2 className="text-2xl font-black tracking-tight text-gray-900 flex gap-2">Energy <span className="text-orange-500">Booster</span></h2>
          </div>
          <p className="text-gray-500 text-sm font-medium">Beat fatigue naturally with Ayurveda.</p>
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
                    className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 ${(inputs as any)[key] === opt ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-black border-orange-700 shadow-[0_0_15px_rgba(251,146,60,0.3)]' : 'bg-white text-gray-500 border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button onClick={handleSubmit} className="w-full mt-12 py-5 rounded-[1.5rem] bg-gradient-to-b from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(251,146,60,0.4)] border-x-2 border-t-2 border-b-[4px] border-orange-700 active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-black" /> Boost Energy (From ₹{pricing.plans[0].price})
          </button>
        </div>
        
        <SEOContentSection content={FEATURE_SEO_CONTENT['energy-booster']} />
      </div>
    </div>
  );
}
