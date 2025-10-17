
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useFirebase, useFirestore, useAuth as useFirebaseAuth } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Sprout } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userProfile, loading } = useContext(AuthContext)!;
  
  useEffect(() => {
    // Wait until loading is complete before doing anything
    if (loading) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');

    if (!user) {
      // If user is not logged in, they must be on an auth page.
      // If not, redirect them to login.
      if (!isAuthPage) {
        router.replace('/login');
      }
    } else {
      // User is logged in. Now check their profile.
      if (userProfile?.role) {
        // Profile is complete. If they are on an auth page, send to dashboard.
        if (isAuthPage) {
          router.replace('/dashboard');
        }
      } else {
        // Profile is incomplete. They must be sent to complete it.
        if (pathname !== '/signup/complete-profile') {
          router.replace('/signup/complete-profile');
        }
      }
    }
  }, [user, userProfile, loading, pathname, router]);

  // While loading, show nothing.
  if (loading) {
    return null;
  }

  // Determine if we should render children or nothing based on redirection logic.
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
  
  // Scenarios where we render the page content:
  if (!user && isAuthPage) {
      return <>{children}</>;
  }
  if (user && userProfile?.role && !isAuthPage) {
      return <>{children}</>;
  }
  if (user && !userProfile?.role && pathname === '/signup/complete-profile') {
      return <>{children}</>;
  }

  // In all other intermediate states (e.g., about to redirect), show nothing.
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useFirebase();
  const firebaseAuth = useFirebaseAuth();
  const db = useFirestore();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    // If the main auth state is still loading, we are also loading.
    if (authLoading) {
      setProfileLoading(true);
      return;
    }

    // If there is no user, there is no profile to fetch.
    if (!user) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    // There is a user, so let's fetch their profile.
    setProfileLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      } else {
        // This case can happen briefly for new social sign-ins before the profile is created.
        setUserProfile(null);
      }
      setProfileLoading(false);
    }, (error) => {
      console.error("Error listening to user profile:", error);
      setUserProfile(null);
      setProfileLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, db]);

  const signOut = async () => {
    await firebaseSignOut(firebaseAuth);
  };
  
  const value: AuthContextType = { user, userProfile, loading: authLoading || profileLoading, signOut };
  
  return (
    <AuthContext.Provider value={value}>
      <AuthGate>{children}</AuthGate>
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
