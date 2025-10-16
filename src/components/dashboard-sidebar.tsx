'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  BarChart,
  ChevronDown,
  Atom,
  Store,
  Users,
  Sprout,
  Lightbulb,
  MessageSquare,
  UserCog,
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
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/my-fields', label: 'My Fields', icon: Map },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/dashboard/recommendations', label: 'AI Recommendations', icon: Lightbulb },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: Store },
  { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { href: '/dashboard/community', label: 'Community', icon: Users },
  { href: '/dashboard/automation', label: 'Automation', icon: Atom },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart },
  { href: '/dashboard/admin', label: 'Admin', icon: UserCog, adminOnly: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';
  const isAdmin = userProfile?.role === 'admin';

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
            if (item.adminOnly && !isAdmin) return null;
            
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    variant="ghost"
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
                <AvatarImage src={userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : ''} alt={userProfile?.name} />
                <AvatarFallback>{userInitial}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium truncate text-sm">{userProfile?.name || "User"}</span>
                <span className="text-xs text-muted-foreground truncate">{userProfile?.email || "user@email.com"}</span>
              </div>
          </div>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
