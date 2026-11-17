import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Brain, Upload, Loader2, Sparkles, FileText, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { saveProfileLocally } from '../lib/localHistory';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { getFeaturePricing, Plan } from '../lib/pricing';
import { useAccessGuard } from '../hooks/useAccessGuard';
import { compressImage, fileToBase64 } from '../lib/imageUtils';

export default function ReportAnalyzerScreen({ userData, appConfig }: { userData: any; appConfig: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pricing = getFeaturePricing('report-analyzer', appConfig);
  const { startAnalysis } = useAccessGuard();
  
  const [file, setFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPricing, setShowPricing] = useState(false);

  const isEnabled = appConfig?.features?.report_analyzer ?? true;

  useEffect(() => {
    if (!isEnabled) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [isEnabled, navigate]);

  if (!isEnabled) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-ayur-bg text-center">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-4" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Feature Disabled</h2>
        <p className="text-gray-500 font-medium tracking-wide">This feature is currently disabled by the administrator. Redirecting to home...</p>
      </div>
    );
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // If it's an image, compress it
      if (selectedFile.type.startsWith('image/')) {
        try {
          const compressed = await compressImage(selectedFile);
          setFile(compressed);
        } catch (err) {
          console.error("Compression failed:", err);
          setFile(selectedFile);
        }
      } else {
        setFile(selectedFile);
      }
    }
  };

  const analyzeReport = async () => {
    if (!file && !symptoms) return;

    if (!userData?.uid || userData.is_guest) {
      if (file) {
         // for large files, storing in session storage might exceed quota, but we have to try.
         fileToBase64(file).then(base64Data => {
            const base64String = base64Data.split(',')[1];
            sessionStorage.setItem('pendingAnalysis', JSON.stringify({
              type: 'report_analyzer',
              inputs: {
                 symptoms: symptoms,
                 image: `data:${file.type};base64,${base64String}`,
              },
              planId: 'basic',
              price: 0,
              isPaid: false
            }));
         }).catch(console.error);
      } else {
         sessionStorage.setItem('pendingAnalysis', JSON.stringify({
           type: 'report_analyzer',
           inputs: { symptoms: symptoms, image: null },
           planId: 'basic',
           price: 0,
           isPaid: false
         }));
      }
      navigate('/auth', { state: { from: '/report-analyzer' } });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let base64String = '';
      let mimeType = '';
      if (file) {
        const base64Data = await fileToBase64(file);
        base64String = base64Data.split(',')[1];
        mimeType = file.type;
      }

      // Save profile locally
      const profileData = {
        uid: userData.uid,
        type: 'report_analyzer',
        inputs: {
           symptoms: symptoms,
           image: base64String ? `data:${mimeType};base64,${base64String}` : null,
        },
        planId: 'basic',
        price: 0,
        createdAt: Date.now(),
        isPaid: false
      };

      const profileId = await saveProfileLocally(profileData);
      navigate(`/analysis-pricing/${profileId}`);
    } catch (err) {
      console.error(err);
      setError('Failed to process the report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-24 selection:bg-ayur-neon selection:text-white">
      <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 py-5 flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="p-3 bg-black/5 rounded-2xl text-gray-700 hover:bg-black/10 transition-all border border-black/5">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">AI Report Analyst</h1>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-3 text-ayur-neon mb-4">
            <Brain className="w-10 h-10" />
            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Deep Report Analysis</h2>
          </div>
          <p className="text-gray-500 text-sm font-medium leading-relaxed">
            Upload your health reports to get personalized Ayurvedic perspective and lifestyle suggestions.
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Step 1: Upload Report</p>
            <label className="block w-full bg-white border-2 border-dashed border-black/10 rounded-[2.5rem] p-12 text-center cursor-pointer hover:border-ayur-neon transition-all group">
              <div className="w-16 h-16 bg-ayur-neon/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-ayur-neon" />
              </div>
              <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{file ? file.name : 'Choose Image or PDF'}</p>
              <p className="text-[10px] text-gray-400 font-bold mt-2 uppercase">Max 5MB • JPG, PNG, PDF</p>
              <input type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
            </label>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">Step 2: Add Symptoms (Optional)</p>
            <textarea 
              placeholder="Describe what's bothering you..."
              className="w-full p-8 rounded-[2.5rem] border border-black/10 bg-white focus:border-ayur-neon outline-none text-gray-900 font-medium placeholder-gray-400 min-h-[160px] resize-none transition-all shadow-sm"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>

          <button 
            onClick={analyzeReport}
            disabled={loading || (!file && !symptoms)}
            className="w-full py-6 glow-button-green rounded-[2rem] flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            {loading ? 'Processing...' : `Analyze Now`}
          </button>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 flex items-center gap-4 bg-rose-50 border border-rose-100 p-6 rounded-[2rem] text-rose-600">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="text-xs font-black uppercase tracking-widest">{error}</p>
          </motion.div>
        )}

        <div className="mt-12 bg-black/5 rounded-[2.5rem] p-8 text-center space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Confidentiality</p>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Your health reports are processed securely and are only used for generating your personalized Ayurvedic analysis.
          </p>
        </div>
      </div>
    </div>
  );
};
