import { saveProfileLocally } from '../lib/localHistory';
import FeatureBlog from '../components/FeatureBlog';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  Wallet, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Activity,
  Zap,
  Moon,
  Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { analyzeBodyScan } from '../lib/gemini';
import { usePermissions } from '../hooks/usePermissions';
import PermissionModal from '../components/PermissionModal';
import LoadingYogi from '../components/LoadingYogi';
import { cn } from '../lib/utils';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';
import { compressImage, fileToBase64 } from '../lib/imageUtils';

interface BodyScanScreenProps {
  userData: any;
  appConfig?: any;
}

const SYMPTOMS_OPTIONS = [
  "Pain",
  "Swelling",
  "Skin issue",
  "Weakness",
  "Fatigue",
  "Digestion issue"
];

import { FEATURE_SEO_CONTENT } from '../lib/featureSeo';
import SEOContentSection from '../components/SEOContentSection';

export default function BodyScanScreen({ userData, appConfig }: BodyScanScreenProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('body-scan', appConfig);
  const { startAnalysis: guardStartAnalysis } = useAccessGuard();
  const { activePermission, isPermanentlyDenied, isDenied, requestPermission, handleAllow, closeModal } = usePermissions();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.state]);
  
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // User Inputs
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [otherSymptom, setOtherSymptom] = useState('');
  const [lifestyle, setLifestyle] = useState({
    sleep: 'Average',
    stress: 'Medium',
    energy: 'Medium',
    activity: 'Moderate'
  });

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      try {
        const compressedFile = await compressImage(file);
        const base64 = await fileToBase64(compressedFile);
        
        // Size check for safety
        const sizeInBytes = Math.ceil((base64.length * 3) / 4);
        if (sizeInBytes > 1000000) {
          setError("Image is too large. Please try another photo.");
          return;
        }

        setImage(base64);
      } catch (err) {
        console.error("Compression failed:", err);
        setError("Error processing image. Please try again.");
      }
    }
  };

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleStartAnalysis = async () => {
    const inputs = {
      symptoms: selectedSymptoms,
      otherSymptom,
      lifestyle,
      planId: 'basic'
    };

    if (userData?.is_guest || !userData?.uid) {
        sessionStorage.setItem('pendingAnalysis', JSON.stringify({
          type: 'body_scan',
          image: image,
          inputs: inputs,
          planId: 'basic',
          price: 0,
          isPaid: false, 
        }));
        navigate('/auth', { state: { from: '/body-scan' } });
        return;
    }
    
    setAnalyzing(true);
    setError(null);

    try {

      // Save to health_profiles
      const profileId = await saveProfileLocally({
        uid: userData!.uid,
        type: 'body_scan',
        image: image,
        inputs: inputs,
        planId: 'basic',
        price: 0,
        isPaid: false, 
      });

      // Navigate to pricing
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError("Failed to analyze. Please check your internet and try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-24 selection:bg-ayur-neon selection:text-white">
      {/* Banner Image + Header */}
      <div className="relative w-full h-48 md:h-64 overflow-hidden mb-6">
        <img 
          src="/bodiscan.png" 
          alt="AI Body Scan Banner" 
          className="w-full h-full object-cover" 
          referrerPolicy="no-referrer"
        />
        {/* Header - now on top */}
        <div className="absolute top-0 w-full px-6 pt-8 pb-4 flex items-center justify-between z-20">
          <button onClick={() => navigate(-1)} className="p-3 bg-black/20 backdrop-blur-sm rounded-2xl text-white hover:bg-black/40 transition-all border border-white/10 active:scale-90">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-black text-white tracking-tight uppercase drop-shadow-md">AI Body Scan</h1>
          <div className="w-12" />
        </div>
      </div>

      <div className="px-6 space-y-6">

        {/* Card 1: Visual Input */}
        <div className="bg-white rounded-3xl p-8 border-b-4 border-r-4 border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">1. Visual Input</h3>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Optional but Recommended</p>
          </div>
          
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-[2rem] border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shrink-0 relative group bg-gray-100">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <img src="https://picsum.photos/seed/bodyscan/200/200?blur=6" alt="Placeholder" className="absolute inset-0 w-full h-full object-cover opacity-30" referrerPolicy="no-referrer" />
                  <div className="relative z-10 flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-ayur-neon transition-colors drop-shadow-sm" />
                    <span className="text-[8px] font-black text-gray-500 mt-1 uppercase tracking-widest drop-shadow-sm">Preview</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => requestPermission('camera', () => cameraInputRef.current?.click())}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(34,197,94,0.3)] hover:shadow-[0_12px_20px_rgba(34,197,94,0.4)] active:scale-95 transition-all"
                >
                  <Camera className="w-3 h-3" />
                  Take Photo
                </button>
                <button 
                  onClick={() => requestPermission('gallery', () => fileInputRef.current?.click())}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_8px_16px_rgba(59,130,246,0.3)] hover:shadow-[0_12px_20px_rgba(59,130,246,0.4)] active:scale-95 transition-all"
                >
                  <ImageIcon className="w-3 h-3" />
                  Upload
                </button>
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">Upload clear image of affected area</p>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
          <input type="file" ref={cameraInputRef} onChange={handleImageSelect} accept="image/*" capture="user" className="hidden" />
        </div>

        {/* Card 2: Health Details */}
        <div className="bg-white rounded-3xl p-8 border-b-4 border-r-4 border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">2. Health Details</h3>
            <p className="text-[9px] font-black text-ayur-neon uppercase tracking-widest">Personalized</p>
          </div>

          <div className="space-y-6">
            {/* Symptoms */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Symptoms (Select All)</label>
              <div className="flex flex-wrap gap-2">
                {SYMPTOMS_OPTIONS.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-x-2 border-t-2 border-b-[4px] active:border-b-2 active:translate-y-0.5 shadow-sm",
                      selectedSymptoms.includes(symptom)
                        ? "bg-gradient-to-b from-ayur-neon to-green-500 text-black border-green-700 shadow-[0_0_15px_rgba(57,255,20,0.4)]"
                        : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Other Symptoms */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Other Issues</label>
              <textarea
                value={otherSymptom}
                onChange={(e) => setOtherSymptom(e.target.value)}
                placeholder="Describe any other issues..."
                className="w-full bg-white border-2 border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl p-4 text-[10px] font-black uppercase tracking-widest outline-none transition-all resize-none text-gray-900"
                rows={2}
              />
            </div>

            {/* Lifestyle Grid */}
            <div className="grid grid-cols-2 gap-4">
              <LifestyleField 
                icon={Moon}
                label="Sleep"
                value={lifestyle.sleep}
                options={['Good', 'Average', 'Poor']}
                onChange={(val) => setLifestyle({...lifestyle, sleep: val})}
                color="text-blue-500"
              />
              <LifestyleField 
                icon={Brain}
                label="Stress"
                value={lifestyle.stress}
                options={['Low', 'Medium', 'High']}
                onChange={(val) => setLifestyle({...lifestyle, stress: val})}
                color="text-purple-500"
              />
              <LifestyleField 
                icon={Zap}
                label="Energy"
                value={lifestyle.energy}
                options={['High', 'Medium', 'Low']}
                onChange={(val) => setLifestyle({...lifestyle, energy: val})}
                color="text-amber-500"
              />
              <LifestyleField 
                icon={Activity}
                label="Activity"
                value={lifestyle.activity}
                options={['Active', 'Moderate', 'Low']}
                onChange={(val) => setLifestyle({...lifestyle, activity: val})}
                color="text-ayur-neon"
              />
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
              className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-rose-900">Action Required</p>
                <p className="text-xs text-rose-700 font-medium leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wallet Balance */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance: ₹{userData?.wallet_balance || 0}</span>
          </div>
          <button onClick={() => navigate('/wallet')} className="text-[10px] font-black text-ayur-neon uppercase tracking-widest">Recharge</button>
        </div>

        {/* Start Button */}
        <button
          disabled={analyzing}
          onClick={handleStartAnalysis}
          className={cn(
            "w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all flex flex-col items-center justify-center gap-1",
            analyzing
              ? 'bg-black/5 text-gray-400 cursor-not-allowed'
              : 'glow-button-green'
          )}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Body...</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Start Body Scan</span>
              </div>
              <span className="text-[10px] opacity-80">Starting From: ₹{pricing.plans[0].price}</span>
              <p className="text-[9px] font-medium text-white/60 italic mt-1">
                You will be charged only after successful result
              </p>
            </>
          )}
        </button>

        <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest opacity-40">"Your holistic Ayurvedic health report"</p>
      </div>

      {/* Partition / Divider */}
      <div className="w-full flex flex-col items-center justify-center py-12 opacity-60">
        <div className="w-px h-16 bg-gradient-to-b from-black/20 to-transparent mb-4" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">Discover More</span>
      </div>

      {/* SEO Landing Page Content */}
      <div className="px-6 pb-12 space-y-12 text-gray-800">
        
        {/* 1. Introduction */}
        <section className="space-y-4">
          <h2 className="text-3xl font-display font-black tracking-tight text-gray-900">Decode Your Body: The Ultimate AI Body Scan</h2>
          <div className="w-full h-48 rounded-3xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop" alt="Holistic body analysis and yoga" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Do you often feel out of balance but can't figure out why? Your body's physical traits—like your posture, build, and skin texture—hold the secret to your internal health. Traditional checkups often miss these subtle signs. The Ayurzenix AI Body Scan uses advanced image recognition combined with the ancient Ayurvedic science of Darshana (visual observation) to analyze your physical markers. By understanding your unique body type, we provide a highly personalized roadmap to better health, energy, and vitality.
          </p>
        </section>

        {/* 2. How to Use This Feature */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">How to Use This Feature</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">1</div>
              <p className="text-sm text-gray-600">Upload a clear photo of your body, posture, or a specific area of concern.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">2</div>
              <p className="text-sm text-gray-600">Select any current symptoms you are experiencing from the list.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">3</div>
              <p className="text-sm text-gray-600">Input your lifestyle details like sleep quality, stress, and activity levels.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">4</div>
              <p className="text-sm text-gray-600">Tap "Start Body Scan" and let our AI analyze your physical traits.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-ayur-neon/20 text-ayur-neon flex items-center justify-center font-black text-xs shrink-0 mt-0.5">5</div>
              <p className="text-sm text-gray-600">Receive a detailed Ayurvedic report with personalized wellness recommendations.</p>
            </div>
          </div>
        </section>

        {/* 3. Benefits You Get */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Benefits You Get</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Discover your dominant physical Dosha (Prakriti).
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Identify posture imbalances and physical stress markers.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Get personalized yoga and stretching routines for your body type.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              Learn how your physical build dictates your ideal diet and exercise.
            </li>
            <li className="flex items-center gap-3 text-sm text-gray-600">
              <Sparkles className="w-5 h-5 text-ayur-neon shrink-0" />
              May help improve flexibility, reduce joint pain, and boost energy.
            </li>
          </ul>
        </section>

        {/* 4. Benefits of Ayurveda */}
        <section className="space-y-4 bg-ayur-neon/5 p-6 rounded-3xl border border-ayur-neon/10">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Ayurveda & Your Body</h3>
          <div className="w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-black/5">
            <img src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=800&auto=format&fit=crop" alt="Ayurvedic body types and wellness" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            In Ayurveda, physical characteristics are the most obvious indicators of your Dosha. Vata types are often thin with prominent joints, Pitta types have a medium, athletic build, and Kapha types have a solid, broad frame. By analyzing these traits, Ayurveda can predict which illnesses you are prone to and prescribe specific physical therapies, massages (Abhyanga), and exercises to keep your unique body in perfect harmony.
          </p>
        </section>

        {/* 5. Why This Feature is Unique */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Why Our Scan is Unique</h3>
          <p className="text-sm leading-relaxed text-gray-600">
            While other fitness apps give everyone the same generic workout plan, the Ayurzenix AI Body Scan understands that one size does not fit all. We combine modern computer vision with the Ayurvedic diagnostic tool of Darshana (visual inspection). This allows us to provide physical wellness advice that actually respects your natural body constitution, leading to safer, faster, and more sustainable results.
          </p>
        </section>

        {/* 6. Quick Tips Section */}
        <section className="space-y-4">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Quick Tips for Physical Wellness</h3>
          <div className="w-full h-40 rounded-3xl overflow-hidden shadow-sm border border-black/5 mb-4">
            <img src="https://images.unsplash.com/photo-1552196563-552592596167?q=80&w=800&auto=format&fit=crop" alt="Yoga and physical wellness" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Vata Exercise</p>
              <p className="text-xs text-gray-500">Focus on grounding, slow exercises like restorative yoga or walking to calm the nervous system.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Pitta Exercise</p>
              <p className="text-xs text-gray-500">Avoid overheating. Opt for swimming, cycling, or moderate weightlifting in cool environments.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Kapha Exercise</p>
              <p className="text-xs text-gray-500">Engage in vigorous, sweat-inducing workouts like running or HIIT to combat sluggishness.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
              <p className="text-sm font-bold text-gray-900 mb-1">Daily Stretching</p>
              <p className="text-xs text-gray-500">Spend 10 minutes every morning stretching to improve circulation and remove blockages.</p>
            </div>
          </div>
        </section>

        {/* 7. FAQs */}
        <section className="space-y-6">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">What does the AI Body Scan look for?</h4>
              <p className="text-sm text-gray-600">It analyzes physical markers such as body frame, posture, joint structure, and visible tension to determine your Ayurvedic body type.</p>
            </div>
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Is my photo secure?</h4>
              <p className="text-sm text-gray-600">Yes, your privacy is our top priority. Photos are processed securely for analysis and are never shared publicly.</p>
            </div>
            <div className="border-b border-black/5 pb-4">
              <h4 className="text-sm font-bold text-gray-900 mb-2">Can this diagnose a physical injury?</h4>
              <p className="text-sm text-gray-600">No. The AI Body Scan provides holistic wellness and lifestyle guidance. It is not a medical diagnostic tool. Please consult a doctor for injuries or severe pain.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">How often should I scan?</h4>
              <p className="text-sm text-gray-600">We recommend scanning once a month to track your progress as you implement your new Ayurvedic lifestyle changes.</p>
            </div>
          </div>
        </section>

        {/* 8. Conclusion */}
        <section className="space-y-4 bg-gradient-to-br from-ayur-neon/10 to-ayur-gold/10 p-8 rounded-3xl text-center">
          <h3 className="text-2xl font-display font-black tracking-tight text-gray-900">Understand Your Body Today</h3>
          <p className="text-sm leading-relaxed text-gray-600 max-w-md mx-auto">
            Your body is constantly communicating with you—it's time to listen. Discover the exercises, therapies, and daily routines that your unique body actually needs. Upload your photo now and let the Ayurzenix AI Body Scan guide you to peak physical wellness!
          </p>
        </section>

        {/* Feature Blog Content */}
        <div className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-black/5">
          <FeatureBlog featureId="body_scan" />
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
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0abeff] px-6 text-center">
          <LoadingYogi />
        </div>
      )}

      <div className="px-6 pb-20">
        <SEOContentSection content={FEATURE_SEO_CONTENT['body-scan']} />
      </div>
    </div>
  );
}

function LifestyleField({ icon: Icon, label, value, options, onChange, color }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-3 h-3", color)} />
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border-2 border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] focus:border-ayur-neon focus:shadow-[0_0_15px_rgba(57,255,20,0.2)] rounded-2xl px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] outline-none text-gray-900 appearance-none transition-all"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
