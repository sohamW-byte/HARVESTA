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
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const fieldSchema = z.object({
  region: z.string().min(2, { message: 'Region is required.' }),
  cropsGrown: z.string().min(3, { message: 'Please list at least one crop.' }),
});

type FieldFormValues = z.infer<typeof fieldSchema>;

export default function MyFieldsPage() {
  const { user, userProfile } = useAppAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const cropsArray = data.cropsGrown.split(',').map(crop => crop.trim()).filter(Boolean);

      const updateData = {
        region: data.region,
        cropsGrown: cropsArray,
      };

      await updateDoc(userDocRef, updateData)
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updateData
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
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Fields</h1>
      <p className="text-muted-foreground">Manage your farm's information and track your produce.</p>
      
      <div className="mt-8 grid gap-12">
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
                 <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
