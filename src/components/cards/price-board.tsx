'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MarketDataRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export function PriceBoard() {
  const [prices, setPrices] = useState<MarketDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true);
      setError(null);
      
      const apiKey = process.env.NEXT_PUBLIC_AGMARKNET_API_KEY;
      if (!apiKey || apiKey === 'your-api-key' || apiKey === '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b') {
        setError('API key for Agmarknet is not configured. Please add your own key to the .env file.');
        setLoading(false);
        setPrices([]);
        return;
      }

      const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=5`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorBody = await response.text();
          console.error("API Error Body:", errorBody);
          throw new Error(`API request failed with status: ${response.status}`);
        }
        const data = await response.json();
        if (data.records) {
          setPrices(data.records);
        } else {
          setPrices([]);
        }
      } catch (e: any) {
        console.error("Failed to fetch market data:", e);
        setError(e.message || 'An unknown error occurred while fetching data.');
        setPrices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchMarketData();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  }

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Live Market Prices</CardTitle>
        <CardDescription>
          Real-time commodity prices from government-registered markets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commodity 🌾</TableHead>
              <TableHead>Market 📍</TableHead>
              <TableHead>Price (Modal/Qtl) 💰</TableHead>
              <TableHead className="text-right">Arrival Date 🗓️</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : !error && prices.length > 0 ? (
              prices.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.commodity}</TableCell>
                  <TableCell>{item.market}, {item.district}</TableCell>
                  <TableCell>₹{item.modal_price}</TableCell>
                  <TableCell className="text-right">{formatDate(item.arrival_date)}</TableCell>
                </TableRow>
              ))
            ) : (
             !loading && !error && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No market data available at the moment.
                    </TableCell>
                </TableRow>
             )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
