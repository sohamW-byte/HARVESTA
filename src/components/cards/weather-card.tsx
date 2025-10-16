'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocation } from '@/hooks/use-location';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Wind, CloudRain, MapPin, Thermometer } from 'lucide-react';

interface WeatherData {
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  wind_kph: number;
  precip_mm: number;
}

export function WeatherCard() {
  const { location, error: locationError, loading: locationLoading } = useLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      if (location) {
        setIsWeatherLoading(true);
        setWeatherError(null);
        try {
          const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
          if (!apiKey) {
            throw new Error("Weather API key is not configured.");
          }
          const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location.latitude},${location.longitude}`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
          }
          const data = await response.json();
          setWeather(data.current);
        } catch (error) {
          console.error("Weather fetch error:", error);
          setWeatherError('Could not fetch weather.');
        } finally {
          setIsWeatherLoading(false);
        }
      } else {
        if (locationError) {
          setWeatherError('Location access denied.');
        }
        setIsWeatherLoading(false);
      }
    }

    if (!locationLoading) {
      fetchWeather();
    }
  }, [location, locationError, locationLoading]);

  const isLoading = locationLoading || isWeatherLoading;
  const locationName = location?.address?.split(',').slice(0, 2).join(', ') || 'Your Location';

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{isLoading ? <Skeleton className="h-4 w-32" /> : locationName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3 pt-2">
            <Skeleton className="h-8 w-24" />
            <div className="flex gap-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ) : weather ? (
          <div>
            <div className="flex items-center gap-2">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={weather.condition.icon} alt={weather.condition.text} className="h-10 w-10 -ml-2" />
              <div className="text-3xl font-bold">{weather.temp_c}°C</div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{weather.condition.text}</p>
            <div className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-muted-foreground" />
                <span>{weather.wind_kph} km/h</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="h-4 w-4 text-muted-foreground" />
                <span>{weather.precip_mm} mm</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground pt-4 text-center">
            {weatherError || "Weather data not available."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
