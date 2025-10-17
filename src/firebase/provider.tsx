'use client';

import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged, getAdditionalUserInfo, UserCredential } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import type { UserProfile } from '@/lib/types';
import { errorEmitter } from './error-emitter';
import { FirestorePermissionError } from './errors';

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
    
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        if (firebaseUser) {
          // User is signed in. Check if they have a profile document.
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const docSnap = await getDoc(userDocRef);

          if (!docSnap.exists()) {
            // This is likely a new user from a social provider sign-in.
            // Create a shell profile for them.
            const profileData: Partial<UserProfile> = {
              name: firebaseUser.displayName || 'New User',
              email: firebaseUser.email!,
              photoURL: firebaseUser.photoURL || undefined,
            };
            setDoc(userDocRef, profileData, { merge: true }).catch((e) => {
                console.error("Failed to create user profile document:", e);
                // Don't set component error state, just emit for global handler
                errorEmitter.emit('permission-error', new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'create',
                    requestResourceData: profileData
                }));
            });
          }
        }
        setUser(firebaseUser);
        setLoading(false);
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

export function useMemoFirebase<T>(factory: () => T, deps: React.DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}
