import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';
import { ThemeProvider } from '@/components/theme-provider';
import { TranslationProvider } from '@/hooks/use-translation';
import { AccessibilityProvider } from '@/hooks/use-accessibility';

export const metadata: Metadata = {
  title: 'Harvesta',
  description: 'A modern farming and analytics dashboard.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-code-pro',
});

function RootProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
              <AccessibilityProvider>
                <FirebaseClientProvider>
                <AuthProvider>
                    <TranslationProvider>
                        {children}
                        <Toaster />
                    </TranslationProvider>
                </AuthProvider>
                </FirebaseClientProvider>
              </AccessibilityProvider>
            </ThemeProvider>
        </>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-body antialiased', inter.variable, sourceCodePro.variable)}>
        <RootProviders>
            {children}
        </RootProviders>
      </body>
    </html>
  );
}
