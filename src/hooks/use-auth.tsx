'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useFirebase, useFirestore } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader2, Sprout } from 'lucide-react';

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
    if (loading) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');

    if (!user) {
      if (!isAuthPage) {
        router.replace('/login');
      }
    } else {
      if (userProfile?.role) {
        if (isAuthPage) {
          router.replace('/dashboard');
        }
      } else {
        if (pathname !== '/signup/complete-profile') {
          router.replace('/signup/complete-profile');
        }
      }
    }
  }, [user, userProfile, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sprout className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Initializing Session...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in and on an auth page, show the page
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
  if (!user && isAuthPage) {
      return <>{children}</>;
  }

  // If user is logged in and profile is complete, show the page (if not an auth page)
  if (user && userProfile?.role && !isAuthPage) {
      return <>{children}</>;
  }

  // if user is logged in but profile is not complete, and they are on the complete profile page
  if (user && !userProfile?.role && pathname === '/signup/complete-profile') {
      return <>{children}</>;
  }

  // In all other intermediate states, show a loader to prevent flashes of incorrect content
  return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sprout className="h-12 w-12 text-primary animate-pulse" />
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
  );
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, auth, loading: authLoading } = useFirebase();
  const db = useFirestore();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setProfileLoading(true);
      return;
    }

    if (!user) {
      setUserProfile(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserProfile({ id: docSnap.id, ...docSnap.data() } as UserProfile);
      } else {
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
    if(auth) {
        await firebaseSignOut(auth);
    }
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
