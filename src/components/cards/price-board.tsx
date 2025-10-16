'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    { state: "Maharashtra", district: "Nashik", market: "Nashik", commodity: "Onion", variety: "Red", modal_price: "13", arrival_date: "2023-10-26", min_price: "11", max_price: "14" },
    { state: "Punjab", district: "Ludhiana", market: "Khanna", commodity: "Wheat", variety: "HD-2967", modal_price: "22", arrival_date: "2023-10-26", min_price: "21", max_price: "23" },
    { state: "Uttar Pradesh", district: "Lucknow", market: "Lucknow", commodity: "Potato", variety: "Kufri Bahar", modal_price: "10", arrival_date: "2023-10-26", min_price: "9", max_price: "11" },
    { state: "Andhra Pradesh", district: "Guntur", market: "Guntur", commodity: "Red Chilli", variety: "Teja", modal_price: "185", arrival_date: "2023-10-25", min_price: "170", max_price: "200" },
    { state: "West Bengal", district: "Kolkata", market: "Sealdah", commodity: "Rice", variety: "Sona Masuri", modal_price: "32", arrival_date: "2023-10-26", min_price: "31", max_price: "33" },
    { state: "Gujarat", district: "Rajkot", market: "Gondal", commodity: "Cotton", variety: "Shankar-6", modal_price: "75", arrival_date: "2023-10-25", min_price: "72", max_price: "78" },
    { state: "Madhya Pradesh", district: "Indore", market: "Indore", commodity: "Soybean", variety: "JS-9560", modal_price: "48", arrival_date: "2023-10-26", min_price: "46", max_price: "50" },
    { state: "Karnataka", district: "Bengaluru", market: "Bengaluru", commodity: "Tomato", variety: "Hybrid", modal_price: "15", arrival_date: "2023-10-26", min_price: "13", max_price: "17" },
    { state: "Tamil Nadu", district: "Erode", market: "Erode", commodity: "Turmeric", variety: "Erode Local", modal_price: "72", arrival_date: "2023-10-25", min_price: "68", max_price: "75" },
    { state: "Rajasthan", district: "Jaipur", market: "Jaipur (F&V)", commodity: "Mustard", variety: "Hybrid", modal_price: "54", arrival_date: "2023-10-26", min_price: "52", max_price: "56" },
    { state: "Maharashtra", district: "Ratnagiri", market: "Ratnagiri", commodity: "Mango", variety: "Alphonso", modal_price: "450", arrival_date: "2023-05-20", min_price: "400", max_price: "500" },
    { state: "Kerala", district: "Idukki", market: "Nedumkandam", commodity: "Black Pepper", variety: "Un-Garbled", modal_price: "510", arrival_date: "2023-10-25", min_price: "505", max_price: "515" },
    { state: "Assam", district: "Guwahati", market: "Pamohi", commodity: "Ginger", variety: "Nadia", modal_price: "65", arrival_date: "2023-10-26", min_price: "60", max_price: "70" },
    { state: "Bihar", district: "Patna", market: "Meethapur", commodity: "Lentil (Masur)", variety: "Small", modal_price: "63", arrival_date: "2023-10-25", min_price: "62", max_price: "64" },
    { state: "Haryana", district: "Karnal", market: "Karnal", commodity: "Paddy (Basmati)", variety: "1121", modal_price: "42", arrival_date: "2023-10-26", min_price: "40", max_price: "44" }
];

const INITIAL_VISIBLE_ROWS = 5;

export function PriceBoard() {
  const [prices, setPrices] = useState<MarketDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('commodity_asc');
  const [filterState, setFilterState] = useState('all');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setPrices(demoPrices);
      setLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);
  
  const uniqueStates = useMemo(() => ['all', ...Array.from(new Set(demoPrices.map(p => p.state)))], []);

  const filteredAndSortedPrices = useMemo(() => {
    return prices
      .filter(price => {
        const query = searchQuery.toLowerCase();
        return (
          (price.commodity.toLowerCase().includes(query) ||
           price.market.toLowerCase().includes(query) ||
           price.district.toLowerCase().includes(query)) &&
          (filterState === 'all' || price.state === filterState)
        );
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price_asc':
            return parseInt(a.modal_price) - parseInt(b.modal_price);
          case 'price_desc':
            return parseInt(b.modal_price) - parseInt(a.modal_price);
          case 'commodity_asc':
            return a.commodity.localeCompare(b.commodity);
          case 'commodity_desc':
            return b.commodity.localeCompare(a.commodity);
          default:
            return 0;
        }
      });
  }, [prices, searchQuery, sortBy, filterState]);

  const itemsToDisplay = showAll ? filteredAndSortedPrices : filteredAndSortedPrices.slice(0, INITIAL_VISIBLE_ROWS);

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
      return new Date(dateString).toLocaleDateString('en-IN', options);
    } catch {
      return dateString;
    }
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Live Market Prices</CardTitle>
        <CardDescription>
          Real-time commodity prices from various markets across India.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by commodity, market..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex gap-4">
                 <Select value={filterState} onValueChange={setFilterState}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by State" />
                    </SelectTrigger>
                    <SelectContent>
                        {uniqueStates.map(state => (
                            <SelectItem key={state} value={state}>
                                {state === 'all' ? 'All States' : state}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="commodity_asc">Commodity (A-Z)</SelectItem>
                        <SelectItem value="commodity_desc">Commodity (Z-A)</SelectItem>
                        <SelectItem value="price_asc">Price (Low-High)</SelectItem>
                        <SelectItem value="price_desc">Price (High-Low)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Commodity 🌾</TableHead>
              <TableHead>Market 📍</TableHead>
              <TableHead>Price (Modal/Kg) 💰</TableHead>
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
            ) : itemsToDisplay.length > 0 ? (
              itemsToDisplay.map((item, index) => (
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
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                        No results found for your query.
                    </TableCell>
                </TableRow>
             )
            )}
          </TableBody>
        </Table>
      </CardContent>
      {filteredAndSortedPrices.length > INITIAL_VISIBLE_ROWS && (
        <CardFooter className="justify-center border-t pt-4">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
