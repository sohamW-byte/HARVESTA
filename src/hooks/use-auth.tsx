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
              await setDoc(userDocRef, userData, { merge: true });
              // Redirect to complete profile after creating the doc
              router.push('/signup/complete-profile');
            } catch (error) {
              errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData
              }));
              console.error("Failed to create user document:", error);
            }
          }
          // For existing users, the onAuthStateChanged listener below will handle everything.
        }
      })
      .catch((error) => {
        console.error("Google sign-in redirect error:", error);
      });
  }, [auth, db, router]);


  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const handleAuthChange = async (user: User | null) => {
      setLoading(true);
      if (user) {
        try {
          const token = await user.getIdToken();
          setCookie('firebaseIdToken', token, 1);
          
          const userDocRef = doc(db, 'users', user.uid);
          
          unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as Omit<UserProfile, 'id'>;
               setUserProfile({ id: docSnap.id, ...data });
               // If the user exists but hasn't completed their role selection, keep them on the complete-profile page.
               if (!data.role && window.location.pathname !== '/signup/complete-profile') {
                    router.push('/signup/complete-profile');
               } else if (data.role && window.location.pathname.startsWith('/(auth)')) {
                    router.push('/dashboard');
               }
            } else {
              // This can happen briefly for new Google sign-in users before their doc is created.
              // We redirect them to complete their profile.
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

        } catch (error) {
          console.error("Error handling auth change:", error);
          setUserProfile(null);
          eraseCookie('firebaseIdToken');
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        eraseCookie('firebaseIdToken');
        setLoading(false);
        if (unsubscribe) unsubscribe();
      }
    };
    
    // Only run this if the initial user check is done
    if (!isUserLoading) {
      handleAuthChange(user);
    }

    return () => unsubscribe();

  }, [user, isUserLoading, db, router]);

  const signOut = async () => {
    await firebaseSignOut(auth);
    eraseCookie('firebaseIdToken');
    router.push('/login');
  };
  
  const value = { user, userProfile, loading: isUserLoading || loading, signOut };

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
