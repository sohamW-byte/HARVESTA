'use client';

import { useEffect } from 'react';
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

export function LanguageSwitcher() {
  const handleLanguageChange = (langCode: string) => {
    const cookieName = 'googtrans';
    // The value needs to be in the format /source_lang/target_lang
    // We use an empty source_lang to let Google auto-detect
    const value = `/${langCode}`;
    
    // Set the cookie for Google Translate
    document.cookie = `${cookieName}=${value}; path=/; domain=${window.location.hostname}`;
    
    // Reload the page to apply the translation
    window.location.reload();
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
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
