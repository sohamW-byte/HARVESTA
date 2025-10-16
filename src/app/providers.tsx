'use client';

import { AuthProvider } from '@/hooks/use-auth';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import { TranslationProvider } from '@/hooks/use-translation';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <FirebaseClientProvider>
                <AuthProvider>
                    <TranslationProvider>
                        {children}
                    </TranslationProvider>
                </AuthProvider>
            </FirebaseClientProvider>
        </ThemeProvider>
    );
}
