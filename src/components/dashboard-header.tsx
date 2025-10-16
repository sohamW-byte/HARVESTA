'use client';

import {
  CloudSun,
  Search,
  User,
  LogOut,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LanguageSwitcher } from './language-switcher';
import { useLocation } from '@/hooks/use-location';

interface WeatherData {
    temperature: number;
    condition: string;
}

// Map weather codes to readable conditions and icons
// Codes from Open-Meteo documentation
const weatherCodeToString: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    95: 'Thunderstorm',
};


export function DashboardHeader() {
  const { userProfile, signOut } = useAuth();
  const { location, error: locationError, loading: locationLoading } = useLocation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';

  useEffect(() => {
    async function fetchWeather() {
      if (location) {
        setIsWeatherLoading(true);
        setWeatherError(null);
        try {
          const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current_weather=true`);
          if (!response.ok) {
            throw new Error('Failed to fetch weather data.');
          }
          const data = await response.json();
          const weatherCode = data.current_weather.weathercode;
          setWeather({
            temperature: Math.round(data.current_weather.temperature),
            condition: weatherCodeToString[weatherCode] || 'Unknown',
          });
        } catch (error) {
          console.error("Weather fetch error:", error);
          setWeatherError('Could not fetch weather.');
        } finally {
          setIsWeatherLoading(false);
        }
      } else if (locationError) {
        setWeatherError('Location access denied.');
        setIsWeatherLoading(false);
      }
    }

    fetchWeather();
  }, [location, locationError]);


  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
        <div className="md:hidden">
            <SidebarTrigger />
        </div>
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, farmers, buyers..."
            className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <div className="flex items-center gap-2 text-sm font-medium">
          <CloudSun className="h-5 w-5 text-accent" />
           {isWeatherLoading || locationLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
           ) : weather ? (
            <span>{weather.temperature}°C, {weather.condition}</span>
          ) : weatherError ? (
            <span className="text-muted-foreground text-xs">{weatherError}</span>
          ) : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : ''} alt={userProfile?.name} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userProfile?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userProfile?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/dashboard/profile">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
