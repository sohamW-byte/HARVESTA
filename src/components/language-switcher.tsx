'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
];

// This is a placeholder function. You will need to replace this with the
// actual API call to your translation service.
async function translateText(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.error("Translation API key is not configured.");
    return text; // Return original text if key is missing
  }

  // =================================================================
  // TODO: Replace with your actual API endpoint and request format.
  // Example using fetch:
  /*
  const response = await fetch('https://api.your-translation-service.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      text: text,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    console.error('Translation failed:', await response.text());
    return text; // Return original text on failure
  }

  const result = await response.json();
  return result.translated_text || text;
  */
  // =================================================================

  // For now, we'll just log to the console and return the original text.
  console.log(`(Placeholder) Translating "${text}" to ${targetLang} using key ${apiKey.substring(0, 8)}...`);
  return text;
}


export function LanguageSwitcher() {
  const handleLanguageChange = (langCode: string) => {
    if (langCode === 'en') {
      // Logic to revert to original text might be needed,
      // for now we just reload the page.
      window.location.reload();
      return;
    }
    
    // In a real implementation, you would traverse the document's text nodes
    // and call translateText() on them. This is a complex and fragile process.
    // For this example, we'll just log the intent.
    console.log(`User selected language: ${langCode}. A full implementation would now
    find all text on the page and call the 'translateText' function for each piece.
    This is not implemented due to complexity and security risks.`);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
