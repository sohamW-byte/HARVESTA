'use client';

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Send, Bot, Loader2, User, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { chat, type ChatOutput } from '@/ai/flows/chat-flow';
import Link from 'next/link';

// Mock data, to be replaced with Firebase data
const initialConversations = [
  {
    id: 'assistant',
    name: 'Harvesta Assistant',
    avatar: <Bot className="h-6 w-6" />,
    lastMessage: 'Ask me anything about farming!',
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
      text: "Hello! I'm your Harvesta Assistant. As an expert agronomist, I can help you with any farming questions. Ask me about crop diseases, market prices, or best practices!",
      isUser: false,
    },
  ],
  '1': [
    { id: 'm1', sender: 'Ramesh Kumar', text: 'Hi, I saw your listing for wheat. Is it still available?', isUser: false },
    { id: 'm2', sender: 'You', text: 'Yes, it is. How much do you need?', isUser: true },
  ],
  '2': [],
};

interface Message {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
  isThinking?: boolean;
  usersFound?: any[]; // Keep for potential future use if user search is re-added
}


export default function MessagesPage() {
  const { userProfile } = useAuth();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] = useState<typeof initialConversations[0] | null>(null);
  const [messages, setMessages] = useState<{[key: string]: Message[]}>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    if (window.innerWidth >= 768) {
        if (!selectedConversation) {
            setSelectedConversation(initialConversations[0]);
        }
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedConversation]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !selectedConversation) return;

    const userMessage: Message = {
      id: `m${Date.now()}`,
      sender: 'You',
      text: newMessage,
      isUser: true,
    };
    
    const currentConvoId = selectedConversation.id;

    setMessages(prev => ({
        ...prev,
        [currentConvoId]: [...(prev[currentConvoId] || []), userMessage]
    }));
    
    const messageToSend = newMessage;
    setNewMessage('');
    
    if (selectedConversation.id === 'assistant') {
      setIsTyping(true);

      const thinkingMessage: Message = {
          id: `t${Date.now()}`,
          sender: 'Harvesta Assistant',
          text: '...',
          isUser: false,
          isThinking: true,
      };

      setMessages(prev => ({
          ...prev,
          [currentConvoId]: [...(prev[currentConvoId] || []), thinkingMessage]
      }));

      try {
        const result = await chat({ message: messageToSend });

        const assistantMessage: Message = {
          id: `a${Date.now()}`,
          sender: 'Harvesta Assistant',
          text: result.reply,
          isUser: false,
        };
        
        setMessages(prev => {
            const updatedMessages = [...(prev[currentConvoId] || [])];
            // Replace the "thinking" message with the actual reply
            const thinkingIndex = updatedMessages.findIndex(m => m.isThinking);
            if (thinkingIndex !== -1) {
                updatedMessages[thinkingIndex] = assistantMessage;
            } else {
                updatedMessages.push(assistantMessage);
            }
            return { ...prev, [currentConvoId]: updatedMessages };
        });

      } catch (error) {
        console.error("Chatbot error:", error);
        const errorMessage: Message = {
            id: `e${Date.now()}`,
            sender: 'Harvesta Assistant',
            text: "Sorry, I ran into an error. Please try again.",
            isUser: false,
        };
         setMessages(prev => {
            const updatedMessages = [...(prev[currentConvoId] || [])];
            const thinkingIndex = updatedMessages.findIndex(m => m.isThinking);
            if (thinkingIndex !== -1) {
                updatedMessages[thinkingIndex] = errorMessage;
            }
            return { ...prev, [currentConvoId]: updatedMessages };
        });
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh_-_theme(spacing.16)_-_theme(spacing.16))] relative">
      {/* Sidebar with conversations */}
      <div className={cn(
        "w-full md:w-1/3 border-r flex flex-col transition-transform duration-300 ease-in-out",
        "md:translate-x-0",
        selectedConversation ? "-translate-x-full" : "translate-x-0"
      )}>
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
                selectedConversation?.id === convo.id && 'bg-muted'
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
      <div className={cn(
        "w-full md:w-2/3 flex flex-col absolute md:static top-0 h-full transition-transform duration-300 ease-in-out",
         "md:translate-x-0",
         selectedConversation ? "translate-x-0" : "translate-x-full"
      )}>
        {selectedConversation ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
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
                      {msg.isThinking ? (
                        <div className="flex items-center gap-2">
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Thinking...</span>
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}

                      {msg.usersFound && msg.usersFound.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-primary-foreground/20 space-y-2">
                            {msg.usersFound.map((user: any) => (
                                <Link key={user.id} href={`/dashboard/profile/${user.id}`} passHref>
                                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-foreground/10 transition-colors">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-sm">{user.name}</p>
                                            <p className="text-xs opacity-80">{user.role}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                          </div>
                      )}
                    </div>
                     {msg.isUser && (
                       <Avatar className="h-8 w-8">
                         <AvatarImage src={userProfile?.id ? `https://i.pravatar.cc/150?u=${userProfile.id}` : ''}/>
                         <AvatarFallback>{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
                       </Avatar>
                    )}
                  </div>
                ))}
                 <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-4 border-t">
              <div className="relative">
                <Input
                  placeholder={selectedConversation.id === 'assistant' ? "Ask the AI assistant..." : "Type a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                  className="pr-12"
                  disabled={isTyping}
                />
                <Button
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isTyping}
                >
                  {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center text-muted-foreground">
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
