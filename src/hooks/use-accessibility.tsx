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

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('base');
  const [colorInversion, setColorInversionState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on initial client-side render
    const storedFontSize = localStorage.getItem(FONT_SIZE_KEY) as FontSize | null;
    const storedColorInversion = localStorage.getItem(COLOR_INVERSION_KEY);

    if (storedFontSize) {
      setFontSizeState(storedFontSize);
    }
    if (storedColorInversion) {
      setColorInversionState(storedColorInversion === 'true');
    }
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;

    const htmlElement = document.documentElement;

    // Apply font size
    htmlElement.classList.remove('font-size-sm', 'font-size-base', 'font-size-lg');
    htmlElement.classList.add(`font-size-${fontSize}`);
    localStorage.setItem(FONT_SIZE_KEY, fontSize);

    // Apply color inversion
    if (colorInversion) {
      htmlElement.classList.add('invert-colors');
    } else {
      htmlElement.classList.remove('invert-colors');
    }
    localStorage.setItem(COLOR_INVERSION_KEY, String(colorInversion));

  }, [fontSize, colorInversion, isMounted]);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
  };

  const setColorInversion = (enabled: boolean) => {
    setColorInversionState(enabled);
  };
  
  if (!isMounted) {
      return null;
  }

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
