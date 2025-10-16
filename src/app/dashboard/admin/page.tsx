import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog } from 'lucide-react';

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
      <p className="text-muted-foreground">Manage users and platform settings.</p>
      
      <div className="mt-8 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                    <UserCog className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Under Construction</CardTitle>
                <CardDescription>The admin panel is currently under development. You'll soon be able to manage user profiles, verify identities, and oversee marketplace activity here.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
