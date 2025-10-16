'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { suggestCrops, type CropSuggestionOutput } from '@/ai/flows/crop-suggestion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb, Bot, MapPin, Sprout, Cloud, Thermometer, CalendarClock, Zap, BookCheck, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocation } from '@/hooks/use-location';
import { useAuth } from '@/hooks/use-auth';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VoiceInput } from '@/components/ui/voice-input';

interface WeatherData {
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

const suggestionSchema = z.object({
  location: z.string().min(2, "Please enter a location."),
  cropsGrown: z.string().optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CropSuggestionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { location: browserLocation, loading: locationLoading } = useLocation();
  const { userProfile, loading: userLoading } = useAuth();
  
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

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

  useEffect(() => {
    async function fetchWeather() {
      if (browserLocation) {
        setIsWeatherLoading(true);
        try {
          const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
          if (!apiKey) {
            throw new Error("Weather API key is not configured.");
          }
          const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${browserLocation.latitude},${browserLocation.longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
          }
          const data = await response.json();
          setWeather(data.current);
        } catch (error) {
          console.error("Weather fetch error on recommendations page:", error);
        } finally {
          setIsWeatherLoading(false);
        }
      } else {
        setIsWeatherLoading(false);
      }
    }

    if (!locationLoading) {
      fetchWeather();
    }
  }, [browserLocation, locationLoading]);

  const onSubmit = async (data: SuggestionFormValues) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const cropsArray = data.cropsGrown?.split(',').map(c => c.trim()).filter(Boolean) || [];
      const weatherString = weather ? `Current conditions are ${weather.temp_c}°C and ${weather.condition.text}.` : 'Weather data not available.';
      const recommendation = await suggestCrops({
          location: data.location,
          cropsGrown: cropsArray,
          weather: weatherString,
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
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Lightbulb className="text-accent" /> AI Suggestions
        </h1>
        <p className="text-muted-foreground">
          Get personalized crop ideas using your farm data, location, and local weather.
        </p>
      </div>

      <Card className="rounded-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6 pt-6">
                
                {isLoadingPage && <div className="flex justify-center"><Loader2 className="animate-spin" /></div>}

                {!isLoadingPage && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Your Location</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <VoiceInput placeholder="Enter location or allow access..." {...field} onValueChange={field.onChange} className="pl-9" />
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
                                    <VoiceInput placeholder="e.g., Grapes, Onions, Tomatoes" {...field} onValueChange={field.onChange} className="pl-9" />
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                )}
                
                <div className="pt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Live Weather Input</h3>
                    {isWeatherLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Fetching local weather...</span>
                        </div>
                    ) : weather ? (
                        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={weather.condition.icon} alt={weather.condition.text} className="h-10 w-10" />
                            <div className="flex-1">
                                <p className="font-semibold text-lg">{weather.condition.text}</p>
                                <p className="text-sm text-muted-foreground">{browserLocation?.address?.split(',').slice(0, 2).join(', ')}</p>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-semibold">
                                <Thermometer className="h-5 w-5 text-red-500"/>
                                {weather.temp_c}°C
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Cloud className="h-4 w-4" />
                            <span>Weather data could not be loaded. Suggestions will be based on location only.</span>
                        </div>
                    )}
                </div>

                <div className="pt-4">
                     <Button type="submit" disabled={loading || isLoadingPage} className="w-full md:w-auto">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Get Smart Suggestions
                    </Button>
                </div>
              </CardContent>
            </form>
          </Form>
      </Card>

      {loading && (
          <div className="mt-8 flex flex-col items-center justify-center h-48 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-lg">Our AI is analyzing your farm data...</p>
              <p className="text-sm text-muted-foreground">This may take a moment.</p>
          </div>
      )}

      {error && <p className="mt-8 text-destructive">{error}</p>}
      
      {result && (
          <div className="mt-8 space-y-6 animate-in fade-in-50">
              <Alert className="bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-500/30 dark:text-green-200">
                  <Bot className="h-4 w-4 !text-green-500" />
                  <AlertTitle className="font-semibold">AI Analysis Summary</AlertTitle>
                  <AlertDescription>
                     {result.summary}
                  </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><Zap className="text-accent h-5 w-5"/> Short-Term Advice</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                            {result.shortTerm.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg"><CalendarClock className="text-blue-500 h-5 w-5"/> Long-Term Outlook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                             {result.longTerm.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="text-primary h-5 w-5"/> Upcoming Monthly Crop Trends</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {result.monthlyTrends.map((trend, i) => (
                        <div key={i}>
                            <div className="flex items-center gap-4">
                                <Badge className="text-sm py-1 px-3">{trend.month}</Badge>
                                <p className="font-semibold">{trend.crop}</p>
                            </div>
                            <p className="pl-4 mt-1 text-sm text-muted-foreground border-l-2 ml-4 border-primary/50">{trend.reason}</p>
                        </div>
                    ))}
                </CardContent>
              </Card>

          </div>
      )}

    </div>
  );
}
