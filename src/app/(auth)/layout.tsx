'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useState, useEffect } from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const authBg = PlaceHolderImages.find(img => img.id === 'auth-background');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      {authBg && (
        <Image
          src={authBg.imageUrl}
          alt={authBg.description}
          fill
          className="object-cover"
          data-ai-hint={authBg.imageHint}
          priority
        />
      )}
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
