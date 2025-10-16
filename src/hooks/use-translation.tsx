
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the shape of the dictionary
type Translations = {
  [key: string]: {
    [lang: string]: string;
  };
};

// Simple hardcoded dictionary for demonstration
const dictionary: Translations = {
  'Profile': {
    'hi': 'प्रोफ़ाइल',
    'gom': 'प्रोफायल',
  },
  'Log out': {
    'hi': 'लॉग आउट',
    'gom': 'लॉग आउट',
  },
};

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = useCallback((key: string): string => {
    if (language === 'en' || !dictionary[key] || !dictionary[key][language]) {
      return key;
    }
    return dictionary[key][language];
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
