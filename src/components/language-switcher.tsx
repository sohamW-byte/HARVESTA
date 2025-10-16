
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
];

// A simple dictionary for mock translations
const translations: Record<string, Record<string, string>> = {
  'hi': {
    'Profile': 'प्रोफ़ाइल',
    'Log out': 'लॉग आउट',
  },
  'gom': {
    'Profile': 'प्रोफायल',
    'Log out': 'लॉग आउट',
  }
};

// Store for original texts to allow toggling back to English
const originalTexts = new Map<HTMLElement, string>();
let currentLanguage = 'en';

export function LanguageSwitcher() {
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to find and store original English text
  const storeOriginalTexts = () => {
    if (originalTexts.size > 0) return; // Only store once
    document.querySelectorAll('[data-translate="true"]').forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.innerText && !originalTexts.has(htmlEl)) {
        originalTexts.set(htmlEl, htmlEl.innerText);
      }
    });
  };

  useEffect(() => {
    // Initial scan to store original texts when the component mounts
    const timeoutId = setTimeout(storeOriginalTexts, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) return;

    setIsTranslating(true);
    storeOriginalTexts(); // Ensure originals are stored before translating
    
    // Allow UI to update before heavy DOM manipulation
    await new Promise(resolve => setTimeout(resolve, 50));

    originalTexts.forEach((originalText, element) => {
      if (langCode === 'en') {
        element.innerText = originalText; // Restore from map
      } else {
        const translatedText = translations[langCode]?.[originalText.trim()];
        if (translatedText) {
          element.innerText = translatedText;
        }
      }
    });

    currentLanguage = langCode;
    setIsTranslating(false);
  };

  return (
    <div data-id="language-switcher">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isTranslating}>
            {isTranslating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code} onSelect={() => handleLanguageChange(lang.code)}>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
