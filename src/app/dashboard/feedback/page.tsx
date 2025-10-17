'use client';

import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LifeBuoy, Mail, Phone, Send } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const feedbackSchema = z.object({
  name: z.string().min(2, { message: 'Name is required.' }),
  email: z.string().email({ message: 'A valid email is required.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters long.' }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
        message: '',
      });
    }
  }, [userProfile, form]);

  async function onSubmit(data: FeedbackFormValues) {
    setIsSubmitting(true);
    
    const collectionRef = collection(db, 'feedbacks');
    
    const newFeedback = {
      ...data,
      userId: user?.uid || null,
      createdAt: serverTimestamp(),
    };

    addDoc(collectionRef, newFeedback)
      .then(() => {
        toast({
          title: 'Thank you!',
          description: 'Your feedback has been submitted successfully.',
        });
        form.reset({ ...form.getValues(), message: '' }); // Clear message field only
      })
      .catch((error) => {
          // Emit the detailed, contextual error for the global listener.
          errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: collectionRef.path,
              operation: 'create',
              requestResourceData: newFeedback
          }));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <LifeBuoy className="text-accent"/>
            Feedback & Help
        </h1>
        <p className="text-muted-foreground">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit Feedback</CardTitle>
              <CardDescription>
                Use this form to send us your thoughts, bug reports, or feature requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                   <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Your Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
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
                                <FormLabel>Your Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                   </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us what's on your mind..." {...field} rows={6} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                    <CardDescription>For urgent issues, reach us directly.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <a href="mailto:support@harvesta.app" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-primary">support@harvesta.app</p>
                        </div>
                    </a>
                     <a href="tel:+919876543210" className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-primary">+91 98765 43210</p>
                        </div>
                    </a>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
