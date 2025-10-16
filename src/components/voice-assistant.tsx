
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, MicOff, Loader2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { processVoiceCommand } from '@/ai/flows/voice-assistant-flow';

// Declare the SpeechRecognition interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceAssistant() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [spokenResponse, setSpokenResponse] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setSpokenResponse('');
        setIsDialogOpen(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(interimTranscript || finalTranscript);
        if (finalTranscript) {
          handleProcessCommand(finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, []);

  const handleProcessCommand = async (command: string) => {
    if (!command || isProcessing) return;

    setIsProcessing(true);
    setTranscript(command); // Show the final command
    try {
      const result = await processVoiceCommand({ command });
      setSpokenResponse(result.response);
      speak(result.response);

      if (result.intent === 'navigate' && result.target) {
        setTimeout(() => {
          router.push(`/dashboard/${result.target}`);
          setIsDialogOpen(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      const errorMsg = "Sorry, I had trouble understanding that.";
      setSpokenResponse(errorMsg);
      speak(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleToggleListen = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  if (!isMounted || !recognitionRef.current) {
    return null; // Don't render if not mounted or speech recognition is not supported
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleToggleListen}
            className={cn(
              "fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50 transition-colors duration-300",
              isListening ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
            size="icon"
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isListening ? 'Stop Listening' : 'Activate Voice Assistant'}</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot />
              Harvesta Assistant
            </DialogTitle>
            <DialogDescription>
              {isListening && !isProcessing ? "I'm listening..." : isProcessing ? "Thinking..." : "How can I help you today?"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center space-y-4">
            <div className="text-2xl font-semibold h-14">
                {isProcessing && !spokenResponse ? <Loader2 className="h-8 w-8 mx-auto animate-spin" /> : transcript || <span className="text-muted-foreground">...</span>}
            </div>
            {spokenResponse && <p className="text-lg text-primary mt-4">{spokenResponse}</p>}
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
