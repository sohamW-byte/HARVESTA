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

const demoPrices: MarketDataRecord[] = [
    { state: "Maharashtra", district: "Nashik", market: "Nashik", commodity: "Onion", variety: "Red", modal_price: "1250", arrival_date: "2023-10-26", min_price: "1100", max_price: "1400" },
    { state: "Punjab", district: "Ludhiana", market: "Khanna", commodity: "Wheat", variety: "HD-2967", modal_price: "2150", arrival_date: "2023-10-26", min_price: "2100", max_price: "2200" },
    { state: "Uttar Pradesh", district: "Lucknow", market: "Lucknow", commodity: "Potato", variety: "Kufri Bahar", modal_price: "980", arrival_date: "2023-10-26", min_price: "900", max_price: "1050" },
    { state: "Andhra Pradesh", district: "Guntur", market: "Guntur", commodity: "Red Chilli", variety: "Teja", modal_price: "18500", arrival_date: "2023-10-25", min_price: "17000", max_price: "20000" },
    { state: "West Bengal", district: "Kolkata", market: "Sealdah", commodity: "Rice", variety: "Sona Masuri", modal_price: "3200", arrival_date: "2023-10-26", min_price: "3100", max_price: "3300" },
    { state: "Gujarat", district: "Rajkot", market: "Gondal", commodity: "Cotton", variety: "Shankar-6", modal_price: "7500", arrival_date: "2023-10-25", min_price: "7200", max_price: "7800" },
    { state: "Madhya Pradesh", district: "Indore", market: "Indore", commodity: "Soybean", variety: "JS-9560", modal_price: "4800", arrival_date: "2023-10-26", min_price: "4650", max_price: "5000" },
    { state: "Karnataka", district: "Bengaluru", market: "Bengaluru", commodity: "Tomato", variety: "Hybrid", modal_price: "1500", arrival_date: "2023-10-26", min_price: "1300", max_price: "1700" },
    { state: "Tamil Nadu", district: "Erode", market: "Erode", commodity: "Turmeric", variety: "Erode Local", modal_price: "7200", arrival_date: "2023-10-25", min_price: "6800", max_price: "7500" },
    { state: "Rajasthan", district: "Jaipur", market: "Jaipur (F&V)", commodity: "Mustard", variety: "Hybrid", modal_price: "5400", arrival_date: "2023-10-26", min_price: "5200", max_price: "5600" },
    { state: "Maharashtra", district: "Ratnagiri", market: "Ratnagiri", commodity: "Mango", variety: "Alphonso", modal_price: "45000", arrival_date: "2023-05-20", min_price: "40000", max_price: "50000" },
    { state: "Kerala", district: "Idukki", market: "Nedumkandam", commodity: "Black Pepper", variety: "Un-Garbled", modal_price: "51000", arrival_date: "2023-10-25", min_price: "50500", max_price: "51500" },
];


export function PriceBoard() {
  const [prices, setPrices] = useState<MarketDataRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data with a short delay
    setLoading(true);
    const timer = setTimeout(() => {
      setPrices(demoPrices);
      setLoading(false);
    }, 500); // 0.5 second delay to show loading skeleton briefly

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch {
      return dateString;
    }
  }

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Live Market Prices</CardTitle>
        <CardDescription>
          Real-time commodity prices from various markets across India.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            ) : prices.length > 0 ? (
              prices.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.commodity}</TableCell>
                  <TableCell>{item.market}, {item.district}</TableCell>
                  <TableCell>₹{parseInt(item.modal_price).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{formatDate(item.arrival_date)}</TableCell>
                </TableRow>
              ))
            ) : (
             !loading && (
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
