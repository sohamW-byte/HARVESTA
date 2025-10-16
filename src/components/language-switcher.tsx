"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
];

/**
 * Calls our internal API route to translate text securely on the server.
 * @param text The text to translate.
 * @param targetLang The target language code (e.g., 'hi', 'gom').
 * @returns The translated text, or the original text on failure.
 */
async function translateText(text: string, targetLang: string): Promise<string> {
  // If target is English, no need to call the API
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
      return text; // Return original text on failure
    }

    const data = await response.json();
    return data.translatedText || text;
  } catch (error) {
    console.error("An error occurred during translation:", error);
    return text;
  }
}

export function LanguageSwitcher() {
  const [isTranslating, setIsTranslating] = useState(false);

  const handleLanguageChange = async (langCode: string) => {
    const greetingElement = document.getElementById('dashboard-greeting');
    
    if (!greetingElement) {
        console.error('Could not find the element to translate.');
        return;
    }

    setIsTranslating(true);

    // Store original text if it's not already stored
    if (!greetingElement.dataset.originalText) {
        greetingElement.dataset.originalText = greetingElement.textContent || '';
    }
    
    const originalText = greetingElement.dataset.originalText;

    if (langCode === 'en') {
      greetingElement.textContent = originalText;
    } else {
        const translatedText = await translateText(originalText, langCode);
        greetingElement.textContent = translatedText;
    }

    setIsTranslating(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isTranslating}>
          <Globe className="h-5 w-5" />
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
