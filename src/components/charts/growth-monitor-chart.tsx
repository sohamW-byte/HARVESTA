'use client';

import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

const mockData = [
  { date: 'Week 1', height: 5, biomass: 10, leafArea: 20 },
  { date: 'Week 2', height: 15, biomass: 25, leafArea: 45 },
  { date: 'Week 3', height: 30, biomass: 45, leafArea: 75 },
  { date: 'Week 4', height: 50, biomass: 70, leafArea: 110 },
  { date: 'Week 5', height: 75, biomass: 100, leafArea: 150 },
  { date: 'Week 6', height: 90, biomass: 125, leafArea: 180 },
];

export function GrowthMonitorChart() {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Crop Growth Monitor</CardTitle>
        <CardDescription>Weekly progress of key growth metrics.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={mockData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }}/>
              <Line
                type="monotone"
                dataKey="height"
                name="Height (cm)"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--chart-1))' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="biomass"
                name="Biomass (g)"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--chart-2))' }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="leafArea"
                name="Leaf Area (cm²)"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--chart-4))' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
