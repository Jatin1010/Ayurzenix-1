import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Globe, ChevronRight } from 'lucide-react';
import { LanguageCode, LANGUAGES, translations } from '../lib/translations';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguagePopup() {
  const { setLanguage, language: currentLang, isLanguageSet } = useLanguage();
  const [selected, setSelected] = useState<LanguageCode>(currentLang || 'en');
  const [isVisible, setIsVisible] = useState(!isLanguageSet);

  const handleContinue = () => {
    setLanguage(selected);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 relative"
      >
        {/* Header Gradient */}
        <div className="h-32 bg-gradient-to-br from-ayur-teal to-ayur-green p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-white">
              <h2 className="text-xl font-black tracking-tight leading-none">
                {translations[selected].languagePopup.title}
              </h2>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mt-1">
                {translations[selected].languagePopup.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Language List */}
        <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-2">
            {LANGUAGES.map((lang) => (
              <motion.button
                key={lang.code}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(lang.code)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selected === lang.code
                    ? 'bg-ayur-green/5 border-ayur-green shadow-sm'
                    : 'bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-black ${selected === lang.code ? 'text-ayur-green' : 'text-gray-900'}`}>
                    {lang.nativeName}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                    {lang.name}
                  </span>
                </div>
                {selected === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-ayur-green rounded-full flex items-center justify-center text-white shadow-lg shadow-ayur-green/20"
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-6 bg-gray-50/50 border-t border-gray-100">
          <button
            onClick={handleContinue}
            className="w-full bg-ayur-green text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-ayur-green/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {translations[selected].common.continue}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
