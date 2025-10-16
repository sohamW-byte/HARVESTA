'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { ProduceListing } from '@/lib/types';

const produceSchema = z.object({
  cropName: z.string().min(2, { message: 'Crop name is required.' }),
  quantity: z.coerce.number().min(1, { message: 'Quantity must be at least 1.' }),
  price: z.coerce.number().min(1, { message: 'Price must be at least 1.' }),
  contactInfo: z.string().min(10, { message: 'A valid contact number is required.' }),
});

type ProduceFormValues = z.infer<typeof produceSchema>;

export function AddProduceDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const form = useForm<ProduceFormValues>({
    resolver: zodResolver(produceSchema),
    defaultValues: {
      cropName: '',
      quantity: 0,
      price: 0,
      contactInfo: '',
    },
  });

  async function onSubmit(data: ProduceFormValues) {
    if (!user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to add produce.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const collectionRef = collection(db, 'users', user.uid, 'produceListings');
      
      const newListing: Omit<ProduceListing, 'id'> = {
        ...data,
        userId: user.uid,
      };

      await addDoc(collectionRef, newListing)
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: newListing
            }));
            throw error; // Re-throw to be caught by the outer catch block
        });

      toast({
        title: 'Success!',
        description: `${data.cropName} has been listed on the marketplace.`,
      });
      
      form.reset();
      setOpen(false); // Close the dialog on success
      
    } catch (error: any) {
      if (!(error instanceof FirestorePermissionError)) {
         toast({
            title: 'Submission failed',
            description: error.message || 'Could not list your produce.',
            variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Produce
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List Your Produce</DialogTitle>
          <DialogDescription>
            Fill in the details below to add your produce to the marketplace.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="cropName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Crop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sona Masoori Rice" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity (in units, e.g., kg, quintal)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per Unit (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 2800" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Your phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                List Produce
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
