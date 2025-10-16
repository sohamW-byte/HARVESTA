
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

/**
 * Calls our internal API route to translate a batch of texts securely on the server.
 * @param texts The array of texts to translate.
 * @param targetLang The target language code (e.g., 'hi', 'gom').
 * @returns An array of translated texts, or the original texts on failure.
 */
async function translateTexts(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en' || texts.length === 0) {
    return texts;
  }
  try {
    const response = await fetch("/api/translate/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts, targetLang }),
    });

    if (!response.ok) {
      console.error("Translation API failed:", await response.text());
      return texts; // Return original texts on failure
    }

    const data = await response.json();
    return data.translatedTexts || texts;
  } catch (error) {
    console.error("An error occurred during translation:", error);
    return texts;
  }
}

// Store for original texts to allow toggling back to English
const originalTexts = new Map<HTMLElement, string>();
let currentLanguage = 'en';

export function LanguageSwitcher() {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) return;

    setIsTranslating(true);
    
    const elementsToTranslate: HTMLElement[] = Array.from(document.querySelectorAll('[data-translate="true"], h1, h2, h3, h4, h5, p, span, button, a, div.text-sm, div.text-xs, div.font-medium, label, CardTitle, CardDescription'));

    const uniqueElements = new Set(elementsToTranslate);
    const visibleElements = Array.from(uniqueElements).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    });

    if (langCode === 'en') {
      // Revert to original English text
      for (const element of visibleElements) {
        if (originalTexts.has(element)) {
          element.textContent = originalTexts.get(element) || '';
        }
      }
      currentLanguage = 'en';
      setIsTranslating(false);
      return;
    }

    // Store original texts if we are translating from English
    if (currentLanguage === 'en') {
        originalTexts.clear(); // Clear previous session
        for (const element of visibleElements) {
            if (element.textContent) {
                 originalTexts.set(element, element.textContent);
            }
        }
    }
    
    // Get texts to be translated
    const textsToTranslate = visibleElements.map(el => originalTexts.get(el) || el.textContent || '').filter(Boolean);

    if (textsToTranslate.length > 0) {
        const translatedTexts = await translateTexts(textsToTranslate, langCode);

        let translatedIndex = 0;
        for (const element of visibleElements) {
            const originalText = originalTexts.get(element);
             if (originalText && textsToTranslate.includes(originalText)) {
                element.textContent = translatedTexts[translatedIndex] || originalText;
                translatedIndex++;
            }
        }
    }

    currentLanguage = langCode;
    setIsTranslating(false);
  };

  return (
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
  );
}

// We need a new batch translation endpoint
async function translateText(text: string, targetLang: string): Promise<string> {
    if (targetLang === 'en') {
        return text;
    }
    try {
        const response = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, targetLang }),
        });

        if (!response.ok) {
            console.error("Translation API failed:", await response.text());
            return text;
        }

        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error("An error occurred during translation:", error);
        return text;
    }
}
