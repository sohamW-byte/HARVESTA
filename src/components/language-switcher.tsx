
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
];

// A simple dictionary for mock translations
const translations: Record<string, Record<string, string>> = {
  'en': {
    'Profile': 'Profile',
    'Log out': 'Log out',
  },
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

  const translateNode = (node: Node, langCode: string) => {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      const parentElement = node.parentElement;
      if (parentElement && window.getComputedStyle(parentElement).display !== 'none') {
        const originalText = (originalTexts.get(parentElement) || node.textContent).trim();
        
        if (!originalTexts.has(parentElement)) {
          originalTexts.set(parentElement, originalText);
        }
        
        const translatedText = translations[langCode]?.[originalText];
        if (translatedText) {
          node.textContent = translatedText;
        } else if (langCode === 'en' && originalTexts.has(parentElement)) {
            node.textContent = originalTexts.get(parentElement) || '';
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
       if (element.closest('[data-id="language-switcher"]') || element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
        return;
      }
      // Check for elements specifically marked for translation
      if(element.dataset.translate === 'true') {
        // Store original text if not already stored
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.innerText);
        }
        
        const originalText = originalTexts.get(element)?.trim();
        if (originalText) {
            const translatedText = translations[langCode]?.[originalText];
            if (translatedText) {
                element.innerText = translatedText;
            } else if (langCode === 'en') {
                element.innerText = originalText;
            }
        }
      }
    }
  };


  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) return;

    setIsTranslating(true);
    
    await new Promise(resolve => setTimeout(resolve, 50));

    const elementsToTranslate: NodeListOf<HTMLElement> = document.querySelectorAll('body *');

    // Store originals on first translation away from English
    if (currentLanguage === 'en' && langCode !== 'en') {
        originalTexts.clear();
        document.querySelectorAll('[data-translate="true"]').forEach(el => {
            const htmlEl = el as HTMLElement;
            if(htmlEl.innerText) {
                originalTexts.set(htmlEl, htmlEl.innerText);
            }
        });
    }


    elementsToTranslate.forEach(element => {
      if (element.dataset.translate === 'true') {
        const originalText = originalTexts.get(element)?.trim() || element.innerText.trim();
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        
        const translatedText = translations[langCode]?.[originalText];

        if (langCode === 'en') {
            element.innerText = originalTexts.get(element) || originalText;
        } else if (translatedText) {
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

