import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { DashboardHeader } from '@/components/dashboard-header';
import { AnimatePresence } from '@/components/animate-presence';
import { LocationProvider } from '@/hooks/use-location';
import { VoiceAssistant } from '@/components/voice-assistant';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <LocationProvider>
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
            <AnimatePresence>
              {children}
            </AnimatePresence>
          </main>
        </div>
        <VoiceAssistant />
      </LocationProvider>
    </SidebarProvider>
  );
}
