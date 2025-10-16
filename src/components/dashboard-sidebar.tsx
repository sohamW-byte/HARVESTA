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
            
            return item.isCollapsible ? (
              <Collapsible key={item.label} className="w-full">
                <div className="group/menu-item relative flex w-full items-center">
                   <CollapsibleTrigger asChild>
                     <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-sm">
                        <item.icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                        <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                     </Button>
                   </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                   <div className="pl-8 py-1">
                     {item.subItems?.map(subItem => (
                         <Link href={subItem.href} key={subItem.href} passHref>
                           <SidebarMenuButton
                             className="w-full justify-start"
                             variant="ghost"
                             size="sm"
                             isActive={pathname === subItem.href}
                           >
                             {subItem.label}
                           </SidebarMenuButton>
                         </Link>
                     ))}
                   </div>
                </CollapsibleContent>
              </Collapsible>
            ) : (
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
