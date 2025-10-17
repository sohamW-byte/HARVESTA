'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getRedirectResult, getAdditionalUserInfo } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import type { UserProfile } from '@/lib/types';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export interface FirebaseContextState {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError(new Error("Auth service not provided."));
      return;
    }

    // This flag helps manage the redirect processing
    let processingRedirect = true;

    // First, process the potential redirect from Google Sign-In
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          const user = result.user;
          const additionalInfo = getAdditionalUserInfo(result);
          if (additionalInfo?.isNewUser) {
            // Create a user profile document if it's a new user
            const userDocRef = doc(firestore, 'users', user.uid);
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
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
        setError(error);
      })
      .finally(() => {
        // Once redirect is processed, we can rely on onAuthStateChanged
        processingRedirect = false;
        // The onAuthStateChanged listener below will handle setting the user
        // and final loading state.
      });

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!processingRedirect) {
          setUser(firebaseUser);
          setLoading(false);
          setError(null);
        }
      },
      (error) => {
        console.error("onAuthStateChanged error:", error);
        setUser(null);
        setError(error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth, firestore]);

  const contextValue = useMemo((): FirebaseContextState => ({
    firebaseApp,
    firestore,
    auth,
    user,
    loading,
    error,
  }), [firebaseApp, firestore, auth, user, loading, error]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }
  return context;
};


export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  if (!auth) throw new Error('Auth service not available.');
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  if (!firestore) throw new Error('Firestore service not available.');
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  if (!firebaseApp) throw new Error('Firebase App not available.');
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
