import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: t.onboarding.title1,
      description: t.onboarding.desc1,
      icon: <Sparkles className="w-16 h-16 text-ayur-teal" />,
      color: "bg-ayur-teal/10"
    },
    {
      title: t.onboarding.title2,
      description: t.onboarding.desc2,
      icon: <ShieldCheck className="w-16 h-16 text-ayur-green" />,
      color: "bg-ayur-green/10"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={`w-32 h-32 ${slides[currentSlide].color} rounded-full flex items-center justify-center mb-12 shadow-inner`}>
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-3xl font-metal tracking-wider text-gray-900 mb-6 drop-shadow-sm">
              {slides[currentSlide].title}
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium max-w-xs mx-auto">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 md:p-12 flex flex-col items-center space-y-6 md:space-y-8">
        {/* Progress Dots */}
        <div className="flex gap-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-emerald-600" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={nextSlide}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/30 transition-all active:scale-95 text-base border-b-4 border-emerald-800"
        >
          {currentSlide === slides.length - 1 ? t.onboarding.getStarted : t.onboarding.next}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
