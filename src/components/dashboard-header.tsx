
'use client';

import {
  User,
  LogOut,
  Store,
} from 'lucide-react';

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
import { HeaderSearch } from './header-search';
import { ThemeToggle } from './theme-toggle';
import { useTranslation } from '@/hooks/use-translation';
import { AccessibilityMenu } from './accessibility-menu';

export function DashboardHeader() {
  const { userProfile, signOut } = useAuth();
  const { t } = useTranslation();
  
  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';

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
      <div className="flex-1 flex justify-end items-center gap-2 md:gap-4">
        <div className="md:hidden flex-1">
            <HeaderSearch />
        </div>
        
        <Link href="/dashboard/marketplace" passHref>
          <Button>
            <Store className="mr-2 h-4 w-4" />
            {t('Marketplace')}
          </Button>
        </Link>

        <LanguageSwitcher />
        <AccessibilityMenu />
        <ThemeToggle />

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
                <span>{t('Profile')}</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('Log out')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
