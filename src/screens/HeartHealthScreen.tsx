import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ArrowLeft,
  ArrowRight, 
  ChevronLeft,
  Activity, 
  Scale, 
  User, 
  Utensils, 
  Moon, 
  Zap, 
  AlertCircle,
  Clock,
  ShieldCheck,
  Flame,
  Wind,
  Droplets,
  Stethoscope,
  Sparkles,
  Brain,
  Leaf,
  CheckCircle2
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getFeaturePricing, Plan } from '../lib/pricing';
import PlanSelectionModal from '../components/PlanSelectionModal';
import { saveProfileLocally } from '../lib/localHistory';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

const STEPS = [
  { id: 'profile', title: 'Profile', icon: <User className="w-5 h-5" /> },
  { id: 'vitals', title: 'Vitals', icon: <Activity className="w-5 h-5" /> },
  { id: 'lifestyle', title: 'Lifestyle', icon: <Moon className="w-5 h-5" /> },
  { id: 'symptoms', title: 'Symptoms', icon: <AlertCircle className="w-5 h-5" /> },
  { id: 'history', title: 'History', icon: <Clock className="w-5 h-5" /> },
  { id: 'ayurveda', title: 'Ayurveda', icon: <Flame className="w-5 h-5" /> }
];

const HEART_BLOG = {
  title: "❤️ Why Heart Attacks Are Increasing in India (2026 Insights)",
  intro: "📊 Heart attacks are no longer a problem limited to older adults. Across India, cases are rising rapidly—even among people in their 30s and 40s. According to multiple health reports, cardiovascular disease has become one of the leading causes of death in India. What’s more concerning is that many people show no clear symptoms before a heart event. So what’s causing this sudden rise? And more importantly—how can you protect yourself?",
  sections: [
    {
      title: "🚨 Why Heart Attack Cases Are Rising in India",
      points: [
        {
          head: "🧠 High Stress Lifestyle",
          content: "Modern life is fast, competitive, and mentally demanding. Work pressure, financial stress, and poor work-life balance increase cortisol levels, which can lead to high blood pressure, inflammation, and heart strain.",
          isHighlighted: true
        },
        {
          head: "🍔 Poor Diet Habits",
          content: "Diet has changed drastically in the last decade. Excess oil, fried food, high sugar intake, and processed food lead to high cholesterol, artery blockage, and weight gain."
        },
        {
          head: "🛋️ Lack of Physical Activity",
          content: "Sedentary lifestyle is a major risk factor. Long sitting hours and minimal movement reduce heart efficiency and increase obesity risk."
        },
        {
          head: "💤 Poor Sleep Quality",
          content: "Sleep is often ignored but critical. Less than 6 hours of sleep leads to increased stress hormones and irregular heart rhythms."
        },
        {
          head: "🚬 Smoking & Alcohol",
          content: "Smoking damages blood vessels and reduces oxygen supply. Even occasional habits contribute to higher BP and heart rhythm issues."
        },
        {
          head: "🧬 Family History & Genetics",
          content: "If parents or close relatives had heart disease, your risk increases. But lifestyle plays a bigger role."
        }
      ]
    },
    {
      title: "⚠️ Early Signs You Should Not Ignore",
      content: "Many heart attacks give warning signals. Watch out for: Chest pain or tightness, shortness of breath, fatigue, dizziness, or irregular heartbeat. Ignoring these signs can be dangerous."
    },
    {
      title: "📜 Insights from Ashtanga Hridayam",
      content: "Ashtanga Hridayam, the core Ayurvedic text, teaches that the heart (Hridaya) is the seat of Ojas (vitality) and Sadhaka Pitta (emotional intelligence). It emphasizes that suppressing emotional or physical urges (Adharaniya Vega) directly strains the heart's rhythm. To protect the heart, it recommends a 'Sattvic' diet, regular deep breathing, and the use of cardiac tonics like Arjuna to keep the Srotas (channels) clear of Ama."
    },
    {
      title: "🌿 Benefits of Ayurveda",
      content: "According to Ayurveda, heart health is linked to dosha balance: Vata imbalance (irregular heartbeat, anxiety), Pitta imbalance (high BP, inflammation), and Kapha imbalance (cholesterol, blockage). A balanced lifestyle helps maintain heart function naturally. Ayurveda uses 'Hridaya' (heart) herbs like Arjuna and Guggul to strengthen the cardiac muscles and clear Srotas."
    }
  ],
  conclusion: "Heart attacks in India are increasing due to lifestyle, stress, and poor habits—but the good news is most cases are preventable. By becoming aware, making small changes, and using smart tools, you can protect your heart and live a healthier life."
};

export default function HeartHealthScreen({ userData, appConfig }: { userData: any, appConfig?: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0); // 0 is entry, 1-6 are steps
  const [loading, setLoading] = useState(false);
  const pricing = getFeaturePricing('heart-health', appConfig);

  const [showForm, setShowForm] = useState(window.location.hash === '#form');
  
  useEffect(() => {
    const handleHashChange = () => {
      setShowForm(window.location.hash === '#form');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (showForm) window.location.hash = 'form';
    else if (window.location.hash === '#form') window.location.hash = '';
  }, [showForm]);

  useEffect(() => {
    // Restore pending data if it exists
    const pending = sessionStorage.getItem('pending_analysis_data');
    if (pending) {
      try {
        const parsed = JSON.parse(pending);
        if (parsed.type === 'heart_health' && parsed.formData) {
          setFormData(prev => ({ ...prev, ...parsed.formData }));
          setShowForm(true);
          // Only clear if confirmed or after successful restoration on first mount
          sessionStorage.removeItem('pending_analysis_data');
        }
      } catch (e) {
        console.error("Failed to restore pending data:", e);
      }
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step, showForm]);

  // Colors
  const colors = {
    primary: "#00BFA6",
    accent: "#FFB400",
    cta: "#FF6B6B",
    secondary: "#A259FF",
    bgDark: "#0A2F30",
    bgDeep: "#040F49",
    bgLight: "#F7FCF9",
    textDark: "#000000",
    textLight: "#ffffff"
  };

  const [formData, setFormData] = useState({
    // Step 1: Profile
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    // Step 2: Vitals
    bp_systolic: '',
    bp_diastolic: '',
    heart_rate: '',
    cholesterol: '',
    sugar: '',
    // Step 3: Lifestyle
    diet_oil: 'Moderate',
    diet_sugar: 'Moderate',
    diet_salt: 'Moderate',
    physical_activity: 'Moderate',
    sleep_quality: 'Good',
    stress_level: 'Moderate',
    // Step 4: Symptoms
    chest_pain: false,
    breathlessness: false,
    palpitations: false,
    fatigue: false,
    extra_symptoms: '',
    // Step 5: History
    smoking: 'Never',
    alcohol: 'Never',
    family_history: false,
    // Step 6: Ayurveda
    body_type: 'Vata-Pitta',
    digestion: 'Variable'
  });

  const bmi = formData.weight && formData.height 
    ? (Number(formData.weight) / ((Number(formData.height) / 100) ** 2)).toFixed(1)
    : null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSymptomToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof formData]
    }));
  };

  const handleNext = () => {
    if (step < 6) {
      // Basic validation
      if (step === 1 && (!formData.age || !formData.height || !formData.weight)) {
        alert("Please fill all profile details");
        return;
      }
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else setShowForm(false);
  };

  const handleSubmit = async () => {
    // Safety Logic
    const bpSystolic = Number(formData.bp_systolic);
    const bpDiastolic = Number(formData.bp_diastolic);
    const isHighBP = bpSystolic > 160 || bpDiastolic > 100;
    const isEmergency = formData.chest_pain || isHighBP;

    const payload = {
        ...formData,
        bmi,
        type: 'heart_health',
        isEmergency,
        planId: 'basic',
        price: 0,
        isPaid: false,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        bp_systolic: bpSystolic,
        bp_diastolic: bpDiastolic,
        heart_rate: Number(formData.heart_rate),
        cholesterol: formData.cholesterol ? Number(formData.cholesterol) : null,
        sugar: formData.sugar ? Number(formData.sugar) : null,
    };

    if (!userData || userData.is_guest) {
      sessionStorage.setItem('pendingAnalysis', JSON.stringify(payload));
      navigate('/auth', { state: { from: location.pathname } });
      return;
    }
    setLoading(true);

    try {
      (payload as any).uid = userData.uid;
      const profileId = await saveProfileLocally(payload as any);
      
      // Also save to Firestore if logged in
      if (userData?.uid && userData.uid !== 'guest') {
        const profileRef = doc(db, 'health_profiles', profileId);
        await setDoc(profileRef, {
          ...payload,
          id: profileId,
          createdAt: serverTimestamp()
        });
      }
      
      navigate(`/analysis-pricing/${profileId}`);
    } catch (error) {
      console.error(error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <div className="min-h-screen pb-32 selection:text-white" style={{ backgroundColor: colors.bgLight, color: colors.textDark }}>
        {/* Hero Section */}
        <div className="relative min-h-[70vh] lg:min-h-[85vh] w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
          <motion.img 
            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=2000" 
            alt="Heart Health Banner" 
            className="absolute inset-0 w-full h-full object-cover scale-110"
            referrerPolicy="no-referrer"
            animate={{ 
              scale: [1.1, 1.15, 1.1],
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: `${colors.bgDark}80` }} />
          
          <button 
            onClick={() => navigate(-1)} 
            className="absolute top-24 left-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 z-[60] active:scale-95 transition-all hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 space-y-8 max-w-4xl pt-32 pb-12"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <Sparkles className="w-4 h-4" style={{ color: colors.accent, fill: colors.accent }} />
              AI + Ayurveda Powered
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1] tracking-tighter drop-shadow-2xl">
              Understand Your Heart Risk <br/>
              <span style={{ color: colors.accent }}>Before It’s Too Late</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed">
              Identify hidden patterns and get a clinical-grade heart health analysis in just 60 seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowForm(true);
                  if (step === 0) setStep(1);
                }}
                className="px-12 py-5 rounded-full text-black font-black text-lg uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-3"
                style={{ backgroundColor: colors.accent, boxShadow: `0 20px 50px ${colors.accent}4d` }}
              >
                Analyze Heart Health <ArrowRight className="w-6 h-6" />
              </motion.button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 opacity-70">
              <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5" style={{ color: colors.primary }} /> 100% Private
              </div>
              <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest">
                <Clock className="w-5 h-5" style={{ color: colors.primary }} /> 60 Sec Result
              </div>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[120%] h-48 rounded-[100%] blur-xl opacity-50" style={{ backgroundColor: colors.bgLight }} />
        </div>

        <div className="max-w-4xl mx-auto px-6 -mt-12 relative z-30 space-y-16 pb-20">
          
          {/* Risk Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.06)] border border-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <AlertCircle className="w-40 h-40" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight italic">You May Be At Risk If:</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Fluctuating Blood Pressure",
                  "High Stress or Anxiety",
                  "Poor Diet & Junk Food",
                  "Lack of Physical Activity",
                  "Unexplained Fatigue",
                  "Family History of Cardiac Issues"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-rose-200 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-rose-500/10 flex items-center justify-center mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    </div>
                    <span className="text-sm font-bold text-gray-700 tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Problem & Solution Grid */}
          <div className="grid md:grid-cols-2 gap-8">
             <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6"
            >
              <h3 className="text-xl font-black text-rose-600 flex items-center gap-3">
                <Brain className="w-6 h-6" /> The Problem
              </h3>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">
                Most people check their heart health only after severe symptoms appear. <span className="text-rose-500 font-bold block mt-2">By then, it's often too late for simple natural interventions.</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2.5rem] text-white shadow-xl space-y-6 shadow-cyan-900/20"
              style={{ backgroundColor: colors.primary }}
            >
              <h3 className="text-xl font-black flex items-center gap-3">
                <Heart className="w-6 h-6 fill-white" /> A Smarter Way
              </h3>
              <p className="text-lg font-medium leading-relaxed opacity-95">
                Analyze your heart markers in 60 seconds. <span className="block mt-2 font-black text-white underline decoration-4 underline-offset-8 text-2xl" style={{ textDecorationColor: colors.accent }}>No Lab Tests. No Confusion.</span>
              </p>
            </motion.div>
          </div>

          {/* Blog Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">{HEART_BLOG.title}</h2>
              <div className="w-32 h-2 mx-auto rounded-full" style={{ backgroundColor: colors.primary }} />
            </div>

            <div className="bg-white p-8 md:p-16 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_100px_rgba(0,0,0,0.03)] space-y-16">
              <p className="text-xl text-gray-600 font-medium leading-relaxed italic border-l-8 pl-8 py-2" style={{ borderColor: colors.primary }}>
                {HEART_BLOG.intro}
              </p>

              {/* How to Use Section */}
              <div className="space-y-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-100/50 border border-gray-200">
                  <CheckCircle2 className="w-5 h-5" style={{ color: colors.primary }} />
                  <span className="text-xs font-black uppercase tracking-widest text-gray-600">How to Use This Analyzer</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    "Fill in your basic profile (Age, Weight, Ht)",
                    "Provide your known Vitals (BP, Sugar, HR)",
                    "Share your daily Lifestyle habits",
                    "Identify your current physical Symptoms",
                    "List your medical & family history",
                    "Get your AI Heart Risk Score instantly"
                  ].map((step, i) => (
                    <div key={i} className="space-y-3 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-50 hover:border-gray-200 transition-colors">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white" style={{ backgroundColor: colors.primary }}>
                        {i + 1}
                      </div>
                      <p className="font-bold text-gray-700 leading-tight">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {HEART_BLOG.sections.map((section, idx) => (
                <div key={idx} className="space-y-8">
                  <h3 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                    <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: colors.accent }} />
                    {section.title}
                  </h3>
                  
                  {section.points ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {section.points.map((point, pIdx) => (
                        <div 
                          key={pIdx} 
                          className={`p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-xl ${point.isHighlighted ? 'border-l-[12px]' : 'border-gray-50 bg-gray-50/30'}`}
                          style={point.isHighlighted ? { borderColor: colors.primary, backgroundColor: `${colors.primary}05` } : {}}
                        >
                          <h4 className="text-xl font-black text-gray-900 mb-3" style={{ color: point.isHighlighted ? colors.primary : colors.textDark }}>
                            {point.head}
                          </h4>
                          <p className="text-sm font-medium text-gray-500 leading-relaxed">
                            {point.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-gray-100 italic font-bold text-gray-600 text-lg leading-relaxed">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}

              {/* Unique Section */}
              <div className="bg-gray-900 p-12 rounded-[3.5rem] text-white space-y-8 relative overflow-hidden">
                <Sparkles className="absolute top-10 right-10 w-32 h-32 text-white/5" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-black italic">Why Ayurzenix is Unique?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <h4 className="text-xl font-black" style={{ color: colors.accent }}>AI + Ayurveda Advantage</h4>
                      <p className="text-white/70 font-medium">We combine modern data analytics with 5,000-year-old Vedic wisdom to identify health trends before they manifest as disease.</p>
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-xl font-black" style={{ color: colors.accent }}>Zero Lab Tests Needed</h4>
                       <p className="text-white/70 font-medium">Evaluation based on physiological markers, lifestyle data, and hereditary mapping—accessible anytime, anywhere.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="space-y-10">
                <h3 className="text-3xl font-black text-center">Heart-Strong Quick Tips</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { t: "Avoid Salt", d: "Reduces arterial pressure" },
                    { t: "Cinnamon", d: "Good for circulation" },
                    { t: "Pranayama", d: "Lowers chronic stress" },
                    { t: "Sleep by 10", d: "Hormonal reset time" }
                  ].map((tip, i) => (
                    <div key={i} className="text-center space-y-2 p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center font-black" style={{ backgroundColor: `${colors.accent}20`, color: colors.accent }}>
                        <Zap className="w-6 h-6" />
                      </div>
                      <h5 className="font-black text-gray-900 text-sm">{tip.t}</h5>
                      <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{tip.d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="space-y-10 pt-10 border-t border-gray-100">
                <h3 className="text-3xl font-black">Frequently Asked Questions</h3>
                <div className="space-y-6">
                  {[
                    { q: "Is this analyzer 100% accurate?", a: "It provides a wellness risk assessment based on standard clinical algorithms and Ayurvedic principles. It is NOT a medical diagnosis." },
                    { q: "Why check heart health early?", a: "Most heart events are preventable if lifestyle changes are made while risk is still moderate." },
                    { q: "What should I do after getting results?", a: "Follow the personalized Ayurvedic routines and consult a cardiologist if high risk is detected." }
                  ].map((faq, i) => (
                    <div key={i} className="p-8 rounded-3xl border border-gray-100 bg-gray-50/50 space-y-3">
                      <h4 className="text-lg font-black text-gray-900 flex gap-4">
                        <span style={{ color: colors.primary }}>Q.</span> {faq.q}
                      </h4>
                      <p className="text-gray-600 font-medium leading-relaxed pl-10">
                        <span className="font-bold text-gray-400">Ans:</span> {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-12 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden" style={{ backgroundColor: colors.bgDark }}>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                 <h4 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4 relative z-10">
                   <Zap className="w-10 h-10" style={{ color: colors.accent }} /> 
                   <span>The Health Verdict</span>
                 </h4>
                 <p className="text-xl font-medium opacity-90 leading-relaxed relative z-10">
                   {HEART_BLOG.conclusion}
                 </p>
              </div>
            </div>
          </motion.div>

          {/* Result Preview Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8 bg-white py-16 rounded-[4rem] border border-gray-50 shadow-[0_30px_90px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-[0.2em]">Sample Analysis Preview</h2>
              <p className="text-gray-400 font-bold text-sm tracking-widest italic">Wait for it to build your report</p>
            </div>

            <div className="relative inline-block">
               {/* Pulse Animation */}
               <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ backgroundColor: colors.accent }}
               />
               <div className="relative w-48 h-48 rounded-full border-[12px] flex flex-col items-center justify-center bg-white shadow-inner" style={{ borderColor: `${colors.primary}15` }}>
                  <span className="text-6xl font-black" style={{ color: colors.accent }}>68%</span>
                  <span className="text-[10px] font-black text-gray-400 uppercase mt-1 tracking-widest">Risk Index</span>
               </div>
            </div>

            <div className="max-w-sm mx-auto space-y-2">
              <div className="px-6 py-2 bg-amber-50 rounded-full text-xs font-black uppercase tracking-widest inline-block border border-amber-100" style={{ color: colors.accent }}>
                Moderate Risk Detected
              </div>
              <p className="text-gray-500 font-bold italic text-sm">"Early signs of arterial stiffness identified via lifestyle mapping."</p>
            </div>
          </motion.div>

          {/* What You'll Get */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-center text-gray-900 tracking-tight">What's Inside Your Report?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <Activity className="w-6 h-6" />, title: "Clinical Heart Risk Score", desc: "Based on medical algorithms and Vedic markers." },
                { icon: <Utensils className="w-6 h-6" />, title: "Lifestyle Bottlenecks", desc: "Pinpoint diet and habit causes of heart stress." },
                { icon: <Zap className="w-6 h-6" />, title: "Early Warning Signals", desc: "Detection of issues that standard checkups miss." },
                { icon: <Leaf className="w-6 h-6" />, title: "Ayurvedic Recovery Path", desc: "Herbs and routines to strengthen your Hridaya." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-6 p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all border-l-[6px]" style={{ borderLeftColor: colors.primary }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${colors.primary}15`, color: colors.primary }}>
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-gray-900">{feature.title}</h4>
                    <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-tighter opacity-80">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Safety Content */}
          <div className="p-8 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
               <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <div className="space-y-1">
               <h4 className="text-lg font-black text-rose-900 italic">Emergency Warning</h4>
               <p className="text-sm font-bold text-rose-700/80 leading-relaxed uppercase tracking-tighter">
                 If you are experiencing severe chest pain, shortness of breath, or numbness in left arm, please stop reading and consult a hospital IMMEDIATELY.
               </p>
            </div>
          </div>

          {/* Final CTA Area */}
          <div className="text-center space-y-10 py-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Take 60 Seconds for Your Heart</h2>
              <p className="text-xl text-gray-400 font-bold opacity-70 italic tracking-widest">Because your family needs you healthy.</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm(true);
                setStep(1);
              }}
              className="px-16 py-6 rounded-full text-white font-black text-xl uppercase tracking-widest shadow-xl flex items-center gap-4 mx-auto"
              style={{ backgroundColor: colors.cta, boxShadow: `0 30px 70px ${colors.cta}4d` }}
            >
              Analyze Now <ArrowRight className="w-8 h-8" />
            </motion.button>
          </div>
        </div>

        {/* Sticky Mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] bg-white/80 backdrop-blur-md border-t border-gray-100">
          <div className="max-w-lg mx-auto">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setShowForm(true);
                setStep(1);
              }}
              className="w-full py-5 rounded-full text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg flex items-center justify-center gap-3"
              style={{ backgroundColor: colors.primary, boxShadow: `0 20px 40px ${colors.primary}40` }}
            >
              Start Heart Analysis <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    );
  }


  // Form View
  const currentStepInfo = STEPS[step - 1] || STEPS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 pb-32">
      <div className="relative w-full h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800" 
          alt="Heart Health" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-50 via-transparent to-transparent pointer-events-none"></div>
        <button onClick={() => setShowForm(false)} className="absolute top-6 left-6 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm text-gray-700 active:scale-95 border border-white/50 z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 relative z-20 -mt-20">
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-6 h-6 text-emerald-600" />
              <h2 className="text-3xl font-black tracking-tight text-blue-950">Step <span className="text-emerald-600">{step}</span></h2>
            </div>
            <p className="text-stone-700 text-sm font-medium">{currentStepInfo.title} Info</p>
            <p className="italic text-emerald-700 text-xs mt-1">Ayurvedic Insight: {currentStepInfo.id === 'profile' ? 'Understanding your basic prakriti is the first step.' : 'Your vitals reveal your Dosha-Agni status.'}</p>
          </div>
          
          <div className="h-1 bg-gray-200/50 w-full overflow-hidden rounded-full mb-8">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 6) * 100}%` }}
              className="h-full bg-emerald-500"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Age</label>
                    <input 
                      type="number" name="age" value={formData.age} onChange={handleInputChange}
                      placeholder="e.g. 35"
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Gender</label>
                    <select 
                      name="gender" value={formData.gender} onChange={handleInputChange}
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                    >
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Height (cm)</label>
                    <input 
                      type="number" name="height" value={formData.height} onChange={handleInputChange}
                      placeholder="170"
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Weight (kg)</label>
                    <input 
                      type="number" name="weight" value={formData.weight} onChange={handleInputChange}
                      placeholder="70"
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Vitals */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Systolic BP</label>
                    <input 
                      type="number" name="bp_systolic" value={formData.bp_systolic} onChange={handleInputChange}
                      placeholder="120"
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Diastolic BP</label>
                    <input 
                      type="number" name="bp_diastolic" value={formData.bp_diastolic} onChange={handleInputChange}
                      placeholder="80"
                      className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Resting Heart Rate (bpm)</label>
                  <input 
                    type="number" name="heart_rate" value={formData.heart_rate} onChange={handleInputChange}
                    placeholder="72"
                    className="w-full bg-white/60 backdrop-blur-sm px-6 py-4 rounded-3xl border border-white shadow-sm outline-none font-bold text-blue-950 focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Lifestyle */}
            {step === 3 && (
              <div className="space-y-8">
                {[
                  { id: 'diet_oil', label: 'Oil/Fat Intake', options: ['Low', 'Moderate', 'High'] },
                  { id: 'physical_activity', label: 'Activity Level', options: ['Sedentary', 'Moderate', 'Active'] },
                  { id: 'sleep_quality', label: 'Sleep Quality', options: ['Poor', 'Good', 'Excellent'] },
                  { id: 'stress_level', label: 'Stress Level', options: ['Low', 'Moderate', 'High'] }
                ].map((input) => (
                  <div key={input.id} className="space-y-3">
                    <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">{input.label}</label>
                    <div className="grid grid-cols-3 gap-2">
                       {input.options.map(opt => (
                         <button
                           key={opt}
                           type="button"
                           onClick={() => setFormData(prev => ({ ...prev, [input.id]: opt }))}
                           className={`py-3 rounded-2xl text-xs font-bold transition-all ${formData[input.id as keyof typeof formData] === opt ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white/60 text-blue-900 border border-white'}`}
                         >
                           {opt}
                         </button>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Symptoms */}
            {step === 4 && (
              <div className="space-y-8">
                <p className="text-[12px] font-bold text-stone-600 bg-emerald-50/50 p-5 rounded-3xl border border-emerald-100 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                  Select symptoms experienced in the last 30 days:
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'chest_pain', label: 'Chest Pain' },
                    { id: 'breathlessness', label: 'Breathlessness' },
                    { id: 'palpitations', label: 'Racing Heart' },
                    { id: 'fatigue', label: 'Fatigue' }
                  ].map((symptom) => {
                    const isSelected = formData[symptom.id as keyof typeof formData];
                    return (
                      <button
                        key={symptom.id}
                        type="button"
                        onClick={() => handleSymptomToggle(symptom.id)}
                        className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                          isSelected ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white/60 border-white text-blue-950 hover:bg-white'
                        }`}
                      >
                        <ShieldCheck className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />
                        <span className="font-black text-center text-xs">{symptom.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-stone-500 uppercase tracking-widest pl-2">Extra Symptoms (Optional)</label>
                  <textarea
                    name="extra_symptoms"
                    value={formData.extra_symptoms}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe any other symptoms or feelings..."
                    className="w-full bg-white/60 backdrop-blur-sm px-6 py-5 rounded-3xl border border-white shadow-sm outline-none font-medium text-stone-800 focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>
            )}

            {/* Step 5: History */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Smoking Status</label>
                  <select 
                    name="smoking" 
                    value={formData.smoking} 
                    onChange={handleInputChange}
                    className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none font-bold"
                  >
                    <option>Never</option>
                    <option>Former Smoker</option>
                    <option>Current Smoker</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Alcohol Consumption</label>
                  <select 
                    name="alcohol" 
                    value={formData.alcohol} 
                    onChange={handleInputChange}
                    className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none font-bold"
                  >
                    <option>Never</option>
                    <option>Occasions</option>
                    <option>Regular</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Family History of Heart Disease?</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, family_history: true }))}
                      className={`flex-1 p-4 rounded-2xl border font-bold transition-all ${formData.family_history ? 'bg-[#006BDF]/10 border-[#006BDF] text-[#006BDF]' : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, family_history: false }))}
                      className={`flex-1 p-4 rounded-2xl border font-bold transition-all ${!formData.family_history ? 'bg-gray-100 border-gray-200 text-gray-900' : 'bg-white border-gray-100 text-gray-500'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Ayurveda Mapping */}
            {step === 6 && (
              <div className="space-y-6">
                 <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Your Body Type (Dosha)</label>
                  <select 
                    name="body_type" 
                    value={formData.body_type} 
                    onChange={handleInputChange}
                    className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none font-bold"
                  >
                    <option>Vata (Lean/Creative)</option>
                    <option>Pitta (Athletic/Sharp)</option>
                    <option>Kapha (Sturdy/Calm)</option>
                    <option>Vata-Pitta</option>
                    <option>Pitta-Kapha</option>
                    <option>Vata-Kapha</option>
                    <option>Tridoshic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase ml-2 tracking-widest">Digestion Nature (Agni)</label>
                  <select 
                    name="digestion" 
                    value={formData.digestion} 
                    onChange={handleInputChange}
                    className="w-full bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm outline-none font-bold"
                  >
                    <option>Variable (Vishamagni)</option>
                    <option>Strong (Tikshnagni)</option>
                    <option>Slow (Mandagni)</option>
                    <option>Balanced (Samagni)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="pt-8">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={loading}
                className="w-full text-white font-black py-4 rounded-[2rem] shadow-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 transition-all"
                style={{ backgroundColor: colors.primary, boxShadow: `0 20px 40px ${colors.primary}40` }}
              >
                {loading ? 'Processing...' : step === 6 ? 'Analyze Now' : 'Continue'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
              {step === 6 && (
                <p className="text-center mt-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Starting From: ₹{pricing.plans[0].price}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        </div>

        {/* SEO Blog Content Below Form inputs */}
        <div className="max-w-4xl mx-auto mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">❤️ Heart Attacks Are Rising in India — Check Your Risk Before It’s Too Late</h2>
            <h3 className="text-xl font-bold text-rose-500">⚠️ A Silent Problem Most People Ignore</h3>
            <p className="text-gray-600 text-lg font-medium">
              Heart attacks are no longer rare. In India, cases are increasing rapidly—even among people in their 30s and 40s. The most dangerous part? 
            </p>
            <p className="text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl">
              👉 Many people don’t even realize they are at risk until it’s too late.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">🚨 You May Be at Risk If You Have:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 text-lg font-medium p-4">
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> High blood pressure</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> Stress or anxiety</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> Poor diet (oil, sugar, junk food)</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> Low physical activity</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> Poor sleep</li>
              <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-rose-400" /> Family history of heart disease</li>
            </ul>
            <p className="text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl">
              👉 Even if you feel “normal,” risk can still be building silently.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">🧠 The Problem With Traditional Approach</h3>
            <p className="text-gray-600 text-lg font-medium">Most people only check their heart:</p>
            <ul className="space-y-3 text-gray-600 text-lg font-medium px-4">
              <li className="flex gap-3"><span className="text-rose-400 font-black">•</span> After symptoms appear</li>
              <li className="flex gap-3"><span className="text-rose-400 font-black">•</span> After a health scare</li>
              <li className="flex gap-3"><span className="text-rose-400 font-black">•</span> Or during a hospital visit</li>
            </ul>
            <p className="text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl">
              👉 By then, it’s often late.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#00BFA6]">⚡ A Smarter Way to Protect Your Heart</h3>
            <p className="text-gray-600 text-lg font-medium">Instead of waiting for symptoms…</p>
            <p className="text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl">
              <span className="block mb-2">👉 You can analyze your heart risk in just 60 seconds</span>
              <span className="text-gray-500 font-medium">No lab test needed. No complicated reports.</span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">❤️ Introducing: Ayurzenix Heart Health Analyzer</h3>
            <p className="text-gray-600 text-lg font-medium">A powerful tool that combines:</p>
            <ul className="space-y-3 text-gray-600 text-lg font-medium bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <li className="flex items-center gap-3"><span>🧠</span> AI-based clinical risk calculation</li>
              <li className="flex items-center gap-3"><span>🌿</span> Ayurvedic body & dosha analysis</li>
              <li className="flex items-center gap-3"><span>📊</span> Comprehensive lifestyle evaluation</li>
            </ul>
            <p className="text-[#00907d] text-lg font-bold bg-[#00BFA6]/10 p-5 rounded-2xl">
              👉 To give you a clear picture of your heart health instantly
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">📊 What You’ll Discover</h3>
            <p className="text-gray-600 text-lg font-medium">When you use the analyzer, you get:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                <h4 className="font-black text-gray-900 text-lg flex gap-2"><span className="text-[#00BFA6]">✅</span> Risk Score (0-100)</h4>
                <p className="text-gray-500 font-medium">Know immediately if your risk is Low, Moderate, or High</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                <h4 className="font-black text-gray-900 text-lg flex gap-2"><span className="text-[#00BFA6]">✅</span> Lifestyle Impact</h4>
                <p className="text-gray-500 font-medium">Understand how your daily habits are affecting your heart</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                <h4 className="font-black text-gray-900 text-lg flex gap-2"><span className="text-[#00BFA6]">✅</span> Warning Signals</h4>
                <p className="text-gray-500 font-medium">Identify hidden risks before physical symptoms appear</p>
              </div>
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                <h4 className="font-black text-gray-900 text-lg flex gap-2"><span className="text-[#00BFA6]">✅</span> Ayurvedic Insight</h4>
                <p className="text-gray-500 font-medium">Find out your core dosha imbalance (Vata / Pitta / Kapha)</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">💡 Why This Matters</h3>
            <p className="text-gray-600 text-lg font-medium">Most heart problems don’t happen overnight. They build slowly due to Stress, Diet, Lifestyle, and Imbalances in the body.</p>
            <p className="text-gray-800 text-lg font-bold bg-gray-50 p-5 rounded-2xl">
              👉 The earlier you detect it, the easier it is to reverse.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">🌿 Not Just Data — Real Guidance</h3>
            <p className="text-gray-600 text-lg font-medium">Unlike generic tools, Ayurzenix gives you:</p>
            <ul className="space-y-3 text-gray-600 text-lg font-medium px-4">
              <li className="flex gap-3"><span className="text-[#00BFA6] font-black">•</span> Personalized diet suggestions</li>
              <li className="flex gap-3"><span className="text-[#00BFA6] font-black">•</span> Lifestyle correction plan</li>
              <li className="flex gap-3"><span className="text-[#00BFA6] font-black">•</span> Natural Ayurvedic recommendations</li>
            </ul>
            <p className="text-[#00907d] text-lg font-bold bg-[#00BFA6]/10 p-5 rounded-2xl">
              👉 Focused on the root cause, not just the symptoms
            </p>
          </div>

          <div className="space-y-4 bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <h3 className="text-xl font-bold text-rose-700 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> Important Note</h3>
            <p className="text-rose-700 text-lg font-medium">If you currently have Chest pain, Severe breathlessness, or Very high BP</p>
            <p className="text-rose-800 text-lg font-bold mt-2">
              👉 Please consult a doctor immediately.<br/>
              <span className="text-base font-medium opacity-80">This tool is for early awareness and prevention, not an acute emergency diagnosis.</span>
            </p>
          </div>

          <div className="space-y-6 pt-8 text-center bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-gray-900">🚀 Take 60 Seconds for Your Heart</h3>
              <p className="text-gray-600 text-lg font-medium">You don’t need to wait for a warning sign.</p>
            </div>
            
            <p className="text-2xl font-black text-[#00BFA6]">👉 Take control today.</p>

            <div className="space-y-6 pt-4">
              <h4 className="text-xl font-black text-gray-900">🔥 Check Your Heart Health Now</h4>
              <div className="flex flex-wrap justify-center gap-4 text-sm font-bold text-gray-500">
                <span className="bg-white px-4 py-2 rounded-full border border-gray-200">✓ Instant results</span>
                <span className="bg-white px-4 py-2 rounded-full border border-gray-200">✓ Personalized insights</span>
                <span className="bg-white px-4 py-2 rounded-full border border-gray-200">✓ No medical jargon</span>
              </div>
              <button 
                onClick={() => {
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="mt-6 px-10 py-5 rounded-full text-white font-black text-lg uppercase tracking-widest shadow-xl inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: colors.cta, boxShadow: `0 20px 40px ${colors.cta}40` }}
              >
                Start Your Heart Analysis Now <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
