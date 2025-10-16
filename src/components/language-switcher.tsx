
"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useState } from 'react';


const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'gom', name: 'कोंकणी (Konkani)' },
];

export function LanguageSwitcher() {
  const { setLanguage, language } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    if (langCode === language) return;
    
    setIsChanging(true);
    // Simulate a brief delay to give user feedback
    setTimeout(() => {
        setLanguage(langCode);
        setIsChanging(false);
    }, 100);
  };

  return (
    <div data-id="language-switcher">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isChanging}>
            {isChanging ? <Loader2 className="h-5 w-5 animate-spin" /> : <Globe className="h-5 w-5" />}
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
