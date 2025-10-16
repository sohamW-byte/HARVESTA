
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';

interface TasksCardProps {
  completionPercentage: number;
  nextTaskTitle: string;
  nextTaskDue: string;
}

export function TasksCard({ completionPercentage, nextTaskTitle, nextTaskDue }: TasksCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="rounded-2xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{t('Field Progress')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-muted-foreground">{t('Completion')}</span>
            <span className="text-lg font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} aria-label={`${completionPercentage}% ${t('of tasks complete')}`} />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t('Next Up')}</p>
          <p className="font-semibold">{t(nextTaskTitle)}</p>
          <p className="text-xs text-muted-foreground">{t('Due')}: {t(nextTaskDue)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
