import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Camera, Image as ImageIcon, Sparkles, Wallet, AlertCircle, Loader2, ChevronLeft } from 'lucide-react';
import SocialShare from '../components/SocialShare';
import LanguageToggle from '../components/LanguageToggle';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeFaceGlow } from '../lib/gemini';
import { usePermissions } from '../hooks/usePermissions';
import PermissionModal from '../components/PermissionModal';
import LoadingYogi from '../components/LoadingYogi';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';
import { compressImage, fileToBase64 } from '../lib/imageUtils';

interface FaceGlowScreenProps {
  userData: any;
  appConfig?: any;
}

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function FaceGlowScreen({ userData, appConfig }: FaceGlowScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('face-glow', appConfig);
  const { startAnalysis: triggerAccessGuard } = useAccessGuard();
  const { activePermission, isPermanentlyDenied, isDenied, requestPermission, handleAllow, closeModal } = usePermissions();
  
  const [image, setImage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1544367567-0f2fcb009e0a?q=80&w=2000&auto=format&fit=crop");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // User Inputs
  const [inputs, setInputs] = useState({
    skinType: 'Normal',
    mainConcern: 'Glow Improvement',
    sleepQuality: 'Average',
    waterIntake: 'Normal',
    stressLevel: 'Medium'
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetch('/api/unsplash/photo/a1qgzVocUCo')
      .then(res => res.json())
      .then(data => {
        if (data.url) setImageUrl(data.url);
      })
      .catch(err => console.error('Failed to fetch Unsplash image', err));

    // Auto-resume check
    if (location.state?.autoAnalyze && location.state?.featureId === 'face-glow') {
      // Auto-resume disabled
    }
  }, [location.state]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      try {
        const compressedFile = await compressImage(file);
        const base64 = await fileToBase64(compressedFile);
        
        // Final sanity check for size
        const sizeInBytes = Math.ceil((base64.length * 3) / 4);
        if (sizeInBytes > 1000000) { // 1MB limit for safety
          setError("Image is still too large. Try a different photo.");
          return;
        }

        setImage(base64);
      } catch (err) {
        console.error("Compression Error:", err);
        setError("Error processing image. Please try again.");
      }
    }
  };

  const handleStartAnalysis = async () => {
    if (!image) {
      setError("Please upload image for analysis");
      return;
    }
    
    if (userData?.is_guest || !userData?.uid) {
        sessionStorage.setItem('pendingAnalysis', JSON.stringify({
          type: 'face_glow',
          image: image,
          inputs: inputs,
          planId: 'basic',
          price: 0,
          isPaid: false, 
        }));
        navigate('/auth');
        return;
    }

    setAnalyzing(true);
    try {
      const profileId = await saveProfileLocally({
        uid: userData!.uid,
        type: 'face_glow',
        image: image,
        inputs: inputs,
        planId: 'basic',
        price: 0,
        isPaid: false, 
      });
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err) {
      console.error(err);
      setError("Failed to save metrics. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-24 selection:bg-ayur-neon selection:text-white">
      <div className="relative w-full h-[26rem]">
        <img
          src={imageUrl}
          alt="Face Glow Analyzer"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex flex-col">
          {/* Header - Now fully edge-to-edge */}
          <div className="px-4 pt-10 pb-4 flex items-center justify-between z-20">
            <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/20 hover:bg-white/30">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black text-white tracking-tight uppercase">Face Glow</h1>
            <LanguageToggle />
          </div>
          
          {/* Hero Title Content */}
          <div className="flex-1 flex flex-col justify-end p-8 space-y-2 z-10">
            <div className="flex items-center gap-3 text-ayur-neon mb-1">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-3xl font-black tracking-tight text-white">Face Glow <span className="text-ayur-neon">Analyzer</span></h2>
            </div>
            <p className="text-white/90 text-sm font-medium">Personalized AI Skin Analysis & Ayurvedic Remedies.</p>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-8 pt-8">

        {/* Compact Upload Section */}
        <div className="bg-white rounded-3xl p-8 border-b-4 border-r-4 border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">1. Face Image</h3>
            <p className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em]">Required</p>
          </div>
          
          <div className="flex gap-6">
            <div className="w-28 h-28 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative group">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center space-y-2">
                  <Sparkles className="w-8 h-8 text-gray-300 mx-auto" />
                </div>
              )}
              <div className="absolute inset-0 bg-ayur-neon/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex gap-3">
                <button 
                  onClick={() => requestPermission('camera', () => cameraInputRef.current?.click())}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-[0_8px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_20px_rgba(34,197,94,0.4)] active:scale-95 transition-all"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
                <button 
                  onClick={() => requestPermission('gallery', () => fileInputRef.current?.click())}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 shadow-[0_8px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_20px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
                >
                  <ImageIcon className="w-4 h-4" />
                  Upload
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed opacity-60">Upload clear face image for best results</p>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          <input type="file" ref={cameraInputRef} onChange={handleImageSelect} accept="image/*" capture="user" className="hidden" />
        </div>

        {/* User Inputs Section */}
        <div className="bg-white rounded-3xl p-8 border-b-4 border-r-4 border-gray-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">2. Personal Details</h3>
            <p className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em] opacity-80">Personalized</p>
          </div>

          <div className="space-y-6">
            {/* Skin Type */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Skin Type</label>
              <div className="flex flex-wrap gap-3">
                {['Dry', 'Oily', 'Normal', 'Combination'].map(type => (
                  <button
                    key={type}
                    onClick={() => setInputs({...inputs, skinType: type})}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                      inputs.skinType === type 
                        ? 'bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Concern */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Main Concern</label>
              <div className="flex flex-wrap gap-3">
                {['Dull Skin', 'Acne', 'Dark Spots', 'Dryness', 'Glow Improvement'].map(concern => (
                  <button
                    key={concern}
                    onClick={() => setInputs({...inputs, mainConcern: concern})}
                    className={cn(
                      "px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                      inputs.mainConcern === concern 
                        ? 'bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {concern}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Sleep Quality */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Sleep Quality</label>
                <select 
                  value={inputs.sleepQuality}
                  onChange={(e) => setInputs({...inputs, sleepQuality: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-gray-900 appearance-none transition-all"
                >
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              {/* Water Intake */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Water Intake</label>
                <select 
                  value={inputs.waterIntake}
                  onChange={(e) => setInputs({...inputs, waterIntake: e.target.value})}
                  className="w-full bg-white border-2 border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-gray-900 appearance-none transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Stress Level */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Stress Level</label>
              <div className="flex gap-3">
                {['Low', 'Medium', 'High'].map(level => (
                  <button
                    key={level}
                    onClick={() => setInputs({...inputs, stressLevel: level})}
                    className={cn(
                      "flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                      inputs.stressLevel === level 
                        ? 'bg-gradient-to-b from-rose-400 to-rose-600 text-white border-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-rose-500/10 border border-rose-500/20 p-6 rounded-[2rem] flex items-start gap-4"
            >
              <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-500">Action Required</p>
                <p className="text-xs text-rose-600 font-medium leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Balance: ₹{userData?.wallet_balance || 0}</span>
          </div>
          <button onClick={() => navigate('/wallet')} className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.2em] hover:opacity-80">Recharge</button>
        </div>
        
        <SocialShare title="Face Glow Analyzer" url={window.location.href} />


        {/* Start Button */}
        <button
          disabled={analyzing}
          onClick={handleStartAnalysis}
          className={cn(
            "w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95",
            analyzing
              ? 'bg-black/5 text-gray-400 border border-black/5 cursor-not-allowed'
              : 'glow-button-green'
          )}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing Skin...</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>Get Glow Report</span>
              </div>
              <span className="text-[10px] font-black opacity-70">Starting From: ₹{pricing.plans[0].price}</span>
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-60">"Your personalized skin analysis report"</p>
      </div>

      {/* Partition / Divider */}
      <div className="w-full flex flex-col items-center justify-center py-8 opacity-60">
        <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent mb-4" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Discover More</span>
      </div>

      {/* SEO Landing Page Content */}
      <div className="px-6 pb-12 space-y-12 text-gray-800">
        
        {/* 1. Introduction */}
        <section className="space-y-4">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Unlock Your Natural Radiance: The Ayurvedic Face Glow Analyzer</h2>
          <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" alt="Natural glowing skin" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Are you tired of dealing with dull skin, uneven tone, or stubborn acne? Chemical-based skincare products often provide only temporary fixes and can damage your skin barrier over time. True, lasting radiance starts from within. The Ayurzenix Face Glow Analyzer combines cutting-edge AI technology with ancient Ayurvedic wisdom to identify the root cause of your skin concerns. By analyzing your unique facial markers and lifestyle inputs, we provide a 100% personalized, natural skincare routine. Stop guessing and start glowing with the ultimate Ayurvedic Face Glow Analyzer!
          </p>
        </section>

        {/* 2. How to Use This Feature */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">How to Use This Feature</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">1</div>
              <p className="text-sm text-gray-600">Upload a clear, well-lit selfie or take a new photo using your camera.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">2</div>
              <p className="text-sm text-gray-600">Select your current skin type and primary skin concern.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">3</div>
              <p className="text-sm text-gray-600">Answer a few quick questions about your sleep, water intake, and stress levels.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">4</div>
              <p className="text-sm text-gray-600">Tap "Get Glow Report" and let our AI analyze your skin instantly.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">5</div>
              <p className="text-sm text-gray-600">Follow your personalized Ayurvedic skincare routine for natural, glowing skin.</p>
            </div>
          </div>
        </section>

        {/* 3. Benefits You Get */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Benefits You Get</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Discover your unique skin dosha and its specific needs.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Get personalized, chemical-free Ayurvedic herb recommendations.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Learn how your diet and lifestyle are affecting your skin health.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              May help reduce acne, pigmentation, and premature aging naturally.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Achieve a long-lasting, natural "glass skin" glow without makeup.
            </li>
          </ul>
        </section>

        {/* 4. Benefits of Ayurveda */}
        <section className="space-y-4 bg-ayur-neon/5 p-6 rounded-3xl border border-ayur-neon/10">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">The Power of Ayurveda for Skin</h3>
          <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop" alt="Ayurvedic herbs and natural skincare" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            In Ayurveda, your skin is a mirror of your internal health. Skin issues are often caused by an imbalance in your Doshas. Excess Pitta (fire) can cause acne and redness. Imbalanced Vata (air) leads to dry, flaky skin. High Kapha (earth) results in oily skin and clogged pores. By understanding your skin's dosha, you can use specific cooling or warming herbs to restore balance, detoxify your blood, and achieve a flawless complexion naturally.
          </p>
        </section>

        {/* 5. Why This Feature is Unique */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Why Our Analyzer is Unique</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            Most skincare apps just look at the surface. The Ayurzenix Face Glow Analyzer goes deeper. By combining advanced AI image recognition with holistic Ayurvedic principles, we don't just tell you that you have dry skin—we tell you *why* you have it based on your lifestyle, and exactly which natural ingredients will fix it. It’s like having a master Ayurvedic dermatologist in your pocket!
          </p>
        </section>

        {/* 6. Quick Tips Section */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Quick Tips for Glowing Skin</h3>
          <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm border border-black/5 mb-4">
            <img 
              src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=800&auto=format&fit=crop" 
              alt="Wellness and hydration routine" 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Hydration is Key</p>
              <p className="text-xs text-gray-500">Drink warm water throughout the day to flush out toxins (Ama).</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Aloe Vera Magic</p>
              <p className="text-xs text-gray-500">Apply fresh Aloe Vera gel to soothe Pitta-related redness and heat.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Beauty Sleep</p>
              <p className="text-xs text-gray-500">Aim for 7-8 hours of sleep. Your skin repairs itself most between 10 PM and 2 AM.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Watch Your Diet</p>
              <p className="text-xs text-gray-500">Limit excessively spicy, salty, or fried foods which can trigger breakouts.</p>
            </div>
          </div>
        </section>

        {/* 7. FAQs */}
        <section className="space-y-6">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">How to get glowing skin naturally?</h4>
              <p className="text-sm text-gray-600">Natural glowing skin is achieved by balancing your doshas through proper diet, hydration, adequate sleep, and using chemical-free Ayurvedic herbs suited to your skin type.</p>
            </div>
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">How accurate is the AI skin analysis?</h4>
              <p className="text-sm text-gray-600">Our AI is highly advanced and analyzes multiple facial markers. When combined with your lifestyle inputs, it provides a highly accurate, personalized Ayurvedic profile.</p>
            </div>
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Will this recommend chemical products?</h4>
              <p className="text-sm text-gray-600">No. Ayurzenix strictly focuses on natural, Ayurvedic remedies, herbs, and lifestyle changes to support your skin health.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Can this cure my severe acne?</h4>
              <p className="text-sm text-gray-600">While our analyzer provides excellent natural guidance that may help improve your skin, it is not a medical diagnosis. Please consult a dermatologist for severe medical conditions.</p>
            </div>
          </div>
        </section>

        {/* 8. Conclusion */}
        <section className="space-y-4 bg-gradient-to-br from-ayur-neon/10 to-ayur-gold/10 p-8 rounded-3xl text-center">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Ready for Flawless Skin?</h3>
          <p className="text-sm leading-relaxed text-gray-600 max-w-md mx-auto">
            Stop hiding behind filters and makeup. Discover the ancient secrets to naturally radiant, healthy skin tailored exactly to your body's needs. Upload your photo now and let the Ayurzenix Face Glow Analyzer reveal your path to true beauty!
          </p>
        </section>

        {/* Feature Blog Content */}
        <div className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <FeatureBlog featureId="face_glow" />
        </div>
      </div>

      <PermissionModal
        isOpen={activePermission !== null}
        type={activePermission || 'camera'}
        isPermanentlyDenied={isPermanentlyDenied}
        isDenied={isDenied}
        onClose={closeModal}
        onAllow={handleAllow}
      />

      {analyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ayur-bg px-6 text-center">
          <LoadingYogi />
        </div>
      )}

      <div className="px-6 pb-20">
        <SEOContentSection content={FEATURE_SEO_CONTENT['face-glow']} />
      </div>
    </div>
  );
}
