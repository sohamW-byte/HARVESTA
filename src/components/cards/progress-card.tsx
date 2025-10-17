
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/hooks/use-translation';
import { Sprout, BookOpen } from 'lucide-react';

interface ProgressCardProps {
  fieldCompletionPercentage: number;
  learningCompletionPercentage: number;
}

export function ProgressCard({ fieldCompletionPercentage, learningCompletionPercentage }: ProgressCardProps) {
  const { t } = useTranslation();
  return (
    <Card className="rounded-2xl h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium">{t('Field & Learning Progress')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sprout className="h-4 w-4" />
                <span>{t('Field Tasks')}</span>
            </div>
            <span className="text-sm font-semibold">{Math.round(fieldCompletionPercentage)}%</span>
          </div>
          <Progress value={fieldCompletionPercentage} aria-label={`${fieldCompletionPercentage}% ${t('of field tasks complete')}`} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{t('Learning')}</span>
            </div>
            <span className="text-sm font-semibold">{Math.round(learningCompletionPercentage)}%</span>
          </div>
          <Progress value={learningCompletionPercentage} aria-label={`${learningCompletionPercentage}% ${t('of learning complete')}`} />
        </div>
      </CardContent>
    </Card>
  );
}
