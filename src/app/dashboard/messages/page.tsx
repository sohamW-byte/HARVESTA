'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, MessageSquare, Bot, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { chat, type ChatOutput } from '@/ai/flows/chat-flow';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const mockMessages: Record<string, { id: string; senderId: string; text: string; timestamp: string; users?: ChatOutput['users'] }[]> = {
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

const assistantConversation = {
    id: 'assistant',
    participant: {
        id: 'ai-assistant',
        name: 'Harvesta Assistant',
        avatar: '/bot-avatar.png',
    },
    lastMessage: 'Ask me to find users for you!',
    timestamp: 'Now',
    unread: 1,
};


export default function MessagesPage() {
  const { userProfile } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(assistantConversation);
  const [conversations, setConversations] = useState([assistantConversation, ...mockConversations]);
  const [messages, setMessages] = useState<Record<string, any[]>>({
      ...mockMessages,
      assistant: [
          {id: 'start', senderId: 'ai-assistant', text: 'Hello! I am your Harvesta Assistant. You can ask me to find other users on the platform. For example, try "Find users named Priya".', timestamp: 'Just now' }
      ],
  });
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedConversation) return;

    const humanMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      text: inputValue,
      timestamp: 'Just now',
    };

    const newMessages = [...(messages[selectedConversation.id] || []), humanMessage];

    setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: newMessages,
    }));
    
    const currentInput = inputValue;
    setInputValue('');
    
    if (selectedConversation.id === 'assistant') {
        setLoading(true);
        try {
            const result = await chat({ message: currentInput });
            const assistantMessage = {
                id: `msg-${Date.now()}-ai`,
                senderId: 'ai-assistant',
                text: result.reply,
                timestamp: 'Just now',
                users: result.users,
            };
            setMessages(prev => ({
                ...prev,
                [selectedConversation.id]: [...newMessages, assistantMessage],
            }));

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage = {
                id: `msg-${Date.now()}-ai-error`,
                senderId: 'ai-assistant',
                text: 'Sorry, I ran into an error. Please try again.',
                timestamp: 'Just now',
            };
            setMessages(prev => ({
                ...prev,
                [selectedConversation.id]: [...newMessages, errorMessage],
            }));
        } finally {
            setLoading(false);
        }
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages, selectedConversation]);

  const currentMessages = messages[selectedConversation.id] || [];

  return (
    <div className="flex h-[calc(100vh_-_10rem)]">
      {/* Conversation List */}
      <Card className="w-1/3 flex flex-col rounded-r-none">
        <CardHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">Chats</h1>
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <ScrollArea className="flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={cn(
                'flex items-center gap-3 p-3 cursor-pointer hover:bg-muted',
                selectedConversation?.id === conv.id && 'bg-muted'
              )}
              onClick={() => setSelectedConversation(conv)}
            >
              <Avatar>
                {conv.id === 'assistant' ? (
                     <Bot className="h-full w-full p-2 bg-primary text-primary-foreground rounded-full"/>
                ) : (
                    <>
                    <AvatarImage src={conv.participant.avatar} />
                    <AvatarFallback>{conv.participant.name.charAt(0)}</AvatarFallback>
                    </>
                )}
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
                 {selectedConversation.id === 'assistant' ? (
                     <Bot className="h-full w-full p-2 bg-primary text-primary-foreground rounded-full"/>
                ) : (
                    <>
                    <AvatarImage src={selectedConversation.participant.avatar} />
                    <AvatarFallback>{selectedConversation.participant.name.charAt(0)}</AvatarFallback>
                    </>
                )}
              </Avatar>
              <h2 className="text-lg font-semibold">{selectedConversation.participant.name}</h2>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-muted/20" ref={scrollAreaRef}>
              <div className="space-y-6">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2 max-w-[80%]',
                      msg.senderId === 'me' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                    )}
                  >
                     <Avatar className="h-8 w-8">
                        {msg.senderId === 'me' ? (
                            <>
                                <AvatarImage src={userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : ''} />
                                <AvatarFallback>{userProfile?.name?.charAt(0)}</AvatarFallback>
                            </>
                        ) : msg.senderId === 'ai-assistant' ? (
                             <Bot className="h-full w-full p-1.5 bg-primary text-primary-foreground rounded-full"/>
                        ) : (
                           <>
                                <AvatarImage src={selectedConversation.participant?.avatar} />
                                <AvatarFallback>{selectedConversation.participant?.name.charAt(0)}</AvatarFallback>
                           </>
                        )}
                    </Avatar>
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 text-sm shadow-md',
                        msg.senderId === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-background text-foreground rounded-bl-none'
                      )}
                    >
                      <p>{msg.text}</p>
                      {msg.users && msg.users.length > 0 && (
                          <div className="mt-3 space-y-2">
                              {msg.users.map((user: any) => (
                                  <Card key={user.id} className="p-2 bg-background/50">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold text-xs">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.role}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline">Message</Button>
                                      </div>
                                  </Card>
                              ))}
                          </div>
                      )}
                       <p className={cn("text-xs mt-1 text-right", msg.senderId === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground/70' )}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                    <div className="flex items-end gap-2 max-w-[80%] mr-auto">
                        <Avatar className="h-8 w-8">
                             <Bot className="h-full w-full p-1.5 bg-primary text-primary-foreground rounded-full"/>
                        </Avatar>
                         <div className="rounded-lg px-3 py-2 text-sm shadow-md bg-background text-foreground rounded-bl-none flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin"/>
                           <span>Thinking...</span>
                         </div>
                    </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <form className="relative" onSubmit={handleSendMessage}>
                <Input 
                    placeholder="Type a message..." 
                    className="pr-12"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={loading}
                />
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2" type="submit" disabled={loading || !inputValue.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
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
