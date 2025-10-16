'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type FontSize = 'sm' | 'base' | 'lg';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  colorInversion: boolean;
  setColorInversion: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZE_KEY = 'harvesta-font-size';
const COLOR_INVERSION_KEY = 'harvesta-color-inversion';

const FONT_SIZE_MULTIPLIERS: Record<FontSize, number> = {
  sm: 0.875,
  base: 1,
  lg: 1.125,
};

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('base');
  const [colorInversion, setColorInversionState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load settings from localStorage on initial client-side render
    const storedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
    const storedColorInversion = localStorage.getItem(COLOR_INVERSION_KEY);

    if (storedFontSize && FONT_SIZE_MULTIPLIERS[storedFontSize]) {
      setFontSizeState(storedFontSize);
    }
    if (storedColorInversion) {
      setColorInversionState(storedColorInversion === 'true');
    }
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;

    const bodyElement = document.body;

    // Apply font size via CSS custom property
    const multiplier = FONT_SIZE_MULTIPLIERS[fontSize];
    document.documentElement.style.setProperty('--font-size-multiplier', String(multiplier));
    localStorage.setItem(FONT_SIZE_KEY, fontSize);

    // Apply color inversion
    if (colorInversion) {
      bodyElement.classList.add('invert-colors');
    } else {
      bodyElement.classList.remove('invert-colors');
    }
    localStorage.setItem(COLOR_INVERSION_KEY, String(colorInversion));

  }, [fontSize, colorInversion, isMounted]);

  const setFontSize = (size: FontSize) => {
    if (FONT_SIZE_MULTIPLIERS[size]) {
      setFontSizeState(size);
    }
  };

  const setColorInversion = (enabled: boolean) => {
    setColorInversionState(enabled);
  };
  
  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, colorInversion, setColorInversion }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
