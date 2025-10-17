'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { BookOpen, CheckCircle, Clock, ExternalLink, Globe, Presentation, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { learningResources } from './resources';

const allResources = [
  ...learningResources.marketing,
  ...learningResources.advancedFarming,
  ...learningResources.businessManagement,
];

const totalDuration = allResources.reduce((acc, curr) => acc + curr.duration, 0);

const ResourceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video': return <Video className="h-4 w-4 text-red-500" />;
    case 'article': return <BookOpen className="h-4 w-4 text-blue-500" />;
    case 'presentation': return <Presentation className="h-4 w-4 text-yellow-500" />;
    case 'website': return <Globe className="h-4 w-4 text-green-500" />;
    default: return <BookOpen className="h-4 w-4 text-gray-500" />;
  }
};

export default function LearningHubPage() {
  const [completed, setCompleted] = useState<string[]>(['m1', 'm2', 'af1']); // Mock initial completed state

  const handleCheckChange = (id: string, isChecked: boolean | 'indeterminate') => {
    if (isChecked) {
      setCompleted((prev) => [...prev, id]);
    } else {
      setCompleted((prev) => prev.filter((item) => item !== id));
    }
  };

  const completedDuration = allResources
    .filter(r => completed.includes(r.id))
    .reduce((acc, curr) => acc + curr.duration, 0);

  const progressPercentage = (completedDuration / totalDuration) * 100;

  const renderResourceList = (resources: typeof allResources) => (
    <ul className="space-y-4">
      {resources.map((resource) => (
        <li key={resource.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
          <div className="mt-1">
             <Checkbox
                id={resource.id}
                onCheckedChange={(checked) => handleCheckChange(resource.id, checked)}
                checked={completed.includes(resource.id)}
             />
          </div>
          <div className="flex-1">
            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="font-medium hover:underline flex items-center gap-2">
              {resource.title}
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </a>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                    <ResourceIcon type={resource.type} />
                    <span className="capitalize">{resource.type}</span>
                </div>
                 <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{resource.duration} min</span>
                 </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Learning Hub</h1>
        <p className="text-muted-foreground">Empower your farming with expert knowledge and skills.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & Sales</CardTitle>
              <CardDescription>Learn how to sell your produce for better prices.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderResourceList(learningResources.marketing)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Farming Techniques</CardTitle>
              <CardDescription>Master modern methods for higher yields and sustainability.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderResourceList(learningResources.advancedFarming)}
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle>Business & Financial Management</CardTitle>
              <CardDescription>Manage your farm as a successful business.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderResourceList(learningResources.businessManagement)}
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progressPercentage} />
              <div className="text-center text-sm text-muted-foreground">
                <p><span className="font-bold text-foreground">{completed.length}</span> of <span className="font-bold text-foreground">{allResources.length}</span> resources completed</p>
              </div>
              <Separator />
               <div className="flex justify-between text-sm">
                    <span className="font-medium">Time Spent:</span>
                    <span className="text-primary font-bold">{completedDuration} min</span>
               </div>
                <div className="flex justify-between text-sm">
                    <span className="font-medium">Time Remaining:</span>
                    <span className="text-muted-foreground font-bold">{totalDuration - completedDuration} min</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
