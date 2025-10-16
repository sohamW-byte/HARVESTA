
'use client';

import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, MessageSquare, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'Anjali Traders',
      avatar: 'https://picsum.photos/seed/user2/40/40',
      role: 'Buyer',
    },
    time: '5h ago',
    content: 'Looking for 2 quintals of high-quality Basmati rice. Please contact me if you have stock available near Delhi. Good price offered.',
    likes: 8,
    comments: 2,
  },
  {
    id: 2,
    author: {
      name: 'Vijay Kumar',
      avatar: 'https://picsum.photos/seed/user1/40/40',
      role: 'Farmer',
    },
    time: '2h ago',
    content: 'The price for tomatoes in the Hyderabad market seems to be dropping. Anyone else seeing this?',
    likes: 15,
    comments: 4,
  },
    {
    id: 3,
    author: {
      name: 'Sunita Patil',
      avatar: 'https://picsum.photos/seed/user3/40/40',
      role: 'Farmer',
    },
    time: '1d ago',
    content: 'Has anyone tried the new organic fertilizer from AgriCorp? Thinking of using it for my next soybean crop in Indore. Reviews welcome!',
    likes: 22,
    comments: 9,
  },
  {
    id: 4,
    author: {
        name: 'Rajesh Farms',
        avatar: 'https://picsum.photos/seed/user4/40/40',
        role: 'Farmer',
    },
    time: '3d ago',
    content: 'Just finished a successful harvest of Alphonso mangoes. Thanks to the community for the tips on pest control!',
    likes: 45,
    comments: 12,
  }
];


export default function CommunityPage() {
    const { userProfile } = useAuth();
    const userInitial = userProfile?.name?.charAt(0).toUpperCase() || '?';

    const sortedPosts = useMemo(() => {
        return [...mockPosts].sort((a, b) => {
            const aIsQuestion = a.content.includes('?');
            const bIsQuestion = b.content.includes('?');
            if (aIsQuestion && !bIsQuestion) return -1;
            if (!aIsQuestion && bIsQuestion) return 1;
            return 0;
        });
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
            <p className="text-muted-foreground">Connect, discuss, and trade with the Harvesta community.</p>

            <div className="mt-6 max-w-3xl mx-auto space-y-6">
                {/* Create Post Card */}
                <Card>
                    <CardHeader className="p-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={userProfile?.photoURL || `https://i.pravatar.cc/150?u=${userProfile?.id}`} />
                                <AvatarFallback>{userInitial}</AvatarFallback>
                            </Avatar>
                            <Textarea placeholder="Share an update or ask a question..." className="flex-1 bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary" />
                        </div>
                    </CardHeader>
                    <CardFooter className="p-4 flex justify-end">
                        <Button>Post</Button>
                    </CardFooter>
                </Card>

                {/* Feed */}
                {sortedPosts.map(post => {
                    const isQuestion = post.content.includes('?');
                    return (
                        <Card key={post.id}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={post.author.avatar} />
                                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-semibold">{post.author.name}</p>
                                            {isQuestion && <HelpCircle className="h-4 w-4 text-accent" />}
                                        </div>
                                        <p className="text-xs text-muted-foreground">{post.author.role} · {post.time}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                                <p className="text-sm">{post.content}</p>
                            </CardContent>
                            <CardFooter className="p-4 pt-0 border-t flex justify-between">
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <ThumbsUp className="mr-2 h-4 w-4" />
                                    {post.likes} Likes
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    {post.comments} Comments
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>
    );
}
