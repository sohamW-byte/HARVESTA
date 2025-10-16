
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

// Store for original texts to allow toggling back to English
const originalTexts = new Map<HTMLElement, string>();
let currentLanguage = 'en';

export function LanguageSwitcher() {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) return;

    setIsTranslating(true);
    
    // Allow the UI to update to show the loader
    await new Promise(resolve => setTimeout(resolve, 50));

    const elementsToTranslate: HTMLElement[] = Array.from(document.querySelectorAll('[data-translate="true"], h1, h2, h3, h4, h5, p, span, button, a, div.text-sm, div.text-xs, div.font-medium, label, CardTitle, CardDescription'));

    const uniqueElements = new Set(elementsToTranslate);
    const visibleElements = Array.from(uniqueElements).filter(el => {
        const style = window.getComputedStyle(el);
        const hasText = el.textContent && el.textContent.trim().length > 0;
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
        // Exclude elements within the language switcher itself
        return hasText && isVisible && !el.closest('[data-id="language-switcher"]');
    });

    if (langCode === 'en') {
      // Revert to original English text
      for (const element of visibleElements) {
        if (originalTexts.has(element)) {
          element.textContent = originalTexts.get(element) || '';
        }
      }
    } else {
      // Store original texts if we are translating from English for the first time
      if (currentLanguage === 'en') {
          originalTexts.clear();
          visibleElements.forEach(el => {
            if(el.textContent) {
              originalTexts.set(el, el.textContent);
            }
          });
      }
      
      // Apply mock translation
      for (const element of visibleElements) {
        const originalText = originalTexts.get(element);
        if (originalText) {
            // Simple mock translation: [lang] Original Text
            element.textContent = `[${langCode}] ${originalText}`;
        }
      }
    }

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
