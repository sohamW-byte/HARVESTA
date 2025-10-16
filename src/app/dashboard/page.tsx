'use client';

import { useAuth } from '@/hooks/use-auth';
import { SummaryCard } from '@/components/cards/summary-card';
import { TestimonialsCard } from '@/components/cards/testimonials-card';
import { TasksCard } from '@/components/cards/tasks-card';
import { GrowthMonitorChart } from '@/components/charts/growth-monitor-chart';
import { DollarSign, CheckCircle } from 'lucide-react';
import { PriceBoard } from '@/components/cards/price-board';
import { AddProduceDialog } from '@/components/add-produce-dialog';
import { WeatherCard } from '@/components/cards/weather-card';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  
  const greeting = userProfile?.name ? `Hello, ${userProfile.name.split(' ')[0]} 👋` : 'Welcome to Harvesta 👋';

  // Mock data for demonstration
  const totalExpenses = 12530.50;
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Add an ID to the greeting for easy targeting */}
          <h1 id="dashboard-greeting" className="text-3xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-muted-foreground">Here's a summary of your farm's performance.</p>
        </div>
        {userProfile?.role === 'farmer' && (
           <AddProduceDialog />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Fields Overview"
          value="Good"
          description="Overall health is positive"
          icon={<CheckCircle className="text-green-500" />}
          className="lg:col-span-1"
        />
        <SummaryCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          description="This month so far"
          icon={<DollarSign className="text-primary" />}
          className="lg:col-span-1"
        />
        <WeatherCard />
        <TasksCard
            completionPercentage={75}
            nextTaskTitle="Harvest Wheat"
            nextTaskDue="in 3 days"
        />
      </div>

      <div className="grid gap-6">
        <PriceBoard />
      </div>

      <div className="grid gap-6">
        <GrowthMonitorChart />
        <TestimonialsCard />
      </div>
    </div>
  );
}
