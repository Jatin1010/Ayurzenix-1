import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Languages, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

interface Tip {
  id: string;
  text: string;
  textHi: string;
  icon: string;
  category: string;
  categoryHi: string;
  gradient: string;
}

const ALL_TIPS: Tip[] = [
  { 
    id: '1', 
    icon: '🌅', 
    text: 'Start your day with warm water to improve digestion', 
    textHi: 'पाचन में सुधार के लिए अपने दिन की शुरुआत गुनगुने पानी से करें',
    category: 'Digestion', 
    categoryHi: 'पाचन',
    gradient: 'from-[#E0F2FE] via-[#F0F9FF] to-[#DBEAFE]' 
  },
  { 
    id: '2', 
    icon: '🧘', 
    text: 'Practice deep breathing (Pranayama) for mental clarity', 
    textHi: 'मानसिक स्पष्टता के लिए गहरी सांस लेने (प्राणायाम) का अभ्यास करें',
    category: 'Mental Health', 
    categoryHi: 'मानसिक स्वास्थ्य',
    gradient: 'from-[#ECFDF5] via-[#F0FDF4] to-[#DCFCE7]' 
  },
  { 
    id: '3', 
    icon: '🍽', 
    text: 'Eat fresh and warm food, avoid stale meals', 
    textHi: 'ताजा और गर्म भोजन करें, बासी भोजन से बचें',
    category: 'Diet', 
    categoryHi: 'आहार',
    gradient: 'from-[#FFF7ED] via-[#FFFEF2] to-[#FFEDD5]' 
  },
  { 
    id: '4', 
    icon: '🚶', 
    text: 'Take a 10–15 min walk after meals', 
    textHi: 'भोजन के बाद 10-15 मिनट टहलें',
    category: 'Lifestyle', 
    categoryHi: 'जीवनशैली',
    gradient: 'from-[#F0FDF4] via-[#F7FEE7] to-[#ECFDF5]' 
  },
  { 
    id: '5', 
    icon: '💧', 
    text: 'Stay hydrated but avoid drinking water immediately after meals', 
    textHi: 'हाइड्रेटेड रहें लेकिन भोजन के तुरंत बाद पानी पीने से बचें',
    category: 'Hydration', 
    categoryHi: 'जलयोजन',
    gradient: 'from-[#E0FBFF] via-[#F0FDFF] to-[#E0F2FE]' 
  },
  { 
    id: '6', 
    icon: '🌙', 
    text: 'Sleep early and maintain a fixed sleep schedule', 
    textHi: 'जल्दी सोएं और सोने का एक निश्चित समय बनाए रखें',
    category: 'Sleep', 
    categoryHi: 'नींद',
    gradient: 'from-[#F5F3FF] via-[#FAF5FF] to-[#F3E8FF]' 
  },
  { 
    id: '7', 
    icon: '😌', 
    text: 'Reduce stress with meditation or silence time', 
    textHi: 'ध्यान या मौन समय के साथ तनाव कम करें',
    category: 'Mind', 
    categoryHi: 'मन',
    gradient: 'from-[#FFF1F2] via-[#FFF5F5] to-[#FFE4E6]' 
  },
  { 
    id: '8', 
    icon: '🥗', 
    text: 'Include seasonal fruits and vegetables in your diet', 
    textHi: 'अपने आहार में मौसमी फलों और सब्जियों को शामिल करें',
    category: 'Nutrition', 
    categoryHi: 'पोषण',
    gradient: 'from-[#F7FEE7] via-[#FFFBEB] to-[#ECFDF5]' 
  },
  { 
    id: '9', 
    icon: '🔥', 
    text: 'Avoid overeating to keep your Agni (digestion) strong', 
    textHi: 'अपनी अग्नि (पाचन) को मजबूत रखने के लिए अधिक खाने से बचें',
    category: 'Agni', 
    categoryHi: 'अग्नि',
    gradient: 'from-[#FEF2F2] via-[#FFF7ED] to-[#FFEDD5]' 
  },
  { 
    id: '10', 
    icon: '🌿', 
    text: 'Follow a daily routine (Dinacharya) for balance', 
    textHi: 'संतुलन के लिए दैनिक दिनचर्या (दिनचर्या) का पालन करें',
    category: 'Routine', 
    categoryHi: 'दिनचर्या',
    gradient: 'from-[#F0FDFA] via-[#F0FDF4] to-[#F0FDFA]' 
  },
];

interface DailyTipsProps {
  userData: any;
}

export default function DailyTips({ userData }: DailyTipsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lang, setLang] = useState<'en' | 'hi'>(userData?.language === 'hi' ? 'hi' : 'en');
  const [key, setKey] = useState(0); // Used to reset the auto-advance timer

  // Rotation logic: Show 5 tips per day, rotating based on date
  const dailyTips = useMemo(() => {
    const day = new Date().getDate();
    const startIndex = (day % 2 === 1) ? 0 : 5;
    return ALL_TIPS.slice(startIndex, startIndex + 5);
  }, []);

  // Auto-advance every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % dailyTips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [dailyTips.length, key]);

  // Sync with userData language changes
  useEffect(() => {
    if (userData?.language) {
      setLang(userData.language === 'hi' ? 'hi' : 'en');
    }
  }, [userData?.language]);

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % dailyTips.length);
    setKey(prev => prev + 1);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + dailyTips.length) % dailyTips.length);
    setKey(prev => prev + 1);
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
    setKey(prev => prev + 1);
  };

  return (
    <div className="relative group -mx-4 sm:-mx-8 mt-18 overflow-hidden">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-ayur-teal/20 blur-lg rounded-full animate-pulse" />
            <Sparkles className="w-5 h-5 text-ayur-teal relative z-10" />
          </div>
          <h2 className="text-[11px] font-black text-black uppercase tracking-[0.4em] drop-shadow-sm">
            {lang === 'hi' ? 'आज के दिव्य सूत्र' : 'Daily Vedic Wisdom'}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/5 hover:bg-black text-[9px] font-black text-black hover:text-white uppercase tracking-widest transition-all border border-black/5"
          >
            <Languages className="w-3 h-3" />
            {lang === 'en' ? 'हिन्दी' : 'English'}
          </motion.button>
          <div className="flex items-center gap-1.5 bg-black/5 p-1.5 rounded-full border border-black/5">
            {dailyTips.map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  width: i === currentIndex ? 16 : 6,
                  backgroundColor: i === currentIndex ? "#14FFD2" : "rgba(0,0,0,0.1)"
                }}
                className="h-1.5 rounded-full transition-all duration-500"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] bg-white/10">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${lang}`}
            initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative px-4 sm:px-8 py-6 sm:py-10 min-h-[160px] lg:min-h-[200px] flex flex-col justify-center overflow-hidden bg-white/40 backdrop-blur-3xl",
              dailyTips[currentIndex].gradient
            )}
          >
            {/* 8K Cinematic Background Elements */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -right-20 w-64 h-64 bg-ayur-teal/10 rounded-full blur-[80px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, 20, 0],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -left-20 w-48 h-48 bg-ayur-amber/10 rounded-full blur-[60px]" 
            />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <motion.div 
                initial={{ rotate: -15, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white shadow-2xl rounded-3xl flex items-center justify-center text-3xl shrink-0 relative group-hover:rotate-6 transition-transform duration-700 border border-white/60"
              >
                <div className="absolute inset-2 bg-gradient-to-br from-transparent to-black/5 rounded-2xl" />
                <span className="relative z-10 drop-shadow-2xl">{dailyTips[currentIndex].icon}</span>
              </motion.div>
              
              <div className="space-y-3 text-center sm:text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center justify-center sm:justify-start gap-3"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.5em] px-3 py-1 bg-black text-white rounded-full shadow-lg">
                    {lang === 'hi' ? dailyTips[currentIndex].categoryHi : dailyTips[currentIndex].category}
                  </span>
                  <div className="h-px w-6 bg-black/10" />
                  <span className="text-[9px] font-black text-black/30 uppercase tracking-[0.3em]">
                    Source: Charaka Samhita
                  </span>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-black leading-[1.1] tracking-tightest drop-shadow-[0_2px_4px_rgba(0,0,0,0.05)]"
                >
                  {lang === 'hi' ? dailyTips[currentIndex].textHi : dailyTips[currentIndex].text}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center sm:justify-start gap-3 pt-1"
                >
                  <div className="flex -space-x-1.5">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white bg-gray-100 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] font-bold text-black/60 tracking-tight">
                    {Math.floor(Math.random() * 500 + 1200)} seekers followed this today
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Navigation Overlays */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 sm:px-8 pointer-events-none">
              <motion.button 
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); prevTip(); }}
                className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-black hover:text-white transition-all duration-300 border border-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              <motion.button 
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); nextTip(); }}
                className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center text-black pointer-events-auto hover:bg-black hover:text-white transition-all duration-300 border border-white opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust Indicator */}
      <div className="mt-6 flex items-center justify-center gap-6 opacity-30 grayscale pointer-events-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Wisdom</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Instant Bio-Match</span>
        </div>
      </div>
    </div>
  );
}
