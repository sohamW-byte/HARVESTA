'use client';

import { useAuth } from '@/hooks/use-auth';
import { SummaryCard } from '@/components/cards/summary-card';
import { TestimonialsCard } from '@/components/cards/testimonials-card';
import { TasksCard } from '@/components/cards/tasks-card';
import { GrowthMonitorChart } from '@/components/charts/growth-monitor-chart';
import { DollarSign, CloudRain, CheckCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceBoard } from '@/components/cards/price-board';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  
  const greeting = userProfile?.name ? `Hello, ${userProfile.name.split(' ')[0]} 👋` : 'Welcome to Harvesta 👋';

  // Mock data for demonstration
  const totalExpenses = 12530.50;
  const nextTask = { title: 'Irrigate Field A', due: 'Tomorrow' };
  const tasksCompletion = 75;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Add an ID to the greeting for easy targeting */}
          <h1 id="dashboard-greeting" className="text-3xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-muted-foreground">Here's a summary of your farm's performance.</p>
        </div>
        <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Produce
        </Button>
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
        <SummaryCard
          title="Rainfall"
          value="5 mm"
          description="Expected today"
          icon={<CloudRain className="text-blue-500" />}
          className="lg:col-span-1"
        />
         <TasksCard
          completionPercentage={tasksCompletion}
          nextTaskTitle={nextTask.title}
          nextTaskDue={nextTask.due}
        />
      </div>

      <div className="grid gap-6">
        <PriceBoard />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TestimonialsCard />
        </div>
        <div className="lg:col-span-2">
          <GrowthMonitorChart />
        </div>
      </div>
    </div>
  );
}
