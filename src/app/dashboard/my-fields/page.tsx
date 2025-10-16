import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Map } from 'lucide-react';

export default function MyFieldsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">My Fields</h1>
      <p className="text-muted-foreground">Manage and monitor your fields.</p>
      
      <div className="mt-8 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                    <Map className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Under Construction</CardTitle>
                <CardDescription>This page is currently being developed. Check back soon for field management features!</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
