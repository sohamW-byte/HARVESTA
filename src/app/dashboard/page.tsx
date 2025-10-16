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
import { useTranslation } from '@/hooks/use-translation';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { userProfile } = useAuth();
  const { t } = useTranslation();
  
  const greeting = userProfile?.name ? `${t('Hello')}, ${userProfile.name.split(' ')[0]} 👋` : `${t('Welcome to Harvesta')} 👋`;

  const totalExpenses = 12530.50;
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
      },
    },
  };

  return (
    <motion.div 
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <div>
          <h1 id="dashboard-greeting" className="text-3xl font-bold tracking-tight">{greeting}</h1>
          <p className="text-muted-foreground">{t("Here's a summary of your farm's performance.")}</p>
        </div>
        {userProfile?.role === 'farmer' && (
           <AddProduceDialog />
        )}
      </motion.div>

      <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={containerVariants}>
        <motion.div variants={itemVariants}>
          <SummaryCard
            title={t("Fields Overview")}
            value={t("Good")}
            description={t("Overall health is positive")}
            icon={<CheckCircle className="text-green-500" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SummaryCard
            title={t("Total Profits")}
            value={`₹${totalExpenses.toLocaleString()}`}
            description={t("This month so far")}
            icon={<DollarSign className="text-primary" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <WeatherCard />
        </motion.div>
        <motion.div variants={itemVariants}>
          <TasksCard
              completionPercentage={75}
              nextTaskTitle="Harvest Wheat"
              nextTaskDue="in 3 days"
          />
        </motion.div>
      </motion.div>

      <motion.div className="grid gap-6" variants={itemVariants}>
        <PriceBoard />
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6" variants={itemVariants}>
        <GrowthMonitorChart />
        <TestimonialsCard />
      </motion.div>

    </motion.div>
  );
}
