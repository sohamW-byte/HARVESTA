'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signOut as firebaseSignOut, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth as useFirebaseAuth, useFirestore, useUser } from '@/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  auth: ReturnType<typeof useFirebaseAuth>;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function setCookie(name: string, value: string, days: number) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function eraseCookie(name: string) {   
    document.cookie = name+'=; Max-Age=-99999999; path=/';  
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingRedirect, setIsProcessingRedirect] = useState(true);

  // Effect 1: Handle Google Sign-In Redirect. This should run only once on mount.
  useEffect(() => {
    const processRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const additionalInfo = getAdditionalUserInfo(result);

          if (additionalInfo?.isNewUser) {
            const userDocRef = doc(db, 'users', user.uid);
            // Check if profile already exists from another sign-up method
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
                const userData: Partial<UserProfile> = {
                    name: user.displayName || 'New User',
                    email: user.email!,
                    photoURL: user.photoURL || undefined,
                };
                await setDoc(userDocRef, userData, { merge: true });
            }
          }
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      } finally {
        setIsProcessingRedirect(false);
      }
    };
    processRedirectResult();
  }, [auth, db]);


  // Effect 2: Main Auth State and Profile Handling
  useEffect(() => {
    if (isUserLoading || isProcessingRedirect) {
      setLoading(true);
      return;
    }

    if (!user) {
      // User is logged out
      setUserProfile(null);
      eraseCookie('firebaseIdToken');
      setLoading(false);
      const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
      if (!isAuthRoute) {
        router.replace('/login');
      }
      return;
    }

    // User is logged in, manage their session and profile
    user.getIdToken().then(token => setCookie('firebaseIdToken', token, 1));
    
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      const onAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

      if (docSnap.exists()) {
        const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
        setUserProfile(profile);

        if (profile.role) {
          // Profile is complete
          if (onAuthPage) {
            router.replace('/dashboard');
          }
        } else {
          // Profile is incomplete
          if (pathname !== '/signup/complete-profile') {
            router.replace('/signup/complete-profile');
          }
        }
      } else {
        // Doc doesn't exist, this happens for new Google users before profile is created
        if (pathname !== '/signup/complete-profile') {
          router.replace('/signup/complete-profile');
        }
      }
       setLoading(false);
    }, (error) => {
      console.error("Error listening to user profile, signing out:", error);
      firebaseSignOut(auth);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isUserLoading, isProcessingRedirect, auth, db, router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    // The main useEffect will handle cleanup and redirection
  };
  
  const value = { user, auth, userProfile, loading: loading || isUserLoading || isProcessingRedirect, signOut };

  // Render a loading screen or children
  if (loading || isUserLoading || isProcessingRedirect) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
             <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Initializing Session...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
