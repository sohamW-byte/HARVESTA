'use client';

import { useMemo } from 'react';
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
import { useAuth } from '@/hooks/use-auth';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { Field, GrowthData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';

export function GrowthMonitorChart() {
  const { user } = useAuth();
  const db = useFirestore();

  // Memoize the query for the user's fields, limit to 1 for simplicity
  const fieldsQuery = useMemoFirebase(() => 
    user ? query(collection(db, 'users', user.uid, 'fields'), limit(1)) : null, 
    [user, db]
  );
  const { data: fields, isLoading: isLoadingFields } = useCollection<Field>(fieldsQuery);

  const firstField = fields?.[0];

  // Memoize the query for growth data of the first field
  const growthDataQuery = useMemoFirebase(() => 
    firstField ? query(collection(db, 'users', user!.uid, 'fields', firstField.id, 'growthData'), orderBy('date', 'asc')) : null, 
    [firstField, user]
  );
  const { data: growthData, isLoading: isLoadingGrowthData } = useCollection<GrowthData>(growthDataQuery);

  const formattedData = useMemo(() => {
    return growthData?.map(d => ({
      ...d,
      date: d.date ? format(d.date.toDate(), 'MMM d') : 'Unknown Date',
    }));
  }, [growthData]);

  const isLoading = isLoadingFields || isLoadingGrowthData;

  return (
    <Card className="rounded-2xl transition-shadow duration-300 h-full bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Crop Growth Monitor</CardTitle>
        <CardDescription>
          {firstField ? `Weekly progress for ${firstField.name}.` : 'Weekly progress of key growth metrics.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading && (
            <div className="h-full flex flex-col justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          )}

          {!isLoading && (!formattedData || formattedData.length === 0) && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="p-4 bg-muted rounded-full">
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">
                No growth data available for your fields yet. <br/> Add some data to see your chart!
              </p>
            </div>
          )}

          {!isLoading && formattedData && formattedData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
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
          )}
        </div>
      </CardContent>
    </Card>
  );
}
