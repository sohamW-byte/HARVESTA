
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
import { Label } from '@/components/ui/label';
import { useAuth as useAppAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore, useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { Loader2, User as UserIcon, Camera, Gift, Copy, Check, KeyRound, MapPin } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserProfile } from '@/lib/types';
import { useLocation } from '@/hooks/use-location';
import { sendPasswordResetEmail } from 'firebase/auth';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  farmerId: z.string().optional(),
  gstNumber: z.string().optional(),
  region: z.string().optional(),
  address: z.string().optional(),
  cropsGrown: z.string().optional(),
  photoURL: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, userProfile, loading: userLoading } = useAppAuth();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = useFirestore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { location, loading: locationLoading } = useLocation();
  
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      farmerId: '',
      gstNumber: '',
      region: '',
      address: '',
      cropsGrown: '',
      photoURL: '',
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        farmerId: userProfile.farmerId || '',
        gstNumber: userProfile.gstNumber || '',
        region: userProfile.region || '',
        address: userProfile.address || '',
        cropsGrown: userProfile.cropsGrown?.join(', ') || '',
        photoURL: userProfile.photoURL || '',
      });
      setPreviewImage(userProfile.photoURL || null);
    }
     if (user?.uid) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      setReferralLink(`${origin}/signup?ref=${user.uid}`);
    }
  }, [userProfile, user, form]);
  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreviewImage(dataUrl);
        form.setValue('photoURL', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        toast({
            title: "Copied to clipboard!",
            description: "You can now share your referral link.",
        });
    });
  };

  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        title: 'Error',
        description: 'No email address found for this user.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: `A link to reset your password has been sent to ${user.email}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error Sending Email',
        description: error.message || 'Could not send password reset email.',
        variant: 'destructive',
      });
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    if (!user) {
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

      const updatedData: Partial<UserProfile> = {
        name: data.name,
        region: data.region,
        address: data.address,
        photoURL: data.photoURL,
        cropsGrown: data.cropsGrown ? data.cropsGrown.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      
      // Only include role-specific fields if they are relevant
      if (userProfile?.role === 'farmer') {
        updatedData.farmerId = data.farmerId;
      }
      if (userProfile?.role === 'buyer') {
        updatedData.gstNumber = data.gstNumber;
      }

      await setDoc(userDocRef, updatedData, { merge: true })
        .catch((error) => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: userDocRef.path,
                operation: 'update',
                requestResourceData: updatedData
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
      
      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
            <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                Update your personal and role-specific details here. Your role and email cannot be changed.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {userLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="ml-4">Loading profile...</p>
                    </div>
                ) : (
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <Avatar className="h-24 w-24">
                        <AvatarImage src={previewImage || undefined} alt={userProfile?.name} />
                        <AvatarFallback className="text-4xl">{userInitial}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        Change Photo
                    </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
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
                        
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <p className="text-sm text-muted-foreground pt-2">
                                Your email address cannot be changed.
                            </p>
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input placeholder="Your full address" {...field} />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                                    onClick={() => location?.address && form.setValue('address', location.address)}
                                    disabled={locationLoading || !location}
                                    title="Use current location"
                                  >
                                    <MapPin className="h-4 w-4" />
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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

                        <div className="space-y-2">
                            <Label>Role</Label>
                            <div className="flex h-10 w-full items-center rounded-md border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground">
                                {userProfile?.role === 'farmer' ? 'Farmer / Seller' : userProfile?.role === 'buyer' ? 'Buyer / Businessman' : 'Not set'}
                            </div>
                        </div>

                        {userProfile?.role === 'farmer' && (
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
                        
                        {userProfile?.role === 'buyer' && (
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

                    </div>
                    
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
        
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary"/>
                        <CardTitle>Refer a Friend</CardTitle>
                    </div>
                    <CardDescription>
                        Share your unique link and earn credits when your friends sign up!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2">
                        <Input value={referralLink} readOnly />
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                           {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary"/>
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your account security settings.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="outline" onClick={handlePasswordReset}>
                        Change Password
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
