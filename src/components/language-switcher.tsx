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

async function translateText(text: string, targetLang: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_TRANSLATE_API_KEY;

  if (!apiKey) {
    console.error("Translation API key is not configured.");
    return text; // Return original text if key is missing
  }
  
  // =================================================================
  // IMPORTANT: Replace with your actual API endpoint.
  // This is a placeholder and will not work.
  // =================================================================
  const apiEndpoint = 'https://api.your-translation-service.com/translate';

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // IMPORTANT: The header name 'Authorization' and the 'Bearer' prefix
        // may be different for your specific API. Check your API's documentation.
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: text,
        target_lang: targetLang,
        // Your API might require other parameters here.
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Translation API request failed:', response.status, errorBody);
      return text; // Return original text on failure
    }

    const result = await response.json();

    // IMPORTANT: The structure of the response will depend on your API.
    // You might need to adjust `result.translated_text` to match the actual response.
    return result.translated_text || text;

  } catch (error) {
    console.error('An error occurred during translation:', error);
    return text;
  }
}


export function LanguageSwitcher() {
  const handleLanguageChange = async (langCode: string) => {
    const greetingElement = document.getElementById('dashboard-greeting');
    
    if (!greetingElement) {
        console.error('Could not find the element to translate.');
        return;
    }

    // Store original text if not already stored
    if (!greetingElement.dataset.originalText) {
        greetingElement.dataset.originalText = greetingElement.textContent || '';
    }
    
    if (langCode === 'en') {
      greetingElement.textContent = greetingElement.dataset.originalText || '';
      return;
    }
    
    const originalText = greetingElement.dataset.originalText;
    if (originalText) {
        const translatedText = await translateText(originalText, langCode);
        greetingElement.textContent = translatedText;
    }
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
