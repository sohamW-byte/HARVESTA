'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
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
      
      const userData: Partial<UserProfile> = {
        name: data.name,
        email: data.email,
        role: data.role,
      };

      if (data.farmerId) userData.farmerId = data.farmerId;
      if (data.gstNumber) userData.gstNumber = data.gstNumber;


      // Non-blocking write with error handling
      setDoc(userDocRef, userData)
        .catch((error) => {
           errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'create',
                requestResourceData: userData
           }));
           // The global listener will throw the error, so we don't need to toast here.
        });

      // The useAuth hook will handle redirection to the dashboard
    } catch (error: any) {
      toast({
        title: 'Sign Up Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
          <Button className="w-full" type="submit" disabled={loading}>
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
