'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, TRANSLATIONS, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string | TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const FALLBACK_LANGUAGE_CONTEXT: LanguageContextType = {
  language: 'en',
  setLanguage: () => {
    // no-op fallback used only when provider is not mounted
  },
  t: (key: string | TranslationKey) => {
    return (TRANSLATIONS.en as any)[key] || String(key);
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('drishyam_language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('drishyam_language', lang);
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  };

  const t = (key: string | TranslationKey) => {
    const langDict = TRANSLATIONS[language];
    // Return translation if exists, otherwise return the key itself
    return (langDict as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[LanguageProvider] useLanguage called outside provider. Falling back to English defaults.');
    }
    return FALLBACK_LANGUAGE_CONTEXT;
  }
  return context;
}
