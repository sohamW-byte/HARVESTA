import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  className?: string;
}

export function SummaryCard({ title, value, description, icon, className }: SummaryCardProps) {
  return (
    <Card className={cn("rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 bg-card/60 backdrop-blur-sm", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
