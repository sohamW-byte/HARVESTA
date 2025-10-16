'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// Mock data, to be replaced with Firebase data
const initialConversations = [
  {
    id: 'assistant',
    name: 'Harvesta Assistant',
    avatar: <Bot className="h-6 w-6" />,
    lastMessage: 'Ask me to find users for you!',
    lastMessageTime: 'AI',
  },
  {
    id: '1',
    name: 'Ramesh Kumar',
    avatar: 'https://picsum.photos/seed/user4/40/40',
    lastMessage: 'Yes, I have 10 quintals of Sona Masoori available.',
    lastMessageTime: '2:45 PM',
  },
  {
    id: '2',
    name: 'Anjali Traders',
    avatar: 'https://picsum.photos/seed/user5/40/40',
    lastMessage: 'Perfect, I will arrange for pickup tomorrow.',
    lastMessageTime: '1:30 PM',
  },
];

const initialMessages: { [key: string]: any[] } = {
  assistant: [
    {
      id: 'a1',
      sender: 'Harvesta Assistant',
      text: "Hello! I'm your Harvesta Assistant. I can help you find other users. Try asking: 'Find a farmer named Ramesh'.",
      isUser: false,
    },
  ],
  '1': [
    { id: 'm1', sender: 'Ramesh Kumar', text: 'Hi, I saw your listing for wheat. Is it still available?', isUser: false },
    { id: 'm2', sender: 'You', text: 'Yes, it is. How much do you need?', isUser: true },
  ],
  '2': [],
};

export default function MessagesPage() {
  const { userProfile } = useAuth();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState(initialConversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: `m${Date.now()}`,
      sender: 'You',
      text: newMessage,
      isUser: true,
    };

    setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMsg]
    }));
    
    setNewMessage('');
    // In a real app, you would also send this message to your backend/Firebase
  };

  return (
    <div className="flex h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.16))]">
      {/* Sidebar with conversations */}
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(convo => (
            <div
              key={convo.id}
              className={cn(
                'flex items-center gap-3 p-4 cursor-pointer hover:bg-muted',
                selectedConversation.id === convo.id && 'bg-muted'
              )}
              onClick={() => setSelectedConversation(convo)}
            >
              <Avatar className="h-10 w-10">
                {typeof convo.avatar === 'string' ? (
                  <>
                    <AvatarImage src={convo.avatar} />
                    <AvatarFallback>{convo.name.charAt(0)}</AvatarFallback>
                  </>
                ) : (
                    <div className='flex items-center justify-center h-full w-full bg-primary text-primary-foreground'>
                        {convo.avatar}
                    </div>
                )}
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold truncate">{convo.name}</p>
                <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
              </div>
              <span className="text-xs text-muted-foreground">{convo.lastMessageTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat window */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {typeof selectedConversation.avatar === 'string' ? (
                  <>
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                  </>
                ) : (
                    <div className='flex items-center justify-center h-full w-full bg-primary text-primary-foreground'>
                        {selectedConversation.avatar}
                    </div>
                )}
              </Avatar>
              <div>
                <p className="font-semibold">{selectedConversation.name}</p>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-slate-50 dark:bg-slate-900">
              <div className="space-y-4">
                {(messages[selectedConversation.id] || []).map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2',
                      msg.isUser ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {!msg.isUser && (
                       <Avatar className="h-8 w-8">
                         {typeof selectedConversation.avatar === 'string' ? (
                           <AvatarImage src={selectedConversation.avatar} />
                         ) : (
                            <div className='flex items-center justify-center h-full w-full bg-primary text-primary-foreground'>
                                {selectedConversation.avatar}
                            </div>
                         )}
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 text-sm',
                        msg.isUser
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-card border rounded-bl-none'
                      )}
                    >
                      <p>{msg.text}</p>
                    </div>
                     {msg.isUser && (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : ''}/>
                         <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-12"
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
