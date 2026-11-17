import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-full w-fit">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
          language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
          language === 'hi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'
        }`}
      >
        HI
      </button>
    </div>
  );
}
