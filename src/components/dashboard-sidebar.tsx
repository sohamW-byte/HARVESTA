'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  BarChart,
  Store,
  Users,
  Sprout,
  Lightbulb,
  MessageSquare,
  User as UserIcon,
  LifeBuoy,
  ScrollText,
  ChevronDown,
  FileText,
  BadgeDollarSign,
  BookOpen,
  Code,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useTranslation } from '@/hooks/use-translation';

const yojanaLinks = [
    { key: 'PM Kisan Samman Nidhi', href: 'https://pmkisan.gov.in/', label: 'PM Kisan Samman Nidhi' },
    { key: 'e-NAM', href: 'https://www.enam.gov.in/web/', label: 'e-NAM' },
    { key: 'Soil Health Card', href: 'https://soilhealth.dac.gov.in/', label: 'Soil Health Card' },
    { key: 'Pradhan Mantri Fasal Bima Yojana', href: 'https://pmfby.gov.in/', label: 'Pradhan Mantri Fasal Bima Yojana' },
    { key: 'Kisan Suvidha', href: 'https://mvk.iitd.ac.in/', label: 'Kisan Suvidha' },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/recommendations', label: 'AI Suggestions', icon: Lightbulb, buyerHidden: true },
    { href: '/dashboard/marketplace', label: 'Marketplace', icon: Store },
    { href: '/dashboard/orders', label: 'Orders', icon: FileText },
    { href: '/dashboard/my-fields', label: 'My Fields', icon: Map, buyerHidden: true },
    { href: '/dashboard/reports', label: 'Reports', icon: BarChart, buyerHidden: true },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/community', label: 'Community', icon: Users },
    { href: '/dashboard/learning-hub', label: 'Learning Hub', icon: BookOpen },
    { href: '/dashboard/profile', label: 'Profile', icon: UserIcon },
    { href: '/dashboard/feedback', label: 'Feedback & Help', icon: LifeBuoy },
  ];
  
  const devMenuItems = [
    { href: '/dashboard/developer/image-examples', label: 'Image Examples', icon: Code },
  ];

  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';
  const isBuyer = userProfile?.role === 'buyer';

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sprout className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Harvesta</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            if (item.buyerHidden && isBuyer) return null;
            
            const isLearningHub = item.href === '/dashboard/learning-hub';

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    variant="ghost"
                    tooltip={t(item.label)}
                  >
                    <item.icon />
                    <span className={cn(isLearningHub && 'animate-pulse [text-shadow:0_0_8px_hsl(var(--primary))]')}>
                      {t(item.label)}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
          <Collapsible className="w-full">
              <CollapsibleTrigger asChild>
                  <SidebarMenuButton variant='ghost' className='w-full justify-start group'>
                      <ScrollText />
                      <span>{t('Yojanas & Schemes')}</span>
                      <ChevronDown className='ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180' />
                  </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-10 pr-2 py-2 flex flex-col gap-2">
                    {yojanaLinks.map(link => (
                        <a 
                            key={link.href} 
                            href={link.href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {t(link.key)}
                        </a>
                    ))}
                </div>
              </CollapsibleContent>
          </Collapsible>

          {/* Developer Section */}
          <div className="!mt-auto pt-4">
              <SidebarGroup>
                <SidebarGroupLabel>Developer</SidebarGroupLabel>
                <SidebarGroupContent>
                     <SidebarMenu>
                        {devMenuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href} passHref>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    variant="ghost"
                                    tooltip={t(item.label)}
                                >
                                    <item.icon />
                                    <span>{t(item.label)}</span>
                                </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
          </div>
          
           <SidebarMenuItem>
                <Link href="/dashboard/pricing" passHref>
                  <SidebarMenuButton
                    isActive={pathname === '/dashboard/pricing'}
                    variant="ghost"
                    tooltip={t('Pricing')}
                  >
                    <BadgeDollarSign />
                    <span>{t('Pricing')}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.name} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate text-sm">{userProfile?.name || "User"}</span>
                {userProfile?.email && <span className="text-xs text-muted-foreground truncate">{userProfile.email}</span>}
              </div>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
