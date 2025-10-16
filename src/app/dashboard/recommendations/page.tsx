'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recommendCrops, type CropRecommendationOutput } from '@/ai/flows/crop-recommendation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Lightbulb, Bot, Check, Leaf } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const recommendationSchema = z.object({
  soilData: z.string().min(10, "Please provide detailed soil data."),
  weatherConditions: z.string().min(10, "Please provide detailed weather conditions."),
  region: z.string().min(2, "Please provide the region."),
});

type RecommendationFormValues = z.infer<typeof recommendationSchema>;

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RecommendationFormValues>({
    resolver: zodResolver(recommendationSchema),
    defaultValues: {
      soilData: "pH: 6.5, Nitrogen: 50 ppm, Phosphorus: 20 ppm, Potassium: 100 ppm",
      weatherConditions: "Temperature: 25°C, Rainfall: 500mm annually, Humidity: 60%",
      region: "Central Plains",
    },
  });

  const onSubmit = async (data: RecommendationFormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const recommendation = await recommendCrops(data);
      setResult(recommendation);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="text-accent" /> AI Recommendations
        </h1>
        <p className="text-muted-foreground">
          Leverage AI to find the best crops for your specific field conditions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Field Data</CardTitle>
            <CardDescription>Enter the details about your field below.</CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="soilData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soil Data</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., pH: 6.5, Nitrogen: high, ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weatherConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weather Conditions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Avg. Temp: 25°C, Rainfall: 500mm, ..." {...field} />
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
                      <FormLabel>Geographical Region</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Central Valley, California" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Recommendations
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        <Card className="rounded-2xl bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> AI Recommendations</CardTitle>
            <CardDescription>Our AI agronomist will provide suggestions here.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Analyzing your data...</p>
              </div>
            )}
            {error && <p className="text-destructive">{error}</p>}
            {result && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Recommended Crops</h3>
                  <ul className="space-y-2">
                    {result.recommendedCrops.map((crop, index) => (
                      <li key={index} className="flex items-center gap-2 text-foreground">
                        <Leaf className="h-5 w-5 text-green-500" />
                        <span className="font-medium">{crop}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Reasoning</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.reasoning}</p>
                </div>
              </div>
            )}
            {!loading && !result && !error && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                 <p className="text-muted-foreground">Your crop recommendations will appear here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
