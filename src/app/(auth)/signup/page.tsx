'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useAuth as useAppAuth } from '@/firebase';
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
import { Separator } from '@/components/ui/separator';

const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const signupSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
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

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const auth = useAppAuth();
  const db = useFirestore();

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      farmerId: '',
      gstNumber: '',
    },
  });

  const role = form.watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      
      const userData: Omit<UserProfile, 'id'> = {
        name: data.name,
        email: data.email,
        role: data.role,
        cropsGrown: [],
        address: '',
      };

      if (data.role === 'farmer' && data.farmerId) {
        userData.farmerId = data.farmerId;
      }
      if (data.role === 'buyer' && data.gstNumber) {
        userData.gstNumber = data.gstNumber;
      }

      await setDoc(userDocRef, userData)
        .catch((error) => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData
           }));
           // Re-throw to ensure the user sees the error and we don't redirect
           throw error;
        });

      router.push('/dashboard');
    } catch (error: any) {
      // Only show toast if it's not a permission error (which has its own overlay)
      if (!(error instanceof FirestorePermissionError)) {
          toast({
            title: 'Sign Up Failed',
            description: error.message || 'An unexpected error occurred.',
            variant: 'destructive',
          });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
      // The user will be redirected to Google's sign-in page.
      // The result is handled by the useAuth hook upon redirect back to the app.
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Failed',
        description: error.message || 'Could not initiate Google Sign-In.',
        variant: 'destructive',
      });
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create an Account</CardTitle>
        <CardDescription>
          Join Harvesta to connect with the farming community.
        </CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="grid gap-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
              {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
              Sign up with Google
          </Button>

          <div className="relative">
              <Separator className="shrink-0 bg-border" />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs uppercase text-muted-foreground">Or with email</span>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="John Doe" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
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
          <Button className="w-full" type="submit" disabled={loading || googleLoading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
