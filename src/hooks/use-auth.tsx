'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signOut as firebaseSignOut, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect handles the result from a redirect sign-in operation.
    // It should run once on mount to check for a redirect result.
    setLoading(true);
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;
          const additionalInfo = getAdditionalUserInfo(result);
          
          if (additionalInfo?.isNewUser) {
            // New user via Google redirect. Create their profile shell.
            const userDocRef = doc(db, 'users', user.uid);
            const userData: Omit<UserProfile, 'id' | 'role'> = {
              name: user.displayName || 'New User',
              email: user.email!,
              photoURL: user.photoURL || undefined,
              cropsGrown: [],
              address: '',
            };
            
            try {
              // We create the user doc here. The next effect will handle routing.
              await setDoc(userDocRef, userData, { merge: true });
            } catch (error) {
              errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData
              }));
              console.error("Failed to create user document for new Google user:", error);
            }
          }
          // For existing users, the onAuthStateChanged listener below will handle everything.
        }
        // Whether there was a redirect result or not, we can proceed.
        // The main user listener will take over.
        // We set loading false here temporarily, the next hook will manage it.
        setLoading(false);
      })
      .catch((error) => {
        console.error("Google sign-in redirect error:", error);
        setLoading(false);
      });
  }, [auth, db]);


  useEffect(() => {
    if (isUserLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setUserProfile(null);
      eraseCookie('firebaseIdToken');
      setLoading(false);
      // Optional: Redirect to login if not on a public page
      // if (!['/login', '/signup'].includes(window.location.pathname)) {
      //   router.push('/login');
      // }
      return;
    }

    // User is logged in, set up profile listener
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<UserProfile, 'id'>;
        setUserProfile({ id: docSnap.id, ...data });

        // Routing logic
        const onAuthPage = window.location.pathname.startsWith('/login') || window.location.pathname.startsWith('/signup');
        if (data.role) {
            // Profile is complete, if on auth page, redirect to dashboard
            if (onAuthPage) {
                router.push('/dashboard');
            }
        } else {
            // Profile is not complete, redirect to complete-profile
            if (window.location.pathname !== '/signup/complete-profile') {
                router.push('/signup/complete-profile');
            }
        }
      } else {
        // Doc doesn't exist. This can happen for a moment for new users.
        // Redirect them to complete their profile.
        if (window.location.pathname !== '/signup/complete-profile') {
            router.push('/signup/complete-profile');
        }
      }
      setLoading(false);
    }, (error) => {
      console.error("Error listening to user profile:", error);
      setUserProfile(null);
      setLoading(false);
    });

    // Set token
    user.getIdToken().then(token => setCookie('firebaseIdToken', token, 1));

    return () => unsubscribe();
  }, [user, isUserLoading, db, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    eraseCookie('firebaseIdToken');
    router.push('/login');
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
