'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth as useFirebaseAuth, useFirestore, useUser } from '@/firebase';
import { doc, onSnapshot, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader2, Sprout } from 'lucide-react';

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
    if (typeof document !== 'undefined') {
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
}

function eraseCookie(name: string) {   
    if (typeof document !== 'undefined') {
        document.cookie = name+'=; Max-Age=-99999999; path=/';
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // Step 1: Process any pending redirect from Google Sign-In
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const additionalInfo = getAdditionalUserInfo(result);
          if (additionalInfo?.isNewUser) {
            const userDocRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDocRef);
            if (!docSnap.exists()) {
              const profileData: Partial<UserProfile> = {
                name: user.displayName || 'New User',
                email: user.email!,
                photoURL: user.photoURL || undefined,
              };
              await setDoc(userDocRef, profileData, { merge: true });
            }
          }
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
      
      // After processing redirect, isAuthLoading will eventually become false.
      // We wait for that, and then for the actual user object to be available.
      if (isAuthLoading) {
        return; // Wait for Firebase Auth to initialize
      }

      // Step 2: Handle user state (logged in or out)
      if (!user) {
        // User is not logged in
        setUserProfile(null);
        eraseCookie('firebaseIdToken');
        const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
        if (!isAuthPage) {
          router.replace('/login');
        }
        setIsLoading(false);
        return;
      }

      // User is logged in, set token and subscribe to profile
      user.getIdToken().then(token => setCookie('firebaseIdToken', token, 1));

      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        const onAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

        if (docSnap.exists()) {
          const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
          setUserProfile(profile);

          if (profile.role) {
            // Profile is complete, go to dashboard
            if (onAuthPage) {
              router.replace('/dashboard');
            }
          } else {
            // Profile is incomplete, go to completion page
            if (pathname !== '/signup/complete-profile') {
              router.replace('/signup/complete-profile');
            }
          }
        } else {
          // New user (e.g. from Google) whose doc might have just been created
          // or an old user whose doc was deleted. Send to complete profile.
          setUserProfile(null);
          if (pathname !== '/signup/complete-profile') {
            router.replace('/signup/complete-profile');
          }
        }
        setIsLoading(false);
      }, (error) => {
        console.error("Error listening to user profile:", error);
        firebaseSignOut(auth);
        setIsLoading(false);
      });

      return () => unsubscribe();
    };

    handleAuth();
  }, [user, isAuthLoading, auth, db, router, pathname]);

  const signOut = async () => {
    setIsLoading(true);
    await firebaseSignOut(auth);
    // The useEffect hook will handle the rest
  };
  
  const value: AuthContextType = { user, auth, userProfile, loading: isLoading, signOut };

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
             <div className="flex flex-col items-center gap-4">
                <Sprout className="h-12 w-12 text-primary animate-pulse" />
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
