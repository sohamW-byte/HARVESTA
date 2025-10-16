'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestCrops, type CropSuggestionOutput } from '@/ai/flows/crop-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb, Bot, ArrowUp, ArrowDown, Minus, MapPin, Sprout, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocation } from '@/hooks/use-location';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';

const suggestionSchema = z.object({
  location: z.string().min(2, "Please enter a location."),
  cropsGrown: z.string().optional(), // We'll handle this as a string from the form and convert to array
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

const trendingCrops = [
    { name: 'Rice', price: 32, trend: 'up' },
    { name: 'Wheat', price: 28, trend: 'down' },
    { name: 'Sugarcane', price: 40, trend: 'up' },
    { name: 'Maize', price: 22, trend: 'stable' },
];

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
};

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { location: browserLocation, loading: locationLoading } = useLocation();
  const { userProfile, loading: userLoading } = useAuth();
  
  const effectiveLocation = browserLocation?.address || userProfile?.region || '';

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      location: "",
      cropsGrown: "",
    },
  });

  useEffect(() => {
    if (effectiveLocation) {
      form.setValue('location', effectiveLocation);
    }
    if (userProfile?.cropsGrown) {
      form.setValue('cropsGrown', userProfile.cropsGrown.join(', '));
    }
  }, [effectiveLocation, userProfile, form]);

  const onSubmit = async (data: SuggestionFormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const cropsArray = data.cropsGrown?.split(',').map(c => c.trim()).filter(Boolean) || [];
      const recommendation = await suggestCrops({
          location: data.location,
          cropsGrown: cropsArray
      });
      setResult(recommendation);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  const isLoadingPage = locationLoading || userLoading;

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="text-accent" /> AI Suggestions
        </h1>
        <p className="text-muted-foreground">
          Get personalized crop ideas using your farm data and local market trends.
        </p>
      </div>

      <Card className="rounded-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 pt-6">
                
                {isLoadingPage && <Loader2 className="animate-spin" />}

                {!isLoadingPage && (
                    <>
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Location</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Enter location or allow access..." {...field} className="pl-9" />
                                </div>
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
                            <FormLabel>Your Current Crops</FormLabel>
                             <FormControl>
                                <div className="relative">
                                    <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="e.g., Grapes, Onions, Tomatoes" {...field} className="pl-9" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </>
                )}

                 <div className="pt-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Trending Crop Prices (₹/kg)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trendingCrops.map(crop => (
                            <div key={crop.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="font-medium">{crop.name}</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">₹{crop.price}</span>
                                    <TrendIcon trend={crop.trend as any} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                     <Button type="submit" disabled={loading || isLoadingPage} className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Smart Suggestions
                    </Button>
                </div>

                {loading && (
                    <div className="flex flex-col items-center justify-center h-24 gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Analyzing your farm data...</p>
                    </div>
                )}

                {error && <p className="text-destructive">{error}</p>}
                
                {result && (
                    <Alert className="bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-200">
                        <Bot className="h-4 w-4 !text-green-500" />
                        <AlertTitle className="font-semibold">Your Personalized Suggestions</AlertTitle>
                        <AlertDescription>
                           <ul className="list-disc pl-5 space-y-1 mt-2">
                             {result.suggestions.map((suggestion, index) => (
                                <li key={index}>{suggestion}</li>
                             ))}
                           </ul>
                        </AlertDescription>
                    </Alert>
                )}

              </CardContent>
            </form>
          </Form>
        </Card>

    </div>
  );
}
