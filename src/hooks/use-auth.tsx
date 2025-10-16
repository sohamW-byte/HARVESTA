'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signOut as firebaseSignOut, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth as useFirebaseAuth, useFirestore, useUser } from '@/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

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

  useEffect(() => {
    // This effect is the main driver for authentication state and redirection.
    // It handles the entire lifecycle: checking for redirect results,
    // listening for the user object, and then fetching the user profile.

    const handleAuth = async () => {
        // First, check for a redirect result from Google/other providers
        try {
            const result = await getRedirectResult(auth);
            if (result) {
                // This block runs if a user just came back from a Google Sign-In redirect.
                const user = result.user;
                const additionalInfo = getAdditionalUserInfo(result);

                if (additionalInfo?.isNewUser) {
                    // This is a brand-new user. Create a profile shell for them.
                    const userDocRef = doc(db, 'users', user.uid);
                    const userData: Omit<UserProfile, 'id' | 'role'> = {
                        name: user.displayName || 'New User',
                        email: user.email!,
                        photoURL: user.photoURL || undefined,
                        cropsGrown: [],
                        address: '',
                    };
                    // We only create the doc. Redirection will be handled later.
                    await setDoc(userDocRef, userData, { merge: true });
                }
                // For existing users, no action is needed here.
                // The 'onAuthStateChanged' mechanism (managed by useUser) will pick them up.
            }
        } catch (error) {
             console.error("Google sign-in redirect error:", error);
        }

        // The useUser() hook provides the live user object.
        // We wait for its initial loading to complete.
        if (isUserLoading) {
            setLoading(true);
            return;
        }

        if (!user) {
            // No user is logged in.
            setUserProfile(null);
            eraseCookie('firebaseIdToken');
            setLoading(false);
            // If the user is on a protected page, redirect them to login.
            const isProtectedPage = pathname.startsWith('/dashboard');
            if (isProtectedPage) {
                router.replace('/login');
            }
            return;
        }

        // A user is logged in. Set up the profile listener.
        user.getIdToken().then(token => setCookie('firebaseIdToken', token, 1));
        
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            setLoading(false); // We have our answer, so we're no longer loading.
            const onAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');

            if (docSnap.exists()) {
                const profile = { id: docSnap.id, ...docSnap.data() } as UserProfile;
                setUserProfile(profile);

                if (profile.role) {
                    // Profile is complete. If they are on an auth page, send to dashboard.
                    if (onAuthPage) {
                        router.replace('/dashboard');
                    }
                } else {
                    // Profile is incomplete. Send to the completion page.
                    if (pathname !== '/signup/complete-profile') {
                        router.replace('/signup/complete-profile');
                    }
                }
            } else {
                // User is authenticated, but their Firestore doc is missing.
                // This happens for new users. Send to profile completion.
                 if (pathname !== '/signup/complete-profile') {
                    router.replace('/signup/complete-profile');
                }
            }
        }, (error) => {
            console.error("Error listening to user profile:", error);
            setUserProfile(null);
            setLoading(false);
            // Sign out the user if their profile is inaccessible
            firebaseSignOut(auth);
        });

        return () => unsubscribe();
    };
    
    handleAuth();

  }, [user, isUserLoading, auth, db, router, pathname]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    eraseCookie('firebaseIdToken');
    // The useEffect hook will handle the redirect to /login
  };
  
  const value = { user, auth, userProfile, loading, signOut };

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
