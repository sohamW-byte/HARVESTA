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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth as useAppAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2, MapPin, Sprout, List } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const fieldSchema = z.object({
  region: z.string().min(2, { message: 'Region is required.' }),
  cropsGrown: z.string().min(3, { message: 'Please list at least one crop.' }),
});

type FieldFormValues = z.infer<typeof fieldSchema>;

export default function MyFieldsPage() {
  const { user, userProfile, loading: isUserLoading } = useAppAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();

  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldSchema),
    defaultValues: {
      region: '',
      cropsGrown: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        region: userProfile.region || '',
        cropsGrown: userProfile.cropsGrown?.join(', ') || '',
      });
    }
  }, [userProfile, form]);
  
  async function onSubmit(data: FieldFormValues) {
    if (!user || !userProfile) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const cropsArray = data.cropsGrown.split(',').map(crop => crop.trim()).filter(Boolean);

      // Create a full updated profile object
      const updatedProfile = {
        ...userProfile, // Start with existing data
        region: data.region,
        cropsGrown: cropsArray,
      };

      // Use setDoc with merge to update or create fields
      await setDoc(userDocRef, updatedProfile, { merge: true })
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updatedProfile
            }));
            throw error; // Re-throw to be caught by the outer catch block
        });
      
      toast({
        title: 'Success!',
        description: 'Your farm details have been updated.',
      });

    } catch (error: any) {
      if (!(error instanceof FirestorePermissionError)) {
         toast({
            title: 'Update failed',
            description: error.message || 'Could not save your farm details.',
            variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isLoading = isUserLoading || isSubmitting;

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Fields</h1>
      <p className="text-muted-foreground">Manage your farm's information and track your produce.</p>
      
      <div className="mt-8 grid gap-12">
        <Card>
            <CardHeader>
                <CardTitle>Current Farm Information</CardTitle>
                <CardDescription>
                    This is the current information saved to your profile.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isUserLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading your details...</span>
                    </div>
                ) : userProfile ? (
                    <>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4"/>
                                Region
                            </h3>
                            <p>{userProfile.region || 'Not set'}</p>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                <List className="h-4 w-4"/>
                                Crops Grown
                            </h3>
                            {userProfile.cropsGrown && userProfile.cropsGrown.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.cropsGrown.map(crop => (
                                        <Badge key={crop} variant="secondary" className="flex items-center gap-1">
                                            <Sprout className="h-3 w-3" />
                                            {crop}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p>No crops listed yet.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <p>Could not load farm details.</p>
                )}
            </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Update Farm Details</CardTitle>
            <CardDescription>
              Enter your current farm information. This will be visible to potential buyers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
