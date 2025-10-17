'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';

const profileCompletionSchema = z
  .object({
    role: z.enum(['farmer', 'buyer'], { required_error: 'Please select a role' }),
    farmerId: z.string().optional(),
    gstNumber: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === 'farmer') {
        return !!data.farmerId && data.farmerId.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Farmer ID is required for farmers',
      path: ['farmerId'],
    }
  )
  .refine(
    (data) => {
      if (data.role === 'buyer') {
        return !!data.gstNumber && data.gstNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: 'GST Number is required for buyers',
      path: ['gstNumber'],
    }
  );

type ProfileCompletionFormValues = z.infer<typeof profileCompletionSchema>;

export default function CompleteProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();

  const form = useForm<ProfileCompletionFormValues>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      farmerId: '',
      gstNumber: '',
    },
  });

  const role = form.watch('role');
  
  useEffect(() => {
    // This page is for users who have a user object but not a role.
    if (!authLoading) {
      if (!user) {
        // Not logged in, go to login.
        router.replace('/login');
      } else if (userProfile?.role) {
        // Profile is already complete, go to dashboard.
        router.replace('/dashboard');
      }
    }
  }, [user, userProfile, authLoading, router]);

  const onSubmit = async (data: ProfileCompletionFormValues) => {
    if (!user) {
        toast({ title: 'Not Authenticated', description: 'You must be logged in.', variant: 'destructive' });
        return;
    }
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      
      const userData: Partial<UserProfile> = {
        role: data.role,
      };

      if (data.role === 'farmer' && data.farmerId) {
        userData.farmerId = data.farmerId;
      }
      if (data.role === 'buyer' && data.gstNumber) {
        userData.gstNumber = data.gstNumber;
      }

      await setDoc(userDocRef, userData, { merge: true })
        .catch((error) => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: userData
           }));
           throw error;
        });

      // The useAuth hook will handle the redirect to dashboard
    } catch (error: any) {
      if (!(error instanceof FirestorePermissionError)) {
          toast({
            title: 'Update Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authLoading || !user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Just one more step! Please tell us who you are.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="grid gap-2">
            <Label>I am a...</Label>
            <Select onValueChange={(value) => form.setValue('role', value as 'farmer' | 'buyer')} defaultValue={form.getValues('role')}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="farmer">Farmer / Seller</SelectItem>
                <SelectItem value="buyer">Buyer / Businessman</SelectItem>
              </SelectContent>
            </Select>
             {form.formState.errors.role && (
              <p className="text-sm text-destructive">
                {form.formState.errors.role.message}
              </p>
            )}
          </div>

          {role === 'farmer' && (
            <div className="grid gap-2">
              <Label htmlFor="farmerId">Farmer ID</Label>
              <Input
                id="farmerId"
                placeholder="Enter your government-issued Farmer ID"
                {...form.register('farmerId')}
              />
              {form.formState.errors.farmerId && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.farmerId.message}
                </p>
              )}
            </div>
          )}

          {role === 'buyer' && (
            <div className="grid gap-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input
                id="gstNumber"
                placeholder="Enter your GST Number"
                {...form.register('gstNumber')}
              />
              {form.formState.errors.gstNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.gstNumber.message}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Signup
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
