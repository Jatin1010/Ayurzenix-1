import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, TranslationSchema, translations } from '../lib/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  t: TranslationSchema;
  isLanguageSet: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isLanguageSet, setIsLanguageSet] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('appLanguage') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setLanguageState(savedLang);
      setIsLanguageSet(true);
    }
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    setIsLanguageSet(true);
    localStorage.setItem('appLanguage', code);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSet }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
