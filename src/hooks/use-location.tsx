'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface Location {
  latitude: number;
  longitude: number;
  address?: string; // Optional field for reverse geocoded address
}

interface LocationContextType {
  location: Location | null;
  loading: boolean;
  error: GeolocationPositionError | Error | null;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// A free, privacy-friendly reverse geocoding service
const REVERSE_GEOCODING_API = 'https://nominatim.openstreetmap.org/reverse';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<GeolocationPositionError | Error | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(new Error('Geolocation is not supported by your browser.'));
      setLoading(false);
      return;
    }

    const handleSuccess = async (position: GeolocationPositionError) => {
      const { latitude, longitude } = position.coords;
      try {
        const response = await fetch(`${REVERSE_GEOCODING_API}?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
            throw new Error('Failed to fetch address.');
        }
        const data = await response.json();
        const address = data.display_name || 'Unknown location';
        setLocation({ latitude, longitude, address });
      } catch (e) {
         // If reverse geocoding fails, still provide coordinates
         console.error("Reverse geocoding failed:", e);
         setLocation({ latitude, longitude, address: "Location details unavailable" });
      } finally {
        setLoading(false);
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(error);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
    });

  }, []);

  const value = { location, loading, error };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
