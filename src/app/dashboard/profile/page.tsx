'use client';

import { useForm, Controller } from 'react-hook-form';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth as useAppAuth } from '@/hooks/use-auth';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Label } from '@/components/ui/label';


const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
  role: z.enum(['farmer', 'buyer', 'admin']),
  farmerId: z.string().optional(),
  gstNumber: z.string().optional(),
}).refine(data => !(data.role === 'farmer' && !data.farmerId), {
  message: 'Farmer ID is required for farmers',
  path: ['farmerId'],
}).refine(data => !(data.role === 'buyer' && !data.gstNumber), {
  message: 'GST Number is required for buyers',
  path: ['gstNumber'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { userProfile, loading: userLoading } = useAppAuth();
  const auth = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const db = useFirestore();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'farmer',
      farmerId: '',
      gstNumber: '',
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
      });
    }
  }, [userProfile, form]);
  
  const watchedRole = form.watch('role');

  async function onSubmit(data: ProfileFormValues) {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      const updateData: Partial<ProfileFormValues> = {
        name: data.name,
      };

      if (data.role === 'farmer') {
        updateData.farmerId = data.farmerId;
        updateData.gstNumber = ''; // Clear other role's ID
      } else if (data.role === 'buyer') {
        updateData.gstNumber = data.gstNumber;
        updateData.farmerId = ''; // Clear other role's ID
      }
      
      // Only include role if it has changed, to avoid permission issues
      if (data.role !== userProfile?.role) {
        updateData.role = data.role;
      }

      await updateDoc(userDocRef, updateData)
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updateData
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
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      <p className="text-muted-foreground">View and manage your account details.</p>
      
      <div className="mt-8 grid gap-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>
              Update your personal and role-specific details here.
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="farmer">Farmer / Seller</SelectItem>
                          <SelectItem value="buyer">Buyer / Businessman</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                
                 <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
