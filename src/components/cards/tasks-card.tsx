import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TasksCardProps {
  completionPercentage: number;
  nextTaskTitle: string;
  nextTaskDue: string;
}

export function TasksCard({ completionPercentage, nextTaskTitle, nextTaskDue }: TasksCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">Field Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-muted-foreground">Completion</span>
            <span className="text-lg font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} aria-label={`${completionPercentage}% of tasks complete`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Next Up</p>
          <p className="font-semibold">{nextTaskTitle}</p>
          <p className="text-xs text-muted-foreground">Due: {nextTaskDue}</p>
        </div>
      </CardContent>
    </Card>
  );
}
