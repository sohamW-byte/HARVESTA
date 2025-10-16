'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// Mock data, in a real app this would come from Firestore
const mockConversations = [
  {
    id: 'conv1',
    participant: {
      id: 'user2',
      name: 'Ramesh Kumar',
      avatar: 'https://picsum.photos/seed/user2/40/40',
    },
    lastMessage: 'I can give you a good price on the Sona Masoori.',
    timestamp: '2h ago',
    unread: 2,
  },
  {
    id: 'conv2',
    participant: {
      id: 'user3',
      name: 'Spice India Exports',
      avatar: 'https://picsum.photos/seed/user3/40/40',
    },
    lastMessage: 'Sounds good, let\'s finalize the deal.',
    timestamp: '5h ago',
    unread: 0,
  },
];

const mockMessages = {
  conv1: [
    { id: 'msg1', senderId: 'user2', text: 'Hi, I saw your listing for Sona Masoori Rice.', timestamp: '3h ago' },
    { id: 'msg2', senderId: 'me', text: 'Yes, it\'s available. How much do you need?', timestamp: '3h ago' },
    { id: 'msg3', senderId: 'user2', text: 'Around 10 quintals. What is the final price you can offer?', timestamp: '2h ago' },
    { id: 'msg4', senderId: 'user2', text: 'I can give you a good price on the Sona Masoori.', timestamp: '2h ago' },
  ],
  conv2: [
    { id: 'msg5', senderId: 'me', text: 'I have the organic turmeric you are looking for.', timestamp: '6h ago' },
    { id: 'msg6', senderId: 'user3', text: 'Excellent! What quantity can you supply?', timestamp: '5h ago' },
    { id: 'msg7', senderId: 'me', text: 'I have 5 quintals ready for dispatch.', timestamp: '5h ago' },
    { id: 'msg8', senderId: 'user3', text: 'Sounds good, let\'s finalize the deal.', timestamp: '5h ago' },
  ],
};


export default function MessagesPage() {
  const { userProfile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);

  const messages = mockMessages[selectedConversation.id as keyof typeof mockMessages] || [];

  return (
    <div className="flex h-[calc(100vh_-_10rem)]">
      {/* Conversation List */}
      <Card className="w-1/3 flex flex-col rounded-r-none">
        <CardHeader className="p-4 border-b">
          <h1 className="text-2xl font-bold tracking-tight">Chats</h1>
        </CardHeader>
        <ScrollArea className="flex-1">
          {mockConversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted',
                selectedConversation.id === conv.id && 'bg-muted'
              )}
              onClick={() => setSelectedConversation(conv)}
            >
              <Avatar>
                <AvatarImage src={conv.participant.avatar} />
                <AvatarFallback>{conv.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{conv.participant.name}</p>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                <p>{conv.timestamp}</p>
                {conv.unread > 0 && (
                  <div className="mt-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center ml-auto">
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </Card>

      {/* Message View */}
      <div className="w-2/3 flex flex-col bg-card rounded-l-none border border-l-0">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedConversation.participant.avatar} />
                <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-lg font-semibold">{selectedConversation.participant.name}</h2>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2 max-w-[80%]',
                      msg.senderId === 'me' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={msg.senderId === 'me' ? (userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : '') : selectedConversation.participant.avatar} />
                       <AvatarFallback>
                        {msg.senderId === 'me' ? userProfile?.name?.charAt(0) : selectedConversation.participant.name.charAt(0)}
                       </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        msg.senderId === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted rounded-bl-none'
                      )}
                    >
                      <p>{msg.text}</p>
                      <p className={cn("text-xs mt-1", msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/70' )}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="relative">
                <Input placeholder="Type a message..." className="pr-12" />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="mx-auto bg-muted rounded-full p-4 w-fit">
                <MessageSquare className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Select a conversation</h2>
            <p className="text-muted-foreground">Choose one of your existing chats to see the messages.</p>
          </div>
        )}
      </div>
    </div>
  );
}
