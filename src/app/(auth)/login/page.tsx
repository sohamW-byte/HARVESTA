
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
import { Loader2, Sprout } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader>
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                    <Sprout className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>Enter your email to sign in to your account.</CardDescription>
            </div>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email')}
                />
                {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Forgot your password?
                </Link>
                </div>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
            </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
            </Button>
            <div className="text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline">
                Sign up
                </Link>
            </div>
            </CardFooter>
        </form>
        </Card>
    </div>
  );
}
