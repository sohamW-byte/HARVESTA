'use client';

import {
  User,
  LogOut,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
import { HeaderSearch } from './header-search';
import { ThemeToggle } from './theme-toggle';

interface WeatherData {
    temp_c: number;
    condition: {
        text: string;
        icon: string;
    };
}


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
    
    // Only fetch weather when location loading is complete
    if(!locationLoading){
        fetchWeather();
    }
  }, [location, locationError, locationLoading]);


  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-2">
            <div className="md:hidden">
                <SidebarTrigger />
            </div>
            <div className="hidden md:flex">
                <HeaderSearch />
            </div>
        </div>
      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="md:hidden flex-1">
            <HeaderSearch />
        </div>
        <LanguageSwitcher />
        <div className="hidden sm:flex items-center gap-2 text-sm font-medium">
           {isWeatherLoading || locationLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
           ) : weather ? (
            <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={weather.condition.icon} alt={weather.condition.text} className="h-6 w-6" />
                <span>{weather.temp_c}°C, {weather.condition.text}</span>
            </>
          ) : weatherError ? (
            <span className="text-muted-foreground text-xs">{weatherError}</span>
          ) : null}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.name} />
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
             <ThemeToggle />
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
