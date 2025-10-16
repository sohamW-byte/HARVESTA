'use client';

import {
  CloudSun,
  Search,
  User,
  LogOut,
  Globe,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function DashboardHeader() {
  const { userProfile, signOut } = useAuth();
  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';

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
        <div className="flex items-center gap-2 text-sm font-medium">
          <CloudSun className="h-5 w-5 text-accent" />
          <span>24°C, Sunny</span>
        </div>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>हिन्दी (Hindi)</DropdownMenuItem>
                <DropdownMenuItem>कोंकणी (Konkani)</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
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
