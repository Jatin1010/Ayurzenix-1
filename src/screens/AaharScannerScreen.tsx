import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Zap,
  Leaf,
  Utensils,
  History,
  RotateCcw,
  Brain
} from 'lucide-react';
import { analyzeFoodCompatibility } from '../services/geminiService';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AaharScannerScreenProps {
  userData: any;
}

export default function AaharScannerScreen({ userData }: AaharScannerScreenProps) {
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    
    setAnalyzing(true);
    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Data = image.split(',')[1];
      const analysisResult = await analyzeFoodCompatibility(base64Data, userData?.dosha || 'Unknown');
      setResult(analysisResult);

      // Save to history
      if (userData?.uid) {
        await addDoc(collection(db, 'users', userData.uid, 'aahar_history'), {
          dishName: analysisResult.dishName,
          compatibilityScore: analysisResult.compatibilityScore,
          prakritiImpact: analysisResult.prakritiImpact,
          insights: analysisResult.insights,
          tips: analysisResult.tips,
          imageUrl: image, // In a real app, upload to storage first
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Analysis Error:", error);
      alert("Failed to analyze meal. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-6 bg-white border-b border-gray-100 sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900" />
          </button>
          <div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Aahar Vision</h1>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Food Scanner</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/history', { state: { type: 'aahar' } })}
          className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
        >
          <History className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* User Prakriti Info */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Targeting Your Dosha</p>
            <h3 className="text-lg font-black text-gray-900 leading-tight">
              {userData?.dosha ? `${userData.dosha} Balanced Nutrition` : "General Ayurvedic Balance"}
            </h3>
          </div>
        </div>

        {/* Action Area */}
        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="aspect-square w-full bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden group hover:border-emerald-200 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-black text-gray-900">Capture Food Plate</h3>
                <p className="text-sm text-gray-400 font-medium mt-2">Take a clear photo of your meal from top-down for best results.</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                />
              </div>

              <div className="flex items-center gap-3 px-2">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 rounded-2xl border border-gray-100 flex items-center justify-center gap-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload from Gallery
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Preview */}
              <div className="relative aspect-square w-full rounded-[3rem] overflow-hidden shadow-2xl">
                <img src={image} alt="Meal" className="w-full h-full object-cover" />
                {!result && !analyzing && (
                  <button 
                    onClick={reset}
                    className="absolute top-6 right-6 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                  >
                    <RotateCcw className="w-6 h-6" />
                  </button>
                )}
              </div>

              {/* Analysis Button or Result */}
              {!result ? (
                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Analyzing Ingredients...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      Check Compatibility
                    </>
                  )}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Score Card */}
                  <div className="bg-black p-8 rounded-[3rem] text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-full border-8 border-emerald-600/30 flex flex-col items-center justify-center mb-6">
                        <span className="text-4xl font-black text-white">{result.compatibilityScore}<span className="text-xl text-amber-500">%</span></span>
                        <span className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Compatibility</span>
                      </div>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase">{result.dishName}</h3>
                      <div className="mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-600/20 border border-emerald-600/40 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                        {result.prakritiImpact}
                      </div>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                      <Brain className="w-4 h-4" />
                      Ayurvedic Insight
                    </h4>
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm leading-relaxed text-gray-700 font-medium">
                      {result.insights}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                      <Zap className="w-4 h-4" />
                      Actionable Tips
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {result.tips.map((tip: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <p className="text-sm font-bold text-emerald-900">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brand Message */}
                  <div className="p-8 rounded-[2.5rem] bg-stone-950 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/10 rounded-full blur-2xl" />
                    <p className="text-white font-medium italic relative z-10">"{result.message}"</p>
                  </div>

                  <button 
                    onClick={reset}
                    className="w-full py-5 rounded-2xl border border-gray-100 flex items-center justify-center gap-3 text-sm font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Scan Another Meal
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Safety Disclaimer */}
        <div className="p-6 rounded-2xl bg-amber-50/30 border border-amber-100/50 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-amber-700/60 font-bold leading-relaxed uppercase">
            Disclaimer: Aahar Vision provides wellness insights based on Ayurvedic principles. This is not medical advice. Consult a professional for dietary concerns.
          </p>
        </div>
      </div>
    </div>
  );
}
