'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth as useAppAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  role: z.enum(['farmer', 'buyer', 'admin']),
  farmerId: z.string().optional(),
  gstNumber: z.string().optional(),
  region: z.string().optional(),
  cropsGrown: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, userProfile, loading: userLoading } = useAppAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'farmer',
      farmerId: '',
      gstNumber: '',
      region: '',
      cropsGrown: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
        role: userProfile.role || 'farmer',
        farmerId: userProfile.farmerId || '',
        gstNumber: userProfile.gstNumber || '',
        region: userProfile.region || '',
        cropsGrown: userProfile.cropsGrown?.join(', ') || '',
      });
    }
  }, [userProfile, form]);
  
  const watchedRole = form.watch('role');

  async function onSubmit(data: ProfileFormValues) {
    if (!user || !userProfile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);

      // Create a full updated profile object, preserving existing data
      const updatedProfile = {
        ...userProfile,
        name: data.name,
        farmerId: data.farmerId,
        gstNumber: data.gstNumber,
        region: data.region,
        cropsGrown: data.cropsGrown ? data.cropsGrown.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      
      // Use setDoc with merge: true to safely update the document
      await setDoc(userDocRef, updatedProfile, { merge: true })
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updatedProfile
            }));
            throw error;
        });
      
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });

    } catch (error: any) {
      if (!(error instanceof FirestorePermissionError)) {
         toast({
            title: 'Update failed',
            description: error.message || 'Could not save your profile details.',
            variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = userLoading || isSubmitting;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      <p className="text-muted-foreground">View and manage your account details.</p>
      
      <div className="mt-8 grid gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Update your personal and role-specific details here. Your role and email cannot be changed.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {userLoading ? (
                <div className="space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Loading profile...</p>
                </div>
            ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} disabled />
                      </FormControl>
                       <FormDescription>
                        Your email address cannot be changed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input value={form.getValues('role')} disabled />
                  </FormControl>
                  <FormDescription>
                    Your role is fixed upon registration.
                  </FormDescription>
                </FormItem>

                {watchedRole === 'farmer' && (
                  <FormField
                    control={form.control}
                    name="farmerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farmer ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your government-issued Farmer ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {watchedRole === 'buyer' && (
                  <FormField
                    control={form.control}
                    name="gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <FormControl>
                           <Input placeholder="Enter your GST Number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Nashik, Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropsGrown"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Crops Grown (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Grapes, Onions, Tomatoes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                 <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
              </form>
            </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
