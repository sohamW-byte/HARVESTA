import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      <p className="text-muted-foreground">Chat directly with buyers and sellers.</p>
      
      <div className="mt-8 flex items-center justify-center">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardTitle className="mt-4">Under Construction</CardTitle>
                <CardDescription>The direct messaging feature is currently under development. You'll soon be able to chat with other users in real-time right here.</CardDescription>
            </CardHeader>
        </Card>
      </div>
    </div>
  );
}
