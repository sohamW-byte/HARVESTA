'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Sprout, User } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

const mockSearchResults = [
  { id: 1, type: 'product', name: 'Sona Masoori Rice', href: '/dashboard/marketplace' },
  { id: 2, type: 'product', name: 'Organic Turmeric', href: '/dashboard/marketplace' },
  { id: 3, type: 'farmer', name: 'Ramesh Kumar', href: '/dashboard/messages' },
  { id: 4, type: 'buyer', name: 'Anjali Traders', href: '/dashboard/messages' },
  { id: 5, type: 'product', name: 'Alphonso Mangoes', href: '/dashboard/marketplace' },
  { id: 6, type: 'page', name: 'AI Recommendations', href: '/dashboard/recommendations' },
  { id: 7, type: 'page', name: 'Community Forum', href: '/dashboard/community' },
];

export function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockSearchResults>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const filteredResults = mockSearchResults.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);


  const getIcon = (type: string) => {
    switch (type) {
      case 'product':
        return <Sprout className="h-4 w-4 text-muted-foreground" />;
      case 'farmer':
      case 'buyer':
        return <User className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Search className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="relative w-full md:max-w-xs" ref={searchRef}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search products, farmers, buyers..."
        className="w-full appearance-none bg-background pl-8 shadow-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
      />
      {isFocused && query.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-50">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => {
                        setQuery('');
                        setIsFocused(false);
                    }}
                  >
                    {getIcon(item.type)}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
